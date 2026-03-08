# Hugo 语法说明

本文档结合本仓库结构，说明 Hugo 的内容格式与模板语法。

---

## 一、内容文件（Content）

### 1. Front Matter（前置元数据）

每篇内容文件开头用 `---` 包裹 YAML 元数据：

```yaml
---
title: "页面标题"
date: 2024-01-01
draft: false
direction: 前端        # 自定义字段，简历用
categories: ["框架与工具"]  # 分类（知识库用）
tags: ["react", "hooks"]   # 标签（知识库用）
---
```

- **常用内置字段**：`title`、`date`、`draft`（true 时仅 `hugo server -D` 显示）
- **自定义字段**：如 `direction`、`categories`、`tags`，在模板里用 `.Param "字段名"` 读取

### 2. 正文

`---` 下方是 **Markdown**，会渲染成 HTML 填入模板的 `{{ .Content }}`。

### 3. 本项目的目录约定

| 路径 | 说明 |
|------|------|
| `content/_index.md` | 首页内容（标题 + 简介 + 链接列表） |
| `content/resumes/_index.md` | 简历列表页的标题和说明 |
| `content/resumes/xxx.md` | 单份简历，需有 `direction` |
| `content/knowledge/_index.md` | 知识库列表页的标题和说明 |
| `content/knowledge/xxx.md` | 单条笔记，常用 `categories`、`tags` |

---

## 二、模板语法（Go Template）

Hugo 使用 **Go 的 html/template**，在 `layouts/` 下的 `.html` 里写。

### 1. 输出变量：`{{ }}`

```go
{{ .Title }}           // 当前页标题
{{ .Content }}         // 当前页渲染后的正文 HTML
{{ .Site.Title }}      // 站点标题（来自 hugo.toml 的 title）
{{ .Site.BaseURL }}   // 站点根 URL
```

- **点 `.`**：当前上下文（当前页、当前循环项等）。

### 2. 管道与函数：`|`

```go
{{ .Date.Format "2006-01-02" }}   // 日期格式（Go 固定用 2006-01-02）
{{ "resumes/" | relURL }}         // 转成相对 URL，如 /resumes/
{{ "css/style.css" | relURL }}    // 如 /css/style.css
```

`|` 左边的结果传给右边作为最后一个参数。

### 3. 条件：`with`、`if`

**`with`**：若值非空则进入块内，否则跳过：

```go
{{ with .Param "direction" }}
  <span class="badge">{{ . }}</span>   // 块内 . 表示 direction 的值
{{ end }}
```

**`if`**：

```go
{{ if .IsHome }}首页{{ end }}
{{ if .Param "tags" }}有标签{{ else }}无标签{{ end }}
```

### 4. 循环：`range`

```go
{{ range .Pages }}
  <li><a href="{{ .RelPermalink }}">{{ .Title }}</a></li>
{{ end }}
```

- `range .Pages`：遍历当前 section 下的所有页面（如简历列表、知识库列表）。
- 循环内 `.` 变为当前子页面，故可用 `.RelPermalink`、`.Title`、`.Param "direction"` 等。

### 5. 自定义参数：`.Param`

Front matter 里的自定义字段用 `.Param "字段名"` 读取：

```go
{{ .Param "direction" }}     // 简历方向
{{ .Param "categories" }}   // 数组，可再 range
{{ .Param "tags" }}
```

### 6. 布局继承：`define`、`block`

**基模板**（如 `layouts/_default/baseof.html`）里留“洞”：

```html
<title>{{ block "title" . }}{{ .Site.Title }}{{ end }}</title>
...
{{ block "main" . }}{{ end }}
```

**子模板**（如 `layouts/resumes/list.html`）填洞：

```go
{{ define "title" }}{{ .Title }} - {{ .Site.Title }}{{ end }}
{{ define "main" }}
  <article>
    <h1>{{ .Title }}</h1>
    {{ .Content }}
    {{ range .Pages }}...{{ end }}
  </article>
{{ end }}
```

- `define "main"` 会替换 baseof 里同名的 `block "main"`。
- 子模板不需要写完整 HTML，只写 `define` 块即可。

---

## 三、本项目的布局对应关系

Hugo 按**类型 + 模板名**选布局：

| 内容 / 访问路径 | 使用的布局 |
|-----------------|------------|
| 首页 `content/_index.md` | `layouts/index.html` |
| 简历列表 `/resumes/` | `layouts/resumes/list.html`（section 的 list） |
| 单份简历 `/resumes/xxx/` | `layouts/resumes/single.html` 或 `_default/single.html` |
| 知识库列表 `/knowledge/` | `layouts/knowledge/list.html` |
| 单条笔记 `/knowledge/xxx/` | `layouts/knowledge/single.html` |

- **list**：section 的索引页（列出该 section 下所有页面）。
- **single**：单篇文章/单份简历的详情页。

---

## 四、常用对象速查

| 写法 | 含义 |
|------|------|
| `.` | 当前上下文（当前页或 range 里当前项） |
| `.Title` | 当前页标题 |
| `.Content` | 当前页正文（已渲染 HTML） |
| `.Pages` | 当前 section 下的子页面列表 |
| `.RelPermalink` | 相对链接，如 `/resumes/frontend-sample/` |
| `.Site` | 站点全局（.Site.Title、.Site.BaseURL） |
| `.Param "key"` | 当前页 front matter 中的自定义字段 |
| `.Date` / `.PublishDate` | 日期，可用 `.Format "2006-01-02"` |

---

## 五、新建内容

用 archetype 生成带好 front matter 的草稿：

```bash
hugo new resumes/后端开发.md
hugo new knowledge/算法-排序.md
```

模板在 `archetypes/resumes.md`、`archetypes/knowledge.md`，其中的 `{{ .Date }}` 等会在生成时被 Hugo 替换。

---

## 六、配置文件 `hugo.toml`

- `baseURL`：站点最终访问地址。
- `publishDir`：构建输出目录（本项目为 `docs`）。
- `[taxonomies]`：分类与标签的 URL 前缀（如 `categories`、`tags`）。

修改配置后重启 `hugo server` 即可生效。
