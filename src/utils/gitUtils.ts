import simpleGit, { SimpleGit } from 'simple-git';

/**
 * Git工具类
 */
export class GitUtils {
  private git: SimpleGit;

  constructor() {
    this.git = simpleGit();
  }

  /**
   * 克隆仓库
   */
  async cloneRepository(repoUrl: string, targetDir: string, options: string[] = ['--depth', '1']): Promise<void> {
    try {
      await this.git.clone(repoUrl, targetDir, options);
    } catch (error) {
      throw new Error(`克隆仓库失败: ${error instanceof Error ? error.message : error}`);
    }
  }

  /**
   * 验证URL是否为有效的Git仓库URL
   */
  static isValidGitUrl(url: string): boolean {
    // 基本的Git URL验证
    const gitUrlPatterns = [
      /^https?:\/\/.+\.git$/,                    // https://example.com/repo.git
      /^git@.+:.+\.git$/,                       // git@github.com:user/repo.git
      /^https?:\/\/github\.com\/.+\/.+$/,       // https://github.com/user/repo
      /^https?:\/\/gitlab\.com\/.+\/.+$/,       // https://gitlab.com/user/repo
      /^https?:\/\/bitbucket\.org\/.+\/.+$/,    // https://bitbucket.org/user/repo
    ];

    return gitUrlPatterns.some(pattern => pattern.test(url));
  }

  /**
   * 检查远程仓库是否可访问
   */
  async checkRemoteRepository(repoUrl: string): Promise<boolean> {
    try {
      await this.git.listRemote([repoUrl]);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * 获取仓库信息
   */
  async getRepositoryInfo(repoUrl: string): Promise<{ name: string; description?: string }> {
    try {
      // 从URL中提取仓库名称
      const match = repoUrl.match(/\/([^\/]+)(?:\.git)?$/);
      const name = match ? match[1].replace('.git', '') : 'unknown';
      
      return {
        name,
        description: `Repository cloned from ${repoUrl}`
      };
    } catch (error) {
      throw new Error(`获取仓库信息失败: ${error instanceof Error ? error.message : error}`);
    }
  }
} 