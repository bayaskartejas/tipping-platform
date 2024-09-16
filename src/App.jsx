import './App.css'
import { Routes, Route} from 'react-router-dom';
import MainLanding from './components/MainLanding';
function App() {
  return (
    <div className='bg-slate-200 font-poppins w-full h-full'>
      <Routes>
        <Route path='/' element={<MainLanding/>}/>

      </Routes>
    </div>
  )
}

export default App
