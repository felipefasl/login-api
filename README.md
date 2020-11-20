# login-api

Backend sistema de login genérico desenvolvido em [NestJs v7](https://nestjs.com/)

[Documentação Swagger](https://nestjs-login-api.herokuapp.com/)

## MongoDB

[Fonte estudo](https://docs.nestjs.com/techniques/mongodb#mongo)

[Hospedagem Banco de Dados](https://www.mongodb.com/cloud/atlas/lp/try2?utm_source=google&utm_campaign=gs_americas_brazil_search_brand_atlas_desktop&utm_term=mongodb&utm_medium=cpc_paid_search&utm_ad=e&utm_ad_campaign_id=1718986516&gclid=CjwKCAiAzNj9BRBDEiwAPsL0d0HSeeUwwGHTFqVd_t5XZSeOFmo7pvTvlXeaxKchioSmGnu6Q71PDRoCXgwQAvD_BwE)


## Gerenciamento de Token JWT
 [Fonte estudo](https://docs.nestjs.com/security/authentication#jwt-functionality)

## Cors
 [Fonte estudo](https://docs.nestjs.com/security/cors)
## Utilização de Hashs para Segurança
    - Geração de link redefinicao senha
    - Geração de link confirmação email

*>> Desenvolvimento Próprio*
## Envio de Emails
[Fonte estudo](https://nest-modules.github.io/mailer/)
## Geração de Arquivo de Log 
[Fonte estudo](https://docs.nestjs.com/techniques/logger#logger)
## Schedule
    - Rotina para excluir da base hashs já utilizados
    - Rotina para organizar arquivos de log

 [Fonte Estudo](https://docs.nestjs.com/techniques/task-scheduling#task-scheduling)

## OpenApi 
[Fonte estudo](https://docs.nestjs.com/openapi/introduction)

## Hospedagem Heroku

[Fonte estudo](https://www.joshmorony.com/deploying-a-production-nestjs-server-on-heroku/)
## ATENÇÃO!!
Para o sistema funcionar perfeitamente localmente deve-se cadastrar as [variáveis de sistemas](src/configs/constants.config.ts) do Projeto