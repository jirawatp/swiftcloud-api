import { Module } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApiKeyGuard } from './guards/api-key.guard';

@Module({
  providers: [ApiKeyGuard, Reflector],
  exports: [ApiKeyGuard],
})
export class CommonModule {}