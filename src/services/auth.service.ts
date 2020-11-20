import { Observable } from 'rxjs';
import { HttpService, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ITokenJwt } from 'src/entities/token-jwt.entity';
import { Login } from '../entities/login.entity';
import { logger } from './../main';
import { SenhaService } from './senha.service';
import { UsuarioConsultaService } from './usuario/usuario.consulta.service';
import { resolve } from 'path';

@Injectable()
export class AuthService {

    constructor(
        private usuarioConsultaService: UsuarioConsultaService,
        private jwtService: JwtService,
        private senhaService: SenhaService,
        private httpService: HttpService
    ) { }

    async validateUser(username: string, pass: string): Promise<any> {

        logger.warn('username ' + username);
        const user = await this.usuarioConsultaService.consultarPorEmail(username);
        const passEncript = this.senhaService.encriptSenha(pass);

        logger.warn('user ' + JSON.stringify(user));

        logger.warn('passEncript ' + passEncript);
        logger.warn('user?.senha ' + user?.senha);
        if (user?.senha === passEncript) {

            const { senha: password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(login: Login): Promise<ITokenJwt> {

        return await this.gerarToken(login.username);
    }

    async loginGoogle(token: string): Promise<ITokenJwt> {

        const dadosGoogle = await this.httpService.get('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + token).toPromise();

        if (dadosGoogle.data.expires_in === 0) {

            throw new UnauthorizedException('Token inválido.');
        }
       
        return await this.gerarToken(dadosGoogle.data.email.toLowerCase());
    }

    async gerarToken(email: string): Promise<ITokenJwt> {

        const usuario = await this.usuarioConsultaService.consultarPorEmail(email);
        const payload = { usuario: email, acessos: usuario.acessos };
        return { access_token: this.jwtService.sign(payload) };
    }

}