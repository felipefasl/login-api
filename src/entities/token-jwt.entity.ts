import { ApiProperty } from '@nestjs/swagger';

export class ITokenJwt {
    
    @ApiProperty()
    access_token: string;
}
