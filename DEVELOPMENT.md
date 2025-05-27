# HelloCode CLI 开发文档

## 项目概述

HelloCode 是一个基于 TypeScript 开发的命令行脚手架工具，用于快速生成项目模板。它支持从 Git 仓库克隆模板，并自动替换模板中的占位符。

## 技术栈

- **语言**: TypeScript
- **运行时**: Node.js (>=14.0.0)
- **模块系统**: ES Modules (ESM)
- **构建工具**: TypeScript Compiler (tsc)
- **开发工具**: tsx
- **依赖管理**: npm

## 核心依赖

### 运行时依赖
- `inquirer`: 命令行交互式提示
- `simple-git`: Git 仓库操作
- `handlebars`: 模板引擎，用于占位符替换
- `fs-extra`: 增强的文件系统操作

### 开发依赖
- `typescript`: TypeScript 编译器
- `tsx`: TypeScript 运行时（开发模式）
- `@types/*`: TypeScript 类型定义

## 项目结构

```
hello-code/
├── src/
│   ├── index.ts          # 主入口文件
│   ├── types.ts          # 类型定义
│   └── utils/
│       ├── fileUtils.ts  # 文件操作工具类
│       └── gitUtils.ts   # Git操作工具类
├── dist/                 # 编译输出目录
├── package.json          # 项目配置
├── tsconfig.json         # TypeScript配置
├── README.md             # 项目说明
├── DEVELOPMENT.md        # 开发文档
└── .gitignore           # Git忽略文件
```

## 实现的功能

### ✅ 已完成功能

1. **交互式用户输入**
   - 项目名称验证（只允许字母、数字、连字符、下划线）
   - 作者名称输入
   - Git仓库URL验证

2. **Git仓库操作**
   - 支持多种Git平台（GitHub、GitLab、Bitbucket等）
   - 浅克隆（--depth 1）优化下载速度
   - 自动清理.git目录

3. **模板处理**
   - 递归处理目录中的所有文件
   - 智能跳过二进制文件
   - Handlebars模板引擎替换占位符
   - 文件和文件夹重命名

4. **错误处理**
   - 完整的错误捕获和提示
   - 文件操作异常处理
   - Git操作失败处理

5. **命令行界面**
   - 帮助信息（--help/-h）
   - 友好的进度提示
   - 彩色emoji输出

6. **项目管理**
   - 目录冲突检测和处理
   - 自动创建项目目录
   - 编译和构建系统

### 📋 支持的占位符

| 占位符 | 描述 | 示例值 |
|--------|------|--------|
| `{{projectName}}` | 用户输入的项目名称 | `my-awesome-app` |
| `{{authorName}}` | 用户输入的作者名称 | `John Doe` |
| `{{year}}` | 当前年份 | `2024` |

## 开发脚本

```bash
# 安装依赖
npm install

# 开发模式运行（使用tsx）
npm run dev

# 编译TypeScript代码
npm run build

# 运行编译后的代码
npm start

# 显示帮助信息
npm run dev -- --help
npm start -- --help
```

## 技术实现细节

### ESM模块支持

项目使用ES Modules，配置要点：

1. `package.json` 中设置 `"type": "module"`
2. `tsconfig.json` 中设置 `"module": "ES2020"`
3. 导入语句必须包含 `.js` 扩展名
4. 使用 `import.meta.url` 替代 `require.main`

### TypeScript配置

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ES2020",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true
  }
}
```

### 文件处理策略

1. **内容替换**: 使用Handlebars模板引擎
2. **二进制文件**: 自动跳过常见二进制扩展名
3. **忽略模式**: 跳过.git、node_modules等目录
4. **重命名**: 先处理文件，再处理目录，避免路径冲突

### Git操作

- 使用 `simple-git` 库进行Git操作
- 浅克隆优化：`--depth 1`
- URL验证：支持HTTPS和SSH格式
- 自动清理：删除.git目录避免冲突

## 使用示例

```bash
$ npm start

🚀 欢迎使用 HelloCode 脚手架工具！

? 请输入项目名称: my-new-project
? 请输入作者名称: Jane Developer
? 请输入模板仓库URL: https://github.com/user/template-repo.git

📥 正在下载模板...
✅ 模板下载成功
🔄 正在处理模板文件...
📝 重命名: {{projectName}}.config.js -> my-new-project.config.js
✅ 文件处理完成
🧹 清理Git信息...
✅ Git信息清理完成

✅ 项目 "my-new-project" 创建成功！
📁 项目位置: /current/directory/my-new-project

🎉 您现在可以开始开发了！
```

## 扩展性

项目采用模块化设计，易于扩展：

1. **新的占位符**: 在 `TemplateVariables` 接口中添加
2. **新的文件类型**: 在 `FileUtils` 中扩展处理逻辑
3. **新的Git平台**: 在 `GitUtils` 中添加URL验证规则
4. **新的交互选项**: 在主流程中添加inquirer问题

## 测试建议

1. **单元测试**: 为工具类编写单元测试
2. **集成测试**: 测试完整的CLI流程
3. **模板测试**: 创建测试模板仓库
4. **错误场景**: 测试网络错误、权限错误等

## 部署和分发

1. **本地安装**: `npm install -g .`
2. **npm发布**: `npm publish`
3. **二进制分发**: 可考虑使用pkg等工具打包

## 已知限制

1. 仅支持公开的Git仓库（除非配置了SSH密钥）
2. 模板占位符语法固定为Handlebars格式
3. 文件名占位符不支持复杂表达式
4. 不支持交互式选择模板变体

## 后续改进方向

1. 添加配置文件支持
2. 支持插件系统
3. 添加模板缓存机制
4. 支持私有仓库认证
5. 添加模板验证功能
6. 支持多语言模板

---

*本文档记录了HelloCode CLI工具的完整开发过程和技术实现细节。* 