from __future__ import absolute_import
from __future__ import division
from __future__ import print_function
## django integration setting
# from django.conf import settings

import time
import os, shutil
from shutil import copyfile

# TODO: Change the model paths
import tensorflow as tf
import TF_DirectSN.layers_coregpy as lays
from TF_DirectSN.PTQuant_utils import Dense3DSpatialTransformer, VTNAffineStem

from TF_DirectSN.PTQuant_preproc_coreg_v1_1 import coreg_mrc1 as coreg

import glob
# from django.conf import settings

import numpy as np
from scipy.ndimage import gaussian_filter
# FLAGS = tf.flags.FLAGS
stages = 3


def train_pib(inout_path, caseID):

    # checkpoint_dir = r".\testing\TF_DirectSN\02_14_20_10_CascadedGAN_Unet_augment_v1"
    checkpoint_dir = os.path.join(os.getcwd(), 'TF_DirectSN', '02_14_20_10_CascadedGAN_Unet_augment_v1')

    in_file = "input_" + caseID
    out_file = "output_" + caseID
    in_file_full_path = os.path.join(inout_path, in_file + ".img")
    coreged = coreg(V2=in_file_full_path)

    maxp = np.quantile(coreged.reshape([-1]), 0.95)
    coreged = coreged / maxp

    with tf.Graph().as_default():

        pet = tf.placeholder(tf.float32,
                               [91, 109, 112],
                               name="PET")
        pet_in = tf.pad(pet, [[10, 11], [1, 2], [0, 0]], mode='constant')

        pet_in = tf.expand_dims(tf.expand_dims(pet_in, axis=-1), axis=0)
        gimg = pet_in

        dst = Dense3DSpatialTransformer()
        dgan = lays.deformedGAN()

        def_list = []
        temp_path = os.path.join(os.getcwd(), 'TF_DirectSN', 'src', 'fMNI152_T1_2mm.img')
        aa = np.fromfile(temp_path, dtype=np.int16)
        aa = np.reshape(aa, [91, 109, 91])
        aa = np.transpose(aa, axes=[2, 1, 0])
        aa_pad = np.pad(aa, [[10, 11], [1, 2], [10, 11]], mode='constant') / 7000

        mrTemplate = tf.constant(aa_pad, dtype=tf.float32)
        mrTemplate = tf.expand_dims(mrTemplate, axis=0)
        mrTemplate = tf.expand_dims(mrTemplate, axis=-1)
        mrTemplate = tf.where(tf.is_nan(mrTemplate), tf.ones_like(mrTemplate) * 0, mrTemplate)

        with tf.variable_scope('gen_affine'):
            affine_params = VTNAffineStem(gimg, mrTemplate)
            affine_flow = affine_params['flow']
            # def_list.append(affine_flow)
            gimg = dst._transform(gimg, affine_flow[:, :, :, :, 0], affine_flow[:, :, :, :, 1],
                                  affine_flow[:, :, :, :, 2])

            def_list.append(affine_flow)

        for i in range(0, stages):
            deform = dgan.autoencoder_pib(gimg, scope='gen_' + str(i), reuse=False)
            gimg = dst._transform(gimg, deform[:, :, :, :, 0], deform[:, :, :, :, 1], deform[:, :, :, :, 2])
            def_list.append(deform)

        defos = 0
        for defo in def_list:
            defos += defo

        gimg = dst._transform(pet_in, defos[:, :, :, :, 0], defos[:, :, :, :, 1], defos[:, :, :, :, 2], interp='linear')
        # gimg_mr = dst._transform(mr, defos[:, :, :, :, 0], defos[:, :, :, :, 1], defos[:, :, :, :, 2], interp='nearest')

        saver_re = tf.train.Saver()

        with tf.Session(config=tf.ConfigProto(allow_soft_placement=True)) as sess:
            ckpt = tf.train.get_checkpoint_state(checkpoint_dir)

            if ckpt and ckpt.model_checkpoint_path:
                saver_re.restore(sess, ckpt.model_checkpoint_path)
            else:
                print('No checkpoint file found')
                return

            # Start the queue runners.
            # coord = tf.train.Coordinator()
            # threads = tf.train.start_queue_runners(coord=coord)
            #
            # fname = time.strftime("%m_%d_%H_%M")
            # fname = fname + 'test_step1'
            # tfi = os.path.join('D:\DNN_directSN\\testResults\\onlySeg_paper_Affine', fname)
            # if tf.gfile.Exists(tfi):
            #     tf.gfile.DeleteRecursively(tfi)
            # tf.gfile.MakeDirs(tfi)
            #
            # hdrBasePath = 'D:\\DNN_directSN\\dataset\\test\\indv_PET\\resampled'
            # hdrlist = glob.glob(os.path.join(hdrBasePath, '*.hdr'))

            for i in range(0, 1):

                [inp_img, xr, defosr] = sess.run(
                    [pet_in, gimg, defos], feed_dict={pet: coreged})
                xr = xr * maxp
                inp_img = inp_img * maxp
                test = dst._transform_spline(inp_img, defosr[:, :, :, :, 1], defosr[:, :, :, :, 0],
                                             defosr[:, :, :, :, 2])
                name = 'test'

                gimg_tmp = test.transpose([0, 3, 2, 1])
                gimg_tmp = gimg_tmp[0, 10:101, 1:110, 10:101].flatten()
                # gimg_tmp = gaussian_filter(gimg_tmp, sigma=4/2.355/2)
                gimg_tmp = gimg_tmp.astype(dtype=np.float32)
                gimg_tmp.tofile(os.path.join(inout_path, out_file + ".img"))
                # shutil.copy(os.path.join(hdrBasePath, name + '.hdr'), os.path.join(tfi, 'eval_gimg_' + name + '.hdr'))

                # defosr = defosr[0, 10:101, 1:110, 10:101,:].flatten()
                # defosr = defosr.astype(dtype=np.float32)
                # defosr.tofile(os.path.join(inout_path, 'eval_defo_' + name))
                # inout_path = os.path.join(settings.MEDIA_ROOT, "case_66")
                src_file_path = os.path.join(os.getcwd(), 'TF_DirectSN', 'src', "output_f32.hdr")
                dst_file_path = os.path.join(inout_path, "output_"+caseID+".hdr")
                copyfile(src_file_path, dst_file_path)
                    # gxhr_tmp = xr[ii, :, :, :].flatten()
                    # gxhr_tmp.tofile(os.path.join(tfi, 'eval_labl' + name))

                print(i, name)



# def main(argv=None):  # pylint: disable=unused-argument
#     train()
#
#
# if __name__ == '__main__':
#     tf.app.run()
