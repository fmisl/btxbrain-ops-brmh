import React from 'react';

export default function IconWorklist(props){
  return (
<svg className={props.className} width={props.size} height={props.size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M25.416 19.9157H14.4161" stroke={props.stroke} stroke-width="1.5" stroke-linecap="round"/>
<path d="M19.9161 25.4157L19.9161 14.4158" stroke={props.stroke} stroke-width="1.5" stroke-linecap="round"/>
<circle cx="20" cy="20" r="10.25" stroke={props.stroke} stroke-width="1.5"/>
</svg>

  )
}