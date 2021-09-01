# from keras.layers.core import Layer

# from keras.layers.core import Layer
import tensorflow as tf
import numpy as np
import elasticdeform
# from TF_DirectSN.warp import batch_warp3d


# def Fast3DTransformer(self, inputs):
#     im, flow = inputs
#     if self.padding:
#         im = tf.pad(im, [[0, 0], [1, 1], [1, 1], [1, 1], [0, 0]], "CONSTANT")
#         flow = tf.pad(flow, [[0, 0], [1, 1], [1, 1], [1, 1], [0, 0]], "CONSTANT")
#     warped = tf.user_ops.reconstruction(im, flow)
#     if self.padding:
#         warped = warped[:, 1: -1, 1: -1, 1: -1, :]
#     return warped



def sub2ind(siz, subs, **kwargs):
    """
    assumes column-order major
    """
    # subs is a list
    assert len(siz) == len(subs), 'found inconsistent siz and subs: %d %d' % (len(siz), len(subs))

    k = np.cumprod(siz[::-1])

    ndx = subs[-1]
    for i, v in enumerate(subs[:-1][::-1]):
        ndx = ndx + v * k[i]

    return ndx

class Dense3DSpatialTransformer():
    def __init__(self, padding = False):
        self.padding = padding

    def _transform_spline(self, I, dx, dy, dz):
        batch_size = np.shape(dx)[0]
        height = np.shape(dx)[1]
        width = np.shape(dx)[2]
        depth = np.shape(dx)[3]

        output = []
        for i in range(0,batch_size):
            tmp = elasticdeform.deform_grid(I, np.stack([dx[i,:,:,:], dy[i,:,:,:], dz[i,:,:,:]], axis=0), order=4)
            output.append(tmp)
        output = np.stack(output, axis=0)

        return output


    def _transform(self, I, dx, dy, dz, interp='linear'):
        self.interp = interp
        batch_size = tf.shape(dx)[0]
        height = tf.shape(dx)[1]
        width = tf.shape(dx)[2]
        depth = tf.shape(dx)[3]

        # Convert dx and dy to absolute locations
        x_mesh, y_mesh, z_mesh = self._meshgrid(height, width, depth)
        x_mesh = tf.expand_dims(x_mesh, 0)
        y_mesh = tf.expand_dims(y_mesh, 0)
        z_mesh = tf.expand_dims(z_mesh, 0)

        x_mesh = tf.tile(x_mesh, [batch_size, 1, 1, 1])
        y_mesh = tf.tile(y_mesh, [batch_size, 1, 1, 1])
        z_mesh = tf.tile(z_mesh, [batch_size, 1, 1, 1])
        x_new = dx + x_mesh
        y_new = dy + y_mesh
        z_new = dz + z_mesh

        return self._interpolate(I, x_new, y_new, z_new)

    def _transform_back(self, I, dx, dy, dz, interp='linear'):
        self.interp = interp
        batch_size = tf.shape(dx)[0]
        height = tf.shape(dx)[1]
        width = tf.shape(dx)[2]
        depth = tf.shape(dx)[3]

        # Convert dx and dy to absolute locations
        x_mesh, y_mesh, z_mesh = self._meshgrid(height, width, depth)
        x_mesh = tf.expand_dims(x_mesh, 0)
        y_mesh = tf.expand_dims(y_mesh, 0)
        z_mesh = tf.expand_dims(z_mesh, 0)

        x_mesh = tf.tile(x_mesh, [batch_size, 1, 1, 1])
        y_mesh = tf.tile(y_mesh, [batch_size, 1, 1, 1])
        z_mesh = tf.tile(z_mesh, [batch_size, 1, 1, 1])
        x_new = -dx + x_mesh
        y_new = -dy + y_mesh
        z_new = -dz + z_mesh

        return self._interpolate(I, x_new, y_new, z_new)

    def _repeat(self, x, n_repeats):
        rep = tf.transpose(
            tf.expand_dims(tf.ones(shape=tf.stack([n_repeats, ])), 1), [1, 0])
        rep = tf.cast(rep, dtype='int32')
        x = tf.matmul(tf.reshape(x, (-1, 1)), rep)
        return tf.reshape(x, [-1])

    def _meshgrid(self, height, width, depth):
        x_t = tf.matmul(tf.ones(shape=tf.stack([height, 1])),
                        tf.transpose(tf.expand_dims(tf.linspace(0.0,
                                                                tf.cast(width, tf.float32)-1.0, width), 1), [1, 0]))
        y_t = tf.matmul(tf.expand_dims(tf.linspace(0.0,
                                                   tf.cast(height, tf.float32)-1.0, height), 1),
                        tf.ones(shape=tf.stack([1, width])))

        x_t = tf.tile(tf.expand_dims(x_t, 2), [1, 1, depth])
        y_t = tf.tile(tf.expand_dims(y_t, 2), [1, 1, depth])

        z_t = tf.linspace(0.0, tf.cast(depth, tf.float32)-1.0, depth)
        z_t = tf.expand_dims(tf.expand_dims(z_t, 0), 0)
        z_t = tf.tile(z_t, [height, width, 1])

        return x_t, y_t, z_t

    def _interpolate(self, im, x, y, z):
        if self.padding:
            im = tf.pad(im, [[0, 0], [1, 1], [1, 1], [1, 1], [0, 0]], "CONSTANT")

        num_batch = tf.shape(im)[0]
        height = tf.shape(im)[1]
        width = tf.shape(im)[2]
        depth = tf.shape(im)[3]
        channels = im.get_shape().as_list()[4]

        out_height = tf.shape(x)[1]
        out_width = tf.shape(x)[2]
        out_depth = tf.shape(x)[3]

        x = tf.reshape(x, [-1])
        y = tf.reshape(y, [-1])
        z = tf.reshape(z, [-1])

        padding_constant = 1 if self.padding else 0
        x = tf.cast(x, 'float32') + padding_constant
        y = tf.cast(y, 'float32') + padding_constant
        z = tf.cast(z, 'float32') + padding_constant

        if self.interp == 'linear':
            max_x = tf.cast(width - 1, 'int32')
            max_y = tf.cast(height - 1, 'int32')
            max_z = tf.cast(depth - 1, 'int32')

            x0 = tf.cast(tf.floor(x), 'int32')
            x1 = x0 + 1
            y0 = tf.cast(tf.floor(y), 'int32')
            y1 = y0 + 1
            z0 = tf.cast(tf.floor(z), 'int32')
            z1 = z0 + 1

            x0 = tf.clip_by_value(x0, 0, max_x)
            x1 = tf.clip_by_value(x1, 0, max_x)
            y0 = tf.clip_by_value(y0, 0, max_y)
            y1 = tf.clip_by_value(y1, 0, max_y)
            z0 = tf.clip_by_value(z0, 0, max_z)
            z1 = tf.clip_by_value(z1, 0, max_z)

            dim3 = depth
            dim2 = depth*width
            dim1 = depth*width*height
            base = self._repeat(tf.range(num_batch)*dim1,
                                out_height*out_width*out_depth)

            base_y0 = base + y0*dim2
            base_y1 = base + y1*dim2

            idx_a = base_y0 + x0*dim3 + z0
            idx_b = base_y1 + x0*dim3 + z0
            idx_c = base_y0 + x1*dim3 + z0
            idx_d = base_y1 + x1*dim3 + z0
            idx_e = base_y0 + x0*dim3 + z1
            idx_f = base_y1 + x0*dim3 + z1
            idx_g = base_y0 + x1*dim3 + z1
            idx_h = base_y1 + x1*dim3 + z1

            # use indices to lookup pixels in the flat image and restore
            # channels dim
            im_flat = tf.reshape(im, tf.stack([-1, channels]))
            im_flat = tf.cast(im_flat, 'float32')

            Ia = tf.gather(im_flat, idx_a)
            Ib = tf.gather(im_flat, idx_b)
            Ic = tf.gather(im_flat, idx_c)
            Id = tf.gather(im_flat, idx_d)
            Ie = tf.gather(im_flat, idx_e)
            If = tf.gather(im_flat, idx_f)
            Ig = tf.gather(im_flat, idx_g)
            Ih = tf.gather(im_flat, idx_h)

            # and finally calculate interpolated values
            x1_f = tf.cast(x1, 'float32')
            y1_f = tf.cast(y1, 'float32')
            z1_f = tf.cast(z1, 'float32')

            dx = x1_f - x
            dy = y1_f - y
            dz = z1_f - z

            wa = tf.expand_dims((dz * dx * dy), 1)
            wb = tf.expand_dims((dz * dx * (1-dy)), 1)
            wc = tf.expand_dims((dz * (1-dx) * dy), 1)
            wd = tf.expand_dims((dz * (1-dx) * (1-dy)), 1)
            we = tf.expand_dims(((1-dz) * dx * dy), 1)
            wf = tf.expand_dims(((1-dz) * dx * (1-dy)), 1)
            wg = tf.expand_dims(((1-dz) * (1-dx) * dy), 1)
            wh = tf.expand_dims(((1-dz) * (1-dx) * (1-dy)), 1)

            output = tf.add_n([wa*Ia, wb*Ib, wc*Ic, wd*Id,
                               we*Ie, wf*If, wg*Ig, wh*Ih])
            output = tf.reshape(output, tf.stack(
                [-1, out_height, out_width, out_depth, channels]))
        else:
            roundx = tf.cast(tf.round(y), 'int32')
            roundy = tf.cast(tf.round(x), 'int32')
            roundz = tf.cast(tf.round(z), 'int32')

            # clip values
            max_x = tf.cast(height - 1, 'int32')
            max_y = tf.cast(width - 1, 'int32')
            max_z = tf.cast(depth - 1, 'int32')

            roundx = tf.clip_by_value(roundx, 0, max_x)
            roundy = tf.clip_by_value(roundy, 0, max_y)
            roundz = tf.clip_by_value(roundz, 0, max_z)

            # get values
            # tf stacking is slow. replace with gather
            # roundloc = tf.stack(roundloc, axis=-1)
            # interp_vol = tf.gather_nd(vol, roundloc)
            idx = sub2ind(im.shape[1:-1], [roundx, roundy, roundz])
            output = tf.gather(tf.reshape(im, [-1, im.shape[-1]]), idx)
            output = tf.reshape(output, [num_batch, height, width, depth, channels])


        return output

    # def _interpolate_spline(self, im, x, y, z):
    #     if self.padding:
    #         im = np.pad(im, [[0, 0], [1, 1], [1, 1], [1, 1], [0, 0]], "CONSTANT")
    #
    #     num_batch = np.shape(im)[0]
    #     height = np.shape(im)[1]
    #     width = np.shape(im)[2]
    #     depth = np.shape(im)[3]
    #     channels = np.shape(im)[4]
    #
    #     out_height = np.shape(x)[1]
    #     out_width = np.shape(x)[2]
    #     out_depth = np.shape(x)[3]
    #
    #     x = tf.reshape(x, [-1])
    #     y = tf.reshape(y, [-1])
    #     z = tf.reshape(z, [-1])
    #
    #     padding_constant = 1 if self.padding else 0
    #     x = tf.cast(x, 'float32') + padding_constant
    #     y = tf.cast(y, 'float32') + padding_constant
    #     z = tf.cast(z, 'float32') + padding_constant
    #
    #
    #     return output


def affine_flow(W, b, len1, len2, len3):
    b = tf.reshape(b, [-1, 1, 1, 1, 3])
    xr = tf.range(-(len1 - 1) / 2.0, len1 / 2.0, 1.0, tf.float32)
    xr = tf.reshape(xr, [1, -1, 1, 1, 1])
    yr = tf.range(-(len2 - 1) / 2.0, len2 / 2.0, 1.0, tf.float32)
    yr = tf.reshape(yr, [1, 1, -1, 1, 1])
    zr = tf.range(-(len3 - 1) / 2.0, len3 / 2.0, 1.0, tf.float32)
    zr = tf.reshape(zr, [1, 1, 1, -1, 1])
    wx = W[:, :, 0]
    wx = tf.reshape(wx, [-1, 1, 1, 1, 3])
    wy = W[:, :, 1]
    wy = tf.reshape(wy, [-1, 1, 1, 1, 3])
    wz = W[:, :, 2]
    wz = tf.reshape(wz, [-1, 1, 1, 1, 3])
    return (xr * wx + yr * wy) + (zr * wz + b)

def det3x3(M):
    M = [[M[:, i, j] for j in range(3)] for i in range(3)]
    return tf.add_n([
                M[0][0] * M[1][1] * M[2][2],
                M[0][1] * M[1][2] * M[2][0],
                M[0][2] * M[1][0] * M[2][1]
            ]) - tf.add_n([
                M[0][0] * M[1][2] * M[2][1],
                M[0][1] * M[1][0] * M[2][2],
                M[0][2] * M[1][1] * M[2][0]
            ])


def convolve(opName, inputLayer, outputChannel, kernelSize, stride, stddev=1e-2, reuse=False, weights_init='uniform_scaling'):
    return tf.layers.conv3d(inputLayer, outputChannel, kernelSize, strides=stride,
                                  padding='same', activation='linear', name=opName, reuse=reuse, kernel_initializer=tf.contrib.layers.xavier_initializer())


def convolveLeakyReLU(opName, inputLayer, outputChannel, kernelSize, stride, alpha=0.1, stddev=1e-2, reuse=False):
    return tf.nn.leaky_relu(convolve(opName, inputLayer,
                              outputChannel,
                              kernelSize, stride, stddev, reuse),
                     alpha, opName+'_leakilyrectified')


def VTNAffineStem(img1, img2, flow_multiplier=1.):
    '''
        img1, img2, flow : tensor of shape [batch, X, Y, Z, C]
    '''
    concatImgs = tf.concat([img1, img2], 4, 'coloncatImgs')
    concatImgs = tf.pad(concatImgs, [[0,0],[8,8],[8,8],[8,8],[0,0]], "constant")
    #
    dims = 3
    conv1 = convolveLeakyReLU(
        'conv1',   concatImgs, 16,   3, 2)  # 64 * 64 * 64
    conv2 = convolveLeakyReLU(
        'conv2',   conv1,      32,   3, 2)  # 32 * 32 * 32
    conv3 = convolveLeakyReLU('conv3',   conv2,      64,   3, 2)
    conv3_1 = convolveLeakyReLU(
        'conv3_1', conv3,      64,   3, 1)
    conv4 = convolveLeakyReLU(
        'conv4',   conv3_1,    128,  3, 2)  # 16 * 16 * 16
    conv4_1 = convolveLeakyReLU(
        'conv4_1', conv4,      128,  3, 1)
    conv5 = convolveLeakyReLU(
        'conv5',   conv4_1,    256,  3, 2)  # 8 * 8 * 8
    conv5_1 = convolveLeakyReLU(
        'conv5_1', conv5,      256,  3, 1)
    conv6 = convolveLeakyReLU(
        'conv6',   conv5_1,    512,  3, 2)  # 4 * 4 * 4
    conv6_1 = convolveLeakyReLU(
        'conv6_1', conv6,      512,  3, 1)
    ks = conv6_1.shape.as_list()[1:4]
    conv7_W = tf.layers.conv3d(
        conv6_1, 9, ks, strides=1, padding='valid', use_bias=False, name='conv7_W')
    conv7_b = tf.layers.conv3d(
        conv6_1, 3, ks, strides=1, padding='valid', use_bias=False, name='conv7_b')

    I = [[[1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 1.0]]]
    W = tf.reshape(conv7_W, [-1, 3, 3]) * flow_multiplier
    b = tf.reshape(conv7_b, [-1, 3]) * flow_multiplier
    A = W + I
    # the flow is displacement(x) = place(x) - x = (Ax + b) - x
    # the model learns W = A - I.

    sx, sy, sz = concatImgs.shape.as_list()[1:4]
    osx, osy, osz = img1.shape.as_list()[1:4]
    flow = affine_flow(W, b, sx, sy, sz)
    flow = flow[:,8:8+osx,8:8+osy,8:8+osz,:]
    # determinant should be close to 1
    det = det3x3(A)
    det_loss = tf.nn.l2_loss(det - 1.0)
    # should be close to being orthogonal
    # C=A'A, a positive semi-definite matrix
    # should be close to I. For this, we require C
    # has eigen values close to 1 by minimizing
    # k1+1/k1+k2+1/k2+k3+1/k3.
    # to prevent NaN, minimize
    # k1+eps + (1+eps)^2/(k1+eps) + ...
    eps = 1e-5
    epsI = [[[eps * elem for elem in row] for row in Mat] for Mat in I]
    C = tf.matmul(A, A, True) + epsI

    def elem_sym_polys_of_eigen_values(M):
        M = [[M[:, i, j] for j in range(3)] for i in range(3)]
        sigma1 = tf.add_n([M[0][0], M[1][1], M[2][2]])
        sigma2 = tf.add_n([
            M[0][0] * M[1][1],
            M[1][1] * M[2][2],
            M[2][2] * M[0][0]
        ]) - tf.add_n([
            M[0][1] * M[1][0],
            M[1][2] * M[2][1],
            M[2][0] * M[0][2]
        ])
        sigma3 = tf.add_n([
            M[0][0] * M[1][1] * M[2][2],
            M[0][1] * M[1][2] * M[2][0],
            M[0][2] * M[1][0] * M[2][1]
        ]) - tf.add_n([
            M[0][0] * M[1][2] * M[2][1],
            M[0][1] * M[1][0] * M[2][2],
            M[0][2] * M[1][1] * M[2][0]
        ])
        return sigma1, sigma2, sigma3

    s1, s2, s3 = elem_sym_polys_of_eigen_values(C)
    ortho_loss = s1 + (1 + eps) * (1 + eps) * s2 / s3 - 3 * 2 * (1 + eps)
    ortho_loss = tf.reduce_sum(ortho_loss)

    return {
        'flow': flow,
        'W': W,
        'b': b,
        'det_loss': det_loss,
        'ortho_loss': ortho_loss
    }

def VTNAffineStem_train(img1, img2, flow_multiplier=1.):
    '''
        img1, img2, flow : tensor of shape [batch, X, Y, Z, C]
    '''
    concatImgs = tf.concat([img1, img2], 4, 'coloncatImgs')
    concatImgs = tf.pad(concatImgs, [[0,0],[8,8],[8,8],[8,8],[0,0]], "constant")

    dims = 3
    conv1 = convolveLeakyReLU(
        'conv1',   concatImgs, 16,   3, 2)  # 64 * 64 * 64
    conv1 = tf.nn.dropout(conv1, rate=0.1)
    conv2 = convolveLeakyReLU(
        'conv2',   conv1,      32,   3, 2)  # 32 * 32 * 32
    conv2 = tf.nn.dropout(conv2, rate=0.1)
    conv3 = convolveLeakyReLU('conv3',   conv2,      64,   3, 2)
    conv3 = tf.nn.dropout(conv3, rate=0.1)
    conv3_1 = convolveLeakyReLU(
        'conv3_1', conv3,      64,   3, 1)
    conv3_1 = tf.nn.dropout(conv3_1, rate=0.1)
    conv4 = convolveLeakyReLU(
        'conv4',   conv3_1,    128,  3, 2)  # 16 * 16 * 16
    conv4 = tf.nn.dropout(conv4, rate=0.1)
    conv4_1 = convolveLeakyReLU(
        'conv4_1', conv4,      128,  3, 1)
    conv4_1 = tf.nn.dropout(conv4_1, rate=0.1)
    conv5 = convolveLeakyReLU(
        'conv5',   conv4_1,    256,  3, 2)  # 8 * 8 * 8
    conv5 = tf.nn.dropout(conv5, rate=0.1)
    conv5_1 = convolveLeakyReLU(
        'conv5_1', conv5,      256,  3, 1)
    conv5_1 = tf.nn.dropout(conv5_1, rate=0.1)
    conv6 = convolveLeakyReLU(
        'conv6',   conv5_1,    512,  3, 2)  # 4 * 4 * 4
    conv6 = tf.nn.dropout(conv6, rate=0.1)
    conv6_1 = convolveLeakyReLU(
        'conv6_1', conv6,      512,  3, 1)
    conv6_1 = tf.nn.dropout(conv6_1, rate=0.1)
    ks = conv6_1.shape.as_list()[1:4]
    conv7_W = tf.layers.conv3d(
        conv6_1, 9, ks, strides=1, padding='valid', use_bias=False, name='conv7_W')
    conv7_b = tf.layers.conv3d(
        conv6_1, 3, ks, strides=1, padding='valid', use_bias=False, name='conv7_b')

    I = [[[1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 1.0]]]
    W = tf.reshape(conv7_W, [-1, 3, 3]) * flow_multiplier
    b = tf.reshape(conv7_b, [-1, 3]) * flow_multiplier
    A = W + I
    # the flow is displacement(x) = place(x) - x = (Ax + b) - x
    # the model learns W = A - I.

    sx, sy, sz = concatImgs.shape.as_list()[1:4]
    osx, osy, osz = img1.shape.as_list()[1:4]
    flow = affine_flow(W, b, sx, sy, sz)
    flow = flow[:,8:8+osx,8:8+osy,8:8+osz,:]
    # determinant should be close to 1
    det = det3x3(A)
    det_loss = tf.nn.l2_loss(det - 1.0)
    # should be close to being orthogonal
    # C=A'A, a positive semi-definite matrix
    # should be close to I. For this, we require C
    # has eigen values close to 1 by minimizing
    # k1+1/k1+k2+1/k2+k3+1/k3.
    # to prevent NaN, minimize
    # k1+eps + (1+eps)^2/(k1+eps) + ...
    eps = 1e-5
    epsI = [[[eps * elem for elem in row] for row in Mat] for Mat in I]
    C = tf.matmul(A, A, True) + epsI

    def elem_sym_polys_of_eigen_values(M):
        M = [[M[:, i, j] for j in range(3)] for i in range(3)]
        sigma1 = tf.add_n([M[0][0], M[1][1], M[2][2]])
        sigma2 = tf.add_n([
            M[0][0] * M[1][1],
            M[1][1] * M[2][2],
            M[2][2] * M[0][0]
        ]) - tf.add_n([
            M[0][1] * M[1][0],
            M[1][2] * M[2][1],
            M[2][0] * M[0][2]
        ])
        sigma3 = tf.add_n([
            M[0][0] * M[1][1] * M[2][2],
            M[0][1] * M[1][2] * M[2][0],
            M[0][2] * M[1][0] * M[2][1]
        ]) - tf.add_n([
            M[0][0] * M[1][2] * M[2][1],
            M[0][1] * M[1][0] * M[2][2],
            M[0][2] * M[1][1] * M[2][0]
        ])
        return sigma1, sigma2, sigma3

    s1, s2, s3 = elem_sym_polys_of_eigen_values(C)
    ortho_loss = s1 + (1 + eps) * (1 + eps) * s2 / s3 - 3 * 2 * (1 + eps)
    ortho_loss = tf.reduce_sum(ortho_loss)

    return {
        'flow': flow,
        'W': W,
        'b': b,
        'det_loss': det_loss,
        'ortho_loss': ortho_loss
    }
