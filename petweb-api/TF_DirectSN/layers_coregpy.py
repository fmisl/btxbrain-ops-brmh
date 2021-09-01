## django integration setting
# from django.conf import settings
import tensorflow as tf
from TF_DirectSN.utils import Dense3DSpatialTransformer
# import TF_DirectSN.inputs as inp
from scipy.ndimage.filters import gaussian_filter

import time

import math
import numpy as np
import os

import random

import scipy.ndimage

FLAGS = tf.flags.FLAGS
tf.flags.DEFINE_integer('batch_size', 1,
                            """Number of images to process in a batch.""")
tf.flags.DEFINE_integer('batch_size_eval', 1,
                            """Number of images to process in a batch.""")
tf.flags.DEFINE_string('data_dir1', '.\testing\TF_DirectSN\dataset_withSeg',
                           """Path to the training data directory.""")
tf.flags.DEFINE_string('data_dir2', 'E:\\RT_HJAn\\trainset_cycGAN_CTw',
                           """Path to the training data directory.""")

init_learning_rate = 1e-3

# def distorted_inputs(training):
#
#     data_dir1 = os.path.join(FLAGS.data_dir1)
#
#     img_cls = inp.ImageData(data_path1=data_dir1)
#     train_dataset_num = len(img_cls.data_path1)
#
#     train_dataset = tf.data.Dataset.from_tensor_slices(img_cls.data_path1)
#
#     gpu_device = '/gpu:0'
#     train_dataset = train_dataset. \
#         apply(tf.contrib.data.shuffle_and_repeat(train_dataset_num)). \
#         apply(
#         tf.contrib.data.map_and_batch(img_cls.image_processing_input, FLAGS.batch_size, num_parallel_batches=8, drop_remainder=True)). \
#         apply(tf.contrib.data.prefetch_to_device(gpu_device, FLAGS.batch_size))
#
#     train_dataset_iterator = train_dataset.make_one_shot_iterator()
#
#     xlr, xhr, filename = train_dataset_iterator.get_next()
#
#     if training == True:
#         return xlr, xhr
#     else:
#         return xlr, xhr, filename

# def inputs_eval(tdata_dir):
#     [out1, out2, out3, maxi, ok] = inp.eval_inputs(data_dir=tdata_dir, batch_size=FLAGS.batch_size_eval)
#     return out1, out2, out3, maxi, ok
#
# def distorted_inputs():
#     data_dir1 = os.path.join(FLAGS.data_dir1)
#     [xlr, xhr, seg] = inp.distorted_inputs(data_dir=data_dir1, batch_size=FLAGS.batch_size)
#     return xlr, xhr, seg
    # dataset = inp.distorted_inputs(data_dir=[data_dir1, data_dir2], batch_size=FLAGS.batch_size)
    # return dataset

def _activation_image_3d(x, slice, name):
    x_out = x[0, slice, :, :, 0]
    for i in range(1, x.shape.as_list()[-1]):
        x_out = tf.concat([x_out, x[0, slice, :, :, i]], 0)
    tf.summary.image(name,
                     tf.expand_dims(tf.expand_dims(x_out, -1), 0) , max_outputs=1)

def _activation_image_3d_2(x, slice, name):
    x_out = x[0, :, slice, :, 0]
    for i in range(1, x.shape.as_list()[-1]):
        x_out = tf.concat([x_out, x[0, :, slice, :, i]], 0)
    tf.summary.image(name,
                     tf.expand_dims(tf.expand_dims(x_out, -1), 0) , max_outputs=1)


def _activation_image_2d(x, slice, name):
    x_out = x[0, :, :, slice]
    tf.summary.image(name,
                     tf.expand_dims(tf.expand_dims(x_out, -1), 0), max_outputs=1)

def _gaussian_kernel(kernel_size, sigma):
    x = tf.range(-kernel_size // 2 + 1, kernel_size // 2 + 1, dtype=tf.float32)
    g = tf.math.exp(-(tf.pow(x, 2) / (2 * tf.pow(tf.cast(sigma, tf.float32), 2))))
    g_norm2d = tf.pow(tf.reduce_sum(g), 3)
    g_kernel = tf.tensordot(tf.tensordot(g, g, axes=0), g, axes=0) / g_norm2d
    g_kernel = tf.expand_dims(tf.expand_dims(g_kernel, axis=-1),axis=-1)
    return tf.tile(g_kernel,[1,1,1,3,3])

def apply_blur(img, blur):
    # blur = _gaussian_kernel(3, 2, 3, img.dtype)
    img = tf.nn.conv3d(img, blur, [1,1,1,1,1], 'SAME')
    return img


def affine_intf(tensor1,tensor2,tensor3, dim1,dim2,dim3, ranth1, ranth2, ranth3, alpha, sigma, rndx, rndy, rndz):

    thx = np.pi * ranth1 / 180
    thy = np.pi * ranth2 / 180
    thz = np.pi * ranth3 / 180
    rx = np.array([[1, 0, 0, 0], [0, math.cos(thx), -math.sin(thx), 0],
                   [0, math.sin(thx), math.cos(thx), 0], [0, 0, 0, 1]])
    ry = np.array([[math.cos(thy), 0, math.sin(thy), 0], [0, 1, 0, 0],
                   [-math.sin(thy), 0, math.cos(thy), 0], [0, 0, 0, 1]])
    rz = np.array([[math.cos(thz), -math.sin(thz), 0, 0], [math.sin(thz), math.cos(thz), 0, 0],
                   [0, 0, 1, 0], [0, 0, 0, 1]])

    rxm = np.array([[1, 0, 0, 0], [0, math.cos(-thx), -math.sin(-thx), 0],
                    [0, math.sin(-thx), math.cos(-thx), 0], [0, 0, 0, 1]])
    rym = np.array([[math.cos(-thy), 0, math.sin(thy), 0], [0, 1, 0, 0],
                    [-math.sin(-thy), 0, math.cos(-thy), 0], [0, 0, 0, 1]])
    rzm = np.array([[math.cos(-thz), -math.sin(-thz), 0, 0], [math.sin(-thz), math.cos(-thz), 0, 0],
                    [0, 0, 1, 0], [0, 0, 0, 1]])
    #
    # rxm = np.transpose(rxm)
    # rym = np.transpose(rym)
    # rzm = np.transpose(rzm)

    rxy1 = np.dot(rx, ry)
    rxy2 = np.dot(rx, rym)
    rxy3 = np.dot(rxm, ry)
    rxy4 = np.dot(rxm, rym)

    ryz1 = np.dot(ry, rz)
    ryz2 = np.dot(ry, rzm)
    ryz3 = np.dot(rym, rz)
    ryz4 = np.dot(rym, rzm)

    rzx1 = np.dot(rz, rx)
    rzx2 = np.dot(rz, rxm)
    rzx3 = np.dot(rzm, rx)
    rzx4 = np.dot(rzm, rxm)

    rxyz1 = np.dot(np.dot(rx, ry), rz)
    rxyz2 = np.dot(np.dot(rxm, ry), rz)
    rxyz3 = np.dot(np.dot(rxm, rym), rz)
    rxyz4 = np.dot(np.dot(rxm, rym), rzm)
    rxyz5 = np.dot(np.dot(rx, rym), rzm)
    rxyz6 = np.dot(np.dot(rxm, ry), rzm)

    ax = np.arange(dim1)
    ay = np.arange(dim2)
    az = np.arange(dim3)

    coords = np.meshgrid(ay, ax, az)
    xyz = np.vstack([coords[0].reshape(-1) - float(dim1) / 2,  # x coordinate, centered
                     coords[1].reshape(-1) - float(dim2) / 2,  # y coordinate, centered
                     coords[2].reshape(-1) - float(dim3) / 2,  # z coordinate, centered
                     np.ones((dim1, dim2, dim3)).reshape(-1)])

    transformed_xyz0 = np.dot(np.identity(4), xyz)

    transformed_xyz1 = np.dot(rxy1, xyz)
    transformed_xyz2 = np.dot(rxy2, xyz)
    transformed_xyz3 = np.dot(rxy3, xyz)
    transformed_xyz4 = np.dot(rxy4, xyz)

    transformed_xyz5 = np.dot(ryz1, xyz)
    transformed_xyz6 = np.dot(ryz2, xyz)
    transformed_xyz7 = np.dot(ryz3, xyz)
    transformed_xyz8 = np.dot(ryz4, xyz)

    transformed_xyz9 = np.dot(rzx1, xyz)
    transformed_xyz10 = np.dot(rzx2, xyz)
    transformed_xyz11 = np.dot(rzx3, xyz)
    transformed_xyz12 = np.dot(rzx4, xyz)

    transformed_xyz13 = np.dot(rxyz1, xyz)
    transformed_xyz14 = np.dot(rxyz2, xyz)
    transformed_xyz15 = np.dot(rxyz3, xyz)
    transformed_xyz16 = np.dot(rxyz4, xyz)
    transformed_xyz17 = np.dot(rxyz5, xyz)
    transformed_xyz18 = np.dot(rxyz6, xyz)

    transformed_xyz19 = np.dot(rx, xyz)
    transformed_xyz20 = np.dot(ry, xyz)
    transformed_xyz21 = np.dot(rz, xyz)

    transformed_xyz22 = np.dot(rxm, xyz)
    transformed_xyz23 = np.dot(rym, xyz)
    transformed_xyz24 = np.dot(rzm, xyz)

    x0 = transformed_xyz0[0, :] + float(dim1) / 2
    y0 = transformed_xyz0[1, :] + float(dim2) / 2
    z0 = transformed_xyz0[2, :] + float(dim3) / 2

    x1 = transformed_xyz1[0, :] + float(dim1) / 2
    y1 = transformed_xyz1[1, :] + float(dim2) / 2
    z1 = transformed_xyz1[2, :] + float(dim3) / 2

    x2 = transformed_xyz2[0, :] + float(dim1) / 2
    y2 = transformed_xyz2[1, :] + float(dim2) / 2
    z2 = transformed_xyz2[2, :] + float(dim3) / 2

    x3 = transformed_xyz3[0, :] + float(dim1) / 2
    y3 = transformed_xyz3[1, :] + float(dim2) / 2
    z3 = transformed_xyz3[2, :] + float(dim3) / 2

    x4 = transformed_xyz4[0, :] + float(dim1) / 2
    y4 = transformed_xyz4[1, :] + float(dim2) / 2
    z4 = transformed_xyz4[2, :] + float(dim3) / 2

    x5 = transformed_xyz5[0, :] + float(dim1) / 2
    y5 = transformed_xyz5[1, :] + float(dim2) / 2
    z5 = transformed_xyz5[2, :] + float(dim3) / 2

    x6 = transformed_xyz6[0, :] + float(dim1) / 2
    y6 = transformed_xyz6[1, :] + float(dim2) / 2
    z6 = transformed_xyz6[2, :] + float(dim3) / 2

    x7 = transformed_xyz7[0, :] + float(dim1) / 2
    y7 = transformed_xyz7[1, :] + float(dim2) / 2
    z7 = transformed_xyz7[2, :] + float(dim3) / 2

    x8 = transformed_xyz8[0, :] + float(dim1) / 2
    y8 = transformed_xyz8[1, :] + float(dim2) / 2
    z8 = transformed_xyz8[2, :] + float(dim3) / 2

    x9 = transformed_xyz9[0, :] + float(dim1) / 2
    y9 = transformed_xyz9[1, :] + float(dim2) / 2
    z9 = transformed_xyz9[2, :] + float(dim3) / 2

    x10 = transformed_xyz10[0, :] + float(dim1) / 2
    y10 = transformed_xyz10[1, :] + float(dim2) / 2
    z10 = transformed_xyz10[2, :] + float(dim3) / 2

    x11 = transformed_xyz11[0, :] + float(dim1) / 2
    y11 = transformed_xyz11[1, :] + float(dim2) / 2
    z11 = transformed_xyz11[2, :] + float(dim3) / 2

    x12 = transformed_xyz12[0, :] + float(dim1) / 2
    y12 = transformed_xyz12[1, :] + float(dim2) / 2
    z12 = transformed_xyz12[2, :] + float(dim3) / 2

    x13 = transformed_xyz13[0, :] + float(dim1) / 2
    y13 = transformed_xyz13[1, :] + float(dim2) / 2
    z13 = transformed_xyz13[2, :] + float(dim3) / 2

    x14 = transformed_xyz14[0, :] + float(dim1) / 2
    y14 = transformed_xyz14[1, :] + float(dim2) / 2
    z14 = transformed_xyz14[2, :] + float(dim3) / 2

    x15 = transformed_xyz15[0, :] + float(dim1) / 2
    y15 = transformed_xyz15[1, :] + float(dim2) / 2
    z15 = transformed_xyz15[2, :] + float(dim3) / 2

    x16 = transformed_xyz16[0, :] + float(dim1) / 2
    y16 = transformed_xyz16[1, :] + float(dim2) / 2
    z16 = transformed_xyz16[2, :] + float(dim3) / 2

    x17 = transformed_xyz17[0, :] + float(dim1) / 2
    y17 = transformed_xyz17[1, :] + float(dim2) / 2
    z17 = transformed_xyz17[2, :] + float(dim3) / 2

    x18 = transformed_xyz18[0, :] + float(dim1) / 2
    y18 = transformed_xyz18[1, :] + float(dim2) / 2
    z18 = transformed_xyz18[2, :] + float(dim3) / 2

    x19 = transformed_xyz19[0, :] + float(dim1) / 2
    y19 = transformed_xyz19[1, :] + float(dim2) / 2
    z19 = transformed_xyz19[2, :] + float(dim3) / 2

    x20 = transformed_xyz20[0, :] + float(dim1) / 2
    y20 = transformed_xyz20[1, :] + float(dim2) / 2
    z20 = transformed_xyz20[2, :] + float(dim3) / 2

    x21 = transformed_xyz21[0, :] + float(dim1) / 2
    y21 = transformed_xyz21[1, :] + float(dim2) / 2
    z21 = transformed_xyz21[2, :] + float(dim3) / 2

    x22 = transformed_xyz22[0, :] + float(dim1) / 2
    y22 = transformed_xyz22[1, :] + float(dim2) / 2
    z22 = transformed_xyz22[2, :] + float(dim3) / 2

    x23 = transformed_xyz23[0, :] + float(dim1) / 2
    y23 = transformed_xyz23[1, :] + float(dim2) / 2
    z23 = transformed_xyz23[2, :] + float(dim3) / 2

    x24 = transformed_xyz24[0, :] + float(dim1) / 2
    y24 = transformed_xyz24[1, :] + float(dim2) / 2
    z24 = transformed_xyz24[2, :] + float(dim3) / 2

    ran = random.randrange(0, 25)

    x = eval('x' + str(ran) + '.reshape([dim1,dim2,dim3])')
    y = eval('y' + str(ran) + '.reshape([dim1,dim2,dim3])')
    z = eval('z' + str(ran) + '.reshape([dim1,dim2,dim3])')
    # new_xyz = [y, x, z]

    dx = gaussian_filter((rndx * 2 - 1), sigma) * alpha
    dy = gaussian_filter((rndy * 2 - 1), sigma) * alpha
    dz = gaussian_filter((rndz * 2 - 1), sigma) * alpha

    x, y, z = np.meshgrid(np.arange(112), np.arange(112), np.arange(112))
    new_xyz = [y+dy, x+dx, z+dz]

    # # new_xyz = [y1, x1, z1]
    t_new_vol1 = scipy.ndimage.map_coordinates(tensor1, (new_xyz))
    t_new_vol2 = scipy.ndimage.map_coordinates(tensor2, (new_xyz))
    t_new_vol3 = scipy.ndimage.map_coordinates(tensor3, (new_xyz))
    # t_new_vol1 = tf.py_func(scipy.ndimage.map_coordinates, [tensor1, tf.convert_to_tensor(np.asarray(new_xyz))], tf.float32)
    # t_new_vol2 = tf.py_func(scipy.ndimage.map_coordinates, [tensor2, tf.convert_to_tensor(np.asarray(new_xyz))], tf.float32)

    return t_new_vol1.astype(dtype=np.float32), t_new_vol2.astype(dtype=np.float32), t_new_vol3.astype(dtype=np.float32)



def l2_norm(v, eps=1e-12):
    return v / (tf.reduce_sum(v ** 2) ** 0.5 + eps)

def spectral_norm(w, iteration=1):
   w_shape = w.shape.as_list()
   w = tf.reshape(w, [-1, w_shape[-1]])

   u = tf.get_variable("u", [1, w_shape[-1]], initializer=tf.truncated_normal_initializer(), trainable=False)

   u_hat = u
   v_hat = None
   for i in range(iteration):
       v_ = tf.matmul(u_hat, tf.transpose(w))
       v_hat = l2_norm(v_)

       u_ = tf.matmul(v_hat, w)
       u_hat = l2_norm(u_)

   sigma = tf.matmul(tf.matmul(v_hat, w), tf.transpose(u_hat))
   w_norm = w / sigma

   with tf.control_dependencies([u.assign(u_hat)]):
       w_norm = tf.reshape(w_norm, w_shape)

   return w_norm

def instance_norm(x, scope='instance_norm'):
    return tf.contrib.layers.instance_norm(x, scope=scope)

#----------------------------------------------------------------------------
# Get/create weight tensor for a convolutional or fully-connected layer.

def get_weight(shape, gain=np.sqrt(2)):
    fan_in = np.prod(shape[:-1]) # [kernel, kernel, fmaps_in, fmaps_out] or [in, out]
    std = gain / np.sqrt(fan_in) # He init
    w = tf.get_variable('weight', shape=shape, initializer=tf.initializers.random_normal(0, std))
    return w

#----------------------------------------------------------------------------
# Convolutional layer.

def apply_bias(x):
    b = tf.get_variable('bias', shape=[x.shape[1]], initializer=tf.initializers.zeros())
    b = tf.cast(b, x.dtype)
    if len(x.shape) == 2:
        return x + b
    return x + tf.reshape(b, [1, -1, 1, 1])

def conv2d_bias(x, fmaps, kernel, gain=np.sqrt(2)):
    assert kernel >= 1 and kernel % 2 == 1
    w = get_weight([kernel, kernel, x.shape[1].value, fmaps], gain=gain)
    w = tf.cast(w, x.dtype)
    return apply_bias(tf.nn.conv2d(x, w, strides=[1,1,1,1], padding='SAME', data_format='NCHW'))

def conv3d_bias_spectral(x, filter, kernel, stride=1, use_bias=True, padding='SAME', layer_name="spectral_conv"):
    with tf.variable_scope(layer_name):
        w = tf.get_variable("kernel", shape=[kernel, kernel, kernel, x.shape[4].value, filter], initializer=tf.contrib.layers.xavier_initializer(), regularizer=None)
        bias = tf.get_variable("bias", [filter], initializer=tf.constant_initializer(0.0))
        x = tf.nn.conv3d(input=x, filter=w,  strides=[1, stride, stride, stride, 1], padding=padding)
        if use_bias:
            x = tf.nn.bias_add(x, bias)
    return x

def conv3d_bias_spectral_up(x, filter, kernel, stride=1, use_bias=True, padding='SAME', layer_name="spectral_conv"):
    xdim = x.get_shape().as_list()
    with tf.variable_scope(layer_name):
        w = tf.get_variable("kernel", shape=[kernel, kernel, kernel, filter, x.shape[4].value], initializer=tf.contrib.layers.xavier_initializer(), regularizer=None)
        bias = tf.get_variable("bias", [filter], initializer=tf.constant_initializer(0.0))
        x = tf.nn.conv3d_transpose(value=x,
                                   filter=w,
                                   strides=[1, stride, stride, stride, 1],
                                   padding=padding,
                                   output_shape=[xdim[0], xdim[1]*stride, xdim[2]*stride, xdim[3]*stride, filter])
        if use_bias:
            x = tf.nn.bias_add(x, bias)

        return x


def maxpool2d(x, k=2):
    ksize = [1, 1, k, k]
    return tf.nn.max_pool(x, ksize=ksize, strides=ksize, padding='SAME', data_format='NCHW')

def maxpool3d(x, k=2):
    ksize = [1, 1, k, k, k]
    return tf.nn.max_pool(x, ksize=ksize, strides=ksize, padding='SAME', data_format='NCDHW')


# TODO use fused upscale+conv2d from gan2
def upscale2d(x, factor=2):
    assert isinstance(factor, int) and factor >= 1
    if factor == 1: return x
    with tf.variable_scope('Upscale2D'):
        s = x.shape
        x = tf.reshape(x, [-1, s[1], s[2], 1, s[3], 1])
        x = tf.tile(x, [1, 1, 1, factor, 1, factor])
        x = tf.reshape(x, [-1, s[1], s[2] * factor, s[3] * factor])
        return x

def upscale3d(x, factor=2):
    assert isinstance(factor, int) and factor >= 1
    if factor == 1: return x
    with tf.variable_scope('Upscale3D'):
        s = x.shape
        x = tf.reshape(x, [-1, s[1], s[2], 1, s[3], 1, s[4], 1])
        x = tf.tile(x, [1, 1, 1, factor, 1, factor, 1, factor])
        x = tf.reshape(x, [-1, s[1], s[2] * factor, s[3] * factor, s[4] * factor])
        return x

# # change con_lr & conv to 3D
# def conv_lr(name, x, fmaps):
#     with tf.variable_scope(name):
#         return tf.nn.leaky_relu(conv2d_bias(x, fmaps, 3), alpha=0.1)

def conv_instnorm_lr(name, x, fmaps, stride, up):
    with tf.variable_scope(name):
        if up == False:
            return \
                tf.nn.leaky_relu(
                    instance_norm(
                        conv3d_bias_spectral(x, fmaps, 3, stride)
                    )
                    , alpha=0.1)
        else:
            return \
                tf.nn.leaky_relu(
                    instance_norm(
                        conv3d_bias_spectral_up(x, fmaps, 3, stride)
                    )
                    , alpha=0.1)

def dense_layer_spectral(x, filter, use_bias=False, layer_name="spectral_dense"):
    with tf.variable_scope(layer_name):
        w = tf.get_variable("kernel", shape=[x.get_shape()[-1], filter], initializer=tf.contrib.layers.xavier_initializer(), regularizer=None)
        bias = tf.get_variable("bias", [filter], initializer=tf.constant_initializer(0.0))
        x = tf.matmul(x, w)
        if use_bias:
            x = tf.nn.bias_add(x, bias)
    return x

def Inner_product(global_pooled, y, nums_class):
    W = global_pooled.shape[-1]
    V = tf.get_variable("V", [nums_class, W], initializer=tf.glorot_uniform_initializer())
    V = tf.transpose(V)
    V = spectral_norm(V)
    V = tf.transpose(V)
    temp = tf.nn.embedding_lookup(V, y)
    temp = tf.reduce_sum(temp * global_pooled, axis=1, keep_dims=True)
    return temp

def hw_flatten(x) :
    return tf.reshape(x, shape=[x.shape[0], -1, x.shape[-1]])

def max_pooling(x) :
    return tf.layers.max_pooling2d(x, pool_size=2, strides=2, padding='SAME', data_format='channels_first')

def similarity_loss(img1, warped_img2):
    sizes = np.prod(img1.shape.as_list()[1:])
    flatten1 = tf.reshape(img1, [-1, sizes])
    flatten2 = tf.reshape(warped_img2, [-1, sizes])

    mean1 = tf.reshape(tf.reduce_mean(flatten1, axis=-1), [-1, 1])
    mean2 = tf.reshape(tf.reduce_mean(flatten2, axis=-1), [-1, 1])
    var1 = tf.reduce_mean(tf.square(flatten1 - mean1), axis=-1)
    var2 = tf.reduce_mean(tf.square(flatten2 - mean2), axis=-1)
    cov12 = tf.reduce_mean(
        (flatten1 - mean1) * (flatten2 - mean2), axis=-1)
    pearson_r = cov12 / tf.sqrt((var1 + 1e-6) * (var2 + 1e-6))

    raw_loss = 1 - pearson_r
    raw_loss = tf.reduce_sum(raw_loss)
    return raw_loss


def regularize_loss(flow):
    ret = ((tf.nn.l2_loss(flow[:, 1:, :, :] - flow[:, :-1, :, :]) +
            tf.nn.l2_loss(flow[:, :, 1:, :] - flow[:, :, :-1, :]) +
            tf.nn.l2_loss(flow[:, :, :, 1:] - flow[:, :, :, :-1])) / np.prod(flow.shape.as_list()[1:5]))
    return ret

def dice_loss(y_true, y_pred):
  numerator = 2 * tf.reduce_sum(tf.multiply(y_true, y_pred), axis=(1,2,3))
  denominator = tf.reduce_sum(y_true + y_pred, axis=(1,2,3))

  return 1 - (numerator + 1) / (denominator + 1)
    # return tf.nn.sigmoid_cross_entropy_with_logits(tf.reshape(y_true,[FLAGS.batch_size,-1]), tf.reshape(y_pred,[FLAGS.batch_size,-1]))


def jacobian_det(flow):
    _, var = tf.nn.moments(tf.linalg.det(tf.stack([
        flow[:, 1:, :-1, :-1] - flow[:, :-1, :-1, :-1] +
        tf.constant([1, 0, 0], dtype=tf.float32),
        flow[:, :-1, 1:, :-1] - flow[:, :-1, :-1, :-1] +
        tf.constant([0, 1, 0], dtype=tf.float32),
        flow[:, :-1, :-1, 1:] - flow[:, :-1, :-1, :-1] +
        tf.constant([0, 0, 1], dtype=tf.float32)
    ], axis=-1)), axes=[1, 2, 3])
    return tf.sqrt(var)

class NCC():
    """
    local (over window) normalized cross correlation
    """

    def __init__(self, win=None, eps=1e-5):
        self.win = win
        self.eps = eps


    def ncc(self, I, J):
        # get dimension of volume
        # assumes I, J are sized [batch_size, *vol_shape, nb_feats]
        ndims = len(I.get_shape().as_list()) - 2
        assert ndims in [1, 2, 3], "volumes should be 1 to 3 dimensions. found: %d" % ndims

        # set window size
        if self.win is None:
            self.win = [9] * ndims

        # get convolution function
        conv_fn = getattr(tf.nn, 'conv%dd' % ndims)

        # compute CC squares
        I2 = I*I
        J2 = J*J
        IJ = I*J

        # compute filters
        sum_filt = tf.ones([*self.win, 1, 1])
        strides = 1
        if ndims > 1:
            strides = [1] * (ndims + 2)
        padding = 'SAME'

        # compute local sums via convolution
        I_sum = conv_fn(I, sum_filt, strides, padding)
        J_sum = conv_fn(J, sum_filt, strides, padding)
        I2_sum = conv_fn(I2, sum_filt, strides, padding)
        J2_sum = conv_fn(J2, sum_filt, strides, padding)
        IJ_sum = conv_fn(IJ, sum_filt, strides, padding)

        # compute cross correlation
        win_size = np.prod(self.win)
        u_I = I_sum/win_size
        u_J = J_sum/win_size

        cross = IJ_sum - u_J*I_sum - u_I*J_sum + u_I*u_J*win_size
        I_var = I2_sum - 2 * u_I * I_sum + u_I*u_I*win_size
        J_var = J2_sum - 2 * u_J * J_sum + u_J*u_J*win_size

        cc = cross*cross / (I_var*J_var + self.eps)

        # return negative cc.
        return tf.reduce_mean(cc)

    def loss(self, I, J):
        return - self.ncc(I, J)


class deformedGAN():
    def __init(self):
        pass

    def autoencoder(self, x_in, y_in, width=384, height=384, scope='gen_', reuse=False):
        with tf.variable_scope(scope, reuse=reuse):
            x = tf.concat([x_in, y_in], axis=-1)

            skips = [x]

            n = x
            n = conv_instnorm_lr('enc_conv1', n, 32, stride=2, up=False)
            skips.append(n)

            n = conv_instnorm_lr('enc_conv2_2', n, 64, stride=2, up=False)
            skips.append(n)

            n = conv_instnorm_lr('enc_conv3_2', n, 128, stride=2, up=False)
            skips.append(n)

            n = conv_instnorm_lr('enc_conv4_2', n, 256, stride=2, up=False)
            skips.append(n)

            n = conv_instnorm_lr('enc_conv5_2', n, 512, stride=1, up=False)

            n = tf.concat([n, skips.pop()], axis=-1)
            n = conv_instnorm_lr('enc_deconv0', n, 256, stride=1, up=False)
            n = conv_instnorm_lr('enc_deconv1', n, 256, stride=2, up=True)

            n = tf.concat([n, skips.pop()], axis=-1)
            n = conv_instnorm_lr('enc_deconv2', n, 128, stride=1, up=False)
            n = conv_instnorm_lr('enc_deconv3', n, 128, stride=2, up=True)

            n = tf.concat([n, skips.pop()], axis=-1)
            n = conv_instnorm_lr('enc_deconv4', n, 64, stride=1, up=False)
            n = conv_instnorm_lr('enc_deconv5', n, 64, stride=2, up=True)

            n = tf.concat([n, skips.pop()], axis=-1)
            n = conv_instnorm_lr('enc_deconv7', n, 32, stride=1, up=False)
            n = conv_instnorm_lr('enc_deconv8', n, 32, stride=2, up=True)

            n = conv_instnorm_lr('enc_deconv9', n, 32, stride=1, up=False)
            n = tf.layers.conv3d(inputs=n, filters=3,
                             kernel_size=3, use_bias=False, name= 'fout', padding='SAME')
            # deform = n

            # dst = Dense3DSpatialTransformer()
            # n = dst._transform(x, deform[:, :, :, :, 0], deform[:, :, :, :, 1], deform[:, :, :, :, 2])

            return n

    def autoencoder_pib(self, x, width=384, height=384, scope='gen_', reuse=False):
        with tf.variable_scope(scope, reuse=reuse):

            skips = [x]

            n = x
            n = conv_instnorm_lr('enc_conv1', n, 32, stride=2, up=False)
            skips.append(n)

            n = conv_instnorm_lr('enc_conv2_2', n, 64, stride=2, up=False)
            skips.append(n)

            n = conv_instnorm_lr('enc_conv3_2', n, 128, stride=2, up=False)
            skips.append(n)

            n = conv_instnorm_lr('enc_conv4_2', n, 256, stride=2, up=False)
            skips.append(n)

            n = conv_instnorm_lr('enc_conv5_2', n, 512, stride=1, up=False)

            n = tf.concat([n, skips.pop()], axis=-1)
            n = conv_instnorm_lr('enc_deconv0', n, 256, stride=1, up=False)
            n = conv_instnorm_lr('enc_deconv1', n, 256, stride=2, up=True)

            n = tf.concat([n, skips.pop()], axis=-1)
            n = conv_instnorm_lr('enc_deconv2', n, 128, stride=1, up=False)
            n = conv_instnorm_lr('enc_deconv3', n, 128, stride=2, up=True)

            n = tf.concat([n, skips.pop()], axis=-1)
            n = conv_instnorm_lr('enc_deconv4', n, 64, stride=1, up=False)
            n = conv_instnorm_lr('enc_deconv5', n, 64, stride=2, up=True)

            n = tf.concat([n, skips.pop()], axis=-1)
            n = conv_instnorm_lr('enc_deconv7', n, 32, stride=1, up=False)
            n = conv_instnorm_lr('enc_deconv8', n, 32, stride=2, up=True)

            n = conv_instnorm_lr('enc_deconv9', n, 32, stride=1, up=False)
            n = tf.layers.conv3d(inputs=n, filters=3,
                             kernel_size=3, use_bias=False, name= 'fout', padding='SAME')
            # deform = n

            # dst = Dense3DSpatialTransformer()
            # n = dst._transform(x, deform[:, :, :, :, 0], deform[:, :, :, :, 1], deform[:, :, :, :, 2])

            return n


    def Discriminator(self, x, width=384, height=384, scope='dis_', reuse=False):
        with tf.variable_scope(scope, reuse=reuse) as vs:
            x0 = conv3d_bias_spectral(x, 16, 3, 1, padding='SAME', layer_name='c1')
            x3 = tf.nn.leaky_relu(x0)

            x4 = conv3d_bias_spectral(x3, 32, 3, 2, padding='SAME', layer_name='c3')
            x5 = tf.nn.leaky_relu(x4)
            x6 = conv3d_bias_spectral(x5, 32, 3, 1, padding='SAME', layer_name='c4')
            x6 = x6 + x4
            x7 = tf.nn.leaky_relu(x6)


            x8 = conv3d_bias_spectral(x7, 64, 3, 2, padding='SAME', layer_name='c5')
            x9 = tf.nn.leaky_relu(x8)
            x10 = conv3d_bias_spectral(x9, 64, 3, 1, padding='SAME', layer_name='c6')
            x10 = x10 + x8
            x11 = tf.nn.leaky_relu(x10)

            x12 = conv3d_bias_spectral(x11, 128, 3, 2, padding='SAME', layer_name='c7')
            x13 = tf.nn.leaky_relu(x12)
            x14 = conv3d_bias_spectral(x13, 128, 3, 1, padding='SAME', layer_name='c8')
            x14 = x14 + x12

            x15 = tf.nn.leaky_relu(x14)
            x16 = conv3d_bias_spectral(x15, 256, 3, 1, padding='VALID', layer_name='c9')
            x17 = tf.nn.leaky_relu(x16)
            x18 = conv3d_bias_spectral(x17, 256, 3, 1, padding='VALID', layer_name='c10')
            x18 = tf.nn.leaky_relu(x18)

            gap = tf.reduce_mean(x18, axis=[1,2,3])
            x = dense_layer_spectral(gap, 1)

            return x


