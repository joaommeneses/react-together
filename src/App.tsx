import './App.scss'
import '@styles/examplePage.scss'

import { useStateTogether } from 'react-together'

import { version } from '@package'
import { HeroLogo } from '@components'
import { DrawingBoard } from '@components'

export default function App() {
  return (
    <DrawingBoard />
  )
}
