import os

# SKK 210507
# For SNUH (and general PACS systems),
# PaitientID and StudyInstanceUID must be specified to search dicoms in SERIES level
# Adjustable paramters: PatientName, PaitientID, Birthdate, StudyDate, StudyDescription

# Example
# StudyDate from 2021-04-19 to 2021-04-23
# StudyDescription Florbetaben
# Modality PET
# PACS server 172.16.60.69:1201
# CHANGE the path (C:\ProgramData\chocolatey\lib\dcmtk\tools\dcmtk-3.6.6-win64-dynamic\bin) to your dcmtk path
# CHANGE the SAVE_DIREC

PACS_server = '172.16.60.69 1201'

SAVE_DIRECTORY = r'C:\Users\dwnusa\workspace\dcmtkfiles'


def find_dcmtk(date = None, ptid = None):

    if date is not None:
        datefield = '"StudyDate=' + date + '"'
    else:
        datefield = '"StudyDate"'

    if ptid is not None:
        ptidfield = '"PatientID=' + ptid + '"'
    else:
        ptidfield = '"PatientID"'

    # Change here
    # insert patient information
    output = os.popen(r'C:\ProgramData\chocolatey\lib\dcmtk\tools\dcmtk-3.6.6-win64-dynamic\bin\findscu.exe ' +
                      '-S -k 0008,0052="STUDY" -k "PatientName" -k ' + ptidfield +
                      ' -k "PatientBirthDate" -k ' + datefield +
                      ' -k "StudyInstanceUID" -k "StudyDescription=betaben" -k "ModalitiesInStudy" ' + PACS_server).read()


    output_splt = output.split('I: ---------------------------\n')
    num_of_studies = len(output_splt) - 1

    print('Searching Dicoms Studies##########################################\n')
    print('{} Studies were searched...\n'.format(num_of_studies))
    # print('Completed #################################################\n\n')

    Patient_name = []
    Patient_ID = []
    Date_of_birth = []
    Study_date = []
    Modality = []
    Study_description = []
    Series_info = []
    Study_instanceUID = []

    for i, study_splt in enumerate(output_splt):
        if i == 0:
            continue

        study_info = study_splt.split('\n')
        for study_info_splt in study_info:
            if study_info_splt.find('0020,000d') != -1:
                find1 = study_info_splt.find('[')
                find2 = study_info_splt.find(']')

                Study_instanceUID.append(study_info_splt[find1 + 1:find2])

            if study_info_splt.find('0010,0010') != -1:
                find1 = study_info_splt.find('[')
                find2 = study_info_splt.find(']')

                Patient_name.append(study_info_splt[find1 + 1:find2])

            if study_info_splt.find('0010,0020') != -1:
                find1 = study_info_splt.find('[')
                find2 = study_info_splt.find(']')

                Patient_ID.append(study_info_splt[find1 + 1:find2])

            if study_info_splt.find('0010,0030)') != -1:
                find1 = study_info_splt.find('[')
                find2 = study_info_splt.find(']')

                Date_of_birth.append(study_info_splt[find1 + 1:find2])

            if study_info_splt.find('0008,0020') != -1:
                find1 = study_info_splt.find('[')
                find2 = study_info_splt.find(']')

                Study_date.append(study_info_splt[find1 + 1:find2])

            if study_info_splt.find('0008,0061') != -1:
                find1 = study_info_splt.find('[')
                find2 = study_info_splt.find(']')

                Modality.append(study_info_splt[find1 + 1:find2])

            if study_info_splt.find('0008,1030') != -1:
                find1 = study_info_splt.find('[')
                find2 = study_info_splt.find(']')

                Study_description.append(study_info_splt[find1 + 1:find2])

        series_info_cmd = os.popen(
            r'C:\ProgramData\chocolatey\lib\dcmtk\tools\dcmtk-3.6.6-win64-dynamic\bin\findscu.exe -S -k 0008,0052="SERIES" -k "PatientID=' +
            Patient_ID[i - 1] +
            '" -k "StudyInstanceUID=' + Study_instanceUID[i - 1].rstrip('\x00') +
            '" -k "Modality" -k "SeriesDescription" -k "SeriesNumber" -k "SeriesInstanceUID" ' + PACS_server).read()

        series_splt = series_info_cmd.split('I: ---------------------------\n')
        num_of_series = len(output_splt)

        SeriesNumber = []
        SeriesDescription = []
        SeriesModality = []
        SeriesInstanceUID = []

        for si, series_splt_l1 in enumerate(series_splt):
            if si == 0:
                continue

            series_info_images = series_splt_l1.split('\n')

            for series_splt_elm in series_info_images:
                if series_splt_elm.find('0020,0011') != -1:
                    find1 = series_splt_elm.find('[')
                    find2 = series_splt_elm.find(']')

                    SeriesNumber.append(series_splt_elm[find1 + 1:find2])

                if series_splt_elm.find('0008,103e') != -1:
                    find1 = series_splt_elm.find('[')
                    find2 = series_splt_elm.find(']')

                    SeriesDescription.append(series_splt_elm[find1 + 1:find2])

                if series_splt_elm.find('0008,0060') != -1:
                    find1 = series_splt_elm.find('[')
                    find2 = series_splt_elm.find(']')

                    SeriesModality.append(series_splt_elm[find1 + 1:find2])

                if series_splt_elm.find('0020,000e') != -1:
                    find1 = series_splt_elm.find('[')
                    find2 = series_splt_elm.find(']')

                    SeriesInstanceUID.append(series_splt_elm[find1 + 1:find2])

        # Series_info indexing:
        # first index: # of studies
        # second index: SeriesNumber, SeriesDescription, SeiresModality, ....
        # third index: series images
        Series_info.append([SeriesNumber, SeriesDescription, SeriesModality, SeriesInstanceUID])

    return Patient_name, Patient_ID, Date_of_birth, Study_date, Modality, Study_description, Study_instanceUID, Series_info

def get_oneItem_dcmtk(Patient_ID, Study_instanceUID, Series_info, num=None):


    for idx_study, study_level in enumerate(Series_info):
        if num is not None:
            if not idx_study in num:
                continue
        for idx_series in range(0, len(study_level[0])):
            # Search for betaben PET series
            # AC and NAC data can be obtained togegher
            # You can add conditinos for early or late phase
            MATCHING = 'betaben'
            # Except for CT images
            if study_level[1][idx_series].rstrip('\x00').find(MATCHING) is not -1 \
                    and study_level[1][idx_series].rstrip('\x00').find('CT') is -1 \
                    and study_level[1][idx_series].rstrip('\x00').find('early') is -1:
                print('Downloading specific Dicoms series ##########################################\n')
                print(
                    'Series description: {} ...\n'.format(study_level[1][idx_series])
                )

                os.popen(
                    r'C:\ProgramData\chocolatey\lib\dcmtk\tools\dcmtk-3.6.6-win64-dynamic\bin\getscu.exe -d -S -k 0008,0052="SERIES" -k "PatientID='
                    + Patient_ID[idx_study] + '" -k "StudyInstanceUID='
                    + Study_instanceUID[idx_study].rstrip(
                        '\x00') + '" -k "Modality" -k "SeriesDescription" -k "SeriesNumber" -k "SeriesInstanceUID='
                    # study_level[3] describes the series instnaceuid
                    + study_level[3][idx_series].rstrip(
                        '\x00') + '" -od "' + SAVE_DIRECTORY + '" ' + PACS_server).read()

                print('Download was completed ###################################################\n\n')

    print('\n\n#############  ALL PROCESS WAS DONE #############\n\n')

if __name__ == "__main__":
    Patient_name, Patient_ID, Date_of_birth, Study_date, Modality, Study_description, Study_instanceUID, Series_info = find_dcmtk(date='20210526')
    get_oneItem_dcmtk(Patient_ID, Study_instanceUID, Series_info, [0, 1])