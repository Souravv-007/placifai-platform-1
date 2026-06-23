import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Landing from './pages/Landing'
import Register from './pages/Register'
import PrepHub from './pages/PrepHub'
import Roadmap from './pages/Roadmap'
import Analytics from './pages/Analytics'
import CompanyPrep from './pages/companyPrep'
import MockInterview from './pages/MockInterview'
import Progress from './pages/Progress'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/prep" element={<PrepHub />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/company-prep" element={<CompanyPrep />} />
        <Route path="/interview" element={<MockInterview />} />
        <Route path="/progress" element={<Progress />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App