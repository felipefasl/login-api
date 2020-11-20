import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { constantes } from './../configs/constants.config';
import { TokenRefresh, TokenRefreshDocument } from './../schemas/token-refresh';

@Injectable()
export class TokenRefreshService {

    constructor(
        @InjectModel(TokenRefresh.name) private tokenRefreshModel: Model<TokenRefreshDocument>
    ) { }

    async cadastrar(token: string) {

        const tokenRefresh = new TokenRefresh(token);
        return new this.tokenRefreshModel(tokenRefresh).save();
    }

    async atualizar(token: string): Promise<boolean> {

        let tokenRefresh: TokenRefresh = await this.consultarAtivo(token);

        if (!tokenRefresh) {

            return false;
        }

        // Renova o token
        tokenRefresh.exp = new Date().getTime() + constantes.tempoExpiraToken;
        await this.tokenRefreshModel.updateOne({ _id: tokenRefresh._id }, tokenRefresh)
        return true;
    }

    async consultarAtivo(token: string): Promise<TokenRefresh>  {

        const agora = new Date().getTime();
        let tokenRefresh: TokenRefresh = await this.tokenRefreshModel
            .findOne(
                {
                    $and: [
                        { exp: { $gt: agora } },
                        { token }
                    ]
                }).exec();

        return tokenRefresh;
    }
}