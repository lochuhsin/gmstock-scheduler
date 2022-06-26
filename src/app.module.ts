import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { exec } from 'child_process';
import * as fs from 'fs';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './tasks/task-test.module';
import { Client } from 'pg';
import settings from './config';

@Module({
  imports: [ScheduleModule.forRoot(), TasksModule],
  controllers: [AppController],
  providers: [AppService],
})

@Injectable()
export class AppModule implements OnApplicationBootstrap {
  async onApplicationBootstrap(): Promise<void> {
    const scriptPath = settings.startScript['path'];

    // test postgres database connection
    await this.testDBConnection();

    // check start script
    this.checkStartScript(scriptPath);

    // exec migration script
    await this.runMigration(scriptPath);

    // filled up with initial data list
    console.log(`The module has been initialized.`);
  }

  async testDBConnection(): Promise<string> {
    return new Promise((callback) => {
      const client = new Client(settings.postgres);
      client.connect((err) => {
        if (err) {
          console.error('connection error', err.stack);
          console.log('Startup database connection failed, check db');
          process.exit(1);
        }
      });
      callback('ok!');
    });
  }

  checkStartScript(path: string): void {
    try {
      if (!fs.existsSync(path)) {
        console.log('startScript.sh not found');
        process.exit(1);
      }
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  }

  async runMigration(path: string): Promise<string> {
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
