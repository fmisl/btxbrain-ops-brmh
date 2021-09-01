import os
import json
import time
import copy
import nibabel as nib
import numpy as np
import pandas as pd
import sqlite3
from scipy import ndimage as nd
import base64
import cv2
from PIL import Image
import math
import datetime as dt
from matplotlib import cm

def extract_slices(dbPath, prefix, nimg3D, inout_path, fileID):

    img3D = np.array(nimg3D.dataobj)
    target_mip_size = [91, 109, 91]

    xPadding = 20
    yPadding = 10
    if prefix=="input":

        dsfactor = [float(f) / w for w, f in zip([2, 2, 2], nimg3D.header['pixdim'][1:4])]  # 픽셀크기 2mm로 변환용 factor
        img3D = nd.interpolation.zoom(np.squeeze(img3D), zoom=dsfactor, order=1) # 2mm 픽셀로 스케일 변환
        img3D = np.pad(img3D, ((50, 50), (50, 50), (50, 50)), mode='constant')
        zoomedX, zoomedY, zoomedZ = img3D.shape
        cX, cY, cZ = [math.floor(zoomedX / 2), math.floor(zoomedY / 2),
                      math.floor(zoomedZ / 2)]  # 중심 좌표 계산
        # xPadding = 20
        offsetX, offsetY, offsetZ = [math.floor(min(91, zoomedX) / 2 + xPadding),
                                     math.floor(min(109, zoomedY) / 2 + yPadding),
                                     math.floor(min(91, zoomedZ) / 2)]
        img3D = img3D[cX - offsetX:cX + offsetX + 1, cY - offsetY:cY + offsetY + 1,
                cZ - offsetZ:cZ + offsetZ + 1]
        vx, vy, vz = img3D.shape
        norm_img3D = (img3D - img3D.min()) / (img3D.max() - img3D.min())
        float_img3D = 32767 * norm_img3D

        uint16_img3D = (img3D - img3D.min()) / (img3D.max() - img3D.min())
        uint16_img3D = 32767 * uint16_img3D
        uint16_img3D = uint16_img3D.astype(np.uint16)
        for iz in range(vz):
            uint16_img2D = uint16_img3D[:, :, iz]
            uint16_img2D = np.rot90(uint16_img2D)
            width, height = 91 + 2 * xPadding, 109 + 2 * yPadding
            resized_img = cv2.resize(uint16_img2D, (width, height))
            file_name = prefix+"_" + "axial_" + str(iz) + ".png"
            # full_path = os.path.join(inout_path, file_name)
            # Image.fromarray(resized_img).save(full_path)

            b64 = base64.b64encode(resized_img).decode('utf-8')
            now = dt.datetime.now()
            conn = sqlite3.connect(dbPath)
            cur1 = conn.cursor()
            cur1.execute("""INSERT INTO testing_slice VALUES (null, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                         (str(now), prefix, iz, "axial", width, height, 32767, b64, fileID,))
            conn.commit()
            conn.close()

        for iy in range(vy):
            uint16_img2D = uint16_img3D[:, iy, :]
            uint16_img2D = np.rot90(uint16_img2D)
            width, height = 91 + 2 * xPadding, 91
            resized_img = cv2.resize(uint16_img2D, (width, height))
            file_name = prefix+"_" + "coronal_" + str(iy) + ".png"
            # full_path = os.path.join(inout_path, file_name)
            # Image.fromarray(resized_img).save(full_path)

            b64 = base64.b64encode(resized_img).decode('utf-8')
            now = dt.datetime.now()
            conn = sqlite3.connect(dbPath)
            cur1 = conn.cursor()
            cur1.execute("""INSERT INTO testing_slice VALUES (null, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                         (str(now), prefix, iy, "coronal", width, height, 32767, b64, fileID,))
            conn.commit()
            conn.close()

        for ix in range(vx):
            uint16_img2D = uint16_img3D[ix, :, :]
            uint16_img2D = np.rot90(uint16_img2D)
            width, height = 109 + 2 * yPadding, 91
            resized_img = cv2.resize(uint16_img2D, (width, height))
            file_name = prefix+"_" + "sagittal_" + str(ix) + ".png"
            # full_path = os.path.join(inout_path, file_name)
            # Image.fromarray(resized_img).save(full_path)

            b64 = base64.b64encode(resized_img).decode('utf-8')
            now = dt.datetime.now()
            conn = sqlite3.connect(dbPath)
            cur1 = conn.cursor()
            cur1.execute("""INSERT INTO testing_slice VALUES (null, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                         (str(now), prefix, ix, "sagittal", width, height, 32767, b64, fileID,))
            conn.commit()
            conn.close()

        maxStep = 45

        uniformImg = float_img3D > 1
        for i in range(maxStep):
            # print(i)
            angle1 = i * 8 / 180 * np.pi
            c1 = np.cos(angle1)
            s1 = np.sin(angle1)

            c_in = 0.5 * np.array(float_img3D.shape)
            c_out = np.array(float_img3D.shape)
            transform = np.array([[c1, -s1, 0], [s1, c1, 0], [0, 0, 1]])
            offset = c_in - c_out.dot(transform)
            dst1 = nd.interpolation.affine_transform(float_img3D, transform.T, order=0, offset=offset,
                                                     output_shape=2 * c_out, cval=0.0,
                                                     output=np.float32)

            [sx, sy, sz] = dst1.shape
            [offsetX, offsetY, offsetZ] = np.uint16(np.array([sx, sy, sz]) / 6)
            crop1 = dst1[offsetX:sx - offsetX - 1, offsetY:sy - offsetY - 1, offsetZ:sz - offsetZ - 1]
            proj = np.max(crop1, axis=0)
            column_proj1 = np.rot90(proj)
            column_proj1 = np.clip(column_proj1, 0, 32767)
            column_proj1 = column_proj1.astype(np.uint16)
            file_name = "mip_output_axial_" + str(i) + ".png"
            reg_img = column_proj1.astype(np.uint16)
            # width, height = 109, 91
            width, height = target_mip_size[1:3]
            resized_img = cv2.resize(reg_img, (width + 2 * yPadding, height))
            file_name = "mip_"+prefix+"_axial_" + str(i) + ".png"
            # full_path = os.path.join(inout_path, file_name)
            # Image.fromarray(resized_img).save(full_path)

            b64 = base64.b64encode(resized_img).decode('utf-8')
            conn = sqlite3.connect(dbPath)
            cur1 = conn.cursor()
            cur1.execute("""INSERT INTO testing_slice VALUES (null, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                         (str(now), prefix, i, "mip", width, height, 32767, b64, fileID,))
            conn.commit()
            conn.close()
        print("Step1: created input image")
    elif prefix=="output":
        dsfactor = [float(f) / w for w, f in zip([2, 2, 2], nimg3D.header['pixdim'][1:4])]  # 픽셀크기 2mm로 변환용 factor
        img3D = nd.interpolation.zoom(np.squeeze(img3D), zoom=dsfactor, order=1) # 2mm 픽셀로 스케일 변환
        img3D = np.pad(img3D, ((50, 50), (50, 50), (50, 50)), mode='constant')
        zoomedX, zoomedY, zoomedZ = img3D.shape
        cX, cY, cZ = [math.floor(zoomedX / 2), math.floor(zoomedY / 2),
                      math.floor(zoomedZ / 2)]  # 중심 좌표 계산
        # xPadding = 20
        offsetX, offsetY, offsetZ = [math.floor(min(91, zoomedX) / 2 + xPadding),
                                     math.floor(min(109, zoomedY) / 2 + yPadding),
                                     math.floor(min(91, zoomedZ) / 2)]
        img3D = img3D[cX - offsetX:cX + offsetX + 1, cY - offsetY:cY + offsetY + 1,
                cZ - offsetZ:cZ + offsetZ + 1]
        vx, vy, vz = img3D.shape
        norm_img3D = (img3D - img3D.min()) / (img3D.max() - img3D.min())
        float_img3D = 32767 * norm_img3D

        uint16_img3D = (img3D - img3D.min()) / (img3D.max() - img3D.min())
        uint16_img3D = 32767 * uint16_img3D
        uint16_img3D = uint16_img3D.astype(np.uint16)
        for iz in range(vz):
            uint16_img2D = uint16_img3D[:, :, iz]
            uint16_img2D = np.rot90(uint16_img2D)
            width, height = 91 + 2 * xPadding, 109 + 2 * yPadding
            resized_img = cv2.resize(uint16_img2D, (width, height))
            file_name = "output_" + "axial_" + str(iz) + ".png"
            full_path = os.path.join(inout_path, file_name)
            normed_img = (resized_img - 0) / (32767 - 0)
            Image.fromarray(np.uint8(cm.jet(normed_img)*255)).save(full_path)

            b64 = base64.b64encode(resized_img).decode('utf-8')
            now = dt.datetime.now()
            conn = sqlite3.connect(dbPath)
            cur1 = conn.cursor()
            cur1.execute("""INSERT INTO testing_slice VALUES (null, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                         (str(now), "output", iz, "axial", width, height, 32767, b64, fileID,))
            conn.commit()
            conn.close()

        for iy in range(vy):
            uint16_img2D = uint16_img3D[:, iy, :]
            uint16_img2D = np.rot90(uint16_img2D)
            width, height = 91 + 2 * xPadding, 91
            resized_img = cv2.resize(uint16_img2D, (width, height))
            file_name = "output_" + "coronal_" + str(iy) + ".png"
            # full_path = os.path.join(inout_path, file_name)
            # Image.fromarray(resized_img).save(full_path)

            b64 = base64.b64encode(resized_img).decode('utf-8')
            now = dt.datetime.now()
            conn = sqlite3.connect(dbPath)
            cur1 = conn.cursor()
            cur1.execute("""INSERT INTO testing_slice VALUES (null, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                         (str(now), "output", iy, "coronal", width, height, 32767, b64, fileID,))
            conn.commit()
            conn.close()

        for ix in range(vx):
            uint16_img2D = uint16_img3D[ix, :, :]
            uint16_img2D = np.rot90(uint16_img2D)
            width, height = 109 + 2 * yPadding, 91
            resized_img = cv2.resize(uint16_img2D, (width, height))
            file_name = "output_" + "sagittal_" + str(ix) + ".png"
            # full_path = os.path.join(inout_path, file_name)
            # Image.fromarray(resized_img).save(full_path)

            b64 = base64.b64encode(resized_img).decode('utf-8')
            now = dt.datetime.now()
            conn = sqlite3.connect(dbPath)
            cur1 = conn.cursor()
            cur1.execute("""INSERT INTO testing_slice VALUES (null, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                         (str(now), "output", ix, "sagittal", width, height, 32767, b64, fileID,))
            conn.commit()
            conn.close()

        maxStep = 45

        uniformImg = float_img3D > 1
        for i in range(maxStep):
            # print(i)
            angle1 = i * 8 / 180 * np.pi
            c1 = np.cos(angle1)
            s1 = np.sin(angle1)

            c_in = 0.5 * np.array(float_img3D.shape)
            c_out = np.array(float_img3D.shape)
            transform = np.array([[c1, -s1, 0], [s1, c1, 0], [0, 0, 1]])
            offset = c_in - c_out.dot(transform)
            dst1 = nd.interpolation.affine_transform(float_img3D, transform.T, order=0, offset=offset,
                                                     output_shape=2 * c_out, cval=0.0,
                                                     output=np.float32)

            [sx, sy, sz] = dst1.shape
            [offsetX, offsetY, offsetZ] = np.uint16(np.array([sx, sy, sz]) / 6)
            crop1 = dst1[offsetX:sx - offsetX - 1, offsetY:sy - offsetY - 1, offsetZ:sz - offsetZ - 1]
            proj = np.max(crop1, axis=0)
            column_proj1 = np.rot90(proj)
            column_proj1 = np.clip(column_proj1, 0, 32767)
            column_proj1 = column_proj1.astype(np.uint16)
            file_name = "mip_output_axial_" + str(i) + ".png"
            reg_img = column_proj1.astype(np.uint16)
            # width, height = 109, 91
            width, height = target_mip_size[1:3]
            resized_img = cv2.resize(reg_img, (width + 2 * yPadding, height))
            file_name = "mip_output_axial_" + str(i) + ".png"
            # full_path = os.path.join(inout_path, file_name)
            # Image.fromarray(resized_img).save(full_path)

            b64 = base64.b64encode(resized_img).decode('utf-8')
            conn = sqlite3.connect(dbPath)
            cur1 = conn.cursor()
            cur1.execute("""INSERT INTO testing_slice VALUES (null, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                         (str(now), "output", i, "mip", width, height, 32767, b64, fileID,))
            conn.commit()
            conn.close()
        print("Step2: created output image")
    pass

def extract_params_of_images(prefix, nifti_file, inout_path, fileID, sn_crbl_idx):
    # 볼륨데이터 추출
    flipped_data = np.array(nifti_file.dataobj)
    
    # affine maxtirx 추출
    sign_of_x_axis = np.sign(nifti_file.affine[0][0])
    if sign_of_x_axis > 0:
        flipped_data = np.flip(flipped_data, axis=0).copy()
        nifti_file.affine[0][0] = -nifti_file.affine[0][0]

    sign_of_y_axis = np.sign(nifti_file.affine[1][1])
    if sign_of_y_axis < 0:
        flipped_data = np.flip(flipped_data, axis=1).copy()
        nifti_file.affine[1][1] = nifti_file.affine[1][1] * sign_of_y_axis

    flipped_file = nib.Nifti1Image(flipped_data, affine=nifti_file.affine, header=nifti_file.header)
    nib.save(flipped_file, os.path.join(inout_path, prefix + "_" + fileID + ".nii"))

    AffineX0 = flipped_file.affine[0][0]
    AffineY1 = flipped_file.affine[1][1]
    AffineZ2 = flipped_file.affine[2][2]

    # 최대/최소값 추출
    flipped_data = flipped_data / sn_crbl_idx
    if prefix == 'output':
        flipped_data = nd.gaussian_filter(flipped_data, 3.5 / 2.355 / 2)
    suvr_max = flipped_data.max()
    suvr_min = flipped_data.min()
    return AffineX0, AffineY1, AffineZ2, suvr_max, suvr_min


def quantification_to_db(dbDir, caseID, Qresult, params, sn_crbl_idx):
    Frontal_L = str(round(float(Qresult[0][0]), 2))
    Frontal_L_C = str(round(float(Qresult[0][1]), 2))
    Frontal_R = str(round(float(Qresult[1][0]), 2))
    Frontal_R_C = str(round(float(Qresult[1][1]), 2))

    Cingulate_L = str(round(float(Qresult[2][0]), 2))
    Cingulate_L_C = str(round(float(Qresult[2][1]), 2))
    Cingulate_R = str(round(float(Qresult[3][0]), 2))
    Cingulate_R_C = str(round(float(Qresult[3][1]), 2))

    Striatum_L = str(round(float(Qresult[4][0]), 2))
    Striatum_L_C = str(round(float(Qresult[4][1]), 2))
    Striatum_R = str(round(float(Qresult[5][0]), 2))
    Striatum_R_C = str(round(float(Qresult[5][1]), 2))

    Thalamus_L = str(round(float(Qresult[6][0]), 2))
    Thalamus_L_C = str(round(float(Qresult[6][1]), 2))
    Thalamus_R = str(round(float(Qresult[7][0]), 2))
    Thalamus_R_C = str(round(float(Qresult[7][1]), 2))

    Occipital_L = str(round(float(Qresult[8][0]), 2))
    Occipital_L_C = str(round(float(Qresult[8][1]), 2))
    Occipital_R = str(round(float(Qresult[9][0]), 2))
    Occipital_R_C = str(round(float(Qresult[9][1]), 2))

    Parietal_L = str(round(float(Qresult[10][0]), 2))
    Parietal_L_C = str(round(float(Qresult[10][1]), 2))
    Parietal_R = str(round(float(Qresult[11][0]), 2))
    Parietal_R_C = str(round(float(Qresult[11][1]), 2))

    Temporal_L = str(round(float(Qresult[12][0]), 2))
    Temporal_L_C = str(round(float(Qresult[12][1]), 2))
    Temporal_R = str(round(float(Qresult[13][0]), 2))
    Temporal_R_C = str(round(float(Qresult[13][1]), 2))

    Global = str(round(float(Qresult[14][0]), 2))
    Global_C = str(round(float(Qresult[14][1]), 2))
    Composite = str(round(float(Qresult[15][0]), 2))
    Composite_C = str(round(float(Qresult[15][1]), 2))

    in_suvr_max = str(round(float(params['in_suvr_max']), 2))
    in_suvr_min = str(round(float(params['in_suvr_min']), 2))
    out_suvr_max = str(round(float(params['out_suvr_max']), 2))
    out_suvr_min = str(round(float(params['out_suvr_min']), 2))

    InputAffineParamsX0 = str(round(float(params['InputAffineX0']), 2))
    InputAffineParamsY1 = str(round(float(params['InputAffineY1']), 2))
    InputAffineParamsZ2 = str(round(float(params['InputAffineZ2']), 2))

    OutputAffineParamsX0 = str(round(float(params['OutputAffineX0']), 2))
    OutputAffineParamsY1 = str(round(float(params['OutputAffineY1']), 2))
    OutputAffineParamsZ2 = str(round(float(params['OutputAffineZ2']), 2))

    conn = sqlite3.connect(dbDir)
    cur1 = conn.cursor()
    # caseID = int(data['fileID'])
    # q = "UPDATE testing_case SET (?, ?) WHERE (?)=(?)"
    # cur1.execute(q, (Composite_C, Composite_C, id, caseID))
    cur1.execute("UPDATE testing_case SET "
                "Frontal_L=?,"
                "Frontal_L_C=?,"
                "Frontal_R=?,"
                "Frontal_R_C=?,"
                 
                "Cingulate_L=?,"
                "Cingulate_L_C=?,"
                "Cingulate_R=?,"
                "Cingulate_R_C=?,"
                 
                "Striatum_L=?,"
                "Striatum_L_C=?,"
                "Striatum_R=?,"
                "Striatum_R_C=?,"
                 
                "Thalamus_L=?,"
                "Thalamus_L_C=?,"
                "Thalamus_R=?,"
                "Thalamus_R_C=?,"
                 
                "Occipital_L=?,"
                "Occipital_L_C=?,"
                "Occipital_R=?,"
                "Occipital_R_C=?,"
                 
                "Parietal_L=?,"
                "Parietal_L_C=?,"
                "Parietal_R=?,"
                "Parietal_R_C=?,"
                 
                "Temporal_L=?,"
                "Temporal_L_C=?,"
                "Temporal_R=?,"
                "Temporal_R_C=?,"
                 
                "Global=?,"
                "Global_C=?,"
                "Composite=?,"
                "Composite_C=?,"
                 
                "in_suvr_max=?,"
                "in_suvr_min=?,"
                "out_suvr_max=?,"
                "out_suvr_min=?,"
                 
                "InputAffineParamsX0=?,"
                "InputAffineParamsY1=?,"
                "InputAffineParamsZ2=?,"
                "OutputAffineParamsX0=?,"
                "OutputAffineParamsY1=?,"
                "OutputAffineParamsZ2=?"
                 
                "WHERE id=?",
                 (
                    Frontal_L,
                    Frontal_L_C,
                    Frontal_R,
                    Frontal_R_C,

                    Cingulate_L,
                    Cingulate_L_C,
                    Cingulate_R,
                    Cingulate_R_C,

                    Striatum_L,
                    Striatum_L_C,
                    Striatum_R,
                    Striatum_R_C,

                    Thalamus_L,
                    Thalamus_L_C,
                    Thalamus_R,
                    Thalamus_R_C,

                    Occipital_L,
                    Occipital_L_C,
                    Occipital_R,
                    Occipital_R_C,

                    Parietal_L,
                    Parietal_L_C,
                    Parietal_R,
                    Parietal_R_C,

                    Temporal_L,
                    Temporal_L_C,
                    Temporal_R,
                    Temporal_R_C,

                    Global,
                    Global_C,
                    Composite,
                    Composite_C,

                    in_suvr_max,
                    in_suvr_min,
                    out_suvr_max,
                    out_suvr_min,

                    InputAffineParamsX0,
                    InputAffineParamsY1,
                    InputAffineParamsZ2,
                    OutputAffineParamsX0,
                    OutputAffineParamsY1,
                    OutputAffineParamsZ2,

                    caseID,
                 ))
    # 확인
    # for row in cur1.execute("SELECT * FROM testing_case WHERE testing_case.id=?", (caseID,)):
    #     print(row)
    conn.commit()
    conn.close()
    pass