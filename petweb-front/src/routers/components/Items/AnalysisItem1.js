import React, { Component } from 'react'
import '../../../App.css'
import BrainImage from '../../../images/BrainImage';
import JetColorMap from '../../../images/JetColorMap'
let colormap = require('colormap')

let colors = colormap({
  colormap: 'jet',
  nshades: 101,
  format: 'hex',
  alpha: 1
})
export default class AnalysisItem1 extends Component {
  render() {
    const {subRegion} = this.props;
    // console.log(colors)
    const maxSUVR = 1;
    const globalR = subRegion.Global;
    const globalL = subRegion.Global;
    const frontalR = subRegion.Frontal_R;
    const frontalL = subRegion.Frontal_L;
    const parietalR = subRegion.Parietal_R;
    const parietalL = subRegion.Parietal_L;
    const temporalR = subRegion.Lateral_temporal_R;
    const temporalL = subRegion.Lateral_temporal_L;
    const occipitalR = subRegion.Occipital_R;
    const occipitalL = subRegion.Occipital_L;

    const globalRPercentile = Math.round(Math.min(100,Math.max(0,subRegion.Global-1.1)/maxSUVR*100));
    const globalLPercentile = Math.round(Math.min(100,Math.max(0,subRegion.Global-1.1)/maxSUVR*100));
    const frontalRPercentile = Math.round(Math.min(100,Math.max(0,subRegion.Frontal_R-1.1)/maxSUVR*100));
    const frontalLPercentile = Math.round(Math.min(100,Math.max(0,subRegion.Frontal_L-1.1)/maxSUVR*100));
    const parietalRPercentile = Math.round(Math.min(100,Math.max(0,subRegion.Parietal_R-1.1)/maxSUVR*100));
    const parietalLPercentile = Math.round(Math.min(100,Math.max(0,subRegion.Parietal_L-1.1)/maxSUVR*100));
    const temporalRPercentile = Math.round(Math.min(100,Math.max(0,subRegion.Lateral_temporal_R-1.1)/maxSUVR*100));
    const temporalLPercentile = Math.round(Math.min(100,Math.max(0,subRegion.Lateral_temporal_L-1.1)/maxSUVR*100));
    const occipitalRPercentile = Math.round(Math.min(100,Math.max(0,subRegion.Occipital_R-1.1)/maxSUVR*100));
    const occipitalLPercentile = Math.round(Math.min(100,Math.max(0,subRegion.Occipital_L-1.1)/maxSUVR*100));

    console.log(frontalLPercentile)
    return (
      <React.Fragment>
          <div className="analysis-box1-content">
            <div>
              <div style={{height:"120px", width:"120px"}}>
                <BrainImage className="BrainImage" region="global" color={colors[Math.round((globalRPercentile+globalLPercentile)/2)]}/>
                Global Lobe
              </div>
              <div style={{height:"100%", width:"520px"}}>
                <div className="analysis-score" style={{display:"flex", alignItems:"center", justifyContent:"flex-end", height:"100%", width:`${globalLPercentile}%`, minWidth:"45px", borderRight:`10px ${colors[globalLPercentile]} solid`}}>
                  L R
                  <br/>
                  {globalL?.toFixed(2)}
                </div>
              </div>
            </div>
            <div>
              <div style={{height:"120px", width:"120px"}}>
                <BrainImage className="BrainImage" region="frontal" color={colors[Math.round((frontalRPercentile+frontalLPercentile)/2)]}/>
                Frontal Lobe
              </div>
              <div style={{height:"100%", width:"520px"}}>
                <div className="analysis-score" style={{width:`${frontalLPercentile}%`, minWidth:"45px", borderRight:`10px ${colors[frontalLPercentile]} solid`}}>
                  L
                  <br/>
                  {frontalL?.toFixed(2)}
                </div>
                <div className="analysis-score" style={{width:`${frontalRPercentile}%`, minWidth:"45px", borderRight:`10px ${colors[frontalRPercentile]} solid`}}>
                  R
                  <br/>
                  {frontalR?.toFixed(2)}
                </div>
              </div>
            </div>
            <div>
              <div style={{height:"120px", width:"120px"}}>
                <BrainImage className="BrainImage" region="parietal" color={colors[Math.round((parietalRPercentile+parietalLPercentile)/2)]}/>
                Parietal Lobe
              </div>
              <div style={{height:"100%", width:"520px"}}>
                <div className="analysis-score" style={{width:`${parietalLPercentile}%`, minWidth:"45px", borderRight:`10px ${colors[parietalLPercentile]} solid`}}>
                  L
                  <br/>
                  {parietalL?.toFixed(2)}
                </div>
                <div className="analysis-score" style={{width:`${parietalRPercentile}%`, minWidth:"45px", borderRight:`10px ${colors[parietalRPercentile]} solid`}}>
                  R
                  <br/>
                  {parietalR?.toFixed(2)}
                </div>
              </div>
            </div>
            <div>
              <div style={{height:"120px", width:"120px"}}>
                <BrainImage className="BrainImage" region="temporal" color={colors[Math.round((temporalRPercentile+temporalLPercentile)/2)]}/>
                Temporal Lobe
              </div>
              <div style={{height:"100%", width:"520px"}}>
                <div className="analysis-score" style={{width:`${temporalLPercentile}%`, minWidth:"45px", borderRight:`10px ${colors[temporalLPercentile]} solid`}}>
                  L
                  <br/>
                  {temporalL?.toFixed(2)}
                </div>
                <div className="analysis-score" style={{width:`${temporalRPercentile}%`, minWidth:"45px", borderRight:`10px ${colors[temporalRPercentile]} solid`}}>
                  R
                  <br/>
                  {temporalR?.toFixed(2)}
                </div>
              </div>
            </div>
            <div style={{borderBottom:"2px #2A2E31 solid"}}>
              <div style={{height:"120px", width:"120px"}}>
                <BrainImage className="BrainImage" region="occipital" color={colors[Math.round((occipitalRPercentile+occipitalLPercentile)/2)]}/>
                Occipital Lobe
              </div>
              <div style={{height:"100%", width:"520px", border: "0px red solid", boxSizing:"border-box"}}>
                <div className="analysis-score" style={{width:`${occipitalLPercentile}%`, minWidth:"45px", borderRight:`10px ${colors[occipitalLPercentile]} solid`}}>
                  L
                  <br/>
                  {occipitalL?.toFixed(2)}
                </div>
                <div className="analysis-score" style={{width:`${occipitalRPercentile}%`, minWidth:"45px", borderRight:`10px ${colors[occipitalRPercentile]} solid`}}>
                  R
                  <br/>
                  {occipitalR?.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column", alignItems:"flex-end", width:"690px"}}>
            <div style={{width:"560px", border: "0px red solid", boxSizing:"border-box"}}><JetColorMap width={"560px"}/></div>
            <div style={{width:"650px", display:"flex", justifyContent:"space-between", border: "0px red solid", boxSizing:"border-box"}}>
              <div style={{border: "0px red solid", boxSizing:"border-box"}}>SUVR</div>
              <div style={{border: "0px red solid", boxSizing:"border-box"}}>&emsp;&emsp;1.1</div>
              <div style={{border: "0px red solid", boxSizing:"border-box"}}>1.3</div>
              <div style={{border: "0px red solid", boxSizing:"border-box"}}>1.5</div>
              <div style={{border: "0px red solid", boxSizing:"border-box"}}>1.7</div>
              <div style={{border: "0px red solid", boxSizing:"border-box"}}>1.9</div>
              <div style={{border: "0px red solid", boxSizing:"border-box"}}>2.1</div>
              {/* <div style={{border: "0px red solid", boxSizing:"border-box"}}>2.6</div>
              <div style={{border: "0px red solid", boxSizing:"border-box"}}>3.0</div> */}
              {/* SUVR &emsp;&emsp;&emsp;&emsp;&emsp;1.0&emsp;&emsp;&emsp;&emsp;&ensp;1.2&emsp;&emsp;&emsp;&emsp;&ensp;1.4&emsp;&emsp;&emsp;&emsp;&ensp;1.6&emsp;&emsp;&emsp;&emsp;&ensp;1.8&emsp;&emsp;&emsp;&emsp;&ensp;2.0 */}
            </div>
        </div>
      </React.Fragment>
    )
  }
}
