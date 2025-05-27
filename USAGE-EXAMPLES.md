# HelloCode CLI 使用示例

## 🚀 在空目录中初始化项目

### 方法一：推荐用法

```bash
# 1. 创建并进入项目目录
mkdir my-awesome-project
cd my-awesome-project

# 2. 运行 HelloCode
../hello-code/dist/index.js

# 3. 按提示输入信息
# 项目名称: my-awesome-project (自动检测)
# 在当前目录初始化: Yes (自动检测空目录)
# 作者名称: Your Name  
# 模板仓库URL: https://github.com/org/template.git
```

### 方法二：全局安装后使用

```bash
# 全局安装
cd hello-code
sudo npm install -g .

# 在任何目录使用
mkdir new-project && cd new-project
hello-code
```

## ✨ 核心特性

- **智能目录检测**: 自动检测当前目录名作为项目名
- **空目录初始化**: 在空目录中直接初始化项目
- **模板处理**: 替换 `{{projectName}}`、`{{authorName}}`、`{{year}}`
- **文件重命名**: 自动重命名包含占位符的文件和文件夹
- **Git清理**: 自动清理模板的 `.git` 信息

## 📝 实际测试结果

在 `test-hello-code` 目录中测试成功：

```
📁 项目位置: /Users/.../test-hello-code
📝 重命名: {{projectName}}-db -> test-hello-code-db
📝 重命名: {{projectName}}-fe -> test-hello-code-fe  
📝 重命名: {{projectName}}-manage -> test-hello-code-manage
📝 重命名: {{projectName}}-server -> test-hello-code-server
✅ 项目 "test-hello-code" 初始化成功！
``` 