import React, { useEffect, useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Headerbar from "./components/Headerbar";
import Worklist from "./modal/Worklist";
import axios from "axios";
// import Sidebar from './pages/components/Sidebar'
import Login from "./routers/login/Login";
import Forgot from "./routers/login/Forgot";
import Signup from "./routers/login/Signup";
import * as services from "./services/fetchApi";
import {
  loadSlices,
  login,
  logout,
  increment,
  decrement,
  loadItems,
  profile,
  tab_location,
  groupItem,
  addStack,
  updateStack,
  removeStack,
  fetchItems,
} from "./reduxs/actions";
import { useSelector, useDispatch } from "react-redux";
import { Dashboard, Upload, View, Analysis, Setting, Report } from "./routers";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useHistory,
  useParams,
  useLocation,
} from "react-router-dom";
// import stackManagerReducer from './reduxs/reducers/stackManager';

function App() {
  const fileList = useSelector((state) => state.fileList);
  const sliceList = useSelector((state) => state.sliceList);
  // const stackManager = fileList.filter(item => {return item.Opened==true});
  // const [stackManager, setstackManager] = useState([]);
  const counter = useSelector((state) => state.counter);
  const stackManager = useSelector((state) => state.stackManager);
  const isLogged = useSelector((state) => state.isLogged);
  const [isShowingWorklist, setIsShowingWorklist] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();
  const { caseID } = useParams();
  const menuList = [
    "dashboard",
    "upload",
    "view",
    "analysis/suvr",
    "analysis/report",
    "setting",
  ];
  useEffect(() => {
    // console.log('counter in app.js: ', counter)
    // this.props.tab_location({...this.props.counter, tabX:nextStackManager.length-1, fileID: props.record.fileID})
    // // {props.record.Centiloid != null && setTimeout(() => this.props.history.push('/analysis/suvr/'+this.props.counter.tabX), 500)}
    // this.props.history.push('/analysis/suvr/'+props.record.fileID)
  }, [counter]);

  useEffect(async () => {
    const token = localStorage.getItem("token");
    Promise.all(
      stackManager.map((v, i) => {
        // console.log('stackManager:', v.fileID)
        try {
          const foundItem = sliceList.find(
            (value, index) => value.fileID == v.fileID
          );
          console.log(foundItem.fileID + " is already exist in sliceList");
        } catch (e) {
          console.log(v.fileID + " is not found in sliceList, so fetch");
          dispatch(loadSlices({ token: token, fileID: v.fileID }));
        }
      })
    );
  }, [stackManager.length]);

  // const fetchSlices = async () =>{
  //   const token = localStorage.getItem('token')
  //   dispatch(loadSlices({'token':token}))
  // }
  // if (stackManager.length == 0){
  //   // dispatch(addStack([...stackManager, fileList.map((v,i)=>{if (v.Opened == true) return {fileID: v.fileID, currentC:50, currentS:50, currentA:50}})]))
  // } else {
  //   // {props.record.Centiloid != null && this.props.tab_location({...this.props.counter, tabX:nextStackManager.length-1, fileID: props.record.fileID})};
  //   // console.log('stackManager changed: ', stackManager)
  //   // dispatch(addStack([...stackManager, stackManager.map((v,i)=>{return {fileID: v.fileID, currentC:50, currentS:50, currentA:50}})]))
  //   // if (counter.fileID==null) dispatch(tab_location({...counter, fileID:stackManager[counter.tabX].fileID}))
  //   // else {
  //   //   const focusTab = stackManager.findIndex((item)=>item.fileID == counter.fileID)
  //   //   if (focusTab == -1 ) {
  //   //     const lowerBoundTabIndex = Math.max(0, counter.tabX-1)
  //   //     const focusFileID = stackManager[lowerBoundTabIndex].fileID
  //   //     dispatch(tab_location({...counter, tabX:lowerBoundTabIndex, fileID:focusFileID}))
  //   //   }
  //   //   else dispatch(tab_location({...counter, tabX:focusTab}))
  //   // }
  // }

  // if (stackManager.length !== 0){
  //   if (counter.fileID==null) {
  //     dispatch(tab_location({...counter, fileID:stackManager[counter.tabX].fileID}))
  //   }
  // }
  useEffect(async () => {
    const token = localStorage.getItem("token");
    let res = null;
    if (token) {
      try {
        res = await services.TokenVerify({ token: token });
        if (res.data.token == token) {
          dispatch(loadItems({ token: token }));
          // dispatch(profile())
        } else {
          alert("Automatically Logout");
        }
      } catch (e) {
        // console.log(e.response.data.non_field_errors[0])
        console.log("Token expired");
        dispatch(logout());
        localStorage.removeItem("token");
        alert("Logout");
      } finally {
        // console.log(res)
      }
    }
  }, [isLogged]);

  const changePageByKey = (e) => {
    const MaxstackManager = stackManager.length;
    switch (e.keyCode) {
      case 38:
        const keyUpPage = Math.max(0, counter.tabY - 1);
        dispatch(tab_location({ ...counter, tabY: keyUpPage }));
        if (keyUpPage <= 1) history.push("/" + menuList[keyUpPage]);
        else if (keyUpPage > 1)
          history.push(
            "/" + menuList[keyUpPage] + "/" + stackManager[counter.tabX].fileID
          );
        break;
      case 40:
        const keyDownPage = Math.min(menuList.length - 1, counter.tabY + 1);
        if (keyDownPage <= 1) history.push("/" + menuList[keyDownPage]);
        else if (keyDownPage > 1)
          if (MaxstackManager > 0) {
            history.push(
              "/" +
                menuList[keyDownPage] +
                "/" +
                stackManager[counter.tabX].fileID
            );
          }
        break;
      case 39:
        if (MaxstackManager > 0) {
          const keyRightPage = Math.min(MaxstackManager - 1, counter.tabX + 1);
          // , fileID:stackManager[keyRightPage].File
          dispatch(
            tab_location({
              ...counter,
              tabX: keyRightPage,
              fileID: stackManager[keyRightPage].fileID,
            })
          );
          if (counter.tabY <= 1) history.push("/" + menuList[counter.tabY]);
          else if (counter.tabY > 1)
            history.push(
              "/" +
                menuList[counter.tabY] +
                "/" +
                stackManager[keyRightPage].fileID
            );
        }
        break;
      case 37:
        if (MaxstackManager > 0) {
          const keyLeftPage = Math.max(0, counter.tabX - 1);
          dispatch(
            tab_location({
              ...counter,
              tabX: keyLeftPage,
              fileID: stackManager[keyLeftPage].fileID,
            })
          );
          if (counter.tabY <= 1) history.push("/" + menuList[counter.tabY]);
          else if (counter.tabY > 1)
            history.push(
              "/" +
                menuList[counter.tabY] +
                "/" +
                stackManager[keyLeftPage].fileID
            );
        }
        break;
      // case 9:
      //   toggleWorklist()
      //   break;
      default:
      // console.log('press up or down key only', e.keyCode)
    }
    // console.log('press up or down key only:',e.keyCode)
  };
  // console.log('what')
  function openWorklist() {
    // alert('openWorklist')
    setIsShowingWorklist(true);
  }
  function closeWorklist() {
    setIsShowingWorklist(false);
  }
  const toggleWorklist = async () => {
    if (isShowingWorklist == false) {
      // check if any items have selected
      const checkIfAnySelected = fileList.find((item) => {
        return item.Select == true && item.Group == 0;
      });
      if (checkIfAnySelected !== undefined) {
        // console.log('checkIfAnySelected: ',checkIfAnySelected)
        const token = localStorage.getItem("token");
        const res = await services.groupSelection({
          token: token,
          obj: {
            method: "groupSelection",
            list: fileList.filter((item) => item.Select == true),
          },
        });
        const groupUpdated = res.data.map((v, i) => {
          return {
            ...v,
            Select: fileList[i].Select,
            Opened: fileList[i].Opened,
          };
        });
        // const groupDone = res.data
        // console.log('toggleWorklist:',groupUpdated)
        // groupDone = groupDone.map((item,idx)=>{return item.Select = fileList.Select})
        dispatch(fetchItems(groupUpdated));
        // dispatch(groupItem(1))
      }
    } else {
      // alert('toggleWorklist: '+isShowingWorklist.toString())
    }
    setIsShowingWorklist(!isShowingWorklist);
  };
  // console.log(isShowingWorklist)
  // console.log(location.pathname.split("/")[1]);
  return (
    <React.Fragment>
      {!isLogged && (
        <div className="App-unAuth">
          {/* <Headerbar/> */}
          <Route path="/" exact component={Login} />
          <Route path="/login" component={Login} />
          <Route path="/dashboard" component={Login} />
          <Route path="/upload" component={Login} />
          <Route path="/view" component={Login} />
          <Route path="/analysis" component={Login} />
          <Route path="/setting" component={Login} />
          <Route path="/forgot" component={Forgot} />
          <Route path="/signup" component={Signup} />
          {/* <Redirect path="*" to="/" /> */}
        </div>
      )}
      {isLogged && (
        // <div className="App" tabIndex={0} onKeyDown={(e)=>{if (e.keyCode == 40){dispatch(increment(menuList.length))} else if (e.keyCode == 38) {dispatch(decrement(menuList.length))};}}>
        <div
          className="App"
          onKeyDown={(e) => {
            changePageByKey(e);
          }}
        >
          {location.pathname.split("/")[1] !== "report" && <Sidebar />}
          {location.pathname.split("/")[1] !== "report" && <Headerbar />}
          <Worklist
            isShowing={isShowingWorklist}
            hide={toggleWorklist}
            lock={openWorklist}
            closeWorklist={closeWorklist}
          />
          {/*  */}
          {/* <Headerbar/> */}
          {/* <Sidebar/> */}
          <Route path="/" exact component={Login} />
          {/* <Redirect exact from="/" to="/dashboard" /> */}
          {/* <Route path="/" exact component={Dashboard}/>
          <Route path="/login" exact component={Dashboard}/>
          <Route path="/forgot" exact component={Dashboard}/>
          <Route path="/signup" exact component={Dashboard}/> */}
          {/* <Route path="/dashboard" render={(props)=> <Dashboard state={{detail:'test1'}}/>}/> */}
          <Route path="/dashboard" component={Dashboard} />
          {/* <Route path="/upload" component={Upload}/> */}
          <Route
            path="/upload"
            render={() => <Upload toggleWorklist={toggleWorklist} />}
          />
          {counter.fileID != null ? (
            <Route path="/view/:caseID" exact component={View} />
          ) : (
            <Route
              path="/view/:caseID"
              render={() => <Redirect to="/dashboard" />}
            />
          )}
          {counter.fileID != null ? (
            <Route path="/analysis" component={Analysis} />
          ) : (
            <Route
              path="/analysis"
              render={() => <Redirect to="/dashboard" />}
            />
          )}
          <Route path="/report" component={Report} />
          <Route path="/setting" component={Setting} />
          {/* <Route path="/" render={()=><Redirect to="dashboard"/>}/> */}
          {/* <Redirect exact path="/signup" to="/" />
          <Redirect exact path="/forgot" to="/" /> */}
        </div>
      )}
    </React.Fragment>
  );
}

export default App;
