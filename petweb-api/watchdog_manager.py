import os
import json
import time
import copy
import nibabel as nib
import numpy as np
import pandas as pd
import sqlite3
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

import matplotlib
# matplotlib.use('Agg')  # <= this is required

from TF_DirectSN.PTQuant_eval_affine_v1 import train_pib
from TF_DirectSN.eval_cyc_coregpy import train
from TF_DirectSN.QuantWithSurface import _quantification
from watchdog_util import quantification_to_db, extract_params_of_images, extract_slices

class Target:
    # watchDir = "C:\\Users\\dwnusa\\workspace\\petweb-develop\\petweb\\petweb-back\\uploads\\_status_table";
    petwebPath = os.path.abspath(os.path.join(os.getcwd(), os.pardir))
    watchDir = os.path.join(petwebPath, 'petweb-back', 'uploads', '_status_table')

    #watchDir에 감시하려는 디렉토리를 명시한다.

    def __init__(self):
        self.observer = Observer()   #observer객체를 만듦

    def run(self):
        event_handler = Handler()
        self.observer.schedule(event_handler, self.watchDir, recursive=False)
        self.observer.start()
        try:
            while True:
                time.sleep(1)
        except:
            self.observer.stop()
            print("Error")
            self.observer.join()

class Handler(FileSystemEventHandler):
# FileSystemEventHandler 클래스를 상속받음.
# 아래 핸들러들을 오버라이드 함

    #파일, 디렉터리가 move 되거나 rename 되면 실행
    def on_moved(self, event):
        print(event)
        pass

    def on_created(self, event): #파일, 디렉터리가 생성되면 실행
        print(event)
        pass

    def on_deleted(self, event): #파일, 디렉터리가 삭제되면 실행
        print(event)
        pass

    def on_modified(self, event): #파일, 디렉터리가 수정되면 실행
        print(event)
        is_directory = event.is_directory
        if is_directory is False:
            modifed_file = event.src_path
            try:
                with open(modifed_file, "r") as file:
                    dataAll = json.load(file)
                if any(d['status'] == 'ready' for d in dataAll):
                    dataToDo = [d for d in dataAll if d['status'] == 'ready']
                    for d in dataAll:
                        d.update((k, 'done') for k, v in d.items() if v=='ready')
                    with open(modifed_file, "w") as file:
                        json.dump(dataAll, file)
                    print('todo: ', dataToDo)
                    for data in dataToDo:
                        print(data['fileName']+" is processing")
                        # deeplearning 코드 수행 및 정량화 결과 저장할 폴더와 결과 파일 생성
                        fileID = data['fileID']
                        fileName = data['fileName']
                        filePath = data['filePath']
                        target_file = os.path.join(filePath, data['fileName'])
                        inout_path = os.path.join(filePath, data['fileID'])
                        if os.path.exists(inout_path):
                            print(data['fileName']+" is already exist, which is processed")
                            pass
                        else:
                            os.mkdir(inout_path)
                            nimg3D = nib.load(target_file) # 이미지 불러오기
                            copy_nimg3D = nimg3D.get_data().copy()

                            sign_of_x_axis = np.sign(nimg3D.affine[0][0])
                            if sign_of_x_axis > 0:
                                copy_nimg3D = np.flip(copy_nimg3D, axis=0).copy()
                                nimg3D.affine[0][0] = -nimg3D.affine[0][0]

                            sign_of_y_axis = np.sign(nimg3D.affine[1][1])
                            if sign_of_y_axis < 0:
                                copy_nimg3D = np.flip(copy_nimg3D, axis=1).copy()
                                nimg3D.affine[1][1] = nimg3D.affine[1][1]*sign_of_y_axis

                            nimg3D = nib.Nifti1Image(copy_nimg3D, affine=nimg3D.affine, header=nimg3D.header)
                            nib.save(nimg3D, os.path.join(inout_path, "input_" + fileID + ".img"))
                            # sn_main_function(data['username'], inout_path, data['tracerName'], fileID)

                            tracerName = data['tracerName']
                            if tracerName.find('PIB') is not -1:
                                train_pib(inout_path, fileID)
                            else:
                                train(inout_path, fileID)

                            # nii 파일 준비
                            input_file = nimg3D
                            output_file = nib.load(os.path.join(inout_path, "output_" + fileID + ".img"))

                            # print("Quantification")
                            aal_region, centil_suvr, sn_crbl_idx = _quantification(sndir=inout_path, maxval=100, threshold=1.2, vmax=2.5, tracer_name=data['tracerName'])
                            aal_subregion_path = os.path.join(inout_path, 'aal_subregion.txt')
                            Qresult = np.append(aal_region[:, 0, :], centil_suvr[:, 0].reshape(1, 2), axis=0)

                            petwebPath = os.path.abspath(os.path.join(os.getcwd(), os.pardir))
                            dbDir = os.path.join(petwebPath, 'petweb-back', 'db.sqlite3')

                            InputAffineX0, InputAffineY1, InputAffineZ2, in_suvr_max, in_suvr_min = extract_params_of_images(prefix='input', nifti_file=input_file, inout_path=inout_path, fileID=fileID, sn_crbl_idx=sn_crbl_idx)
                            OutputAffineX0, OutputAffineY1, OutputAffineZ2, out_suvr_max, out_suvr_min = extract_params_of_images(prefix='output', nifti_file=output_file, inout_path=inout_path, fileID=fileID, sn_crbl_idx=sn_crbl_idx)

                            params = {
                                'InputAffineX0': InputAffineX0, 'InputAffineY1': InputAffineY1, 'InputAffineZ2': InputAffineZ2, 'in_suvr_max': in_suvr_max, 'in_suvr_min': in_suvr_min,
                                'OutputAffineX0': OutputAffineX0, 'OutputAffineY1': OutputAffineY1, 'OutputAffineZ2': OutputAffineZ2, 'out_suvr_max': out_suvr_max, 'out_suvr_min': out_suvr_min
                            }

                            quantification_to_db(dbDir, data['fileID'], Qresult, params, sn_crbl_idx)

                            np.savetxt(aal_subregion_path, Qresult, '%.3f')
                            df = pd.DataFrame(Qresult, columns=['suvr', 'Centiloid'],
                                              index=['Frontal_L', 'Frontal_R', 'Precuneus_PCC_L', 'Precuneus_PCC_R',
                                                     'Lateral_temporal_L', 'Lateral_temporal_R', 'Parietal_L',
                                                     'Parietal_R',
                                                     'Occipital_L', 'Occipital_R', 'Medial_temporal_L',
                                                     'Medial_temporal_R',
                                                     'Basal_ganglia_L', 'Basal_ganglia_R', 'Global',
                                                     'Centiloid_Composite'])
                            df.to_csv(os.path.join(inout_path, fileID + '.csv'), index=True, encoding='cp949')

                            extract_slices(dbPath=dbDir, prefix="input", nimg3D=input_file, inout_path=inout_path, fileID=data['fileID'])
                            extract_slices(dbPath=dbDir, prefix="output", nimg3D=output_file, inout_path=inout_path, fileID=data['fileID'])

                            os.remove(target_file)
                else:
                    pass
            except:
                print('no files or train error on the todoList in on_modifed')
        pass

if __name__ == "__main__": #본 파일에서 실행될 때만 실행되도록 함
    # state = "update" # write, read, filter, update
    #
    # petwebPath = os.path.abspath(os.path.join(os.getcwd(), os.pardir))
    # # dbDir = os.path.join(petwebPath, 'petweb-back', 'employee.db')
    # dbDir = os.path.join(petwebPath, 'petweb-back', 'db.sqlite3')
    #
    # if state == "write":
    #     conn = sqlite3. connect(dbDir)
    #     cur = conn.cursor()
    #     conn.execute('CREATE TABLE employee_data(id INTEGER, name TEXT, nickname TEXT, department TEXT, employment_date TEXT)')
    #     cur.executemany('INSERT INTO employee_data VALUES (?, ?, ?, ?, ?)',
    #                     [(1001, 'Donghyun', 'SOMJANG', 'Development', '2020-04-01 00:00:00.000'),
    #                      (2001, 'Sol', 'Fairy', 'Marketing', '2020-04-01 00:00:00.000'),
    #                      (2002, 'Jiyoung', 'Magician', 'Marketing', '2020-04-01 00:00:00.000'),
    #                      (1002, 'Hyeona', 'Theif', 'Development', '2020-04-01 00:00:00.000'),
    #                      (1003, 'Soyoung', 'Chief', 'Development', '2020-04-01 00:00:00.000')])
    #     conn.commit()
    #     conn.close()
    #
    # elif state == "read":
    #     conn = sqlite3.connect(dbDir)
    #     cur = conn.cursor()
    #     cur.execute("SELECT * FROM employee_data")
    #     rows = cur.fetchall()
    #     for row in rows:
    #         print(row)
    #     conn.close()
    #
    # elif state=="filter":
    #     conn = sqlite3.connect(dbDir)
    #     cur1 = conn.cursor()
    #     cur2 = conn.cursor()
    #     cur1.execute("SELECT name, department FROM employee_data WHERE employee_data.id > 2000")
    #     cur2.execute("SELECT * FROM employee_data WHERE employee_data.id == 1003")
    #     rows = cur1.fetchall()
    #     for row in rows:
    #         print(row)
    #     rows = cur2.fetchall()
    #     for row in rows:
    #         print(row)
    #     conn.close()
    #
    # elif state=="update":
    #     # conn = sqlite3.connect(dbDir)
    #     # cur1 = conn.cursor()
    #     # cur1.execute("UPDATE employee_data SET name=? WHERE id=?", ('NEW1', 1003))
    #     # # 확인
    #     # for row in cur1.execute('SELECT * FROM employee_data'):
    #     #     print(row)
    #     # conn.commit()
    #     # conn.close()
    #
    #     conn = sqlite3.connect(dbDir)
    #     cur1 = conn.cursor()
    #     # cur1.execute("UPDATE testing_case SET Composite_C=? WHERE id=?", (Composite_C, int(data['fileID'])))
    #     cur1.execute("UPDATE testing_case SET Composite_C=? WHERE id=?", ("19.15", int("240")))
    #     # 확인
    #     for row in cur1.execute('SELECT * FROM testing_case WHERE testing_case.id == 240'):
    #         print(row)
    #     conn.commit()
    #     conn.close()


    w = Target()
    w.run()
