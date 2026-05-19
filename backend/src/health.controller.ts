import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get('health')
  getHealth(): { status: 'ok'; service: 'wellness-backend' } {
    return {
      status: 'ok',
      service: 'wellness-backend',
    };
  }
}
