import './App.scss';
import '@styles/examplePage.scss';

import { useStateTogether } from 'react-together';
import Whiteboard from './components/Whiteboard';

import { version } from '@package';
import { HeroLogo } from '@components';

export default function App() {
  // Example of using state synchronization in App.tsx
  const [count, setCount] = useStateTogether('counter_0', 0);

  return (
    <div>
      <div className='card'>

      </div>

      <Whiteboard />
    </div>
  );
}
