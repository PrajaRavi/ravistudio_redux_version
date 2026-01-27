import React, { lazy, Suspense, useEffect } from 'react'
import { RiverThemeUnderwater } from './components/RiverTheme'

import { BrowserRouter,Routes,Route } from "react-router-dom"
let interval;
import { SetCurrUser, SetLogin } from './Redux/Slices/User.slice'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import FullScreenLoader from './components/FetchUserLoading'
import { GetUser } from './Redux/Thunk/User.thunk'
import Private from './components/layout/Private'
import BottomMusicPlayer from "./components/MusicPlayer"
//<-----------------Now due to this memo function these page will not loaded every time ----------------------> 
import MusicNavbar from './components/Navbar';

const Navbar = React.memo(MusicNavbar);
const MusicPlayer = React.memo(BottomMusicPlayer);

const Home=lazy(()=>import("./components/Home"))
const ContactUs=lazy(()=>import("./components/Contact"))
const AddPlaylist=lazy(()=>import("./components/AddPlaylist"))
const AdminDashboard=lazy(()=>import("./components/Admin"))
const SignUpPage=lazy(()=>import("./components/SignUp"))
const SignInPage=lazy(()=>import("./components/SignIn"))
const PlaylistSongs=lazy(()=>import("./components/ShowSong"))
const LanguageSelectionPage=lazy(()=>import("./components/LanguageSelect"))
const OTPVerification=lazy(()=>import("./components/OTPVerification"))
const Favourite=lazy(()=>import("./components/Favourite"))
const UpdateUser=lazy(()=>import("./components/UpdateUser"))
const UserShowSong=lazy(()=>import("./components/UserShowSong"))
axios.defaults.withCredentials=true
function App() {
const dispatch=useDispatch()
const FetchUserLoading=useSelector(state=>state.User.GetUserLoading)
const IsUserLogin=useSelector(state=>state.User.IsUserLogin)
const UserUpdatedProfile=useSelector(state=>state.Song.userupdated) //this is just for telling that their is an updation in user profile so fetch user again

async function RefreshToken(){
  
            let {data}=await axios.post(`http://localhost:4500/user/refresh-token/`,{withCredentials:true}).
            catch(err=>console.log(err.message))
            console.log(data)
          }
          
            
             
        

  useEffect(()=>{
   
    if(localStorage.getItem("CurrUser")){
      
      dispatch(SetLogin(true))  
       interval=setInterval(RefreshToken,10000)
    }
    else{
      dispatch(SetLogin(false))
    }
return ()=>(
  clearInterval(interval)
)


  },[])
  
  useEffect(()=>{
    dispatch(GetUser())
    
   },[IsUserLogin,UserUpdatedProfile])
  return (
    <>
    <RiverThemeUnderwater>
<BrowserRouter>
{FetchUserLoading?<FullScreenLoader/>:null}

<Navbar/>
<Suspense fallback={<FullScreenLoader/>}>

<Routes>
{/* Performing routing based splitting */}
     <Route path='/' element={<Home/>}/>
     <Route path='/lang' element={<LanguageSelectionPage/>}/>
     <Route path='/contact' element={<ContactUs/>}/>

     <Route path='/signup' element={<SignUpPage/>}/>
     <Route path='/signin' element={<SignInPage/>}/>
     <Route element={<Private/>}>
     <Route path='/addplaylist' element={<AddPlaylist/>}/>
     <Route path='/updateuser/:userid' element={<UpdateUser/>}/>
     <Route path='/admin' element={<AdminDashboard/>}/>
     <Route path='/favourite' element={<Favourite/>}/>
     <Route path='/showsong/:playlist' element={<PlaylistSongs/>}/>
     <Route path='/usershowsong/:userplaylist' element={<UserShowSong/>}/>
     <Route path='/VerifyOTP' element={<OTPVerification/>}/>
     </Route>
</Routes>
</Suspense>

<MusicPlayer/>
</BrowserRouter>
    </RiverThemeUnderwater>

    </>
  )
}

export default App
