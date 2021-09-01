import React from 'react';

export default function IconAnalysis(props){
  return (
<svg className={props.className} width={props.size} height={props.size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10 24V30" stroke={props.stroke} stroke-width="1.8" stroke-linecap="round"/>
<path d="M16 19L16 30" stroke={props.stroke} stroke-width="1.8" stroke-linecap="round"/>
<path d="M23 10L23 30" stroke={props.stroke} stroke-width="1.8" stroke-linecap="round"/>
<path d="M30 14L30 30" stroke={props.stroke} stroke-width="1.8" stroke-linecap="round"/>
</svg>

  )
}