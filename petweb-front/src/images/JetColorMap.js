import React from 'react';

export default function JetColorMap(props){
  return (
<svg  style={{width:props.width, height:"12px"}} viewBox="0 0 490 8" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="490" height="8" rx="4" fill="url(#paint0_linear)"/>
  <defs>
    <linearGradient id="paint0_linear" x1="490" y1="7.99991" x2="-1.18305e-05" y2="7.99919" gradientUnits="userSpaceOnUse">
      <stop stop-color="#FF1620"/>
      <stop offset="0.140625" stop-color="#F6841D"/>
      <stop offset="0.28125" stop-color="#FFEF00"/>
      <stop offset="0.489583" stop-color="#0B9811"/>
      <stop offset="0.729167" stop-color="#000EEC"/>
      <stop offset="0.817708" stop-color="#0100A2"/>
      <stop offset="1" stop-color="#00000A"/>
    </linearGradient>
  </defs>
</svg>

  )
}