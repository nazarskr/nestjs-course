import { rm } from 'fs/promises';
import { join } from 'path';

global.beforeEach(async () => {
  try {
    await rm(join(__dirname, '..', process.env.DB_DATABASE || ''));
  } catch (error) {
    console.error(error);
  }
});

// "setupFilesAfterEnv": "<rootDir>/test/setup.ts" in jest-e2e.json
// for setup global beforeEach
