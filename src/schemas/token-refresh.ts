import { constantes } from './../configs/constants.config';
import { Type } from '@nestjs/common';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
export type TokenRefreshDocument = TokenRefresh & Document;

@Schema()
export class TokenRefresh {

    _id: Types.ObjectId;

    @Prop({ required: true, type: String })
    token: string;

    @Prop({ required: true, type: Number })
    exp: number;

    constructor(token: string) {

        this.token = token;
        this.exp = new Date().getTime() + constantes.tempoExpiraToken;
    }
}

export const TokenRefreshSchema = SchemaFactory.createForClass(TokenRefresh);