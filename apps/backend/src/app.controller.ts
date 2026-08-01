import { Controller, Get } from '@nestjs/common';
import type { ApiResponse } from './common/interfaces/api-response.interface';

@Controller('health')
export class AppController {
  @Get()
  health(): ApiResponse<{ status: string }> {
    return { data: { status: 'ok' } };
  }
}
