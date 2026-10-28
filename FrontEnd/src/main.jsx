import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastContainer } from 'react-toastify';
import SmoothScrollProvider from './components/SmoothScroll.jsx';
import {Provider} from "react-redux"
import { store } from './Redux/Stores/MyStore.js';
import { HelmetProvider } from "react-helmet-async"
import "../src/services/I18Next.js"
createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <HelmetProvider>

<Provider store={store}>

    <App />
</Provider>
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
    </HelmetProvider>

  // </StrictMode>,
)
