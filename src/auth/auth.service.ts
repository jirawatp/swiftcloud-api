import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async validateApiKeyAndGenerateToken(apiKey: string): Promise<string | null> {
    const validApiKey = process.env.API_KEY || 'my-api-key';
    if (apiKey === validApiKey) {
      const payload = { apiKey };
      return this.jwtService.sign(payload);
    }
    return null;
  }
}