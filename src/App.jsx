import { useEffect, useState } from 'react';
import './index.css'

function App() {

  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const init = async () => {
      if (!window.electron) return console.warn('Running in browser - Electron API not available');

      setGreeting(await window.electron.greet('io'));
    }

    init()
  }, [])

  return (
    <>
      <h1 className='bg-[#262626] text-[#f6f6f6]'>{greeting}</h1>
    </>
  )
}

export default App
