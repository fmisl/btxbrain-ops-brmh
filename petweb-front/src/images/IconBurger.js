import React from 'react';

export default function IconBurger(props){
  return (
<svg className={props.className} width={props.size} height={props.size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.50098 11.9609H30.0002" stroke={props.stroke} stroke-width="2"/>
<path d="M9.50098 20H30.0002" stroke={props.stroke} stroke-width="2"/>
<path d="M9.50098 28.0386H30.0002" stroke={props.stroke} stroke-width="2"/>
</svg>

  )
}