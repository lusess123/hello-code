# HelloCode CLI 脚手架工具

🚀 HelloCode 是一个强大的命令行脚手架工具，用于快速生成项目模板。它可以从 Git 仓库克隆模板，并根据用户输入自动替换模板中的占位符，帮助开发者快速搭建项目结构。

## ✨ 功能特性

- 🎯 **交互式操作**: 友好的命令行交互界面
- 📦 **Git 模板支持**: 支持从 GitHub、GitLab、Bitbucket 等平台克隆模板
- 🔄 **智能替换**: 自动替换模板中的占位符（项目名称、作者名称、年份等）
- 📝 **文件重命名**: 支持根据变量重命名文件和文件夹
- 🧹 **自动清理**: 自动清理 Git 信息，让项目更干净
- ⚡ **TypeScript 编写**: 完全使用 TypeScript 开发，提供更好的类型安全

## 📋 系统要求

- Node.js >= 14.0.0
- Git (用于克隆模板仓库)

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 构建项目

```bash
npm run build
```

### 开发模式运行

```bash
npm run dev
```

### 生产模式运行

```bash
npm start
```

## 💻 使用方法

### 基本使用

```bash
# 使用 npm scripts
npm start

# 或者直接运行编译后的文件
node dist/index.js

# 显示帮助信息
node dist/index.js --help
```

### 交互式输入

工具会依次提示您输入以下信息：

1. **项目名称**: 新项目的名称（只能包含字母、数字、连字符和下划线）
2. **作者名称**: 项目作者的名称
3. **仓库 URL**: Git 模板仓库的 URL

### 示例1：在空目录中初始化（推荐）

```bash
# 创建并进入项目目录
mkdir my-awesome-app && cd my-awesome-app

# 运行 HelloCode
hello-code  # 或者: node /path/to/hello-code/dist/index.js

🚀 欢迎使用 HelloCode 脚手架工具！

? 请输入项目名称: my-awesome-app        # 自动检测当前目录名
? 是否在当前目录中初始化项目？ Yes        # 自动检测空目录
? 请输入作者名称: John Doe
? 请输入模板仓库URL: https://github.com/username/template-repo.git

📥 正在下载模板...
✅ 模板下载成功
🔄 正在处理模板文件...
📝 重命名: {{projectName}}-server -> my-awesome-app-server
📝 重命名: {{projectName}}.config.js -> my-awesome-app.config.js
✅ 文件处理完成
🧹 清理Git信息...
✅ Git信息清理完成

✅ 项目 "my-awesome-app" 初始化成功！
📁 项目位置: /current/directory/my-awesome-app

🎉 您现在可以开始开发了！
```

### 示例2：创建新目录

```bash
hello-code

🚀 欢迎使用 HelloCode 脚手架工具！

? 请输入项目名称: my-new-project
? 请输入作者名称: John Doe
? 请输入模板仓库URL: https://github.com/username/template-repo.git

📥 正在下载模板...
✅ 模板下载成功
🔄 正在处理模板文件...
✅ 文件处理完成
🧹 清理Git信息...
✅ Git信息清理完成

✅ 项目 "my-new-project" 创建成功！
📁 项目位置: /current/directory/my-new-project

🎉 您现在可以开始开发了！
```

## 🎨 模板占位符

HelloCode 支持以下占位符，它们会在处理过程中被自动替换：

| 占位符 | 描述 | 示例 |
|--------|------|------|
| `{{projectName}}` | 项目名称 | `my-awesome-app` |
| `{{authorName}}` | 作者名称 | `John Doe` |
| `{{year}}` | 当前年份 | `2024` |

### 占位符使用示例

在模板文件中，您可以这样使用占位符：

```javascript
// {{projectName}}.config.js
export default {
  name: '{{projectName}}',
  author: '{{authorName}}',
  year: {{year}}
};
```

处理后会变成：

```javascript
// my-awesome-app.config.js
export default {
  name: 'my-awesome-app',
  author: 'John Doe',
  year: 2024
};
```

## 🛠️ 开发

### 项目结构

```
hello-code/
├── src/
│   ├── index.ts          # 主入口文件
│   ├── types.ts          # 类型定义
│   └── utils/
│       ├── fileUtils.ts  # 文件操作工具
│       └── gitUtils.ts   # Git操作工具
├── dist/                 # 编译输出目录
├── package.json
├── tsconfig.json
└── README.md
```

### 可用脚本

```bash
# 编译 TypeScript
npm run build

# 开发模式（使用 ts-node）
npm run dev

# 运行编译后的代码
npm start

# 运行测试
npm test
```

### 添加新功能

1. 在 `src/` 目录下编写 TypeScript 代码
2. 更新类型定义（如需要）
3. 运行 `npm run build` 编译
4. 测试功能是否正常工作

## 📖 API 文档

### HelloCodeCLI

主要的 CLI 类，处理整个脚手架流程。

#### 方法

- `run()`: 执行完整的 CLI 流程
- `getUserInputs()`: 获取用户输入
- `validateProjectName()`: 验证项目名称
- `cloneTemplate()`: 克隆模板仓库
- `processTemplate()`: 处理模板文件
- `cleanupGitInfo()`: 清理 Git 信息

### FileUtils

文件操作工具类。

#### 静态方法

- `processDirectory()`: 递归处理目录中的所有文件
- `processFile()`: 处理单个文件的内容
- `renameItemsInDirectory()`: 重命名目录中的文件和文件夹
- `cleanupGitInfo()`: 清理 Git 相关文件

### GitUtils

Git 操作工具类。

#### 方法

- `cloneRepository()`: 克隆 Git 仓库
- `isValidGitUrl()`: 验证 Git URL 是否有效
- `checkRemoteRepository()`: 检查远程仓库是否可访问

## 🤝 贡献

欢迎贡献代码！请遵循以下步骤：

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

## 🐛 问题反馈

如果您遇到任何问题或有功能建议，请在 [Issues](https://github.com/your-username/hello-code/issues) 页面提交。

## 📞 联系方式

- 作者: Your Name
- 邮箱: your.email@example.com
- GitHub: [@your-username](https://github.com/your-username)

---

⭐ 如果这个项目对您有帮助，请给它一个星标！