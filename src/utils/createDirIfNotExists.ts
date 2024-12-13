import fs from 'fs/promises';
import path from 'path';

export const createDirIfNotExists = async (dirPath: string) => {
  try {
    await fs.mkdir(dirPath, { recursive: true });
    console.log(`Directory ensured: ${dirPath}`);
  } catch (error) {
    console.error(`Failed to create directory ${dirPath}:`, error);
    throw error;
  }
};
