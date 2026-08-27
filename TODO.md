# Portfolio Launch TODO

目标：把 Lab 17 整理成唯一的正式作品集，发布到 GitHub `main`，移除旧的版本编号身份，先以 `0.8.0` 在 Cloudflare 和 `alinawu.com` 对外开放，再完成 3D 与发布系统改进，最终在同一域名发布稳定版 `1.0.0`。

## 项目链接

- GitHub 仓库：[alinaaaw/portfolio](https://github.com/alinaaaw/portfolio)
- GitHub `main`：[查看 main](https://github.com/alinaaaw/portfolio/tree/main)
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
- [ ] 只有准备对外提供一份有明确身份的新版本时才修改版本号；`0.8.0` 早期公开版不冒充稳定 release，正式稳定版本再创建 Git tag 和 GitHub Release。
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
- [ ] 永远不提交 `.env`、API Key、Cloudflare Token、超出已确认仓库访问范围的 dossier、`node_modules`、临时日志或不应公开的原始资料。

## Phase 1：改进全部文字内容

当前阶段只处理文字以及文字中需要呈现的事实和数据，不要求补项目图片，也不盘点 GitHub 小网页。

### 1.1 内容盘点

- [x] 逐一检查 `content/site.json`、`intro.json`、`room.json`、`computer.json`、`books.json`、`drawer.json`、`notebook.json`、`board.json`、`field-case.json` 和 `fax-contact.json`。
- [x] 标记重复内容、空泛表达、过长段落、未经验证的数字和需要补充证据的位置。
- [x] 检查每个场景是否承担不同的叙事作用，避免同一段个人介绍或项目结论反复出现。
- [x] 确认所有公开内容不包含公司机密、私人信息或不适合公开的研究材料。

### 1.2 重写重点

- [x] 统一网站语气：清晰、具体、有证据，同时保留 Lab 17 的研究记录感。
- [x] 优先改进首页引导、个人 Profile、三个核心项目、Experience、Lab Log 和最终 Fax。
- [x] 为每个项目明确问题、个人贡献、方法、结果和反思。
- [x] 缩短纯装饰性文字，让访客更快理解每个可探索物体的价值。
- [x] 校对语法、日期、机构名称、链接、引用和联系方式。
- [x] 更新 dossier，使未来 AI Bot 的知识库与网站公开内容一致。

### 1.3 补充项目事实和数据

- [x] 为每个核心项目建立缺失信息清单，包括时间、角色、合作对象、问题、方法、工具、限制、结果、数据指标、反思和公开链接。
- [x] 只加入经过确认、允许公开的数据；估算值、进行中的结果和个人判断必须明确标注，不能包装成已验证事实。
- [x] 将重要数据自然写进项目叙事，说明数据代表什么、如何得到以及它如何支持结论，避免只堆数字。
- [x] 检查数据来源、单位、时间范围和上下文；涉及公司、研究参与者或未公开成果的数据必须先确认可以公开。
- [x] 新增公开事实后同步更新 dossier，保证未来 AI Bot 的回答与网站内容一致。
- [x] 每完成一个项目的文字和数据补充，就按“持续 Commit / Push 规则”检查、commit 并 push；建议使用 `content: expand <project>`。

完成标准：每个核心项目都有足够的基础事实和经过确认的数据，访客只阅读文字也能理解问题、Alina 的贡献、过程、结果和反思。

### 1.4 内容验收

- [x] 由 Alina 完成最终事实确认。
- [x] 在桌面端和手机端检查长文本是否溢出或难以阅读。
- [x] 确认所有场景都能在不依赖 AI Bot 的情况下独立表达核心信息。
- [x] 运行测试和 production build。

## Phase 2：移除旧的版本编号身份

这里的目标是移除名称和维护结构中的旧版本身份，不是丢失 Git 历史。

- [x] 拉取 GitHub 最新状态并比较 `main` 与当前工作分支，先处理可能的冲突和其他 worktree 中仍需保留的工作。
- [x] 在开始清理前创建一个中性命名的备份 tag，记录当前可恢复状态，但不要继续把旧版本编号当作产品名称。
- [x] 将 `package.json` 和 `package-lock.json` 中的项目名改为中性的 `alina-portfolio`；清理旧设计编号时将当前开发基线重置为 `0.8.0`。
- [x] 重写 README，使其只介绍 Alina Portfolio / Lab 17，不再介绍某个设计版本或专用分支。
- [x] 将旧概念文档中仍然有效的设计规则合并到 `DESIGN.md`，然后删除重复的旧概念文档。
- [x] 更新 `DESIGN.md` 标题和正文中的旧版本名称。
- [x] 检查页面 metadata、Open Graph 图片文字、测试名称、脚本名称和注释。
- [x] 全仓库搜索旧版本编号、旧分支名称和旧产品名称，确保正式文件中不再出现。
- [x] 在当前工作分支运行测试和 production build，确认重命名和文档清理没有破坏网站。

完成标准：准备合并的工作分支已经通过验证；访客可见内容、构建产物和维护文档都只把网站称为 Alina Portfolio 或 Lab 17。

## Phase 3：把正式网站放到 GitHub `main`

- [x] 最后比较 `main` 与已经完成 Phase 2 清理的工作分支，确认 Pull Request 只包含准备正式保留的内容。
- [x] 确认仓库没有 `.env`、API Key、Cloudflare Token，且 dossier 与其他材料均符合已确认的 private-repository 访问范围。
- [x] 通过 Pull Request 将经过内容验收和旧名称清理的网站合并到 `main`。
- [x] 确认 GitHub 默认分支仍为 `main`，README 首页展示的是 Alina Portfolio / Lab 17 正式网站。
- [x] 在全新的本地目录或干净环境中从 `main` 安装依赖、运行测试并完成 production build。
- [x] 确认 `main` 的 commit、构建结果和 Phase 2 验收过的工作分支一致。
- [x] `main` 验证成功后，再删除不需要的远程设计分支、本地分支和对应 worktree；删除前单独确认精确目标。
- [x] 完成合并与分支清理后更新本 TODO，移除为了执行迁移而暂时保留的旧名称、分支和比较链接。

完成标准：GitHub `main` 是唯一的正式网站源代码，可以从干净环境成功构建，并且旧工作分支在确认不再需要后得到安全清理。

## Phase 3.5：在 `alinawu.com` 对外发布 `0.8.0`

这一阶段提前让外部用户通过正式根域名访问网站，但 `0.8.0` 仍是尚在继续改进的早期公开版本，不是稳定版 `1.0.0`。不创建 `preview.alinawu.com`；网站只在内部版本位置显示当前版本号，外部访问地址从这一阶段开始始终保持为 `https://alinawu.com`。

- [x] 确认 `main` 已完成 Phase 1–3，并且 `package.json` 与 `package-lock.json` 都显示 `0.8.0`。
- [x] 在 Computer 的 System Bulletin、Version History 或其他低调位置显示 `Portfolio System v0.8.0`，不额外创建醒目的 Preview 页面或不同访问入口。
- [x] 从干净的 `main` 安装依赖、运行测试和 production build；再次检查 repository 与 bundle 中没有 secret、私有 dossier、公司机密或不应公开的个人资料。
- [ ] 在 Cloudflare 中确认已经拥有并管理 `alinawu.com` 的 active zone，然后创建或连接 Alina Portfolio Worker。
- [ ] 将 Worker Custom Domain 绑定到 `alinawu.com`；让 Cloudflare 创建对应 DNS 记录和 HTTPS certificate。
- [ ] 将 `www.alinawu.com` 永久重定向到 `alinawu.com`，确保对外只有一个 canonical 地址。
- [ ] 把经过验收的 `0.8.0` Worker version 明确部署到 custom domain traffic；仅上传 version 不会改变 `alinawu.com`，必须由 Alina 手动确认 deployment。
- [ ] 记录 `https://alinawu.com`、Git commit SHA、Cloudflare version/deployment ID、发布日期和 `0.8.0` 简要说明，确保之后能确认域名正在运行哪一份代码。
- [x] 决定 `0.8.0` 是否暂时设置 `noindex, nofollow`；如果设置，必须在正式 `1.0.0` 发布时移除。无论是否索引，网站内都只显示正常版本号。
- [x] 提供一个简单的反馈入口，说明希望测试者重点检查什么；不要在尚未建立隐私方案时收集敏感个人信息。
- [ ] 使用真实 `https://alinawu.com` 检查 HTTPS、桌面端、手机端、核心探索路线、所有外部链接、404 和资源加载失败状态。
- [x] 普通 push 到 `main` 不自动更新 `alinawu.com`；只有 Alina 确认一批修改已经可对外显示后，才手动创建新的 Cloudflare deployment。
- [ ] `0.8.0` 期间的多次外部测试由 Cloudflare version ID 与 Git commit 区分，不为了每次反馈修复反复增加产品版本号。

完成标准：外部用户访问 `https://alinawu.com` 可以看到内部标注为 `0.8.0` 的网站；没有 `preview.alinawu.com`，普通 push 不会更新域名，后续 deployment 仍由 Alina 手动决定。

## Phase 4：建立版本编号和手动发布制度

版本号代表一份有明确身份、可供外部测试或已经正式发布的版本，不代表 commit 数量、设计分支编号或每天的开发进度。普通修改不需要升级版本号。

### 4.1 版本编号规则

使用 `MAJOR.MINOR.PATCH`：

| 位置 | 含义 | 本网站的判断标准 | 示例 |
| --- | --- | --- | --- |
| `MAJOR` | 核心体验发生重大改变 | 访客使用和理解网站的方式明显变化，例如 AI Guide 成为核心探索方式、整体叙事或导航重做 | `1.4.2` → `2.0.0` |
| `MINOR` | 向后兼容的重要新增 | 新项目、新场景、新内容类型、一轮明显的 3D 升级或新的访客功能 | `1.1.3` → `1.2.0` |
| `PATCH` | 修复和小幅改进 | 错字、链接、手机布局、点击区域、性能、无障碍或小型视觉修复 | `1.2.0` → `1.2.1` |

- [ ] 当前可运行的网站以及 Phase 3.5 的第一轮早期公开版本使用 `0.8.0`；普通 commit 和测试反馈修复不反复增加这个号码。
- [ ] 3D 改进和正式发布结构基本完成、准备进行更完整的 beta 验收时使用 `0.9.0-beta.1`；如果 beta 阶段需要再次发布测试版，依次使用 `beta.2`、`beta.3`。
- [ ] 文字、3D 和发布流程全部完成，网站达到“如果没有阻塞问题就可以正式上线”的状态时使用 `1.0.0-rc.1`；如果发现问题，依次使用 `rc.2`、`rc.3`。
- [ ] 将 `alinawu.com` 从早期公开版本升级为第一个公开稳定版时设为 `1.0.0`；域名保持不变，只更新经过验收的网站版本。
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
npm version 0.8.0 --no-git-tag-version
npm version 0.9.0-beta.1 --no-git-tag-version
npm version 1.0.0-rc.1 --no-git-tag-version
npm version 1.0.0 --no-git-tag-version
```

`--no-git-tag-version` 必须保留。它让 npm 只同步修改 `package.json` 和 `package-lock.json`，不会在测试完成前提前创建 Git commit 或 tag。

- [ ] 执行版本命令前确认当前 branch 正确、工作内容完整，并且没有意外文件混入 release。
- [ ] 执行后检查两个 package 文件中的 version 完全一致。
- [ ] 不为了单独一次 commit 或一次 push 增加版本号。
- [ ] 一个正式 release 只增加一次版本号；测试期间的继续修改仍属于同一个待发布版本。
- [ ] 如果 beta 或 release candidate 需要再次验收，增加 prerelease 编号，例如 `beta.1` → `beta.2` 或 `rc.1` → `rc.2`，不要提前发布稳定版。

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

完成标准：Phase 3.5 的首次 `0.8.0` 由 Alina 明确手动部署；发布工作流建立后，普通 push 和 `main` 合并都不会更新 `alinawu.com`，后续稳定版本只有在 Alina 发布 GitHub Release 并通过 production approval 后才会变化。

## Phase 5：完善 Cloudflare 测试与发布自动化

这一阶段在 `alinawu.com` 已运行 `0.8.0` 的基础上，建立可重复的测试流程。后续候选修改继续使用独立 `*.workers.dev` Preview URL 验证，只有手动批准的 deployment 才能更新根域名。

- [ ] 复核 Phase 3.5 创建或连接的 Alina Portfolio Worker，确认配置与当前 vinext/Worker 项目一致。
- [ ] 以 GitHub Actions 作为 production release controller，不允许 Cloudflare 在每次 `main` push 后自动推广新版本。
- [ ] 如果保留 Cloudflare 原生 Git 集成，将 push 的 deploy command 设置为只上传 version，不自动切换 production traffic。
- [ ] 建立 `preview.yml`，为后续候选修改生成独立的 `*.workers.dev` versioned URL，并按需要更新 `staging` 或版本 alias；这些地址只用于内部验收，不作为对外主网址。
- [ ] 确认普通 push 只产生 CI 结果；只有明确触发 preview workflow 时才产生新的 Cloudflare preview version。
- [ ] 预览失败时优先检查 GitHub Actions 的构建与上传日志；Cloudflare Preview URL 当前不支持 Workers Logs、`wrangler tail` 或 Logpush，不能把这些日志能力作为排错前提。
- [ ] `alinawu.com` 始终保留最后一次由 Alina 手动批准的 deployment；未通过验收的 Preview version 不得切换到根域名。

完成标准：候选修改可以在独立 Cloudflare Preview URL 验证，而 `alinawu.com` 继续运行最后一个手动批准的公开版本。

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

#### Computer 窗口状态恢复

- [ ] 用户退出或关闭 Computer 的 close-up 时，只关闭电脑视图，不重置电脑内部的桌面和窗口状态。
- [ ] 再次打开 Computer 时恢复离开前已经打开的窗口、窗口中的具体页面、当前活动窗口和窗口前后层级，而不是回到默认首页。
- [ ] 在合理范围内同时恢复最小化/最大化状态、窗口位置与尺寸，以及对阅读连续性重要的滚动位置。
- [ ] 区分“离开 Computer”和“明确关闭某个 app 窗口”：前者保留状态，后者应从恢复列表中移除该窗口。
- [ ] 第一版至少在同一次网站访问期间使用前端状态保存，不需要后端；如果希望刷新网页后仍恢复，再使用 `sessionStorage` 或 `localStorage` 作为可选扩展。
- [ ] 保存到浏览器的内容只能包含界面状态，不能包含聊天内容、私人输入或其他敏感信息；数据结构升级或记录损坏时安全回到默认桌面。
- [ ] 测试多个窗口、窗口内部切页、最小化后退出、手机端退出，以及连续多次关闭和重新打开 Computer 的情况。

完成标准：访客关闭 Computer 后重新打开，可以从上次离开的窗口页面继续探索；只有明确关闭窗口、重置桌面或开始新会话时才回到默认状态。

### 6.3 EMG 建模成果的交互式 3D 展示

- [ ] 找到并整理 EMG 项目的原始 CAD、mesh、纹理、渲染图和项目说明，确认哪些文件允许公开，保留原始源文件但不直接把超大工程文件加载进网页。
- [ ] 将模型导出并优化为适合 Web 的 `glTF` / `GLB`，处理面数、法线、材质、纹理尺寸、坐标、比例和文件体积；必要时使用 Draco 或 Meshopt 压缩。
- [ ] 为 EMG 项目制作一张高质量静态渲染图作为列表预览、社交分享或低性能设备 fallback；交互窗口仍使用实时 WebGL 模型，而不是只能观看预渲染视频。
- [ ] 在站内 Computer 项目页或独立 Model Viewer 窗口打开模型，支持旋转、缩放、平移、重置视角和全屏查看。
- [ ] 根据模型内容加入有意义的交互，例如部件 hotspot、名称与功能注释、透明/剖切视图、图层开关、explode view 或装配动画；不为了炫技加入与项目解释无关的操作。
- [ ] 让访客既能从外部看到完整模型，也能进入内部或查看内部结构；优先使用预设镜头、剖切/隐藏外壳和明确的返回按钮，避免自由镜头穿模或迷失方向。
- [ ] 为鼠标、触控和键盘提供可用控制，并给减少动态效果、低性能设备和模型加载失败的用户提供静态图片、短视频或项目文字说明。
- [ ] 延迟加载 EMG 模型，只有打开展品时才下载资源；记录模型大小、首次打开时间和运行帧率，不能拖慢房间首屏。
- [ ] 将 EMG 展品的事实、部件说明和公开结论同步到 dossier，方便未来 AI Bot 在用户查看模型时回答更细的问题。

完成标准：访客可以在站内顺畅查看、操控并理解 EMG 模型，3D 加载失败时仍有完整的替代内容。首次加入 EMG 互动展品通常作为 `MINOR` 版本发布；只有它取代原有核心探索方式时才考虑 `MAJOR`。

### 6.4 性能

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

这一阶段不再更换网址，而是把已经运行 `0.8.x`/beta 的 `alinawu.com` 正式升级为稳定版 `1.0.0`。

- [ ] 复核 Phase 3.5 已完成的 `alinawu.com` Custom Domain、HTTPS certificate 和 `www` → root redirect。
- [ ] 创建第一个正式 tag `v1.0.0` 和 Draft GitHub Release，完成最终 preview 验收。
- [ ] 由 Alina 点击 **Publish release**，让 release workflow 部署 `v1.0.0`。
- [ ] 将网站内部版本显示更新为 `1.0.0`，移除 `0.8.0` 阶段可能启用的 `noindex, nofollow`，并确认 canonical 与 Open Graph URL 都使用 `https://alinawu.com`。
- [ ] 验证 HTTPS、根域名、`www`、社交预览和移动端访问。
- [ ] 发布后进行一次 smoke test，并观察首日错误与性能情况。
- [ ] 保留上一版 deployment，出现严重问题时可以快速回退。

完成标准：访问 `https://alinawu.com` 会直接进入已经验收的 Lab 17 正式网站。

## 发布后的后续工作

这些功能不阻塞第一次发布。当前先完成 Phase 1 的文字和数据，再根据价值与工作量安排以下内容。

### Backend 功能

按照 [BACKEND-ROADMAP.md](./BACKEND-ROADMAP.md) 继续：

- [ ] 访客 AI Lab Guide 和 dossier 问答
- [ ] 高频问题、探索路径、聊天效果和用户反馈分析
- [ ] 只管理 Lab Log 的轻量 CMS 与 AI 草稿功能
- [ ] CMS 扩展到 projects、books 和媒体上传

### Wellbeing 网站项目（筹备中）

计划结合 UW `EDUC 215` 的课堂内容与 Alina 自主阅读的相关书目，设计一个帮助有相关需求的用户梳理烦恼、反思情绪并减轻日常焦虑感的网站。先完成 prototype，获得教授反馈与认可后，再决定正式开展和公开范围。

- [ ] 确认 `EDUC 215` 的正式课程名称、授课时间、教授姓名，以及哪些课程概念和材料可以公开引用。
- [ ] 明确目标用户、具体使用情境和项目边界，例如情绪 check-in、引导式反思、烦恼拆解或日常 wellbeing 练习；第一版只选择一个清楚的核心流程。
- [ ] 整理课程笔记和自主阅读书目，为每个准备采用的观点记录作者、书名、章节、来源和自己的理解，区分课堂内容、引用内容和原创设计。
- [ ] 把“帮助用户减轻焦虑”定义为设计目标而不是未经验证的效果承诺；产品定位为一般性教育与自我反思支持，不提供诊断、治疗或紧急心理援助。
- [ ] 设计低保真 prototype，先验证信息架构、语气、引导步骤、退出方式，以及用户情绪较强时是否可以安全停止。
- [ ] 再制作可操作的高保真 prototype，准备用于向教授展示项目目标、理论来源、目标用户、核心流程、安全边界和下一步计划。
- [ ] 请教授提供反馈并确认其“认可”的具体范围；没有明确书面许可时，不把课程、教授或 UW 描述成项目的官方合作方、批准方或效果背书方。
- [ ] 如果 prototype 收集用户输入，第一版优先只保存在用户设备本地且允许立即删除；在隐私政策、数据保留和安全方案完成前，不收集可识别的心理健康信息。
- [ ] 如果以后开展用户测试，准备知情说明、退出机制和匿名反馈流程；只评估可用性和体验，不把小规模 prototype 测试描述为临床有效性研究。
- [ ] 在产品中提供清楚的非医疗声明，并为出现危机或需要专业帮助的用户提供与其所在地区相符的官方求助资源和紧急退出路径。
- [ ] 获得足够反馈并决定开展后，将项目状态从 `Concept / In progress` 更新为准确阶段，并把目标、过程、教授反馈、阅读来源和设计决策同步到 dossier。
- [ ] 在作品集中先展示经过确认的项目简介和 prototype；正式产品上线后再增加 demo 链接、结果与反思。首次加入完整项目通常作为 `MINOR` 版本发布。

### 项目图片与视觉证据

- [ ] 收集能帮助访客理解工作的材料，例如项目截图、原型照片、流程图、研究草图、数据图表、公开论文、演示视频和成果链接。
- [ ] 优先使用真实的过程和结果证据；装饰图片不能代替项目内容，也不要为了填满界面加入无关素材。
- [ ] 决定每项资料最适合出现的位置，例如 Computer 项目页、Books、Notebook、Drawer、Board 或 Field Case，避免同一材料无目的重复。
- [ ] 将公开图片和资料按项目整理到清楚的目录，例如 `public/projects/<project-slug>/`；使用可读、稳定、不含空格和敏感信息的文件名。
- [ ] 上传前检查版权、来源、人物隐私、公司机密和文件隐藏 metadata；不能确认公开权限的材料先不加入仓库。
- [ ] 为网页优化图片尺寸、压缩率和格式，避免直接使用过大的原图；需要时准备缩略图和高分辨率版本。
- [ ] 为有信息价值的图片添加准确的 alt text、标题或说明，并在需要时记录来源和日期。
- [ ] 在桌面、手机和 3D 窗口中检查裁切、清晰度、文字可读性、加载速度和失败时的 fallback。
- [ ] 图片中的关键信息不能只存在于图像里，也要有可检索文字，并同步更新 dossier 中的相关事实。
- [ ] 每完成一个项目的图片补充，就按“持续 Commit / Push 规则”检查、commit 并 push；建议使用 `assets: add <project> evidence`。

### 健康园志愿与课堂观察经历（低优先级）

这项经历不阻塞第一次发布。资料确认完整后，再决定是否加入 Computer 的 Experience、Notebook 或其他合适位置。

- [ ] 确认机构的正式中英文名称、地点、参与日期，以及时长究竟是“10 天”“40 小时”还是“10 天共 40 小时”。
- [ ] 查找可以佐证的个人记录、证书、聊天或日程；如果无法精确确认，只使用能够负责的模糊表述，不猜测日期或时长。
- [ ] 确认经历的正式性质。优先暂称为“志愿服务 / 教学支持与课堂观察”，除非机构当时明确将其定义为 internship，否则不写成实习。
- [ ] 准确整理实际做过的事情，例如协助老师准备面向自闭症/孤独症儿童的教材与课堂材料、整理教具、观察课堂和了解教学流程；不添加没有承担过的教学、照护或专业干预职责。
- [ ] 用简短内容说明这段经历带来的观察和学习，以及它与教育、包容性设计或个人研究兴趣的联系，避免把服务对象当作项目素材或夸大个人影响。
- [ ] 不公开儿童、家长或老师的姓名、照片、诊断、课堂个案和其他可识别信息；机构名称、内部材料或现场照片也要先确认公开权限。
- [ ] 根据机构正式用语和网站整体语言选择尊重、准确且一致的称呼，并由 Alina 做最终事实与语气确认。
- [ ] 确认值得公开后，将最终版本同步写入 dossier 和对应 content JSON，再按“持续 Commit / Push 规则”单独提交。

### GitHub 已发布小网页入口（低优先级）

- [ ] 盘点已经通过 GitHub Pages 或其他静态托管发布的小网页，记录标题、简介、公开 URL、source URL、预览图和可用状态。
- [ ] 在 Computer 的 Projects 区域或独立 Lab Apps 窗口中增加入口；每个项目区分 **Open project** 和 **View source**。
- [ ] 可以嵌入时在网站内部的 macOS 风格窗口打开，同时保留“在新标签页打开”。
- [ ] 检查目标网页的 `Content-Security-Policy` 和 `X-Frame-Options`；禁止 iframe 时显示简介与预览，再通过新标签页打开。
- [ ] 为失效链接、超时和外部网页不可用提供 fallback，不能阻塞 Lab 17 主体验。
- [ ] 小网页列表先使用本地 JSON 管理，不需要为此增加后端；以后有 CMS 时再接入统一内容管理。

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

不要启用“每次 push 到 `main` 就运行 `wrangler deploy`”的配置。Phase 3.5 的首次 `0.8.0` 由 Alina 手动确认 deployment；此后普通开发只做 CI，候选修改只上传独立 preview version，稳定版本的 production deployment 只由发布 GitHub Release 触发。

不建议把 GitHub Pages 作为最终托管方式。当前项目已经使用 Cloudflare Worker 兼容架构，未来的 AI API、secret、analytics 和 CMS 也需要服务器能力；继续使用 Cloudflare 可以避免之后再次迁移托管平台。

## 仓库公开前：dossier 历史清理

在任何将 GitHub repository 改为 public、转移给非受限协作者，或接入不应读取私有资料的构建服务之前，完成以下事项：

- [ ] 在公开前将 `Wenrui_Wu_Portfolio_Source_Dossier.md` 迁至仓库外的私有位置，并确认当前 `main`、所有工作分支和发布产物都不包含它。
- [ ] 盘点所有仍包含 dossier 的 Git refs、tags、Pull Requests、forks 和本地 clone；其中包括历史恢复 tag，不能仅删除当前文件。
- [ ] 在独立镜像/备份完成后，使用 `git filter-repo --sensitive-data-removal --invert-paths --path Wenrui_Wu_Portfolio_Source_Dossier.md` 从所有需要公开的历史中清除；事前列出将被改写的 refs 并由 Alina 单独确认。
- [ ] 强制更新经确认的远端 refs 后，让所有保留的本地 clone 重新克隆或按清理流程处理，防止旧历史重新推回。
- [ ] 如果 dossier 曾经被公开或被 fork，按 GitHub 的敏感数据清除流程评估是否需要联系 GitHub Support；不要将普通删除视为历史清除。
- [ ] 在公开前重新审计 repository、tag、release assets、Cloudflare build input 与最终 bundle，确认 dossier 不可访问。
