from nibabel import load

import os
import time
import numpy as np

from dipy.align.imaffine import (MutualInformationMetric,
                                 AffineRegistration,
                                 transform_centers_of_mass)

from dipy.align.transforms import TranslationTransform3D



#################################
# Caution: numpy must be <=1.17 #
#################################

def coreg_mrc1(V2):
    # Average template
    V1 = os.path.join(os.getcwd(), 'TF_DirectSN', 'src', 'output_averageTM2.nii')

    I = load(V2)
    if len(I.shape) == 4:
        I = I.slicer[:, :, :, 0]

    J = load(V1)
    if len(J.shape) == 4:
        J = J.slicer[:, :, :, 0]

    static = J.get_fdata()
    static_grid2world = J.affine

    moving = I.get_fdata()
    moving_grid2world = I.affine

    # PET to MR dimension
    tic = time.time()

    c_of_mass = transform_centers_of_mass(static, static_grid2world,
                                          moving, moving_grid2world)

    nbins = 12
    metric = MutualInformationMetric(nbins, sampling_proportion=80)

    # Lower time cost: 10 10 5
    level_iters = [1000, 100, 10]

    sigmas = [3.0, 1.0, 1.0]
    factors = [4, 2, 1]

    affreg = AffineRegistration(metric=metric,
                                level_iters=level_iters,
                                sigmas=sigmas,
                                factors=factors)

    transform = TranslationTransform3D()
    params0 = None
    translation = affreg.optimize(static, moving, transform, params0, static_grid2world, moving_grid2world, starting_affine = c_of_mass.affine)


    translation.domain_shape = (91, 109, 112)
    translation.domain_grid2world = np.asarray([[-2, 0, 0, 90], [0, 2, 0, -126], [0, 0, 2, -92], [0, 0, 0, 1]])
    t_pet = translation.transform(moving)

    toc = time.time()
    print('Elapsed time for registration: %f sec' % (toc - tic))

    return t_pet
