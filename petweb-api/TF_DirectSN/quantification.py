import os
import shutil
import sys
import numpy as np
import matplotlib.pyplot as plt
import nibabel as nib
from mpl_toolkits.axes_grid1 import make_axes_locatable
from PIL import Image
from django.conf import settings
from .. import models

Frontal_L = range(3,35,2)
Frontal_R = range(4,35,2)

Cingulate_L = range(35,68,32)
Cingulate_R = range(36,69,32)

Striatum_L = range(59,67,2)
Striatum_R = range(60,67,2)

Thalamus_L = range(79,91,2)
Thalamus_R = range(80,91,2)


# C:\Users\dwnusa\workspace\3_project\PET-Web\SN_DL_v2\testResults\coregpy\06_22_10_10test\eval_gimg_test.img
def quantification(sndir, maxval=100):
    crbl_path = os.path.join(settings.BASE_DIR, "testing", "TF_DirectSN", "src", 'fcrbll_fnirt_thr50_wo_vermis.img')
    aalt_path = os.path.join(settings.BASE_DIR, "testing", "TF_DirectSN", "src", 'faalnumconvergion_paper.img')

    t1_path = 'fTPM_2.img'

    # crbl_mask = np.reshape(np.fromfile(crbl_path, dtype=np.int32), [91, 109, 91])
    # aalt_mask = np.reshape(np.fromfile(aalt_path, dtype=np.int16), [91, 109, 91])

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
    # try:
    #     t1_img = nib.load(t1_path)
    #     t1_img = np.asarray(t1_img.get_fdata())
    # except:
    #     print('PROVIDE AAL mask!\n', file=sys.stderr)
    #     return 0

    snfiles = os.listdir(os.path.join(sndir))
    snfiles = [file for file in snfiles if file.startswith('output') and file.endswith('.img')]

    aal_region = np.zeros([8, int(len(snfiles))])
    aal_count = np.zeros([8, int(len(snfiles))])

    plt.rcParams["figure.figsize"] = (8, 2.5)

    for fnum, file in enumerate(snfiles):
        ## TODO: Adaptive size input
        try:
            sn_img = nib.load(os.path.join(sndir,file))
            sn_img = np.asarray(sn_img.get_fdata())
            sn_img = np.nan_to_num(sn_img)

            sn_img_flip = np.flip(sn_img, axis=0)

            sn_padd = np.zeros([109,3*109])


            sn_padd[9:91 + 9, 0:109] = np.rot90(sn_img_flip[45, :, :], 1)

            tmp = np.rot90(sn_img_flip[:, 64, :], 1)
            tmp[55-9:60-9, 0] = maxval
            tmp[60-9, 0:3] = maxval
            sn_padd[9:91 + 9, 109 + 9:109 + 9 + 91] = tmp

            tmp = np.rot90(sn_img_flip[:, :, 38], 1)
            tmp[55:60, 0] = maxval
            tmp[60, 0:3] = maxval
            sn_padd[:, 109+109+9:109+109+9+91] = tmp

            # t1_padd = np.zeros([109, 3 * 109])
            # t1_padd[9:91 + 9, 0:109] = np.rot90(t1_img_flip[45, :, :], 1)
            # t1_padd[9:91 + 9, 109 + 9:109 + 9 + 91] = np.rot90(t1_img_flip[:, 64, :], 1)
            # t1_padd[:, 109 + 109 + 9:109 + 109 + 9 + 91] = np.rot90(t1_img_flip[:, :, 38], 1)

            fig = plt.figure(frameon=False)
            ax = fig.add_axes([0, 0, 1, 1])
            ax.axis('off')

            im = ax.imshow(sn_padd[0:105, :], vmin=0, vmax=maxval, cmap='nipy_spectral')
            plt.axis('off')
            divider = make_axes_locatable(ax)
            cax = divider.append_axes("right", size="5%", pad=0.05)
            plt.colorbar(im, cax=cax)
            plt.axis('off')
            fig.savefig('SNimg.png', format='png')


            # fig = plt.figure(frameon=False)
            # ax = fig.add_axes([0, 0, 1, 1])
            # ax.axis('off')

            # im = ax.imshow(t1_padd[0:105, :], vmin=0, vmax=np.max(t1_img[45, :, :]), cmap='gray')
            # plt.axis('off')
            # divider = make_axes_locatable(ax)
            # cax = divider.append_axes("right", size="5%", pad=0.05)
            # plt.colorbar(im, cax=cax)
            # plt.axis('off')
            # fig.savefig('T1.png', format='png')



            # image1 = Image.open("./SNimg.png")
            # image2 = Image.open("./T1.png")
            # image5 = image1.convert("RGBA")
            # image6 = image2.convert("RGBA")
            #
            # alphaBlended1 = Image.blend(image5, image6, alpha=0.5)
            # alphaBlended1.save('blend.png')

            sn_crbl_L = np.sum(sn_img[0:45, :, :]*crbl_mask[0:45, :, :])/np.sum(crbl_mask[0:45, :, :])
            sn_crbl_R = np.sum(sn_img[46:91, :, :] * crbl_mask[46:91, :, :]) / np.sum(crbl_mask[46:91, :, :])
            sn_crbl_av = sn_crbl_L/2 + sn_crbl_R/2

            sn_img_idx = sn_img/sn_crbl_av



            for i in range(0,91):
                for j in range(0,109):
                    for k in range(0,91):
                        if aalt_mask[i,j,k] <= 90 and aalt_mask[i,j,k] >= 1:
                            if np.sum(Frontal_L == aalt_mask[i,j,k]):
                                aal_region[1-1, fnum] = aal_region[1-1, fnum] + sn_img_idx[i, j, k]
                                aal_count[1-1, fnum] = aal_count[1-1, fnum] + 1
                            elif np.sum(Frontal_R == aalt_mask[i,j,k]):
                                aal_region[2-1, fnum] = aal_region[2-1, fnum] + sn_img_idx[i, j, k]
                                aal_count[2-1, fnum] = aal_count[2-1, fnum] + 1
                            elif np.sum(Cingulate_L == aalt_mask[i, j, k]):
                                aal_region[3-1, fnum] = aal_region[3-1, fnum] + sn_img_idx[i, j, k]
                                aal_count[3-1, fnum] = aal_count[3-1, fnum] + 1
                            elif np.sum(Cingulate_R == aalt_mask[i, j, k]):
                                aal_region[4-1, fnum] = aal_region[4-1, fnum] + sn_img_idx[i, j, k]
                                aal_count[4-1, fnum] = aal_count[4-1, fnum] + 1
                            # elif np.sum(Occipital_L == aalt_mask[i, j, k]):
                            #     aal_region[5-1, fnum] = aal_region[5-1, fnum] + sn_img_idx[i, j, k]
                            #     aal_count[5-1, fnum] = aal_count[5-1, fnum] + 1
                            # elif np.sum(Occipital_R == aalt_mask[i, j, k]):
                            #     aal_region[6-1, fnum] = aal_region[6-1, fnum] + sn_img_idx[i, j, k]
                            #     aal_count[6-1, fnum] = aal_count[6-1, fnum] + 1
                            # elif np.sum(Parietal_L == aalt_mask[i, j, k]):
                            #     aal_region[7-1, fnum] = aal_region[7-1, fnum] + sn_img_idx[i, j, k]
                            #     aal_count[7-1, fnum] = aal_count[7-1, fnum] + 1
                            # elif np.sum(Parietal_R == aalt_mask[i, j, k]):
                            #     aal_region[8-1, fnum] = aal_region[8-1, fnum] + sn_img_idx[i, j, k]
                            #     aal_count[8-1, fnum] = aal_count[8-1, fnum] + 1
                            elif np.sum(Striatum_L == aalt_mask[i, j, k]):
                                aal_region[5-1, fnum] = aal_region[5-1, fnum] + sn_img_idx[i, j, k]
                                aal_count[5-1, fnum] = aal_count[5-1, fnum] + 1
                            elif np.sum(Striatum_R == aalt_mask[i, j, k]):
                                aal_region[6-1, fnum] = aal_region[6-1, fnum] + sn_img_idx[i, j, k]
                                aal_count[6-1, fnum] = aal_count[6-1, fnum] + 1
                            # elif np.sum(Temporal_L == aalt_mask[i, j, k]):
                            #     aal_region[11-1, fnum] = aal_region[11-1, fnum] + sn_img_idx[i, j, k]
                            #     aal_count[11-1, fnum] = aal_count[11-1, fnum] + 1
                            # elif np.sum(Temporal_R == aalt_mask[i, j, k]):
                            #     aal_region[12-1, fnum] = aal_region[12-1, fnum] + sn_img_idx[i, j, k]
                            #     aal_count[12-1, fnum] = aal_count[12-1, fnum] + 1
                            elif np.sum(Thalamus_L == aalt_mask[i, j, k]):
                                aal_region[7-1, fnum] = aal_region[7-1, fnum] + sn_img_idx[i, j, k]
                                aal_count[7-1, fnum] = aal_count[7-1, fnum] + 1
                            elif np.sum(Thalamus_R == aalt_mask[i, j, k]):
                                aal_region[8-1, fnum] = aal_region[8-1, fnum] + sn_img_idx[i, j, k]
                                aal_count[8-1, fnum] = aal_count[8-1, fnum] + 1
        except:
            print('PROVIDE normalized image!\n', file=sys.stderr)
            return 0

    aal_region_norm = aal_region/aal_count

    aal_global = np.sum(aal_region) / np.sum(aal_count)

    return aal_region_norm, aal_region, aal_count


# if __name__ == "__main__":
#     quantification()