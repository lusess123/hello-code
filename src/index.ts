#!/usr/bin/env node

import inquirer from 'inquirer';
import path from 'path';
import { UserInputs, TemplateVariables } from './types.js';
import { FileUtils } from './utils/fileUtils.js';
import { GitUtils } from './utils/gitUtils.js';

class HelloCodeCLI {
  private gitUtils = new GitUtils();

  /**
   * 主函数 - 处理整个CLI流程
   */
  async run(): Promise<void> {
    try {
      console.log('🚀 欢迎使用 HelloCode 脚手架工具！\n');

      // 检查命令行参数
      if (process.argv.includes('--help') || process.argv.includes('-h')) {
        this.showHelp();
        return;
      }

      // 步骤1: 获取用户输入
      const userInputs = await this.getUserInputs();
      
      // 步骤2: 确定项目目录
      const projectPath = userInputs.useCurrentDir ? process.cwd() : userInputs.projectName;
      const isCurrentDir = userInputs.useCurrentDir || false;
      
      // 步骤3: 验证项目目录
      if (!isCurrentDir) {
        await this.validateProjectName(userInputs.projectName);
      }
      
      // 步骤4: 克隆模板仓库
      await this.cloneTemplate(userInputs.repoUrl, projectPath, isCurrentDir);
      
      // 步骤5: 创建模板变量
      const templateVariables = this.createTemplateVariables(userInputs);
      
      // 步骤6: 处理文件和文件夹
      await this.processTemplate(projectPath, templateVariables);
      
      // 步骤7: 清理Git信息
      await this.cleanupGitInfo(projectPath);
      
      console.log(`\n✅ 项目 "${userInputs.projectName}" ${isCurrentDir ? '初始化' : '创建'}成功！`);
      console.log(`📁 项目位置: ${path.resolve(projectPath)}`);
      console.log('\n🎉 您现在可以开始开发了！');
      
    } catch (error) {
      console.error('\n❌ 创建项目时发生错误:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  }

  /**
   * 检查当前目录是否适合初始化项目
   */
  private async isCurrentDirSuitableForInit(): Promise<boolean> {
    try {
      const files = await FileUtils.readDirectory(process.cwd());
      // 允许存在一些常见的初始化文件
      const allowedFiles = ['.git', '.gitignore', 'README.md', 'LICENSE', '.DS_Store'];
      const significantFiles = files.filter((file: string) => !allowedFiles.includes(file));
      
      // 如果目录为空或只有允许的文件，则适合初始化
      return significantFiles.length === 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * 获取用户输入
   */
  private async getUserInputs(): Promise<UserInputs> {
    // 获取当前目录名作为默认项目名
    const currentDirName = path.basename(process.cwd());
    const defaultProjectName = /^[a-zA-Z0-9-_]+$/.test(currentDirName) ? currentDirName : '';

    const questions = [
      {
        type: 'input',
        name: 'projectName',
        message: '请输入项目名称:',
        default: defaultProjectName,
        validate: (input: string) => {
          if (!input.trim()) {
            return '项目名称不能为空';
          }
          if (!/^[a-zA-Z0-9-_]+$/.test(input)) {
            return '项目名称只能包含字母、数字、连字符和下划线';
          }
          return true;
        }
      },
      {
        type: 'confirm',
        name: 'useCurrentDir',
        message: '是否在当前目录中初始化项目？',
        default: true,
        when: async (answers: any) => {
          // 检查当前目录是否为空或几乎为空
          return await this.isCurrentDirSuitableForInit();
        }
      },
      {
        type: 'input',
        name: 'authorName',
        message: '请输入作者名称:',
        validate: (input: string) => {
          if (!input.trim()) {
            return '作者名称不能为空';
          }
          return true;
        }
      },
      {
        type: 'input',
        name: 'repoUrl',
        message: '请输入模板仓库URL:',
        validate: (input: string) => {
          if (!input.trim()) {
            return '仓库URL不能为空';
          }
          if (!GitUtils.isValidGitUrl(input)) {
            return '请输入有效的Git仓库URL (支持GitHub、GitLab、Bitbucket等)';
          }
          return true;
        }
      }
    ];

    return await inquirer.prompt(questions);
  }

  /**
   * 验证项目名称是否已存在
   */
  private async validateProjectName(projectName: string): Promise<void> {
    const projectPath = path.resolve(projectName);
    
    if (await FileUtils.pathExists(projectPath)) {
      const { overwrite } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: `目录 "${projectName}" 已存在，是否覆盖？`,
          default: false
        }
      ]);

      if (!overwrite) {
        console.log('操作已取消');
        process.exit(0);
      }

      console.log('🗑️  删除现有目录...');
      await FileUtils.remove(projectPath);
    }
  }

  /**
   * 克隆模板仓库
   */
  private async cloneTemplate(repoUrl: string, targetPath: string, isCurrentDir: boolean = false): Promise<void> {
    console.log('📥 正在下载模板...');
    
    try {
      if (isCurrentDir) {
        // 在当前目录初始化，需要临时克隆到一个临时目录，然后移动文件
        const tempDir = path.join(process.cwd(), '.temp-hello-code-' + Date.now());
        await this.gitUtils.cloneRepository(repoUrl, tempDir);
        
        // 移动文件到当前目录
        const files = await FileUtils.readDirectory(tempDir);
        for (const file of files) {
          const srcPath = path.join(tempDir, file);
          const destPath = path.join(targetPath, file);
          await FileUtils.moveItem(srcPath, destPath);
        }
        
        // 清理临时目录
        await FileUtils.remove(tempDir);
      } else {
        await this.gitUtils.cloneRepository(repoUrl, targetPath);
      }
      console.log('✅ 模板下载成功');
    } catch (error) {
      throw new Error(`克隆仓库失败: ${error instanceof Error ? error.message : error}`);
    }
  }

  /**
   * 创建模板变量
   */
  private createTemplateVariables(userInputs: UserInputs): TemplateVariables {
    return {
      projectName: userInputs.projectName,
      authorName: userInputs.authorName,
      year: new Date().getFullYear().toString()
    };
  }

  /**
   * 处理模板文件和文件夹
   */
  private async processTemplate(projectName: string, variables: TemplateVariables): Promise<void> {
    const projectPath = path.resolve(projectName);
    
    console.log('🔄 正在处理模板文件...');
    
    // 处理文件内容
    await FileUtils.processDirectory(projectPath, variables);
    
    // 重命名文件和文件夹
    await FileUtils.renameItemsInDirectory(projectPath, variables);
    
    console.log('✅ 文件处理完成');
  }





  /**
   * 清理Git信息
   */
  private async cleanupGitInfo(projectName: string): Promise<void> {
    console.log('🧹 清理Git信息...');
    await FileUtils.cleanupGitInfo(projectName);
  }

  /**
   * 显示帮助信息
   */
  private showHelp(): void {
    console.log(`
HelloCode - 一个用于生成项目模板的脚手架工具

用法:
  hello-code              启动交互式模式
  HelloCode               启动交互式模式
  hello-code --help       显示帮助信息
  hello-code -h           显示帮助信息

功能:
  • 交互式提示用户输入项目信息
  • 从Git仓库克隆模板
  • 自动替换模板中的占位符
  • 重命名包含占位符的文件和文件夹
  • 更新README.md等文档文件

输入参数说明:
  projectName  - 项目名称（只能包含字母、数字、连字符和下划线）
  authorName   - 作者名称
  repoUrl      - Git模板仓库URL

模板占位符:
  {{projectName}} - 项目名称
  {{authorName}}  - 作者名称
  {{year}}        - 当前年份

示例:
  当您输入项目名称为 "my-app"，作者名称为 "John Doe" 时，
  模板中的 {{projectName}} 会被替换为 "my-app"，
  {{authorName}} 会被替换为 "John Doe"，
  {{year}} 会被替换为当前年份。

作者: Your Name
版本: 1.0.0
    `);
  }
}

// 主程序入口
async function main() {
  const cli = new HelloCodeCLI();
  await cli.run();
}

// 运行程序
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('程序运行出错:', error);
    process.exit(1);
  });
}

export default HelloCodeCLI; 