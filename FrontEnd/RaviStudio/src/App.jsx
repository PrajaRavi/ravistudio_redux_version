import React, { useEffect } from 'react'
import MusicNavbar from './components/Navbar'
import { RiverThemeUnderwater } from './components/RiverTheme'
import BottomMusicPlayer from './components/MusicPlayer'
import { BrowserRouter,Routes,Route } from "react-router-dom"
let interval;
import Home from './components/Home'
import ContactUs from './components/Contact'
import AddPlaylist from './components/AddPlaylist'
import AdminDashboard from './components/Admin'
import SignUpPage from './components/SignUp'
import SignInPage from './components/SignIn'
import PlaylistSongs from './components/ShowSong'
import LanguageSelectionPage from './components/LanguageSelect'
import OTPVerification from './components/OTPVerification'
import { SetCurrUser, SetLogin } from './Redux/Slices/User.slice'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import FullScreenLoader from './components/FetchUserLoading'
import { GetUser } from './Redux/Thunk/User.thunk'
import Layout1 from './components/layout/layout1'
import Favourite from './components/Favourite'
function App() {
const dispatch=useDispatch()
const FetchUserLoading=useSelector(state=>state.User.GetUserLoading)
const IsUserLogin=useSelector(state=>state.User.IsUserLogin)

async function RefreshToken(){
  axios.defaults.withCredentials=true
            let {data}=await axios.post(`http://localhost:4500/user/refresh-token/`,{withCredentials:true}).
            catch(err=>console.log(err.message))
            console.log(data)
          }
          
            
             
        

  useEffect(()=>{
   
    if(localStorage.getItem("CurrUser")){
      
      dispatch(SetLogin(true))  
       interval=setInterval(RefreshToken,2000)
    }
    else{
      dispatch(SetLogin(false))
    }
return ()=>{
  clearInterval(interval)
}
  },[])
  useEffect(()=>{
    dispatch(GetUser())
   },[IsUserLogin])
  return (
    <>
    <RiverThemeUnderwater>
<BrowserRouter>
{FetchUserLoading?<FullScreenLoader/>:null}

<MusicNavbar/>

<Routes>

     <Route path='/' element={<Home/>}/>
     <Route path='/contact' element={<ContactUs/>}/>
     <Route path='/addplaylist' element={<AddPlaylist/>}/>
     <Route path='/admin' element={<AdminDashboard/>}/>
     <Route path='/signup' element={<SignUpPage/>}/>
     <Route path='/signin' element={<SignInPage/>}/>
     <Route path='/favourite' element={<Favourite/>}/>
     <Route path='/showsong/:playlist' element={<PlaylistSongs/>}/>
     <Route path='/lang' element={<LanguageSelectionPage/>}/>
     <Route path='/VerifyOTP' element={<OTPVerification/>}/>
</Routes>

<BottomMusicPlayer/>
</BrowserRouter>
    </RiverThemeUnderwater>

    </>
  )
}

export default App
