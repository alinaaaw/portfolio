# Alina Portfolio — Version 1

This folder contains the first checkpoint of Alina's interactive portfolio.

**Current version:** `Version 1`  
**Checkpoint date:** 2026-08-05  
**Status:** Preserved and ready for future iteration

The website itself is entirely in English. This document includes Chinese
instructions so the local preview is easy to use.

## 日常开启方式

1. 打开 `alina-portfolio-demo` 文件夹。
2. 双击根目录里的 **`START-WEBSITE.cmd`**。
3. 保持弹出的命令窗口开启，浏览器会自动打开网站。
4. 使用结束后，在命令窗口按 `Ctrl + C`，然后关闭窗口。

如果网站已经在运行，再次双击启动文件只会打开浏览器，不会重复启动。

默认地址：<http://127.0.0.1:3000/?v=version1>

## Version 1 checkpoint

- The exact source is preserved in Git tag `version1`.
- A portable source snapshot is stored in
  `checkpoints/alina-portfolio-version1.zip`.
- Design and content notes are recorded in [VERSION-1.md](VERSION-1.md).

Do not edit the ZIP snapshot. Future work should continue in the main project
files under `app/` and `public/`.

## Folder map

```text
alina-portfolio-demo/
├── START-WEBSITE.cmd        Double-click launcher
├── VERSION-1.md             V1 identity and checkpoint notes
├── app/
│   ├── page.tsx             Page content and interactions
│   └── layout.tsx           Metadata, fonts, and document shell
├── public/
│   ├── site.css             Complete visual design
│   └── og.png               Social sharing image
├── scripts/
│   └── start-website.ps1    Local preview helper
├── checkpoints/
│   ├── README.md            Recovery notes
│   └── alina-portfolio-version1.zip
├── tests/                   Basic rendering checks
└── build/, worker/, db/     Framework and hosting support
```

## Editing guide

- Change visible words and interactions in `app/page.tsx`.
- Change colors, spacing, layout, and animation in `public/site.css`.
- Change the browser title and sharing description in `app/layout.tsx`.
- Keep new version decisions in a new version note instead of rewriting
  `VERSION-1.md`.

## Technical fallback

If the launcher cannot be used, open PowerShell in this folder and run:

```powershell
$env:Path="$PWD\.runtime\node-v22.14.0-win-x64;$env:Path"
npm run dev -- --hostname 127.0.0.1 --port 3000
```

