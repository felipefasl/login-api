import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';

export type UsuarioDocument = Usuario & Document;

@Schema()
export class Usuario {

    @ApiProperty()
    _id: Types.ObjectId;

    @Prop({ required: true, type: String })
    @ApiProperty()
    nome: string;

    @Prop({ required: true, type: String })
    @ApiProperty()
    senha: string;;

    @Prop({ required: true, type: String })
    @ApiProperty()
    email: string;

    @Prop({ required: true, type: String })
    @ApiProperty()
    telefone: string;

    @Prop({ required: true, type: [String] })
    @ApiProperty()
    acessos: string[];

    @Prop({ required: false, type: Boolean })
    emailValidado: boolean;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);