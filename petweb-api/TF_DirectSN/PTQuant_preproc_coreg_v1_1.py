## django integration setting
# from django.conf import settings
import os

import scipy.ndimage.filters

from nibabel import load

import time
import numpy as np
import os

from dipy.align.imaffine import (AffineMap,
                                 MutualInformationMetric,
                                 AffineRegistration,
                                 transform_centers_of_mass)

from dipy.align.transforms import TranslationTransform3D

import scipy.misc


#################################
# Caution: numpy must be <=1.17 #
#################################

def coreg_mrc1(V2):
    # Average template
    # V1 = r'C:\Users\dwnusa\workspace\petweb\testing\TF_DirectSN\src\output_averageTM2.nii'
    # V1 = r'\Users\dwnusa\workspace\SNU\petweb\petweb-back\testing\TF_DirectSN\src\output_averageTM2.nii'
    V1 = os.path.join(os.getcwd(), 'TF_DirectSN', 'src', 'output_averageTM2.nii')
    # print(V1)

    I = load(V2)
    if len(I.shape) == 4:
        I = I.slicer[:,:,:,0]

    J = load(V1)
    if len(J.shape) == 4:
        J = J.slicer[:,:,:,0]

    print('Setting up registration...')
    tic = time.time()


    static = J.get_fdata()
    # static = np.pad(static, ((0,0), (0,0), (10,11)), mode="constant")
    static_grid2world = J.affine

    moving = I.get_fdata()
    moving = scipy.ndimage.filters.gaussian_filter(moving, sigma = 4 / 2.354)
    moving_grid2world = I.affine

    c_of_mass = transform_centers_of_mass(static, static_grid2world,
                                          moving, moving_grid2world)

    # translation_affine = np.array([[1, 0, 0, (-np.sign(I.affine[0,0])*90 - I.affine[0, 3])],
    #                                [0, 1, 0, (-np.sign(I.affine[1,1])*126 - I.affine[1, 3])],
    #                                [0, 0, 1, (-np.sign(I.affine[2,2])*72 - I.affine[2, 3])],
    #                                [0, 0, 0, 1]])
    # whole_affine = translation_affine.dot(I.affine)
    # moving_grid2world = whole_affine

    nbins = 8
    metric = MutualInformationMetric(nbins, sampling_proportion=80)

    level_iters = [1000, 100, 10]


    sigmas = [4.0, 2.0, 1.0]

    factors = [4, 2, 1]

    affreg = AffineRegistration(metric=metric,
                                level_iters=level_iters,
                                sigmas=sigmas,
                                factors=factors)

    transform = TranslationTransform3D()
    params0 = None

    translation = affreg.optimize(static, moving, transform, params0,
                                  static_grid2world, moving_grid2world, starting_affine = c_of_mass.affine)

    translation.domain_shape = (91, 109, 112)
    translation.domain_grid2world = np.asarray([[-2, 0, 0, 90], [0, 2, 0, -126], [0, 0, 2, -92], [0, 0, 0, 1]])

    t_pet = translation.transform(I.get_fdata())

    toc = time.time()
    print('  Registration time: %f sec' % (toc - tic))

    return t_pet