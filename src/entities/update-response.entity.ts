import { ApiProperty } from '@nestjs/swagger';
export class UpdateResponse {

    @ApiProperty()
    ok?: number;
    @ApiProperty()
    n?: number;
    @ApiProperty()
    deletedCount?: number;
}