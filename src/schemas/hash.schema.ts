import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type HashDocument = Hash & Document;
/**
 * @description Tabela utilizada para armazenar hashs para envio de links
 */
@Schema()
export class Hash {

    _id: Types.ObjectId;
    @Prop({ required: true })
    idRelacionado: Types.ObjectId;
    @Prop({ required: true })
    ativo: boolean;
    @Prop({ required: true })
    dataVencimento: Date;
    @Prop({ required: true, type: String })
    tipo: 'senha' | 'email';

    constructor(idRelacionado: Types.ObjectId, tipo: TipoHash, ativo = true) {

        this.idRelacionado = idRelacionado;
        this.ativo = ativo;

        let dataExp: Date;
        if (tipo === 'senha') {
            
            const hoje = new Date();
            const amanha = new Date();
            amanha.setDate(hoje.getDate() + 1);
            dataExp = amanha;
        } else {

            const hoje = new Date();
            const nunca = new Date();
            nunca.setDate(hoje.getFullYear() + 1000);
            dataExp = nunca;
        }

        this.dataVencimento = dataExp;
        this.tipo = tipo;
    }
}

export const HashSchema = SchemaFactory.createForClass(Hash);
export type TipoHash = 'senha' | 'email';