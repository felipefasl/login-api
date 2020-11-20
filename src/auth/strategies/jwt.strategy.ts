import { logger } from './../../main';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { variaveisAmbiente } from 'src/configs/constants.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor() {

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: variaveisAmbiente.jwtKey,
    });
  }


  async validate(payload: any) {

    return { _id: payload.sub, usuario: payload.usuario, acessos: payload.acessos };
  }


}
