import React from 'react';
/** Host the supplied web/ directory at the ROOT of a dedicated HTTPS origin. */
export default function HoloLabEmbed({labUrl,showModel=false}) {
 let url;try{url=new URL(labUrl);if(url.protocol!=='https:')throw Error();}catch{return <p>Cấu hình labUrl bằng địa chỉ HTTPS của HoloLab đã triển khai.</p>;}
 const src=new URL(showModel?'/egad-pilot.html':'/',url.origin).href;
 return <iframe title={showModel?'EGAD thử nghiệm':'HoloLab thực hành bằng chuột'} src={src} allow="camera; fullscreen" allowFullScreen style={{width:'100%',height:'85vh',minHeight:600,border:0,borderRadius:12}}/>;
}
