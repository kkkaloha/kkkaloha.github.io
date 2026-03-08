# 部署到 GitHub Pages（Hugo）

本仓库使用 **Hugo** 生成静态站点，部署后访问：**https://kkkaloha.github.io**。

## 本地开发

1. [安装 Hugo](https://gohugo.io/installation/)（建议 Extended 版本）
2. 本地预览：
   ```bash
   hugo server -D
   ```
   访问 http://localhost:1313（`-D` 包含 draft 文章）。修改 content 后页面会自动刷新。

## 发布到 GitHub Pages

构建产物输出到 **`docs`** 目录（已在 `hugo.toml` 中配置 `publishDir = 'docs'`）。

1. **构建**
   ```bash
   hugo
   ```

2. **提交并推送**
   ```bash
   git add .
   git commit -m "build: update site"
   git push origin main
   ```

3. **GitHub 仓库设置**
   - 打开：**https://github.com/kkkaloha/kkkaloha.github.io/settings/pages**
   - **Source**：**Deploy from a branch**
   - **Branch**：**main**，**Folder**：**/docs**
   - 保存

## 内容管理

- **简历**：在 `content/resumes/` 下新建 `.md` 文件，front matter 中设置 `direction`（如：前端、后端、全栈、算法）。
- **知识库**：在 `content/knowledge/` 下新建 `.md` 文件，使用 `categories` 和 `tags` 分类。

新建内容也可用命令：
```bash
hugo new resumes/后端开发.md
hugo new knowledge/算法-排序.md
```
