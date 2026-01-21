import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastContainer } from 'react-toastify';
import SmoothScrollProvider from './components/SmoothScroll.jsx';
import {Provider} from "react-redux"
import { store } from './Redux/Stores/MyStore.js';
// import { AppContextProvider } from './Component/ContextAPI.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
{/* <SmoothScrollProvider> */}
<Provider store={store}>

    <App />
</Provider>
{/* </SmoothScrollProvider> */}
    <ToastContainer
position="top-right"
autoClose={1999}
hideProgressBar={false}
newestOnTop={false}
closeOnClick={false}
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="dark"

/>
  </StrictMode>,
)
