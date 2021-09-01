import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import '../App.css';
import IconDelete from '../images/IconDelete';
import WorklistTable from './components/Tables/WorklistTable'

function Worklist({ isShowing, hide }) {
  // const [isShown, setIsShown] = useState(false);
  return (
    isShowing ? 
    ReactDOM.createPortal(
      <React.Fragment>
        <div className="modal-overlay"/>
        <div className="modal-wrapper" aria-modal aria-hidden tabIndex={-1} role="dialog"  onClick={hide}>
          <div className="modal" onClick={(e)=>e.stopPropagation()}>
            <div className="modal-header" >
              WORKLIST <span onClick={hide} ><IconDelete className="worklist-delete" /></span>
            </div>
            <div className="modal-body">
              <WorklistTable/>
            </div>
            <div style={{display:"flex", marginTop:"21px", justifyContent:"flex-end"}}>
              <div className="upload-btn">Export Nifti</div>
              <div className="upload-btn type1">Save</div>
              <div className="upload-btn type1">Open</div>
            </div>

          </div>
        </div>
      </React.Fragment>, document.body
    ) : null
  );
}
export default Worklist;