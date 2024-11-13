import { Application } from 'express';
import { createApp } from '@/app';
import { AppDependencies } from '@/types/app.dependencies';

export function createTestApp(dependencies: AppDependencies): Application {
  const app = createApp(dependencies);
  return app;
}

export function setupTestEnvironment() {
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(async () => {
    jest.spyOn(console, 'error').mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });
}
