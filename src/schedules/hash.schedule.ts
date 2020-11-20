import { Injectable } from '@nestjs/common';
import { Cron } from "@nestjs/schedule";
import { HashService } from 'src/services/hash.service';
import { ExecScheduleEnum } from './../enums/exec-schedule.enum';
import { logger } from './../main';
const fs = require('fs');

@Injectable()
export class HashSchedule {

    constructor(
        private  hashService: HashService
    ) { }

    /**
     * @description exclui da base hashs vencidos ou não ativos
     */
    @Cron(ExecScheduleEnum.TODO_DIA_AS_1H)
    async excluirHashsVencidosOuNaoAtivos() {

        logger.log('**************************************************************');
        logger.log(' SCHEDULE - excluirHashsVencidosOuNaoAtivos');
        logger.log('--------------------------------------------------------------');
        logger.log('Inicio         : ' + String(new Date()));

        const log = await this.hashService.excluirVencidosOuNaoAtivos();

        logger.log('Fim            : ' + String(new Date()));
        logger.log('Total Excluídos: ' + log.deletedCount);
        logger.log('**************************************************************');
    }
}