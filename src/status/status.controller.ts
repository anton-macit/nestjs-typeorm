import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { gitCommitHash } from '../utils/gitCommitHash';

@Controller('status')
export class StatusController {
  @Get()
  status(
    @Res({ passthrough: true }) res: Response,
    @Query('code') queryCode: string | undefined,
  ) {
    const code = Number(queryCode) || 200;
    if (code === -1) {
      throw Error('New fake error');
    }
    console.log(`code`, code, typeof code);
    res.status(code).json({
      status: 'UP',
      uptime_sec: process.uptime(),
      timestamp: new Date(),
      response_time_nano_sec: process.hrtime(),
      git_commit: gitCommitHash,
    });
  }
}
