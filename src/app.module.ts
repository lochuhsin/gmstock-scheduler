import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { exec } from 'child_process';
import * as fs from 'fs';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './tasks/task-test.module';

@Module({
  imports: [ScheduleModule.forRoot(), TasksModule],
  controllers: [AppController],
  providers: [AppService],
})
@Injectable()
export class AppModule implements OnApplicationBootstrap {
  async onApplicationBootstrap(): Promise<void> {
    // exec migration script
    const linux_liked_os = ['linux', 'darwin'];
    if (linux_liked_os.includes(process.platform)) {
      await this.runMigration();
    }
    // filled up with initial data list
    console.log(`The module has been initialized.`);
  }
  async runMigration(): Promise<void> {
    const path = './startScript.sh';
    try {
      if (fs.existsSync(path)) {
        console.log('found startScript.sh, executing migration');
      } else {
        console.log('startScript.sh not found');
        process.exit(1);
      }
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
    await this.executeScript(path);
  }

  async executeScript(path): Promise<string> {
    return new Promise((callback) => {
      exec('sh ' + path, (error, stdout, stderr) => {
        console.log(stdout);
        if (error !== null) {
          console.log(`exec error: ${error}`);
          return;
        }
        callback('Script finished success');
      });
    });
  }
}
