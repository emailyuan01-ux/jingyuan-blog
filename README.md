# Jingyuan · Personal Notes & Thoughts

一个以 Astro、TypeScript 和 Markdown 构建的极简个人博客。站点采用静态生成，可直接部署到 Cloudflare Pages。

## 本地运行

```bash
npm install
npm run dev
```

打开终端提示的本地地址（通常是 `http://localhost:4321`）。生产构建与预览：

```bash
npm run build
npm run preview
```

类型检查和构建产物自测：

```bash
npm run check
npm test
```

## 创建新文章

在 `src/content/blog/` 新建 `.md` 或 `.mdx` 文件，写入 frontmatter：

```yaml
---
title: "文章标题"
description: "文章摘要，会显示在列表与 SEO 中"
pubDate: 2026-11-04
category: "思考随笔"
tags:
  - 个人思考
draft: false
---
```

保存后，Astro 会自动生成文章详情、分类、标签、归档、RSS 和搜索索引。`draft: true` 的文章不会出现在正式页面。文章支持标准 Markdown、代码块、表格、引用和图片。

## 修改分类和标签

分类入口集中在 `src/config.ts` 的 `CATEGORIES`。文章 frontmatter 中的 `category` 需要与其中一个分类一致；标签可以直接在每篇文章里自由添加。

## 更换网站名称和介绍

编辑 `src/config.ts` 中的 `SITE` 对象即可修改站点名、描述、个人介绍和签名。关于页面的占位内容在 `src/pages/about.astro`。

## 添加图片

把图片放到 `public/images/`，然后在 Markdown 中使用 `/images/filename.jpg`。图片会自动限制在正文宽度内。也可以直接使用远程图片 URL。

## 部署到 Cloudflare Pages

1. 将代码推送到 GitHub 或 GitLab。
2. 在 Cloudflare Pages 创建项目并连接仓库。
3. 构建命令填写 `npm run build`，输出目录填写 `dist`。
4. Node.js 版本建议使用 18 或更高版本。

每次推送后 Cloudflare Pages 会自动重新构建。当前配置使用静态输出，不需要 Cloudflare Adapter。

## 未来绑定 jingyuan.xyz

部署成功后，在 Cloudflare Pages 项目的 **Custom domains** 中添加 `jingyuan.xyz`。如果域名也使用 Cloudflare DNS，系统会自动提示所需的 DNS 配置；如果 DNS 在其他服务商，则按页面提供的 CNAME 记录完成解析。域名购买与 DNS 配置可以在准备上线时再进行。

## 目录结构

```text
src/
├── components/       # 导航、页脚、文章卡片等通用组件
├── content/blog/     # Markdown / MDX 文章
├── layouts/          # 页面布局
├── pages/            # 路由页面与 RSS
├── styles/           # 全局样式、主题与响应式规则
├── config.ts         # 站点信息、导航和分类
└── utils.ts          # 日期、排序、链接等工具函数
public/               # favicon、robots.txt 和图片
```
