import { Link } from 'react-router-dom'
import './Home.css'

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <h1>kkkaloha</h1>
        <p className="tagline">个人主页 · 简历与知识库管理</p>
      </section>
      <section className="cards">
        <Link to="/resumes" className="card">
          <span className="card-icon">📄</span>
          <h2>简历管理</h2>
          <p>按不同就业方向维护多份简历，随时编辑与查看。</p>
        </Link>
        <Link to="/knowledge" className="card">
          <span className="card-icon">📚</span>
          <h2>知识库</h2>
          <p>整理编程语言、算法、框架等学习笔记，建立个人知识体系。</p>
        </Link>
      </section>
    </div>
  )
}
