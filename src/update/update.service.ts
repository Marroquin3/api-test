// src/update/update.service.ts
import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

@Injectable()
export class UpdateService {
  async updateAndRestart(): Promise<string> {
    try {
      const { stdout, stderr } = await execAsync(`
        git pull origin main &&
        npm install &&
        npm run build &&
        pm2 reload all &&
        pm2 list 
      `);

      
      return stdout || stderr;
    } catch (err) {
      throw new Error(`Error durante actualización: ${err.message}`);
    }
  }
}
