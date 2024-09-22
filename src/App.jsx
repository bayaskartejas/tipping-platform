import './App.css'
import { Routes, Route} from 'react-router-dom';
import MainLanding from './components/MainLanding';
import HelperProfile from './components/HelperProfile';
import CustomerProfile from './components/CustomerProfile';
import OwnerProfile from './components/OwnerProfile';
function App() {
  return (
    <div className='bg-slate-200 font-poppins w-full h-full'>
      <Routes>
        <Route path='/' element={<MainLanding/>}/>
        <Route path='/helper' element={<HelperProfile />}/>
        <Route path='/customer' element={<CustomerProfile />}/>
        <Route path='/owner' element={<OwnerProfile />}/>
      </Routes>
    </div>
  )
}

export default App
