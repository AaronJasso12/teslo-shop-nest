import { Controller, Get, Headers, UnauthorizedException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ValidRoles } from '../auth/interfaces';
import { Auth } from '../auth/decorators';

import { SeedService } from './seed.service';
import { ConfigService } from '@nestjs/config';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService, private readonly configService: ConfigService) {}

  @Get()
  // @Auth( ValidRoles.admin )
  @ApiOperation({
    summary: 'Destruye y crea una nueva base de datos',
    description:
      'Destruye y crea la base de datos de productos y usuarios, esto invalida también tokens existentes y usuarios creados.',
  })
  @ApiResponse({ status: 200, description: 'Seed ejecutado con éxito' })
  async executeSeed(@Headers('x-seed-secret') secret: string) {
    const expectedSecret = this.configService.get<string>('SEED_SECRET');

    if (!expectedSecret || secret !== expectedSecret) {
      throw new UnauthorizedException();
    }
    
    return this.seedService.runSeed();
  }
}
