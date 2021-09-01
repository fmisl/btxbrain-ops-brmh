import './Home.css';
import React, {Component} from 'react';
// import Icons from 'icons'
import { Link } from 'react-router-dom';
// import { CornerstoneElement, ImageLoader } from './';
import CornerstoneElement from './CornerstoneElement';
import ImageLoader from './ImageLoader';
import * as services from '../../../services/fetchApi'

// import * as cornerstone from "cornerstone-core";
// import * as cornerstoneMath from "cornerstone-math";
// import * as cornerstoneTools from "cornerstone-tools";
// import Hammer from "hammerjs";
// import * as cornerstoneWebImageLoader from "cornerstone-web-image-loader";

// cornerstoneTools.external.cornerstone = cornerstone;
// cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
// cornerstoneWebImageLoader.external.cornerstone = cornerstone;
// cornerstoneTools.external.Hammer = Hammer;

const localIP = "http://147.47.228.204:8022/";
// const localIP = "http://localhost:8499/";
const IPinUSE = localIP;


export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      caseID: this.props.caseID,
      // caseID: 147,
      progress: 0,
      message: "",
      Radio1: 0,
      Switch: {
        INV: false,
        MAG: false,
        FLIP: false,
        RST: false,

        CLR: false,
      },
      opacityValue: 10,
      Radio2: 1,
      Button: [true, false, false],
      service:{
        fetching: false,
      },
      inputID:[0,0,0],
      outputID:[0,0,0],

      params: {
        Global:0,
        LateralTemporal:0,
        LateralParietal:0,
        PCPRC:0,
        Frontal:0,
      },

      inputpetB64:{},
      outputpetB64:{},
      downloadlink:"",
    };
  }
  componentDidMount(){
    // console.log('componentDidMount');
    try{
      let caseID = this.props.match.params.caseID
      if (caseID == undefined){

      } else {
        this.setState({
          caseID: caseID,
        })
      }
    } catch(e){
      console.log("params read error");
    }
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    const {caseID} = this.state;
    if (prevState.caseID === null) {
      if (prevState.caseID !== this.state.caseID){
        console.log("componentDidUpdate: ")
        this.setState({
          caseID: caseID,
          Radio2: 1,
          Button: [true, true, true],
          // downloadlink: "http://147.47.228.204:8011/result/download/case"+this.state.caseID+"/input_"+this.state.caseID+".nii",
          downloadlink: IPinUSE+"result/download/case"+this.state.caseID+"/input_"+this.state.caseID+".nii",
        });
      }
    }
  }


  render() {
    const {progress, message, Radio1, Switch, Radio2, Button, service, caseID, Istack, ICstack, ISstack, stack, Cstack, Sstack, downloadlink} = this.state;
    // const {Istack, ICstack, ISstack, stack, Cstack, Sstack} = this;
    const {_FileUpload} = this;
    // console.log(progress);
    return (
      <ImageLoader state={this.state} FileUpload={_FileUpload} indexUpdate={this._indexUpdate} paramUpdate={this._paramUpdate}>
        {this.state.service.fetching &&
        <div className="Main-modal">
          <progress value={progress} max="100"/>
          {`${message}(${progress}%)`}
        </div>}
      </ImageLoader>
    );
  }
  _paramUpdate = (Global, LateralTemporal, LateralParietal, PCPRC, Frontal ) =>{
    this.setState({
      params:{
        Global:Global,
        LateralTemporal:LateralTemporal,
        LateralParietal:LateralParietal,
        PCPRC:PCPRC,
        Frontal:Frontal,
      },
    });
  }
  _indexUpdate = (AID, CID, SID) =>{
    const {inputID, outputID} = this.state;
    if (AID[0] === "input") {
      if (inputID[0] == AID[2] && inputID[1] == CID[2] && inputID[2] == SID[2]) {

      }else {
        this.setState({
          inputID: [AID[2], CID[2], SID[2]],
        })
      }
    }
    else if (AID[0]==="output") {
      if (outputID[0] == AID[2] && outputID[1] == CID[2] && outputID[2] == SID[2]) {

      } else {
        this.setState({
          outputID: [AID[2], CID[2], SID[2]],
        })
      }
    }
  }
  handleReport = () => {
    const {inputID, outputID, caseID, params} = this.state;
    let cmap = 1;
    if (this.state.Switch.CLR === true) cmap = 2;
    this.props.history.push({
      pathname: `/case/${caseID}/report/`,
      state: {
        caseID: caseID,
        cmap: cmap,
        inputAID: inputID[0],
        inputCID: inputID[1],
        inputSID: inputID[2],
        outputAID: outputID[0],
        outputCID: outputID[1],
        outputSID: outputID[2],
        Global: params.Global,
        LateralTemporal: params.LateralTemporal,
        LateralParietal: params.LateralParietal,
        PCPRC: params.PCPRC,
        Frontal: params.Frontal,
      },
    });
  }
  _FileUpload = (e)=>{
    let formData = new FormData();

    let FilesObj = e.target.files;
    Array.from(FilesObj).map(myfile => formData.append("myfiles", myfile));
    this._postFile(formData);
  }

  _uploadFile = async Obj => {
    // const {testB64} = this.state;

    // this.setState({
    //   service:{fetching: true}, // done!
    // });

    // try {
    //   console.log("uploadFile Start")
    //   const res1 = await services.postFile(Obj)
    //   let caseID = res1.data.CaseID
    //   await this._async_check(caseID, 1500)
    //   // const res3 = await service.getCase(caseID)
    //   // console.log("what:",res3.data[0].slices)
    //   this.setState({
    //     service:{fetching: false}, // done!
    //     caseID: caseID,
    //     Radio2: 1,
    //     Button: [true, true, true],
    //   });
    //   console.log("uploadFile Finished")
    // } catch (e) {
    //   console.log("uploadFile Error");
    //   this.setState({
    //     service:{fetching: false}, // done!
    //     Radio2: 0,
    //     Button: [true, false, false],
    //   });
    // }
  }

  _async_check(caseID, sec) {
    // setTimeout(() => {
    let counter1 = 0
    let counter2 = 0
    // return new Promise((resolve, reject)=>{
    //   let myTimer = setInterval(async ()=>{
    //     const res2 = await services.getCheck(caseID)
    //     let progress = res2.data.Progress
    //     let msg = res2.data.msg
    //     if (progress < 70) {progress = Math.min(70, progress+counter1); counter1++; }
    //     else if (progress < 87) {progress = Math.min(87, progress+counter2); counter2++; }
    //     // else progress =Math.min(70, progress+counter)
    //     // console.log(res2.data.Progress, counter1, counter2, progress)
    //     console.log(counter1+counter2)
    //     this.setState({
    //       progress: progress,
    //       message: msg,
    //     })
    //     if (progress === 100){
    //       resolve('yes response');
    //       clearInterval(myTimer)
    //       this.props.history.push(`/case/${caseID}/`);
    //     }
    //     if (counter1+counter2 >= 100){
    //       reject('no response');
    //       clearInterval(myTimer)
    //     }
    //   }, sec)
    // })
  }
}