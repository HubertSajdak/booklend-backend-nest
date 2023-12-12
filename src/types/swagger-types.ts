import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponse {
  @ApiProperty({
    description: 'Total items',
  })
  totalItems: number;
  @ApiProperty({
    description: 'Number of pages',
  })
  numberOfPages?: number;

  @ApiProperty({
    description: 'Data',
  })
  data: object;
}
