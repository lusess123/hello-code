import fs from 'fs-extra';
import path from 'path';
import Handlebars from 'handlebars';
import { TemplateVariables, FileProcessOptions } from '../types.js';

/**
 * 文件工具类
 */
export class FileUtils {
  private static defaultOptions: FileProcessOptions = {
    skipBinaryFiles: true,
    binaryExtensions: ['.png', '.jpg', '.jpeg', '.gif', '.ico', '.pdf', '.zip', '.tar', '.gz', '.exe', '.bin'],
    ignorePatterns: ['.git', 'node_modules', '.DS_Store']
  };

  /**
   * 检查文件是否为二进制文件
   */
  static isBinaryFile(filePath: string, options: FileProcessOptions = FileUtils.defaultOptions): boolean {
    const ext = path.extname(filePath).toLowerCase();
    return options.binaryExtensions.includes(ext);
  }

  /**
   * 检查文件或目录是否应该被忽略
   */
  static shouldIgnore(itemName: string, options: FileProcessOptions = FileUtils.defaultOptions): boolean {
    return options.ignorePatterns.some(pattern => itemName.includes(pattern));
  }

  /**
   * 递归处理目录中的所有文件
   */
  static async processDirectory(dirPath: string, variables: TemplateVariables, options?: FileProcessOptions): Promise<void> {
    const mergedOptions = { ...FileUtils.defaultOptions, ...options };
    const items = await fs.readdir(dirPath);

    for (const item of items) {
      if (FileUtils.shouldIgnore(item, mergedOptions)) {
        continue;
      }

      const itemPath = path.join(dirPath, item);
      const stat = await fs.stat(itemPath);

      if (stat.isDirectory()) {
        await FileUtils.processDirectory(itemPath, variables, mergedOptions);
      } else if (stat.isFile()) {
        await FileUtils.processFile(itemPath, variables, mergedOptions);
      }
    }
  }

  /**
   * 处理单个文件的内容
   */
  static async processFile(filePath: string, variables: TemplateVariables, options: FileProcessOptions = FileUtils.defaultOptions): Promise<void> {
    if (options.skipBinaryFiles && FileUtils.isBinaryFile(filePath, options)) {
      return;
    }

    try {
      const content = await fs.readFile(filePath, 'utf8');
      const template = Handlebars.compile(content);
      const processedContent = template(variables);

      if (content !== processedContent) {
        await fs.writeFile(filePath, processedContent, 'utf8');
      }
    } catch (error) {
      console.warn(`⚠️  跳过文件: ${filePath} (${error instanceof Error ? error.message : error})`);
    }
  }

  /**
   * 重命名文件或目录
   */
  static async renameItem(itemPath: string, variables: TemplateVariables): Promise<string | null> {
    const dirname = path.dirname(itemPath);
    const basename = path.basename(itemPath);

    let newBasename = basename
      .replace(/\{\{projectName\}\}/g, variables.projectName)
      .replace(/\{\{authorName\}\}/g, variables.authorName)
      .replace(/\{\{year\}\}/g, variables.year);

    if (newBasename !== basename) {
      const newPath = path.join(dirname, newBasename);
      await fs.move(itemPath, newPath);
      console.log(`📝 重命名: ${basename} -> ${newBasename}`);
      return newPath;
    }

    return null;
  }

  /**
   * 递归重命名目录中的所有文件和子目录
   */
  static async renameItemsInDirectory(dirPath: string, variables: TemplateVariables): Promise<void> {
    const items = await fs.readdir(dirPath);

    // 先处理文件
    for (const item of items) {
      if (FileUtils.shouldIgnore(item)) {
        continue;
      }

      const itemPath = path.join(dirPath, item);
      const stat = await fs.stat(itemPath);

      if (stat.isFile()) {
        await FileUtils.renameItem(itemPath, variables);
      }
    }

    // 再处理目录
    for (const item of items) {
      if (FileUtils.shouldIgnore(item)) {
        continue;
      }

      const itemPath = path.join(dirPath, item);
      const stat = await fs.stat(itemPath);

      if (stat.isDirectory()) {
        // 先递归处理子目录
        await FileUtils.renameItemsInDirectory(itemPath, variables);
        // 再重命名当前目录
        await FileUtils.renameItem(itemPath, variables);
      }
    }
  }

  /**
   * 清理Git相关文件
   */
  static async cleanupGitInfo(projectPath: string): Promise<void> {
    const gitPath = path.join(projectPath, '.git');
    
    if (await fs.pathExists(gitPath)) {
      await fs.remove(gitPath);
      console.log('✅ Git信息清理完成');
    }
  }

  /**
   * 确保目录存在
   */
  static async ensureDir(dirPath: string): Promise<void> {
    await fs.ensureDir(dirPath);
  }

  /**
   * 检查路径是否存在
   */
  static async pathExists(targetPath: string): Promise<boolean> {
    return await fs.pathExists(targetPath);
  }

  /**
   * 删除目录或文件
   */
  static async remove(targetPath: string): Promise<void> {
    await fs.remove(targetPath);
  }

  /**
   * 读取目录内容
   */
  static async readDirectory(dirPath: string): Promise<string[]> {
    return await fs.readdir(dirPath);
  }

  /**
   * 移动文件或目录
   */
  static async moveItem(srcPath: string, destPath: string): Promise<void> {
    await fs.move(srcPath, destPath);
  }
} 