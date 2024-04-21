import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { AppService } from './app.service';

@Controller('greetings')
export class AppController {
  constructor(private readonly appService : AppService) {}

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('goodbye')
  getGoodBye(@Req() request : Request ): string {
    console.log(`${request.query.name}`);
    return this.appService.getGoodBye();
  }
}
