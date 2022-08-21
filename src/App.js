import {
  createFFmpeg, 
  fetchFile
} from '@ffmpeg/ffmpeg'

import {
  useState,
  useEffect
} from 'react'

import './App.css';


const ffmpeg = createFFmpeg({log: true})
function App() {
  const [ready, setReady] = useState()
  const [start, setStart] = useState()
  const [end, setEnd] = useState()
  const [video, setVideo] = useState()
  const [duration, setDuration] = useState()
  const [loading, setLoading] = useState()
  const [gif, setGif] = useState()
  const [gifVideo, setGifVideo] = useState()

  async function handleTrim(){
    
    ffmpeg.FS('writeFile', 'video.mp4', await fetchFile(video));
    
    await ffmpeg.run('-i', 'video.mp4', '-ss', `00:00:${start}`, '-to', `00:00:${end}`, 'videoTrimmed.mp4');
    const data = ffmpeg.FS('readFile', 'videoTrimmed.mp4')
    setVideo(data.buffer)
    // const url = await URL.createObjectURL(new Blob([data.buffer], {type:'video/mp4'})) 
    // setVideo(url)
  }

  async function handleGif(){
    if(gif) {
      ffmpeg.FS('writeFile', 'video.mp4', await fetchFile(video));
      ffmpeg.FS('writeFile', 'cat.gif', await fetchFile(gif));
      await ffmpeg.run('-y', '-i', 'video.mp4', '-stream_loop', '-1', '-i', 'cat.gif', '-filter_complex', '[0]overlay=x=0:y=0:shortest=1[out]', '-map', '[out]', '-map', '0:a?', 'videoGif.mp4')
      const data = ffmpeg.FS('readFile', 'videoGif.mp4')
      setVideo(data.buffer)
    } else {
      alert("UPLOAD A GIF")
    }
  }

  async function convert2Gif(){
    ffmpeg.FS('writeFile', 'video.mp4', await fetchFile(video));
    await ffmpeg.run('-i', 'video.mp4', '-t', '2.5', '-ss', '2.0', '-f', 'gif', 'gifVideo.gif')
    const data = ffmpeg.FS('readFile', 'gifVideo.gif')
    setGifVideo(data.buffer)
  }

  const load = async () => {
    await ffmpeg.load();
    setReady(true);

  }

  useEffect(()=> {
    load();
  },[])

  return (
    <div className="mainContainer">
      <div className="editorContainer">
        <input type="file" onChange={(e) => setVideo(e.target.files?.item(0))}>

        </input>

        <button className="btn" onClick={(event)=> {
          handleTrim()
        }}>TRIM</button>

        <p>Start: {start}</p>
        <div className="sliderContainerStart">
          <input type="range" min="0" max={Math.floor(duration)-1} className="sliderStart" id="myRange"
            value={start} 
            onChange={e => {
                setStart(e.target.value)
            }}
          />
        </div>


        <p>End: {end}</p>
        <div className="sliderContainerEnd">
          <input type="range" min="1" max={Math.floor(duration)} class="sliderEnd" id="myRange"
            value={end} 
            onChange={e => {
                setEnd(e.target.value)
            }}
          />
        </div>

        <input className="in" type="file" onChange={(e) => setGif(e.target.files?.item(0))}>
            
        </input>
        <image src={gif}></image>
        <button className="btn" onClick={(event)=> {
          handleGif()
        }}>ADD GIF</button>

        <button className="btn" onClick={(event)=> {
          convert2Gif()
        }}>CONVERT TO GIF</button>
      </div>

      <div className="mediaContainer">
      <video src={URL.createObjectURL(new Blob([video], {"type:": "video/mp4"}))} id="myVideo" width="750" height="500"  
        onLoadedMetadata={(event)=>{
          let dur = document.getElementById("myVideo").duration
          console.log("DURATION", dur)
          setDuration(dur)
        }}
        controls
      >
      </video>                      
      {gifVideo ? <img width="400" height="200" src={URL.createObjectURL(new Blob([gifVideo], { type: 'image/gif' }))}></img> : null}
      </div>

    </div>
  )
}

export default App;
