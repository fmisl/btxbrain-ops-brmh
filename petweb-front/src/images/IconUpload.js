import React from 'react';

export default function IconUpload(props){
  return (
<svg className={props.className} width={props.size} height={props.size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10 20V30H30V20" stroke={props.stroke} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M15.6001 13.4L20.0001 9L24.4001 13.4" stroke={props.stroke} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M20 9V24" stroke={props.stroke} stroke-width="1.5" stroke-linecap="round"/>
</svg>

  )
}