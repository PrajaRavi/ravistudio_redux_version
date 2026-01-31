import React, { useEffect, useRef } from 'react'
import {useSelector} from "react-redux"
function MusicVisualizer() {
  const canvasRef=useRef();
    const isPlaying = useSelector((state) => state.Song.isPlaying);
  
  useEffect(()=>{
if(isPlaying){
   audio.current.src = `http://localhost:4500/${realsongname}`;
    audio.current.crossOrigin = "anonymous";
    // alert(image)
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const analyserNode = audioCtx.createAnalyser();
    const sourceNode = audioCtx.createMediaElementSource(audio.current);

    sourceNode.connect(analyserNode);
    analyserNode.connect(audioCtx.destination);
    setAnalyser(analyserNode);

    // Setup canvas
    if(IsWindowUser){

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const draw = () => {
      const bufferLength = analyserNode.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserNode.getByteFrequencyData(dataArray);
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      if(window.innerWidth>=640){
        
        radius=(window.innerWidth/window.outerWidth)*100;
      }
      else{
        radius=100;
      }
      
      const bars = 128;
      
      for (let i = 0; i < bars; i++) {
        const angle = (i * 2 * Math.PI) / bars;
        if(window.innerWidth<=640){
          
          //  barLength = 30;
       barLength=dataArray[i] * 0.3;

        }
        else{
       barLength=dataArray[i] * 1;
      }
        
        const x1 = cx + Math.cos(angle) * radius;
        const y1 = cy + Math.sin(angle) * radius;
        const x2 = cx + Math.cos(angle) * (radius + barLength);
        const y2 = cy + Math.sin(angle) * (radius + barLength);
        
        const hue = (i * 360) / bars;
        ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      
      requestAnimationFrame(draw);
    };
    
    draw();
    
  }

    
    
    // Setup canvas
  else{

    const canvas1 = canvasRef1.current;
    const ctx1 = canvas1.getContext("2d");
    canvas1.width = window.innerWidth;
    canvas1.height = window.innerHeight;
    
    const draw1 = () => {
      const bufferLength = analyserNode.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserNode.getByteFrequencyData(dataArray);
      
      ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
      
      const cx = canvas1.width / 2;
      const cy = canvas1.height / 2;
      if(window.innerWidth>=640){
        
        radius=(window.innerWidth/window.outerWidth)*100;
      }
      else{
        radius=100;
      }
      
      const bars = 128;
      
      for (let i = 0; i < bars; i++) {
        const angle = (i * 2 * Math.PI) / bars;
        if(window.innerWidth<=640){
          
          //  barLength = 30;
       barLength=dataArray[i] * 0.3;

        }
        else{
       barLength=dataArray[i] * 1.2;
        }
        
        const x1 = cx + Math.cos(angle) * radius;
        const y1 = cy + Math.sin(angle) * radius;
        const x2 = cx + Math.cos(angle) * (radius + barLength);
        const y2 = cy + Math.sin(angle) * (radius + barLength);
        
        const hue = (i * 360) / bars;
        ctx1.strokeStyle = `hsl(${hue}, 100%, 50%)`;
        ctx1.lineWidth = 2;
        ctx1.beginPath();
        ctx1.moveTo(x1, y1);
        ctx1.lineTo(x2, y2);
        ctx1.stroke();
      }
      
      requestAnimationFrame(draw1);
    };
    
    draw1();
    
    
  }  
    
    // audio.current.src=`http://localhost:4500/${name}`;
    audio.current.play();
    // WhichSongIsPlaying();
    
    
    
  }
},[songplaying])

  return (
    <>
    <canvas  ref={canvasRef} className={`fixed  w-[90%] h-[90vh]  top-[4vh] lg:left-[0%] md:left-[20%] sm:left-[0%]    z-[-20]`} />
     
    </>
  )
}

export default MusicVisualizer
