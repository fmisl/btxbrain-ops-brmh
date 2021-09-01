import React, {useEffect, useState} from 'react';
import '../App.css';
import {useHistory, useLocation} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux';
import {loadSlices, login, logout, increment, decrement, loadItems, profile, tab_location, groupItem, addStack, updateStack, removeStack, fetchItems} from '../reduxs/actions';
import WeeklyGraph from './components/Charts/WeeklyGraph'
import WeeklyPie from './components/Charts/WeeklyPie'
// import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

function Dashboard(props) {
  const fileList = useSelector(state => state.fileList);
  const [NofPIB, setNofPIB] = useState(0);
  const [NofFMM, setNofFMM] = useState(0);
  const [NofFBB, setNofFBB] = useState(0);
  const [NofFBP, setNofFBP] = useState(0);
  const [recent7dates, setRecent7dates] = useState([0,0,0,0,0,0,0]);
  const [NofPIBbyDay, setNofPIBbyDay] = useState([0,0,0,0,0,0,0]);
  const [NofFMMbyDay, setNofFMMbyDay] = useState([0,0,0,0,0,0,0]);
  const [NofFBBbyDay, setNofFBBbyDay] = useState([0,0,0,0,0,0,0]);
  const [NofFBPbyDay, setNofFBPbyDay] = useState([0,0,0,0,0,0,0]);
  const counter = useSelector(state => state.counter);
  const stackManager = useSelector(state => state.stackManager);
  const isLogged = useSelector(state => state.isLogged);
  const dispatch = useDispatch();
  const history =useHistory();
  const location = useLocation();
  const username = localStorage.getItem('username');

  useEffect( async ()=>{
    const PIBList = fileList.filter((v,i)=>v.Tracer=='[11C]PIB');
    const FMMList = fileList.filter((v,i)=>v.Tracer=='[18F]FMM');
    const FBPList = fileList.filter((v,i)=>v.Tracer=='[18F]FBP');
    const FBBList = fileList.filter((v,i)=>v.Tracer=='[18F]FBB');
    setNofPIB(PIBList.length);
    setNofFMM(FMMList.length);
    setNofFBP(FBPList.length);
    setNofFBB(FBBList.length);
    
    const date0 = new Date();
    const date1 = new Date(date0);
    const date2 = new Date(date0);
    const date3 = new Date(date0);
    const date4 = new Date(date0);
    const date5 = new Date(date0);
    const date6 = new Date(date0);
    date1.setDate(date0.getDate() - 1);
    date2.setDate(date0.getDate() - 2);
    date3.setDate(date0.getDate() - 3);
    date4.setDate(date0.getDate() - 4);
    date5.setDate(date0.getDate() - 5);
    date6.setDate(date0.getDate() - 6);

    const recent7dates = [
      date0.getFullYear()+'-'+('0' + (date0.getMonth()+1)).slice(-2)+'-'+('0' + date0.getDate()).slice(-2), 
      date1.getFullYear()+'-'+('0' + (date1.getMonth()+1)).slice(-2)+'-'+('0' + date1.getDate()).slice(-2), 
      date2.getFullYear()+'-'+('0' + (date2.getMonth()+1)).slice(-2)+'-'+('0' + date2.getDate()).slice(-2), 
      date3.getFullYear()+'-'+('0' + (date3.getMonth()+1)).slice(-2)+'-'+('0' + date3.getDate()).slice(-2), 
      date4.getFullYear()+'-'+('0' + (date4.getMonth()+1)).slice(-2)+'-'+('0' + date4.getDate()).slice(-2), 
      date5.getFullYear()+'-'+('0' + (date5.getMonth()+1)).slice(-2)+'-'+('0' + date5.getDate()).slice(-2), 
      date6.getFullYear()+'-'+('0' + (date6.getMonth()+1)).slice(-2)+'-'+('0' + date6.getDate()).slice(-2), 
    ]
    // console.log(recent7dates);
    setRecent7dates(recent7dates);

    const NofDate0 = fileList.filter((v,i)=>v.Update.split(' ')[0]==recent7dates[0])
    const NofDate1 = fileList.filter((v,i)=>v.Update.split(' ')[0]==recent7dates[1])
    const NofDate2 = fileList.filter((v,i)=>v.Update.split(' ')[0]==recent7dates[2])
    const NofDate3 = fileList.filter((v,i)=>v.Update.split(' ')[0]==recent7dates[3])
    const NofDate4 = fileList.filter((v,i)=>v.Update.split(' ')[0]==recent7dates[4])
    const NofDate5 = fileList.filter((v,i)=>v.Update.split(' ')[0]==recent7dates[5])
    const NofDate6 = fileList.filter((v,i)=>v.Update.split(' ')[0]==recent7dates[6])
    // console.log(NofDate0)
    setNofPIBbyDay([
      NofDate0.filter((v,i)=>v.Tracer=='[11C]PIB').length,  
      NofDate1.filter((v,i)=>v.Tracer=='[11C]PIB').length, 
      NofDate2.filter((v,i)=>v.Tracer=='[11C]PIB').length, 
      NofDate3.filter((v,i)=>v.Tracer=='[11C]PIB').length, 
      NofDate4.filter((v,i)=>v.Tracer=='[11C]PIB').length, 
      NofDate5.filter((v,i)=>v.Tracer=='[11C]PIB').length, 
      NofDate6.filter((v,i)=>v.Tracer=='[11C]PIB').length, 
    ]);
    setNofFMMbyDay([
      NofDate0.filter((v,i)=>v.Tracer=='[18F]FMM').length,  
      NofDate1.filter((v,i)=>v.Tracer=='[18F]FMM').length, 
      NofDate2.filter((v,i)=>v.Tracer=='[18F]FMM').length, 
      NofDate3.filter((v,i)=>v.Tracer=='[18F]FMM').length, 
      NofDate4.filter((v,i)=>v.Tracer=='[18F]FMM').length, 
      NofDate5.filter((v,i)=>v.Tracer=='[18F]FMM').length, 
      NofDate6.filter((v,i)=>v.Tracer=='[18F]FMM').length, 
    ]);
    setNofFBPbyDay([
      NofDate0.filter((v,i)=>v.Tracer=='[18F]FBP').length,  
      NofDate1.filter((v,i)=>v.Tracer=='[18F]FBP').length, 
      NofDate2.filter((v,i)=>v.Tracer=='[18F]FBP').length, 
      NofDate3.filter((v,i)=>v.Tracer=='[18F]FBP').length, 
      NofDate4.filter((v,i)=>v.Tracer=='[18F]FBP').length, 
      NofDate5.filter((v,i)=>v.Tracer=='[18F]FBP').length, 
      NofDate6.filter((v,i)=>v.Tracer=='[18F]FBP').length, 
    ]);
    setNofFBBbyDay([
      NofDate0.filter((v,i)=>v.Tracer=='[18F]FBB').length, 
      NofDate1.filter((v,i)=>v.Tracer=='[18F]FBB').length, 
      NofDate2.filter((v,i)=>v.Tracer=='[18F]FBB').length, 
      NofDate3.filter((v,i)=>v.Tracer=='[18F]FBB').length, 
      NofDate4.filter((v,i)=>v.Tracer=='[18F]FBB').length, 
      NofDate5.filter((v,i)=>v.Tracer=='[18F]FBB').length, 
      NofDate6.filter((v,i)=>v.Tracer=='[18F]FBB').length, 
    ]);

  },[fileList.length])
  return (
    <div className="content">
      {/* <Sidebar />
      <Headerbar/> */}
      <div className="content-page">
        <div className="dashboard-title">
          <div >
            <div className="dashboard-text" style={{marginBottom:"0"}}>
              Hello, 
              <span style={{color:"#118AF7"}}> 
                &nbsp;Dr.{username}
              </span>
            </div>
            <div className="dashboard-text" style={{marginTop:"0", marginBottom:"0", lineHeight: "10px"}} >
              <span style={{fontWeight: "300",fontSize: "20px",color: "#91919C"}}>
                Have a great day at work
              </span>
            </div>
          </div>
          <div style={{width:"206px"}}>
            {/* <div className="dashboard-text">
              <span style={{fontWeight: "300",fontSize: "24px"}}>
              ID
              </span>
              &nbsp;&nbsp;
              <span style={{fontWeight: "500",fontSize: "24px"}}>
              2020-0000
              </span>
            </div> */}
            <div className="dashboard-text" >
              <span style={{fontWeight: "300",fontSize: "24px"}}>
                Position
              </span>
              &nbsp;&nbsp;
              <span style={{fontWeight: "500",fontSize: "24px"}}>
                Dr.
              </span>
            </div>
            <div className="dashboard-text" >
              <span style={{fontWeight: "300",fontSize: "24px"}}>
                Hospital
              </span>
              &nbsp;&nbsp;
              <span style={{fontWeight: "500",fontSize: "24px"}}>
                SNUH
              </span>
            </div>
          </div>
        </div>
        <div className="dashboard-box">
          <div className="dashboard-box1">
            <span>Weekly Analysis</span>
            <span>{recent7dates[6]} ~ {recent7dates[0]}</span>
            <br/>
            <br/>
            <WeeklyGraph recent7dates={recent7dates} NofPIBbyDay={NofPIBbyDay} NofFMMbyDay={NofFMMbyDay} NofFBBbyDay={NofFBBbyDay} NofFBPbyDay={NofFBPbyDay}/>
          </div>
          <div className="dashboard-box2">
            <span>Amyloid Tracers</span>
            <span></span>
            <span>{NofPIB+NofFMM+NofFBB+NofFBP}</span>
            <span>Total</span>
            <br/>
            <br/>
            <WeeklyPie NofPIB={NofPIB} NofFMM={NofFMM} NofFBP={NofFBP} NofFBB={NofFBB} />
          </div>
        </div>

        {/* <div className="redux-info">
          <h1>isLogged: {isLogged.toString()}</h1>
          <h1>Dashboard page</h1>
          <h1>listSelected: {listSelected}</h1>
          <h1>Counter: {counter}</h1>
          <button onClick={()=> dispatch(increment())}>+</button>
          <button onClick={()=> dispatch(decrement())}>-</button>
        </div> */}
      </div>
    </div>
  );
}

export default Dashboard;