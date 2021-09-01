import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import '../App.css';
import IconDelete from '../images/IconDelete';
import WorklistTable from './components/Tables/WorklistTable'
import {login, logout, increment, decrement, loadItems, profile, tab_location, groupItem, addStack, updateStack, removeStack, openSelect} from '../reduxs/actions';
import {useSelector, useDispatch} from 'react-redux';
import {BrowserRouter as Router, Switch, Route, Redirect, useHistory, useParams, useLocation} from 'react-router-dom' 
import * as services from '../services/fetchApi'
import {IPinUSE} from '../services/IPs'

function Worklist({ isShowing, hide, lock, closeWorklist }) {
  const dispatch = useDispatch();
  const counter = useSelector(state => state.counter);
  const stackManager = useSelector(state => state.stackManager);
  const fileList = useSelector(state => state.fileList);
  const history =useHistory();
  // const [isShown, setIsShown] = useState(false);
  const changePageByKey = (e) =>{
    switch (e.keyCode){
      // case 17:
      //   hide()
      //   break;
      default:
        console.log('press up or down key only', e.keyCode)
    }
  }
  const niftiDownload = async () =>{
    // console.log('download nifti')
    const token = localStorage.getItem('token')
    const username = localStorage.getItem('username')
    // // res = await services.TokenVerify({'token':token})
    const selectedList = fileList.filter((v, i)=>v.Select == true && v.Group == 1);
    // console.log(selectedList.length)
    if (selectedList.length != 0){
      const res = await services.downloadNifti({'token':token, 'selectedList':selectedList});
      if (res.status == 200){
        const downloadUrl = IPinUSE+'result/download/'+username+'/downloader/brightonix_imaging.zip';
        setTimeout(() => window.open(downloadUrl, "_blank"), 1000);
      } else{
        alert('Download failed');
      }
    } else {
      alert('No files selected')
    }
  }
  return (
      <React.Fragment >
        {/* aria-modal aria-hidden tabIndex={-1} role="dialog"  */}
        <div className={`modal-right-wrapper ${isShowing && 'show'}`}>
          <div className="modal-right" onClick={(e)=>{e.stopPropagation(); lock()}} tabIndex={0} onKeyDown={(e)=>{changePageByKey(e)}}>
            <div className="modal-right-btn" onClick={(e)=>{e.stopPropagation(); hide()}}><div></div></div>
            <div className="modal-right-header" >
              WORKLIST 
            </div>
            <div className="modal-right-body">
              <WorklistTable/>
            </div>
            <div style={{display:"flex", marginTop:"21px", justifyContent:"flex-end"}}>
              <div className="upload-right-btn" onClick={niftiDownload}>Export Nifti</div>
              {/* <div className="upload-right-btn type1">Save</div> */}
              <div className="upload-right-btn type1" onClick={()=>{
                const nextStackManager = [...stackManager, ...fileList.filter((v, i)=>v.Opened == false && v.Select == true).map(v=>{return {fileID:v.fileID, currentC:50, currentS:50, currentA:50, PatientName:v.PatientName, PatientID:v.PatientID, Age:v.Age, Sex:v.Sex, in_suvr_max:v.in_suvr_max, in_suvr_min:v.in_suvr_min, out_suvr_max:v.out_suvr_max, out_suvr_min:v.out_suvr_min}})];
                // const nextStackManager = [...stackManager, ...fileList.filter((v,i)=>{if(v.Opened == false && v.Select == true) return {fileID:v.fileID, currentC:50, currentS:50, currentA:50}})]
                const lastIndex = nextStackManager.length-1;
                dispatch(openSelect());
                dispatch(addStack(nextStackManager));
                {lastIndex >= 0 ? dispatch(tab_location({...counter, tabX:lastIndex, fileID:nextStackManager[lastIndex].fileID})):dispatch(tab_location({...counter, tabX:null, fileID:null}))}
                setTimeout(() => history.push('/analysis/suvr/'+lastIndex), 100);
                }}>Open</div>
            </div>

          </div>
        </div>
        <div className="modal-right-overlay"  onClick={hide}/>
      </React.Fragment>
  );
}
export default Worklist;