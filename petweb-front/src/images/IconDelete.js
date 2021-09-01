import React from 'react';

export default function IconDelete(props){
  return (
<svg className={props.className} width={props.size} height={props.size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0)">
<path d="M27.7001 12.8501L12.8501 27.7001" stroke={props.stroke} stroke-width="1.5" stroke-linecap="round"/>
<path d="M27.7002 27.7001L12.8502 12.8501" stroke={props.stroke} stroke-width="1.5" stroke-linecap="round"/>
</g>
<defs>
<clipPath id="clip0">
<rect width="40" height="40" fill="white"/>
</clipPath>
</defs>
</svg>

  )
}