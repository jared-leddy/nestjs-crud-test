import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [],
  providers: [AppService],
})
export class AppModule {}
