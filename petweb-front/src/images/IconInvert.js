import React from 'react';

export default function IconInvert(props){
  return (
<svg className={props.className} width={props.size} height={props.size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.70711 20L19.9999 4.7072L20.5 5.20715V34.7929L19.9999 35.2928L4.70711 20Z" stroke={props.stroke}/>
<path d="M36 20L20.0001 35.9999V20V4.00014L36 20Z" fill="white"/>
</svg>

  )
}