import React, { useState, useRef, useEffect, useCallback } from "react";
import "../App.css";
// import useWorklist from '../modal/useWorklist';
import Uploader from "../modal/Uploader";
import ConnectPACS from "../modal/ConnectPACS";
import { useSelector, useDispatch } from "react-redux";
import {
  increment,
  decrement,
  addToList,
  removeFromList,
  loadItems,
  fetchItems,
  openSelect,
  tab_location,
  addStack,
} from "../reduxs/actions";
import IconView from "../images/IconView";
import IconAnalysis from "../images/IconAnalysis";
import IconDelete from "../images/IconDelete";
import IconWorklist from "../images/IconWorklist";
import UploadTable from "./components/Tables/UploadTable";
import * as services from "../services/fetchApi";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useHistory,
  useParams,
  useLocation,
} from "react-router-dom";
// import { useDropzone } from "react-dropzone";

function Upload({ toggleWorklist }) {
  const history = useHistory();
  const [fetchState, setFetchState] = useState(true);
  const [listID, setListID] = useState(null);
  const [dragState, setDragState] = useState(false);
  const fileList = useSelector((state) => state.fileList);
  const counter = useSelector((state) => state.counter);
  const stackManager = useSelector((state) => state.stackManager);
  const [isShowingWorklist, setIsShowingWorklist] = useState(false);
  const [isShowingUploader, setIsShowingUploader] = useState(false);
  const [isShowingPACS, setIsShowingPACS] = useState(false);
  const isLogged = useSelector((state) => state.isLogged);
  const dispatch = useDispatch();
  const [uploaderFileList, setUploaderFileList] = useState([]);
  const [selectTracer, setSelectTracer] = useState("[18F]FBB");
  const [addToWorklist, setaddToWorklist] = useState(true);
  // useEffect(() => {
  //   console.log('useEffect called in Upload (uploaderFileList)',fileList)
  // },[fileList.length])

  const toggleUploader = (e) => {
    //   e.preventDefault();
    setDragState(false);
    setFetchState(true);
    if (isShowingUploader == false) {
      deleteFiles();
      let formData = new FormData();
      const FilesObj = e.target.files;
      Array.from(FilesObj).map((myfile) => formData.append("myfiles", myfile));
      postFiles(formData);
    } else {
      if (e.target.innerText == "Run") {
        runFiles(selectTracer, addToWorklist);
      } else {
        deleteFiles();
      }
    }
    setIsShowingUploader(!isShowingUploader);
  };
  const togglePACS = (state) => {
    setIsShowingPACS(state);
  };

  const runFiles = async (selectTracer, addToWorklist) => {
    const token = localStorage.getItem("token");
    const res = await services.runFile({
      token: token,
      obj: uploaderFileList,
      Tracer: selectTracer,
      addToWorklist: addToWorklist,
    });
    const putList = res.data;
    setFetchState(true);
    setListID(null);
    dispatch(fetchItems(putList));
  };

  const deleteFiles = async () => {
    setFetchState(true);
    setListID(null);
    const token = localStorage.getItem("token");
    const res = await services.deleteFile({ token: token });
    const uploadList = res.data;
    // console.log(uploadList)
    // setFileList(uploadList)
  };

  const postFiles = async (formData) => {
    const token = localStorage.getItem("token");
    setListID(null);
    setFetchState(true);
    const res = await services.postFile({ token: token, obj: formData });
    setFetchState(false);
    const uploadList = res.data;
    // console.log(uploadList)
    setUploaderFileList(uploadList);
  };

  const removeFileList = (record) => {
    setUploaderFileList(
      uploaderFileList.filter((item) => item.id !== record.id)
    );
  };

  const updateFileList = (record) => {
    setUploaderFileList(
      uploaderFileList.map(
        (item) =>
          record.id === item.id
            ? { ...item, ...{ Select: !record.Select, Focus: true } } // 새 객체를 만들어서 기존의 값과 전달받은 data 을 덮어씀
            : { ...item, ...{ Focus: false } } // 기존의 값을 그대로 유지
      )
    );
  };
  const viewClickHandler = async () => {
    const nextStackManager = [
      ...stackManager,
      ...fileList
        .filter((v, i) => v.Opened == false && v.Select == true)
        .map((v) => {
          return {
            fileID: v.fileID,
            PatientName: v.PatientName,
            PatientID: v.PatientID,
            Age: v.Age,
            Sex: v.Sex,
            inputAffineX0: v.InputAffineParamsX0,
            inputAffineY1: v.InputAffineParamsY1,
            inputAffineZ2: v.InputAffineParamsZ2,
            outputAffineX0: v.OutputAffineParamsX0,
            outputAffineY1: v.OutputAffineParamsY1,
            outputAffineZ2: v.OutputAffineParamsZ2,
            currentC: 50,
            currentS: 50,
            currentA: 50,
            in_suvr_max: v.in_suvr_max,
            in_suvr_min: v.in_suvr_min,
            out_suvr_max: v.out_suvr_max,
            out_suvr_min: v.out_suvr_min,
          };
        }),
    ];
    const lastIndex = nextStackManager.length - 1;
    dispatch(openSelect());
    dispatch(addStack(nextStackManager));
    {
      lastIndex >= 0
        ? dispatch(
            tab_location({
              ...counter,
              tabX: lastIndex,
              fileID: nextStackManager[lastIndex].fileID,
            })
          )
        : dispatch(tab_location({ ...counter, tabX: null, fileID: null }));
    }
    // setTimeout(() => dispatch(
    //   tab_location({...counter, fileID:fileList.find(item=>item.Opened==true).fileID})), 500)
    // setTimeout(() => history.push('/view/'+counter.tabX), 500)
    setTimeout(() => history.push("/view/" + lastIndex), 100);
  };
  const analysisClickHandler = async () => {
    const nextStackManager = [
      ...stackManager,
      ...fileList
        .filter((v, i) => v.Opened == false && v.Select == true)
        .map((v) => {
          return {
            fileID: v.fileID,
            PatientName: v.PatientName,
            PatientID: v.PatientID,
            Age: v.Age,
            Sex: v.Sex,
            inputAffineX0: v.InputAffineParamsX0,
            inputAffineY1: v.InputAffineParamsY1,
            inputAffineZ2: v.InputAffineParamsZ2,
            outputAffineX0: v.OutputAffineParamsX0,
            outputAffineY1: v.OutputAffineParamsY1,
            outputAffineZ2: v.OutputAffineParamsZ2,
            currentC: 50,
            currentS: 50,
            currentA: 50,
            in_suvr_max: v.in_suvr_max,
            in_suvr_min: v.in_suvr_min,
            out_suvr_max: v.out_suvr_max,
            out_suvr_min: v.out_suvr_min,
          };
        }),
    ];
    // const nextStackManager = [...stackManager, ...fileList.filter((v,i)=>{if(v.Opened == false && v.Select == true) return {fileID:v.fileID, currentC:50, currentS:50, currentA:50}})]
    const lastIndex = nextStackManager.length - 1;
    dispatch(openSelect());
    // dispatch(addStack(fileList.filter((v,i)=>{if (v.Select == true) return })));
    dispatch(addStack(nextStackManager));
    {
      lastIndex >= 0
        ? dispatch(
            tab_location({
              ...counter,
              tabX: lastIndex,
              fileID: nextStackManager[lastIndex].fileID,
            })
          )
        : dispatch(tab_location({ ...counter, tabX: null, fileID: null }));
    }
    // {lastIndex >= 0 ? setTimeout(() => history.push('/analysis/suvr/'+lastIndex), 100):setTimeout(() => history.push('/analysis/suvr/'+0), 100)}
    setTimeout(() => history.push("/analysis/suvr/" + lastIndex), 100);
  };

  const deleteSelections = async (record) => {
    const token = localStorage.getItem("token");
    const res = await services.deleteSelection({ token: token, obj: record });
    const uploadList = res.data;
    // console.log(uploadList)
    dispatch(fetchItems(uploadList));
    // setFileList(uploadList)
  };
  // console.log("upload: ", selectTracer)
  return (
    <div className="content">
      {/* <Sidebar />
      <Headerbar/> */}
      {/* <Worklist isShowing={isShowingWorklist} hide={toggleWorklist}/> */}
      <Uploader
        setListID={setListID}
        listID={listID}
        setFetchState={setFetchState}
        fetchState={fetchState}
        selectTracer={selectTracer}
        setSelectTracer={setSelectTracer}
        setaddToWorklist={setaddToWorklist}
        fileList={uploaderFileList}
        isShowing={isShowingUploader}
        hide={toggleUploader}
        removeFileList={removeFileList}
        updateFileList={updateFileList}
      />
      <ConnectPACS
        setListID={setListID}
        listID={listID}
        setFetchState={setFetchState}
        fetchState={false}
        selectTracer={selectTracer}
        setSelectTracer={setSelectTracer}
        setaddToWorklist={setaddToWorklist}
        fileList={uploaderFileList}
        isShowing={isShowingPACS}
        hide={togglePACS}
        removeFileList={removeFileList}
        updateFileList={updateFileList}
      />
      <div className="content-page">
        <div className="upload-title">
          <div style={{ display: "flex" }}>
            <div
              className="upload-btn"
              onClick={() => {
                viewClickHandler();
              }}
            >
              <IconView className="upload-icon" />
              View
            </div>
            <div
              className="upload-btn"
              onClick={() => {
                analysisClickHandler(
                  fileList.filter((items) => items.Select == true)
                );
              }}
            >
              <IconAnalysis className="upload-icon" />
              Analysis
            </div>
            <div className="upload-btn" onClick={toggleWorklist}>
              <IconWorklist className="upload-icon" />
              Worklist
            </div>
            <div
              className="upload-btn"
              onClick={() => {
                deleteSelections(
                  fileList.filter((items) => items.Select == true)
                );
              }}
            >
              <IconDelete className="upload-icon" />
              Delete
            </div>
          </div>
          <div
            style={{ display: "flex", color: "white", alignItems: "center" }}
          >
            <div
              className="upload-btn"
              onClick={() => togglePACS(true)}
              style={{ width: "199px", marginLeft: "40px" }}
            >
              Connect to PACS
            </div>
            <label for="upload-input" className="upload-btn upload">
              Upload
            </label>
            <input
              style={{ display: "none" }}
              multiple
              type="file"
              id="upload-input"
              onChange={(e) => toggleUploader(e)}
              onClick={(e) => (e.target.value = null)}
            />
          </div>
        </div>
        <div
          className="upload-table"
          onDragEnter={() => {
            setDragState(true);
          }}
          onDragOver={() => {
            if (!dragState) {
              setDragState(true);
            }
          }}
        >
          <UploadTable />
          {dragState && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "black",
                background: "rgba(0,0,0,0.8)",
                position: "absolute",
                position: "absolute",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                border: "white dashed",
                boxSizing: "border-box",
                borderRadius: "10px",
              }}
            >
              <input
                type="file"
                multiple
                style={{
                  position: "absolute",
                  top: "0",
                  left: "0",
                  border: "red solid",
                  opacity: "0",
                  width: "100%",
                  height: "100%",
                }}
                onDragLeave={() => {
                  setDragState(false);
                }}
                onChange={(e) => toggleUploader(e)}
                onPointerOver={() => {
                  if (dragState) setDragState(false);
                }}
              />
              <div style={{ color: "white", fontSize: "60px" }}>
                Drag & Drop Files
              </div>
            </div>
          )}
        </div>

        {/* <div className="redux-info">
          <h1>isLogged: {isLogged.toString()}</h1>
          <h1>Upload page</h1>
          <h1>listSelected: {listSelected}</h1>
          <h1>Counter: {counter}</h1>
          <button onClick={()=> dispatch(increment())}>+</button>
          <button onClick={()=> dispatch(decrement())}>-</button>
        </div> */}
      </div>
    </div>
  );
}
export default Upload;
