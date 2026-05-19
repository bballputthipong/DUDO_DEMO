import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly client: Redis;
  private readonly memoryStore = new Map<string, { value: string; expiresAt: number }>();
  private useMemoryFallback = false;

  constructor(configService: ConfigService) {
    this.client = new Redis(configService.get<string>('REDIS_URL') ?? 'redis://localhost:6379', {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
    });
    this.client.on('error', () => {
      this.useMemoryFallback = true;
    });
  }

  async setWithTtl(key: string, value: string, ttlSeconds: number): Promise<void> {
    if (!(await this.ensureConnected())) {
      this.memoryStore.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
      return;
    }
    await this.client.set(key, value, 'EX', ttlSeconds);
  }

  async get(key: string): Promise<string | null> {
    if (!(await this.ensureConnected())) {
      const item = this.memoryStore.get(key);
      if (item === undefined) {
        return null;
      }
      if (item.expiresAt < Date.now()) {
        this.memoryStore.delete(key);
        return null;
      }
      return item.value;
    }
    return this.client.get(key);
  }

  async delete(key: string): Promise<void> {
    if (!(await this.ensureConnected())) {
      this.memoryStore.delete(key);
      return;
    }
    await this.client.del(key);
  }

  onModuleDestroy(): void {
    this.client.disconnect();
  }

  private async ensureConnected(): Promise<boolean> {
    if (this.useMemoryFallback) {
      return false;
    }

    if (this.client.status === 'wait' || this.client.status === 'end') {
      try {
        await this.client.connect();
      } catch {
        this.useMemoryFallback = true;
        return false;
      }
    }

    return true;
  }
}
