import type { Resume, KnowledgeCategory, KnowledgeEntry } from './types'

const RESUMES_KEY = 'kkkaloha_resumes'
const CATEGORIES_KEY = 'kkkaloha_knowledge_categories'
const ENTRIES_KEY = 'kkkaloha_knowledge_entries'

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function save<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

// --- 简历 ---
export function loadResumes(): Resume[] {
  return load<Resume[]>(RESUMES_KEY, [])
}

export function saveResumes(resumes: Resume[]): void {
  save(RESUMES_KEY, resumes)
}

// --- 知识库分类 ---
export function loadCategories(): KnowledgeCategory[] {
  return load<KnowledgeCategory[]>(CATEGORIES_KEY, [
    { id: 'lang', name: '编程语言', order: 0 },
    { id: 'algo', name: '算法与数据结构', order: 1 },
    { id: 'framework', name: '框架与工具', order: 2 },
  ])
}

export function saveCategories(categories: KnowledgeCategory[]): void {
  save(CATEGORIES_KEY, categories)
}

// --- 知识库条目 ---
export function loadEntries(): KnowledgeEntry[] {
  return load<KnowledgeEntry[]>(ENTRIES_KEY, [])
}

export function saveEntries(entries: KnowledgeEntry[]): void {
  save(ENTRIES_KEY, entries)
}
