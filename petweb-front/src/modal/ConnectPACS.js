import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
// import '../App.css';
import './ConnectPACS.css';
import IconDelete from '../images/IconDelete';
import PACsTable from './components/Tables/PACsTable';
import PACsTable2 from './components/Tables/PACsTable2';
import loadingGIF from '../images/gif/viewer_spinner.gif'
// import * as services from '../services/fetchApi'
import {IPinUSE} from '../services/IPs'
import {useSelector, useDispatch} from 'react-redux';
import * as services from '../services/fetchApi'
import {increment, decrement, addToList, removeFromList,loadItems, fetchItems, openSelect, tab_location, addStack} from '../reduxs/actions';
const styleDiv ={
  position: "absolute",
  display: "flex",
  justifyContent:"center",
  alignItems:"center",
  // border: "1px white solid",
  // boxSizig: "border-box",
  width: "46%",
  height:"46%",
  // background: "black",
}
function ConnectPACS({ setListID, listID, setFetchState, fetchState, selectTracer, setSelectTracer, fileList, isShowing, runner, hide, removeFileList, updateFileList }) {
  const date0 = new Date();
  const currentDate = date0.getFullYear()+('0' + (date0.getMonth()+1)).slice(-2)+('0' + date0.getDate()).slice(-2);
  const [finddata, setFinddata] = useState([]);
  const [getdata, setGetdata] = useState([]);
  const [tickCounter,setTickCounter] = useState(0);
  const [dcmCount, setDcmCount] = useState(0);
  const [allDcmCount, setAllDcmCount] = useState(0);
  const [patientCount, setPatientCount] = useState(0);
  const [stepChecker, setStep] = useState(0);
  const [stepInfo, setStepInfo] = useState({
    PatientID: '', 	//사용할 문자열들을 저장하는 객체 형태로 관리!
    StudyDate: '',
    StudyDescription: '',
  });
  const [inputs, setInputs] = useState({
    PatientID: '', 	//사용할 문자열들을 저장하는 객체 형태로 관리!
    StudyDate: currentDate,
    StudyDescription: 'betaben',
  });
  const { PatientID, StudyDate, StudyDescription } = inputs; 
  const [hoverState, setHoverState] = useState(false);
  const [alarm, setAlarm] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [tracer, setTracer] = useState('');
  const [focusItem, setFelectItem] = useState(0);
//   const [tracerModal, setTracerModal] = useState(true);
  const [isChecked, setIsChecked] = useState(true);
  const [currentJPGURL_head, setCurrentJPGURL_head] = useState("");
  const [addToWorklist, setaddToWorklist] = useState(true);
  const username = localStorage.getItem('username');
  const dispatch = useDispatch();
  useEffect(()=>{
    if (inputs !== stepInfo){
      setStep(0);
    }
    // if (stepInfo.PatientID != '' && stepInfo.StudyDate != '' && stepInfo.StudyDescription !=''){
    // }
  }, [inputs])
  useEffect(()=>{
    // // console.log('tick with tickCounter, dcmCount and allDcmCount', tickCounter, dcmCount, allDcmCount)
    const tick = async () =>{
        return setTimeout( async ()=>{
            const token = localStorage.getItem('token')
            const res = await services.dicomsCheck({'token':token})
            let newdata = res.data
            // // console.log(res)
            setDcmCount(newdata.dcmCount)
            setTickCounter(tickCounter+1)
        },1000);
    }
    if(dcmCount == allDcmCount) {
        // console.log('reset tickCounter to 0',dcmCount, tickCounter)
        // setTickCounter(0)
        return undefined
    };
    tick();
    return ()=>clearTimeout(tick);
  },[tickCounter])
  useEffect(() => {
    if (isShowing) {
        // const myInterval = setInterval(async ()=>{
        //     const token = localStorage.getItem('token')
        //     const res = await services.dicomsCheck({'token':token})
        //     let newdata = res.data
        //     // console.log(newdata);
        //     setDcmCount(newdata.dcmCount)
        // }, 1000)
        // console.log("useEffect-isShowing: true")
        setCurrentJPGURL_head('');
    } else {
        // console.log("useEffect-isShowing: false")
        setCurrentJPGURL_head('');
    }
    // return  _ => clearInterval(myInterval);
  },[isShowing])
  const getJPGURL=(filename)=>{
    if (filename == ''){
        setCurrentJPGURL_head('')
    } else {
        const fname = filename.split('.').slice(0,-1).join()
        const tempURL_head = IPinUSE+'result/download/'+username+'/uploader/'+fname
        setCurrentJPGURL_head(tempURL_head)
    }
  }
  useEffect(() => {
    if (alarm) {
      setAlarm(false);
      // alert(`Selected: [\u00B9\u2078F] `+tracer);
      if (tracer=="Pittsburg Compound B(PIB)"){
        setTimeout(() => alert(`Selected: [\u00B9\u00B9C] `+tracer), 100);
      } else {
        setTimeout(() => alert(`Selected: [\u00B9\u2078F] `+tracer), 100);
      }
    }
  },[alarm])
//   useEffect(()=>{
//     const myInterval = setInterval(async ()=>{
//         const token = localStorage.getItem('token')
//         const res = await services.dicomsCheck({'token':token})
//         let newdata = res.data
//         // console.log(newdata);
//     }, 1000)
//     return ()=>{
//         clearInterval(myInterval);
//     };
//   },[])
  const handleMouseHover=()=> {
    setHoverState(!hoverState);
  }
  const deleteFiles = async () =>{
    const token = localStorage.getItem('token')
    const res = await services.deleteFile({'token':token})
    const uploadList = res.data
    setFinddata([])
    setGetdata([])
  }
  const findHandler = async () =>{
    //   alert('getHandler')
    // setFetchState(true);
    // setListID(null);
    setFetching(true);
    const token = localStorage.getItem('token')
    const res = await services.postPacs({'Method':'find','PatientID':PatientID, 'StudyDate':StudyDate, 'StudyDescription':StudyDescription, 'token':token})
    console.log(res.data);
    if (res.data.length == 0){
        setStep(0); 
        alert('No data found from PACs, Search other options')
        setFinddata([]);
    } else {
        setStep(1); 
        setFinddata(res.data);
        setStepInfo(inputs);
        setDcmCount(0);
        setAllDcmCount(res.data.length*1.01*71);
    }
    setFetching(false);
  }
  const getHandler = async () =>{
    //   alert('getHandler')
    // setFetchState(true);
    // setListID(null);
    setFetching(true);
    // setTickCounter(tickCounter+1)
    // myTimer();
    console.log("test: ", finddata)
    const Array_PatientID = finddata.map(v=>v.PatientID)
    const Array_PatientName = finddata.map(v=>v.PatientName)
    const Array_StudyDate = finddata.map(v=>v.StudyDate)
    const Array_StudyDescription = finddata.map(v=>v.StudyDescription)
    const Array_StudyInstanceUID = finddata.map(v=>v.StudyInstanceUID)
    const Array_SeriesInfo = finddata.map(v=>v.SeriesInfo)
    setPatientCount(Array_PatientID.length)
    setTickCounter(tickCounter+1)
    const token = localStorage.getItem('token')
    const res = await services.postPacs({'Method':'get',
    'PatientID':Array_PatientID, 'PatientName':Array_PatientName, 'StudyInstanceUID':Array_StudyInstanceUID, 'SeriesInfo':Array_SeriesInfo,  
    'StudyDate':Array_StudyDate, 'StudyDescription':Array_StudyDescription, 'token':token})
    // console.log(res.data);
    // setGetdata(res.data);
    setGetdata(res.data)
    setStepInfo({
      PatientID: '',
      StudyDate: '',
      StudyDescription: '',
    })
    setStep(2); 
    // clearMyTimer();
    setTimeout(()=>setDcmCount(allDcmCount),1000);
    
    setFetching(false);
    // const uploadList = res.data
    // setFileList(uploadList)
  }
  const removeIteminFindData =(id)=>{
    
      const filteredFindData = finddata.filter((v,i)=>{return v.id!=id})
      setFinddata(filteredFindData);
      if (filteredFindData.length == 0){
        alert('No dicom to download on the list, Try search again')
        handleReset();
        setCurrentJPGURL_head('');
      }
  }
  const removeIteminGetData =(id)=>{
      const filteredGetData = getdata.filter((v,i)=>{return v.id!=id})
      setGetdata(filteredGetData);
  }
  const handleChange = (e) => { 
    const { name, value }  = e.target;
    if (fetching == false){
        setInputs({
          ...inputs,
          [name]: value,
        });
    }
  };
  
  const handleReset = () => {
    setStepInfo({
      PatientID: '',
      StudyDate: '',
      StudyDescription: '',
    })
    setDcmCount(0);
    setAllDcmCount(0);
    setStep(0); 
    setFinddata([]);
    setGetdata([]);
    setFetching(false);
  };

  const runFiles = async (selectTracer, addToWorklist) =>{
    const token = localStorage.getItem('token')
    let tracer = ""
    if (selectTracer == "betaben"){
        tracer = "[18F]FBB";
    } else if (selectTracer == "betapir"){
        tracer = "[18F]FBP";
    } else if (selectTracer == "pib"){
        tracer = "[11C]PIB"
    } else {
        tracer = "[18F]FBB";
    }
    // console.log("getdata: ",getdata)
    const res = await services.runFile({'token':token, 'obj':getdata, 'Tracer':tracer, 'addToWorklist':addToWorklist})
    const putList = res.data
    dispatch(fetchItems(putList))
    // console.log("putList:",putList)
    // console.log("fileList:", fileList)
    handleReset();
    deleteFiles();
  }
//   const myTimer = async()=>{
//       this.myInterval = setInterval(async ()=>{
//           const token = localStorage.getItem('token')
//           const res = await services.dicomsCheck({'token':token})
//           let newdata = res.data
//           // console.log(newdata);
//       }, 1000)
//   }
//   const clearMyTimer = () =>{
//     clearInterval(this.myInterval);
//   }
//   // console.log("inputs:",inputs)
//   // console.log("stepInfo:", stepInfo)
// // console.log(currentJPGURL_head ,listID);
// console.log("finddata: ", finddata);
  return (
    isShowing ? 
    ReactDOM.createPortal(
      <React.Fragment>
        <div className="modal-overlay"/>
        <div className="modal-wrapper" aria-modal aria-hidden tabIndex={-1} role="dialog" onClick={()=>{hide(false); deleteFiles();handleReset();}}>
          <div className="modal" onClick={(e)=>e.stopPropagation()}>
            <div className="modal-header" >
              PACS <span onClick={()=>{hide(false); deleteFiles();handleReset();}} ><IconDelete className="worklist-delete" /></span>
            </div>
            <div className="modal-body">
                <div style={{position:"relative", width:`${stepChecker==2 ? "810px":"1585px"}`, background:"#383C41", overflow:"hidden"}} onClick={()=>{setFelectItem(Math.floor(Math.random() * 20+30))}}>
                    <div style={{display:"flex", paddingLeft:"3px", alignItems:"center", justifyContent:"flex-start", height:"12%", width:"100%", border:"0px red solid", boxSizing:"border-box", background:"#2c3033"}}>
                        <div className="pacs-form" style={{border:"0px red solid", display:"flex", flexDirection:"column", width:"220px"}}>
                            <label for="PatientID">Patient_ID
                                <input style={{width:"190px"}} name="PatientID" type="text" placeholder="PatientID"
                                    value={PatientID}
                                    onChange={handleChange}/>
                            </label>
                        </div>
                        <div className="pacs-form" style={{border:"0px red solid", display:"flex", flexDirection:"column", width:"220px"}}>
                            <label for="StudyDate">StudyDate
                                <input style={{width:"190px"}} name="StudyDate" type="text" placeholder="StudyDate"
                                    value={StudyDate}
                                    onChange={handleChange}/>
                            </label>
                        </div>
                        <div className="pacs-form" style={{border:"0px red solid", display:"flex", flexDirection:"column", width:"220px"}}>
                            <label for="StudyDescription">StudyDescription
                                <input style={{width:"190px"}} name="StudyDescription" type="text" placeholder="StudyDescription"
                                    value={StudyDescription}
                                    onChange={handleChange}/>
                            </label>
                        </div>
                        {(stepChecker == 0 && !fetching) && <div className="pacs-form" style={{display: "flex", justifyContent:"flex-end", border:"0px red solid", boxSizing:"border-box"}}>
                            <div style={{}} className="pacs-btn" onClick={()=>{setCurrentJPGURL_head(''); findHandler();}}>Search</div>
                        </div>}
                        {(stepChecker == 0 && fetching) && <div className="pacs-form" style={{display: "flex", justifyContent:"flex-end", border:"0px red solid", boxSizing:"border-box"}}>
                            <div style={{}} className="pacs-btn" >Searching...</div>
                        </div>}
                        {stepChecker == 1 && !fetching &&
                        <div className="pacs-form" style={{display: "flex", justifyContent:"flex-end", border:"0px red solid", boxSizing:"border-box"}}>
                            <div style={{}} className="pacs-btn type1" onClick={()=>{setCurrentJPGURL_head(''); getHandler();}}>Download</div>
                        </div>}
                        {stepChecker == 1 && fetching &&
                        <div className="pacs-form" style={{display: "flex", justifyContent:"flex-end", border:"0px red solid", boxSizing:"border-box"}}>
                            <div style={{}} className="pacs-btn">Loading...</div>
                        </div>}
                        {stepChecker == 2 && !fetching &&
                        <div className="pacs-form" style={{display: "flex", justifyContent:"flex-end", border:"0px red solid", boxSizing:"border-box"}}>
                            <div style={{}} className="pacs-btn" onClick={()=>{setCurrentJPGURL_head(''); handleReset();deleteFiles();}}>Reset</div>
                        </div>}
                    </div>
                    {stepChecker == 1 && 
                    <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", marginTop:"20px", height:"80%", width:"1585px", border:"0px white solid", boxSizing:"border-box", overflow:"hidden"}}>
                        {fetching ? 
                        <div style={{border: "0px red solid", position:"relative"}}><div style={{position:"absolute", top:"29%", left:"32%", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", width:"70px", fontSize:"28px", border:"0px blue solid"}}>
                            <div>{Math.ceil(dcmCount/71).toFixed(0)}/{patientCount}</div>
                            <div>{(dcmCount/allDcmCount*100).toFixed(0)}%</div>
                        </div>
                            <img width="200px" src={loadingGIF}/>
                        </div>
                        :
                        <PACsTable setListID={setListID} selectTracer={selectTracer} fileList={finddata} getJPGURL={getJPGURL} removeFileList={removeIteminFindData} updateFileList={updateFileList}/>}
                    </div>}
                    {stepChecker == 2 && <div style={{display:"flex", justifyContent:"center", alignItems:"center", marginTop:"20px", height:"70%", width:"103%", border:"0px white solid", boxSizing:"border-box"}}>
                        {fetching ? <div></div>:<PACsTable2 setListID={setListID} selectTracer={selectTracer} fileList={getdata} getJPGURL={getJPGURL} removeFileList={removeIteminGetData} updateFileList={updateFileList}/>}
                    </div>}
                </div>
                {stepChecker == 2 && <div style={{position:"relative",width:"750px",height:"100%", background:"#383C41", border:"0px red solid"}}>
                    <div style={{...styleDiv, ...{top:"0", left:"0"}}} >
                    {currentJPGURL_head != "" && <img width={'400px'} style={{transform:`scale(${getdata[listID]?.InputAffineX0 < 0 ? "-1":"1"}, ${getdata[listID]?.InputAffineZ2 < 0 ? "-1":"1"})`, border:"1px white solid", boxSizing:"border-box"}} src={currentJPGURL_head+'_hy.jpg'} alt=" "/>}
                    </div>
                    <div style={{...styleDiv, ...{top:"", left:"50%"}}} >
                    
                    {currentJPGURL_head != "" && <img width={'400px'} style={{transform:`scale(${getdata[listID]?.InputAffineY1 < 0 ? "-1":"1"}, ${getdata[listID]?.InputAffineZ2 < 0 ? "-1":"1"})`, border:"1px white solid", boxSizing:"border-box"}} src={currentJPGURL_head+'_hx.jpg'} alt=" "/>}
                    </div>
                    <div style={{...styleDiv, ...{top:"50%", left:"0"}}} >
                    {currentJPGURL_head != "" && <img width={'400px'} style={{transform:`scale(${getdata[listID]?.InputAffineX0 < 0 ? "1":"-1"}, ${getdata[listID]?.InputAffineY1 < 0 ? "-1":"1"})`, border:"1px white solid", boxSizing:"border-box"}} src={currentJPGURL_head+'_hz.jpg'} alt=" "/>}
                    </div>
                    <div style={{...styleDiv, ...{top:"50%", left:"50%"}}} >
                    </div>
                    {currentJPGURL_head != "" && <div style={{position:"absolute", border:"0px red solid", top:"20%", left:"2%", width:"40%", userSelect:"none", display:"flex", justifyContent:"space-between", flexDirection:'row'}}><div>R</div><div>L</div></div>}
                    {currentJPGURL_head != "" && <div style={{position:"absolute", border:"0px red solid", top:"20%", left:"52%", width:"40%", userSelect:"none", display:"flex", justifyContent:"space-between", flexDirection:'row'}}><div>P</div><div>A</div></div>}
                    {currentJPGURL_head != "" && <div style={{position:"absolute", border:"0px red solid", top:"70%", left:"2%", width:"40%", userSelect:"none", display:"flex", justifyContent:"space-between", flexDirection:'row'}}><div>R</div><div>L</div></div>}
                    {currentJPGURL_head != "" && <div style={{position:"absolute", border:"0px red solid", top:"5%", left:"23%", height:"37%", userSelect:"none", display:"flex", justifyContent:"space-between", flexDirection:'column'}}><div>S</div><div>I</div></div>}
                    {currentJPGURL_head != "" && <div style={{position:"absolute", border:"0px red solid", top:"5%", left:"73%", height:"37%", userSelect:"none", display:"flex", justifyContent:"space-between", flexDirection:'column'}}><div>S</div><div>I</div></div>}
                    {currentJPGURL_head != "" && <div style={{position:"absolute", border:"0px red solid", top:"50%", left:"23%", height:"45%", userSelect:"none", display:"flex", justifyContent:"space-between", flexDirection:'column'}}><div>A</div><div>P</div></div>}
                </div>}
            </div>
            {/* <div className="modal-body">
                <div style={{position:"relative", width:"810px", background:"#383C41", overflow:"hidden"}} onClick={()=>{setFelectItem(Math.floor(Math.random() * 20+30))}}>
                    <div style={{display:"flex", paddingLeft:"3px", alignItems:"center", justifyContent:"space-between", height:"12%", width:"100%", border:"0px red solid", boxSizing:"border-box", background:"#2c3033"}}>
                        <div className="pacs-form" style={{border:"0px red solid", display:"flex", flexDirection:"column", width:"23%"}}>
                            <label for="PatientID">Patient_ID
                                <input name="PatientID" type="text" placeholder="PatientID"
                                    value={PatientID}
                                    onChange={handleChange}/>
                            </label>
                        </div>
                        <div className="pacs-form" style={{border:"0px red solid", display:"flex", flexDirection:"column", width:"21%"}}>
                            <label for="StudyDate">StudyDate
                                <input name="StudyDate" type="text" placeholder="StudyDate"
                                    value={StudyDate}
                                    onChange={handleChange}/>
                            </label>
                        </div>
                        <div className="pacs-form" style={{border:"0px red solid", display:"flex", flexDirection:"column", width:"28%"}}>
                            <label for="StudyDescription">StudyDescription
                                <input name="StudyDescription" type="text" placeholder="StudyDescription"
                                    value={StudyDescription}
                                    onChange={handleChange}/>
                            </label>
                        </div>
                        {(stepChecker == 0 && !fetching) && <div className="pacs-form" style={{display: "flex", justifyContent:"flex-end", border:"0px red solid", boxSizing:"border-box"}}>
                            <div style={{}} className="pacs-btn" onClick={()=>{setCurrentJPGURL_head(''); findHandler();}}>Search</div>
                        </div>}
                        {(stepChecker == 0 && fetching) && <div className="pacs-form" style={{display: "flex", justifyContent:"flex-end", border:"0px red solid", boxSizing:"border-box"}}>
                            <div style={{}} className="pacs-btn" >Searching...</div>
                        </div>}
                        {stepChecker == 1 && !fetching &&
                        <div className="pacs-form" style={{display: "flex", justifyContent:"flex-end", border:"0px red solid", boxSizing:"border-box"}}>
                            <div style={{}} className="pacs-btn type1" onClick={()=>{setCurrentJPGURL_head(''); getHandler();}}>Download</div>
                        </div>}
                        {stepChecker == 1 && fetching &&
                        <div className="pacs-form" style={{display: "flex", justifyContent:"flex-end", border:"0px red solid", boxSizing:"border-box"}}>
                            <div style={{}} className="pacs-btn">Loading...</div>
                        </div>}
                        {stepChecker == 2 && !fetching &&
                        <div className="pacs-form" style={{display: "flex", justifyContent:"flex-end", border:"0px red solid", boxSizing:"border-box"}}>
                            <div style={{}} className="pacs-btn" onClick={()=>{setCurrentJPGURL_head(''); handleReset();deleteFiles();}}>Reset</div>
                        </div>}
                    </div>
                    {stepChecker == 1 && 
                    <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", marginTop:"20px", height:"80%", width:"103%", border:"0px white solid", boxSizing:"border-box"}}>
                        {fetching ? 
                        <div style={{border: "0px red solid", position:"relative"}}><div style={{position:"absolute", top:"29%", left:"32%", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", width:"70px", fontSize:"28px", border:"0px blue solid"}}><div>{(dcmCount/148).toFixed(0)}/{patientCount}</div><div>{(dcmCount/allDcmCount*100).toFixed(0)}%</div></div><img width="200px" src={loadingGIF}/></div>
                        :
                        <PACsTable setListID={setListID} selectTracer={selectTracer} fileList={finddata} getJPGURL={getJPGURL} removeFileList={removeIteminFindData} updateFileList={updateFileList}/>}
                    </div>}
                    {stepChecker == 2 && <div style={{display:"flex", justifyContent:"center", alignItems:"center", marginTop:"20px", height:"70%", width:"103%", border:"0px white solid", boxSizing:"border-box"}}>
                        {fetching ? <div></div>:<PACsTable2 setListID={setListID} selectTracer={selectTracer} fileList={getdata} getJPGURL={getJPGURL} removeFileList={removeIteminGetData} updateFileList={updateFileList}/>}
                    </div>}
                </div>
                <div style={{position:"relative",width:"750px",height:"100%", background:"#383C41", border:"0px red solid"}}>
                    <div style={{...styleDiv, ...{top:"0", left:"0"}}} >
                    {currentJPGURL_head != "" && <img width={'400px'} style={{transform:`scale(${getdata[listID]?.InputAffineX0 < 0 ? "-1":"1"}, ${getdata[listID]?.InputAffineZ2 < 0 ? "-1":"1"})`, border:"1px white solid", boxSizing:"border-box"}} src={currentJPGURL_head+'_hy.jpg'} alt=" "/>}
                    </div>
                    <div style={{...styleDiv, ...{top:"", left:"50%"}}} >
                    
                    {currentJPGURL_head != "" && <img width={'400px'} style={{transform:`scale(${getdata[listID]?.InputAffineY1 < 0 ? "-1":"1"}, ${getdata[listID]?.InputAffineZ2 < 0 ? "-1":"1"})`, border:"1px white solid", boxSizing:"border-box"}} src={currentJPGURL_head+'_hx.jpg'} alt=" "/>}
                    </div>
                    <div style={{...styleDiv, ...{top:"50%", left:"0"}}} >
                    {currentJPGURL_head != "" && <img width={'400px'} style={{transform:`scale(${getdata[listID]?.InputAffineX0 < 0 ? "1":"-1"}, ${getdata[listID]?.InputAffineY1 < 0 ? "-1":"1"})`, border:"1px white solid", boxSizing:"border-box"}} src={currentJPGURL_head+'_hz.jpg'} alt=" "/>}
                    </div>
                    <div style={{...styleDiv, ...{top:"50%", left:"50%"}}} >
                    </div>
                    {currentJPGURL_head != "" && <div style={{position:"absolute", border:"0px red solid", top:"20%", left:"2%", width:"40%", userSelect:"none", display:"flex", justifyContent:"space-between", flexDirection:'row'}}><div>R</div><div>L</div></div>}
                    {currentJPGURL_head != "" && <div style={{position:"absolute", border:"0px red solid", top:"20%", left:"52%", width:"40%", userSelect:"none", display:"flex", justifyContent:"space-between", flexDirection:'row'}}><div>P</div><div>A</div></div>}
                    {currentJPGURL_head != "" && <div style={{position:"absolute", border:"0px red solid", top:"70%", left:"2%", width:"40%", userSelect:"none", display:"flex", justifyContent:"space-between", flexDirection:'row'}}><div>R</div><div>L</div></div>}
                    {currentJPGURL_head != "" && <div style={{position:"absolute", border:"0px red solid", top:"5%", left:"23%", height:"37%", userSelect:"none", display:"flex", justifyContent:"space-between", flexDirection:'column'}}><div>S</div><div>I</div></div>}
                    {currentJPGURL_head != "" && <div style={{position:"absolute", border:"0px red solid", top:"5%", left:"73%", height:"37%", userSelect:"none", display:"flex", justifyContent:"space-between", flexDirection:'column'}}><div>S</div><div>I</div></div>}
                    {currentJPGURL_head != "" && <div style={{position:"absolute", border:"0px red solid", top:"50%", left:"23%", height:"45%", userSelect:"none", display:"flex", justifyContent:"space-between", flexDirection:'column'}}><div>A</div><div>P</div></div>}
                </div>
            </div> */}
            <div style={{display:"flex", marginTop:"21px", justifyContent:"space-between", alignItems:"center"}}>
                <div className="upload-checkbox-label" onClick={()=>{setaddToWorklist(!isChecked); setIsChecked(!isChecked);}}>
                    <div className={`upload-checkbox ${isChecked && 'act'}`}>
                    <div></div>
                    </div>
                    Automatically add to worklist
                </div>
                <div style={{display: "flex"}}>
                    <div style={{}} className="upload-btn"  onClick={()=>{hide(false); deleteFiles();handleReset();}}>Cancel</div>
                    <div style={{}} className={`upload-btn ${stepChecker == 2 && getdata.length != 0 && "type1"}`} onClick={(e)=>{if (stepChecker == 2 && getdata.length != 0){setCurrentJPGURL_head("");hide(false); runFiles(StudyDescription, addToWorklist);}}}>Run</div>
                </div>
            </div>
          </div>
        </div>
      </React.Fragment>, document.body
    ) : null
  );
}
export default ConnectPACS;