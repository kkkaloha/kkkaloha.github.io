# 部署到 GitHub Pages（kkkaloha.github.io）

本仓库名为 `kkkaloha.github.io`，部署后访问地址为：**https://kkkaloha.github.io**。  
`vite.config.ts` 中已设置 `base: '/'`，无需改成 `/kkkaloha.github.io/`（只有「项目页」才需要加仓库名路径）。

---

## 方式一：从分支的 `docs` 目录发布（推荐，简单）

1. **本地构建并生成静态文件到 `docs`**
   ```bash
   npm install
   npm run build
   ```
   构建产物会输出到项目根目录下的 **`docs`** 文件夹。

2. **提交并推送**
   ```bash
   git add .
   git commit -m "build: add docs for GitHub Pages"
   git push -u origin main
   ```
   （若还没有远程仓库，先在 GitHub 上创建同名仓库 `kkkaloha.github.io`，再 `git remote add origin https://github.com/kkkaloha/kkkaloha.github.io.git` 后执行 `git push`。）

3. **在 GitHub 上开启 Pages**
   - 打开：**https://github.com/kkkaloha/kkkaloha.github.io/settings/pages**
   - **Source** 选：**Deploy from a branch**
   - **Branch** 选：**main**，**Folder** 选：**/docs**
   - 保存后等 1～2 分钟，访问 **https://kkkaloha.github.io** 即可。

之后每次更新页面：改完代码后执行 `npm run build`，把新生成的 `docs` 提交并推送即可。

---

## 方式二：用 GitHub Actions 自动构建并部署

不想每次本地执行 `npm run build` 再提交 `docs`，可以用 Actions 在每次推送到 `main` 时自动构建并发布。仓库里已包含 `.github/workflows/deploy.yml`。

1. **在 GitHub 上开启 Pages**
   - 打开：**https://github.com/kkkaloha/kkkaloha.github.io/settings/pages**
   - **Source** 选：**GitHub Actions**
   - 保存后，每次推送到 `main` 会自动构建并部署，访问 **https://kkkaloha.github.io**。

2. **推送代码**  
   推送后到 **Actions** 页可查看构建与部署状态。

---

## 小结

| 项目           | 说明 |
|----------------|------|
| 仓库名         | `kkkaloha.github.io` |
| 访问地址       | https://kkkaloha.github.io |
| `base` 设置    | 保持 `'/'`，不要用 `'/kkkaloha.github.io/'` |
| 方式一发布源   | 分支 **main**，目录 **/docs** |
| 方式二发布源   | **GitHub Actions**（构建结果在 `dist`） |
