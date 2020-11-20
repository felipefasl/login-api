import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Controller as Ctrl } from '@nestjs/common/interfaces';
import { ApiOperation, ApiResponse, ApiTags, ApiProperty } from '@nestjs/swagger';
import { LocalAuthGuard } from '../auth/guards/local-auth.guard';
import { ITokenJwt } from '../entities/token-jwt.entity';
import { AuthService } from '../services/auth.service';
import { Login } from '../entities/login.entity';


class AcessTokenGoogle {
    
    @ApiProperty()
    acessToken: string
}
@Controller()
@ApiTags('Autenticação')
export class AuthController implements Ctrl {

    constructor(private  authService: AuthService) { }

    @Post('/auth')
    @UseGuards(LocalAuthGuard)
    @ApiOperation({ summary: 'Realiza a autenticação no sistema' })
    @ApiResponse({ status: 200, description: 'Token de autenticação', type: ITokenJwt })
    async login(@Body() login: Login): Promise<ITokenJwt> {

        return this.authService.login(login);
    }

    @Post('/auth-google')
    @ApiOperation({ summary: 'Realiza a autenticação no sistema' })
    @ApiResponse({ status: 200, description: 'Token de autenticação', type: ITokenJwt })
    async loginGoogle(@Body() requisicao: AcessTokenGoogle): Promise<ITokenJwt> {

        return this.authService.loginGoogle(requisicao.acessToken);
    }
}
