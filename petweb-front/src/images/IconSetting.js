import React from 'react';

export default function IconSetting(props){
  return (
<svg width={props.size} height={props.size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M25.0367 9.96409C25.4832 9.96409 25.8959 10.2023 26.1192 10.5891L31.1786 19.3522C31.4019 19.739 31.4019 20.2155 31.1786 20.6022L26.1192 29.3654C25.8959 29.7521 25.4832 29.9904 25.0367 29.9904L14.9179 29.9904C14.4713 29.9904 14.0586 29.7521 13.8353 29.3654L8.77594 20.6022C8.55264 20.2155 8.55264 19.739 8.77594 19.3522L13.8353 10.5891C14.0586 10.2023 14.4713 9.9641 14.9179 9.9641L25.0367 9.96409Z" stroke={props.stroke} stroke-width="1.5"/>
<circle cx="20.002" cy="20.002" r="4.66261" stroke={props.stroke} stroke-width="1.5"/>
</svg>

  )
}