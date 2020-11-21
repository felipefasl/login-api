import { Acessos } from './../decorators/acessos.decorator';
import { Body, Controller, Delete, Get, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { Controller as Ctrl } from '@nestjs/common/interfaces';
import { ApiBearerAuth, ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateResponse } from '../entities/update-response.entity';
import { Usuario } from '../schemas/usuario.schema';
import { UsuarioConsultaService } from '../services/usuario/usuario.consulta.service';
import { UsuarioService } from '../services/usuario/usuario.service';
import { RequisicaoHash } from './../entities/login.entity';
import { TipoHash } from './../schemas/hash.schema';

class EmailRequisicao {

    @ApiProperty()
    email?: string;
}

@Controller('usuarios')
@ApiTags('Usuários')
export class UsuarioController implements Ctrl {

    constructor(
        private usuarioService: UsuarioService,
        private usuarioConsultaService: UsuarioConsultaService
    ) { }

    @Get('todos')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Acessos('geral')
    @ApiOperation({ summary: 'Pesquisar todos os usuários cadastradas na base' })
    @ApiResponse({ status: 200, type: Usuario, isArray: true })
    pesquisarTodos(): Promise<Usuario[]> {

        return this.usuarioConsultaService.pesquisarTodos()
    }

    @Get('email')
    @ApiResponse({ status: 200, type: Usuario, isArray: false })
    @ApiOperation({ summary: 'Consulta Usuário por email', parameters: [{ name: 'email', in: 'query' }] })
    consularPorEmail(@Query('email') email: string): Promise<Usuario> {

        return this.usuarioConsultaService.consultarPorEmail(email);
    }

    @Get('hash-senha')
    @ApiResponse({ status: 200, type: Usuario, isArray: false })
    @ApiOperation({ summary: 'Consulta Usuário por hash de redefinição de senha', parameters: [{ name: 'hash', in: 'query' }] })
    consultarPorHash(@Query('hash') hash: string, @Query('tipo') tipo: TipoHash): Promise<Usuario[]> {

        // @ts-ignore
        return this.usuarioConsultaService.consultarPorHash(hash, tipo);
    }

    @Post('link-senha')
    @ApiOperation({ summary: 'Envia Email com link para redefinição de senha de usuário' })
    solicitarRedefinicaoSenha(@Body() requsiicao: EmailRequisicao): Promise<any> {

        return this.usuarioService.enviarEmailLinkRedefinicaoSenha(requsiicao.email);
    }

    @Put('hash-senha')
    @ApiOperation({ summary: 'Realiza atualização de senha de usuario a partir do hash' })
    redefinirSenha(@Body() requisicao: RequisicaoHash): Promise<any> {

        console.log(JSON.stringify(requisicao));
        return this.usuarioService.redefinirSenha(requisicao);
    }

    @Post('email')
    @ApiOperation({ summary: 'Realiza validação do email cadastrado' })
    validarEmail(@Body() requsiicao: RequisicaoHash): Promise<{ email: string }> {

        return this.usuarioService.validarEmail(requsiicao);
    }


    @Post()
    @ApiOperation({ summary: 'Cadastra usuário na base' })
    cadastrar(@Body() usuario: Usuario): Promise<Usuario> {

        return this.usuarioService.cadastrar(usuario);
    }


    @Put()
    @ApiOperation({ summary: 'Atualiza usuário na base' })
    atualizar(@Body() usuario: Usuario): Promise<UpdateResponse> {

        return this.usuarioService.atualizar(usuario);
    }

    @Delete('todos')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Acessos('geral')
    @ApiOperation({ summary: 'Exclui TODOS os usuários da base' })
    @ApiResponse({ status: 200, type: UpdateResponse })
    excluirTodos(): Promise<UpdateResponse> {

        return this.usuarioService.excluirTodos();
    }
}