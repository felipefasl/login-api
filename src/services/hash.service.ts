import { logger } from './../main';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UpdateResponse } from './../entities/update-response.entity';
import { Hash, HashDocument, TipoHash } from './../schemas/hash.schema';

@Injectable()
export class HashService {

    constructor(
        @InjectModel(Hash.name) private hashModel: Model<HashDocument>
    ) { }

    async cadastrar(idRelacionado: Types.ObjectId, tipo: TipoHash) {

        await this.hashModel.updateMany({ $and: [{ idRelacionado }, { ativo: true }, { tipo }] }, { ativo: false },);

        let hash = new Hash(idRelacionado, tipo);
        return new this.hashModel(hash).save();
    }

    async excluirPorId(_id: Types.ObjectId): Promise<void> {

        await this.hashModel.deleteOne({ _id }).exec();
    }

    async consultarPorIdAndTipo(_id: Types.ObjectId, tipo: TipoHash): Promise<Hash | null> {

        return await this.hashModel.findOne({ $and: [{ _id }, { ativo: true }, { tipo }] }).exec();
    }

    async pesquisarTodos(): Promise<Hash[] | undefined> {

        return this.hashModel.find().exec();
    }

    async excluirTodos(): Promise<UpdateResponse> {

        return this.hashModel.deleteMany({});
    }

    async excluirVencidosOuNaoAtivos(): Promise<UpdateResponse> {

        const hoje = new Date();
        return this.hashModel.deleteMany({ $or: [{ dataVencimento: { $lt: hoje } }, { ativo: false }] });
    }

}
