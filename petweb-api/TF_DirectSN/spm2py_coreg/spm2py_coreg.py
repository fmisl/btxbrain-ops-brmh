import numpy as np

from nipy import load_image
from nipy.algorithms.registration import HistogramRegistration, resample

import time

#################################
# Caution: numpy must be <=1.17 #
#################################

def coreg(V2, V1 = 'C:\\Users\SKKang\Downloads\\fMNI152_T1_2mm.img'):
    # execute only if run as a script
    V1 = 'C:\\Users\SKKang\Downloads\\fMNI152_T1_2mm.img'
    # V2 = 'C:\\Users\\SKKang\\Downloads\\12903102_KANGKIJEONG_C11PiB_20161123.img'

    similarity = 'crl1'
    renormalize = False
    interp = 'pv'
    optimizer = 'powell'
    tol = 1e-8

    I = load_image(V2)
    J = load_image(V1)

    print('Setting up registration...')
    tic = time.time()
    R = HistogramRegistration(I, J, similarity='nmi', interp='pv',
                              renormalize=False, smooth=1)
    T = R.optimize('rigid', optimizer=optimizer, ftol=1e-5)
    toc = time.time()
    print('  Registration time: %f sec' % (toc - tic))

    # Resample source image
    print('Resampling source image...')
    tic = time.time()
    # It = resample2(I, J.coordmap, T.inv(), J.shape)
    It = resample(I, T.inv(), reference=J)
    toc = time.time()
    print('  Resampling time: %f sec' % (toc - tic))

    return It.get_data()