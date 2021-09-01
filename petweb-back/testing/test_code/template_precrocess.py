import os
import nibabel as nib
import numpy as np
from PIL import Image
import matplotlib.pyplot as plt
import matplotlib.cm as cm
from scipy import ndimage as nd
import math
import cv2
import base64
import json
import csv
# filepath=r'C:\Users\dwnusa\workspace\petweb\petweb-back\uploads\dwnusa\database\8\input_8.img'
filepath=r'C:\Users\dwnusa\workspace\petweb-develop\petweb\petweb-back\testing\TF_DirectSN\src\MNI152_T1_2mm.nii'
# filepath=r'C:\Users\dwnusa\workspace\petweb\petweb-back\testing\test_code\MNI152_T1_2mm.nii'
target_folder=r'C:\Users\dwnusa\workspace\petweb-develop\petweb\petweb-back\testing\test_code\mni'

nimg3D = nib.load(filepath)  # 이미지 불러오기
img3D = np.array(nimg3D.dataobj)  # numpy array로 변환
dsfactor = [float(f) / w for w, f in zip([2, 2, 2], nimg3D.header['pixdim'][1:4])] # 픽셀크기 2mm로 변환용 factor

img3D_2mm = nd.interpolation.zoom(np.squeeze(img3D), zoom=dsfactor, order=1)  # 2mm 픽셀로 스케일 변환
img3D_2mm = np.pad(img3D_2mm, ((50, 50), (50, 50), (50, 50)), mode='constant')
zoomedX, zoomedY, zoomedZ = img3D_2mm.shape
cX, cY, cZ = [math.floor(zoomedX / 2), math.floor(zoomedY / 2), math.floor(zoomedZ / 2)]  # 중심 좌표 계산
xPadding = 20
yPadding = 10
offsetX, offsetY, offsetZ = [math.floor(min(91, zoomedX) / 2 + xPadding), math.floor(min(109, zoomedY) / 2 + yPadding),
                             math.floor(min(91, zoomedZ) / 2)]
img3D_crop = img3D_2mm[cX - offsetX:cX + offsetX + 1, cY - offsetY:cY + offsetY + 1, cZ - offsetZ:cZ + offsetZ + 1]

# dsfactor2 = [float(f) / w for w, f in zip([img3D_crop.shape[0], img3D_crop.shape[1], img3D_crop.shape[2]], [91, 109, 91])] # 픽셀크기 2mm로 변환용 factor
# img3D_crop = nd.interpolation.zoom(np.squeeze(img3D_crop), zoom=dsfactor2) # 2mm 픽셀로 스케일 변환
# img3D_2mm = nd.interpolation.zoom(np.squeeze(img3D), zoom=dsfactor) # 2mm 픽셀로 스케일 변환

vx, vy, vz = img3D_crop.shape  # 크기는 (91, 109, 91) 이어야함

reg_img3D = (img3D_crop - img3D_crop.min()) / (img3D_crop.max() - img3D_crop.min())
scale_img3D = 32767 * reg_img3D
uint16_img3D = scale_img3D.astype(np.uint16)

# axial plane
list_axial = []
list_coronal = []
list_sagittal = []
for iz in range(vz):
    # # colored_image = cm1(uint8_img2D)
    # # colored_image2 = cm2(uint8_img2D)
    # file_name = "input_" + "axial_" + str(iz) + ".png"
    # full_path = os.path.join(target_folder, file_name)

    uint16_img2D = uint16_img3D[:, :, iz]
    # if InputAffineZ2 >= 0:
    #     uint16_img2D = uint16_img3D[:,:,iz]
    # else:
    #     uint16_img2D = uint16_img3D[:,:,uint16_img3D.shape[2]-1-iz]
    uint16_img2D = np.rot90(uint16_img2D)
    width, height = 91 + 2 * xPadding, 109 + 2 * yPadding  # (x axis, y axis)
    resized_img = cv2.resize(uint16_img2D, (width, height))
    # inverted_resized_img = -resized_img + 32767
    b64 = base64.b64encode(resized_img).decode('utf-8')
    full_path = os.path.join(target_folder, "MNI152_T1_2mm_z_"+str(iz)+".png")
    Image.fromarray(resized_img.astype(np.uint16)).save(full_path)
    # inverted_b64 = base64.b64encode(inverted_resized_img).decode('utf-8')
    list_axial.append(b64)
# coronal plane
# text_file = open("MNI152_T1_2mm_z.txt", "w")
for iy in range(vy):
    # uint8_img2D = uint8_img3D[:,iy,:]
    # uint8_img2D = np.rot90(uint8_img2D)
    # # colored_image = cm1(uint8_img2D)
    # # colored_image2 = cm2(uint8_img2D)
    # file_name = "input_" + "coronal_" + str(iy) + ".png"
    # full_path = os.path.join(target_folder, file_name)
    # Image.fromarray(uint8_img2D.astype(np.uint8)).save(full_path)

    uint16_img2D = uint16_img3D[:, iy, :]
    # if InputAffineY1 >= 0:
    #     uint16_img2D = uint16_img3D[:,iy,:]
    # else:
    #     uint16_img2D = uint16_img3D[:,uint16_img3D.shape[1]-1-iy,:]

    # if InputAffineY1 >= 0:
    #     uint16_img2D=uint16_img2D_plus
    # else:
    #     uint16_img2D=uint16_img2D_minus

    uint16_img2D = np.rot90(uint16_img2D)
    width, height = 91 + 2 * xPadding, 91
    resized_img = cv2.resize(uint16_img2D, (width, height))

    # file_name = "input_" + "coronal_" + str(iy) + ".png"
    # full_path = os.path.join(target_folder, file_name)
    # Image.fromarray(resized_img.astype(np.uint16)).save(full_path)
    #
    # file_name = "input_" + "coronal_" + str(iy) + ".png"
    # full_path = os.path.join(target_folder, file_name)
    # Image.fromarray(resized_img.astype(np.uint16)).save(full_path)

    # inverted_resized_img = -resized_img + 32767
    b64 = base64.b64encode(resized_img).decode('utf-8')
    full_path = os.path.join(target_folder, "MNI152_T1_2mm_y_"+str(iy)+".png")
    Image.fromarray(resized_img.astype(np.uint16)).save(full_path)
    # inverted_b64 = base64.b64encode(inverted_resized_img).decode('utf-8')
    list_coronal.append(b64)
for ix in range(vx):
    # uint8_img2D = uint8_img3D[ix,:,:]
    # uint8_img2D = np.rot90(uint8_img2D)
    # # colored_image = cm1(uint8_img2D)
    # # colored_image2 = cm2(uint8_img2D)
    # Image.fromarray(uint8_img2D.astype(np.uint8)).save(full_path)

    uint16_img2D = uint16_img3D[ix, :, :]
    # if InputAffineX0 >= 0:
    #     uint16_img2D = uint16_img3D[ix,:,:]
    # else:
    #     uint16_img2D = uint16_img3D[uint16_img3D.shape[0]-1-ix,:,:]
    uint16_img2D = np.rot90(uint16_img2D)
    width, height = 109 + 2 * yPadding, 91
    resized_img = cv2.resize(uint16_img2D, (width, height))

    # file_name = "input_" + "sagittal_" + str(ix) + ".png"
    # full_path = os.path.join(target_folder, file_name)
    # Image.fromarray(resized_img.astype(np.uint16)).save(full_path)

    # inverted_resized_img = -resized_img + 32767
    b64 = base64.b64encode(resized_img).decode('utf-8')
    full_path = os.path.join(target_folder, "MNI152_T1_2mm_x_"+str(ix)+".png")
    Image.fromarray(resized_img.astype(np.uint16)).save(full_path)
    # inverted_b64 = base64.b64encode(inverted_resized_img).decode('utf-8')
    list_sagittal.append(b64)

text_file_z = open("MNI152_T1_2mm_z.json", "w")
json.dump(list_axial, text_file_z)
text_file_z.close()
text_file_y = open("MNI152_T1_2mm_y.json", "w")
json.dump(list_coronal, text_file_y)
text_file_y.close()
text_file_x = open("MNI152_T1_2mm_x.json", "w")
json.dump(list_sagittal, text_file_x)
text_file_x.close()