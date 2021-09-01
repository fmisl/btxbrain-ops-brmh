from pydicom.dataset import Dataset
from pynetdicom import AE, evt, build_role, debug_logger, StoragePresentationContexts
# from pynetdicom.sop_class import _STORAGE_CLASS
# from pynetdicom.sop_class import PatientRootQueryRetrieveInformationModelFind

debug_logger()

def handle_store(event):
    """Handle a C-STORE request event."""
    ds = event.dataset
    ds.file_meta = event.file_meta

    # Save the dataset using the SOP Instance UID as the filename
    # File will be save in current path
    ds.save_as(ds.SOPInstanceUID, write_like_original=False)

    # Return a 'Success' status
    return 0x0000

handlers = [(evt.EVT_C_STORE, handle_store)]

# Find SOP clas
PatientRootQueryRetrieveInformationModelFind = '1.2.840.10008.5.1.4.1.2.1.1'
PatientRootQueryRetrieveInformationModelGet = '1.2.840.10008.5.1.4.1.2.1.3'
PatientRootQueryRetrieveInformationModelMove = '1.2.840.10008.5.1.4.1.2.1.2'

MRImageStorage = '1.2.840.10008.5.1.4.1.1.4'
# MRImageStorage = '1.2.840.10008.5.1.4.1.1.2'

ae = AE()
# Verification SOP class
ae.add_requested_context('1.2.840.10008.1.1')
ae.add_requested_context(PatientRootQueryRetrieveInformationModelFind)
ae.add_requested_context(PatientRootQueryRetrieveInformationModelGet)
ae.add_requested_context(PatientRootQueryRetrieveInformationModelMove)
ae.add_requested_context(MRImageStorage)

# Add the Storage SCP's supported presentation contexts
ae.supported_contexts = StoragePresentationContexts

# Start our Storage SCP in non-blocking mode, listening on port 11120
ae.ae_title = b'OUR_STORE_SCP'
scp = ae.start_server(('', 11120), block=False, evt_handlers=handlers)

# # Create an SCP/SCU Role Selection Negotiation item for MR Image Storage
# role = build_role(MRImageStorage, scp_role=True)

# Create our Identifier (query) dataset
ds = Dataset()
# ds.PatientID = None
# Mendatory field for the C-FIND
ds.QueryRetrieveLevel = 'PATIENT'
ds.PatientID = '105858_mr'
# Description?
# ds.PatientDescription


# Associate with Orthanc
# Change here
assoc = ae.associate('127.0.0.1', 4242)

if assoc.is_established:
    # GET
    responses = assoc.send_c_find(ds, PatientRootQueryRetrieveInformationModelFind)

    for (status, identifier) in responses:
        if status:
            print(identifier)
            responses_move = assoc.send_c_move(identifier, b'OUR_STORE_SCP', PatientRootQueryRetrieveInformationModelMove)
            print('C-MOVE query status: 0x{0:04x}'.format(status.Status))
        else:
            print('Connection timed out, was aborted or received invalid response')

    # Release the association
    assoc.release()
else:
    print('Association rejected, aborted or never connected')

# Stop our Storage SCP
scp.shutdown()
