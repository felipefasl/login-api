import { Injectable } from '@nestjs/common';
import { Cron } from "@nestjs/schedule";
import { ExecScheduleEnum } from './../enums/exec-schedule.enum';
import { logger } from './../main';
import { DateStaticService } from './../services/statics/date.static.service';
const fs = require('fs');

@Injectable()
export class LogSchedule {

    /**
     * @description Renomeia o arquivo de log do dia para melhor organização
     */
    @Cron(ExecScheduleEnum.TODO_DIA_AS_0H)
    async organizarLog() {

        logger.log('***********************************************************************');
        logger.log('                      SCHEDULE - organizarLog');
        logger.log('-----------------------------------------------------------------------');
        logger.log('Timestamp : ' + String(new Date()));

        const hoje = new Date();
        const ontem = new Date();
        ontem.setDate(hoje.getDate() - 1);
        const nomeArquivo = DateStaticService.formatarDateParaString(new Date(), '-');

        const pasta = __dirname.replace('\\dist\\schedules', '\\logs');
        fs.rename(`${pasta}\\application.log`, `${pasta}\\${nomeArquivo}.log`, erro => {

            let resultado = 'Arquivo de log renomeado com sucesso.';
            if (erro) {

                if (erro.errno === -4058) {

                    resultado = `Erro ao renomear arquivo de log: Arquivo do dia inexistente`
                } else {

                    resultado = `Erro ao renomear arquivo de log: ${erro.errno}`
                }
            }

            logger.log('Resultado : ' + resultado);
            logger.log('***********************************************************************');
        });
    }
}