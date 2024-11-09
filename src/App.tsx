import './App.scss'
import '@styles/examplePage.scss'

import { useStateTogether } from 'react-together'

import { version } from '@package'
import { HeroLogo } from '@components'

export default function App() {
  const [count, set_count] = useStateTogether('counter_0', 0)

  return (
    <div>
      <div>
        <HeroLogo {...{ type: 'reacttogether' }} />
        <HeroLogo {...{ type: 'react' }} />
        <HeroLogo {...{ type: 'vite' }} />
      </div>
      <h1>ReactTogether + Vite + React</h1>
      <div className='card'>
        <button onClick={() => set_count((count) => count + 1) }>Synq'd count is {count}</button> 
        {/* <button onClick={() => set_count((count) => count + 1)}>Synq'd count is {count}</button> */}
        <button {...{ style: { marginLeft: '1rem' }, onClick: () => set_count(0) }}>Reset</button>
      </div>
      <p className='read-the-docs'>Click on the respective logos to learn more.</p>

      <div className='version-num'>{version}</div>
    </div>
  )
}
