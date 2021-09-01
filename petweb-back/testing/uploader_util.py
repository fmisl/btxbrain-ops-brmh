import errno
import os
import shutil
import subprocess
import platform
import sys
import json
import nibabel as nib
import numpy as np
from scipy import ndimage as nd
from PIL import Image
from . import models, serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from django.core.files.storage import FileSystemStorage

def empty_uploader_folder(uploader_path):
    # 업로더 폴더에 기존 파일을 모두 제거
    # while len(os.listdir(uploader_path)) != 0:
    for filename in os.listdir(uploader_path):
        file_path = os.path.join(uploader_path, filename)
        try:
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)
        except Exception as e:
            print('Failed to delete %s. Reason: %s' % (file_path, e))
            return {'status': False, 'error': 'cannot empty uploader folder'}

    if len(os.listdir(uploader_path)) != 0:
        return {'status': False, 'error': 'cannot empty uploader folder'}

    return {'status': True, 'error': None}

def create_user_folder(username):
    # 사용자 폴더 경로 (존재 확인 후 생성)
    try:
        user_path = os.path.join(settings.MEDIA_ROOT, str(username))
        if not os.path.exists(user_path):
            os.mkdir(user_path)

        # 업로드 파일 경로 (존재 확인 후 생성)
        uploader_path = os.path.join(user_path, 'uploader')
        if not os.path.exists(uploader_path):
            os.mkdir(uploader_path)
        create_folder_result = {"status": True, "error": None}
    except OSError as exc:
        if exc.errno != errno.EEXIST:
            raise
        return {"status": False, "error": "user_path is not exist"}, None
    return create_folder_result, uploader_path

def get_folder_path(username):
    # 사용자 폴더 경로 (존재 확인 후 생성)
    try:
        user_path = os.path.join(settings.MEDIA_ROOT, str(username))
        uploader_path = os.path.join(user_path, 'uploader')
        if not os.path.exists(uploader_path):
            os.mkdir(uploader_path)
        database_path = os.path.join(user_path, 'database')
        if not os.path.exists(database_path):
            os.mkdir(database_path)
        get_folder_path_result = {"status": True, "error": None}
    except OSError as exc:
        if exc.errno != errno.EEXIST:
            raise
        return {"status": False, "error": "user_path is not exist"}, None, None, None
    return get_folder_path_result, user_path, uploader_path, database_path

def save_case_to_db(username, jsonData, selectedTracer, Group, uploader_path, database_path):
    # 사용자 DB 요청
    userID = models.User.objects.filter(username=username)[0]
    deeplearning_file_lists = []
    for i, v in enumerate(jsonData):
        newCase = models.Case.objects.create(
            UserID=userID,
            Opened=False,
            Select=False,
            Focus=False,
            Group=Group,
            PatientID=v['PatientID'] if 'PatientID' in v else '-',
            # PatientName=v['PatientName'] if 'PatientName' in v else 'Anonymous(' + ''.join(v['FileName'].split(".")[:-1]) + ')',
            PatientName='Anonymous(' + ''.join(v['FileName'].split(".")[:-1]) + ')' if 'PatientName' == 'Anonymous' else v['PatientName'],
            Age=v['Age'] if 'Age' in v else '-',
            Sex=v['Sex'] if 'Sex' in v else '-',
            fileID=None,
            OriginalFileName=v['FileName'],
            FileName=None,
            AcquisitionDateTime=v['StudyDate'][0].split('T')[0] if 'StudyDate' in v else '-',
            Tracer=selectedTracer,
            Global=None,
            Composite=None,
        )
        newCase.save()

        newFileID = newCase.id
        newCase.fileID = str(newFileID)
        newCase.FileName = str(newFileID) + ".nii"
        newCase.save()

        json_filename = ''.join(v['FileName'].split('.')[:-1]) + ".json"
        json_filepath = os.path.join(uploader_path, json_filename)
        isJsonExist = os.path.exists(json_filepath)
        if isJsonExist:
            shutil.move(json_filepath, os.path.join(database_path, str(newFileID) + ".json"))
        nii_filename = v['FileName']
        nii_filepath = os.path.join(uploader_path, nii_filename)
        shutil.move(nii_filepath, os.path.join(database_path, str(newFileID) + ".nii"))
        deeplearning_file_lists.append({'username': username, 'tracerName': selectedTracer, 'fileID': str(newFileID), 'fileName': str(newFileID) + ".nii", 'filePath': database_path,  'status': 'ready'})
    # delete all files in uploader
    empty_uploader_folder_result = empty_uploader_folder(uploader_path)
    if empty_uploader_folder is False:
        return {'status': empty_uploader_folder_result['status'], 'error': empty_uploader_folder_result['error']}

    allCases = models.Case.objects.filter(UserID=userID)
    serializer = serializers.CaseSerializer(allCases, many=True)

    return {'status': True, 'error': None}, serializer.data, deeplearning_file_lists

def extract_file_type(myfiles):

    # 첫 파일만 확인 (모든 파일 형식 확인 필요)
    file_name = myfiles[0].name
    file_format = file_name.split('.')[-1].lower()

    # dicom 형식인 경우 (dicom 파일형식 확인 방법 개선 필요)
    if file_format == "dcm" or file_format == "ima" or file_format == "dicom":
        Format = "dcm"
        if len(myfiles) <= 50:  # dicom 파일 개수로 확인하는 것으로는 정확히 판단 불가
            extract_file_type_result = {"status": False, "error": "file type error: the number of dcm files is not enough (>=50)"}
            return extract_file_type_result, None

    # hdr/img 형식인 경우 (analyze 파일형식 확인 방법 개선 필요)
    elif file_format == "img" or file_format == "hdr":
        Format = "analyze"
        if len(myfiles) < 2:
            extract_file_type_result = {"status": False, "error": "file type error: a pair of .hdr and .img is required"}
            return extract_file_type_result, None

    # nii 형식인 경우 (nifti 파일형식 확인 방법 개선 필요)
    elif file_format == "nii":
        Format = "nifti"
        if len(myfiles) < 1:
            extract_file_type_result = {"status": False, "error": "file type error: Must be uploaded more than one"}
            return extract_file_type_result, None

    # 위 조건들 만족하지 않은 상태에서 파일 수가 50개 이상이면 dicom 파일로 판단 (개선 필요)
    elif len(myfiles) > 50:
        Format = "dcm"

    # 위 조건들 만족하지 않은 상태에서 파일 수가 50개 이상이면 dicom 파일로 판단 (개선 필요)
    else:
        extract_file_type_result = {"status": False, "error": "file type error: File format is not supported. (dcm, hdr/img, nii formats are only supported)"}
        return extract_file_type_result, None
    extract_file_type_result = {"status": True, "error": None}
    return extract_file_type_result, Format


def preview_center_plane(origin_img3D, uploader_path, filename):
    try:
        # preview 이미지 만들기
        # 픽셀크기 2mm로 변환용 factor
        dsfactor = [float(f) / w for w, f in zip([2, 2, 2], origin_img3D.header['pixdim'][1:4])]
        img3D = np.squeeze(np.array(origin_img3D.dataobj))
        img3D = nd.interpolation.zoom(img3D, zoom=dsfactor)  # 2mm 픽셀로 스케일 변환
        # 크기는 (91, 109, 91) 이어야함

        # 3차원 이미지 중심좌표 계산
        hx, hy, hz = int(img3D.shape[0] / 2), int(img3D.shape[1] / 2), int(img3D.shape[2] / 2)

        saveJPGPath_hx = os.path.join(uploader_path, filename + "_hx.jpg")
        saveJPGPath_hy = os.path.join(uploader_path, filename + "_hy.jpg")
        saveJPGPath_hz = os.path.join(uploader_path, filename + "_hz.jpg")

        ximg2D = img3D[hx, :, :] #
        yimg2D = img3D[:, hy, :]
        zimg2D = img3D[:, :, hz]

        ximg2D = 255 * (ximg2D - ximg2D.min()) / (ximg2D.max() - ximg2D.min())
        ximg2D = np.rot90(ximg2D)
        Image.fromarray(ximg2D.astype(np.uint8)).save(saveJPGPath_hx)

        yimg2D = 255 * (yimg2D - yimg2D.min()) / (yimg2D.max() - yimg2D.min())
        yimg2D = np.rot90(yimg2D)
        Image.fromarray(yimg2D.astype(np.uint8)).save(saveJPGPath_hy)

        zimg2D = 255 * (zimg2D - zimg2D.min()) / (zimg2D.max() - zimg2D.min())
        zimg2D = np.rot90(zimg2D)
        Image.fromarray(zimg2D.astype(np.uint8)).save(saveJPGPath_hz)
    except:
        return {'status': False, 'error': 'failed generating plane image in preview_center_plane'}
    return {'status': True, 'error':None}

def upload_file_handler_dicom(uploader_path, myfiles):
    # uploader 폴더 비우기
    empty_uploader_folder_result = empty_uploader_folder(uploader_path)

    if empty_uploader_folder_result['status'] is False: # uploader 폴더 비우기 실패
        return empty_uploader_folder_result, None

    # 업로더 폴더 하위에 dicom 저장할 폴더 생성
    dcm_folder_path = os.path.join(uploader_path, "dicom")
    if not os.path.exists(dcm_folder_path):
        os.mkdir(dcm_folder_path)

    # 모든 dicom 파일들을 dicom 폴더에 저장
    fs = FileSystemStorage(location=dcm_folder_path)
    for i, f in enumerate(myfiles):
        filename = f.name
        fs.save(filename, f)

    # windows os 인지 확인
    if platform.system() is 'Windows':
        # 윈도우에서는 dcm2niix.exe 를 실행시킴
        dcm2niix_path = os.path.join(settings.BASE_DIR, 'dcm2niix.exe')
        try:
            subprocess.run([dcm2niix_path, "-o", uploader_path, "-b", "y", "-ba", "n", "-f", "%t_%p_%s", dcm_folder_path], check=True)
        except subprocess.CalledProcessError as e:
            upload_handler_dicom_result = {"status": False, "error": "dcm2niix is not exist"}
            return upload_handler_dicom_result, None
    else:
        # 아직 다른 os 플랫폼은 지원하지 않음
        upload_handler_dicom_result = {"status": False, "error": "other os platform is not supported (windows only)"}
        return upload_handler_dicom_result, None

    # nifti 변환된 이미지와 json 파일 읽고 정보 추출
    dcm_tags_list=[]
    uploader_files = os.listdir(uploader_path)
    for i, fname in enumerate(uploader_files):
        # nifti 파일을 하나씩 처리
        niiFileName = ''.join(fname.split(".")[:-1])
        Format = fname.split(".")[-1]
        if (Format == 'nii'):
            filename = ''.join(fname.split(".")[:-1])
            target_json_path = os.path.join(uploader_path, filename+'.json')
            with open(target_json_path) as f:
                dcm_tags = json.load(f)
            print(dcm_tags)
            NiiPath = os.path.join(uploader_path, fname)
            origin_img3D = nib.load(NiiPath)
            # json 파일에서 환자정보 및 이미지 정보 추출
            dcm_tags_list.append({
                "PatientID": dcm_tags['PatientID'] if 'PatientID' in dcm_tags else '-',
                "PatientName": dcm_tags['PatientName'] if 'PatientName' in dcm_tags else '-',
                "Age": dcm_tags['PatientBirthDate'] if 'PatientBirthDate' in dcm_tags else '-',
                "Sex": dcm_tags['PatientSex'] if 'PatientSex' in dcm_tags else '-',
                "FileName": niiFileName+".nii",
                "InputAffineX0": origin_img3D.affine[0][0],
                "InputAffineY1": origin_img3D.affine[1][1],
                "InputAffineZ2": origin_img3D.affine[2][2],
            })
            # center plane 이미지 생성
            preview_center_plane_result = preview_center_plane(origin_img3D, uploader_path, filename)
            if preview_center_plane_result['status'] is False:
                return preview_center_plane_result, None

    fileList = [
        {
            'id': i,
            'Focus': False,
            'Tracer': None,
            'fileID': None,
            'Group': 0,
            'PatientID': v['PatientID'],
            'PatientName': v['PatientName'],
            'Age': v['Age'],
            'Sex': v['Sex'],
            'FileName': v['FileName'],
            'InputAffineX0':v['InputAffineX0'],
            'InputAffineY1':v['InputAffineY1'],
            'InputAffineZ2':v['InputAffineZ2'],
        }
        for i, v in enumerate(dcm_tags_list)
    ]

    return {"status": True, "error": None}, fileList

def upload_file_handler_analyze(uploader_path, myfiles):
    # uploader 폴더 비우기
    empty_uploader_folder_result = empty_uploader_folder(uploader_path)

    if empty_uploader_folder_result['status'] is False: # uploader 폴더 비우기 실패
        return empty_uploader_folder_result, None

    # 파일 저장
    fs = FileSystemStorage()
    # 이미지 정보 저장용 list
    dcm_tags_list=[]
    for i, f in enumerate(myfiles):
        # hdr 파일을 중심으로 하나씩 처리
        hdrFileName = ''.join(f.name.split(".")[:-1])
        Format = f.name.split(".")[-1]
        if (Format=='hdr'):
            # hdr 파일 저장
            hdr_Path = os.path.join(uploader_path, hdrFileName+'.hdr')
            fs.save(hdr_Path, f)

            # hdr 파일과 이름이 같은 img 파일 저장
            for ii, ff in enumerate(myfiles):
                imgFileName = ''.join(ff.name.split(".")[:-1])
                if (ff.name == hdrFileName+".img"):
                    img_Path = os.path.join(uploader_path, ff.name)
                    fs.save(img_Path, ff)

                    origin_img3D = nib.load(img_Path)
                    nib.save(origin_img3D, os.path.join(uploader_path, imgFileName+".nii"))

                    dcm_tags_list.append({
                        "PatientID": "-",
                        "PatientName": "Anonymous",
                        "Age": '-',
                        "Sex": '-',
                        "FileName": imgFileName+".nii",
                        "InputAffineX0": origin_img3D.affine[0][0],
                        "InputAffineY1": origin_img3D.affine[1][1],
                        "InputAffineZ2": origin_img3D.affine[2][2],
                    })
                    # center plane 이미지 생성
                    preview_center_plane_result = preview_center_plane(origin_img3D, uploader_path, imgFileName)
                    if preview_center_plane_result['status'] is False:
                        return preview_center_plane_result, None
    fileList = [
        {
            'id': i,
            'Focus': False,
            'Tracer': None,
            'fileID': None,
            'Group': 0,
            'PatientID': v['PatientID'],
            'PatientName': v['PatientName'],
            'Age': v['Age'],
            'Sex': v['Sex'],
            'FileName': v['FileName'],
            'InputAffineX0':v['InputAffineX0'],
            'InputAffineY1':v['InputAffineY1'],
            'InputAffineZ2':v['InputAffineZ2'],
        }
        for i, v in enumerate(dcm_tags_list)
    ]

    return {"status": True, "error": None}, fileList

def upload_file_handler_nifti(uploader_path, myfiles):
    # uploader 폴더 비우기
    empty_uploader_folder_result = empty_uploader_folder(uploader_path)

    if empty_uploader_folder_result['status'] is False: # uploader 폴더 비우기 실패
        return empty_uploader_folder_result, None

    # 파일 저장
    fs = FileSystemStorage()
    # 이미지 정보 저장용 list
    dcm_tags_list=[]
    for i, f in enumerate(myfiles):
        # nii 파일을 중심으로 하나씩 처리
        niiFileName = ''.join(f.name.split(".")[:-1])
        Format = f.name.split(".")[-1]
        if (Format=='nii'):
            # nii 파일 저장
            nii_Path = os.path.join(uploader_path, f.name)
            fs.save(nii_Path, f)
            origin_img3D = nib.load(nii_Path)
            # nib.save(origin_img3D, os.path.join(uploader_path, niiFileName+".nii"))

            dcm_tags_list.append({
                "PatientID": "-",
                "PatientName": "Anonymous",
                "Age": '-',
                "Sex": '-',
                "FileName": niiFileName+".nii",
                "InputAffineX0": origin_img3D.affine[0][0],
                "InputAffineY1": origin_img3D.affine[1][1],
                "InputAffineZ2": origin_img3D.affine[2][2],
            })
            # center plane 이미지 생성
            preview_center_plane_result = preview_center_plane(origin_img3D, uploader_path, niiFileName)
            if preview_center_plane_result['status'] is False:
                return preview_center_plane_result, None
    fileList = [
        {
            'id': i,
            'Focus': False,
            'Tracer': None,
            'fileID': None,
            'Group': 0,
            'PatientID': v['PatientID'],
            'PatientName': v['PatientName'],
            'Age': v['Age'],
            'Sex': v['Sex'],
            'FileName': v['FileName'],
            'InputAffineX0':v['InputAffineX0'],
            'InputAffineY1':v['InputAffineY1'],
            'InputAffineZ2':v['InputAffineZ2'],
        }
        for i, v in enumerate(dcm_tags_list)
    ]

    return {"status": True, "error": None}, fileList