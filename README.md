# kkkaloha.github.io

个人主页，使用 [Hugo](https://gohugo.io/) 生成静态站点，包含**简历**与**知识库**。

- **简历**：`content/resumes/`，按就业方向（front matter `direction`）管理
- **知识库**：`content/knowledge/`，使用 `categories`、`tags` 分类

## 本地开发

需先 [安装 Hugo](https://gohugo.io/installation/)（建议 Extended）。

```bash
hugo server -D
```

浏览器访问 http://localhost:1313（`-D` 会显示草稿文章）。

## 构建与部署

```bash
hugo
```

产物输出到 `docs/`。将 `docs` 推送到 GitHub 后，在仓库 **Settings → Pages** 选择分支 **main**、目录 **/docs** 即可发布到 https://kkkaloha.github.io 。

详见 [DEPLOY.md](DEPLOY.md)。
