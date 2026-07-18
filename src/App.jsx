import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Fan from './pages/Fan'
import Volunteer from './pages/Volunteer'
import Organizer from './pages/Organizer'
export default function App() { return <Layout><Routes><Route path="/" element={<Landing/>}/><Route path="/fan" element={<Fan/>}/><Route path="/volunteer" element={<Volunteer/>}/><Route path="/organizer" element={<Organizer/>}/><Route path="*" element={<Landing/>}/></Routes></Layout> }
