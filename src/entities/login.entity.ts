import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
export class Login {

    @ApiProperty({ example: 'John', description: 'Username Login' })
    username: string;

    @ApiProperty({ description: 'Password' })
    password: string;
}

export class RequisicaoHash {

    @ApiProperty()
    hash: Types.ObjectId;
    senha?: string;
}
