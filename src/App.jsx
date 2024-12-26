import { Suspense } from 'react';
import React from 'react';
import './App.css'
import Preloader from './Components/Preloader';
const Game = React.lazy(() => import("./Components/Game"));

function App() {
  

  return (
    <>
    <Suspense fallback={<Preloader/>}>
      <Game/>
    </Suspense>
    </>
  )
}

export default App
