import { TipoHash } from './../../schemas/hash.schema';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import HttpStatusCodeEnum from 'src/enums/http-code.enum';
import { Hash } from 'src/schemas/hash.schema';
import { Usuario, UsuarioDocument } from '../../schemas/usuario.schema';
import { HashService } from '../hash.service';
import { logger } from './../../main';
import { DateStaticService } from './../statics/date.static.service';

/**
 * @description Serviço contendo consultas(Retorna um registro) do Schema Usuario
 */
@Injectable()
export class UsuarioConsultaService {

    constructor(
        @InjectModel(Usuario.name) private  usuarioModel: Model<UsuarioDocument>,
        private  hashService: HashService
    ) { }

    /**
     * @description Consulta Usuário pelo email OU pelo telefone
     */
    async consultarPorEmailOuTelefone(email: string, telefone: string): Promise<Usuario[]> {

        return this.usuarioModel.find({ $or: [{ email }, { telefone }] }).exec();
    }

    /**
     * @description Consulta Usuário pelo email
     */
    async consultarPorEmail(email: string): Promise<Usuario> {

        return this.usuarioModel.findOne({ email }).exec();
    }

    /**
     * @description Consulta Usuário pelo Telefone
     */
    async consultarPorTelefone(telefone: string): Promise<Usuario> {

        return this.usuarioModel.findOne({ telefone }).exec();
    }

    /**
     * @description Consulta por Hash do link de redefinicao de senha
     */
    async consultarPorHash(_id: Types.ObjectId, tipo: TipoHash): Promise<Usuario | undefined> {

        let hash: Hash;
        try {
            hash = await this.hashService.consultarPorIdAndTipo(_id, tipo);
        } catch (error) {
            throw error;
        }

        const hashInvalidoOuVencido = hash ? DateStaticService.compararDatas(hash.dataVencimento, new Date()) === 2 : true;

        if (hashInvalidoOuVencido) {

            throw new HttpException('Link inválido ou já expirado.', HttpStatusCodeEnum.BAD_REQUEST);
        }

        let usuario: Usuario;
        try {
            usuario = await this.consultarPorId(hash.idRelacionado);
        } catch (error) {
            throw error;
        }

        return usuario;
    }

    /**
     * @description Consulta por Id do usuário
     */
    async consultarPorId(_id: Types.ObjectId): Promise<Usuario | undefined> {

        return this.usuarioModel.findOne({ _id }).exec();
    }

    /**
     * @description Pesquisar todos os usuários cadastrados na base
     */
    async pesquisarTodos(): Promise<Usuario[]> {
        
        return this.usuarioModel.find().exec();
    }

}
