import './App.css'
import { TonConnectButton } from '@tonconnect/ui-react'
import { useHelloWorldContract } from './hooks/useHelloWorldContract'
import { useTonConnect } from './hooks/useTonConnect'


function App() {
  const {connected} = useTonConnect();
  const {value, address, sendIncrement} = useHelloWorldContract();
  return (
    <div className='App'>
      <div className='Container'>
        <TonConnectButton/>

        <div className='card'>
          <b>Counter Address</b>
          <div className='hint'>
            {address}
          </div>
        </div>
        <div className='card'>
          <b>Counter value</b>
          <div>{value ?? "Loading . . ."}</div>
        </div>
        <a
          className={`Button ${connected ? 'Active' : 'Disabled'}`}
          onClick={()=> {sendIncrement();}}
        >
          Increment
        </a>
      </div>
    </div>
  )
}

export default App
