import { Acessos } from './../decorators/acessos.decorator';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { UpdateResponse } from '../entities/update-response.entity';
import { Controller, Get, Post, Delete, UseGuards } from '@nestjs/common';
import { Controller as Ctrl } from '@nestjs/common/interfaces';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Hash } from 'src/schemas/hash.schema';
import { HashService } from 'src/services/hash.service';

@Controller('hashs')
@ApiTags('Hash')
export class HashController implements Ctrl {

    constructor(private  hashService: HashService) { }

    @Get('todos')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Acessos('geral')
    @ApiOperation({ summary: 'Pesquisa todos os hash cadastrados na base' })
    @ApiResponse({ status: 200, description: 'Lista de Hashs', type: Hash, isArray: true })
    async login(): Promise<Hash[]> {

        return this.hashService.pesquisarTodos();
    }

    @Delete('todos')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Acessos('geral')
    @ApiOperation({ summary: 'Excluir todos os hash cadastrados no sistema' })
    @ApiResponse({ status: 200, description: 'Esclui todos os Hashs da base' })
    async excluirTodos(): Promise<UpdateResponse> {

        return this.hashService.excluirTodos();
    }
}