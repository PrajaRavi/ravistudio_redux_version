import React from 'react'
import SingerHorizontalScroll from './SingerSection'
import { useDispatch,useSelector } from 'react-redux'
import PlaylistSection from './PlaylistSection'
import Footer from './Footer'
import UserPlaylistSection from './UserPlaylist'
function Home() {
  return (
    <>
    <div className=' w-full  justify-items-center min-h-screen   items-center '>
    <div className='w-full h-[70px] '>

    </div>
    <SingerHorizontalScroll   heading={"Popular Singer"}/>
    <PlaylistSection heading={"New Released Song"}/>
    <PlaylistSection heading={"Feature Playlist"}/>
    <PlaylistSection heading={"Feature Playlist"}/>
    <UserPlaylistSection heading={"My Playlist"}/>
    {/* <SingerHorizontalScroll heading={"New Released Song"}/> */}
    {/* <SingerHorizontalScroll heading={"Feature Playlist"}/> */}
    <Footer/>
     <div className='w-full h-[90px] '>

    </div>
    </div>
      
    </>
  )
}

export default Home
