
export const variaveisAmbiente = {
 
    mailerTransport: process.env.MAILER_TRANSPORT, // smtps://<email>:<senha>@<smtp, ex: smtp.gmail.com>
    mongoConnection: process.env.MONGO_CONNECTION, // localhost >>   mongodb://localhost/login
    jwtKey: process.env.JWT_KEY, // senha criptografia do token jwt
    frontend: process.env.FRONTEND, // endereço do frontend para geração de links

};

export const constantes = {

    // 3600000 ms = 1h
    tempoExpiraToken: 3600000,
}
