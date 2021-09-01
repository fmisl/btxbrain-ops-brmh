import os
import nibabel as nib
import numpy as np
from PIL import Image
import matplotlib.pyplot as plt
import matplotlib.cm as cm
from scipy import ndimage as nd
import cv2
# filepath=r'C:\Users\dwnusa\workspace\petweb\petweb-back\uploads\dwnusa\database\8\input_8.img'
filepath=r'C:\Users\dwnusa\workspace\petweb\petweb-back\uploads\dwnusa\database\10\output_10.nii'
# filepath=r'C:\Users\dwnusa\workspace\petweb\petweb-back\testing\test_code\MNI152_T1_2mm.nii'
target_folder=r'C:\Users\dwnusa\workspace\petweb\petweb-back\testing\test_code'

nimg3D = nib.load(filepath)  # 이미지 불러오기
img3D = np.array(nimg3D.dataobj)  # numpy array로 변환
[cx, cy, cz] = np.around(np.array(img3D.shape)/2).astype(np.uint8)
# img3D_2mm = nd.interpolation.zoom(np.squeeze(img3D), zoom=dsfactor)  # 2mm 픽셀로 스케일 변환

uint8_img3D = (img3D - img3D.min()) / (img3D.max() - img3D.min())
uint8_img3D = 100 * uint8_img3D
# uint8_img3D = uint8_img3D.astype(np.uint8)

# uint8_img2D = uint8_img3D[:, :, cz]
plt.figure()
origin = 'upper'
maxStep = 50
f, axarr = plt.subplots(3,maxStep)
for i in range(maxStep):
    angle=i*3/180*np.pi
    print(i,angle)
    c=np.cos(angle)
    s=np.sin(angle)

    c_in=0.5*np.array(img3D.shape)
    c_out=np.array(img3D.shape)
    transform1=np.array([[c,-s,0],[s,c,0],[0,0,1]])
    transform2=np.array([[c,0,-s],[0,1,0],[s,0,c]])
    # transform3=np.array([[1,0,0],[0,1,0],[0,0,1]])
    offset1=c_in-c_out.dot(transform1)
    dst1=nd.interpolation.affine_transform(uint8_img3D,transform1.T,order=3,offset=offset1,output_shape=2*c_out,cval=0.0,output=np.float32)
    offset2=c_in-c_out.dot(transform2)
    dst2=nd.interpolation.affine_transform(uint8_img3D,transform2.T,order=3,offset=offset2,output_shape=2*c_out,cval=0.0,output=np.float32)
    # offset2=c_in-c_out.dot(transform3)
    # dst2=nd.interpolation.affine_transform(uint8_img3D,transform3.T,order=3,offset=offset2,output_shape=2*c_out,cval=0.0,output=np.float32)
    # dst1 = nd.interpolation.zoom(np.squeeze(dst1), zoom=dsfactor)  # 2mm 픽셀로 스케일 변환
    [sx, sy, sz] = dst1.shape
    [offsetX, offsetY, offsetZ] = np.uint16(np.array([sx, sy, sz])/4)
    crop1 = dst1[offsetX:sx-offsetX-1, offsetY:sy-offsetY-1, offsetZ:sz-offsetZ-1]
    crop2 = dst2[offsetX:sx-offsetX-1, offsetY:sy-offsetY-1, offsetZ:sz-offsetZ-1]
    # row_proj = np.rot90(dst[:, :, :].sum(axis=0)) # row
    column_proj1 = np.rot90(crop1[:, :, :].sum(axis=0)) # row
    column_proj2 = np.rot90(crop2[:, :, :].sum(axis=0)) # row
    # depth_proj = np.rot90(dst[:, :, :].sum(axis=2)) # row
    # axarr[0,i].imshow(row_proj, interpolation='nearest', origin=origin,cmap=cm.gray);axarr[0,i].axis('off');
    # axarr[1,i].imshow(column_proj, interpolation='nearest', origin=origin,cmap=cm.gray);axarr[1,i].axis('off');
    # axarr[2,i].imshow(depth_proj, interpolation='nearest', origin=origin,cmap=cm.gray);axarr[2,i].axis('off');

    # file_name = "_row_" + str(i) + ".png"
    # full_path = os.path.join(target_folder, file_name)
    # reg_img = (row_proj - row_proj.min()) / (row_proj.max() - row_proj.min())
    # reg_img = 255 * reg_img
    # Image.fromarray(reg_img.astype(np.uint8)).save(full_path)

    file_name = "_column1_" + str(i) + ".png"
    full_path = os.path.join(target_folder, file_name)
    reg_img = (column_proj1 - column_proj1.min()) / (column_proj1.max() - column_proj1.min())
    reg_img = 255 * reg_img
    Image.fromarray(reg_img.astype(np.uint8)).save(full_path)

    file_name = "_column2_" + str(i) + ".png"
    full_path = os.path.join(target_folder, file_name)
    reg_img = (column_proj2 - column_proj2.min()) / (column_proj2.max() - column_proj2.min())
    reg_img = 255 * reg_img
    Image.fromarray(reg_img.astype(np.uint8)).save(full_path)

    # file_name = "_depth_" + str(i) + ".png"
    # full_path = os.path.join(target_folder, file_name)
    # reg_img = (depth_proj - depth_proj.min()) / (depth_proj.max() - depth_proj.min())
    # reg_img = 255 * reg_img
    # Image.fromarray(reg_img.astype(np.uint8)).save(full_path)
# plt.show()