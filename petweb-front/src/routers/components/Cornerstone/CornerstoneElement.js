import React from "react";
import "./CornerstoneElement.css"
import * as cornerstone from "cornerstone-core";
import * as cornerstoneMath from "cornerstone-math";
import * as cornerstoneTools from "cornerstone-tools";
import Hammer from "hammerjs";
import * as cornerstoneWebImageLoader from "cornerstone-web-image-loader";

cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
cornerstoneWebImageLoader.external.cornerstone = cornerstone;
cornerstoneTools.external.Hammer = Hammer;


export default class CornerstoneElement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Aviewport: cornerstone.getDefaultViewport(null, undefined),
            Cviewport: cornerstone.getDefaultViewport(null, undefined),
            Sviewport: cornerstone.getDefaultViewport(null, undefined),
            Tviewport: cornerstone.getDefaultViewport(null, undefined),

            petAStack: props.petAStack,
            AlayerId: [],

            petCStack: props.petCStack,
            ClayerId: [],

            petSStack: props.petSStack,
            SlayerId: [],

        };

        this.onImageRendered = this.onImageRendered.bind(this);
        this.onNewImage = this.onNewImage.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
        this.onALayerAdded = this.onALayerAdded.bind(this);
        this.onCLayerAdded = this.onCLayerAdded.bind(this);
        this.onSLayerAdded = this.onSLayerAdded.bind(this);
        // this.initializeVieport = this.initializeVieport.bind(this);
        this.temp_initializeVieport = this.temp_initializeVieport.bind(this);
        this.controlViewport = this.controlViewport.bind(this);
        this.renderer_findImageFn = this.renderer_findImageFn.bind(this);

        this.renderer = new cornerstoneTools.stackRenderers.FusionRenderer();
        this.Arenderer = new cornerstoneTools.stackRenderers.FusionRenderer();
        this.Crenderer = new cornerstoneTools.stackRenderers.FusionRenderer();
        this.Srenderer = new cornerstoneTools.stackRenderers.FusionRenderer();
        this.synchronizer = new cornerstoneTools.Synchronizer("cornerstonenewimage", cornerstoneTools.updateImageSynchronizer);
        this.wwwcsynchronizer = new cornerstoneTools.Synchronizer("cornerstoneimagerendered", cornerstoneTools.wwwcSynchronizer);
    }

    componentDidMount() {
        const Aelement = this.Aelement;
        const Celement = this.Celement;
        const Selement = this.Selement;
        const Telement = this.Telement;
        const { Astack, Cstack, Sstack, Tstack, AimageId, CimageId, SimageId, TimageId} = this.state;
        // this.initializeVieport();
        cornerstone.enable(Aelement);
        cornerstone.enable(Celement);
        cornerstone.enable(Selement);
        cornerstone.enable(Telement);
    }

    componentDidUpdate(prevProps, prevState) {
        // console.dir(this.synchronizer);
        if (prevState !== this.state) {
            // console.log("State changed");
            // console.log("[0]: ", this.state.stack.currentImageIdIndex);
        }
        if (prevProps !== this.props) {
            // console.log("props changed");
            // console.log(this.state.petAStack)
        }
        if (prevProps.ready !== this.props.ready) {
            // console.log("initialization");
            this.temp_initializeVieport();
        } else {
            if (this.props.ready === true){
                // console.log("updateViewport");
                if (this.state.AlayerId.length === 2 && this.state.ClayerId.length === 2 && this.state.ClayerId.length === 2) {
                    // console.log("right after temp_initializeVieport: ", this.state.AlayerId);
                    try {
                        cornerstone.setActiveLayer(this.Aelement, this.state.AlayerId[1]);
                        // cornerstone.updateImage(this.Aelement);
                        cornerstone.setActiveLayer(this.Celement, this.state.ClayerId[1]);
                        // cornerstone.updateImage(this.Celement);
                        cornerstone.setActiveLayer(this.Selement, this.state.SlayerId[1]);
                        // cornerstone.updateImage(this.Selement);
                    } catch (e){
                        console.error("setActiveLayer Logic is not proper")
                    }
                }
                if (prevProps !== this.props) {
                    this.controlViewport();
                }
            }
        }
    }

    render() {
        const {AimageId, CimageId, SimageId, TimageId} = this.state;
        // console.log(this.state.AlayerId);
        // var imagePlane = cornerstone.metaData.get('imagePlaneModule', imageId);
        // var imgPosZ = imagePlane.imagePositionPatient[2];
        return (
            <div className={`Cornerstone-Wrapper ${(this.props.ctrl.caseID === null) ? "":""}`}>
                <div
                  className="divStyle"
                  // style={divStyle}
                  ref={input => {
                      this.Aelement = input;
                  }}
                >
                    <canvas className="cornerstone-canvas" style={{width:"50"}}/>
                    <div className="topLeftStyle">ID: {(this.state.Aviewport !== undefined) && AimageId}</div>
                    <div className="bottomLeftStyle">Zoom: {(this.state.Aviewport !== undefined) && this.state.Aviewport.scale}</div>
                    <div className="bottomRightStyle">
                        WW/WC: {(this.state.Aviewport !== undefined) && this.state.Aviewport.voi.windowWidth} /{" "}
                        {(this.state.Aviewport !== undefined) && this.state.Aviewport.voi.windowCenter}
                    </div>
                </div>
                <div
                  className="CStyle"
                  // style={CStyle}
                  ref={input => {
                      this.Celement = input;
                  }}
                >
                    <canvas className="cornerstone-canvas" />
                    <div className="topLeftStyle">ID: {(this.state.Cviewport !== undefined) && CimageId}</div>
                    <div className="bottomLeftStyle">Zoom: {(this.state.Cviewport !== undefined) && this.state.Cviewport.scale}</div>
                    <div className="bottomRightStyle">
                        WW/WC: {(this.state.Cviewport !== undefined) && this.state.Cviewport.voi.windowWidth} /{" "}
                        {(this.state.Cviewport !== undefined) && this.state.Cviewport.voi.windowCenter}
                    </div>
                </div>
                <div
                  className="SStyle"
                  // style={SStyle}
                  ref={input => {
                      this.Selement = input;
                  }}
                >
                    <canvas className="cornerstone-canvas" />
                    <div className="topLeftStyle">ID: {(this.state.Sviewport !== undefined) && SimageId}</div>
                    <div className="bottomLeftStyle">Zoom: {(this.state.Sviewport !== undefined) && this.state.Sviewport.scale}</div>
                    <div className="bottomRightStyle">
                        WW/WC: {(this.state.Sviewport !== undefined) && this.state.Sviewport.voi.windowWidth} /{" "}
                        {(this.state.Sviewport !== undefined) && this.state.Sviewport.voi.windowCenter}
                    </div>
                </div>
                <div
                  className="SStyle"
                  // style={SStyle}
                  ref={input => {
                      this.Telement = input;
                  }}
                >
                    <canvas className="cornerstone-canvas" />
                    <div className="topLeftStyle">
                        <div>Study ID: {this.props.petAStack.studyID}</div>
                        <div>Patient Name: {this.props.petAStack.patient}</div>
                        <div>Scan Date: 2019.03.17</div>
                        <br/>
                        <div>rows: {this.props.petAStack.rows}</div>
                        <div>columns: {this.props.petAStack.columns}</div>
                        <div>rowCosines: {this.props.petAStack.rowCosines}</div>
                        <div>columnCosines: {this.props.petAStack.columnCosines}</div>
                        <div>rowPixelSpacing: {this.props.petAStack.rowPixelSpacing}</div>
                        <div>columnPixelSpacing: {this.props.petAStack.columnPixelSpacing}</div>
                        {/*StudyID: {(this.state.Tviewport.)}*/}
                    </div>
                    {/*<div className="bottomLeftStyle">Zoom: {(this.state.Tviewport !== undefined) && this.state.Tviewport.scale}</div>*/}
                    {/*<div className="bottomRightStyle">*/}
                    {/*    WW/WC: {(this.state.Tviewport !== undefined) && this.state.Tviewport.voi.windowWidth} /{" "}*/}
                    {/*    {(this.state.Tviewport !== undefined) && this.state.Tviewport.voi.windowCenter}*/}
                    {/*</div>*/}
                </div>
            </div>
        );
    }



    temp_initializeVieport() {
        const {petAStack, petCStack, petSStack, brainAStack, brainCStack, brainSStack} = this.props;
        const Aelement = this.Aelement;
        const Celement = this.Celement;
        const Selement = this.Selement;
        const Telement = this.Telement;
        // cornerstone.enable(Aelement);
        // cornerstone.enable(Celement);
        // cornerstone.enable(Selement);
        // cornerstone.enable(Telement);
        // const {mriStack, petAStack, petCStack, petSStack, layerId} = this.state;
        // this.renderer.findImageFn = this.renderer_findImageFn;
        this.Arenderer.findImageFn = this.renderer_findImageFn;
        this.Crenderer.findImageFn = this.renderer_findImageFn;
        this.Srenderer.findImageFn = this.renderer_findImageFn;

        // Create a stack from the image object array

        cornerstone.loadImage(brainAStack.imageIds[brainAStack.currentImageIdIndex]).then(image => {
            cornerstone.displayImage(Aelement, image);

            cornerstoneTools.addStackStateManager(Aelement, ['stack']);
            cornerstoneTools.addToolState(Aelement, 'stack', brainAStack);
            cornerstoneTools.addToolState(Aelement, 'stack', petAStack);
            cornerstoneTools.addToolState(Aelement, 'stackRenderer', this.Arenderer);

            this.Arenderer.render(Aelement);

            cornerstoneTools.mouseInput.enable(Aelement);
            cornerstoneTools.mouseWheelInput.enable(Aelement);
            cornerstoneTools.wwwc.activate(Aelement, 1);
            // cornerstoneTools.pan.activate(Aelement, 2);
            cornerstoneTools.zoom.activate(Aelement, 2);
            cornerstoneTools.wwwcRegion.activate(Aelement, 4);
            cornerstoneTools.stackScrollWheel.activate(Aelement);
            cornerstoneTools.scrollIndicator.enable(Aelement);

            this.synchronizer.add(Aelement);
            this.wwwcsynchronizer.add(Aelement);
            Aelement.addEventListener("cornerstonelayeradded", this.onALayerAdded);
            Aelement.addEventListener("cornerstonenewimage", this.onNewImage);
            Aelement.addEventListener("cornerstoneimagerendered",this.onImageRendered);
            // window.addEventListener("resize", this.onWindowResize);
            // cornerstone.setActiveLayer(Aelement, this.state.AlayerId[1]);
            // cornerstone.setActiveLayer(Aelement, this.state.AlayerId[1]);
            // cornerstone.updateImage(Aelement);
        });
        // cornerstone.setActiveLayer(Aelement, layerId[0]);

        // Create a stack from the image object array
        cornerstone.loadImage(brainCStack.imageIds[brainCStack.currentImageIdIndex]).then(image => {
            cornerstone.displayImage(Celement, image);

            cornerstoneTools.addStackStateManager(Celement, ['stack']);
            cornerstoneTools.addToolState(Celement, 'stack', brainCStack);
            cornerstoneTools.addToolState(Celement, 'stack', petCStack);
            cornerstoneTools.addToolState(Celement, 'stackRenderer', this.Crenderer);

            this.Crenderer.render(Celement);

            cornerstoneTools.mouseInput.enable(Celement);
            cornerstoneTools.mouseWheelInput.enable(Celement);
            cornerstoneTools.wwwc.activate(Celement, 1);
            // cornerstoneTools.pan.activate(Celement, 2);
            cornerstoneTools.zoom.activate(Celement, 2);
            cornerstoneTools.wwwcRegion.activate(Celement, 4);
            cornerstoneTools.stackScrollWheel.activate(Celement);
            cornerstoneTools.scrollIndicator.enable(Celement);

            this.synchronizer.add(Celement);
            this.wwwcsynchronizer.add(Celement);
            Celement.addEventListener("cornerstonelayeradded", this.onCLayerAdded);
            Celement.addEventListener("cornerstonenewimage", this.onNewImage);
            Celement.addEventListener("cornerstoneimagerendered",this.onImageRendered);
            // window.addEventListener("resize", this.onWindowResize);
        });
        // Create a stack from the image object array
        cornerstone.loadImage(brainSStack.imageIds[brainSStack.currentImageIdIndex]).then(image => {
            cornerstone.displayImage(Selement, image);

            cornerstoneTools.addStackStateManager(Selement, ['stack']);
            cornerstoneTools.addToolState(Selement, 'stack', brainSStack);
            cornerstoneTools.addToolState(Selement, 'stack', petSStack);
            cornerstoneTools.addToolState(Selement, 'stackRenderer', this.Srenderer);

            this.Srenderer.render(Selement);

            cornerstoneTools.mouseInput.enable(Selement);
            cornerstoneTools.mouseWheelInput.enable(Selement);
            cornerstoneTools.wwwc.activate(Selement, 1);
            // cornerstoneTools.pan.activate(Selement, 2);
            cornerstoneTools.zoom.activate(Selement, 2);
            cornerstoneTools.wwwcRegion.activate(Selement, 4);
            cornerstoneTools.stackScrollWheel.activate(Selement);
            cornerstoneTools.scrollIndicator.enable(Selement);

            this.synchronizer.add(Selement);
            this.wwwcsynchronizer.add(Selement);
            Selement.addEventListener("cornerstonelayeradded", this.onSLayerAdded);
            Selement.addEventListener("cornerstonenewimage", this.onNewImage);
            Selement.addEventListener("cornerstoneimagerendered",this.onImageRendered);
            // window.addEventListener("resize", this.onWindowResize);
        });
        window.addEventListener("resize", this.onWindowResize);
    }

    controlViewport(){
        // console.log(this.state.AlayerId);

        const Aelement = this.Aelement;
        const Celement = this.Celement;
        const Selement = this.Selement;
        const {AlayerId, ClayerId, SlayerId} = this.state

        // console.log("controlVieport()")

        let AlayerPET = cornerstone.getLayer(Aelement, AlayerId[1]);
        AlayerPET.options.opacity=this.props.ctrl.opacityValue/10;
        let ClayerPET = cornerstone.getLayer(Celement, ClayerId[1]);
        ClayerPET.options.opacity=this.props.ctrl.opacityValue/10;
        let SlayerPET = cornerstone.getLayer(Selement, SlayerId[1]);
        SlayerPET.options.opacity=this.props.ctrl.opacityValue/10;

        // const Telement = this.Telement;
        // element (axial)
        {(this.props.ctrl.Radio1 === 0) ? cornerstoneTools.pan.activate(Aelement, 1):cornerstoneTools.pan.deactivate(Aelement, 1)};
        {(this.props.ctrl.Radio1 === 1) ? cornerstoneTools.wwwc.activate(Aelement, 1):cornerstoneTools.wwwc.deactivate(Aelement, 1)};
        if (this.props.ctrl.Switch.INV === true) {
            let viewport = cornerstone.getViewport(Aelement);
            console.dir("invert: ", viewport)
            viewport.invert=true;
            cornerstone.setViewport(Aelement, viewport);
        } else {
            let viewport = cornerstone.getViewport(Aelement);
            viewport.invert=false;
            cornerstone.setViewport(Aelement, viewport);
        };
        {(this.props.ctrl.Switch.MAG === true) ? cornerstoneTools.magnify.activate(Aelement, 1):cornerstoneTools.magnify.deactivate(Aelement, 1)};
        if (this.props.ctrl.Switch.FLIP === true) {
            let viewport = cornerstone.getViewport(Aelement);
            viewport.hflip = true;
            viewport.colorInterpolation = true;
            cornerstone.setViewport(Aelement, viewport);
        } else {
            let viewport = cornerstone.getViewport(Aelement);
            viewport.hflip = false;
            cornerstone.setViewport(Aelement, viewport);
        }
        if (this.props.ctrl.Switch.CLR === true) {
            // console.log(AlayerId)
            let layerPET = cornerstone.getLayer(Aelement, AlayerId[1]);
            layerPET.viewport.colormap = "jet";
            // cornerstone.setActiveLayer(Aelement, AlayerId[0]);
            cornerstone.updateImage(Aelement);
        } else {
            // console.log(AlayerId)
            let layerPET = cornerstone.getLayer(Aelement, AlayerId[1]);
            layerPET.viewport.colormap = "hot";
            // cornerstone.setActiveLayer(Aelement, AlayerId[0]);
            cornerstone.updateImage(Aelement);
        }

        // Celement (coronal)
        {(this.props.ctrl.Radio1 === 0) ? cornerstoneTools.pan.activate(Celement, 1):cornerstoneTools.pan.deactivate(Celement, 1)};
        {(this.props.ctrl.Radio1 === 1) ? cornerstoneTools.wwwc.activate(Celement, 1):cornerstoneTools.wwwc.deactivate(Celement, 1)};
        if (this.props.ctrl.Switch.INV === true) {
            let Cviewport = cornerstone.getViewport(Celement);
            Cviewport.invert=true;
            cornerstone.setViewport(Celement, Cviewport);
        } else {
            let Cviewport = cornerstone.getViewport(Celement);
            Cviewport.invert=false;
            cornerstone.setViewport(Celement, Cviewport);
        };
        {(this.props.ctrl.Switch.MAG === true) ? cornerstoneTools.magnify.activate(Celement, 1):cornerstoneTools.magnify.deactivate(Celement, 1)};
        if (this.props.ctrl.Switch.FLIP === true) {
            let Cviewport = cornerstone.getViewport(Celement);
            Cviewport.hflip = true;
            // Cviewport.in
            // Cviewport.pixelReplication = true;
            // Cviewport.colormap = "jet";
            cornerstone.setViewport(Celement, Cviewport);
        } else {
            let Cviewport = cornerstone.getViewport(Celement);
            Cviewport.hflip = false;
            Cviewport.pixelReplication = false;
            cornerstone.setViewport(Celement, Cviewport);
        }
        if (this.props.ctrl.Switch.CLR === true) {
            let layerPET = cornerstone.getLayer(Celement, ClayerId[1]);
            layerPET.viewport.colormap = "jet";
            // cornerstone.setActiveLayer(Aelement, ClayerId[0]);
            cornerstone.updateImage(Celement);
        } else {
            // console.log(ClayerId)
            let layerPET = cornerstone.getLayer(Celement, ClayerId[1]);
            layerPET.viewport.colormap = "hot";
            // cornerstone.setActiveLayer(Celement, ClayerId[0]);
            cornerstone.updateImage(Celement);
        }

        // Selement (sagittal)
        {(this.props.ctrl.Radio1 === 0) ? cornerstoneTools.pan.activate(Selement, 1):cornerstoneTools.pan.deactivate(Selement, 1)};
        {(this.props.ctrl.Radio1 === 1) ? cornerstoneTools.wwwc.activate(Selement, 1):cornerstoneTools.wwwc.deactivate(Selement, 1)};
        if (this.props.ctrl.Switch.INV === true) {
            let Sviewport = cornerstone.getViewport(Selement);
            Sviewport.invert=true;
            cornerstone.setViewport(Selement, Sviewport);
        } else {
            let Sviewport = cornerstone.getViewport(Selement);
            Sviewport.invert=false;
            cornerstone.setViewport(Selement, Sviewport);
        };
        {(this.props.ctrl.Switch.MAG === true) ? cornerstoneTools.magnify.activate(Selement, 1):cornerstoneTools.magnify.deactivate(Selement, 1)};
        if (this.props.ctrl.Switch.FLIP === true) {
            let Sviewport = cornerstone.getViewport(Selement);
            Sviewport.hflip = true;
            cornerstone.setViewport(Selement, Sviewport);
        } else {
            let Sviewport = cornerstone.getViewport(Selement);
            Sviewport.hflip = false;
            cornerstone.setViewport(Selement, Sviewport);
        }
        if (this.props.ctrl.Switch.CLR === true) {
            let layerPET = cornerstone.getLayer(Selement, SlayerId[1]);
            layerPET.viewport.colormap = "jet";
            // cornerstone.setActiveLayer(Aelement, ClayerId[0]);
            cornerstone.updateImage(Selement);
        } else {
            // console.log(ClayerId)
            let layerPET = cornerstone.getLayer(Selement, SlayerId[1]);
            layerPET.viewport.colormap = "hot";
            // cornerstone.setActiveLayer(Celement, ClayerId[0]);
            cornerstone.updateImage(Selement);
        }
    }

    renderer_findImageFn = function(imageIds, targetImageId) {
        var minDistance = 1;
        var targetImagePlane = cornerstone.metaData.get('imagePlaneModule', targetImageId);
        // console.log("imagePositionPatient: ", targetImagePlane)
        var imagePositionZ = targetImagePlane.imagePositionPatient[2];

        var closest;
        // console.log(targetImageId);
        // console.log(imageIds, targetImageId)
        imageIds.forEach(function(imageId) {
            var imagePlane = cornerstone.metaData.get('imagePlaneModule', imageId);
            //frameOfReferenceUID
            // console.log(imageId)
            // console.log(imagePlane.frameOfReferenceUID)
            var imgPosZ = imagePlane.imagePositionPatient[2];
            var distance = Math.abs(imgPosZ - imagePositionZ);
            if (distance < minDistance) {
                minDistance = distance;
                // console.log("renderer distance: ", imageId)
                closest = imageId;
            }
        });

        return closest;
    };
    onALayerAdded (e) {
        const {AlayerId} = this.state;
        let eventData = e.detail;
        // console.log("e: ", e)
        // console.log("eventData: ", eventData)
        // console.log("viewportIdentifier: ", eventData.image.imageId)
        let layer = cornerstone.getLayer(eventData.element, eventData.layerId);
        // console.log('onLayerAdded', layer);
        // console.log(typeof layerId);
        this.setState({
            // AlayerId: [layer.layerId, ...AlayerId],
            AlayerId: [...AlayerId, layer.layerId],
        })
        // console.log("layerId:", layerId);
    }
    onCLayerAdded (e) {
        const {ClayerId} = this.state;
        let eventData = e.detail;
        // console.log("e: ", e)
        // console.log("eventData: ", eventData)
        // console.log("viewportIdentifier: ", eventData.image.imageId)
        let layer = cornerstone.getLayer(eventData.element, eventData.layerId);
        // console.log('onLayerAdded', eventData);
        // console.log(typeof layerId);
        this.setState({
            // ClayerId: [layer.layerId, ...ClayerId],
            ClayerId: [...ClayerId, layer.layerId],
        })
        // console.log("layerId:", layerId);
    }
    onSLayerAdded (e) {
        const {SlayerId} = this.state;
        let eventData = e.detail;
        // console.log("e: ", e)
        // console.log("eventData: ", eventData)
        // console.log("viewportIdentifier: ", eventData.image.imageId)
        let layer = cornerstone.getLayer(eventData.element, eventData.layerId);
        // console.log('onLayerAdded', eventData);
        // console.log(typeof layerId);
        this.setState({
            // SlayerId: [layer.layerId, ...SlayerId],
            SlayerId: [...SlayerId, layer.layerId],
        })
        // console.log("layerId:", layerId);
    }
    onWindowResize() {
        console.log("onWindowResize");
        cornerstone.resize(this.Aelement);
        cornerstone.resize(this.Celement);
        cornerstone.resize(this.Selement);
        cornerstone.resize(this.Telement);
    }

    onImageRendered() {
        const Aviewport = cornerstone.getViewport(this.Aelement);
        const Cviewport = cornerstone.getViewport(this.Celement);
        const Sviewport = cornerstone.getViewport(this.Selement);
        const Tviewport = cornerstone.getViewport(this.Telement);
        const AenabledElement = cornerstone.getEnabledElement(this.Aelement);
        const CenabledElement = cornerstone.getEnabledElement(this.Celement);
        const SenabledElement = cornerstone.getEnabledElement(this.Selement);
        const TenabledElement = cornerstone.getEnabledElement(this.Telement);
        let A_split = AenabledElement.image.imageId.split('/')
        let C_split = CenabledElement.image.imageId.split('/')
        let S_split = SenabledElement.image.imageId.split('/')
        // let AID = A_split[A_split.length-1]
        // let CID = C_split[C_split.length-1]
        // let SID = S_split[S_split.length-1]
        // console.log("image rendered: ", AID, CID, SID);
        this.props.indexUpdate(A_split.slice(2,5), C_split.slice(2,5), S_split.slice(2,5));

        if (AenabledElement.image!==undefined && CenabledElement.image!==undefined && SenabledElement.image!==undefined ){
            this.setState({
                Aviewport,
                Cviewport,
                Sviewport,

                AimageId: AenabledElement.image.imageId,
                CimageId: CenabledElement.image.imageId,
                SimageId: SenabledElement.image.imageId,
            });
        }

    }

    onNewImage(e) {
        const AenabledElement = cornerstone.getEnabledElement(this.Aelement);
        const CenabledElement = cornerstone.getEnabledElement(this.Celement);
        const SenabledElement = cornerstone.getEnabledElement(this.Selement);
        const TenabledElement = cornerstone.getEnabledElement(this.Telement);

        if (AenabledElement.image!==undefined && CenabledElement.image!==undefined && SenabledElement.image!==undefined ){
            // console.log("getEnabledElement:", SenabledElement.image.imageId)
            this.setState({
                AimageId: AenabledElement.image.imageId,
                CimageId: CenabledElement.image.imageId,
                SimageId: SenabledElement.image.imageId,
            });
        }
    }
    componentWillUnmount() {
        const Aelement = this.Aelement;
        Aelement.removeEventListener(
            "cornerstoneimagerendered",
            this.onImageRendered
        );

        Aelement.removeEventListener("cornerstonenewimage", this.onNewImage);

        window.removeEventListener("resize", this.onWindowResize);

        cornerstone.disable(Aelement);


        const Celement = this.Celement;
        Celement.removeEventListener(
          "cornerstoneimagerendered",
          this.onImageRendered
        );

        Celement.removeEventListener("cornerstonenewimage", this.onNewImage);

        window.removeEventListener("resize", this.onWindowResize);

        cornerstone.disable(Celement);


        const Selement = this.Celement;
        Selement.removeEventListener(
          "cornerstoneimagerendered",
          this.onImageRendered
        );

        Selement.removeEventListener("cornerstonenewimage", this.onNewImage);

        window.removeEventListener("resize", this.onWindowResize);

        cornerstone.disable(Selement);

        const Telement = this.Telement;
        Telement.removeEventListener(
          "cornerstoneimagerendered",
          this.onImageRendered
        );

        Telement.removeEventListener("cornerstonenewimage", this.onNewImage);

        window.removeEventListener("resize", this.onWindowResize);

        cornerstone.disable(Telement);
    }

}

