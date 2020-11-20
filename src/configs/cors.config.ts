import { variaveisAmbiente } from 'src/configs/constants.config';
import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";

export const corsConfig: CorsOptions = {
    origin: variaveisAmbiente.frontend,
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
  }