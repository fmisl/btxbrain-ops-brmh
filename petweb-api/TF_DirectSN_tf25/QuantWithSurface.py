import os
import shutil
import sys
import numpy as np

from matplotlib import pyplot as plt
import nibabel as nib


from nilearn import datasets, plotting, surface
from nilearn.image import threshold_img

Frontal_L = np.arange(3, 34, 2)
Frontal_R = np.arange(4, 34, 2)
# Frontal_L = np.arange(1,28,2)
# Frontal_R = np.arange(2,28,2)

Precuneus_PCC_L = np.asarray([35, 67])
Precuneus_PCC_R = np.asarray([36, 68])
# Cingulate_L = np.arange(31,36,2)
# Cingulate_R = np.arange(32,36,2)

Lateral_temporal_L = np.arange(79, 89, 2)
Lateral_temporal_R = np.arange(80, 90, 2)
# Striatum_L = np.arange(71,74,2)
# Striatum_R = np.arange(72,74,2)

Parietal_L = np.arange(43, 55, 2)
Parietal_R = np.arange(44, 56, 2)

Occipital_L = np.arange(43, 56, 2)
Occipital_R = np.arange(44, 56, 2)

Medial_temporal_L = np.arange(37, 41, 2)
Medial_temporal_R = np.arange(38, 42, 2)

Basal_ganglia_L = np.arange(71, 75, 2)
Basal_ganglia_R = np.arange(72, 76, 2)

ROIS = [Frontal_L, Frontal_R, Precuneus_PCC_L, Precuneus_PCC_R, Lateral_temporal_L, Lateral_temporal_R, Parietal_L,
        Parietal_R, Occipital_L, Occipital_R, Medial_temporal_L, Medial_temporal_R, Basal_ganglia_L, Basal_ganglia_R]
# ROIS = [Frontal_L, Frontal_R, Cingulate_L, Cingulate_R, Striatum_L, Striatum_R, Thalamus_L, Thalamus_R, Occipital_L, Occipital_R, Parietal_L, Parietal_R, Temporal_L, Temporal_R]
#
Global = np.concatenate(ROIS, axis=0)

ROIS = ROIS + [Global]

Cortex_Proj = np.arange(1, 90)


# C:\Users\dwnusa\workspace\3_project\PET-Web\SN_DL_v2\testResults\coregpy\06_22_10_10test\eval_gimg_test.img
def _quantification(sndir, maxval=100, threshold=1, vmax=3, oriSize=None, tracer_name=None):
    crbl_path = os.path.join(os.getcwd(), "TF_DirectSN", "src", 'fcrbll_fnirt_thr50_wo_vermis.img')
    aalt_path = os.path.join(os.getcwd(), "TF_DirectSN", "src", 'faalnumconvergion_paper.img')

    crtx_centil = os.path.join(os.getcwd(), "TF_DirectSN", "src", 'fvoi_ctx_2mm.img')
    crbl_centil = os.path.join(os.getcwd(), "TF_DirectSN", "src", 'fvoi_WhlCbl_2mm.img')

    # # For debug
    # crbl_path = r'C:\Users\dwnusa\workspace\3_project\PET-Web\SN_template\testing\TF_DirectSN\src\fcrbll_fnirt_thr50_wo_vermis.img'
    # aalt_path = r'C:\Users\dwnusa\workspace\3_project\PET-Web\SN_template\testing\TF_DirectSN\src\faalnumconvergion_paper.img'
    # crtx_centil = r'C:\Users\dwnusa\workspace\3_project\PET-Web\SN_template\testing\TF_DirectSN\src\fvoi_ctx_2mm.img'
    # crbl_centil = r'C:\Users\dwnusa\workspace\3_project\PET-Web\SN_template\testing\TF_DirectSN\src\fvoi_WhlCbl_2mm.img'

    try:
        crbl_mask = nib.load(crbl_path)
        crbl_mask = np.asarray(crbl_mask.get_fdata())
    except:
        print('PROVIDE cerebellum mask!\n', file=sys.stderr)
        return 0
    try:
        aalt_mask = nib.load(aalt_path)
        aalt_mask = np.asarray(aalt_mask.get_fdata())
    except:
        print('PROVIDE AAL mask!\n', file=sys.stderr)
        return 0
    try:
        centil_crtx = nib.load(crtx_centil)
        centil_crtx = np.asarray(centil_crtx.get_fdata())

        centil_crbl = nib.load(crbl_centil)
        centil_crbl = np.asarray(centil_crbl.get_fdata())
    except:
        print('PROVIDE Centiloid masks!\n', file=sys.stderr)
        return 0

    snfiles = os.listdir(os.path.join(sndir))
    snfiles = [file for file in snfiles if file.startswith('output') and file.endswith('.img')]

    aal_region = np.zeros([len(ROIS), int(len(snfiles)), 2])
    # aal_count = np.zeros([len(ROIS), int(len(snfiles))])

    centil_suvr = np.zeros([2, int(len(snfiles))])

    # plt.rcParams["figure.figsize"] = (8, 2.5)

    for fnum, file in enumerate(snfiles):
        ## TODO: Adaptive size input
        try:
            sn_img = nib.load(os.path.join(sndir, file))
            save_header = sn_img
            sn_img = np.asarray(sn_img.get_fdata())
            sn_img = np.nan_to_num(sn_img)

            sn_img_flip = np.flip(sn_img, axis=0)

            sn_padd = np.zeros([109, 3 * 109])

            sn_padd[9:91 + 9, 0:109] = np.rot90(sn_img_flip[45, :, :], 1)

            # maxval was inserted just for visualization
            tmp = np.rot90(sn_img_flip[:, 64, :], 1)
            tmp[55 - 9:60 - 9, 0] = maxval
            tmp[60 - 9, 0:3] = maxval
            sn_padd[9:91 + 9, 109 + 9:109 + 9 + 91] = tmp

            tmp = np.rot90(sn_img_flip[:, :, 38], 1)
            tmp[55:60, 0] = maxval
            tmp[60, 0:3] = maxval
            sn_padd[:, 109 + 109 + 9:109 + 109 + 9 + 91] = tmp

            # TODO: SNimg.png is used?
            # fig = plt.figure(frameon=False)
            # ax = fig.add_axes([0, 0, 1, 1])
            # ax.axis('off')
            #
            # im = ax.imshow(sn_padd[0:105, :], vmin=0, vmax=maxval, cmap='nipy_spectral')
            # plt.axis('off')
            # divider = make_axes_locatable(ax)
            # cax = divider.append_axes("right", size="5%", pad=0.05)
            # plt.colorbar(im, cax=cax)
            # plt.axis('off')
            # fig.savefig('SNimg.png', format='png')
            # plt.close(fig)

            sn_crbl_L = np.sum(sn_img[0:45, :, :] * crbl_mask[0:45, :, :]) / np.sum(crbl_mask[0:45, :, :])
            sn_crbl_R = np.sum(sn_img[46:91, :, :] * crbl_mask[46:91, :, :]) / np.sum(crbl_mask[46:91, :, :])
            sn_crbl_av = sn_crbl_L / 2 + sn_crbl_R / 2

            sn_centil_crbl = np.sum(sn_img * centil_crbl) / np.sum(centil_crbl)

            sn_img_idx = sn_img / sn_crbl_av
            sn_img_idx_centil = sn_img / sn_centil_crbl

            # Only for cortex elements
            roiimg_proj = np.zeros_like(sn_img)
            for idxs in Cortex_Proj:
                roiimg_proj = roiimg_proj + (aalt_mask == idxs).astype(np.float64)

            # Only produces cerebral grey
            new_image = nib.Nifti1Image(sn_img_idx * roiimg_proj, affine=save_header.affine)

            fsaverage = datasets.fetch_surf_fsaverage()
            texture = surface.vol_to_surf(new_image, fsaverage.pial_right)

            plt.rcParams["figure.figsize"] = (4, 3)
            for th in np.arange(0.6, 3.0, 0.5):
                # [0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0]:
                float_th=round(th,1)
                fig = plotting.plot_surf(fsaverage.infl_right, texture, hemi='right',
                                         threshold=float_th, bg_map=fsaverage.sulc_right, vmax=vmax, vmin=0, title=None,
                                         cmap='black_red', view='lateral')
                full_path = os.path.join(sndir, '_rlat_'+str(float_th)+'.png')
                fig.savefig(full_path, format='png', transparent=True)
            plt.close('all')

            # fig = plotting.plot_surf(fsaverage.infl_right, texture, hemi='right',
            #                          threshold=threshold, bg_map=fsaverage.sulc_right, vmax=vmax, vmin=0, title=None,
            #                          cmap='black_red', view='lateral')
            # full_path = os.path.join(case_fullpath, '_rlat.png')
            # fig.savefig(full_path, format='png', transparent=True)
            # plt.close(fig)

            plt.rcParams["figure.figsize"] = (4, 3)
            for th in np.arange(0.6, 3.0, 0.5):
                # [0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0]:
                float_th=round(th,1)
                fig = plotting.plot_surf(fsaverage.infl_left, texture, hemi='left',
                                         threshold=float_th, bg_map=fsaverage.sulc_left, vmax=vmax, vmin=0, title=None,
                                         cmap='black_red', view='lateral')
                full_path = os.path.join(sndir, '_llat_'+str(float_th)+'.png')
                fig.savefig(full_path, format='png', transparent=True)
            plt.close('all')
            # fig = plotting.plot_surf(fsaverage.infl_left, texture, hemi='left',
            #                          threshold=threshold, bg_map=fsaverage.sulc_left, vmax=vmax, vmin=0, title=None,
            #                          cmap='black_red', view='lateral')
            # full_path = os.path.join(case_fullpath, '_llat.png')
            # fig.savefig(full_path, format='png', transparent=True)
            # plt.close(fig)

            plt.rcParams["figure.figsize"] = (4, 3)
            for th in np.arange(0.6, 3.0, 0.5):
                # [0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0]:
                float_th=round(th,1)
                fig = plotting.plot_surf(fsaverage.infl_right, texture, hemi='right',
                                         threshold=float_th, bg_map=fsaverage.sulc_right, vmax=vmax, vmin=0, title=None,
                                         cmap='black_red', view = 'medial')
                full_path = os.path.join(sndir, '_rmed_'+str(float_th)+'.png')
                fig.savefig(full_path, format='png', transparent=True)
            plt.close('all')
            # fig = plotting.plot_surf(fsaverage.infl_right, texture, hemi='right',
            #                          threshold=threshold, bg_map=fsaverage.sulc_right, vmax=vmax, vmin=0, title=None,
            #                          cmap='black_red', view='medial')
            # full_path = os.path.join(case_fullpath, '_rmed.png')
            # fig.savefig(full_path, format='png', transparent=True)
            # plt.close(fig)

            plt.rcParams["figure.figsize"] = (4, 3)
            for th in np.arange(0.6, 3.0, 0.5):
                # [0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0]:
                float_th=round(th,1)
                fig = plotting.plot_surf(fsaverage.infl_left, texture, hemi='left',
                                         threshold=float_th, bg_map=fsaverage.sulc_left, vmax=vmax, vmin=0, title=None,
                                         cmap='black_red', view = 'medial')
                full_path = os.path.join(sndir, '_lmed_'+str(float_th)+'.png')
                fig.savefig(full_path, format='png', transparent=True)
            plt.close('all')
            # fig = plotting.plot_surf(fsaverage.infl_left, texture, hemi='left',
            #                          threshold=threshold, bg_map=fsaverage.sulc_left, vmax=vmax, vmin=0, title=None,
            #                          cmap='black_red', view='medial')
            # full_path = os.path.join(case_fullpath, '_lmed.png')
            # fig.savefig(full_path, format='png', transparent=True)
            # plt.close(fig)

            # Centil Scale for PIB: 100*(pib_ctx_val- 1.009)/1.067;

            centil_suvr[0, fnum] = np.sum(sn_img_idx * centil_crtx) / np.sum(centil_crtx)

            if tracer_name.find('FBB') is not -1:
                centil_suvr[1, fnum] = 153.4 * (
                        np.sum(sn_img_idx_centil * centil_crtx) / np.sum(centil_crtx)) - 154.9
            elif tracer_name.find('FBP') is not -1:
                centil_suvr[1, fnum] = 196.9 * (
                        np.sum(sn_img_idx_centil * centil_crtx) / np.sum(centil_crtx)) - 196.03
            elif tracer_name.find('FMM') is not -1:
                centil_suvr[1, fnum] = 121.42 * (
                        np.sum(sn_img_idx_centil * centil_crtx) / np.sum(centil_crtx)) - 121.16
            elif tracer_name.find('PIB') is not -1:
                centil_suvr[1, fnum] = 100 * (
                        np.sum(sn_img_idx_centil * centil_crtx) / np.sum(centil_crtx) - 1.009) / 1.067
            else:
                # TODO give 0 and indicate not provide?
                centil_suvr[1, fnum] = 196.9 * (
                        np.sum(sn_img_idx_centil * centil_crtx) / np.sum(centil_crtx)) - 196.9

            for cnt, roi in enumerate(ROIS):
                roiimg = np.zeros_like(sn_img)
                # TODO: SKK, to speed up, make LUTs for ROIs
                for idxs in roi:
                    roiimg = roiimg + (aalt_mask == idxs).astype(np.float64)
                idx_sum = np.sum(sn_img_idx * roiimg) / np.sum(roiimg)
                idx_sum_centil = np.sum(sn_img_idx_centil * roiimg) / np.sum(roiimg)
                aal_region[cnt, fnum, 0] = idx_sum
                if tracer_name.find('FBB') is not -1:
                    aal_region[cnt, fnum, 1] = 153.4*(idx_sum_centil) - 154.9

                elif tracer_name.find('FBP') is not -1:
                    aal_region[cnt, fnum, 1] = 196.9*(idx_sum_centil) - 196.03

                elif tracer_name.find('FMM') is not -1:
                    aal_region[cnt, fnum, 1] = 121.42*(idx_sum_centil) - 121.16

                elif tracer_name.find('PIB') is not -1:
                    aal_region[cnt, fnum, 1] = 100 * (idx_sum_centil - 1.009) / 1.067

                else:
                    # TODO give 0 and indicate not provide?
                    aal_region[cnt, fnum, 1] = 196.9*(idx_sum_centil) - 196.9

        except:
            print('PROVIDE normalized image!\n', file=sys.stderr)
            return 0

    # # Preivous
    # return aal_region_norm, aal_region, aal_count

    # Current: only produce regional SUVR values and Centiloid SUVR
    return aal_region, centil_suvr, sn_crbl_av

# if __name__ == "__main__":
#     # _quantification(sndir=r'D:\DNN_directSN\testResults\onlySeg_paper_Affine\02_17_07_09test_step1')
#     _quantification(sndir=r'C:\Users\dwnusa\workspace\3_project\PET-Web\SN_template\uploads\case220')

# import os
# import shutil
# import sys
# import numpy as np
# import matplotlib
# matplotlib.use ('Agg') #<= this is required
# import matplotlib.pyplot as plt
# import nibabel as nib
# from scipy import ndimage as nd
# from mpl_toolkits.axes_grid1 import make_axes_locatable
# from PIL import Image
# from django.conf import settings
# from .. import models
#
# from nilearn import datasets, plotting, surface
# from nilearn.image import threshold_img
#
# Frontal_L = np.arange(1,28,2)
# Frontal_R = np.arange(2,28,2)
#
# Cingulate_L = np.arange(31,36,2)
# Cingulate_R = np.arange(32,36,2)
#
# Striatum_L = np.arange(71,74,2)
# Striatum_R = np.arange(72,74,2)
#
# Thalamus_L = np.arange(77,78,1)
# Thalamus_R = np.arange(78,79,1)
#
# Occipital_L = np.arange(43,56,2)
# Occipital_R = np.arange(44,56,2)
#
# Parietal_L = np.arange(57,70,2)
# Parietal_R = np.arange(58,70,2)
#
# Temporal_L = np.arange(79,90,2)
# Temporal_R = np.arange(80,90,2)
#
# ROIS = [Frontal_L, Frontal_R, Cingulate_L, Cingulate_R, Striatum_L, Striatum_R, Thalamus_L, Thalamus_R, Occipital_L, Occipital_R, Parietal_L, Parietal_R, Temporal_L, Temporal_R]
#
# # C:\Users\dwnusa\workspace\3_project\PET-Web\SN_DL_v2\testResults\coregpy\06_22_10_10test\eval_gimg_test.img
# def _quantification(sndir, case_fullpath, maxval=100, threshold=1, vmax=3, oriSize=None, tracer_name=None):
#
#     crbl_path = os.path.join(settings.BASE_DIR, "testing", "TF_DirectSN", "src", 'fcrbll_fnirt_thr50_wo_vermis.img')
#     aalt_path = os.path.join(settings.BASE_DIR, "testing", "TF_DirectSN", "src", 'faalnumconvergion_paper.img')
#
#     crtx_centil = os.path.join(settings.BASE_DIR, "testing", "TF_DirectSN", "src", 'fvoi_ctx_2mm.img')
#     crbl_centil =os.path.join(settings.BASE_DIR, "testing", "TF_DirectSN", "src", 'fvoi_WhlCbl_2mm.img')
#
#     # # For debug
#     # crbl_path = r'C:\Users\dwnusa\workspace\3_project\PET-Web\SN_template\testing\TF_DirectSN\src\fcrbll_fnirt_thr50_wo_vermis.img'
#     # aalt_path = r'C:\Users\dwnusa\workspace\3_project\PET-Web\SN_template\testing\TF_DirectSN\src\faalnumconvergion_paper.img'
#     # crtx_centil = r'C:\Users\dwnusa\workspace\3_project\PET-Web\SN_template\testing\TF_DirectSN\src\fvoi_ctx_2mm.img'
#     # crbl_centil = r'C:\Users\dwnusa\workspace\3_project\PET-Web\SN_template\testing\TF_DirectSN\src\fvoi_WhlCbl_2mm.img'
#
#     try:
#         crbl_mask = nib.load(crbl_path)
#         crbl_mask = np.asarray(crbl_mask.get_fdata())
#     except:
#         print('PROVIDE cerebellum mask!\n', file=sys.stderr)
#         return 0
#     try:
#         aalt_mask = nib.load(aalt_path)
#         aalt_mask = np.asarray(aalt_mask.get_fdata())
#     except:
#         print('PROVIDE AAL mask!\n', file=sys.stderr)
#         return 0
#     try:
#         centil_crtx = nib.load(crtx_centil)
#         centil_crtx = np.asarray(centil_crtx.get_fdata())
#
#         centil_crbl = nib.load(crbl_centil)
#         centil_crbl = np.asarray(centil_crbl.get_fdata())
#     except:
#         print('PROVIDE Centiloid masks!\n', file=sys.stderr)
#         return 0
#
#     snfiles = os.listdir(os.path.join(sndir))
#     snfiles = [file for file in snfiles if file.startswith('output') and file.endswith('.img')]
#
#     aal_region = np.zeros([len(ROIS), int(len(snfiles)), 2])
#     # aal_count = np.zeros([len(ROIS), int(len(snfiles))])
#
#     centil_suvr = np.zeros([2, int(len(snfiles))])
#
#     # plt.rcParams["figure.figsize"] = (8, 2.5)
#
#     for fnum, file in enumerate(snfiles):
#         ## TODO: Adaptive size input
#         try:
#             sn_img = nib.load(os.path.join(sndir,file))
#             save_header = sn_img
#             sn_img = np.asarray(sn_img.get_fdata())
#             sn_img = np.nan_to_num(sn_img)
#
#             sn_img_flip = np.flip(sn_img, axis=0)
#
#             sn_padd = np.zeros([109,3*109])
#
#             sn_padd[9:91 + 9, 0:109] = np.rot90(sn_img_flip[45, :, :], 1)
#
#             # maxval was inserted just for visualization
#             tmp = np.rot90(sn_img_flip[:, 64, :], 1)
#             tmp[55-9:60-9, 0] = maxval
#             tmp[60-9, 0:3] = maxval
#             sn_padd[9:91 + 9, 109 + 9:109 + 9 + 91] = tmp
#
#             tmp = np.rot90(sn_img_flip[:, :, 38], 1)
#             tmp[55:60, 0] = maxval
#             tmp[60, 0:3] = maxval
#             sn_padd[:, 109+109+9:109+109+9+91] = tmp
#
#             # TODO: SNimg.png is used?
#             # fig = plt.figure(frameon=False)
#             # ax = fig.add_axes([0, 0, 1, 1])
#             # ax.axis('off')
#             #
#             # im = ax.imshow(sn_padd[0:105, :], vmin=0, vmax=maxval, cmap='nipy_spectral')
#             # plt.axis('off')
#             # divider = make_axes_locatable(ax)
#             # cax = divider.append_axes("right", size="5%", pad=0.05)
#             # plt.colorbar(im, cax=cax)
#             # plt.axis('off')
#             # fig.savefig('SNimg.png', format='png')
#             # plt.close(fig)
#
#             sn_crbl_L = np.sum(sn_img[0:45, :, :] * crbl_mask[0:45, :, :])/np.sum(crbl_mask[0:45, :, :])
#             sn_crbl_R = np.sum(sn_img[46:91, :, :] * crbl_mask[46:91, :, :]) / np.sum(crbl_mask[46:91, :, :])
#             sn_crbl_av = sn_crbl_L/2 + sn_crbl_R/2
#
#             sn_centil_crbl = np.sum(sn_img * centil_crbl) / np.sum(centil_crbl)
#
#             sn_img_idx = sn_img / sn_crbl_av
#             sn_img_idx_centil = sn_img / sn_centil_crbl
#
#             # Only produces cerebellum grey
#             sn_img_idx_blurred = nd.gaussian_filter(sn_img_idx, 8/2.355/2)
#             new_image = nib.Nifti1Image(sn_img_idx_blurred, affine=save_header.affine)
#
#             fsaverage = datasets.fetch_surf_fsaverage()
#             texture = surface.vol_to_surf(new_image, fsaverage.pial_right)
#
#             plt.rcParams["figure.figsize"] = (4, 3)
#             for th in np.arange(0.6, 3.0, 0.5):
#                 # [0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0]:
#                 float_th=round(th,1)
#                 fig = plotting.plot_surf(fsaverage.infl_right, texture, hemi='right',
#                                          threshold=float_th, bg_map=fsaverage.sulc_right, vmax=vmax, vmin=0, title=None,
#                                          cmap='black_red', view='lateral')
#                 full_path = os.path.join(case_fullpath, '_rlat_'+str(float_th)+'.png')
#                 fig.savefig(full_path, format='png', transparent=True)
#             plt.close('all')
#
#             plt.rcParams["figure.figsize"] = (4, 3)
#             for th in np.arange(0.6, 3.0, 0.5):
#                 # [0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0]:
#                 float_th=round(th,1)
#                 fig = plotting.plot_surf(fsaverage.infl_left, texture, hemi='left',
#                                          threshold=float_th, bg_map=fsaverage.sulc_left, vmax=vmax, vmin=0, title=None,
#                                          cmap='black_red', view='lateral')
#                 full_path = os.path.join(case_fullpath, '_llat_'+str(float_th)+'.png')
#                 fig.savefig(full_path, format='png', transparent=True)
#             plt.close('all')
#
#             plt.rcParams["figure.figsize"] = (4, 3)
#             for th in np.arange(0.6, 3.0, 0.5):
#                 # [0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0]:
#                 float_th=round(th,1)
#                 fig = plotting.plot_surf(fsaverage.infl_right, texture, hemi='right',
#                                          threshold=float_th, bg_map=fsaverage.sulc_right, vmax=vmax, vmin=0, title=None,
#                                          cmap='black_red', view = 'medial')
#                 full_path = os.path.join(case_fullpath, '_rmed_'+str(float_th)+'.png')
#                 fig.savefig(full_path, format='png', transparent=True)
#             plt.close('all')
#
#             plt.rcParams["figure.figsize"] = (4, 3)
#             for th in np.arange(0.6, 3.0, 0.5):
#                 # [0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0]:
#                 float_th=round(th,1)
#                 fig = plotting.plot_surf(fsaverage.infl_left, texture, hemi='left',
#                                          threshold=float_th, bg_map=fsaverage.sulc_left, vmax=vmax, vmin=0, title=None,
#                                          cmap='black_red', view = 'medial')
#                 full_path = os.path.join(case_fullpath, '_lmed_'+str(float_th)+'.png')
#                 fig.savefig(full_path, format='png', transparent=True)
#             plt.close('all')
#
#             # Centil Scale for PIB: 100*(pib_ctx_val- 1.009)/1.067;
#
#             centil_suvr[0, fnum] = np.sum(sn_img_idx * centil_crtx) / np.sum(centil_crtx)
#
#
#             for cnt, roi in enumerate(ROIS):
#                 roiimg = np.zeros_like(sn_img)
#                 for idxs in roi:
#                     roiimg = roiimg + (aalt_mask == idxs).astype(np.float64)
#                 idx_sum = np.sum(sn_img_idx * roiimg) / np.sum(roiimg)
#                 idx_sum_centil = np.sum(sn_img_idx_centil * roiimg) / np.sum(roiimg)
#                 aal_region[cnt, fnum, 0] = idx_sum
#                 if tracer_name.find('FBB') is not -1:
#                     aal_region[cnt, fnum, 1] = 153.4*(idx_sum_centil) - 154.9
#                     centil_suvr[1, fnum] = 153.4 * (
#                                 np.sum(sn_img_idx_centil * centil_crtx) / np.sum(centil_crtx)) - 154.9
#                 elif tracer_name.find('FBP') is not -1:
#                     aal_region[cnt, fnum, 1] = 196.9*(idx_sum_centil) - 196.03
#                     centil_suvr[1, fnum] = 196.9 * (
#                             np.sum(sn_img_idx_centil * centil_crtx) / np.sum(centil_crtx)) - 196.03
#                 elif tracer_name.find('FMM') is not -1:
#                     aal_region[cnt, fnum, 1] = 121.42*(idx_sum_centil) - 121.16
#                     centil_suvr[1, fnum] = 121.42 * (
#                             np.sum(sn_img_idx_centil * centil_crtx) / np.sum(centil_crtx)) - 121.16
#                 elif tracer_name.find('PIB') is not -1:
#                     aal_region[cnt, fnum, 1] = 100 * (idx_sum_centil - 1.009) / 1.067
#                     centil_suvr[1, fnum] = 100 * (
#                             np.sum(sn_img_idx_centil * centil_crtx) / np.sum(centil_crtx) - 1.009) / 1.067
#                 else:
#                     # TODO give 0 and indicate not provide?
#                     aal_region[cnt, fnum, 1] = 196.9*(idx_sum_centil) - 196.9
#                     centil_suvr[1, fnum] = 196.9 * (
#                             np.sum(sn_img_idx_centil * centil_crtx) / np.sum(centil_crtx)) - 196.9
#         except:
#             print('PROVIDE normalized image!\n', file=sys.stderr)
#             return 0
#
#     # # Preivous
#     # return aal_region_norm, aal_region, aal_count
#
#     # Current: only produce regional SUVR values and Centiloid SUVR
#     return aal_region, centil_suvr, sn_crbl_av
#
# # if __name__ == "__main__":
# #     # _quantification(sndir=r'D:\DNN_directSN\testResults\onlySeg_paper_Affine\02_17_07_09test_step1')
# #     _quantification(sndir=r'C:\Users\dwnusa\workspace\3_project\PET-Web\SN_template\uploads\case220')