/**
 * Secrets Manager - supports env, docker, and infisical backends
 */

export type SecretBackend = 'env' | 'docker' | 'infisical';

export interface SecretsConfig {
  backend?: SecretBackend;
  infisicalToken?: string;
  infisicalProjectId?: string;
  infisicalEnvironment?: string;
}

class SecretsManager {
  private config: SecretsConfig;
  private cache: Map<string, string> = new Map();
  private initialized = false;

  constructor(config: SecretsConfig = {}) {
    this.config = {
      backend: config.backend || (process.env.SECRETS_BACKEND as SecretBackend) || 'env',
      ...config,
    };
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    const backend = this.config.backend || 'env';

    switch (backend) {
      case 'infisical':
        await this.initializeInfisical();
        break;
      case 'env':
      case 'docker':
        break;
    }

    this.initialized = true;
  }

  async getSecret(key: string, defaultValue?: string): Promise<string> {
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }

    const backend = this.config.backend || 'env';
    let value: string | undefined;

    switch (backend) {
      case 'env':
        value = process.env[key];
        break;
      case 'docker':
        value = await this.getDockerSecret(key);
        break;
      case 'infisical':
        value = await this.getInfisicalSecret(key);
        break;
    }

    if (value === undefined) {
      if (defaultValue !== undefined) {
        return defaultValue;
      }
      throw new Error(`Secret "${key}" not found and no default value provided`);
    }

    this.cache.set(key, value);
    return value;
  }

  getSecretSync(key: string, defaultValue?: string): string {
    const backend = this.config.backend || 'env';

    if (backend === 'env') {
      return process.env[key] || defaultValue || '';
    }

    throw new Error(`Synchronous secret access not supported for backend: ${backend}`);
  }

  private async getDockerSecret(key: string): Promise<string | undefined> {
    const fs = await import('fs/promises');
    const secretPath = `/run/secrets/${key}`;
    
    try {
      const value = await fs.readFile(secretPath, 'utf-8');
      return value.trim();
    } catch (error) {
      return process.env[key];
    }
  }

  private infisicalClient: any = null;

  private async initializeInfisical(): Promise<void> {
    const token = this.config.infisicalToken || process.env.INFISICAL_TOKEN;
    const projectId = this.config.infisicalProjectId || process.env.INFISICAL_PROJECT_ID;

    if (!token || !projectId) {
      throw new Error('Infisical requires INFISICAL_TOKEN and INFISICAL_PROJECT_ID to be set');
    }

    try {
      const { InfisicalClient } = await import('@infisical/sdk');
      
      this.infisicalClient = new InfisicalClient({
        clientId: token,
        clientSecret: token,
      });
    } catch (error) {
      throw new Error(`Failed to initialize Infisical SDK: ${error}. Make sure @infisical/sdk is installed.`);
    }
  }

  private async getInfisicalSecret(key: string): Promise<string | undefined> {
    if (!this.infisicalClient) {
      return process.env[key];
    }

    try {
      const projectId = this.config.infisicalProjectId || process.env.INFISICAL_PROJECT_ID;
      const environment = this.config.infisicalEnvironment || process.env.INFISICAL_ENVIRONMENT || 'dev';
      
      const secret = await this.infisicalClient.getSecret({
        environment,
        secretPath: key,
        type: 'shared',
        projectId,
      });
      
      return secret?.secretValue || secret?.secretValuePlaintext;
    } catch (error) {
      console.warn(`Failed to fetch secret "${key}" from Infisical: ${error}`);
      return process.env[key];
    }
  }
}

let secretsManagerInstance: SecretsManager | null = null;

export function getSecretsManager(config?: SecretsConfig): SecretsManager {
  if (!secretsManagerInstance) {
    secretsManagerInstance = new SecretsManager(config);
  }
  return secretsManagerInstance;
}

export async function initializeSecrets(config?: SecretsConfig): Promise<void> {
  const manager = getSecretsManager(config);
  await manager.initialize();
}

export async function getSecret(key: string, defaultValue?: string): Promise<string> {
  const manager = getSecretsManager();
  return manager.getSecret(key, defaultValue);
}

export function getSecretSync(key: string, defaultValue?: string): string {
  const manager = getSecretsManager();
  return manager.getSecretSync(key, defaultValue);
}
