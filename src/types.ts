/**
 * 用户输入接口
 */
export interface UserInputs {
  projectName: string;
  authorName: string;
  repoUrl: string;
}

/**
 * 模板变量接口
 */
export interface TemplateVariables {
  projectName: string;
  authorName: string;
  year: string;
}

/**
 * CLI配置接口
 */
export interface CLIConfig {
  name: string;
  version: string;
  description: string;
}

/**
 * 文件处理选项接口
 */
export interface FileProcessOptions {
  skipBinaryFiles: boolean;
  binaryExtensions: string[];
  ignorePatterns: string[];
} 