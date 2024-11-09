import './App.scss';
import '@styles/examplePage.scss';

import { useStateTogether } from 'react-together';
import Whiteboard from './components/Whiteboard';

export default function App() {
  // Example of using state synchronization in App.tsx
  return (
    <div>
      <div className='card'>

      </div>

      <Whiteboard />
    </div>
  );
}
