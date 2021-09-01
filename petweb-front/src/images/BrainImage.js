import React from 'react';
import brainStroke from './brainStroke.png';

export default function BrainImage(props){
  // console.log(props.color)
  return (
    <div style={{position:"relative", height:"85%", transform:"scaleX(-1)"}}>
      <svg style={{position:"absolute", top:"7%", left:"5px"}} className={props.className} id="layer_1" data-name="layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 75.9" >
        <title>brainRegions</title>
        {props.region === "global" ? 
          <React.Fragment>
            <path style={{fill:`${props.color}`}} d="M21.3,43.5l-2,3H12.8L7.8,45,4.3,42l-2-4-.9-6V27l1.9-7,3-4,3-4,4-3,4-3,3.5-1.5,6-2,7.5-1.4h16l3.5.5,4.5.9L60.2,4,56.8,5.5,55.3,7l-3,1L49.8,9l-2,2v1.5l1,2-2,.5-3,1-2.5,2.5-2,4.5v4l1.5,3.5L40.3,33l-.5,2-4,1.5h-4l-4,1.5Z"/>
            <path style={{fill:`${props.color}`}} d="M57.2,4.8l3-1.6,9.1,4.1,7.6,7.1,5.5,7,4,7.6a12.4,12.4,0,0,1-2.5,3.6c-1.2,1.2-3.5,1-4.5.5l-.5,1-2,1.5H74.3l-3.5-1.5-3-3.6v1a29.7,29.7,0,0,1-2.5,4.1c-1.2,1.6-4.4-1.2-5.6-2.5l-1-2.6L55.2,29h-4l-6.1,2.5-5.5,3.6,1-4.6-1.5-4,.5-5.1,2.5-4,3-1.5,3.6-1.5-1-3.1,3-3,4.5-1Z"/>
            <path style={{fill:`${props.color}`}} d="M21.9,42.8l-2,3.6,1,5.5,1,4.1,5,4,7.5,1.1,8-1.1,9.5-4h4.6L62,54h8.5l2-2.1,1.5-4,3.5,1A6.4,6.4,0,0,0,82,46.4c1.6-2.1-.7-4.3-2-5.1V33.2l-4.5,2-4-2-3-3.1A20.8,20.8,0,0,1,66,33.2c-1.2,1.2-4.9-.5-6.5-1.5l-3-3.1H50.4l-7,4.6-5.5,3h-7l-4,2.6Z"/>
            <path style={{fill:`${props.color}`}} d="M78.1,56.7l-6.7-1.6-1.1-2,3.6-4.2H76c.7,0,2.7-.5,5.2-2.6s-1.1-3.6-3.1-4.1l2-4.7V32.4s3.1.7,3.7,0l3.1-2.1,2.6,7.2v7.3l-2.6,6.7-3.1,3.6Z"/>
          </React.Fragment>
          : 
          <React.Fragment>
            <path style={{fill:`${props.region == "frontal" ? `${props.color}`:"transparent"}`}} d="M21.3,43.5l-2,3H12.8L7.8,45,4.3,42l-2-4-.9-6V27l1.9-7,3-4,3-4,4-3,4-3,3.5-1.5,6-2,7.5-1.4h16l3.5.5,4.5.9L60.2,4,56.8,5.5,55.3,7l-3,1L49.8,9l-2,2v1.5l1,2-2,.5-3,1-2.5,2.5-2,4.5v4l1.5,3.5L40.3,33l-.5,2-4,1.5h-4l-4,1.5Z"/>
            <path style={{fill:`${props.region == "parietal" ? `${props.color}`:"transparent"}`}} d="M57.2,4.8l3-1.6,9.1,4.1,7.6,7.1,5.5,7,4,7.6a12.4,12.4,0,0,1-2.5,3.6c-1.2,1.2-3.5,1-4.5.5l-.5,1-2,1.5H74.3l-3.5-1.5-3-3.6v1a29.7,29.7,0,0,1-2.5,4.1c-1.2,1.6-4.4-1.2-5.6-2.5l-1-2.6L55.2,29h-4l-6.1,2.5-5.5,3.6,1-4.6-1.5-4,.5-5.1,2.5-4,3-1.5,3.6-1.5-1-3.1,3-3,4.5-1Z"/>
            <path style={{fill:`${props.region == "temporal" ? `${props.color}`:"transparent"}`}} d="M21.9,42.8l-2,3.6,1,5.5,1,4.1,5,4,7.5,1.1,8-1.1,9.5-4h4.6L62,54h8.5l2-2.1,1.5-4,3.5,1A6.4,6.4,0,0,0,82,46.4c1.6-2.1-.7-4.3-2-5.1V33.2l-4.5,2-4-2-3-3.1A20.8,20.8,0,0,1,66,33.2c-1.2,1.2-4.9-.5-6.5-1.5l-3-3.1H50.4l-7,4.6-5.5,3h-7l-4,2.6Z"/>
            <path style={{fill:`${props.region == "occipital" ? `${props.color}`:"transparent"}`}} d="M78.1,56.7l-6.7-1.6-1.1-2,3.6-4.2H76c.7,0,2.7-.5,5.2-2.6s-1.1-3.6-3.1-4.1l2-4.7V32.4s3.1.7,3.7,0l3.1-2.1,2.6,7.2v7.3l-2.6,6.7-3.1,3.6Z"/>
          </React.Fragment>
        }
      </svg>
      <img style={{position:"absolute", top:"7%", left:"5px"}} src={brainStroke} className={props.className} />
    </div>
  )
}