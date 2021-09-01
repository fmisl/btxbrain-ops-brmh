// import React,{useState, useEffect} from 'react';
import React, { Component } from 'react'
import { connect } from 'react-redux';
import * as actions from '../reduxs/actions';
import * as cornerstone from "cornerstone-core";
import '../App.css';
import {useSelector, useDispatch} from 'react-redux';
import viewer_spinner from '../images/gif/spinner-big.gif'
import viewer_spinner2 from '../images/gif/viewer_spinner2.gif'
import IconPlayPNG from '../images/play.png';
import PngReset from '../images/IconReset.png';
import IconReset from '../images/IconReset';
import IconPause from '../images/IconPause';
import IconPlay from '../images/IconPlay';
import IconCrosshair from '../images/IconCrosshair';
import IconCrosshairOff from '../images/IconCrosshairOff';
import IconInvert from '../images/IconInvert';
import IconInvertOff from '../images/IconInvertOff';
import IconBrain from '../images/IconBrain';
import IconBrainOff from '../images/IconBrainOff';
import IconSN from '../images/IconSN';
import IconSNOff from '../images/IconSNOff';
import IconBurger from '../images/IconBurger';
import ImageViewer from './components/Cornerstone/ImageViewer';
import {IPinUSE} from '../services/IPs'
import {useParams} from 'react-router-dom' 
import * as services from '../services/fetchApi'
import Home from './components/Cornerstone/Home'
import {login, logout, increment, decrement, loadItems, loadSlices, profile, tab_location, groupItem, addStack, updateStack, removeStack, fetchItems} from '../reduxs/actions';

import InputRange from 'react-input-range';
import "react-input-range/lib/css/index.css";
import MNI_Axial from "../MNI152_T1_2mm_z"
import MNI_Coronal from "../MNI152_T1_2mm_y"
import MNI_Sagittal from "../MNI152_T1_2mm_x"

// function View({}) {
class View extends Component {
  state = {
    completeSlices: 0,
    Completed: false,
    ImageReady: false,
    selectedColormap: 'invertedGray',
    value5: {
      min: 0,
      max: 32767,
    },
    suvr_max:0, 
    suvr_min:0,
    widthSUVR:0,
    centerSUVR:0,
    currentStepIndex: 20,
    opacityValue: 0,
    isMNI: false,
    username: localStorage.getItem('username'),
    showMenu: false,
    isPlayed: false,
    isCrosshaired: true,
    isInverted: false,
    isSNed: true,
    inoutSelect: 'output',
    imageIdC: [],
    imageIdS: [],
    imageIdA: [],
    // stackCoronal:{},
    // stackSaggital:{},
    // stackAxial:{},
    // stackMip:{},
    petCStack: {},
    petSStack: {},
    petAStack: {},
  };
  componentDidMount(){
    // console.log('CDM')
    const {username, inoutSelect} = this.state;
    const {counter, stackManager, sliceList, fileList} = this.props;
    const IdxSlice = sliceList.findIndex(v=>v.fileID==counter.fileID)
    const ImageReady = sliceList[IdxSlice]?.B64.length == 792;
    const Completed = fileList.find(v=>v.fileID==counter.fileID).Complete;
    // const imageIdC = [...Array(109).keys()].map((v,i)=>(IPinUSE+'result/download/'+username+'/database/'+counter.fileID+'/'+inoutSelect+'_coronal_'+i+'.png'));
    // const imageIdS = [...Array(91).keys()].map((v,i)=>(IPinUSE+'result/download/'+username+'/database/'+counter.fileID+'/'+inoutSelect+'_sagittal_'+i+'.png'));
    // const imageIdA = [...Array(91).keys()].map((v,i)=>(IPinUSE+'result/download/'+username+'/database/'+counter.fileID+'/'+inoutSelect+'_axial_'+i+'.png'));
    // const imageIdM = [...Array(45).keys()].map((v,i)=>(IPinUSE+'result/download/'+username+'/database/'+counter.fileID+'/'+'mip_'+inoutSelect+'_axial_'+i+'.png'));
    // const stackCoronal = {
    //   imageIds: imageIdC,
    //   currentImageIdIndex: stackManager.filter(v=>v.fileID==counter.fileID)[0].currentC
    // };
    // const stackSaggital = {
    //   imageIds: imageIdS,
    //   currentImageIdIndex: stackManager.filter(v=>v.fileID==counter.fileID)[0].currentS
    // };
    // const stackAxial = {
    //   imageIds: imageIdA,
    //   currentImageIdIndex: stackManager.filter(v=>v.fileID==counter.fileID)[0].currentA
    // };
    // const stackMip = {
    //   imageIds: imageIdM,
    //   currentImageIdIndex: 0
    // };

    const petCStack = {
      // patient: "anonymous",
      // studyID:  "1.3.6.1.4.1.5962.99.1.2237260787.1662717184.1234892907507.1411.0",
      imageIds: [],
      currentImageIdIndex: stackManager.filter(v=>v.fileID==counter.fileID)[0].currentC,
      options: {
        opacity: 1,
        visible: true,
        viewport: {
          colormap: 'invertedGray',
        },
        name: 'PET'
      }
    };
    const petSStack = {
      // patient: "anonymous",
      // studyID:  "1.3.6.1.4.1.5962.99.1.2237260787.1662717184.1234892907507.1411.0",
      imageIds: [],
      currentImageIdIndex: stackManager.filter(v=>v.fileID==counter.fileID)[0].currentS,
      options: {
        opacity: 1,
        visible: true,
        viewport: {
          colormap: 'invertedGray',
        },
        name: 'PET'
      }
    };
    const petAStack = {
      // patient: "anonymous",
      // studyID:  "1.3.6.1.4.1.5962.99.1.2237260787.1662717184.1234892907507.1411.0",
      imageIds: [],
      currentImageIdIndex: stackManager.filter(v=>v.fileID==counter.fileID)[0].currentA,
      options: {
        opacity: 1,
        visible: true,
        viewport: {
          colormap: 'invertedGray',
        },
        name: 'PET'
      }
    };
    const petMStack = {
      // patient: "anonymous",
      // studyID:  "1.3.6.1.4.1.5962.99.1.2237260787.1662717184.1234892907507.1411.0",
      imageIds: [],
      currentImageIdIndex: 0,
      options: {
        opacity: 1,
        visible: true,
        viewport: {
          colormap: 'invertedGray',
        },
        name: 'PET'
      }
    };
    const mniCStack = {
      // patient: "anonymous",
      // studyID:  "1.3.6.1.4.1.5962.99.1.2237260787.1662717184.1234892907507.1411.0",
      imageIds: [],
      currentImageIdIndex: stackManager.filter(v=>v.fileID==counter.fileID)[0].currentC,
      options: {
        opacity: this.state.opacityValue,
        visible: true,
        viewport: {
          colormap: 'invertedGray',
        },
        name: 'MNI'
      }
    };
    const mniSStack = {
      // patient: "anonymous",
      // studyID:  "1.3.6.1.4.1.5962.99.1.2237260787.1662717184.1234892907507.1411.0",
      imageIds: [],
      currentImageIdIndex: stackManager.filter(v=>v.fileID==counter.fileID)[0].currentS,
      options: {
        opacity: this.state.opacityValue,
        visible: true,
        viewport: {
          colormap: 'invertedGray',
        },
        name: 'MNI'
      }
    };
    const mniAStack = {
      // patient: "anonymous",
      // studyID:  "1.3.6.1.4.1.5962.99.1.2237260787.1662717184.1234892907507.1411.0",
      imageIds: [],
      currentImageIdIndex: stackManager.filter(v=>v.fileID==counter.fileID)[0].currentA,
      options: {
        opacity: this.state.opacityValue,
        visible: true,
        viewport: {
          colormap: 'invertedGray',
        },
        name: 'MNI'
      }
    };
    const mniMStack = {
      // patient: "anonymous",
      // studyID:  "1.3.6.1.4.1.5962.99.1.2237260787.1662717184.1234892907507.1411.0",
      imageIds: [],
      currentImageIdIndex: 0,
      options: {
        opacity: this.state.opacityValue,
        visible: true,
        viewport: {
          colormap: 'invertedGray',
        },
        name: 'MNI'
      }
    };
    this.setState({
      ImageReady,
      Completed,
      // imageIdC,
      // imageIdS,
      // imageIdA,
      mniCStack,
      mniSStack,
      mniAStack,
      mniMStack,

      petCStack,
      petSStack,
      petAStack,
      petMStack,
    })
  }
  setShowMenu = (value) =>{ this.setState({showMenu:value}) }
  setIsPlayed = (value) =>{ this.setState({isPlayed:value}) }
  setIsCrosshaired = (value) =>{ this.setState({isCrosshaired:value}) }
  setIsInverted = (value) =>{ this.setState({isInverted:value}) }
  setIsSNed = (value) =>{ this.setState({isSNed:value}) }
  setInoutSelect = (value) =>{ this.setState({inoutSelect:value}) }
  // const [showMenu, setShowMenu] = useState(false)
  // const [isCrosshaired, setIsCrosshaired] = useState(true)
  // const [isInverted, setIsInverted] = useState(true)
  // const [isSNed, setIsSNed] = useState(true)
  // const [inoutSelect, setInoutSelect] = useState("output")
  componentDidUpdate(prevProps, prevState){
    const {isSNed, username, isInverted, selectedColormap} = this.state;
    const {counter, stackManager, sliceList, fileList} = this.props;
    const {imageLoader, metaDataLoader} = this;
    const inoutSelect = isSNed ? "output":"input"
    const invertSelect = isInverted ? "invert":"right"
    const IdxSlice = sliceList.findIndex(v=>v.fileID==counter.fileID)
    const completeSlices = sliceList[IdxSlice]?.B64.length;
    const ImageReady = completeSlices == 792;
    const Completed = fileList.find(v=>v.fileID==counter.fileID).Complete;
    // const Completed = fileList.filter((v,i)=>{return v.fileID==counter.fileID})[0].Complete;
    // console.log(this.Completed)
    // console.log('prevProps.stackManager.length != stackManager.length', prevProps.stackManager.length != stackManager.length)
    // if (prevState.completeSlices !== completeSlices){
    //   console.log('state not same',completeSlices, ImageReady)
    //   this.setState({
    //     completeSlices,
    //   })
    // } else 

    // if (prevState.completeSlices !== completeSlices){
    //   console.log('state not same',completeSlices, ImageReady)
    //   this.setState({
    //     completeSlices,
    //   })
    // }
    // else
    // console.log('state same',completeSlices, ImageReady)
    if (ImageReady){
      if (prevState.selectedColormap != selectedColormap || prevProps.counter != counter || prevState.isSNed != isSNed || prevState.isInverted != isInverted || (stackManager.length != 0 && prevProps.sliceList.length != sliceList.length)){
        console.log('componentDidUpdate with counter', counter, ImageReady)
        const petCStack = {
          imageIds: [...Array(109+20).keys()].map((v,i)=>("pet:"+inoutSelect+"/"+IdxSlice+"/coronal/"+invertSelect+"/"+selectedColormap+"/"+i)),
          currentImageIdIndex: stackManager.filter(v=>v.fileID==counter.fileID)[0].currentC,
          options: {
            opacity: 1,
            visible: true,
            viewport: {
              colormap: 'invertedGray',
            },
            name: 'PET'
          }
        };
        const petSStack = {
          imageIds: [...Array(91+40).keys()].map((v,i)=>("pet:"+inoutSelect+"/"+IdxSlice+"/sagittal/"+invertSelect+"/"+selectedColormap+"/"+i)),
          currentImageIdIndex: stackManager.filter(v=>v.fileID==counter.fileID)[0].currentS,
          options: {
            opacity: 1,
            visible: true,
            viewport: {
              colormap: 'invertedGray',
            },
            name: 'PET'
          }
        };
        const petAStack = {
          imageIds: [...Array(91).keys()].map((v,i)=>("pet:"+inoutSelect+"/"+IdxSlice+"/axial/"+invertSelect+"/"+selectedColormap+"/"+i)),
          currentImageIdIndex: stackManager.filter(v=>v.fileID==counter.fileID)[0].currentA,
          options: {
            opacity: 1,
            visible: true,
            viewport: {
              colormap: 'invertedGray',
            },
            name: 'PET'
          }
        };
        const petMStack = {
          // IPinUSE+'result/download/'+username+'/database/'+counter.fileID+'/'+'mip_'+inoutSelect+'_axial_'+i+'.png'
          imageIds: [...Array(45).keys()].map((v,i)=>("pet:"+inoutSelect+"/"+IdxSlice+"/mip/"+invertSelect+"/"+selectedColormap+"/"+i)),
          currentImageIdIndex: 0,
          options: {
            opacity: this.state.opacityValue,
            visible: true,
            viewport: {
              colormap: 'invertedGray',
            },
            name: 'PET'
          }
        };
        const mniCStack = {
          imageIds: [...Array(109+20).keys()].map((v,i)=>("mni:"+inoutSelect+"/"+IdxSlice+"/coronal/"+invertSelect+"/"+selectedColormap+"/"+i)),
          currentImageIdIndex: stackManager.filter(v=>v.fileID==counter.fileID)[0].currentC,
          options: {
            opacity: this.state.opacityValue,
            visible: true,
            viewport: {
              colormap: 'gray',
            },
            name: 'MNI'
          }
        };
        const mniSStack = {
          imageIds: [...Array(91+40).keys()].map((v,i)=>("mni:"+inoutSelect+"/"+IdxSlice+"/sagittal/"+invertSelect+"/"+selectedColormap+"/"+i)),
          currentImageIdIndex: stackManager.filter(v=>v.fileID==counter.fileID)[0].currentS,
          options: {
            opacity: this.state.opacityValue,
            visible: true,
            viewport: {
              colormap: 'gray',
            },
            name: 'MNI'
          }
        };
        const mniAStack = {
          imageIds: [...Array(91).keys()].map((v,i)=>("mni:"+inoutSelect+"/"+IdxSlice+"/axial/"+invertSelect+"/"+selectedColormap+"/"+i)),
          currentImageIdIndex: stackManager.filter(v=>v.fileID==counter.fileID)[0].currentA,
          options: {
            opacity: this.state.opacityValue,
            visible: true,
            viewport: {
              colormap: 'gray',
            },
            name: 'MNI'
          }
        };
        const mniMStack = {
          // IPinUSE+'result/download/'+username+'/database/'+counter.fileID+'/'+'mip_'+inoutSelect+'_axial_'+i+'.png'
          imageIds: [...Array(45).keys()].map((v,i)=>("mni:"+inoutSelect+"/"+IdxSlice+"/mip/"+invertSelect+"/"+selectedColormap+"/"+i)),
          currentImageIdIndex: 0,
          options: {
            opacity: this.state.opacityValue,
            visible: true,
            viewport: {
              colormap: 'gray',
            },
            name: 'MNI'
          }
        };

        try{
          console.log('imageLoader update from sliceList B64Data')
          const isExistSlice = this.props.sliceList.findIndex(v=>v.fileID==this.props.counter.fileID)
          if (sliceList.length != 0 && stackManager.length != 0 && isExistSlice >= 0){

            console.log('isExistSlice ',isExistSlice)
            imageLoader(inoutSelect);
            metaDataLoader(inoutSelect, isInverted);
            this.setState({
              ImageReady,
              Completed,
              inoutSelect,
              // imageIdC,
              // imageIdS,
              // imageIdA,
              mniCStack,
              mniSStack,
              mniAStack,
              mniMStack,

              petCStack,
              petSStack,
              petAStack,
              petMStack,
            })
          }
        } catch (e){
          console.log('imageLoader metaDataLoader fail')
        }
        // console.log("2");
        // this.metaDataLoader();
      }
    }
  }

  handleInputChange = e => {
    this.setState({ currentStepIndex: e.currentTarget.value });
  };
  handleOpacityChange = e => {
    if (e.currentTarget.value == 0){
      this.setState({ 
        isMNI: false,
        opacityValue: e.currentTarget.value 
      });
    } else {
      this.setState({ 
        isMNI: true,
        opacityValue: e.currentTarget.value 
      });
    }

  };
  handleWindowChange = (newMax,newMin) => {
    // this.setState({ currentStepIndex: e.currentTarget.value });
    const {value5}=this.state;
    // console.log('handleWindowChange:', newMax, newMin)
    if (value5.min != newMin || value5.max != newMax){
      this.setState({
        value5:{
          max: newMax,
          min: newMin,
        }
      })
    }
  };
  niftiDownload = async () =>{
    const {counter, stackManager, fileList} = this.props;
    // console.log('download nifti')
    const token = localStorage.getItem('token')
    const username = localStorage.getItem('username')
    // // res = await services.TokenVerify({'token':token})
    // console.log(counter.fileID, fileList)

    const selectedList = fileList.filter((v, i)=>v.fileID == counter.fileID);
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

    // const {counter, stackManager} = this.props;
    // console.log('download nifti')
    // const token = localStorage.getItem('token')
    // const username = localStorage.getItem('username')
    // const fileID = stackManager?.[counter.tabX].fileID;
    // const downloadUrl = IPinUSE+'result/download/'+username+'/database/'+fileID+"/"+"output_"+fileID+".nii";
    // // // res = await services.TokenVerify({'token':token})
    // // const res = await services.downloadNifti({'token':token});
    // setTimeout(() => window.open(downloadUrl, "_blank"), 1000);
  }
  changeColormap = (event)=>{
    this.setState({selectedColormap: event.target.value});
  }
  updateSUVR_min_max = (suvr_max, suvr_min, widthSUVR, centerSUVR)=>{
    // console.log('ww/wc:', suvr_max,suvr_min,widthSUVR,centerSUVR)
    // this.setState({
    //   suvr_max,
    //   suvr_min,
    //   widthSUVR,
    //   centerSUVR,
    // });
  }
  resetSlice = async (fileID) => {
    // alert('resetSlices')
    const token = localStorage.getItem('token')
    this.props.resetSlices({'token':token, 'fileID':fileID})
  }
    // Promise.all(stackManager.map((v,i)=>{ 
    //   // console.log('stackManager:', v.fileID)
    //   try{
    //     const foundItem = sliceList.find((value,index)=>value.fileID == v.fileID)
    //     console.log(foundItem.fileID + ' is already exist in sliceList')
    //   } catch(e){
    //     console.log(v.fileID + ' is not found in sliceList, so fetch')
    //     dispatch(loadSlices({'token':token, 'fileID':v.fileID}))
    //   }
    // }))
  render() {
    const {updateSUVR_min_max, setShowMenu,setIsCrosshaired,setIsInverted,setIsSNed,setInoutSelect, resetDataReady, setIsPlayed, handleWindowChange, niftiDownload, changeColormap, resetSlice} = this;
    const {Completed, ImageReady, suvr_max, suvr_min, widthSUVR, centerSUVR, selectedColormap, value5, dataReady, isPlayed, isCrosshaired, isInverted, isSNed, showMenu, imageIdC, imageIdS, imageIdA, username, inoutSelect, 
      petCStack,petSStack,petAStack, petMStack, 
      mniCStack,mniSStack,mniAStack, mniMStack, 
      currentStepIndex, opacityValue} = this.state;
    // const {} = this.state;
    const {counter, stackManager, fileList} = this.props;
    // console.log('arrayData', typeof(arrayData))
    // console.log(arrayData[0])
    // console.log(this.state.selectedColormap)
    // const suvr_max = isSNed ? out_suvr_max:in_suvr_max;
    // const suvr_min = Math.max(0, isSNed ? out_suvr_min:in_suvr_min);
    // const widthSUVR = (viewportC !== undefined) ? ((viewportC.voi.windowWidth/32767)*(suvr_max-suvr_min)):1;
    // const centerSUVR = (viewportC !== undefined) ? ((viewportC.voi.windowCenter/32767)*(suvr_max-suvr_min)):1;
    // const Completed = counter?.fileID && fileList.filter((v,i)=>{v.fileID == counter.fileID})[0];
    // console.log(counter.fileID, fileList.filter((v,i)=>{v.fileID == counter.id}));
    // const Completed = fileList.filter((v,i)=>{return v.fileID==counter.fileID})[0].Complete;
    // console.log('ImageReady, Completed', ImageReady, Completed)
    return (
      <div className="content" onClick={()=>setShowMenu(false)}>
        {/* <Sidebar />
        <Headerbar/> */}
        <div className="content-page">
          {/* <div className="view-box"> */}
            <div style={{position: "absolute", top:"140px", left:"300px",width:"1550px", height:"937px"}}>
              {
                ImageReady ? 
                  <ImageViewer opacityValue={opacityValue} updateSUVR_min_max={updateSUVR_min_max} isSNed={isSNed} selectedColormap={selectedColormap} handleWindowChange={handleWindowChange} value5={value5} currentStepIndex={currentStepIndex} isSNed={isSNed} isPlayed={isPlayed} isCrosshaired={isCrosshaired} isInverted={isInverted} 
                  stackC={{ ...petCStack }} stackS={{ ...petSStack }} stackA={{ ...petAStack }} stackM={{...petMStack}}
                  MNIstackC={{ ...mniCStack }} MNIstackS={{ ...mniSStack }} MNIstackA={{ ...mniAStack }} stackM={{...mniMStack}}
                  />
                  :
                  // Completed ? 
                  // <div class="view-image"><img src={PngReset} onClick={()=>resetSlice(counter.fileID)}/></div>
                  //   :
                  // <div class="view-image"><img src={viewer_spinner}/></div>
                  <div class="view-image"><img src={viewer_spinner} onClick={()=>resetSlice(counter.fileID)}/></div>
              }
              {/* <Home caseID={caseID}/> */}
            </div>
          {/* </div> */}

          <div  className="content-title">
            <div className="content-info" style={{border:'0px red solid'}}>
              <div style={{marginRight:"10px", overflow:"hidden", width:"160px", height:"60px"}}>
                Patient Name
                <div className="content-var">{stackManager?.[counter.tabX].PatientName}</div>
              </div>
              <div style={{margin: "0px 10px"}}>
                Patient ID
                <div className="content-var" >{stackManager?.[counter.tabX].PatientID}</div>
              </div>
              <div style={{margin: "0px 10px"}}>
                Birth Date
                <div className="content-var" >{stackManager?.[counter.tabX].Age}</div>
              </div>
              <div style={{margin: "0px 10px"}}>
                Sex
                <div className="content-var" >{stackManager?.[counter.tabX].Sex}</div>
              </div>
            </div>
            <div style={{display:"flex", color:"white", border:'0px red solid'}}>

              <div className="view-btn" onClick={()=>{this.setState({value5:{max:32767, min:0}})}}>
                &nbsp; MIP: &nbsp;
              </div>
              <div className="view-btn" onClick={()=>setIsPlayed(!isPlayed)} style={{marginLeft:"0px"}} >
                {isPlayed ? <IconPause className="view-icon"/>:<IconPlay className="view-icon"/>}
              </div>
              <div className="view-btn opacity-bar" style={{marginLeft:"0px"}}>
                <input type="range" style={{height:"100%", width:"100%"}} value={this.state.currentStepIndex} onInput={this.handleInputChange} step="1" min="0" max="50"/>
              </div>

              <div className="view-btn" onClick={()=>{this.setState({value5:{max:32767, min:0}})}}>
                &nbsp; MNI: &nbsp;
              </div>
              <div className="view-btn" onClick={()=>{this.setState({isMNI:!this.state.isMNI, opacityValue:0})}} style={{marginLeft:"0px"}} >
                {this.state.isMNI ? <IconBrain className="view-icon"/>:<IconBrainOff className="view-icon"/>}
              </div>
              <div className="view-btn opacity-bar" style={{marginLeft:"0px"}}>
                <input type="range" style={{height:"100%", width:"100%"}} value={this.state.opacityValue} onInput={this.handleOpacityChange} step="0.1" min="0" max="1"/>
              </div>

              <div className="view-btn" onClick={()=>{this.setState({value5:{max:32767, min:0}})}}>
                &nbsp; SUVR:
              </div>
              <div className="view-btn" style={{marginLeft:"0px"}} onClick={()=>{this.setState({value5:{max:32767, min:0}})}}>
                <IconReset className="view-icon" />
              </div>
              <div className="view-btn opacity-bar" style={{marginLeft:"0px"}} >
                {<InputRange
                    draggableTrack
                    step={1000}
                    maxValue={32767}
                    minValue={0}
                    value={this.state.value5}
                    onChange={value => 
                        {
                          this.setState({ 
                            value5:{
                              max:value.max,
                              min:value.min,
                            }})
                          console.log('InputRange:', value)
                        }
                      }
                  />}
              </div>
              <div className="view-btn" onClick={()=>setIsCrosshaired(!isCrosshaired)}>{isCrosshaired ? <IconCrosshair className="view-icon"/>:<IconCrosshairOff className="view-icon"/>}</div>
              <div className="view-btn" onClick={()=>setIsInverted(!isInverted)}>{isInverted ? <IconInvertOff className="view-icon"/>:<IconInvert className="view-icon"/>}</div>
              <div className="view-btn" onClick={()=>setIsSNed(!isSNed)}>{isSNed ? <IconSN className="view-icon"/>:<IconSNOff className="view-icon"/>}</div>
              {/* <div className="view-btn opacity-bar" >
                Opacity:&nbsp;
                <input type="range" style={{height:"100%", width:"100%"}} value="50" step="1" min="0" max="100"/>
              </div> */}
              <div className="view-btn colormap-select">
                <select id="colormap" name="colormap" onChange={this.changeColormap} value={this.state.selectedColormap}
                style={{height:"100%", width: "100%", background:"#383C41", border:"0px", color:"white", textAlignLast:"center"}}>
                  
                  <option value="invertedGray">Gray (colormap)</option>
                  {/* <option value="gray">gray (colormap)</option> */}
                  <option value="hot">Hot (colormap)</option>
                  <option value="jet">Jet (colormap)</option>
                  {/* <option value="hot_inverted" >Hot_inverted (colormap)</option> */}
                  {/* <option value="jet_inverted">Jet_inverted (colormap)</option> */}
                </select>
              </div>
              {/* <div className="view-btn template-select">
                <select id="template" name="template" style={{height:"100%", width: "100%", background:"#383C41", border:"0px", color:"white", textAlignLast:"center"}}>
                  <option value="MNI" selected>MNI305</option>
                </select>
              </div> */}
              <div className="view-btn" onClick={(e)=>{e.stopPropagation();setShowMenu(!showMenu)}}>
                <IconBurger className={`view-icon ${showMenu && 'show'}`}/>
                {showMenu && 
                  <div className="view-menu" onClick={(e)=>e.stopPropagation()}>
                    {/* <div>Save</div> */}
                    {/* <div>Delete</div> */}
                    {/* <div>Export PNG</div> */}
                    <div onClick={niftiDownload}>Export Nifti</div>
                  </div>}
              </div>
            </div>
          </div>

          {/* <div className="redux-info">
            <h1>isLogged: {isLogged.toString()}</h1>
            <h1>View page</h1>
            <h1>listSelected: {listSelected}</h1>
            <h1>Counter: {counter}</h1>
            <button onClick={()=> dispatch(increment())}>+</button>
            <button onClick={()=> dispatch(decrement())}>-</button>
          </div> */}
          {/* {isLogged ? '' : <h3>Valueable Information I shouldn't see</h3>} */}
        </div>
      </div>
    );
  }
  imageLoader = async (inoutSelect) => {

    "use strict";

    // console.log("imageLoader called");


    function pixelData2str(buf) {
      var bufView = new Uint16Array(buf);
      var len = bufView.length;
      var str = '';

      for(var i = 0; i < len; i++) {


        var word = bufView[i];
        var lower = word & 0xFF;
        var upper = (word >> 8) & 0xFF;
        str += String.fromCharCode(lower) + String.fromCharCode(upper);
      }

      return str;
    }

    function encodePixelData(pixelData) {
      var pixelDataAsString = pixelData2str(pixelData);
      var base64str = window.btoa(pixelDataAsString);
      return base64str;
    }

    function str2pixelData(str) {
      var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
      var bufView = new Int16Array(buf);
      var index = 0;
      for (var i=0, strLen=str.length; i<strLen; i+=2) {
        var lower = str.charCodeAt(i);
        var upper = str.charCodeAt(i+1);
        // debugger;
        bufView[index] = lower + (upper <<8);
        index++;
      }
      return bufView;
    }
    function str2InvertedpixelData(str) {
      var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
      var bufView = new Int16Array(buf);
      var index = 0;
      for (var i=0, strLen=str.length; i<strLen; i+=2) {
        var lower = str.charCodeAt(i);
        var upper = str.charCodeAt(i+1);
        // debugger;
        bufView[index] = 32767-Number(lower + (upper <<8));
        index++;
      }
      return bufView;
    }

    var min1 = 0;
    var max1 = 0;
    function getPixelData(base64PixelData)
    {
      // if(!base64PixelData) debugger;
      var pixelDataAsString = window.atob(base64PixelData);
      var pixelData = str2pixelData(pixelDataAsString);
      // console.log("pixelData:", pixelData);
      return pixelData;
    }
    function getInvertedPixelData(base64PixelData)
    {
      // if(!base64PixelData) debugger;
      var pixelDataAsString = window.atob(base64PixelData);
      var pixelData = str2InvertedpixelData(pixelDataAsString);
      // console.log("pixelData type:", typeof(pixelData), pixelData);
      return pixelData;
    }
    const IdxSlice = this.props.sliceList.findIndex(v=>v.fileID==this.props.counter.fileID)
    console.log('imageLoader with counter and IdxSlice',this.props.counter,IdxSlice)
    var petAxialOutputData = [...Array(91).keys()].map((v,i)=>(getPixelData(this.props.sliceList[IdxSlice].B64.filter(v=>v.Direction=='axial' && v.Type==inoutSelect)[i].B64Data)));
    var petCoronalOutputData = [...Array(109+20).keys()].map((v,i)=>(getPixelData(this.props.sliceList[IdxSlice].B64.filter(v=>v.Direction=='coronal' && v.Type==inoutSelect)[i].B64Data)));
    var petSagittalOutputData = [...Array(91+40).keys()].map((v,i)=>(getPixelData(this.props.sliceList[IdxSlice].B64.filter(v=>v.Direction=='sagittal' && v.Type==inoutSelect)[i].B64Data)));
    var petMipOutputData = [...Array(45).keys()].map((v,i)=>(getPixelData(this.props.sliceList[IdxSlice].B64.filter(v=>v.Direction=='mip' && v.Type==inoutSelect)[i].B64Data)));

    var Inv_petAxialOutputData = [...Array(91).keys()].map((v,i)=>(getInvertedPixelData(this.props.sliceList[IdxSlice].B64.filter(v=>v.Direction=='axial' && v.Type==inoutSelect)[i].B64Data)));
    var Inv_petCoronalOutputData = [...Array(109+20).keys()].map((v,i)=>(getInvertedPixelData(this.props.sliceList[IdxSlice].B64.filter(v=>v.Direction=='coronal' && v.Type==inoutSelect)[i].B64Data)));
    var Inv_petSagittalOutputData = [...Array(91+40).keys()].map((v,i)=>(getInvertedPixelData(this.props.sliceList[IdxSlice].B64.filter(v=>v.Direction=='sagittal' && v.Type==inoutSelect)[i].B64Data)));
    var Inv_petMipOutputData = [...Array(45).keys()].map((v,i)=>(getInvertedPixelData(this.props.sliceList[IdxSlice].B64.filter(v=>v.Direction=='mip' && v.Type==inoutSelect)[i].B64Data)));

    var mniAxialOutputData = MNI_Axial.map((v,i)=>(getPixelData(v)));
    var mniCoronalOutputData = MNI_Coronal.map((v,i)=>(getPixelData(v)));
    var mniSagittalOutputData = MNI_Sagittal.map((v,i)=>(getPixelData(v)));
    var mniMipOutputData = [...Array(45).keys()].map((v,i)=>(getPixelData(this.props.sliceList[IdxSlice].B64.filter(v=>v.Direction=='mip' && v.Type==inoutSelect)[i].B64Data)));

    var Inv_mniAxialOutputData = MNI_Axial.map((v,i)=>(getInvertedPixelData(v)));
    var Inv_mniCoronalOutputData = MNI_Coronal.map((v,i)=>(getInvertedPixelData(v)));
    var Inv_mniSagittalOutputData = MNI_Sagittal.map((v,i)=>(getInvertedPixelData(v)));
    var Inv_mniMipOutputData = [...Array(45).keys()].map((v,i)=>(getInvertedPixelData(this.props.sliceList[IdxSlice].B64.filter(v=>v.Direction=='mip' && v.Type==inoutSelect)[i].B64Data)));

    function getMNIImage(imageId) {
      let identifier=imageId.split(/[:,/]+/)
      let device = identifier[0]//pet
      let inout = identifier[1]//output
      let slice = identifier[2] //0
      let direction=identifier[3]
      let Inverter=identifier[4]
      let colormap=identifier[5]
      let id=Number(identifier[6])
      var width = 91;
      var height = 91;
      if(direction === 'coronal') {width=91+40; height=91}
      else if(direction === 'sagittal') {width=109+20; height=91}
      else if(direction === 'axial') {width=91+40; height=109+20}
      else if (direction === "mip"){width = 109+20; height = 91}
      // else if(direction === 'mip'){width = 69; height = 51}
      // console.log("ID: ", ID, " Direction: ", Direction, " w/h: ", width,"/",height)

      var image = {
        imageId: imageId,

        minPixelValue : 0,
        maxPixelValue : 32767,
        slope: 1.0,
        intercept: 0,
        windowCenter : 16384,
        windowWidth : 32767,
        getPixelData: getPixelData,
        rows: height,
        columns: width,
        height: height,
        width: width,
        color: false,
        columnPixelSpacing: 2,
        rowPixelSpacing: 2,
        sizeInBytes: width * height * 2,
      };

      function getPixelData()
      {
        // if (colormap == "gray"){
        //   Inverter = "invert";
        // }
        if (Inverter === "right"){
          if (direction === "coronal"){return mniCoronalOutputData[id]}
          else if (direction === "sagittal"){return mniSagittalOutputData[id]}
          else if (direction === "axial"){return mniAxialOutputData[id]}
          else if (direction === "mip"){return mniMipOutputData[id]}
        } else {
          if (direction === "coronal"){return Inv_mniCoronalOutputData[id]}
          else if (direction === "sagittal"){return Inv_mniSagittalOutputData[id]}
          else if (direction === "axial"){return Inv_mniAxialOutputData[id]}
          else if (direction === "mip"){return Inv_mniMipOutputData[id]}
        }
        // else if (direction === "mip" && inout === "output"){return petMipOutputData[id]}

        throw "unknown imageId";
      }

      return {
        promise: new Promise((resolve) => {
          resolve(image);
        }),
        cancelFn: undefined
      };
    }
    function getPETImage(imageId) {
      let identifier=imageId.split(/[:,/]+/)
      let device = identifier[0]//pet
      let inout = identifier[1]//output
      let slice = identifier[2] //0
      let direction=identifier[3]
      let Inverter=identifier[4]
      let colormap=identifier[5]
      let id=Number(identifier[6])
      var width = 91;
      var height = 91;
      if(direction === 'coronal') {width=91+40; height=91}
      else if(direction === 'sagittal') {width=109+20; height=91}
      else if(direction === 'axial') {width=91+40; height=109+20}
      else if (direction === "mip"){width = 109+20; height = 91}
      // else if(direction === 'mip'){width = 69; height = 51}
      // console.log("ID: ", ID, " Direction: ", Direction, " w/h: ", width,"/",height)

      var image = {
        imageId: imageId,

        minPixelValue : 0,
        maxPixelValue : 32767,
        slope: 1.0,
        intercept: 0,
        windowCenter : 16384,
        windowWidth : 32767,
        getPixelData: getPixelData,
        rows: height,
        columns: width,
        height: height,
        width: width,
        color: false,
        columnPixelSpacing: 2,
        rowPixelSpacing: 2,
        sizeInBytes: width * height * 2,
      };

      function getPixelData()
      {
        // if (colormap == "gray"){
        //   Inverter = "invert";
        // }
        if (Inverter === "right"){
          if (direction === "coronal"){return petCoronalOutputData[id]}
          else if (direction === "sagittal"){return petSagittalOutputData[id]}
          else if (direction === "axial"){return petAxialOutputData[id]}
          else if (direction === "mip"){return petMipOutputData[id]}
        } else {
          if (direction === "coronal"){return Inv_petCoronalOutputData[id]}
          else if (direction === "sagittal"){return Inv_petSagittalOutputData[id]}
          else if (direction === "axial"){return Inv_petAxialOutputData[id]}
          else if (direction === "mip"){return Inv_petMipOutputData[id]}
        }
        // else if (direction === "mip" && inout === "output"){return petMipOutputData[id]}

        throw "unknown imageId";
      }

      return {
        promise: new Promise((resolve) => {
          resolve(image);
        }),
        cancelFn: undefined
      };
    }

    cornerstone.registerImageLoader('mni', getMNIImage);
    cornerstone.registerImageLoader('pet', getPETImage);
  };

  metaDataLoader = async (inoutSelect) => {

    "use strict";

    // console.log("2.5");
    function metaDataProvider(type, imageId) {
      let identifier=imageId.split(/[:,/]+/)
      let device = identifier[0]//pet
      let inout = identifier[1]//output
      let slice = identifier[2] //0
      let direction=identifier[3]
      let Inverter=identifier[4]
      let colormap=identifier[5]
      let id=Number(identifier[6])
      let scale = 1;
      let cX = 1;
      let cY = 1;
      let cZ = 1;

      // let identifier=imageId.split('/')
      // // console.log(identifier)
      // let Device = identifier[0].substr(0,identifier[0].length-1)
      // let Type = identifier[identifier.length-3]
      // let Direction = identifier[identifier.length-2]
      // let ID = identifier[identifier.length-1]
      let width = 91;
      let height = 91;
      if (direction === "coronal"){width = 91+40; height = 91}
      else if (direction === "sagittal"){width = 109+20; height = 91}
      else if (direction === "axial"){width = 91+40; height = 109+20}
      else if (direction === "mip"){width = 109+20; height = 91}
      // else if (direction === "mip"){width = 69; height = 51}

      // console.log(identifier, type)
      if(type === 'imagePlaneModule') {
          if (direction === 'coronal'){
              return {
                  frameOfReferenceUID: '1.2.3.4.5',
                  rows: 91,
                  columns: 91+40,
                  rowCosines:     [ 0,  1,  0], 
                  columnCosines:  [ 0,  0,  1],
                  imagePositionPatient: [scale*id+cY, cX, cZ], //coronal plane에서 [xxx, sagittal line, axial line]
                  columnPixelSpacing: 1,
                  rowPixelSpacing: 1,
              }
          }
          else if (direction === 'sagittal'){
              return {
                  frameOfReferenceUID: '1.2.3.4.5',
                  rows: 91,
                  columns: 109+20,
                  rowCosines:     [1,  0,  0], 
                  columnCosines:  [ 0,  0, 1],
                  imagePositionPatient: [cY, scale*id+cX, cZ], //sagittal plane에서 [coroanl line, xxx, axial line]
                  columnPixelSpacing: 1,
                  rowPixelSpacing: 1,
              }
          }
          else if (direction === 'axial'){
              return {
                  frameOfReferenceUID: '1.2.3.4.5',
                  rows: 109+20,
                  columns: 91+40,
                  rowCosines:     [ 0, 1,  0], 
                  columnCosines:  [ -1,  0,  0],
                  imagePositionPatient: [cY+109+20, cX, -scale*id+cZ+91], //axial plane에서  [coronal line, sagittal line, xxx]
                  columnPixelSpacing: 1,
                  rowPixelSpacing: 1,
              }
          }
          // else if (direction === 'mip'){
          //     return {
          //         frameOfReferenceUID: '1.2.3.4.5.6',
          //         rows: 91,//91/2,
          //         columns: 109,//109/2,
          //         rowCosines:     [0,  0,  0], 
          //         columnCosines:  [ 0,  0, 0],
          //         // -(Math.sin(scale*id*8/180*Math.PI)+Math.cos(scale*id*8/180*Math.PI)) //sagittal plane에서 [coroanl line, xxx, axial line]
          //         // 109*id*8/360+109/2
          //         imagePositionPatient: [cY, cX, cZ], //sagittal plane에서 [coroanl line, xxx, axial line]
          //         columnPixelSpacing: 1,
          //         rowPixelSpacing: 1,
          //     }
          // }
      }
    }

    cornerstone.metaData.addProvider(metaDataProvider);

  };
}
const mapStateToProps = (state) => ({
  // storeCount: state.count.count,
  counter:state.counter,
  isLogged:state.isLogged,
  stackManager:state.stackManager,
  sliceList: state.sliceList,
  fileList: state.fileList,
});

const mapDispatchToProps = (dispatch) => ({
  increment: () => dispatch(actions.increment()),
  decrement: () => dispatch(actions.decrement()),
  addStack: (Stack)=> dispatch(actions.addStack(Stack)),
  resetSlices: (Data)=>dispatch(actions.resetSlices(Data)),
  updateStack: (Stack)=> dispatch(actions.updateStack(Stack)),
  removeStack: (Stack)=> dispatch(actions.removeStack(Stack)),
  login: () => dispatch(actions.login()),
  logout: () => dispatch(actions.logout()),
});
export default connect(mapStateToProps, mapDispatchToProps)(View);