# Portfolio Launch TODO

目标：把 Lab 17 整理成唯一的正式作品集，发布到 GitHub `main`，移除旧的版本编号身份，完成一轮 3D 改进，最后通过 Cloudflare 发布到 `alinawu.com`。

## 项目链接

- GitHub 仓库：[alinaaaw/portfolio](https://github.com/alinaaaw/portfolio)
- GitHub `main`：[查看 main](https://github.com/alinaaaw/portfolio/tree/main)
- 当前设计分支与 `main` 的比较：[查看差异并准备 Pull Request](https://github.com/alinaaaw/portfolio/compare/main...version3-design?expand=1)
- GitHub 构建状态：[Actions](https://github.com/alinaaaw/portfolio/actions)
- Cloudflare 控制台：[Workers & Pages](https://dash.cloudflare.com/)
- Cloudflare Git 集成：[Workers Builds 文档](https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/)
- Cloudflare 版本与部署：[Versions & Deployments 文档](https://developers.cloudflare.com/workers/versions-and-deployments/)
- Cloudflare 预览地址：[Preview URLs 文档](https://developers.cloudflare.com/workers/versions-and-deployments/preview-urls/)
- Cloudflare 自定义域名：[Custom Domains 文档](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)
- 版本编号规范：[Semantic Versioning 2.0.0](https://semver.org/)
- GitHub Release 工作流：[Release 事件文档](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#release)
- 后端规划：[BACKEND-ROADMAP.md](./BACKEND-ROADMAP.md)
- 内容编辑说明：[content/CONTENT_GUIDE.md](./content/CONTENT_GUIDE.md)

## 工作原则

- [ ] 每个阶段完成后先本地预览和构建，再进入下一阶段。
- [ ] 任何 AI 生成的个人经历、项目结果和研究描述都必须由 Alina 确认。
- [ ] 在 `main` 验证成功并创建可恢复的备份前，不删除旧分支、worktree 或历史文件。
- [ ] 不把 API Key、Cloudflare Token 或其他 secret 提交到 GitHub。
- [ ] GitHub push、合并到 `main` 和正式发布是三个不同动作；普通 push 不更新 `alinawu.com`。
- [ ] 只有准备正式发布时才修改 release 版本号、创建 Git tag 和发布 GitHub Release。
- [ ] 第一次正式发布不等待 CMS、AI Bot 或 analytics；这些按照 backend roadmap 后续实现。

## 持续 Commit / Push 规则

从现在开始，不必等整个 Phase 完成才保存进度。每完成一组边界清楚、已经检查过的修改，就提交并推送到当前工作分支，让工作可追踪、可恢复、也方便之后通过 Pull Request 合并。

- [ ] 每组有意义的修改完成后，先查看 `git status` 和 diff，确认没有误加文件或 secret。
- [ ] 按修改风险运行对应检查：文档至少运行格式和 diff 检查；代码运行相关测试与 production build；视觉修改同时本地预览。
- [ ] 检查通过后直接 commit，并 push 到当前工作分支，不必等待整个阶段完成。
- [ ] 每个 commit 尽量只表达一个主题，避免把文字、3D、部署和无关试验混在同一个提交里。
- [ ] commit message 使用清楚的类别，例如 `content:`、`assets:`、`3d:`、`docs:`、`fix:` 或 `release:`。
- [ ] 迁移到 `main` 后，日常修改优先在短期 feature branch 完成并 push，再通过 Pull Request 合并；除非明确决定，否则不直接在 `main` 开发。
- [ ] 普通 commit 或 push 不修改 release 版本号，不创建 GitHub Release，也不触发 Cloudflare production deployment。
- [ ] 只有确认要正式发布时，才按照 Phase 4 升级版本号、填写版本概要、创建 tag 和发布 GitHub Release。
- [ ] 永远不提交 `.env`、API Key、Cloudflare Token、私有 dossier、`node_modules`、临时日志或不应公开的原始资料。

## Phase 1：改进全部文字内容

### 1.1 内容盘点

- [ ] 逐一检查 `content/site.json`、`intro.json`、`room.json`、`computer.json`、`books.json`、`drawer.json`、`notebook.json`、`board.json`、`field-case.json` 和 `fax-contact.json`。
- [ ] 标记重复内容、空泛表达、过长段落、未经验证的数字和需要补充证据的位置。
- [ ] 检查每个场景是否承担不同的叙事作用，避免同一段个人介绍或项目结论反复出现。
- [ ] 确认所有公开内容不包含公司机密、私人信息或不适合公开的研究材料。

### 1.2 重写重点

- [ ] 统一网站语气：清晰、具体、有证据，同时保留 Lab 17 的研究记录感。
- [ ] 优先改进首页引导、个人 Profile、三个核心项目、Experience、Lab Log 和最终 Fax。
- [ ] 为每个项目明确问题、个人贡献、方法、结果和反思。
- [ ] 缩短纯装饰性文字，让访客更快理解每个可探索物体的价值。
- [ ] 校对语法、日期、机构名称、链接、引用和联系方式。
- [ ] 更新 dossier，使未来 AI Bot 的知识库与网站公开内容一致。

### 1.3 补充项目数据、图片和证据材料

- [ ] 为每个核心项目建立缺失信息清单，包括时间、角色、合作对象、问题、方法、工具、限制、结果、数据指标、反思和公开链接。
- [ ] 只加入经过确认、允许公开的数据；估算值、进行中的结果和个人判断必须明确标注，不能包装成已验证事实。
- [ ] 收集能帮助访客理解工作的材料，例如项目截图、原型照片、流程图、研究草图、数据图表、公开论文、演示视频和成果链接。
- [ ] 优先使用真实的过程和结果证据；装饰图片不能代替项目内容，也不要为了填满界面加入无关素材。
- [ ] 决定每项资料最适合出现的位置，例如 Computer 项目页、Books、Notebook、Drawer、Board 或 Field Case，避免同一材料无目的重复。
- [ ] 将公开图片和资料按项目整理到清楚的目录，例如 `public/projects/<project-slug>/`；使用可读、稳定、不含空格和敏感信息的文件名。
- [ ] 上传前检查版权、来源、人物隐私、公司机密和文件隐藏 metadata；不能确认公开权限的材料先不加入仓库。
- [ ] 为网页优化图片尺寸、压缩率和格式，避免直接使用过大的原图；需要时准备缩略图和高分辨率版本。
- [ ] 为有信息价值的图片添加准确的 alt text、标题或说明，并在需要时记录来源和日期。
- [ ] 在桌面、手机和 3D 窗口中检查裁切、清晰度、文字可读性、加载速度和失败时的 fallback。
- [ ] 新增公开事实后同步更新 dossier，保证未来 AI Bot 的回答与网站内容一致；图片中的关键信息不能只存在于图像里，也要有可检索文字。
- [ ] 每完成一个项目的数据或图片补充，就按“持续 Commit / Push 规则”检查、commit 并 push；建议使用 `content: expand <project>` 或 `assets: add <project> evidence`。

完成标准：每个核心项目都有完整的基础事实、至少一项有意义的视觉或证据材料、清楚的图片说明，并且没有版权、隐私、机密或明显性能问题。

### 1.4 内容验收

- [ ] 由 Alina 完成最终事实确认。
- [ ] 在桌面端和手机端检查长文本是否溢出或难以阅读。
- [ ] 确认所有场景都能在不依赖 AI Bot 的情况下独立表达核心信息。
- [ ] 运行测试和 production build。

## Phase 2：把正式网站放到 GitHub `main`

- [ ] 拉取 GitHub 最新状态并比较 `main` 与当前设计分支，先处理可能的冲突和其他 worktree 的未合并工作。
- [ ] 为合并前状态创建一个中性命名的备份 tag，确保可以恢复，但不要继续把旧版本编号当作产品名称。
- [ ] 通过 Pull Request 将经过内容验收的网站合并到 `main`。
- [ ] 确认 GitHub 默认分支仍为 `main`，README 首页展示的是 Lab 17 正式网站。
- [ ] 在全新的本地目录或干净环境中从 `main` 安装依赖、运行测试并完成 production build。
- [ ] 确认 GitHub 仓库没有 `.env`、API Key、Cloudflare Token、私有 dossier 或不应公开的文件。

完成标准：GitHub `main` 是唯一的正式网站源代码，并且可以从干净环境成功构建。

## Phase 3：移除旧的版本编号身份

这里的目标是移除名称和维护结构中的旧版本身份，不是丢失 Git 历史。

- [ ] 将 `package.json` 和 `package-lock.json` 中的项目名改为中性的 `alina-portfolio`；正式发布前先将旧设计编号重置为预发布版本 `0.9.0`。
- [ ] 重写 README，使其只介绍 Alina Portfolio / Lab 17，不再介绍某个设计版本或专用分支。
- [ ] 将旧概念文档中仍然有效的设计规则合并到 `DESIGN.md`，然后删除重复的旧概念文档。
- [ ] 更新 `DESIGN.md` 标题和正文中的旧版本名称。
- [ ] 检查页面 metadata、Open Graph 图片文字、测试名称、脚本名称和注释。
- [ ] 全仓库搜索旧版本编号、旧分支名称和旧产品名称，确保正式文件中不再出现。
- [ ] `main` 验证完成后，再删除不再需要的远程设计分支、本地分支和对应 worktree；执行删除前单独确认目标。
- [ ] 完成清理后更新本 TODO，移除为了执行清理而暂时保留的旧名称和链接。

完成标准：访客、GitHub 首页、构建产物和维护文档都只把它称为 Alina Portfolio 或 Lab 17。

## Phase 4：建立版本编号和手动发布制度

版本号代表已经正式发布给访客的版本，不代表 commit 数量、设计分支编号或每天的开发进度。没有正式发布的普通修改不需要升级版本号。

### 4.1 版本编号规则

使用 `MAJOR.MINOR.PATCH`：

| 位置 | 含义 | 本网站的判断标准 | 示例 |
| --- | --- | --- | --- |
| `MAJOR` | 核心体验发生重大改变 | 访客使用和理解网站的方式明显变化，例如 AI Guide 成为核心探索方式、整体叙事或导航重做 | `1.4.2` → `2.0.0` |
| `MINOR` | 向后兼容的重要新增 | 新项目、新场景、新内容类型、一轮明显的 3D 升级或新的访客功能 | `1.1.3` → `1.2.0` |
| `PATCH` | 修复和小幅改进 | 错字、链接、手机布局、点击区域、性能、无障碍或小型视觉修复 | `1.2.0` → `1.2.1` |

- [ ] 将正式上线前的整理阶段设为 `0.9.0`。
- [ ] 第一次完整发布前使用 `1.0.0-rc.1` 作为 release candidate；如果发现问题，依次使用 `rc.2`、`rc.3`。
- [ ] 第一次绑定 `alinawu.com` 的公开稳定版设为 `1.0.0`。
- [ ] 将新增项目、场景或明显 3D 升级作为 `MINOR` 发布，例如 `1.1.0`。
- [ ] 将只包含修复的版本作为 `PATCH` 发布，例如 `1.1.1`。
- [ ] 如果 AI Guide 变成网站的核心探索和问答方式，将其作为 `2.0.0`；如果只是可选的小功能，则可以作为 `1.x.0`。
- [ ] CMS、analytics 或内部重构如果不改变访客体验，不单独要求 `MAJOR` 版本；它们随下一次有公开价值的 release 一起记录。
- [ ] `MAJOR` 增加时把 `MINOR` 和 `PATCH` 重置为零；`MINOR` 增加时把 `PATCH` 重置为零。

### 4.2 版本号的唯一来源和显示位置

- [ ] 以 `package.json` 的 `version` 作为唯一权威版本号。
- [ ] 使用版本工具同步更新 `package-lock.json`，不要分别手改两个不一致的号码。
- [ ] 新建 `CHANGELOG.md`，按版本记录公开变化。
- [ ] 每个正式版本创建完全对应的 Git tag，例如 package version `1.2.0` 对应 tag `v1.2.0`。
- [ ] 每个 tag 创建同名 GitHub Release，并填写该版本的发布说明。
- [ ] 网站构建时自动从 `package.json` 读取版本，不在多个 JSON 或组件中重复维护号码。
- [ ] 在 Lab 17 的 computer System Bulletin、README 窗口或较低调的位置显示 `Portfolio System v1.2.0`；不要把版本号放在首页主标题中。
- [ ] 在 Cloudflare deployment message 或 version tag 中记录相同的 release 版本，方便定位和回退。

完成标准：修改一次 `package.json` 后，网站显示、Git tag、GitHub Release、CHANGELOG 和 Cloudflare deployment 都能对应到同一个版本。

### 4.3 网站电脑中的 Version History 应用

在 Lab 17 的电脑里增加一个符合系统氛围的版本历史应用。建议使用同一个窗口提供两个入口：

- Computer 桌面上的 `SYSTEM_UPDATES.app` 或 `VERSION_HISTORY.md`
- Profile / System Information 窗口里的 **Version History…** 按钮

这样访客既可以主动发现它，也可以从查看当前系统版本的位置进入，不需要在首页额外增加版本入口。

#### 当前版本界面

- [ ] 在窗口顶部显示产品名称，例如 `ALINA PORTFOLIO / LAB 17`。
- [ ] 自动显示 `package.json` 中的当前版本，例如 `Version 1.2.0`。
- [ ] 显示发布日期和状态，例如 `Stable`、`Release Candidate` 或 `Preview`。
- [ ] 用一句简短文字概括当前版本，例如 “Introduced the AI Lab Guide and dossier Q&A.”
- [ ] 提供 **View Version History**，展开过往正式版本。
- [ ] 保持 macOS About / Software Update 的清楚层级，但继续使用网站现有的 Lab 17 视觉语言，不直接复制 Apple 界面。

#### 版本历史列表

- [ ] 按时间倒序显示，最新版本在最上方。
- [ ] 每个版本显示版本号、发布日期、版本标题和 1–3 条简短概要。
- [ ] 使用容易识别但不过度抢眼的标签区分 `MAJOR`、`MINOR`、`PATCH`。
- [ ] 重大版本可以使用更完整的卡片，普通修复版本默认保持紧凑。
- [ ] 允许展开某个版本查看 Added、Changed 和 Fixed 的详细内容。
- [ ] 可选：提供该版本的 GitHub Release 链接，但不要求普通访客理解 commit 或内部部署信息。
- [ ] 可选：为与场景有关的变化提供 **Explore this update**，带访客前往对应项目、物体或 AI Guide。
- [ ] 旧版本较多时采用滚动、折叠或按 major version 分组，避免窗口无限变长。

建议显示效果：

```text
LAB 17 SYSTEM UPDATES
Current Version 2.0.0 · Stable

2.0.0 — AI Lab Guide
2027-03-15 · MAJOR
AI can now guide exploration and answer from the public dossier.

1.2.0 — Expanded Field Notes
2026-12-08 · MINOR
Added a new project record and improved the notebook experience.

1.1.1 — Interaction Fixes
2026-10-21 · PATCH
Improved mobile hotspots and camera transitions.
```

#### 版本历史数据

- [ ] 新建 `content/releases.json`，只存放已经发布或明确标记为 prerelease 的公开版本概要。
- [ ] 每条记录包含 `version`、`date`、`title`、`type`、`summary`、`highlights` 和可选的 `releaseUrl`、`relatedScene`。
- [ ] 当前版本号仍然只从 `package.json` 读取；`releases.json` 负责历史内容，不成为第二个当前版本来源。
- [ ] CI 检查 `releases.json` 最新稳定记录、Git tag 和 `package.json` version 是否一致。
- [ ] 正式网站默认不显示普通 commit、内部 build、未发布草稿或失败部署。
- [ ] Release Candidate 只能在 preview 中显示 `Prerelease` 状态；正式站点只显示已经发布的稳定版本。
- [ ] 初期继续使用 JSON，不需要为了 Version History 增加数据库或 CMS。
- [ ] 未来 CMS 可以辅助撰写 release summary，但版本记录仍随正式 release 一起进入 Git 历史。

数据结构示例：

```json
{
  "releases": [
    {
      "version": "1.0.0",
      "date": "YYYY-MM-DD",
      "title": "Initial Public Release",
      "type": "major",
      "summary": "The first public release of the Lab 17 portfolio.",
      "highlights": [
        "Introduced the complete 3D laboratory exploration",
        "Published the first project and research case files"
      ],
      "releaseUrl": "https://github.com/alinaaaw/portfolio/releases/tag/v1.0.0"
    }
  ]
}
```

#### 交互和无障碍要求

- [ ] Version History 窗口沿用现有 computer 的打开、聚焦、拖动、最小化和关闭行为。
- [ ] 桌面图标支持单击选中、双击打开、Enter 打开和清楚的 focus 状态。
- [ ] 版本列表支持键盘滚动，展开按钮具有正确的 `aria-expanded` 状态。
- [ ] 在窄屏和手机 close-up 中保证版本号、日期和概要不会被截断。
- [ ] 即使 JavaScript 动画被减少，版本信息仍可完整访问。

完成标准：访客可以在网站电脑中查看当前版本与全部正式发布历史；显示内容与 GitHub Release 一致，并且不会暴露未发布开发记录。

### 4.4 CHANGELOG 和 Release Notes 格式

每个正式版本至少记录日期和以下适用分类：

```markdown
## [1.2.0] - YYYY-MM-DD

### Added
- 新增了什么

### Changed
- 改进了什么

### Fixed
- 修复了什么

### Security
- 与隐私或安全有关的变化
```

- [ ] Release Notes 面向访客，描述他们能感受到的变化，避免只写内部文件名或技术 commit。
- [ ] `CHANGELOG.md` 可以更完整，但必须与 GitHub Release 的版本和日期一致。
- [ ] 对重大版本写清楚为什么升级 `MAJOR`，以及旧体验发生了什么变化。
- [ ] 对修复版本明确修复范围，不把未完成或未发布的工作写入 release notes。
- [ ] 每次发布记录前一个稳定版本，作为紧急回退目标。

### 4.5 GitHub Actions 分工

创建三个职责明确的 workflow，避免一个 workflow 同时承担测试、预览和生产发布。

#### `.github/workflows/ci.yml`

- [ ] 在 Pull Request 和 `main` push 时运行。
- [ ] 执行依赖安装、lint、自动测试和 production build。
- [ ] 不使用生产 Cloudflare secret，不更新正式 Worker，也不修改 `alinawu.com`。
- [ ] 将 CI 通过设为合并 Pull Request 前的必要条件。

#### `.github/workflows/preview.yml`

- [ ] 仅在需要预览时手动触发，或为经过批准的 Pull Request 触发。
- [ ] 先完成与 CI 相同的测试和 build。
- [ ] 使用 `wrangler versions upload` 上传独立 Worker version，而不是直接运行会切换生产流量的部署。
- [ ] 为重要预览设置容易识别的 alias，例如 `staging` 或 release candidate 名称。
- [ ] 在 workflow 输出或 Pull Request 中提供 `*.workers.dev` 预览链接。
- [ ] 如果内容未准备公开，使用 Cloudflare Access 保护 preview URL。

#### `.github/workflows/release.yml`

- [ ] 只响应 GitHub Release 的 `published` 事件，不响应普通 branch push。
- [ ] 确认 release tag 来自 `main` 上已验收的 commit。
- [ ] 检查 Git tag `vX.Y.Z` 与 `package.json` 的 `X.Y.Z` 完全一致，不一致就停止部署。
- [ ] 重新执行依赖安装、测试和 production build，不能直接信任较早的本地 build。
- [ ] 只有全部检查通过后才部署到 Cloudflare production。
- [ ] 部署完成后自动执行根域名和关键静态资源 smoke test。
- [ ] 记录 Git commit、Git tag、Cloudflare deployment 和发布时间之间的对应关系。

### 4.6 发布权限和 secrets

- [ ] 在 GitHub 创建名为 `production` 的 Environment，只有 release workflow 可以使用。
- [ ] 可选：为 `production` Environment 开启人工 approval，形成点击 Publish Release 之后的第二次确认。
- [ ] 将最小权限的 Cloudflare API Token 和 Account ID 存在 GitHub Actions secrets 或受保护的 Environment secrets 中。
- [ ] 不在 workflow 文件、README、日志输出或 Git remote URL 中写入 token。
- [ ] `OPENAI_API_KEY` 继续作为 Cloudflare runtime secret 管理，不因为网站部署而放进前端 bundle。
- [ ] 定期轮换部署 token；删除不再使用的 token 和 workflow 权限。

### 4.7 每次正式发布的操作顺序

普通开发、commit、push 和合并到 `main` 时都不修改版本号。只有 Alina 确认“这一批修改准备成为一个正式 release”之后，才执行下面的版本准备工作。

#### 手动修改版本号

根据当前版本和发布内容选择一个命令：

```bash
# 只包含修复，例如 1.2.0 → 1.2.1
npm version patch --no-git-tag-version

# 新增功能，例如 1.2.1 → 1.3.0
npm version minor --no-git-tag-version

# 核心体验重大变化，例如 1.4.2 → 2.0.0
npm version major --no-git-tag-version
```

也可以为第一次发布或 prerelease 指定准确版本：

```bash
npm version 1.0.0-rc.1 --no-git-tag-version
npm version 1.0.0 --no-git-tag-version
```

`--no-git-tag-version` 必须保留。它让 npm 只同步修改 `package.json` 和 `package-lock.json`，不会在测试完成前提前创建 Git commit 或 tag。

- [ ] 执行版本命令前确认当前 branch 正确、工作内容完整，并且没有意外文件混入 release。
- [ ] 执行后检查两个 package 文件中的 version 完全一致。
- [ ] 不为了单独一次 commit 或一次 push 增加版本号。
- [ ] 一个正式 release 只增加一次版本号；测试期间的继续修改仍属于同一个待发布版本。
- [ ] 如果 release candidate 需要再次验收，增加 prerelease 编号，例如 `rc.1` → `rc.2`，不要提前发布稳定版。

#### 手动增加版本概要

版本号更新后，在 `content/releases.json` 新增一条公开概要：

```json
{
  "version": "1.2.0",
  "date": "YYYY-MM-DD",
  "title": "Expanded Lab Experience",
  "type": "minor",
  "summary": "Improved the 3D laboratory and added a new project record.",
  "highlights": [
    "Improved camera transitions and object interactions",
    "Added a new project case file",
    "Optimized the mobile exploration experience"
  ],
  "releaseUrl": "https://github.com/alinaaaw/portfolio/releases/tag/v1.2.0"
}
```

- [ ] `title` 使用访客能理解的版本名称，不使用内部任务编号。
- [ ] `summary` 保持一句话，说明这一版最重要的变化。
- [ ] `highlights` 保留 1–5 条真正值得访客知道的变化。
- [ ] `type` 必须与版本升级方式一致：`major`、`minor` 或 `patch`。
- [ ] 只记录已经准备公开的变化，不包含 unfinished、internal-only 或未确认内容。
- [ ] 同时把更完整的 Added、Changed、Fixed、Security 内容写进 `CHANGELOG.md`。
- [ ] AI 可以根据 commit 和工作笔记生成概要草稿，但必须由 Alina 修改、确认后再发布。

#### 自动化 release preparation 工具

手动流程稳定后，增加一个只负责“准备 release”、绝不直接发布的本地工具：

```text
npm run release:prepare
```

建议交互：

```text
Current version: 1.2.1
Release type: patch / minor / major / prerelease
Release title:
Short summary:
Highlights:
Release date:
```

工具应自动完成：

- [ ] 根据选择计算下一个版本号。
- [ ] 同步更新 `package.json` 和 `package-lock.json`。
- [ ] 在 `content/releases.json` 顶部添加结构正确的版本记录。
- [ ] 在 `CHANGELOG.md` 添加对应版本、日期和分类标题。
- [ ] 验证版本号尚未被 Git tag 或 GitHub Release 使用。
- [ ] 验证最新 release record 与 package version 一致。
- [ ] 运行 JSON/schema 检查、测试和 production build。
- [ ] 输出本次准备修改的 diff 和下一步操作说明。

工具禁止自动执行：

- [ ] 不自动 push 到 GitHub。
- [ ] 不自动创建或覆盖 Git tag。
- [ ] 不自动 Publish GitHub Release。
- [ ] 不自动部署或切换 Cloudflare production。
- [ ] 不在检查失败时留下部分更新；失败后应恢复到运行前状态或明确列出待修复文件。

这样自动化只负责减少重复输入和版本不一致，最终发布权始终保留给 Alina。

#### 完整发布步骤

1. 在 feature branch 完成修改和本地测试。
2. 通过 Pull Request 合并到 `main`；此时只运行 CI，不更新正式网站。
3. 根据变化决定 `MAJOR`、`MINOR` 或 `PATCH`。
4. 手动执行对应的 `npm version ... --no-git-tag-version`，或运行 `npm run release:prepare`。
5. 检查并确认 `package.json`、`package-lock.json`、`CHANGELOG.md` 和 `content/releases.json`。
6. 在网站电脑的 Version History 预览中检查版本号、标题、日期和概要。
7. 提交一个清楚的 release commit，例如 `release: v1.2.0`。
8. 再次运行完整测试和 production build。
9. 创建 tag `v1.2.0`，并从该 tag 创建 Draft GitHub Release。
10. 填写 Release Notes，并使用该 tag 的 Cloudflare preview 完成最终验收。
11. Alina 明确点击 **Publish release**。
12. Release workflow 验证版本、构建并部署到 Cloudflare production。
13. 检查 `alinawu.com`、`www` 重定向、核心探索流程和社交预览。
14. 确认正常后将 release 标记为稳定；如果失败，立即执行回退。

### 4.8 回退和紧急修复

- [ ] 永远不移动、覆盖或重新使用已经发布的 release tag。
- [ ] Cloudflare 保留上一个稳定 deployment；严重问题时先恢复上一版流量。
- [ ] 回退后保留有问题的 GitHub Release 和 CHANGELOG 记录，并注明已撤回或存在已知问题。
- [ ] 在新 branch 修复问题，发布新的 `PATCH` 版本，例如从 `1.2.0` 修复为 `1.2.1`。
- [ ] 不直接修改已经发布的 `1.2.0` 来伪装成同一个版本。

完成标准：普通 push 和 `main` 合并都不会更新 `alinawu.com`；只有 Alina 发布 GitHub Release 并通过 production approval 后，正式网站才会变化。

## Phase 5：建立 Cloudflare 预览部署

这一阶段只验证托管流程，不绑定 `alinawu.com` 作为正式域名。

- [ ] 在 Cloudflare Workers 中创建或连接用于 Alina Portfolio 的 Worker，确认配置与当前 vinext/Worker 项目一致。
- [ ] 以 GitHub Actions 作为 production release controller，不允许 Cloudflare 在每次 `main` push 后自动推广新版本。
- [ ] 如果保留 Cloudflare 原生 Git 集成，将 push 的 deploy command 设置为只上传 version，不自动切换 production traffic。
- [ ] 通过 `preview.yml` 首次上传到独立的 `*.workers.dev` versioned preview URL。
- [ ] 确认普通 push 只产生 CI 结果；只有明确触发 preview workflow 时才产生新的 Cloudflare preview version。
- [ ] 确认预览失败时可以查看 GitHub Actions 和 Cloudflare 日志，但不会影响当前正式 deployment。
- [ ] 暂时不绑定自定义域名；如果预览内容不适合公开，使用 Cloudflare Access 或关闭公开预览。

完成标准：`main` 可以稳定生成可访问的 Cloudflare 预览站点，但 `alinawu.com` 尚未切换到它。

## Phase 6：改进 3D 建模和探索体验

### 6.1 视觉与模型

- [ ] 检查房间比例、家具轮廓、物体辨识度和整体空间层次。
- [ ] 优先改进最重要的交互区域：computer、bookshelf、drawer、notebook、board、field case 和 fax。
- [ ] 统一材质、粗糙度、颜色、阴影和光照方向，减少临时几何体的感觉。
- [ ] 优化有明显锯齿、穿模、漂浮、遮挡或比例不自然的模型。
- [ ] 只有在确实提升效果时才引入外部 3D 资产，并记录来源和授权。

### 6.2 交互与镜头

- [ ] 改进 camera transition，避免突然跳动、穿过物体或让访客失去方向。
- [ ] 检查 hotspot 与模型位置是否一致，扩大手机和触控设备上过小的点击区域。
- [ ] 为所有重要交互提供清楚的 hover、focus、selected 和返回状态。
- [ ] 确认键盘操作、触控操作、减少动态效果偏好和退出 close-up 的方式。

### 6.3 性能

- [ ] 控制模型面数、纹理尺寸、阴影数量和首次加载资源体积。
- [ ] 检查普通笔记本电脑和手机上的帧率、发热和加载时间。
- [ ] 对非首屏模型和媒体使用延迟加载，避免为了细节牺牲整个网站的可访问性。
- [ ] 运行 production build、自动测试和完整探索流程测试。

完成标准：3D 改动有明确的视觉提升，在桌面和手机上都能顺畅完成完整探索。

## Phase 7：正式发布检查

- [ ] 从第一次进入到发现最终 Fax，完整走一遍核心体验。
- [ ] 检查桌面、手机、触控、键盘和常见浏览器。
- [ ] 检查全部链接、email、社交分享 metadata、favicon 和 `public/og.png`。
- [ ] 确认 404、AI 服务不可用、图片加载失败等情况不会破坏主体验。
- [ ] 确认 repository 和最终 bundle 中没有 secrets 或私有材料。
- [ ] 确认 `main` 的最终 commit 与通过验收的 Cloudflare preview 完全一致。
- [ ] 确认 `package.json`、`package-lock.json`、`content/releases.json`、`CHANGELOG.md`、Git tag 和 Draft GitHub Release 使用同一个版本号。
- [ ] 检查 computer 中的 Version History 窗口，确认当前版本、日期、概要和 GitHub Release 链接正确。
- [ ] 确认 release workflow 只监听 GitHub Release `published`，不会被普通 push 触发。
- [ ] 记录准备回退的上一版稳定 Cloudflare deployment。

## Phase 8：Cloudflare 正式发布

这是绑定自定义域名的时间点：文字、正式 `main`、旧名称清理、3D 改进和发布检查全部完成之后。

- [ ] 在 Cloudflare 中确认已经拥有并管理 `alinawu.com` 的 zone。
- [ ] 将 Worker Custom Domain 绑定到 `alinawu.com`。
- [ ] 决定 `www.alinawu.com` 是同时提供访问，还是永久重定向到 `alinawu.com`。
- [ ] 创建第一个正式 tag `v1.0.0` 和 Draft GitHub Release，完成最终 preview 验收。
- [ ] 由 Alina 点击 **Publish release**，让 release workflow 部署 `v1.0.0`。
- [ ] 验证 HTTPS、根域名、`www`、社交预览和移动端访问。
- [ ] 发布后进行一次 smoke test，并观察首日错误与性能情况。
- [ ] 保留上一版 deployment，出现严重问题时可以快速回退。

完成标准：访问 `https://alinawu.com` 会直接进入已经验收的 Lab 17 正式网站。

## 发布后的后续工作

这些功能不阻塞第一次发布，按照 [BACKEND-ROADMAP.md](./BACKEND-ROADMAP.md) 继续：

- [ ] 访客 AI Lab Guide 和 dossier 问答
- [ ] 高频问题、探索路径、聊天效果和用户反馈分析
- [ ] 只管理 Lab Log 的轻量 CMS 与 AI 草稿功能
- [ ] CMS 扩展到 projects、books 和媒体上传

## 推荐发布方式

首选方案是 **GitHub `main` + GitHub Releases/Actions + Cloudflare Worker Versions + Cloudflare Custom Domain**：

```text
本地或 feature branch 修改
→ Pull Request
→ 合并到 GitHub main
→ CI 测试，不更新正式网站
→ 更新版本号和 CHANGELOG
→ 创建 tag 和 Draft GitHub Release
→ workers.dev version preview 验证
→ Alina 点击 Publish release
→ GitHub Actions 部署 Cloudflare production
→ alinawu.com 更新
```

不要启用“每次 push 到 `main` 就运行 `wrangler deploy`”的配置。普通开发只做 CI，预览只上传独立 version，正式 deployment 只由发布 GitHub Release 触发。

不建议把 GitHub Pages 作为最终托管方式。当前项目已经使用 Cloudflare Worker 兼容架构，未来的 AI API、secret、analytics 和 CMS 也需要服务器能力；继续使用 Cloudflare 可以避免之后再次迁移托管平台。
