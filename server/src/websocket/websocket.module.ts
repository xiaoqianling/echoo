import { Module } from '@nestjs/common';
import { WebSocketGateWay } from './websocket.gateway';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [AuthModule, JwtModule.register({})],
  providers: [WebSocketGateWay],
  exports: [WebSocketGateWay],
})
export class WebSocketModule {}
