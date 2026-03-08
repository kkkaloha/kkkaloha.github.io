import { useState, useEffect } from 'react'
import type { KnowledgeCategory, KnowledgeEntry } from '../types'
import {
  loadCategories,
  saveCategories,
  loadEntries,
  saveEntries,
} from '../storage'
import { nanoid } from '../utils/id'
import './Knowledge.css'

export default function Knowledge() {
  const [categories, setCategories] = useState<KnowledgeCategory[]>([])
  const [entries, setEntries] = useState<KnowledgeEntry[]>([])
  const [selectedCat, setSelectedCat] = useState<string>('')
  const [editingEntry, setEditingEntry] = useState<KnowledgeEntry | null>(null)
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [categoryName, setCategoryName] = useState('')
  const [entryForm, setEntryForm] = useState({
    categoryId: '',
    title: '',
    content: '',
    tags: '',
  })

  useEffect(() => {
    setCategories(loadCategories())
    setEntries(loadEntries())
  }, [])

  useEffect(() => {
    saveCategories(categories)
  }, [categories])

  useEffect(() => {
    saveEntries(entries)
  }, [entries])

  const filteredEntries = selectedCat
    ? entries.filter((e) => e.categoryId === selectedCat)
    : entries

  const getCategoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name ?? id

  const addCategory = () => {
    if (!categoryName.trim()) return
    const id = nanoid(6)
    setCategories((prev) => [
      ...prev,
      { id, name: categoryName.trim(), order: prev.length },
    ])
    setCategoryName('')
    setShowCategoryForm(false)
  }

  const removeCategory = (id: string) => {
    if (confirm('删除分类会同时删除其下所有条目，确定？')) {
      setCategories((prev) => prev.filter((c) => c.id !== id))
      setEntries((prev) => prev.filter((e) => e.categoryId !== id))
      if (selectedCat === id) setSelectedCat('')
    }
  }

  const addOrUpdateEntry = () => {
    if (!entryForm.categoryId || !entryForm.title.trim()) return
    const tags = entryForm.tags
      .split(/[,，\s]+/)
      .map((t) => t.trim())
      .filter(Boolean)
    const now = Date.now()
    if (editingEntry) {
      setEntries((prev) =>
        prev.map((e) =>
          e.id === editingEntry.id
            ? { ...e, ...entryForm, tags, updatedAt: now }
            : e
        )
      )
      setEditingEntry(null)
    } else {
      setEntries((prev) => [
        ...prev,
        {
          id: nanoid(),
          categoryId: entryForm.categoryId,
          title: entryForm.title.trim(),
          content: entryForm.content,
          tags,
          updatedAt: now,
        },
      ])
    }
    setEntryForm({ categoryId: '', title: '', content: '', tags: '' })
  }

  const removeEntry = (id: string) => {
    if (confirm('确定删除该条目？')) {
      setEntries((prev) => prev.filter((e) => e.id !== id))
      if (editingEntry?.id === id) {
        setEditingEntry(null)
        setEntryForm({ categoryId: '', title: '', content: '', tags: '' })
      }
    }
  }

  const startEditEntry = (e: KnowledgeEntry) => {
    setEditingEntry(e)
    setEntryForm({
      categoryId: e.categoryId,
      title: e.title,
      content: e.content,
      tags: e.tags.join(', '),
    })
  }

  const cancelEditEntry = () => {
    setEditingEntry(null)
    setEntryForm({ categoryId: '', title: '', content: '', tags: '' })
  }

  return (
    <div className="knowledge-page">
      <h1>知识库</h1>
      <p className="page-desc">
        按分类管理编程语言、算法、框架等学习笔记，支持标签。
      </p>

      <section className="knowledge-layout">
        <aside className="categories-panel card">
          <div className="panel-header">
            <h2>分类</h2>
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => setShowCategoryForm((v) => !v)}
            >
              {showCategoryForm ? '取消' : '+ 新建'}
            </button>
          </div>
          {showCategoryForm && (
            <div className="category-form">
              <input
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="分类名称"
                onKeyDown={(e) => e.key === 'Enter' && addCategory()}
              />
              <button type="button" className="btn btn-primary btn-sm" onClick={addCategory}>
                添加
              </button>
            </div>
          )}
          <ul className="category-list">
            <li>
              <button
                type="button"
                className={!selectedCat ? 'active' : ''}
                onClick={() => setSelectedCat('')}
              >
                全部
              </button>
            </li>
            {categories.map((c) => (
              <li key={c.id} className="category-item">
                <button
                  type="button"
                  className={selectedCat === c.id ? 'active' : ''}
                  onClick={() => setSelectedCat(c.id)}
                >
                  {c.name}
                </button>
                <button
                  type="button"
                  className="btn-remove-cat"
                  onClick={() => removeCategory(c.id)}
                  title="删除分类"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div className="content-area">
          <section className="entry-form card">
            <h2>{editingEntry ? '编辑条目' : '新建条目'}</h2>
            <div className="form-row">
              <label>分类</label>
              <select
                value={entryForm.categoryId}
                onChange={(e) =>
                  setEntryForm((f) => ({ ...f, categoryId: e.target.value }))
                }
              >
                <option value="">请选择</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <label>标题</label>
              <input
                value={entryForm.title}
                onChange={(e) =>
                  setEntryForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="如：React Hooks 用法"
              />
            </div>
            <div className="form-row">
              <label>标签（逗号分隔）</label>
              <input
                value={entryForm.tags}
                onChange={(e) =>
                  setEntryForm((f) => ({ ...f, tags: e.target.value }))
                }
                placeholder="react, hooks, 前端"
              />
            </div>
            <div className="form-row">
              <label>内容（支持 Markdown）</label>
              <textarea
                value={entryForm.content}
                onChange={(e) =>
                  setEntryForm((f) => ({ ...f, content: e.target.value }))
                }
                placeholder="笔记内容..."
                rows={6}
              />
            </div>
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={addOrUpdateEntry}
              >
                {editingEntry ? '保存' : '添加'}
              </button>
              {editingEntry && (
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={cancelEditEntry}
                >
                  取消
                </button>
              )}
            </div>
          </section>

          <section className="entry-list">
            <h2>
              {selectedCat ? getCategoryName(selectedCat) : '全部'} 条目
            </h2>
            {filteredEntries.length === 0 ? (
              <p className="empty">暂无条目。</p>
            ) : (
              <ul className="entry-cards">
                {filteredEntries.map((e) => (
                  <li key={e.id} className="entry-card card">
                    <span className="entry-cat">{getCategoryName(e.categoryId)}</span>
                    <h3>{e.title}</h3>
                    {e.tags.length > 0 && (
                      <div className="entry-tags">
                        {e.tags.map((t) => (
                          <span key={t} className="tag">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="preview">{e.content ? `${e.content.slice(0, 100)}${e.content.length > 100 ? '...' : ''}` : '（无内容）'}</p>
                    <p className="meta">
                      {new Date(e.updatedAt).toLocaleString('zh-CN')}
                    </p>
                    <div className="card-actions">
                      <button
                        type="button"
                        className="btn btn-sm"
                        onClick={() => startEditEntry(e)}
                      >
                        编辑
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() => removeEntry(e.id)}
                      >
                        删除
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </section>
    </div>
  )
}
