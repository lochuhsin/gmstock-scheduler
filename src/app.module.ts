import { Logger, Module } from '@nestjs/common';
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
  private readonly logger = new Logger(AppModule.name);

  async onApplicationBootstrap(): Promise<void> {
    const scriptPath = settings.startScript['path'];

    // test postgres database connection
    await this.testDBConnection();

    // check start script
    this.checkStartScript(scriptPath);

    const linux_liked_os = ['linux', 'darwin'];
    if (linux_liked_os.includes(process.platform)) {
      // exec migration script
      await this.runMigration(scriptPath);
    } else {
      this.logger.log('Skip migration.');
    }

    // filled up with initial data list
    this.logger.log(`The module has been initialized.`);
  }

  async testDBConnection(): Promise<string> {
    return new Promise((callback) => {
      const client = new Client(settings.postgres);
      client.connect((err) => {
        if (err) {
          this.logger.error('connection error', err.stack);
          this.logger.log('Startup database connection failed, check db');
          process.exit(1);
        }
      });
      callback('ok!');
    });
  }

  checkStartScript(path: string): void {
    try {
      if (!fs.existsSync(path)) {
        this.logger.log('startScript.sh not found');
        process.exit(1);
      }
    } catch (err) {
      this.logger.error(err);
      process.exit(1);
    }
  }

  async runMigration(path: string): Promise<string> {
    return new Promise((callback) => {
      exec('sh ' + path, (error, stdout, _) => {
        this.logger.log(stdout);
        if (error !== null) {
          this.logger.log(`exec error: ${error}`);
          return;
        }
        callback('Script finished success');
      });
    });
  }
}
