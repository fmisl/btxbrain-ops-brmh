import React, { Component } from 'react'
import './ImageViewer.css'

import { render } from "react-dom";
import { connect } from 'react-redux';
import * as actions from '../../../reduxs/actions';
// Importing all the dependencies for the Cornerstone library
import * as cornerstone from "cornerstone-core";
import * as cornerstoneMath from "cornerstone-math";
import * as cornerstoneTools from "cornerstone-tools";
import Hammer from "hammerjs";
import * as cornerstoneWebImageLoader from "cornerstone-web-image-loader";
import { CartesianGrid } from 'recharts';
import graycmap from "../../../images/graycmap.png"
import invertedgraycmap from "../../../images/invertedgraycmap.png"
import hotcmap from "../../../images/hotcmap.png"
import invertedhotcmap from "../../../images/invertedhotcmap.png"
import jetcmap from "../../../images/jetcmap.png"
import invertedjetcmap from "../../../images/invertedjetcmap.png"

// Listing the dependencies for reference laterInput
cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
cornerstoneWebImageLoader.external.cornerstone = cornerstone;
cornerstoneTools.external.Hammer = Hammer;


const bottomLeftStyle = {
  bottom: "5px",
  left: "5px",
  position: "absolute",
  color: "white"
};

const bottomRightStyle = {
  bottom: "5px",
  right: "5px",
  position: "absolute",
  color: "white"
};

class ImageViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ww: 10000,
      wc: 16384,
      value5: {
        min: 3,
        max: 7,
      },
      in_suvr_max:0, 
      in_suvr_min:0,
      out_suvr_max:0,
      out_suvr_min:0,

      ClayerId: [],
      AlayerId: [],
      SlayerId: [],
      MlayerId: [],
      viewerReady: false,
    };
    // this.onKeyPress = this.onKeyPress.bind(this);
    this.onImageRendered = this.onImageRendered.bind(this);
    this.onNewImage = this.onNewImage.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    this.onALayerAdded = this.onALayerAdded.bind(this);
    this.onCLayerAdded = this.onCLayerAdded.bind(this);
    this.onSLayerAdded = this.onSLayerAdded.bind(this);
    this.Arenderer_findImageFn = this.Arenderer_findImageFn.bind(this);
    this.Crenderer_findImageFn = this.Crenderer_findImageFn.bind(this);
    this.Srenderer_findImageFn = this.Srenderer_findImageFn.bind(this);
    this.Arenderer = new cornerstoneTools.stackRenderers.FusionRenderer();
    this.Crenderer = new cornerstoneTools.stackRenderers.FusionRenderer();
    this.Srenderer = new cornerstoneTools.stackRenderers.FusionRenderer();
    this.wwwcsynchronizer = new cornerstoneTools.Synchronizer("cornerstoneimagerendered", cornerstoneTools.wwwcSynchronizer);
    this.synchronizer = new cornerstoneTools.Synchronizer("cornerstonenewimage", cornerstoneTools.updateImageSynchronizer);
  }

  componentWillUnmount() {
    const elementC = this.elementC;
    const elementS = this.elementS;
    const elementA = this.elementA;
    const elementM = this.elementM;
    elementC.removeEventListener("cornerstoneimagerendered",this.onImageRendered);
    elementS.removeEventListener("cornerstoneimagerendered",this.onImageRendered);
    elementA.removeEventListener("cornerstoneimagerendered",this.onImageRendered);
    elementM.removeEventListener("cornerstoneimagerendered",this.onImageRendered);
    elementC.removeEventListener("cornerstonenewimage", this.onNewImage);
    elementS.removeEventListener("cornerstonenewimage", this.onNewImage);
    elementA.removeEventListener("cornerstonenewimage", this.onNewImage);
    elementM.removeEventListener("cornerstonenewimage", this.onNewImage);
    elementC.removeEventListener("cornerstonelayeradded", this.onCLayerAdded);
    elementS.removeEventListener("cornerstonelayeradded", this.onSLayerAdded);
    elementA.removeEventListener("cornerstonelayeradded", this.onALayerAdded);
    window.removeEventListener("resize", this.onWindowResize);
    cornerstone.disable(elementC);
    cornerstone.disable(elementS);
    cornerstone.disable(elementA);
    cornerstone.disable(elementM);
  }

  componentDidMount() {
    try{
      const elementC = this.elementC;
      const elementS = this.elementS;
      const elementA = this.elementA;
      const elementM = this.elementM;

      // Enable the DOM Element for use with Cornerstone
      cornerstone.enable(elementC);
      cornerstone.enable(elementS);
      cornerstone.enable(elementA);
      cornerstone.enable(elementM);

      cornerstoneTools.touchInput.enable(elementC);
      cornerstoneTools.touchInput.enable(elementS);
      cornerstoneTools.touchInput.enable(elementA);
      cornerstoneTools.touchInput.enable(elementM);
      cornerstoneTools.keyboardInput.enable(elementC);
      cornerstoneTools.keyboardInput.enable(elementS);
      cornerstoneTools.keyboardInput.enable(elementA);
      cornerstoneTools.keyboardInput.enable(elementM);
      cornerstoneTools.mouseInput.enable(elementC);
      cornerstoneTools.mouseInput.enable(elementS);
      cornerstoneTools.mouseInput.enable(elementA);
      cornerstoneTools.mouseInput.enable(elementM);
      cornerstoneTools.mouseWheelInput.enable(elementC);
      cornerstoneTools.mouseWheelInput.enable(elementS);
      cornerstoneTools.mouseWheelInput.enable(elementA);
      cornerstoneTools.mouseWheelInput.enable(elementM);

      this.InitialloadImage(elementC, elementS, elementA, elementM);
    } catch(e){
      console.error('fast skip by wheel')
    }
  }
  InitialStackLoad=(stack, MNIstack, element, onLayerAdded, onRenderer)=>{
    // const stack = this.props.stackC;
    cornerstoneTools.addStackStateManager(element, ["stack", 'referenceLines', 'crosshairs']);
    // const MNIstack = this.props.MNIstackC;
    cornerstoneTools.addToolState(element, "stack", stack);
    cornerstoneTools.addToolState(element, 'stack', MNIstack);
    cornerstoneTools.addToolState(element, 'stackRenderer', onRenderer);
    onRenderer.render(element);
    cornerstoneTools.stackScrollWheel.activate(element);
    cornerstoneTools.stackPrefetch.enable(element, 3);
    cornerstoneTools.wwwc.activate(element, 4);
    this.wwwcsynchronizer.add(element);
    // this.synchronizer.add(element);
    cornerstoneTools.stackScrollKeyboard.activate(element);
    element.addEventListener("cornerstonelayeradded", onLayerAdded);
    element.addEventListener("cornerstoneimagerendered",this.onImageRendered);
    element.addEventListener("cornerstonenewimage", this.onNewImage);
    window.addEventListener("resize", this.onWindowResize);
  }
  InitialloadImage=(elementC, elementS, elementA, elementM)=>{
    const { isCrosshaired, isPlayed, selectedColormap } = this.props;
    this.Crenderer.findImageFn = this.Crenderer_findImageFn;
    this.Srenderer.findImageFn = this.Srenderer_findImageFn;
    this.Arenderer.findImageFn = this.Arenderer_findImageFn;
    const currentIndex = this.props.stackManager.filter((v)=>{if (v.fileID==this.props.counter.fileID) return {currentC: v.currentC, currentS:v.currentS, currentA:v.currentA}})
    
    this.InitialStackLoad(this.props.stackC, this.props.MNIstackC, elementC, this.onCLayerAdded, this.Crenderer)
    this.InitialStackLoad(this.props.stackS, this.props.MNIstackS, elementS, this.onSLayerAdded, this.Srenderer)
    this.InitialStackLoad(this.props.stackA, this.props.MNIstackA, elementA, this.onALayerAdded, this.Arenderer)
    cornerstoneTools.addStackStateManager(elementM, ["stack", 'playClip']);
    cornerstoneTools.addToolState(elementM, "stack", this.props.stackM);
    cornerstoneTools.stackScroll.activate(elementM, 1);
    cornerstoneTools.stackScrollWheel.activate(elementM);
    cornerstoneTools.wwwc.activate(elementM, 4);
    this.wwwcsynchronizer.add(elementM);
    elementM.addEventListener("cornerstoneimagerendered",this.onImageRendered);
    elementM.addEventListener("cornerstonenewimage", this.onNewImage);
    window.addEventListener("resize", this.onWindowResize);

    // const stack = this.props.stackM;

    // const coronalLoadImagePromise = cornerstone.loadImage(this.props.MNIstackC.imageIds[30]).then(image => {
    //   try {
    //     // console.log('MIP image in coronal:', image, currentIndex[0].currentC)
    //     cornerstone.displayImage(elementC, image);
    //     this.synchronizer.add(elementC);
    //   } catch(e){
    //     console.log('FastSkip coronalLoadImagePromise')
    //   }
    // });
    // const ClayerId = cornerstone.getLayer(this.elementC, this.state.ClayerId[1]);
        // console.log(ClayerId)
    // ClayerId.image.imageId = "mni:output/0/coronal/right/invertedGray/"+this.props.stackManager[this.props.counter.tabX].currentC
    const coronalLoadImagePromise = cornerstone.loadImage(this.props.stackC.imageIds[currentIndex[0].currentC]).then(image => {
      try {
        // cornerstone.loadImage(this.props.MNIstackC.imageIds[currentIndex[0].currentC]).then(MNIimage => {
        //   console.log('MIP image in coronal:', image, MNIimage)
        //   cornerstone.displayImage(elementC, MNIimage);
        // })
        // cornerstone.displayImage(elementC, this.props.MNIstackC.imageIds[30].image);
        cornerstone.displayImage(elementC, image);
        cornerstone.loadImage(this.props.MNIstackC.imageIds[currentIndex[0].currentC]).then(MNIimage => {
          cornerstone.setLayerImage(this.elementC, MNIimage, this.state.ClayerId[1])
          cornerstone.updateImage(this.elementC);
        })
        this.synchronizer.add(elementC);
      } catch(e){
        console.log('FastSkip coronalLoadImagePromise')
      }
    });

    
    const sagittalLoadImagePromise = cornerstone.loadImage(this.props.stackS.imageIds[currentIndex[0].currentS]).then(image => {
      // Display the first image
      try{
        cornerstone.displayImage(elementS, image);
        cornerstone.loadImage(this.props.MNIstackS.imageIds[currentIndex[0].currentS]).then(MNIimage => {
          cornerstone.setLayerImage(this.elementS, MNIimage, this.state.SlayerId[1])
          cornerstone.updateImage(this.elementS);
        })
        this.synchronizer.add(elementS);
      } catch(e){
        console.error('FastSkip sagittalLoadImagePromise')
      }
    });

    const axialLoadImagePromise = cornerstone.loadImage(this.props.stackA.imageIds[currentIndex[0].currentA]).then(image => {
      // Display the first image
      try{
        console.log(this.props.stackA)
        cornerstone.displayImage(elementA, image);
        cornerstone.loadImage(this.props.MNIstackA.imageIds[currentIndex[0].currentA]).then(MNIimage => {
          cornerstone.setLayerImage(this.elementA, MNIimage, this.state.AlayerId[1])
          cornerstone.updateImage(this.elementA);
        })
        this.synchronizer.add(elementA);
      } catch(e){
        console.error('FastSkip axialLoadImagePromise')
      }
    });


    const mipLoadImagePromise = cornerstone.loadImage(this.props.stackM.imageIds[0]).then(image => {
      // Display the first image
      try{
        try{//데이터가 없으면 if문에서 stack.data[0] 호출할때 에러나서 catch로 이동
          let temp = cornerstoneTools.getElementToolStateManager(elementM)
          if (temp.toolState.stack.data[0]){ //데이터가 존재하면 돌리던건 멈춘다
            cornerstoneTools.stopClip(elementM, 5);
            // alert('데이터 있음->기존데이터 멈춤: stopClip')
          }
        } catch(e){
          // alert('데이터 없음->: nothing')
        }
        const temp = cornerstone.getEnabledElement(this.elementM)
        console.log(temp)
        console.log(image)
        console.log(this.props.stackM)
        cornerstone.displayImage(elementM, image);
        // var toolStateManager = cornerstoneTools.getElementToolStateManager(elementM);
        // cornerstone.clearToolState(elementM, 'stack')
        // cornerstone.setLayerImage(this.elementA, image, this.state.MlayerId[1])
        // cornerstone.updateImage(this.elementM);

        try{
          let temp = cornerstoneTools.getElementToolStateManager(elementM)
          if (temp.toolState.stack.data[0]){ //데이터가 존재하면 돌리던건 멈춘다
            if (isPlayed) cornerstoneTools.playClip(elementM, 5);
            else cornerstoneTools.stopClip(elementM, 5);
            // alert('새로운 데이터 회전->: playClip')
          }
        } catch(e){
          console.log('error')
        }

        // cornerstone.displayImage(elementA, image);
      } catch(e){
        console.log('FastSkip axialLoadImagePromise', e)
      }
    });

    Promise.all([coronalLoadImagePromise, sagittalLoadImagePromise, axialLoadImagePromise, mipLoadImagePromise]).then(() => {
      const { isCrosshaired, isPlayed } = this.props;
      const {ClayerId, SlayerId, AlayerId} = this.state;
      // const ClayerId = cornerstone.getLayers(elementC);
      // const SlayerId = cornerstone.getLayers(elementS);
      // const AlayerId = cornerstone.getLayers(elementA);
      // Add the enabled elements to the synchronization context
      try{
        cornerstoneTools.wwwcRegion.activate(elementC, 2);
        cornerstoneTools.wwwcRegion.activate(elementS, 2);
        cornerstoneTools.wwwcRegion.activate(elementA, 2);
        cornerstoneTools.wwwcRegion.activate(elementM, 2);
        // enable reference Lines tool
        {isCrosshaired ? cornerstoneTools.referenceLines.tool.enable(elementC, this.synchronizer):cornerstoneTools.referenceLines.tool.disable(elementC)}
        {isCrosshaired ? cornerstoneTools.referenceLines.tool.enable(elementS, this.synchronizer):cornerstoneTools.referenceLines.tool.disable(elementS)}
        {isCrosshaired ? cornerstoneTools.referenceLines.tool.enable(elementA, this.synchronizer):cornerstoneTools.referenceLines.tool.disable(elementA)}
        this.synchronizer.add(elementC);
        this.synchronizer.add(elementS);
        this.synchronizer.add(elementA);
        cornerstoneTools.crosshairs.enable(elementC, 1, this.synchronizer);
        cornerstoneTools.crosshairs.enable(elementS, 1, this.synchronizer);
        cornerstoneTools.crosshairs.enable(elementA, 1, this.synchronizer);
        // cornerstone.setActiveLayer(elementC, ClayerId[0]);
        // cornerstone.setActiveLayer(elementS, SlayerId[0]);
        // cornerstone.setActiveLayer(elementA, AlayerId[0]);
        // let ClayerPET = cornerstone.getLayer(elementC, ClayerId[0]);
        // let ClayerPET = cornerstone.getLayer(elementC, ClayerId[0]);
        // let ClayerPET = cornerstone.getLayer(elementC, ClayerId[0]);
        // console.log(ClayerPET.image.imageId)
        // console.log(ClayerPET.image.imageId.split('/').slice(0,-1).join('/').concat('/', currentIndex[0].currentC))
        // ClayerPET.image.imageId=ClayerPET.image.imageId.split('/').slice(0,-1).join('/').concat('/', currentIndex[0].currentC)


        //  opacity initializer
        let ClayerMNI = cornerstone.getLayer(elementC, ClayerId[1]);
        ClayerMNI.options.opacity=this.props.opacityValue;
        let SlayerMNI = cornerstone.getLayer(elementS, SlayerId[1]);
        SlayerMNI.options.opacity=this.props.opacityValue;
        let AlayerMNI = cornerstone.getLayer(elementA, AlayerId[1]);
        AlayerMNI.options.opacity=this.props.opacityValue;
        
        //  colormap initializer
        const Clayers = cornerstone.getLayers(elementC);
        const Slayers = cornerstone.getLayers(elementS);
        const Alayers = cornerstone.getLayers(elementA);

        let layerPETC = cornerstone.getLayer(elementC, Clayers[0].layerId);
        layerPETC.viewport.colormap = selectedColormap;
        let layerPETS = cornerstone.getLayer(elementS, Slayers[0].layerId);
        layerPETS.viewport.colormap = selectedColormap;
        let layerPETA = cornerstone.getLayer(elementA, Alayers[0].layerId);
        layerPETA.viewport.colormap = selectedColormap;

        let viewportM = cornerstone.getViewport(elementM);
        viewportM.colormap = selectedColormap;
        cornerstone.setViewport(elementM, viewportM);

        // cornerstone.updateImage(elementC);
        // cornerstone.updateImage(elementS);
        // cornerstone.updateImage(elementA);
        // cornerstone.setLayerImage(elementC, ClayerMNI.image, ClayerId[1])
        // console.log(ClayerPET, ClayerMNI, ClayerId)
        // console.log(SlayerMNI, SlayerId)
        // console.log(AlayerMNI, AlayerId)
        // cornerstone.updateImage(this.elementS);
        // cornerstone.updateImage(this.elementA);
  

      } catch(e){
        console.log('FastSkip Promise in Promise.all',e)
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const {ClayerId, SlayerId, AlayerId} = this.state;
    const { value5, handleWindowChange, isInverted, isCrosshaired, isPlayed, isSNed, currentStepIndex, selectedColormap, stackManager, updateSUVR_min_max } = this.props;
    
    const elementC = this.elementC;
    const elementS = this.elementS;
    const elementA = this.elementA;
    const elementM = this.elementM;
    if (prevProps.opacityValue !== this.props.opacityValue){
      try{
        console.log("opacity", this.props.opacityValue)
        let ClayerMNI = cornerstone.getLayer(elementC, ClayerId[1]);
        ClayerMNI.options.opacity=this.props.opacityValue;
        let SlayerMNI = cornerstone.getLayer(elementS, SlayerId[1]);
        SlayerMNI.options.opacity=this.props.opacityValue;
        let AlayerMNI = cornerstone.getLayer(elementA, AlayerId[1]);
        AlayerMNI.options.opacity=this.props.opacityValue;
        cornerstone.updateImage(elementC)
        cornerstone.updateImage(elementS)
        cornerstone.updateImage(elementA)
      } catch(e){
        console.log('componentDidUpdate error: opacity')
      }
    }

    try{
      // 상위의 state (ww, wc) 를 받아서 viewport를 업데이트 시킴
      if (prevProps.value5 != value5){
        const {ClayerId,SlayerId,AlayerId} = this.state;
        const newWW = (value5.max-value5.min);
        const newWC = isInverted ? 32767-(value5.max+value5.min)/2:(value5.max+value5.min)/2;

        // let layerPETC = cornerstone.getLayer(elementC, ClayerId[1]);
        // layerPETC.viewport.voi.windowCenter = newWC;
        // layerPETC.viewport.voi.windowWidth = newWW;
        // let layerPETS = cornerstone.getLayer(elementS, SlayerId[1]);
        // layerPETS.viewport.voi.windowCenter = newWC;
        // layerPETS.viewport.voi.windowWidth = newWW;
        // let layerPETA = cornerstone.getLayer(elementC, AlayerId[1]);
        // layerPETA.viewport.voi.windowCenter = newWC;
        // layerPETA.viewport.voi.windowWidth = newWW;
        // cornerstone.updateImage(elementC);
        // cornerstone.updateImage(elementS);
        // cornerstone.updateImage(elementA);

        let viewportC = cornerstone.getViewport(this.elementC);
        viewportC.voi.windowCenter = newWC;
        viewportC.voi.windowWidth = newWW;
        cornerstone.setViewport(this.elementC, viewportC);
      }
    } catch(e){
      console.log('componentDidUpdate error: windowCenter')
    }
    try{
      if (prevProps.selectedColormap !== selectedColormap){
        // const {ClayerId,SlayerId,AlayerId} = this.state;
        const ClayerId = cornerstone.getLayers(elementC);
        const SlayerId = cornerstone.getLayers(elementS);
        const AlayerId = cornerstone.getLayers(elementA);
        let layerPETC = cornerstone.getLayer(elementC, ClayerId[0].layerId);
        layerPETC.viewport.colormap = selectedColormap;
        let layerPETS = cornerstone.getLayer(elementS, SlayerId[0].layerId);
        layerPETS.viewport.colormap = selectedColormap;
        let layerPETA = cornerstone.getLayer(elementA, AlayerId[0].layerId);
        layerPETA.viewport.colormap = selectedColormap;

        let viewportM = cornerstone.getViewport(elementM);
        viewportM.colormap = selectedColormap;
        cornerstone.setViewport(elementM, viewportM);
        // cornerstone.updateImage(elementC);
        // cornerstone.updateImage(elementS);
        // cornerstone.updateImage(elementA);
      }
    } catch(e){
      console.log('componentDidUpdate error: colormap', e)
    }
    try{
      const current_suvr_max = stackManager.find((v)=>v.fileID==this.props.counter.fileID)?.out_suvr_max
      if (this.state.out_suvr_max != current_suvr_max){
        // console.log('working position')
        const target_stackManager = stackManager.find((v)=>v.fileID==this.props.counter.fileID)
        const in_suvr_max = target_stackManager?.in_suvr_max
        const in_suvr_min = target_stackManager?.in_suvr_min
        const out_suvr_max = target_stackManager?.out_suvr_max
        const out_suvr_min = target_stackManager?.out_suvr_min
        const LRDirection = isSNed ? target_stackManager?.outputAffineX0:target_stackManager?.inputAffineX0;
        const APDirection = isSNed ? target_stackManager?.outputAffineY1:target_stackManager?.inputAffineY1;
        const SIDirection = isSNed ? target_stackManager?.outputAffineZ2:target_stackManager?.inputAffineZ2;
        this.SagittalLeftSide = APDirection < 0 ? "A":"P";
        this.SagittalRightSide = APDirection < 0 ? "P":"A";
        this.CoronalLeftSide = LRDirection < 0 ? "R":"L";
        this.CoronalRightSide = LRDirection < 0 ? "L":"R";
        this.AxialLeftSide = LRDirection < 0 ? "R":"L";
        this.AxialRightSide = LRDirection < 0 ? "L":"R";
        this.CoronalUppderSide = SIDirection < 0 ? "I":"S";
        this.CoronalUnderSide = SIDirection < 0 ? "S":"I";
        this.setState({
          in_suvr_max,
          in_suvr_min,
          out_suvr_max,
          out_suvr_min,
        })
      }
      if (prevProps.stackC.imageIds[0] !== this.props.stackC.imageIds[0]){
        this.loadImage(this.elementC, this.elementS, this.elementA, this.elementM);
      } 
      if (isPlayed==true) {
        cornerstoneTools.playClip(this.elementM, currentStepIndex);
      }
      else {
        cornerstoneTools.stopClip(this.elementM, currentStepIndex);
      }
      if (prevProps.isCrosshaired != isCrosshaired){
        this.controlViewport();
      }

      // console.log(this.props.stackManager[this.props.counter.tabX].currentC, this.props.stackManager[this.props.counter.tabX].currentS, this.props.stackManager[this.props.counter.tabX].currentA)
      // const CimageId = cornerstone.getLayer(this.elementC, this.state.ClayerId[1])
      // console.log(CimageId.image.imageId)
      if (prevProps.stackManager[this.props.counter.tabX].currentC !== this.props.stackManager[this.props.counter.tabX].currentC){
        cornerstone.loadImage(this.props.MNIstackC.imageIds[this.props.stackManager[this.props.counter.tabX].currentC]).then(MNIimage => {
          cornerstone.setLayerImage(this.elementC, MNIimage, this.state.ClayerId[1])
          cornerstone.updateImage(this.elementC);
        })
      }
      if (prevProps.stackManager[this.props.counter.tabX].currentS !== this.props.stackManager[this.props.counter.tabX].currentS){
        cornerstone.loadImage(this.props.MNIstackS.imageIds[this.props.stackManager[this.props.counter.tabX].currentS]).then(MNIimage => {
          cornerstone.setLayerImage(this.elementS, MNIimage, this.state.SlayerId[1])
          cornerstone.updateImage(this.elementS);
        })
      }
      if (prevProps.stackManager[this.props.counter.tabX].currentA !== this.props.stackManager[this.props.counter.tabX].currentA){
        cornerstone.loadImage(this.props.MNIstackA.imageIds[this.props.stackManager[this.props.counter.tabX].currentA]).then(MNIimage => {
          cornerstone.setLayerImage(this.elementA, MNIimage, this.state.AlayerId[1])
          cornerstone.updateImage(this.elementA);
        })
      }
    } catch(e){
      console.log('componentDidUpdate error', e)
    }
    if (isPlayed==true) {
      cornerstoneTools.playClip(this.elementM, currentStepIndex);
    }
  }

  loadImage=(elementC, elementS, elementA, elementM)=>{
    const { isCrosshaired, isPlayed,selectedColormap } = this.props;
    this.Crenderer.findImageFn = this.Crenderer_findImageFn;
    this.Srenderer.findImageFn = this.Srenderer_findImageFn;
    this.Arenderer.findImageFn = this.Arenderer_findImageFn;
    const currentIndex = this.props.stackManager.filter((v)=>{if (v.fileID==this.props.counter.fileID) return {currentC: v.currentC, currentS:v.currentS, currentA:v.currentA}})
    
    this.InitialStackLoad(this.props.stackC, this.props.MNIstackC, elementC, this.onCLayerAdded, this.Crenderer)
    this.InitialStackLoad(this.props.stackS, this.props.MNIstackS, elementS, this.onSLayerAdded, this.Srenderer)
    this.InitialStackLoad(this.props.stackA, this.props.MNIstackA, elementA, this.onALayerAdded, this.Arenderer)

    const coronalLoadImagePromise = cornerstone.loadImage(this.props.stackC.imageIds[currentIndex[0].currentC]).then(image => {
      try {
        cornerstone.displayImage(elementC, image);
        cornerstone.loadImage(this.props.MNIstackC.imageIds[currentIndex[0].currentC]).then(MNIimage => {
          cornerstone.setLayerImage(this.elementC, MNIimage, this.state.ClayerId[1])
          cornerstone.updateImage(this.elementC);
        })
        this.synchronizer.add(elementC);
      } catch(e){
        console.error('FastSkip coronalLoadImagePromise')
      }
    });
    const sagittalLoadImagePromise = cornerstone.loadImage(this.props.stackS.imageIds[currentIndex[0].currentS]).then(image => {
      // Display the first image
      try{
        cornerstone.displayImage(elementS, image);
        cornerstone.loadImage(this.props.MNIstackS.imageIds[currentIndex[0].currentS]).then(MNIimage => {
          cornerstone.setLayerImage(this.elementS, MNIimage, this.state.SlayerId[1])
          cornerstone.updateImage(this.elementS);
        })
        this.synchronizer.add(elementS);
      } catch(e){
        console.error('FastSkip sagittalLoadImagePromise')
      }
    });
    const axialLoadImagePromise = cornerstone.loadImage(this.props.stackA.imageIds[currentIndex[0].currentA]).then(image => {
      // Display the first image
      try{
        cornerstone.displayImage(elementA, image);
        cornerstone.loadImage(this.props.MNIstackA.imageIds[currentIndex[0].currentA]).then(MNIimage => {
          cornerstone.setLayerImage(this.elementA, MNIimage, this.state.AlayerId[1])
          cornerstone.updateImage(this.elementA);
        })
        this.synchronizer.add(elementA);
      } catch(e){
        console.error('FastSkip axialLoadImagePromise')
      }
    });
    const mipLoadImagePromise = cornerstone.loadImage(this.props.stackM.imageIds[0]).then(image => {
      // Display the first image
      try{
        try{//데이터가 없으면 if문에서 stack.data[0] 호출할때 에러나서 catch로 이동
          let temp = cornerstoneTools.getElementToolStateManager(elementM)
          if (temp.toolState.stack.data[0]){ //데이터가 존재하면 돌리던건 멈춘다
            cornerstoneTools.stopClip(elementM, 5);
            // alert('데이터 있음->기존데이터 멈춤: stopClip')
          }
        } catch(e){
          // alert('데이터 없음->: nothing')
        }
        // var toolStateManager = cornerstoneTools.getElementToolStateManager(elementM);
        // cornerstone.clearToolState(elementM, 'stack')
        cornerstone.displayImage(elementM, image);

        const stack = this.props.stackM;
        cornerstoneTools.addStackStateManager(elementM, ["stack", 'playClip']);
        cornerstoneTools.addToolState(elementM, "stack", stack);
        // cornerstoneTools.pan.activate(elementM, 1);
        cornerstoneTools.stackScroll.activate(elementM, 1);
        cornerstoneTools.stackScrollWheel.activate(elementM);
        // cornerstoneTools.stackPrefetch.enable(elementM, 3);
        // cornerstoneTools.zoom.activate(elementM, 3);
        cornerstoneTools.wwwc.activate(elementM, 4);
        // cornerstoneTools.dragProbe.activate(elementM, 2);
        // cornerstoneTools.dragProbeTouch.activate(elementM);
        cornerstoneTools.wwwcRegion.activate(elementM, 2);

        try{
          let temp = cornerstoneTools.getElementToolStateManager(elementM)
          if (temp.toolState.stack.data[0]){ //데이터가 존재하면 돌리던건 멈춘다
            if (isPlayed) cornerstoneTools.playClip(elementM, 5);
            else cornerstoneTools.stopClip(elementM, 5);
            // alert('새로운 데이터 회전->: playClip')
          }
        } catch(e){
          console.log('error')
        }

        this.wwwcsynchronizer.add(elementM);
        elementM.addEventListener("cornerstoneimagerendered",this.onImageRendered);
        elementM.addEventListener("cornerstonenewimage", this.onNewImage);
        window.addEventListener("resize", this.onWindowResize);
        // cornerstone.displayImage(elementA, image);
      } catch(e){
        console.error('FastSkip axialLoadImagePromise')
      }
    });
    Promise.all([coronalLoadImagePromise, sagittalLoadImagePromise, axialLoadImagePromise, mipLoadImagePromise]).then(() => {
      const { isCrosshaired, isPlayed } = this.props;
      const {ClayerId, SlayerId, AlayerId} = this.state;
      // const ClayerId = cornerstone.getLayers(elementC);
      // const SlayerId = cornerstone.getLayers(elementS);
      // const AlayerId = cornerstone.getLayers(elementA);
      // Add the enabled elements to the synchronization context
      try{
        cornerstoneTools.wwwcRegion.activate(elementC, 2);
        cornerstoneTools.wwwcRegion.activate(elementS, 2);
        cornerstoneTools.wwwcRegion.activate(elementA, 2);
        {isCrosshaired ? cornerstoneTools.referenceLines.tool.enable(elementC, this.synchronizer):cornerstoneTools.referenceLines.tool.disable(elementC)}
        {isCrosshaired ? cornerstoneTools.referenceLines.tool.enable(elementS, this.synchronizer):cornerstoneTools.referenceLines.tool.disable(elementS)}
        {isCrosshaired ? cornerstoneTools.referenceLines.tool.enable(elementA, this.synchronizer):cornerstoneTools.referenceLines.tool.disable(elementA)}
        this.synchronizer.add(elementC);
        this.synchronizer.add(elementS);
        this.synchronizer.add(elementA);
        cornerstoneTools.crosshairs.enable(elementC, 1, this.synchronizer);
        cornerstoneTools.crosshairs.enable(elementS, 1, this.synchronizer);
        cornerstoneTools.crosshairs.enable(elementA, 1, this.synchronizer);
        // cornerstone.setActiveLayer(elementC, ClayerId[0]);
        // cornerstone.setActiveLayer(elementS, SlayerId[0]);
        // cornerstone.setActiveLayer(elementA, AlayerId[0]);
        // let ClayerPET = cornerstone.getLayer(elementC, ClayerId[0]);
        // let ClayerPET = cornerstone.getLayer(elementC, ClayerId[0]);
        // let ClayerPET = cornerstone.getLayer(elementC, ClayerId[0]);
        // console.log(ClayerPET.image.imageId)
        // console.log(ClayerPET.image.imageId.split('/').slice(0,-1).join('/').concat('/', currentIndex[0].currentC))
        // ClayerPET.image.imageId=ClayerPET.image.imageId.split('/').slice(0,-1).join('/').concat('/', currentIndex[0].currentC)
        let ClayerMNI = cornerstone.getLayer(elementC, ClayerId[1]);
        ClayerMNI.options.opacity=this.props.opacityValue;
        let SlayerMNI = cornerstone.getLayer(elementS, SlayerId[1]);
        SlayerMNI.options.opacity=this.props.opacityValue;
        let AlayerMNI = cornerstone.getLayer(elementA, AlayerId[1]);
        AlayerMNI.options.opacity=this.props.opacityValue;

        //  colormap initializer
        const Clayers = cornerstone.getLayers(elementC);
        const Slayers = cornerstone.getLayers(elementS);
        const Alayers = cornerstone.getLayers(elementA);

        let layerPETC = cornerstone.getLayer(elementC, Clayers[0].layerId);
        layerPETC.viewport.colormap = selectedColormap;
        let layerPETS = cornerstone.getLayer(elementS, Slayers[0].layerId);
        layerPETS.viewport.colormap = selectedColormap;
        let layerPETA = cornerstone.getLayer(elementA, Alayers[0].layerId);
        layerPETA.viewport.colormap = selectedColormap;

        let viewportM = cornerstone.getViewport(elementM);
        viewportM.colormap = selectedColormap;
        cornerstone.setViewport(elementM, viewportM);
  

      } catch(e){
        console.error('FastSkip Promise',e)
      }
    });
  }

  controlViewport=()=>{
    const { isInverted, isCrosshaired } = this.props;
    const Celement = this.elementC;
    const Selement = this.elementS;
    const Aelement = this.elementA;
    if (isCrosshaired==false){
      cornerstoneTools.referenceLines.tool.disable(Celement);
      cornerstoneTools.referenceLines.tool.disable(Selement);
      cornerstoneTools.referenceLines.tool.disable(Aelement);
    }else{
      cornerstoneTools.referenceLines.tool.enable(Celement, this.synchronizer);
      cornerstoneTools.referenceLines.tool.enable(Selement, this.synchronizer);
      cornerstoneTools.referenceLines.tool.enable(Aelement, this.synchronizer);
    }
  }

  render() {
    const {ww, wc, in_suvr_max, in_suvr_min, out_suvr_max, out_suvr_min} = this.state;
    const { isInverted, isCrosshaired, selectedColormap, isSNed } = this.props;
    const divStyleC = {
      top:"0px",
      left:"100px",
      width:"612px",
      height:"425px",
      position: "absolute",
      color: "white",
    };
    const divStyleS = {
      top:"0px",
      left:"712px",
      width:"602px",
      height:"425px",
      position: "absolute",
      color: "white",
    };
    const divStyleA = {
      top:"390px",
      left:"100px",
      width:"612px",
      height:"603px",
      position: "absolute",
      color: "white",
    };
    const divStyleM = {
      top:"425px",
      left:"655px",
      width:"723px",
      height:"510px",
      position: "absolute",
      color: "white",
    };
    const divWrapper = {
      position:"relative",
      left:"74px",
      width:"1314px",
      height:"933px", 
      overflow:"hidden",
    };
    const viewportC = this.elementC && cornerstone.getViewport(this.elementC);

    const suvr_max = isSNed ? out_suvr_max:in_suvr_max;
    const suvr_min = Math.max(0, isSNed ? out_suvr_min:in_suvr_min);
    const widthSUVR = (viewportC !== undefined) ? ((ww/32767)*(suvr_max-suvr_min)):1;
    const centerSUVR = (viewportC !== undefined) ? ((wc/32767)*(suvr_max-suvr_min)):1;
    // console.log(this.state.ClayerId, this.state.SlayerId, this.state.AlayerId)
    return (
      <div style={divWrapper}>
        <div
          className="viewportElement mip"
          style={divStyleM}
          ref={input => {
            this.elementM = input;
          }}
          // onClick={(e)=>{
          // }}
        >
          <canvas className="cornerstone-canvas" onContextMenu={(e)=> {e.preventDefault()}}/>
        </div>
        <div
          className="viewportElement axial"
          style={divStyleA}
          ref={input => {
            this.elementA = input;
          }}
          // onClick={(e)=>{
          // }}
        >
          <canvas className="cornerstone-canvas" onContextMenu={(e)=> {e.preventDefault()}}/>
        </div>
        <div
          className="viewportElement coronal"
          style={divStyleC}
          ref={input => {
            this.elementC = input;
          }}
        >

          <canvas className="cornerstone-canvas" onContextMenu={(e)=> {e.preventDefault()}}/>
        </div>
        <div
          className="viewportElement sagittal"
          style={divStyleS}
          ref={input => {
            this.elementS = input;
          }}
        >
          <canvas className="cornerstone-canvas" onContextMenu={(e)=> {e.preventDefault()}}/>
        </div>
        {<div style={{position:"absolute",height:'0px', width:'42%', boxSizing:"border-box",left:"10%",top:"20%", color:'red', fontSize:'25px', display:'flex', justifyContent:'space-between', userSelect:'none', paddingLeft:'25px', paddingRight:'17px', border:'0px yellow solid'}}><div>{this.CoronalLeftSide}</div><div>{this.CoronalRightSide}</div></div>} {/* Coronal Plane  */}
        {<div style={{position:"absolute",height:'0px', width:'45%', boxSizing:"border-box",left:"53%",top:"20%", color:'red', fontSize:'25px', display:'flex', justifyContent:'space-between', userSelect:'none', paddingLeft:'60px', paddingRight:'0px', border:'0px green solid'}}><div>{this.SagittalLeftSide}</div><div>{this.SagittalRightSide}</div></div>} {/* Sagittal Plane this.AxialRightSide */}
        {<div style={{position:"absolute",height:'0px', width:'42%', boxSizing:"border-box",left:"10%",top:"67%", color:'red', fontSize:'25px', display:'flex', justifyContent:'space-between', userSelect:'none', paddingLeft:'25px', paddingRight:'17px', border:'0px red solid'}}><div>{this.AxialLeftSide}</div><div>{this.AxialRightSide}</div></div>} {/* Axial Plane this.AxialRightSide */}
        {<div style={{position:"absolute",height:'44%', width:'0px', boxSizing:"border-box",left:"30.35%",top:"1%", color:'red', fontSize:'25px', display:'flex', flexDirection:'column', justifyContent:'space-between', userSelect:'none', border:'0px yellow solid'}}><div>{this.CoronalUppderSide}</div><div>{this.CoronalUnderSide}</div></div>} {/* Axial Plane this.AxialRightSide */}
        {<div style={{position:"absolute",height:'44%', width:'0px', boxSizing:"border-box",left:"77%",top:"1%", color:'red', fontSize:'25px', display:'flex', flexDirection:'column', justifyContent:'space-between', userSelect:'none', border:'0px green solid'}}><div>{this.CoronalUppderSide}</div><div>{this.CoronalUnderSide}</div></div>} {/* Axial Plane this.AxialRightSide */}
        {<div style={{position:"absolute",height:'50%', width:'0px', boxSizing:"border-box",left:"30%",top:"47%", color:'red', fontSize:'25px', display:'flex', flexDirection:'column', justifyContent:'space-between', userSelect:'none', border:'0px red solid'}}><div>{this.SagittalRightSide}</div><div>{this.SagittalLeftSide}</div></div>}
        {/* 32767의 SUVR값 */}
        {(viewportC !== undefined) && <div style={{position:"absolute",top:"17%", left:"0%", color:'white', fontSize:"16px", userSelect:'none', border:"0px red solid"}}><div>SUVR</div><div>{isSNed ? out_suvr_max?.toFixed(2):in_suvr_max?.toFixed(2)}&nbsp;(max)</div></div>}
        {(viewportC !== undefined) && 
          <div class='colorbar1' >
            {/* 상단 배경*/}
            {selectedColormap === 'invertedGray' &&<div style={{boxSizing:'border-box', border:`1px ${false ? 'black':'black'} solid`, width: '30px', height:`${false ? (wc)/32768*100:100-(wc)/32768*100}%`, background:`${isInverted ? 'white':'black'}`}}></div>}
            {selectedColormap === 'gray' &&<div style={{boxSizing:'border-box', border:`1px ${false ? 'white':'white'} solid`, width: '30px', height:`${false ? (wc)/32768*100:100-(wc)/32768*100}%`, background:`${isInverted ? 'black':'white'}`}}></div>}
            {selectedColormap === 'hot' &&<div style={{boxSizing:'border-box', border:`1px ${false ? 'white':'black'} solid`, width: '30px', height:`${false ? (wc)/32768*100:100-(wc)/32768*100}%`, background:`${isInverted ? 'black':'white'}`}}></div>}
            {selectedColormap === 'jet' &&<div style={{boxSizing:'border-box', border:`1px ${false ? 'white':'white'} solid`, width: '30px', height:`${false ? (wc)/32768*100:100-(wc)/32768*100}%`, background:`${isInverted ? 'blue':'red'}`}}></div>}
            {/* 이미지 컬러맵 */}
            {selectedColormap === 'invertedGray' && <img style={{userDrag:'none', userSelect:'none', boxSizing:'border-box', borderTop:'1px white solid', borderBottom:'1px white solid', position:'absolute', width: '70px', top:`${100-(wc)/32768*100-(viewportC.voi.windowWidth/32768*50)}%`, height:`${viewportC.voi.windowWidth/32768*100}%` }} src={isInverted ? graycmap:invertedgraycmap}/>}
            {selectedColormap === 'gray' && <img style={{userDrag:'none', userSelect:'none', boxSizing:'border-box', borderTop:'1px white solid', borderBottom:'1px white solid', position:'absolute', width: '70px', top:`${100-(wc)/32768*100-(viewportC.voi.windowWidth/32768*50)}%`, height:`${viewportC.voi.windowWidth/32768*100}%` }} src={isInverted ? invertedgraycmap:graycmap}/>}
            {selectedColormap === 'hot' && <img style={{userDrag:'none', userSelect:'none', boxSizing:'border-box', borderTop:'1px white solid', borderBottom:'1px white solid', position:'absolute', width: '70px', top:`${100-(wc)/32768*100-(viewportC.voi.windowWidth/32768*50)}%`, height:`${viewportC.voi.windowWidth/32768*100}%` }} src={isInverted ? invertedhotcmap:hotcmap}/>}
            {selectedColormap === 'jet' && <img style={{userDrag:'none', userSelect:'none', boxSizing:'border-box', borderTop:'1px white solid', borderBottom:'1px white solid', position:'absolute', width: '70px', top:`${100-(wc)/32768*100-(viewportC.voi.windowWidth/32768*50)}%`, height:`${viewportC.voi.windowWidth/32768*100}%` }} src={isInverted ? invertedjetcmap:jetcmap}/>}
            {/* 상단 글자 */}
            <div style={{borderTop:"0px white solid", position:'absolute', width:'68px', top:`${false ? (wc)/32768*100-viewportC.voi.windowWidth/32768*50:100-(wc)/32768*100-viewportC.voi.windowWidth/32768*50}%`, height:`${viewportC.voi.windowWidth/32768*5}%`, fontSize:'12px'}}>{(centerSUVR+widthSUVR/2)?.toFixed(2)}</div>{/* <div style={{minHeight:'15px', borderTop:`${viewportC.voi.windowWidth/32768*10}px yellow solid`, position:'absolute', width:'68px', top:`${100-(viewportC.voi.windowCenter)/32768*100}%`, fontSize:'12px'}}>{(viewportC.voi.windowCenter/32767).toFixed(2)*)}</div> (out_suvr_max+out_suvr_min)/2*/}
            {/* 중심선과 중심글자 */}
            {(false) ? <div style={{minHeight:'15px', borderTop:`${viewportC.voi.windowWidth/32768*10}px yellow solid`, position:'absolute', width:'68px', top:`${(wc)/32768*100}%`, fontSize:'12px'}}>{centerSUVR?.toFixed(2)}</div>:<div style={{minHeight:'15px', borderTop:`${viewportC.voi.windowWidth/32768*10}px yellow solid`, position:'absolute', width:'68px', top:`${100-(wc)/32768*100}%`, fontSize:'12px'}}>{centerSUVR?.toFixed(2)}</div>}
            {/* 하단 글자 */}
            <div style={{borderBottom:"0px black solid", position:'absolute', width:'68px', top:`${false ? -4+(wc)/32768*100+viewportC.voi.windowWidth/32768*50:100-4-(wc)/32768*100+viewportC.voi.windowWidth/32768*50}%`, height:`${viewportC.voi.windowWidth/32768*5}%`, fontSize:'12px'}}>{(centerSUVR-widthSUVR/2)?.toFixed(2)}</div>
            {/* 하단배경 */}
            {selectedColormap === 'invertedGray' &&<div style={{boxSizing:'border-box', border:`1px ${false ? 'white':'black'} solid`, width: '30px', height:`${false ? 100-(wc)/32768*100:(wc)/32768*100}%`, background:`${isInverted ? 'black':'white'}`, display:'flex', flexDirection:'column-reverse'}}></div>}
            {selectedColormap === 'gray' &&<div style={{boxSizing:'border-box', border:`1px ${false ? 'black':'white'} solid`, width: '30px', height:`${false ? 100-(wc)/32768*100:(wc)/32768*100}%`, background:`${isInverted ? 'white':'black'}`, display:'flex', flexDirection:'column-reverse'}}></div>}
            {selectedColormap === 'hot' &&<div style={{boxSizing:'border-box', border:`1px ${false ? 'black':'white'} solid`, width: '30px', height:`${false ? 100-(wc)/32768*100:(wc)/32768*100}%`, background:`${isInverted ? 'white':'black'}`, display:'flex', flexDirection:'column-reverse'}}></div>}
            {selectedColormap === 'jet' &&<div style={{boxSizing:'border-box', border:`1px ${false ? 'white':'white'} solid`, width: '30px', height:`${false ? 100-(wc)/32768*100:(wc)/32768*100}%`, background:`${isInverted ? 'red':'blue'}`, display:'flex', flexDirection:'column-reverse'}}></div>}
          </div>
        }
        {(viewportC !== undefined) && <div style={{position:"absolute",top:"67.5%", left:"0%", color:'white', fontSize:"16px", userSelect:'none'}}>{isSNed ? Math.max(0,out_suvr_min)?.toFixed(2):Math.max(0,in_suvr_min)?.toFixed(2)}&nbsp;(min)</div>}

      </div>
    );
  }

  onWindowResize() {
    cornerstone.resize(this.elementC);
    cornerstone.resize(this.elementS);
    cornerstone.resize(this.elementA);
    cornerstone.resize(this.elementM);
  }
  onImageRendered(e) {
    // this.Crenderer_findImageFn()
    // let layer = cornerstone.getLayer(eventData.element, eventData.layerId);
    
    // console.log('onImageRendered', imageIds, targetImageId)
    // this.Crenderer_findImageFn(imageIds, targetImageId);

    const {ww, wc, in_suvr_max, in_suvr_min, out_suvr_max, out_suvr_min, ClayerId,SlayerId,AlayerId} = this.state;
    const {handleWindowChange, isSNed, isInverted} = this.props;
    try{
      // 이곳의 viewport를 열어서 min, max를 상위 component로 전달하고, 이곳의 state (ww, wc)를 바꿈
      let viewportC = cornerstone.getViewport(this.elementC);
      const newWW = viewportC.voi.windowWidth;
      const newWC = isInverted ? 32767-viewportC.voi.windowCenter:viewportC.voi.windowCenter;
      if (ww != newWW || wc != newWC){
        this.setState({
          ww: newWW,
          wc: newWC,
        })
        const newMax = newWC + newWW/2;
        const newMin = newWC - newWW/2;
        handleWindowChange(Math.floor(newMax), Math.floor(newMin));
      }
      

      const stackDataC = cornerstoneTools.getToolState(this.elementC, "stack");
      const stackDataS = cornerstoneTools.getToolState(this.elementS, "stack");
      const stackDataA = cornerstoneTools.getToolState(this.elementA, "stack");
      const stackDataM = cornerstoneTools.getToolState(this.elementM, "stack");
      const stackC = stackDataC.data[0];
      const stackS = stackDataS.data[0];
      const stackA = stackDataA.data[0];
      const stackM = stackDataM.data[0];
      // console.log("[C, S, A]: ",stackC.currentImageIdIndex, stackS.currentImageIdIndex, stackA.currentImageIdIndex)
      this.props.updateStack(this.props.stackManager.map(v=>
          {
            if (v.fileID==this.props.counter.fileID) 
              return {...v, currentC:stackC.currentImageIdIndex, currentS:stackS.currentImageIdIndex, currentA:stackA.currentImageIdIndex}
            else
              return {...v}
          }
        ))
    } catch (e){
      console.error('onImageRendered')
    }
  }

  onNewImage(e) {
    // console.log('onNewImage start')
    try{
      // const ClayerId = cornerstone.getLayers(this.elementC);
      // const ClayerId1 = cornerstone.getLayer(this.elementC, ClayerId[1].layerId);
      // console.dir(ClayerId1);
      // cornerstone.loadImage(this.props.MNIstackC.imageIds[50]).then(MNIimage => {
      //   // cornerstone.loadImage(this.props.MNIstackC.imageIds[currentIndex[0].currentC]).then(MNIimage => {
      //   cornerstone.displayImage(this.elementC, MNIimage);
      // })


      // const tempImageIds = this.props.MNIstackC.imageIds[50]
      // console.dir(ClayerId);
      // if (ClayerId1[1].image != undefined){
      //   console.log(ClayerId1[1].image);
      //   // cornerstone.setActiveLayer(elementC, ClayerId[1].layerId)
      //   // cornerstone.displayImage(this.elementC, tempImageIds);
      //   // cornerstone.setLayerImage(elementC, ClayerId[1].image, ClayerId[1].layerId)
      //   // cornerstone.updateImage(elementC);
      // }

    } catch(e){
      console.log('onNewImage error')
    }
    // try{
    //   let eventData = e.detail;
    //   const targetImageId = eventData.image.imageId;
    //   // let layer = cornerstone.getLayer(eventData, eventData.layerId);
    //   let Clayer = cornerstone.getLayers(this.elementC);
    //   let Cenabled1 = cornerstone.getEnabledElement(this.elementC);
    //   let Cenabled2 = cornerstone.getActiveLayer(this.elementC);
    // } catch(e){
    //   console.log('error')
    // }
  }
  // onKeyPress(e) {
  //   console.log("onKeyPress");
  //     var data = e.detail;
  //     var keyCode = data.keyCode;
  //     var keyName;
  //     var keys = {
  //         UP: 38,
  //         DOWN: 40
  //     };
  //     if (keyCode === keys.UP) {
  //         keyName = 'Up arrow';
  //     } else if (keyCode === keys.DOWN) {
  //         keyName = 'Down arrow';
  //     } else {
  //         keyName = String.fromCharCode(keyCode);
  //     }
  // }


  onALayerAdded (e) {
    const {AlayerId} = this.state;
    let eventData = e.detail;
    let layer = cornerstone.getLayer(eventData.element, eventData.layerId);
    this.setState({
        AlayerId: [...AlayerId, layer.layerId],
    })
  }
  onCLayerAdded (e) {
      const {ClayerId} = this.state;
      let eventData = e.detail;
      let layer = cornerstone.getLayer(eventData.element, eventData.layerId);
      this.setState({
          ClayerId: [...ClayerId, layer.layerId],
      })
  }
  onSLayerAdded (e) {
      const {SlayerId} = this.state;
      let eventData = e.detail;
      let layer = cornerstone.getLayer(eventData.element, eventData.layerId);
      this.setState({
          SlayerId: [...SlayerId, layer.layerId],
      })
  }

  Crenderer_findImageFn = function(imageIds, targetImageId) {
      // console.log(typeof(imageIds), typeof(targetImageId))
      var minDistance = 1;
      var targetImagePlane = cornerstone.metaData.get('imagePlaneModule', targetImageId);
      var imagePositionX = targetImagePlane.imagePositionPatient[0];
      var imagePositionY = targetImagePlane.imagePositionPatient[1];
      var imagePositionZ = targetImagePlane.imagePositionPatient[2];
      // console.log("Coronal (X,Y,Z): ", imagePositionX, imagePositionY, imagePositionZ)

      var closest;
      imageIds.forEach(function(imageId) {
          var imagePlane = cornerstone.metaData.get('imagePlaneModule', imageId);
          var imgPosX = imagePlane.imagePositionPatient[0];
          var distance = Math.abs(imgPosX - imagePositionX);
          if (distance < minDistance) {
              minDistance = distance;
              closest = imageId;
          }
      });

      return closest;
  };
  Srenderer_findImageFn = function(imageIds, targetImageId) {
      var minDistance = 1;
      var targetImagePlane = cornerstone.metaData.get('imagePlaneModule', targetImageId);
      var imagePositionX = targetImagePlane.imagePositionPatient[0];
      var imagePositionY = targetImagePlane.imagePositionPatient[1];
      var imagePositionZ = targetImagePlane.imagePositionPatient[2];
      // console.log("Sagittal (X,Y,Z): ", imagePositionX, imagePositionY, imagePositionZ)

      var closest;
      imageIds.forEach(function(imageId) {
          var imagePlane = cornerstone.metaData.get('imagePlaneModule', imageId);
          var imgPosY = imagePlane.imagePositionPatient[1];
          var distance = Math.abs(imgPosY - imagePositionY);
          if (distance < minDistance) {
              minDistance = distance;
              closest = imageId;
          }
      });

      return closest;
  };
  Arenderer_findImageFn = function(imageIds, targetImageId) {
      var minDistance = 1;
      var targetImagePlane = cornerstone.metaData.get('imagePlaneModule', targetImageId);
      var imagePositionX = targetImagePlane.imagePositionPatient[0];
      var imagePositionY = targetImagePlane.imagePositionPatient[1];
      var imagePositionZ = targetImagePlane.imagePositionPatient[2];
      // console.log("Axial (X,Y,Z): ", imagePositionX, imagePositionY, imagePositionZ)

      var closest;
      imageIds.forEach(function(imageId) {
          var imagePlane = cornerstone.metaData.get('imagePlaneModule', imageId);
          var imgPosZ = imagePlane.imagePositionPatient[2];
          var distance = Math.abs(imgPosZ - imagePositionZ);
          if (distance < minDistance) {
              minDistance = distance;
              closest = imageId;
          }
      });

      return closest;
  };

}

const mapStateToProps = (state) => ({
  counter:state.counter,
  isLogged:state.isLogged,
  stackManager:state.stackManager,
  sliceList: state.sliceList,
});

const mapDispatchToProps = (dispatch) => ({
  increment: () => dispatch(actions.increment()),
  decrement: () => dispatch(actions.decrement()),
  addStack: (Stack)=> dispatch(actions.addStack(Stack)),
  updateStack: (Stack)=> dispatch(actions.updateStack(Stack)),
  removeStack: (Stack)=> dispatch(actions.removeStack(Stack)),
  login: () => dispatch(actions.login()),
  logout: () => dispatch(actions.logout()),
});
export default connect(mapStateToProps, mapDispatchToProps)(ImageViewer);