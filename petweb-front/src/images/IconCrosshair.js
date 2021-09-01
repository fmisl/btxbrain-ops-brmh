import React from 'react';

export default function IconCrosshair(props){
  return (
<svg className={props.className} width={props.size} height={props.size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5 25.2495H35" stroke={props.stroke} stroke-width="2"/>
<path d="M25.25 5L25.25 35" stroke={props.stroke} stroke-width="2"/>
</svg>

  )
}