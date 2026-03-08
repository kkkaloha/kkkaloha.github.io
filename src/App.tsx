import { Routes, Route, NavLink } from 'react-router-dom'
import Home from './pages/Home'
import Resumes from './pages/Resumes'
import Knowledge from './pages/Knowledge'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="header">
        <NavLink to="/" className="logo">kkkaloha</NavLink>
        <nav className="nav">
          <NavLink to="/" end>首页</NavLink>
          <NavLink to="/resumes">简历管理</NavLink>
          <NavLink to="/knowledge">知识库</NavLink>
        </nav>
      </header>
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/resumes" element={<Resumes />} />
          <Route path="/knowledge" element={<Knowledge />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
