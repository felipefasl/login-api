import { variaveisAmbiente } from 'src/configs/constants.config';

export const jwtConfig = {
    secret: variaveisAmbiente.jwtKey,
    signOptions: { expiresIn: '60m' },
};