import { useState, useEffect } from 'react'
import type { Resume } from '../types'
import { loadResumes, saveResumes } from '../storage'
import { nanoid } from '../utils/id'
import './Resumes.css'

const DEFAULT_DIRECTIONS = ['前端', '后端', '全栈', '算法', '其他']

export default function Resumes() {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [editing, setEditing] = useState<Resume | null>(null)
  const [form, setForm] = useState({ direction: '', title: '', content: '' })
  const [filterDir, setFilterDir] = useState<string>('')

  useEffect(() => {
    setResumes(loadResumes())
  }, [])

  useEffect(() => {
    saveResumes(resumes)
  }, [resumes])

  const filtered = filterDir
    ? resumes.filter((r) => r.direction === filterDir)
    : resumes

  const addOrUpdate = () => {
    if (!form.direction.trim() || !form.title.trim()) return
    const now = Date.now()
    if (editing) {
      setResumes((prev) =>
        prev.map((r) =>
          r.id === editing.id
            ? { ...r, ...form, updatedAt: now }
            : r
        )
      )
      setEditing(null)
    } else {
      setResumes((prev) => [
        ...prev,
        {
          id: nanoid(),
          direction: form.direction.trim(),
          title: form.title.trim(),
          content: form.content,
          updatedAt: now,
        },
      ])
    }
    setForm({ direction: '', title: '', content: '' })
  }

  const remove = (id: string) => {
    if (confirm('确定删除这份简历？')) {
      setResumes((prev) => prev.filter((r) => r.id !== id))
      if (editing?.id === id) {
        setEditing(null)
        setForm({ direction: '', title: '', content: '' })
      }
    }
  }

  const startEdit = (r: Resume) => {
    setEditing(r)
    setForm({ direction: r.direction, title: r.title, content: r.content })
  }

  const cancelEdit = () => {
    setEditing(null)
    setForm({ direction: '', title: '', content: '' })
  }

  const directions = [...new Set([...DEFAULT_DIRECTIONS, ...resumes.map((r) => r.direction)])]

  return (
    <div className="resumes-page">
      <h1>简历管理</h1>
      <p className="page-desc">按就业方向维护多份简历，支持新增、编辑、删除。</p>

      <section className="resume-form card">
        <h2>{editing ? '编辑简历' : '新建简历'}</h2>
        <div className="form-row">
          <label>就业方向</label>
          <select
            value={form.direction}
            onChange={(e) => setForm((f) => ({ ...f, direction: e.target.value }))}
          >
            <option value="">请选择</option>
            {directions.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        <div className="form-row">
          <label>标题</label>
          <input
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="如：前端开发工程师简历"
          />
        </div>
        <div className="form-row">
          <label>内容（支持 Markdown）</label>
          <textarea
            value={form.content}
            onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
            placeholder="简历正文..."
            rows={8}
          />
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-primary" onClick={addOrUpdate}>
            {editing ? '保存' : '添加'}
          </button>
          {editing && (
            <button type="button" className="btn btn-ghost" onClick={cancelEdit}>
              取消
            </button>
          )}
        </div>
      </section>

      <section className="resume-list">
        <div className="list-header">
          <h2>简历列表</h2>
          <select
            value={filterDir}
            onChange={(e) => setFilterDir(e.target.value)}
            className="filter-select"
          >
            <option value="">全部方向</option>
            {directions.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        {filtered.length === 0 ? (
          <p className="empty">暂无简历，请先添加。</p>
        ) : (
          <ul className="resume-cards">
            {filtered.map((r) => (
              <li key={r.id} className="resume-card card">
                <span className="badge">{r.direction}</span>
                <h3>{r.title}</h3>
                <p className="preview">{r.content ? `${r.content.slice(0, 120)}${r.content.length > 120 ? '...' : ''}` : '（无正文）'}</p>
                <p className="meta">
                  {new Date(r.updatedAt).toLocaleString('zh-CN')}
                </p>
                <div className="card-actions">
                  <button type="button" className="btn btn-sm" onClick={() => startEdit(r)}>
                    编辑
                  </button>
                  <button type="button" className="btn btn-sm btn-danger" onClick={() => remove(r.id)}>
                    删除
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
