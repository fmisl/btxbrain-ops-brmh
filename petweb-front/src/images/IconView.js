import React from 'react';

export default function IconView(props){
  return (
<svg className={props.className} width={props.size} height={props.size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M10.5 25.119V10.5H20.7381V13.0337C20.9891 13.0114 21.2432 13 21.5 13C21.7487 13 21.9948 13.0107 22.2381 13.0316V10C22.2381 9.44772 21.7904 9 21.2381 9H10C9.44772 9 9 9.44772 9 10V25.619C9 26.1713 9.44771 26.619 10 26.619H14.7137C14.3624 26.154 14.0577 25.6517 13.8067 25.119H10.5Z" fill={props.stroke}/>
<circle cx="21.5713" cy="21.5713" r="6.25" stroke={props.stroke} stroke-width="1.5"/>
<path d="M30.4698 31.5304C30.7627 31.8233 31.2376 31.8233 31.5304 31.5304C31.8233 31.2376 31.8233 30.7627 31.5304 30.4698L30.4698 31.5304ZM24.9936 26.0543L30.4698 31.5304L31.5304 30.4698L26.0543 24.9936L24.9936 26.0543Z" fill={props.stroke}/>
</svg>

  )
}