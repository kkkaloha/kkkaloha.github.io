/** 简历 - 按就业方向区分 */
export interface Resume {
  id: string
  /** 就业方向，如：前端 / 后端 / 全栈 / 算法 */
  direction: string
  title: string
  content: string
  updatedAt: number
}

/** 知识库分类，如：语言 / 算法 / 框架 */
export interface KnowledgeCategory {
  id: string
  name: string
  order: number
}

/** 知识库条目 */
export interface KnowledgeEntry {
  id: string
  categoryId: string
  title: string
  content: string
  tags: string[]
  updatedAt: number
}
