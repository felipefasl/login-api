import { MailerModule } from '@nestjs-modules/mailer';
import { HttpModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { WinstonModule } from 'nest-winston';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { LocalStrategy } from './auth/strategies/local.strategy';
import { variaveisAmbiente } from './configs/constants.config';
import { jwtConfig } from './configs/jwt.config';
import { loggerConfig, loggerInterceptor } from './configs/logger.config';
import { mailerConfig } from './configs/mailer.config';
import { AuthController } from './controllers/auth.controller';
import { HashController } from './controllers/hash.controller';
import { UsuarioController } from './controllers/usuario.controller';
import { HashSchedule } from './schedules/hash.schedule';
import { LogSchedule } from './schedules/log.schedule';
import { Hash, HashSchema } from './schemas/hash.schema';
import { TokenRefresh, TokenRefreshSchema } from './schemas/token-refresh';
import { Usuario, UsuarioSchema } from './schemas/usuario.schema';
import { AuthService } from './services/auth.service';
import { HashService } from './services/hash.service';
import { SenhaService } from './services/senha.service';
import { TokenRefreshService } from './services/token-refresh.service';
import { UsuarioConsultaService } from './services/usuario/usuario.consulta.service';
import { UsuarioService } from './services/usuario/usuario.service';

@Module({
  imports: [
    HttpModule,
    // Mailer
    MailerModule.forRoot(mailerConfig),

    // Logger
    WinstonModule.forRoot(loggerConfig),

    // Segurança Jwt
    JwtModule.register(jwtConfig),

    // MongoDB
    MongooseModule.forRoot(variaveisAmbiente.mongoConnection),
    MongooseModule.forFeature([
      { name: Usuario.name, schema: UsuarioSchema },
      { name: Hash.name, schema: HashSchema },
      { name: TokenRefresh.name, schema: TokenRefreshSchema },
    ]),

    // Schedule
    ScheduleModule.forRoot(),
  ],
  controllers: [
    HashController,
    AuthController,
    UsuarioController
  ],
  providers: [
    // Segurança
    LocalStrategy,
    JwtStrategy,

    // Logger
    loggerInterceptor,

    AuthService,
    SenhaService,
    HashService,
    UsuarioService,
    UsuarioConsultaService,
    TokenRefreshService,

    HashSchedule,
    LogSchedule
  ]
})
export class AppModule { }
