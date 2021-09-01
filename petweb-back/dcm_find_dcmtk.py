import os
import pandas as pd

# SKK
# For SNUH (and general PACS systems),
# PaitientID and StudyInstanceUID must be specified
# to search dicoms in SERIES level

output = os.popen(r'C:\ProgramData\chocolatey\lib\dcmtk\tools\dcmtk-3.6.6-win64-dynamic\bin\findscu.exe ' +
                  '-S -k 0008,0052="STUDY" -k "PatientName" -k "PatientID" -k "PatientBirthDate" -k "StudyDate" -k "StudyInstanceUID" -k "StudyDescription" -k "ModalitiesInStudy" 127.0.0.1 4242').read()

output_splt = output.split('I: ---------------------------\n')
num_of_studies = len(output_splt)

# study_table = {
#     'Patient name': [],
#     'Patient ID': [],
#     'Date of birth': [],
#     'Study date': [],
#     'Modality': [],
#     'Study description': []
# }

Patient_name = []
Patient_ID = []
Date_of_birth = []
Study_date = []
Modality = []
Study_description = []
Series_info = []

for i, study_splt in enumerate(output_splt):
    if i==0:
        continue

    study_info = study_splt.split('\n')
    study_instanceUID = 0
    for study_info_splt in study_info:
        if study_info_splt.find('0020,000d') != -1:
            find1 = study_info_splt.find('[')
            find2 = study_info_splt.find(']')

            study_instanceUID = study_info_splt[find1 + 1:find2]

        if study_info_splt.find('0010,0010') != -1:
            find1 = study_info_splt.find('[')
            find2 = study_info_splt.find(']')

            Patient_name.append(study_info_splt[find1+1:find2])

        if study_info_splt.find('0010,0020') != -1:
            find1 = study_info_splt.find('[')
            find2 = study_info_splt.find(']')

            Patient_ID.append(study_info_splt[find1+1:find2])

        if study_info_splt.find('0010,0030)') != -1:
            find1 = study_info_splt.find('[')
            find2 = study_info_splt.find(']')

            Date_of_birth.append(study_info_splt[find1+1:find2])

        if study_info_splt.find('0008,0020') != -1:
            find1 = study_info_splt.find('[')
            find2 = study_info_splt.find(']')

            Study_date.append(study_info_splt[find1+1:find2])

        if study_info_splt.find('0008,0061') != -1:
            find1 = study_info_splt.find('[')
            find2 = study_info_splt.find(']')

            Modality.append(study_info_splt[find1+1:find2])

        if study_info_splt.find('0008,1030') != -1:
            find1 = study_info_splt.find('[')
            find2 = study_info_splt.find(']')

            Study_description.append(study_info_splt[find1+1:find2])


    series_info_cmd = os.popen(r'C:\ProgramData\chocolatey\lib\dcmtk\tools\dcmtk-3.6.6-win64-dynamic\bin\findscu.exe ' +
                           '-S -k 0008,0052="SERIES" -k "PatientID="' + Patient_ID[i-1] +
                           ' -k "StudyInstanceUID="' + study_instanceUID +
                           ' -k "Modality" -k "SeriesDescription" -k "SeriesNumber" -k "SeriesInstanceUID" 127.0.0.1 4242').read()

    series_info_table = {}

    series_splt = series_info_cmd.split('I: ---------------------------\n')
    num_of_series = len(output_splt)

    SeriesNumber = []
    SeriesDescription = []
    SeriesModality = []
    SeriesInstanceUID = []

    for si, series_splt_l1 in enumerate(series_splt):
        if si==0:
            continue

        series_info_images = series_splt_l1.split('\n')

        for series_splt_elm in series_info_images:
            if series_splt_elm.find('0020,0011') != -1:
                find1 = series_splt_elm.find('[')
                find2 = series_splt_elm.find(']')

                SeriesNumber.append(series_splt_elm[find1+1:find2])

            if series_splt_elm.find('0008,103e') != -1:
                find1 = series_splt_elm.find('[')
                find2 = series_splt_elm.find(']')

                SeriesDescription.append(series_splt_elm[find1+1:find2])

            if series_splt_elm.find('0008,0060') != -1:
                find1 = series_splt_elm.find('[')
                find2 = series_splt_elm.find(']')

                SeriesModality.append(series_splt_elm[find1+1:find2])

            if series_splt_elm.find('0020,000e') != -1:
                find1 = series_splt_elm.find('[')
                find2 = series_splt_elm.find(']')

                SeriesInstanceUID.append(series_splt_elm[find1+1:find2])

    Series_info.append([SeriesNumber, SeriesDescription, SeriesModality])


print(Series_info)
