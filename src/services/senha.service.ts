import { EmailStaticService } from './statics/email.static.service';
import { variaveisAmbiente } from 'src/configs/constants.config';
import { logger } from './../main';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, ScopeOptions } from '@nestjs/common';
import { env } from 'process';
const crypto = require('crypto');

@Injectable()
export class SenhaService {

    constructor(private mailerService: MailerService) { }

    /**
     * @description Encriptograva senha
     */
    encriptSenha(senha: string): string {

        return crypto
            .createHmac('sha512', variaveisAmbiente.jwtKey)
            .update(senha)
            .digest('hex');
    };

    gerarHash() {

        return crypto.randomBytes(Math.ceil(4))
            .toString('hex')
            .slice(0, 16);
    }

    async enviarEmailRedifinicaoSenha(nome: string, email: string, link: string) {

        return this.mailerService
            .sendMail({
                to: email,
                subject: 'Solicitação de redefinição de senha - SistemaFelipe',
                html: EmailStaticService.getHtmlEmailTeplateSenhaEmail(nome, link, 'senha'),
            });
    }


}
