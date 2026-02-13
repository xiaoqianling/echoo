import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './shared/config/configuration';
import { AuthModule } from './modules/core/auth/auth.module';
import { UsersModule } from './modules/core/users/users.module';
import { ApiTokensModule } from './modules/core/api-tokens/api-tokens.module';
import { OrganizationsModule } from './modules/echoo/organizations/organizations.module';
import { MessagesModule } from './modules/echoo/messages/messages.module';
import { WebSocketModule } from './modules/echoo/websocket/websocket.module';
import { StatsModule } from './modules/echoo/stats/stats.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('database.synchronize'),
        logging: configService.get('database.logging'),
        ssl: false,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    ApiTokensModule,
    OrganizationsModule,
    MessagesModule,
    WebSocketModule,
    StatsModule,
    RouterModule.register([
      {
        path: 'echoo',
        children: [
          { path: '/', module: OrganizationsModule },
          { path: '/', module: MessagesModule },
          { path: '/', module: StatsModule },
        ],
      },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
