import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../common/dto/login.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Obtain JWT token with API key' })
  @Post('login')
  async login(@Body() { apiKey }: LoginDto) {
    const token = await this.authService.validateApiKeyAndGenerateToken(apiKey);
    if (!token) {
      throw new UnauthorizedException('Invalid API key');
    }
    return { accessToken: token };
  }
}