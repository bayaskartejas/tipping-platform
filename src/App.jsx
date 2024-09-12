import FirstP from './components/FirstP'
import './App.css'
import Navbar from './components/Navbar'

function App() {

  return (
    <div className='bg-slate-200 font-poppins'>
    <div className=''>
      <Navbar />
    </div>
      <div className='mt-24 z-0 sm:top-20 sm:relative'>
        <div className='text-4xl flex justify-center px-7 py-5 font-semibold tracking-normal text-[#424242]'>Choose your Profile</div>
        <div className='flex w-full justify-center items-center animate-popup mt-4'>
          <FirstP />
        </div>
      </div>
    </div>
  )
}

export default App
