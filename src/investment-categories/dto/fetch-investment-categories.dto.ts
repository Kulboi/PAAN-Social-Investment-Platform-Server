import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FetchInvestmentCategoriesDto {
  @ApiProperty({
    description: 'id of the investment category',
  })
  id: number;
  
  @ApiProperty({
    description: 'Unique name of the investment category',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Description of the investment category',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Icon URL of the investment category',
  })
  icon?: string;
}