import { TokenRefreshService } from './../../services/token-refresh.service';
import { HttpStatusCodeEnum } from './../../enums/http-code.enum';
import { Acessos } from './../../decorators/acessos.decorator';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Injectable, ExecutionContext, HttpException, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

    constructor(
        private reflector: Reflector,
        private jwtService: JwtService,
        private tokenRefreshService: TokenRefreshService
    ) {
        super();
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        let token: string = context.switchToHttp().getRequest().headers.authorization;
        token = token?.replace('Bearer ', '');
        const payload = this.jwtService.decode(token);

        if (new Date().getTime() > payload['exp'] * 1000) {

            if (!this.tokenRefreshService.atualizar(token)) {

                throw new UnauthorizedException('Sua sessão expirou.' + new Date(payload['exp'] * 1000));
            }
        }

        const acessosNecessarios = this.reflector.get<string[]>('acessosNecessarios', context.getHandler()) || [];
        let usuarioLogadoTemAcesso = false;
        if (acessosNecessarios.length > 0) {
            acessosNecessarios.forEach(acessoNecessario => {

                if (payload['acessos'].indexOf(acessoNecessario) !== -1) {

                    usuarioLogadoTemAcesso = true;
                }
            });
        }else {
            usuarioLogadoTemAcesso = true;
        }

        if (!usuarioLogadoTemAcesso) {

            throw new UnauthorizedException('Usuário sem acesso para executar essa funcionalidade.');
        }
        return true;
    }
}
