import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient{
    constructor(){
        super({
            datasources:{
                db :{
                    url: 'postgresql://admin:admin123@pixelmindgame.ddns.net:5432/testdb?schema=public'
                }
            }
        })
    }
}
