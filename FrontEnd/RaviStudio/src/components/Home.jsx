import { lazy, Suspense, useEffect, useRef, useState } from 'react'
// import PlaylistSection from './PlaylistSection'
import SingerHorizontalSkeleton from './SkeltonLoading/SingerSection'
import { useInView } from "react-intersection-observer";
import {Helmet} from "react-helmet-async"
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';


// applying lazy loading(component base code splitting)
const Footer=lazy(()=>import("./Footer"))
const SingerHorizontalScroll=lazy(()=>import("./SingerSection"))
const UserPlaylistSection=lazy(()=>import("./UserPlaylist"))
const PlaylistSection=lazy(()=>import("./PlaylistSection"))
function LazyComponentLoading(){
  return (
<SingerHorizontalSkeleton/>
  )
}
function LazySection({ children }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div ref={ref}>
      {inView && children}
    </div>
  );
}

function Home() {
  const {i18n,t} =useTranslation()
const SelectedLang=useSelector(state=>state.User.language)

  return (
    <>
    <Helmet>
        <title>Home Page | My Music App</title>

        <meta
          name="description"
          content="Listen to trending playlists and curated songs updated daily."
        />
      </Helmet>
    <div   className="w-full   h-screen  overflow-y-scroll">

  <div className="w-full  h-[70px]" />

{/* component based code splitting */}
  <Suspense fallback={<LazyComponentLoading />}>
    <SingerHorizontalScroll heading={t("artist")} />
    <PlaylistSection heading={t("newreleasedsong")} />
    <PlaylistSection heading={t("popularplaylist")} />
    <PlaylistSection heading={t("popularplaylist")} />
      </Suspense>

<LazySection>
  <Suspense fallback={<LazyComponentLoading />}>
      <UserPlaylistSection heading={t("myplaylist")} />
    </Suspense>
</LazySection>
<LazySection>

<Suspense fallback={
  <div className='w-full h-3 text-2xl font-bold'>
  <h1>Footer is loading</h1>
  </div>}>
        <Footer />
</Suspense>
    </LazySection>

  <div  className="w-full  h-[90px]" />
</div>
  
  

  

  


  
  
    </>
  )
}

export default Home
