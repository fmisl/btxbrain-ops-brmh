import scipy.ndimage.filters

from nibabel import load

import time
import numpy as np
import os

from dipy.align.imaffine import (AffineMap,
                                 MutualInformationMetric,
                                 AffineRegistration)
from dipy.align.transforms import TranslationTransform3D

import scipy.misc

#################################
# Caution: numpy must be <=1.17 #
#################################

def coreg_mrc1(V2):
    # Average template
    V1 = r'C:\Users\dwnusa\workspace\petweb\testing\TF_DirectSN\src\output_averageTM2.nii'
    # V1 = r'D:\DNN_directSN\averageTemplate\output_averageTM2.nii'

    I = load(V2)
    if len(I.shape) == 4:
        I = I.slicer[:,:,:,0]

    J = load(V1)
    if len(J.shape) == 4:
        J = J.slicer[:,:,:,0]

    print('Setting up registration...')
    tic = time.time()


    static = J.get_fdata()
    static_grid2world = J.affine

    moving = I.get_fdata()
    moving = scipy.ndimage.filters.gaussian_filter(moving, sigma = 4 / 2.354)

    translation_affine = np.array([[1, 0, 0, (-np.sign(I.affine[0,0])*90 - I.affine[0, 3])],
                                   [0, 1, 0, (-np.sign(I.affine[1,1])*126 - I.affine[1, 3])],
                                   [0, 0, 1, (-np.sign(I.affine[2,2])*72 - I.affine[2, 3])],
                                   [0, 0, 0, 1]])
    whole_affine = translation_affine.dot(I.affine)
    moving_grid2world = whole_affine

    nbins = 10
    sampling_prop = 100
    metric = MutualInformationMetric(nbins, sampling_prop)

    level_iters = [1000, 100, 10]


    sigmas = [3.0, 1.0, 0.0]

    factors = [4, 2, 1]

    affreg = AffineRegistration(metric=metric,
                                level_iters=level_iters,
                                sigmas=sigmas,
                                factors=factors)

    transform = TranslationTransform3D()
    params0 = None

    translation = affreg.optimize(static, moving, transform, params0,
                                  static_grid2world, moving_grid2world)

    translation.domain_shape = (91, 109, 112)
    translation.domain_grid2world = np.asarray([[-2, 0, 0, 90], [0, 2, 0, -126], [0, 0, 2, -92], [0, 0, 0, 1]])

    t_pet = translation.transform(I.get_fdata())

    toc = time.time()
    print('  Registration time: %f sec' % (toc - tic))

    return t_pet


#
#
# import scipy.ndimage.filters
#
# from nibabel import load
#
# import time
# import numpy as np
# import os
#
# from dipy.align.imaffine import (AffineMap,
#                                  MutualInformationMetric,
#                                  AffineRegistration)
# from dipy.align.transforms import TranslationTransform3D
#
# import scipy.misc
#
# #################################
# # Caution: numpy must be <=1.17 #
# #################################
#
# def coreg_mrc1(V2):
#     # Average template
#     V1 = r'C:\Users\dwnusa\workspace\3_project\PET-Web\SN_template\testing\TF_DirectSN\src\output_averageTM2.nii'
#
#     I = load(V2)
#     if len(I.shape) == 4:
#         I = I.slicer[:,:,:,0]
#
#     J = load(V1)
#     if len(J.shape) == 4:
#         J = J.slicer[:,:,:,0]
#
#     print('Setting up registration...')
#     tic = time.time()
#
#
#     static = J.get_fdata()
#     static_grid2world = J.affine
#
#     moving = I.get_fdata()
#     moving = scipy.ndimage.filters.gaussian_filter(moving, sigma = 4 / 2.354)
#     moving_grid2world = I.affine
#
#     nbins = 8
#     sampling_prop = 80
#     metric = MutualInformationMetric(nbins, sampling_prop)
#
#     level_iters = [500, 50, 5]
#
#
#     sigmas = [3.0, 1.0, 0.0]
#
#     factors = [4, 2, 1]
#
#     affreg = AffineRegistration(metric=metric,
#                                 level_iters=level_iters,
#                                 sigmas=sigmas,
#                                 factors=factors)
#
#     transform = TranslationTransform3D()
#     params0 = None
#
#     translation = affreg.optimize(static, moving, transform, params0,
#                                   static_grid2world, moving_grid2world)
#
#     translation.domain_shape = (91, 109, 112)
#     translation.domain_grid2world = np.asarray([[-2, 0, 0, 90], [0, 2, 0, -126], [0, 0, 2, -92], [0, 0, 0, 1]])
#
#     t_pet = translation.transform(I.get_fdata())
#
#     toc = time.time()
#     print('  Registration time: %f sec' % (toc - tic))
#
#     return t_pet
