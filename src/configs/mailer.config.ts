import { variaveisAmbiente } from 'src/configs/constants.config';
import { MailerOptions } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';

export const mailerConfig: MailerOptions = {

    transport: variaveisAmbiente.mailerTransport,
    defaults: {
        from: '"Felipe Lima" <f3188436@gmail.com>',
    },
    template: {
        dir: __dirname + '/templates',
        adapter: new PugAdapter(),
        options: {
            strict: false,
        },
    }
};