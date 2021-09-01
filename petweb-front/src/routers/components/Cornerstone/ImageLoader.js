import React, { Component } from 'react'
import './Home.css';
// import Icons from 'icons'
import { Link } from 'react-router-dom';
import CornerstoneElement from './CornerstoneElement';
import * as services from '../../../services/fetchApi'

import * as cornerstone from "cornerstone-core";
import * as cornerstoneMath from "cornerstone-math";
import * as cornerstoneTools from "cornerstone-tools";
import Hammer from "hammerjs";
import * as cornerstoneWebImageLoader from "cornerstone-web-image-loader";

cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
cornerstoneWebImageLoader.external.cornerstone = cornerstone;
cornerstoneTools.external.Hammer = Hammer;

export default class ImageLoader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      inputB64: [],
      mriB64: [],
      outputB64: [],

      AinputB64: [],
      CinputB64: [],
      SinputB64: [],
      AoutputB64: [],
      CoutputB64: [],
      SoutputB64: [],
      AIbrainB64: [],
      CIbrainB64: [],
      SIbrainB64: [],
      AbrainB64: [],
      CbrainB64: [],
      SbrainB64: [],

      petIAStack: {
        patient: "anonymous",
        studyID:  "1.3.6.1.4.1.5962.99.1.2237260787.1662717184.1234892907507.1411.0",

        rows: 91,
        columns: 91,
        rowCosines: [1, 0, 0],
        columnCosines: [0, 1, 0],
        imagePositionPatient: [-250, -250, -399],
        rowPixelSpacing: 2,
        columnPixelSpacing: 2,

        imageIds: [...Array(91).keys()].map((v,i)=>("pet://input/axial/"+i)),
        currentImageIdIndex: 45,
        options: {
          opacity: 1,
          visible: true,
          viewport: {
            colormap: 'hot',
          },
          name: 'PET'
        }
      },
      AIlayerId: [],

      petICStack: {
        patient: "anonymous",
        studyID:  "1.3.6.1.4.1.5962.99.1.2237260787.1662717184.1234892907507.1411.0",
        imageIds: [...Array(109).keys()].map((v,i)=>("pet://input/coronal/"+i)),
        currentImageIdIndex: 45,
        options: {
          opacity: 1,
          visible: true,
          viewport: {
            colormap: 'hot',
          },
          name: 'PET'
        }
      },
      IClayerId: [],

      petISStack: {
        patient: "anonymous",
        studyID:  "1.3.6.1.4.1.5962.99.1.2237260787.1662717184.1234892907507.1411.0",
        imageIds: [...Array(91).keys()].map((v,i)=>("pet://input/sagittal/"+i)),
        currentImageIdIndex: 45,
        options: {
          opacity: 1,
          visible: true,
          viewport: {
            colormap: 'hot',
          },
          name: 'PET'
        }
      },
      ISlayerId: [],

      brainIAStack: {
        imageIds: [...Array(91).keys()].map((v,i)=>("brain://input/axial/"+i)),
        currentImageIdIndex: 45,
        options: {
          opacity: 1,
          visible: true,
          name: 'CT'
        }
      },

      brainICStack: {
        imageIds: [...Array(109).keys()].map((v,i)=>("brain://input/coronal/"+i)),
        currentImageIdIndex: 45,
        options: {
          opacity: 1,
          visible: true,
          name: 'CT'
        }
      },

      brainISStack: {
        imageIds: [...Array(91).keys()].map((v,i)=>("brain://input/sagittal/"+i)),
        currentImageIdIndex: 45,
        options: {
          opacity: 1,
          visible: true,
          name: 'CT'
        }
      },

      petAStack: {
        patient: "anonymous",
        studyID:  "1.3.6.1.4.1.5962.99.1.2237260787.1662717184.1234892907507.1411.0",

        rows: 91,
        columns: 91,
        rowCosines: [1, 0, 0],
        columnCosines: [0, 1, 0],
        imagePositionPatient: [-250, -250, -399],
        rowPixelSpacing: 2,
        columnPixelSpacing: 2,

        imageIds: [...Array(91).keys()].map((v,i)=>("pet://output/axial/"+i)),
        currentImageIdIndex: 45,
        options: {
          opacity: 1,
          visible: true,
          viewport: {
            colormap: 'hot',
          },
          name: 'PET'
        }
      },

      petCStack: {
        patient: "anonymous",
        studyID:  "1.3.6.1.4.1.5962.99.1.2237260787.1662717184.1234892907507.1411.0",
        imageIds: [...Array(109).keys()].map((v,i)=>("pet://output/coronal/"+i)),
        currentImageIdIndex: 45,
        options: {
          opacity: 1,
          visible: true,
          viewport: {
            colormap: 'hot',
          },
          name: 'PET'
        }
      },

      petSStack: {
        patient: "anonymous",
        studyID:  "1.3.6.1.4.1.5962.99.1.2237260787.1662717184.1234892907507.1411.0",
        imageIds: [...Array(91).keys()].map((v,i)=>("pet://output/sagittal/"+i)),
        currentImageIdIndex: 45,
        options: {
          opacity: 1,
          visible: true,
          viewport: {
            colormap: 'hot',
          },
          name: 'PET'
        }
      },

      brainAStack: {
        imageIds: [...Array(91).keys()].map((v,i)=>("brain://output/axial/"+i)),
        currentImageIdIndex: 45,
        options: {
          opacity: 1,
          visible: true,
          name: 'CT'
        }
      },

      brainCStack: {
        imageIds: [...Array(109).keys()].map((v,i)=>("brain://output/coronal/"+i)),
        currentImageIdIndex: 45,
        options: {
          opacity: 1,
          visible: true,
          name: 'CT'
        }
      },

      brainSStack: {
        imageIds: [...Array(91).keys()].map((v,i)=>("brain://output/sagittal/"+i)),
        currentImageIdIndex: 45,
        options: {
          opacity: 1,
          visible: true,
          name: 'CT'
        }
      },
    }
  }
  componentDidMount () {
    console.log("componentDidMount")
    this.loaderCtrl();
    // console.log(this.state.petAStack)
  }
  componentDidUpdate (prevProps, prevState, snapshot) {
    // console.log("componentDidUpdate1")
    console.log(prevProps.state.caseID, this.props.state.caseID)
    if (prevProps.state.caseID !== this.props.state.caseID){
      console.log("componentDidUpdate2")
      this.loaderCtrl();
    }
  }

  render () {
    const {progress, message, Radio1, Switch, Radio2, Button, service, caseID, downloadlink} = this.props.state
    const { petIAStack, petICStack, petISStack,
            petAStack, petCStack, petSStack,
            brainAStack, brainCStack, brainSStack,
            brainIAStack, brainICStack, brainISStack} = this.state
    const {FileUpload} = this.props;

    return (
      <div className={`Main ${service.fetching === true ? 'act':''}`}>
        {this.props.children}

        {/* {caseID === null &&
          <div className={`CornerstoneElement-Wrapper act`}>
            <div className="Main-viewport">
              <img src={Icons.IcoDropdown}/>
              <br/>
              <span >Drop a DICOM file here</span>
              <span ><font style={{color:"grey"}}>or</font> Click Here <font style={{color:"grey"}}>to upload.</font></span>
              <input type="file" className={`Main-viewport-input ${service.fetching === true ? 'act':''}`} multiple onChange={FileUpload}/>
            </div>
          </div>
        } */}

        {/*<CornerstoneElement ctrl={this.state} stack={{...stack}} Cstack={{...Cstack}} Sstack={{...Sstack}}/>*/}
        {(caseID !== null) &&
        <div className={`CornerstoneElement-Wrapper ${(Radio2 === 1) ? 'act' : ''} ${Radio1 === 0 ? 'pan' : ''} ${Switch.MAG === true ? 'mag' : ''}`} >
          <CornerstoneElement ctrl={this.props.state} ready={this.state.ready} indexUpdate={this.props.indexUpdate}
                              petAStack={petAStack} petCStack={petCStack} petSStack={petSStack}
                              brainAStack={brainAStack} brainCStack={brainCStack} brainSStack={brainSStack} />
          {/*<CornerstoneElement ctrl={this.props.state}/>*/}
        </div>
        }

        {(caseID !== null) &&
        <div className={`CornerstoneElement-Wrapper ${(Radio2 === 2) ? 'act' : ''} ${Radio1 === 0 ? 'pan' : ''} ${Switch.MAG === true ? 'mag' : ''}`}>
          <CornerstoneElement ctrl={this.props.state} ready={this.state.ready} indexUpdate={this.props.indexUpdate}
                              petAStack={petIAStack} petCStack={petICStack} petSStack={petISStack}
                              brainAStack={brainIAStack} brainCStack={brainICStack} brainSStack={brainISStack}/>
          {/*<CornerstoneElement ctrl={this.props.state}/>*/}
        </div>
        }
        
      </div>
    )
  }

  loaderCtrl = async () =>{

    console.log("1");
    await this.test_getCase(this.props.state.caseID);
    await this.imageLoader();
    console.log("2");
    await this.metaDataLoader();
    console.log("3");
    this.setState({
      ready: true,
    })
  }

  test_getCase = async (caseID) => {
    const token = localStorage.getItem('token')
    // // res = await services.TokenVerify({'token':token})
    const res3 = await services.getCase({'token':token, id:caseID})
    // const res3 = await services.getCase(caseID)
    // let inputCoronal = res3.data[0].slices.filter((v,i)=>v.Direction == "coronal" && v.Type == "input" && v.ImageID>=50 && v.ImageID<=55);
    // let inputCoronalB64 = inputCoronal.map(v=>v.B64Data);
    let slices = res3.data[0].slices;

    let input = slices.filter(v=>v.Type == "input");
    let Ainput = input.filter(v=>v.Direction == "axial");
    let Cinput = input.filter(v=>v.Direction == "coronal");
    let Sinput = input.filter(v=>v.Direction == "sagittal");
    let AinputB64 = Ainput.map(v=>v.B64Data);
    let CinputB64 = Cinput.map(v=>v.B64Data);
    let SinputB64 = Sinput.map(v=>v.B64Data);
    // let mriCoronal = res3.data[0].slices.filter((v,i)=>v.Direction == "coronal" && v.Type == "input" && v.ImageID>=50 && v.ImageID<=55);
    // let mriCoronalB64 = inputCoronal.map(v=>v.B64Data);
    let output = slices.filter(v=>v.Type == "output");
    let Aoutput = output.filter(v=>v.Direction == "axial");
    let Coutput = output.filter(v=>v.Direction == "coronal");
    let Soutput = output.filter(v=>v.Direction == "sagittal");
    let AoutputB64 = Aoutput.map(v=>v.B64Data);
    let CoutputB64 = Coutput.map(v=>v.B64Data);
    let SoutputB64 = Soutput.map(v=>v.B64Data);
    // console.dir(outputCoronalB64);
    // this.outputB64 = outputCoronalB64;
    let brain = slices.filter(v=>v.Type == "brain");
    let Abrain = brain.filter(v=>v.Direction == "axial");
    let Cbrain = brain.filter(v=>v.Direction == "coronal");
    let Sbrain = brain.filter(v=>v.Direction == "sagittal");
    let AbrainB64 = Abrain.map(v=>v.B64Data);
    let CbrainB64 = Cbrain.map(v=>v.B64Data);
    let SbrainB64 = Sbrain.map(v=>v.B64Data);
    // console.log(AbrainB64);
    let Global= Number(res3.data[0].Global).toFixed(3);
    let LateralTemporal= Number(res3.data[0].Lateral_Temporal).toFixed(3);
    let LateralParietal= Number(res3.data[0].Lateral_Parietal).toFixed(3);
    let PCPRC= Number(res3.data[0].PC_PRC).toFixed(3);
    let Frontal= Number(res3.data[0].Frontal).toFixed(3);

    // const {Global,LateralTemporal,LateralParietal,PCPRC,Frontal}=this.state;
    this.props.paramUpdate(Global,LateralTemporal,LateralParietal,PCPRC,Frontal);

    this.setState({
      // inputB64: inputCoronalB64,
      // mriB64: outputCoronalB64,
      AinputB64: AinputB64,
      CinputB64: CinputB64,
      SinputB64: SinputB64,

      AoutputB64: AoutputB64,
      CoutputB64: CoutputB64,
      SoutputB64: SoutputB64,

      AIbrainB64: AbrainB64,
      CIbrainB64: CbrainB64,
      SIbrainB64: SbrainB64,

      AbrainB64: AbrainB64,
      CbrainB64: CbrainB64,
      SbrainB64: SbrainB64,

      // Global,
      // LateralTemporal,
      // LateralParietal,
      // PCPRC,
      // Frontal,
    })
  }

  imageLoader = async () => {

    "use strict";

    console.log("1.5");
    // Study: Doe, Jane
    //    CT: CT SlicesCT2
    //   PET: PET NAC 2DPT2

    var mriB64 = [
      "AAQGBgUGBgYGBgUFBQUGBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUEBAQEBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBgYGBQUFBQUGBgYGBgYFAQAIDQwMDA0MDA4NDAsLDAwMDAwMCwoKCwsLDAsKCgoJCgsLCgoKCgoLCwsKCgoKCgsLCgsJCwoKDAwLCgsMCwoKCwoJCwsLCwoKCw0NDAsKCwoLDAwLCwsNDAIACAwMDA0NDAsNDQ0MCwwMCwsLDAsKCwwKCQoLCgoKCQoLCgoLCwoJCwsLCwsLCwsLCwsKCgsKCgwMCwoKCwoJCgoJCQsMCwoKCwwMDAwKCgoKCw0MCwoLDAwCAAgNDAwNDQ0LCwoLDQwLCwoJCgsLCgoLCgkLDAoJCQkJCwsLDAsLCwwMDQ0ODg4NDQwMCwsLCwsLCgoKCgsJCQoLCgoLCwoKCgsMCwoLCwsMDAwMDQwKCgwMAgAIDQsLCgsMDAsKCwsLCgoKCgsMDAoKCwoJCwwLCgoKCgsLCw0OExojKzI3Ojs7ODMtJBsTDgwMCwkKCgoKCgoLDAsKCwoKCQkLDAoKCwsMDQwLCw0MCgoMDAIACAwMDAsLDAwMDA0MCwoKCwsKCwwLCQoLCgkLCwsKCwsMDxkqP1JgaW5xcnJzdHJxcGpiVUIuHBEMDAsLCgoKCgsJCQoKCQkKCwsKCgsKCwwMCgoMDQsLDAwCAAgMDQwMCwsLCwwMDAoKCgwLCgsLCwoKCwoJCgsLCw4YLEZebnd9g4eKjI+Qj42NjYyIg355cWNNNB4SDAsLCQoKCgoLCgkJCwsLCgsLCgoLCwsKCw0MDAwMAgAIDQ0NCwsKCgoLCwsJCQoMDAsKCgsLCgoKCgsNEiM/W295gYmRlpiam5ubnJuam5qZmZaTj4qDfHRlTDAaDwsLCgoMDAoJCQoKCgsMDAoKCwsMCwwNDQ4ODgIACA0NDQwKCgoJCgoKCQkKCwsLCgkKDAsLDA0WLU5pd4GJkZecnpmQhHZsZV9dXWFpdICPm56empOLg3tyX0EjEQwKCwsKCQoKCQoMDQ0LCgsLCwwNDxEREA8CAAgODg4MCwsLCgsLCgoJCQkKCgoJCQsLDRczVm98hY+Yn6CZiW5QOSsiHRsbGxoaHSIqOlFshZefoJyTioF4ZkglEQwLCgoLCgoLCwwMCwsM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CBtNcn5/c2ZdaIF/g4uNjo6Mi4qIinNUYHB3eHR0e3x0Xk9VX2NjW0g8RExTVFRLQ0xZX2FbT05db3Rzdnd1dHNfX4iJhIKBgoWFg4B6d3ddV2R5h4JpOA8DAAgbTXJ+f3NmXWiBf4OLjY6OjIuKiIpzVGBwd3h0dHt8dF5PVV9jY1tIPERMU1RUS0NMWV9hW09OXW90c3Z3dXRzX1+IiYSCgYKFhYOAend3XVdkeYeCaTgPAw==",
      "AAQGBgYFBQUFBQUFBQUFBQUFBQUGBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUEBAQEBQUFBQUFBQUFBQUEBQUFBQUFBQUFBQUFBQUFBQYGBQUFBQUFBQYGBgYGAQAIDQwMDAwMDA0NCwsLCwsLCwsMDAsLCwsLCwoKCwsKCgoKCwoLCwoLCgoKCgoKCgoLCwoLCwoKCwsKCQkKCwoKDAsLCwwNDAsKCwwMDQsKCgsMDAsLDA0NDAIACAwLCwwNCwwNDQ0MCgoMCwoLCwsLDAwLCgoJCQoKCgoKCQoLCwsJCgoKCwsLCwsKCwsKCgsKCgsKCgoJCgoJCgsLCgsMDQwLCgsMCwsLCgkKDA4MCgsMDAsCAAgNDAsMDQwLCwsLDAwKDAsKCgsLCwwMCgoKCgkJCQoKCgkKCwsLCwsMDA0NDQ0NDAwLCwsLCgoKCQoKCgoKCgoLCwoKCwsLCgsMCwoLDAwLCwwODQsLDA0LAgAIDAsKCgsLDAsLCwwMCwwMCgoMDAoKCwoJCgoKCQkKCwsKCwsNERcgJy4zNjc3NC8oIBgRDgwLCwoLCgoKCwsLDAsJCgoLCwsMDQsLDA0MDQwLDA0MDAwNDAIACAsLCwsMDA0NDQ0NDAsLDAsJCgsKCQkKCQkKCgoKCgwMDhYlOk1cZWttb3BxcnFvbGZdTzwoGBAMCwoJCgsMCgoKCAkJCwsLDAwKCgwLCw0MCgsLDAsMDQwCAAkMCwsMDQwLCwsLCwoJCgwMCgoKCgkICQkJCgoLCw0VJ0BZanR7gIWIio2NjY2Ni4mGgXt2bV1HLhsQDAsLCwoKCQoKCgsKCwwLCgoKCgsMDAsKDA0MDQ4NAgAJDQsMDQwLCgkJCgoJCAoMDQwKCQoKCQkKCgsMESA6Vmx3foaNlJeZmpqampmZmZmYmJWRjYiBenJhRysXDgsKCQkLDAsLCgoLCwsLCwoLDA0MCgwNDRAREAIACQ0MDA0MCwsKCQoKCQkKCw0MCgkJCwsKCw0UKUlmdn+GjpabnZiQhXhtZmFfYGRtd4ORmpybmJGJgXpvWjseDwsKCgsKCgoKCgsMDAwKCgsMDAwMDhASERACAAkODAwMDAwLCgoLCwsLCgoLDAsKCQoLDBQtUGx7hI2WnJ+bi3FUPCwjHRsbGxscHiMtPlVwh5eenpqRiYB2Y0IgDwsKCgoLCwsLCwwLCgoL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CRYvV253dXBscoeFh46Pjo6Ojo+OhFQ9VmpvcnJyd4KIfGhcWlxgZmJZVlhbW1pZWV9eWVdWW2p6gXlxcXBwb2VHP26HioiGhYaGhYN+fX5saXJ9fG5MJA0DAAkWL1dud3VwbHKHhYeOj46Ojo6PjoRUPVZqb3JycneCiHxoXFpcYGZiWVZYW1taWVlfXllXVltqeoF5cXFwcG9lRz9uh4qIhoWGhoWDfn1+bGlyfXxuTCQNAw==",
      "AAQGBQUFBQYFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBAUFBQUFBQQEBAQEBAUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUGBgUFBQUFBQUGBgYGAQAIDQwLDAwNDAwMCwsLCwsKCgoLDAsLDAsKCQoLDAsLDAsLCgkKCwoKCgoKCgoKCgoJCgoLCwoJCgsKCQoLDAsLDAwLCwsLCwsLCwsLDAsKCgsMDAsLDQ0NDAIACAwLCgsLCwsMDQwLCgkKCgkKCgoKDA0MCwoKCgsLCwsKCQoJCgsJCgoKCwoLCwsKCgoKCgoJCQoLCgoLCwwLCgsLCgoLDAsKCQoKCgsKCgkLDQwLCgsMDAsCAAgMCwsLCwoKCwwMDAsKCwwLCgoKCgwMCwsLCwoKCgsKCQkKCgoLCwsLDAwMDAwMDAsMCwoKCgoJCgoLCwsLCgkKCgoKCgsLCwoKCgoLDAsLDAwMCwsLDQ0LAgAJDQsKCgoKCgsMCwoMDAwNCwoLCwsLCwsKCgoKCgoKCgoKCgsMDxUcIygtMDAwLSkjGxQPDAsLCgoKCgsLCgoKCgoJCQoLDAwLCwoKDAwMDAsLDAsLDA0ODQIACQ4MCwsMCwsNDgwLDAsLCwoJCgsLCgoKCwoKCgoKCgsMDhMgM0dWYGZqbG1ubm5taGBWRzMhFA4MCwoKCQkLCgoKCQkJCwwMCwoJCQsKCgsLCgsLDAsMDQ0CAAoOCwsLDA0MDAsLCgsJCgsKCQkKCgoJCQoKCgoLCw0TIjlTZXF5foKGiImLi4uKiYaDfnlzaFY+JxcOCwoKCgoKCgoKCgoKCgoKCgoKCQoMDAsMDQ4MDA0NAgAKDQsKCwwMCwoJCQkJCQoLCwsKCQoKCgkLCwsMDxszUWd1fYOMk5eZmZeXl5eYl5iXlpOQi4V+d21aPyUTDQsLCgkKCwoJCQkKCwsLCgoLDA0MCwwNDg8QEQIACg4MCwsMDAsKCQoKCgsLCwwMCwkKCwwKCwwRI0Jgc3yDi5OYm5mUinxwaGJjZmtzfIaSmZqZlY+Hf3hrUzMZDgsKCgoJCQkKCgsLCwoKCwsLCwsLDQ8SEhICAAoODAsLDAwMCwoLDAsMCwoLCwsKCgoLDBEmSWh5gouTmZybjHRaQzEmHx0cHB0eIScxQ1x1i5idnJiPh35zXTobDQoJCQoKCwoKCgoLCwsL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CRMaME5iaW1wc4KIio6PjY2Mi4uRk3FZeoR0bXBxdnqEhH1zbW54ipWQh398foGHjY6BcWtscnyDgnVvbWtqb3RcUX2Pi4eFhYSFhYN/fnlxc3FvZ04qFw4CAAkTGjBOYmltcHOCiIqOj42NjIuLkZNxWXqEdG1wcXZ6hIR9c21ueIqVkId/fH6Bh42OgXFrbHJ8g4J1b21ram90XFF9j4uHhYWEhYWDf355cXNxb2dOKhcOAg==",
      "AAQGBQUFBgYFBgYFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBAQEBAUFBQUFBQUEBQUFBQUFBQUFBQUFBQUFBQUFBQUFBgUFBgUGBgUFBgYGAQAIDQwMDA4ODQwMCwsLDAwLCwsLCwsKCwsKCgoLCwoKDAsLCwoKCwsLCwoLCgkKCgoKCwsLCgoLCgsLCgsMDAsLCwsKCgsLCwsLCwoKCgsLCw0MDA0MCwwODgIACAwMDAwMDAwMDAwMCwoKCgkKCgoKCgwMCwsKCwwKCQoKCgsLCgoKCgsKCwsLCwsLCgsKCQkKCwsMDAoKCwwLCwsKCgkKCgoJCQoJCgoKCwoMCwsMCwoLDA0CAAgNDQwMDAoKCw0NDQsJCgsLCgkJCQoLDAwMDAwMCgkJCQkLCwsKCgsLCwsMDAwMDAsMCwoKCwsKCwoLDAsKCQoKCgkJCQoKCwoJCQsMDAsLCwsKCwwLDA0NAgAJDw4MCwsKCgsMDAoKCgsMCwoKCwsKCgsLCwsMCwoJCQoKCwsMDhIXHSImKCkoJiEcFhEODAsKCgoJCwwLCQkKCQkICQoLDAwLCgoLDAwLCwoLCwwMCwwODQIACQ8ODAsLCwsMDQwKCgoKCwoKCgsMCwoLCwoKCwoJCgoLDREbLD9OWmFmaGlqamlmYlpNPSobEQwLCgoKCgkJCgkJCQkKCwwLCgkJCgsLCgoKCwwMDAoLDQ0CAAkODQwKCgsMDAsLCgoKCQoJCgsLDAsKCgsLCgoKCgwQHDJLYG11e3+DhYaHiIiHhYOAe3ZuYU01IBMNCwsJCQsKCwoLCwoKCgkJCQoLCwoKCwwMDA0LDA0OAgAJDg0LCgoLCwoKCgoKCgoKCgoLCwsLCgoMCwsMDhYrSGJyeoCHj5SWl5eWlpaWlpaVlZGOiYN8dGZRNh4QDAsLCwoKDAwKCQkJCgoKCwwMCwsNCwsLDQ4QEQIACQ4NDAoKCwoKCgoKCwsLCwsLCwsLDAsKCwwPHTlYbnqCiZCVmJmWjYF3bmtqa3B4g4ySl5iXk4uEfHRlSSoVDQsJCQsLCgoKCgoJCQoMDQwKCwsLDQ8REhMCAAoODQwKCgoLDAsLCwsLDAsLCwoKCwsLCw8fQGF1f4iQlpqZj3piSzcqIx8fHh8gJS05S2R6jpqcmpWNg3puVDAWDAoKCgoKCwsJCQkKCw0MCgsNDg8PDxITAgALEA4MCwoKCwwMCwsKCgsKCgkJCgsLDhw+Y3eBjJacnZWAXz8pHhsaGhkWFBMVGBscGxoeKD1beZGdn5uSh31wVC0TCwsLCgoKCQoLCwsMDAwOEA8NDQ4SEwIADBEODAoKCgsLCwsLCgkJCgsKCQoMFTVedoGNmKGhkXBILB8fISQoKiomIh8eHyInKikmIyAdHig/YoSbo56UiHxtSyIPCwoLCwoLCwoLDA4PDw8NDQ4OEhMCAAwRDgwLCgoKCgkJCgsJCQkKCgsOIk9xgIyXoaOPZz0lISkuKzA/TFRWVlhbW1ZSUlJPS0E2LCclISEwUn2ao56ThXhiOBUMDAsLDAwLDA0ODg0ODg0NDhITAgANEg8MCwoJCgoJCQoLCwoJCgsSM2F5h5OfppRnOSQnMTg0LThLUlRXXWl1gYWAdmthWVdUUUs+Mi4uKiQrS3yep52Of3BMHg0LCw0MCwwMDAwLDQ4MDA4TFAIADhMPDAoKCgsKCgoLCgoKCgwYQ2x9jZunoXQ9JCg2OzUtMD9KSUlOUlNWZX2Ig2xaVldWUEpISUM2LDA2MSYsUoelpZaFdVooDwsLCwwLCgsLCwwMCwwPFBYDAA8UDwwLCgoJCgoKCgkJCgwdT3GCkqKqjlEpKDc7MiowPktQVF1xgomCa1lqgHReaYSQjoNvXFFMSD4tKDU8NCcyZpyqnYt5YTERDA0NCwsMCwsLCwsMDxUYAwAQFhAMCwoJCgsKCgoJCgwiVnOFl6imczYmNT41KzJFVV5lbneEl6KnpZp4X29kc5uqrqyonIpzX1ZRTD0tLjxAMShHh6uij3tmOBMNDAwNDAsLCwsMDQ8WGgMAEhgSDQsKCgsLCgoJCg0lWnOHm66dWSktPjsuMkhea3eDi5CSl6OrsrGmlWxdZpSqs7i3s6uhkYN4bmVeUTstNUM/LDNwpaWTfGk/FQ0NDAwNDQwLDA0QGRwEABMbFQ4LCgoKCgoKCg0lXXOJn6+RRig3QDQvRF5vfoyWnKChoKCosbe2q518WXKdrLa7vLmxqaGbl5aQhXhpUTYvPUU0LFubqpZ+a0EVDQsNDQ0MCgsMEBsdBAAUHhcQDAsKCgkJCgwkXHKJobCEOSo9PDA5VWt9jZqipqmqqailrLS5s6eaf1tzmKmyur67tK2ppqepqaWflIFlRTE1QzwqSpStmH5rQRQMDAsLCwsLCxEdHgQAFB8ZEQ0LCwsKCgwgWnCHo695MSxAODFGXXKKm6Sqra2vr66tqa+3t6yfknlab4+hrLa+vbewrKutsLCvrq2ki2hPOzI/QS1AjKyZfmo9EgwLCgsMCwwSHx8EABQfGRENDAsLCgsZUm+Eo69zLSs+NjxXYXCRpK2vsbGwsbKxsK6zubSilYhwVmqImKSzvb+5s66usbOysbO0sKN+XlxPODpCLzqHrpl8ZzQQDAsLCwoMEyEhBQAUHxkRDgwMCwwUR2x+obBxKys+Okt0fG+JprC0tLOysLGzs7OzuLqum46BalNriZSdrry/u7WxsbKzsrK0tbOqjHKBiGxCOEIwN4ewmHlhKQ0LCwoKDBMhIQUAFB8YEQ0MDAwPN2p2m7J2Kik+QliKn5B7mq61uLa0srGxs7W2t7u6qpaLgm1Tb5GZm6q7v724tLS0s7Cws7W0q5B+mamfekk4QCw4jrCUdVccDAwLCgwSICAFABMeFg8NDAwNJGJwkbODLic9RFyPqq6Vf6Kyubq4tbOysrW3ubq9uaiVjol1VXOXn5+pusC/vLi2tbGsr7O1sqiPfpyztKJ9Szg4Jz2ZrYtvRBIMCwsMEB0eBAATHRQODQwMFU9tg7GVNyQ7RFOEprizj32ls7u9urezsrO2ubq9vrmompeSfVd2mqKkrbrAwb+8ubStqK6ys66ljnmUtb+zn3ZMOTIjTKang2ctDgsLDA4ZHAQAEhsSDQ0MDjJqdaWqSiE2Q05xj6m7tIp2pbO8vry4tbO1uLu8vb24q6CdmYheepqkqLG7wMLBv7u0qqetsrGspZJ6kbTCvKuQZEs2LSJmsZ15VRgMCwwNFBgDABEZEQ0MDBhYbpC1bCMvQUp3kJalt7aRcJ2xur69ura0t7q9vb29uLCoo5yOZn+cp662ur7BwcC+tammrbCuq6WUgZi3wrqrlm1ZSTQmLIuwjm83DgsLDBEUAwARFxANDA4zbHqulDEmPEJrl6WkprW6onmMq7a9vry4trm8vby8vLezsKqgkGqBnq21ubu+wcC/v7iqpaqsq6qkk4ulvMC0p5JwYF5DMB9Jp6V/WhkMDAwPEQMAEBYPDAwVVHCWslogMzxWhqeysrK6v7KVgJ6uuLy8urm8vr26u7q1srCroY9of5yrsre7vsC/vsC9sqimqKupoI+XssC7rZ2Db3d8YjsnI320k3ExDgwMDg8CAA8UDgsNJ2p6sJYwJTdIZpCsuLy9v8C6rJCJoK23vL29vr68uru4r6mjnZaEW26SnKOrtLvAwL6/wbyyrKusppmQpru+saGLc3eOlIJTMBxKq6l/UBMMCw0OAgAOEg0LD0Jyj7prICw8YG6Mp7W9wcG/u7Wpk4yZrLq+v728urm6saSbkouDa1FdeYiSm6e0vsHAvsHCvbezrqOTmrS+tqSPeHWJm6GWdDwiKI23kGkiDQsMDQIADRAMDBdbeKerRR4vU3l9g5mrtr7AvLe0s6qblaS4v7+8urm7uKaXjIB6fHZjdYKAgIuYp7fBwL2/wcG/ubGim6y8u6qVgHmDlaOro4tVKRtntaF5OQ4LCwwCAAwPDAwka4K3kCwhOHCLjYKFmKi0vLuyrK2vrKeru8C+urm5vLGZiX16hIqHdoGPjoaAiZisv8G+v7/Cw722rq+5vrOeioKHkJymsauXcDIaRqiwhlESCwoLAgAMDwsNNXSTu3YgIk+Im5mNf4OUpLK5sqWeoqmutr++vLq5uryrjHt8h5CYjHqDmJ6TiICJob3Bvb6/v8PBvLm6vrqolIuNk5eep7KtnIJDHDCVuJJkGgsKCwIADA4LD0d6pbNeGyhqlaemm5CHiJGhs7apnJumtL7AvLu6urm8qoqAiZSioYt5gpesp5iLh5y8wb6+wL+/w8G+v8C4pZaTlpiboq62rp+NWSAjgrqgcycMCwwCAAsOCxNXgbGnTBk3fp6wsqykmpGNlam3s6uqtL7Bvb28u7u4urOak5yrs6KJdH6SrLmxoZqrv7++v8HCvsHDwsPDv7CinZ2gpq63urOmlmwmHW6yrH42DQsLAgALDgwZZYm5mj8ZSoujrrK0s6yjmpmmt7u5ur/Cv7u+u7q6ubm6tLG2urijiXR+kKy8vry6vr68vb6/wr69wsTFxcXAtq+usri+wLy1q517LxleqLaIRg8LCwIACg8NIW6Uu442G1eRoaOipquwr6uqsrzAwMHCwry7vLi3ubu4uLu7vLu4qY13gZayu76/v726u729vsG/vMLGxsjIx8XDwsPExMG5sq2fhDgXUpy6kVUSCwsCAAoODSp2nbeFLhxgkpuWkJGWn622vMHDxMTExMG7vLy3trm6tra3t7ixp6GOc4CYp6e0u7m4uLu+vbzAwLzCx8fJyMbGxsbFxMK+uLSuoIk/F0iXupphFwwLAgAJDQ40fKaxfSkeZJGUioGEjpqsvcTGx8bFxMXCu7u6trW5tZiFnrK1qpaNf19uiZCbsLaulIutvr27v8C9w8fHx8bFxMK/vLq5uLazrqKKQRY/kbmhbB0MCwIABwwPPYGurHclH2SOkYWCjJint8LFxsbFxcPEw726ubWzuKtpPk+BqrStnot/gZCisLOgb0ZJkby8ur6/vsTFxcTExMO+tq+sra+urKqfhz8WOIu1qnYlDAoCAAYLD0aFtaZzIx1gjZOMkJmmsrm6uLa1t7q9v8G/urm2tLWodD41P2eXr7Szs7OztKuLWDk2TpO6vLy9vcDDwLu2try/vrasqKinpqKfln86FzKGrLJ+LAwKAgAFCxFOirmibyIaV4qUl56nra6qo52Ylp2orqquurq4trSyqI5WNzdAVHWbsLS0r5VsTD03PG2gtrq8u7u8tbGsoJ2ns7q5sauopaCcl410NRgtgaW3hTUNCgIABQoTVY67nWsiGEyElZ6kpaOgmpWQi4yWoaCTkam5ubaysK6deU9GUFNKYZqkpZleSFBSSFSIqre3u7y6q5qeoZmRl6Ous7Cqp6OfmpOEaDIaKXyduIs9DQoCAAQKFVyTuploIhhAdY+anp2cmpWRjIiLk5iUiIegt7m1sLCzr6WWiX9uW2+efH+dcl1seoOVrLe5trm9uZ2MkJWQhYiVn6WkoJyZlY+Ec100HCZ4l7WQRg4KAgADCRdhmLuXZCEZO114ipKVlpSRjIN+gomKg4GOo7i6tLGwsa2moqCZiH+Vjk1LgJCHipejqrC3uLe4vbifin98eHFygY6Uk4+Kh4B5dHFmPhwidJS2lk0QCgIAAwkaZp25lGEeHEVbZGx1fYGCf3hubXN1bm2Elqi4urSysK+oo5+cnJiLeFVAQU91jJidn6KosLa3uLu5opB8bXJ8fHd2eXt5dHJ0fISJgVQdH26StZxTEQoCAAMJHWuhtpJdGyNfgYeCeXJva2ZreYOFfW1tgpKjtrm1srKvqaSfnJqYkoFeVlZih5SYmpyhp661uLm7uqKNgIORmpyVgXR8gYGDh4yRlI5qIxxpkLGgWhMKAgADCR9vprSQWRowepeem5aSjYV3hpmfn5iJeHiGmrS3tbOyr6qloJ2blpGKclhado2TlpicoqmvtLi7urqkiXuNnqiqopSKlJmYlpaXmp6YfC4aZI+uo14UCgIAAwkhcquxjlYZPYeir6+ppJ6ViJSkrq+ml4Fvf5m0s7a0sa6rqKOfnJWQi3tXWHyNkpeanaSrr7K3u7m6q412iZ+vsqaWk5+mpqWlp6qroYY3GV+OqaZiFgoCAAMJI3SuroxUGUSMpba8urOomouOnq+1q5qCc4agtK+3tbGtqqikoJ6WkIyJYGWHjJKanKCmqa2wt7y5t7SYfn6Xq7WuoqKstbm6urq7tqWJOxldjaapZRcLAgADCiR2sKqLUxlFjaSyuL29taiZkZuvtaWSfH6Rq7KuubaxrammpaGfmpCLilNlkY2Vnp+ip6mssLa8vLW4p4x6iqK0ubi4vL28ubi4uLWkiToZXY2kq2YXCwIAAwokd7Goi1QYPoqgq6ywuL67tK2xuK+ZgXiInrOvs7u4sq2pp6aiop6UjXxCUo2SmqCgo6irrbC1u765ubOahoies7u9urOqo6CipKamnYMzGV+NoK1nFwsCAAMKI3eyqItWGDB8mJ+goqmyu8DAwLypj3Z9kaq1sLm9urSvrKino6KfmpNwOUSGmp6goaaqrbCztru/vLe3qpiYp7a5sqWakYqKjZCTlZBxKRpijZ2rZBYLAgADCiF1saeLWhgnZoePkZOaoamvtLu9sZqIjJ+0tLa9vbm2s6+qpqOiop+ZeT5PjZ+jpKSnq66ytLa5vLy5uLeurbW4rZ6TioF4dnp8f4F6XyccaI2dq2IVCgIAAwofc7Cni18aKmV9goGEipCVmJuktbuwpKe1ura6u7i2tbSwqaOfoaWko5Nac56kpqaio6etsLCvsbW5u7m7urq8sZuPiIN/fX+CgoOGhnIvH26MnKpeFAsCAAMKHXCvp4xmHTd5i4yFgICChIaIkKW8vrq8v7y8uraxr7K1tKyin6Gmqamkj5mnqailn6GnsLGuq620ur69vb29vqyQg35+gISKjZCSlZKAOCR2i5yqWRMLAgADCxtsrqmMbiJIhpaXko6LiomJiY+ivMLAvr69vbu2rquttLezpp2hqayqp5+jqayspp+hr7WyqaeqrrO0tbm8u76vkH14fIKIj5WboKKYgj0sfYmdp1ISDAIABAwYZq2qjXgpUoygqKOdmZeWlpier8DCv7uzp6CclJGUkKO0taqhpqquq6ijpaqtrKijpbO2poaBjoqRlZehtLq8uKCMhoiLj5agqK2nl4NAN4SInaJKEQwCAAQNFl6rqI2CMlSMn662tbCtq6uttL/Dwb2xk4yQlZaQbVt0pbWtoKSoraumo6Soq6mmoae1sohcXIKUlpOQjZy4vL65rKGeoKWttrm2qpmFQUSJh5+eQhAMAgAFDhVUqKSNij5QiZqjq7S6v8HBwsXFwr67mnmFioyPjHNeWoKxsaWgoqaloJ6foaWkoKCstZxlXnGDh4qKiYSDrr69wMK/vb6+vry5ta2agz9Ui4WglzkPDAIABQ4ZS6Kdio9MSIOXnZ2gpay3wMbIxcC9u6CFioiHiIaCf2lil7Ksop+gn52am52foJ6lr6hxXHyMioiIh4eHjLC+vsDExMG6r6ejoaKhlX06ZIuCnY4vDwwCAAUQKEaWloaQXEGAlpyZmp2hqLPBxcO7sbOyopqRiYqNkZOFYG6orqScnp+cipGdn52cqK2FVW6UnpqUkZKZn6q4t7a8wcK5oZGMiouPk45tNnSKf5iCKRENAgAFFUdVgoyCkG46dZCbnJ2enp+ovMO7o5KcsquiopyXm6OlnH1hla6moKKinHeGoKKfn6ikZluFoqytqKakoaSys5uVqLrAtZqLhYN/f4N9UjqAiHyNbiofEwMABRlid254fI5+N2GJl5eTj46Spb2/qo6Fka2mk5elra+1s6KIY4auqaanqqicoKino6OomlxkiaOytbCikomPq6mLhJOquLemmJCNioZ/bDlJhoR4dlVDQx8DAAYcaoNoXnOIh0FHgZKTj46TnrTAt52HgpGqn4eHlqqzt62VemGOrqqmpqmsq6urp6OkqaBqX36WqrGokoJ+i6mlin+Jm6y1saifmpaRhmIsXIeAb1tQbmgoBAAGH2l1X1RogYtVMXCOlJWZorC9ua2ah4KQpZyFgYubpaWWfmBooauppaOmqKenqKaio6inhVVngZSdmot+fo6po4t/hZSlra+tp6KdkoBIKm6FeWRRXoJxJgMABh9pbEtNbX+LaihQgJGdqLG1sqqlnIyEjZybi4WHi4+LeV1KcKioqKWho6aioqakoKKmppdVS2J6h4uGgoWTop6NgomXoaOkpKKdlIdmKjV6gndoUWB8Zh0DAAccZXdHQHqIiHwvLGSImqeqpZ6bm5aKgYaPko6JgXZyZlRGSHaqqamnpKWln6Ckop+goqWdWEFFVWh2e4KJj5OQh32EkJOTlJWUjoJsOxtGgH9/cUlfgFYVAwAIF1iJVjZyiYWHQBk0ZYGNj42HgYOCeG13gIB9dmZURj5CVGZ6qaimpqeopJ2gpaSgnp+llmJVRDw8RlVndnx9e3NlZ29vc3t+fHViPhsaWoR7gGZCcItBEAMABxJElGw3a4N+jFMWFShCVFxeVERHT0pBTFtcUD0rIR0gOHCAc6SppaWpqqScn6alo56eo4lxgVEqGxsgLEFRWFRHNzU0MTdHTUlBLhkSI2qCdHxaQYCDKQ4CAAgPLo5/OlyAdohkGxARFh0iJSAZGR0fHSEpKSEYExQVFihIUVeVqqekpqiknJ6lpqOgop5vUlo6HhcWFRYbIygmHhkWFBMVGx4cGBMQES9zeHJyRUiKaRkNAwAJDx53i0FAb4aAbSQQDg4PEBEQDw8QERQYGxgWFhgcHh0kMjpDc6OmoqOlopyepKSgn6KHUDw3KyAeHx4bGRodHxkTEA8PDxAREBAPDhI9cXV+VTVYikgSDQIAChAWVZNaNlmXiG0vEg8ODg4ODg0NDhIfJyomHBcaHR4fIyw3PUyCpKako6Ken6OjoaGSXD45LiMgIB8dGhokKyolGRAODw4PDw8PDxAZSGuFfkdDcXcqEA0CAAoPEzKBgFdhlYxoPxwSEREQDw4NDA0QGRsrNCgYFhofIiEiLjo8VI2mpqSko6KkpKOYaEA6MiQgJSYgGBYfMjUiFxQQDg8NDhETFBQZLktmiIJgaXpQGA8MAgAJDhAbWIJ5h5d7V0pELygiFxANDA0NDRAVKjUsGBMZKTk3JSMzPD9djJ+jpqakpKGWcUU7OigfKDc3JxgUIC8xHRMQDw4ODQ4SHi42RU9GV3SHc3NtKxEOCwIACA0OEC90dnN0YFZZZF1OMxkPDQ4ODg4OERkkJxwWHzJHTjchLUI/Qlx0hIyHhoh8aEw+Rj8kIjA/QDIgGiIlHhURDw4PDw8QEiA8Ul5cU1RcZW57SBYPDQsCAAgNDQ4YSn98bGRbU1FNQCsYERARERAPDg8SHjQ1KTdCRUU6KjpWT0NFTFxiXl9VS0hESFhRNCowNjlBOTE8KRYRDw8RERERERMcLDhARElVYW98YSkTDw0LAgAJDw4PGjhZYlZGOC4rLS8qHRYVFRYVEQ8PESlXX0pSU0k/OTdCS0NAQEVXV15hSkJBPzY6PDY1Nzc7SEpRXj8ZEA8RFBUUFBQYHycmIyMnLzlESUEuFg8ODAIACQ4NDx0yNC0nIx4ZGiM0NSMYGBwfHhgTEBEvYXViR0VEREU+NS8oKDZBS0lXYU5DOywoMzU4RE1EOzpFaGxJHBESFhodGxcWGigxKBoWFxocHyQrKRcQDgsCAAkNDRAeKSIbGBYVFRkqQ0UtHCAuODsyIhUTLmB9f0o1RFhUREBIQy0nN0FCSFBIOy0oQ1NKPkNZW0A1V391TRwUGig0Ni4iGiA1PTEeFRQUFRYYHiIYEA4LAgAJDg8TIygfGBUTFBYeNFFcRSo0TF1jWUImGClcd4ttSltuWDtEV1tJLSk1PkRDOiwoPFhhVT88YG9YUHiGcUodGytEVVlPOigxUFE7IhcUExQVFx0kHRIOCwIACA4PEyUpHhgUExUXIDhqgmlKVG17f3NcPCEnVW6DhWZibGM+QVljXUoyKCszMSosP1ZiYFI6RWVmXmuIf2xLJSY9VWlybVtDTXB5TiUZFRMUFBceJR0RDgsCAAgNDREfJh8YFBQXITBLgpaCcnqGjI+Dbk8wMVRqfIpzW1dZSz1CTFdcUDstLC0zRlpeU0Y9QE9WU113iHpsUzM3TWF4hYR7aWyAjWo/MCMXFBMXHiAWEA0KAgAJDg4QFyAfGhcYKlF2eoOPkI+QkJaflIBoSkRdbXqJgGpiY2FbUEZCRkhANTEyOURIQz9HU15laGNqfoV3blxHUWVyh5SQiYWFiot5d3VQKBgXGh0aExAOCgIACA4PEBQcHx4eJ0yDoo6MkZKRjo2Wp6KWjHJbZnN6h4V8fouNhXhqXEs9NjIxMTM3PUlba3qIj4t/eH+BdW1jX3mJhJKbkYmMiomKhoiVd0MlHh4eGRMQDgsCAAgOEBIYIigtNEJji5SKjpCOjImIkaKkoq2he295fImFgYeOkY+HfXp4alxXVlVWW2d0eoCJkI+JhIB+gXdwbH+ioo2YmYmEh4WFhYiIi31aQTYvKiMZEg8LAgAJDxIVITI9SFNedY2NjI6Lh4aFhIyanqC3vZh5fICMg4CEg4aFf3uHlZmThYCChpGWj4eAgYWEgYGBfoV9dnmataWRmZKEgIF/gYGFhoeCbF1YTEI3IRQQDAIAChIVGypCVGJrcICLi4uLiYaDgoKIlJqXrL6rhX+GkIWBgH18eXN1gY+VkYJ4e4KOkYp/dXN4fH2AgYCJg3uFprCZjZWLgX5+foCBgoCAgHZvcWVXRCcXEg4CAAoSFRsqQlRia3CAi4uLi4mGg4KCiJSal6y+q4V/hpCFgYB9fHlzdYGPlZGCeHuCjpGKf3VzeHx9gIGAiYN7haawmY2Vi4F+fn6AgYKAgIB2b3FlV0QnFxIOAg==",
      "AAQFBQYFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQQFBQQEBAUEBAQEBAUFBAUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBgUFBgYGAQAIDQwNDQwMDAwLDA0NDAsKCwwLCgoKCgoKCgoLCwoKCwoKCwoJCgoKCgkKCgkJCgoKCwoLCgsMCwsLCgoLCwoKDAsKCgsMCwsLCwsLCgwMCwwMDA0MCw0ODQIACAwMDQ0MDAwLCwsNDQwLCgoLCgoKCgsKCgoJCwsKCQoKCQoKCgoKCQoKCgoKCgsLCgoJCgoLDAsLCgkJCgoJCgwMCwsLCgoJCgsKCgoMDAsMDAsNDAoMDg4CAAgNDQ4NDQsLCwsMDAsKCQsLCwkJCgoLCwsLCwsLCgkKCgkKCwsKCgoLCwsMCwsMDAsLCgoKCwsKCgoJCgoJCQsMCwsLCwoKCwsLCwsMDQwKCgoKDAwKDA0OAgAJDg4NDAwLCwsKCwsKCQoLDAsKCgoJCQoLCwsKCgsLCgsKCgsLDA8TFxwfISIhHxsWEg8NCwoKCgoJCgsLCgoMCwoJCgsLDAwLCgoMDQwLCgkKCwwLCgwNDQIACQ4ODQwLCgoLCwwLCQkJCgsLCwsLCgkKCgoKCgoLCwoMDA4WIzVFUlpgY2VlZGJfWVFDMiEVDgwLCwoKCgoKCwoJCQkKCwsLCgkJCgsLCgkJCgwNCwoLDQ0CAAkODg0LCgoLCwsLCgkKCQkJCgsMDAsKCgoKCQoKCgsOFyhBWGhyd3t/gYKDhISCgoB8d3JoWEIrGQ8MCgoKCgsKCwoKCwsKCgkJCQkLCwoJCgsMDQwMDA0NAgAJDg0NCwoKCgoLDAsLDAsJCQkLDA0LCgoLCgoLDBIjPllsd36EjJGTlZWVlpaWlZSTko6KhoB5b19GKxcOCwoLCwsKDAwKCQoKCgoJCwwMCgsMCgsLDA0PDgIACQ0NDQwLCgoKDAsLDA0MCgoJCgsMCwoJCgsOFy9OaHd/h42TmJqYkId+eHRyc3d+iJGUlpeVkIiAenBcPiERDAoKCgsLCgoLCwsJCQoMDQwMDAoLDA0OEA8CAAoPDg0MCwoKCwwKCgsLCwoKCgkKCgsKCg0ZNVhwfIWOlZiYkoJrVEAxKSQiIiIlKjVDV26BkJeZl5GJgHdmSCURCwoKCQkLDAsKCgkJCwwL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ChETFiA6V2twcoONioeGg3t8f319hJy2y+LmxJSVqp2Nhn5+fXp1dHl/f3RpbHZ+fHh0dHh8e3l+ipiun5rK5da6p5J8d3p6dHZ8fnt+hHpwdGdPMBkSEA0CAAoRExYgOldrcHKDjYqHhoN7fH99fYSctsvi5sSUlaqdjYZ+fn16dXR5f390aWx2fnx4dHR4fHt5foqYrp+ayuXWuqeSfHd6enR2fH57foR6cHRnTzAZEhANAg==",
      "AAQFBQYGBQUFBQUFBQUFBQUFBQQEBQUFBQUFBQUFBQUFBQUFBAUFBQUEBAQEBAQEBQUEBAUEBAUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBgYGAQAJDAwNDQwMDAwMDAwMDQsKDA0LCgoKCwoKCgoLCgsLCwoKCgkKCwsKCgoKCgsKCgsKCgoLCgkLCwsMCwoLCwoKCwwKCgsMCwoLDAwLCwwNCwsLCwwMDA0ODQIACAsLDQ0MCwsLCwsMDQ0LCgsMCwsLCgsKCgkJCgoKCgsKCQkJCgsMCgoLCwsLCwoLCgkJCwsKCwsKCgoJCQkJCgwMCwsMCwkJCgwMCgsMDQsLCwsMDAsMDg0CAAgMDQ4ODAsLCgoKCwwLCgsMCwoLDAsKCgoKCQkJCgoKCwkJCgsLCwsLCwsLCwsLCwsKCgsKCgsKCQkICAkJCQsLDAsMDAsJCgsLCwoLDQwLCwoKCwsLDA4NAgAIDQ0ODQwMDAsKCQsMCgkLDQwKCgoJCQkKCgkJCgsLCgsKCgsLDA0QExYZGxsaGBUSDw0MCwoKCgkJCQoKCwoKCgsKCgsLCgsLCgsLCwsMCwsLCgsKCgwODQIACQ0NDAwLCwoKCgoLCwoJCwsLCwoKCQgJCQkKCgoMCwoKCw0SGyo7SFFYXF5eXVpWUEU3JxoRDQsLCwoKCwwKCQkKCgkKCwoKCgoKCgkJCgsKCwwMCgsMDg4CAAkNDQ0MCwoKCgoKCgoKCgoKCgsMCwoJCQkJCgsKCwsMEh82TmBsc3h7fX9/gIB+fXt4c2xfTDUhEw0LCgoKCgkJCwoKCgoJCQoKCgkJCQoLCgoNDQsLDQ4OAgAJDQ0NDQsLCwsLDAsMDAsKCQkKDAwLCgoKCQsLDA8bMk5lc3uBiI6RkpOUlJSVlJKRj4uGgXt0Z1Q6IRIMCgoKCgwLCwsJCQoLDAsKCwoKCwwLCwwLCwwODgIACQ4ODQwMDAsKDAwLDA0MCwkJCQsLCgoKCgoMEiVCX3J7g4qRlpeVkoyGgn17fYCFjJOVlZSSjIV9dWhPMRgOCwoKCgsKCQkLDAwLCgsLCwsNDAoMDA0NEA8CAAoQDw4MDAsKCgoKCgsMCwoJCgoKCQoKCgwTKUxpeIGLkpeYlIl0Xko6MSwpKSosMj5PY3eHk5aWk4yEfXJcOhsOCgoKCgkKCgoKCwsKCgoK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",
    ]


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

    var min1 = 0;
    var max1 = 0;
    function str28bitpixelData(str) {
      var buf = new ArrayBuffer(str.length * 2); // 1 bytes for each char
      var bufView = new Uint16Array(buf);
      var index = 0;
      for (var i=0, strLen=str.length; i<strLen; i+=1) {
        var lower = str.charCodeAt(i);
        // var upper = str.charCodeAt(i+1);
        // debugger;
        if (lower > max1) max1 = lower;
        if (lower < min1) min1 = lower;
        bufView[index] = lower / 255 * 32767;
        index++;
      }

      // console.log(min1);
      // console.log(max1);
      // console.log(Math.min.apply(null, bufView));
      // console.log(Math.max.apply(null, bufView));
      return bufView;
    }
    function getPixelData(base64PixelData)
    {
      var pixelDataAsString = window.atob(base64PixelData);
      var pixelData = str2pixelData(pixelDataAsString);
      // console.log("min:", pixelData.length);
      return pixelData;
    }
    function get8bitPixelData(base64PixelData)
    {
      var pixelDataAsString = window.atob(base64PixelData);
      var pixelData = str28bitpixelData(pixelDataAsString);
      // console.log("min:", pixelData.length);
      // console.log("pixelData: ", pixelData)
      return pixelData;
    }

    var mriPixelData = [get8bitPixelData(mriB64[0]), get8bitPixelData(mriB64[1]), get8bitPixelData(mriB64[2]), get8bitPixelData(mriB64[3]), get8bitPixelData(mriB64[4]), get8bitPixelData(mriB64[5])];

    var petAxialInputData = [...Array(91).keys()].map((v,i)=>(getPixelData(this.state.AinputB64[i])));
    var petCoronalInputData = [...Array(109).keys()].map((v,i)=>(getPixelData(this.state.CinputB64[i])));
    var petSagittalInputData = [...Array(91).keys()].map((v,i)=>(getPixelData(this.state.SinputB64[i])));

    var brainAxialInputData = [...Array(91).keys()].map((v,i)=>(getPixelData(this.state.AIbrainB64[i])));
    var brainCoronalInputData = [...Array(109).keys()].map((v,i)=>(getPixelData(this.state.CIbrainB64[i])));
    var brainSagittalInputData = [...Array(91).keys()].map((v,i)=>(getPixelData(this.state.SIbrainB64[i])));

    var petAxialOutputData = [...Array(91).keys()].map((v,i)=>(getPixelData(this.state.AoutputB64[i])));
    var petCoronalOutputData = [...Array(109).keys()].map((v,i)=>(getPixelData(this.state.CoutputB64[i])));
    var petSagittalOutputData = [...Array(91).keys()].map((v,i)=>(getPixelData(this.state.SoutputB64[i])));

    var brainAxialOutputData = [...Array(91).keys()].map((v,i)=>(getPixelData(this.state.AbrainB64[i])));
    var brainCoronalOutputData = [...Array(109).keys()].map((v,i)=>(getPixelData(this.state.CbrainB64[i])));
    var brainSagittalOutputData = [...Array(91).keys()].map((v,i)=>(getPixelData(this.state.SbrainB64[i])));

    function getBRAINImage(imageId) {
      let identifier=imageId.split('/')
      let Type = identifier[identifier.length-3]
      let Direction = identifier[identifier.length-2]
      let ID = identifier[identifier.length-1]
      let width = 91;
      let height = 91;
      if (Direction === "axial"){width = 91; height = 109}
      else if (Direction === "coronal"){width = 91; height = 91}
      else if (Direction === "sagittal"){width = 109; height = 91}

      var image = {
        imageId: imageId,

        minPixelValue : 0,
        maxPixelValue : 32767,
        slope: 1.0,
        intercept: 0,
        windowCenter : 16383,
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
        if (Type === "input"){
          if (Direction === "axial"){return brainAxialInputData[ID]}
          else if (Direction === "coronal"){return brainCoronalInputData[ID]}
          else if (Direction === "sagittal"){return brainSagittalInputData[ID]}
        }
        else if (Type === "output"){
          if (Direction === "axial"){return brainAxialOutputData[ID]}
          else if (Direction === "coronal"){return brainCoronalOutputData[ID]}
          else if (Direction === "sagittal"){return brainSagittalOutputData[ID]}
        }

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
      let identifier=imageId.split('/')
      let Type = identifier[identifier.length-3]
      let Direction = identifier[identifier.length-2]
      let ID = identifier[identifier.length-1]
      let width = 91;
      let height = 91;
      if (Direction === "axial"){width = 91; height = 109}
      else if (Direction === "sagittal"){width = 109; height = 91}
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
        if (Type === "input"){
          if (Direction === "axial"){return petAxialInputData[ID]}
          else if (Direction === "coronal"){return petCoronalInputData[ID]}
          else if (Direction === "sagittal"){return petSagittalInputData[ID]}
        }
        else if (Type === "output"){
          if (Direction === "axial"){return petAxialOutputData[ID]}
          else if (Direction === "coronal"){return petCoronalOutputData[ID]}
          else if (Direction === "sagittal"){return petSagittalOutputData[ID]}
        }
        throw "unknown imageId";
      }

      return {
        promise: new Promise((resolve) => {
          resolve(image);
        }),
        cancelFn: undefined
      };
    }

    function getINPUTMRIImage(imageId) {

      var width = 91;
      var height = 91;

      var image = {
        imageId: imageId,

        minPixelValue : 0,
        maxPixelValue : 32767,
        slope: 1.0,
        intercept: 0,
        windowCenter : 16383,
        windowWidth : 32767,
        getPixelData: getPixelData,
        rows: height,
        columns: width,
        height: height,
        width: width,
        color: false,
        columnPixelSpacing: 1,
        rowPixelSpacing: 1,
        sizeInBytes: width * height * 2,
      };

      function getPixelData()
      {
        // console.log(ct1PixelData.length);
        if (imageId == 'inputmri://0') {
          // console.log("mri://0");
          return mriPixelData[0];
        } else if (imageId == 'inputmri://1') {
          // console.log("mri://1");
          return mriPixelData[1];
        } else if (imageId == 'inputmri://2') {
          // console.log("mri://2");
          return mriPixelData[2];
        } else if (imageId == 'inputmri://3') {
          // console.log("mri://3");
          return mriPixelData[3];
        } else if (imageId == 'inputmri://4') {
          // console.log("mri://4");
          return mriPixelData[4];
        } else if (imageId == 'inputmri://5') {
          // console.log("mri://5");
          return mriPixelData[5];
        }

        throw "unknown imageId";
      }


      return {
        promise: new Promise((resolve) => {
          resolve(image);
        }),
        cancelFn: undefined
      };
    }

    cornerstone.registerImageLoader('brain', getBRAINImage);
    cornerstone.registerImageLoader('pet', getPETImage);
  };


  metaDataLoader = async () => {

    "use strict";

    console.log("2.5");
    function metaDataProvider(type, imageId) {

      let identifier=imageId.split('/')
      // console.log(identifier)
      let Device = identifier[0].substr(0,identifier[0].length-1)
      let Type = identifier[identifier.length-3]
      let Direction = identifier[identifier.length-2]
      let ID = identifier[identifier.length-1]
      let width = 91;
      let height = 91;
      if (Direction === "axial"){width = 91; height = 109}
      else if (Direction === "coronal"){width = 91; height = 91}
      else if (Direction === "sagittal"){width = 109; height = 91}

      if (type === 'imagePlaneModule') {
        if (Device === "pet"){
          if (Type === "input"){
            // if (Direction === "coronal")
            {
              // console.log("Device: ",Device, " ID: ", ID, " Direction: ", Direction, " w/h: ", width,"/",height)
              return {
                frameOfReferenceUID: "1.3.6.1.4.1.5962.99.1.2237260787.1662717184.1234892907507.1411.0",
                rows: width,
                columns: height,
                rowCosines: [1, 0, 0],
                columnCosines: [0, 1, 0],
                imagePositionPatient: [-250, -250, -399+Number(ID)],
                rowPixelSpacing: 2,
                columnPixelSpacing: 2
              };
            }
          } else if (Type === "output"){
            // if (Direction === "coronal")
            {
              // console.log("Device: ",Device, " ID: ", ID, " Direction: ", Direction, " w/h: ", width,"/",height)
              return {
                frameOfReferenceUID: "1.3.6.1.4.1.5962.99.1.2237260787.1662717184.1234892907507.1411.0",
                rows: width,
                columns: height,
                rowCosines: [1, 0, 0],
                columnCosines: [0, 1, 0],
                imagePositionPatient: [-250, -250, -399+Number(ID)],
                rowPixelSpacing: 2,
                columnPixelSpacing: 2
              };
            }
          }
        }
        else if (Device === "brain"){
          if (Type === "input"){
            // if (Direction === "coronal")
            {
              // console.log("Device: ",Device, " ID: ", ID, " Direction: ", Direction, " w/h: ", width,"/",height)
              return {
                frameOfReferenceUID: "1.3.6.1.4.1.5962.99.1.2237260787.1662717184.1234892907507.1411.0",
                rows: width,
                columns: height,
                rowCosines: [1, 0, 0],
                columnCosines: [0, 1, 0],
                imagePositionPatient: [-250, -250, -399+Number(ID)],
                rowPixelSpacing: 2,
                columnPixelSpacing: 2
              };
            }
          }
          if (Type === "output"){
            // if (Direction === "coronal")
            {
              // console.log("Device: ",Device, " ID: ", ID, " Direction: ", Direction, " w/h: ", width,"/",height)
              return {
                frameOfReferenceUID: "1.3.6.1.4.1.5962.99.1.2237260787.1662717184.1234892907507.1411.0",
                rows: width,
                columns: height,
                rowCosines: [1, 0, 0],
                columnCosines: [0, 1, 0],
                imagePositionPatient: [-250, -250, -399+Number(ID)],
                rowPixelSpacing: 2,
                columnPixelSpacing: 2
              };
            }
          }
        }

      }
    }

    cornerstone.metaData.addProvider(metaDataProvider);

  };
}