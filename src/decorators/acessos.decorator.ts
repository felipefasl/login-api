import { SetMetadata } from '@nestjs/common';

export const Acessos = (...acessos: string[]) => SetMetadata('acessosNecessarios', acessos);