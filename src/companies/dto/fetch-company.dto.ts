import { ApiProperty, ApiPropertyOptional  } from "@nestjs/swagger";

export class FetchCompanyDto {
  @ApiProperty({
    description: 'ID of the company',
  })
  id: number;

  @ApiProperty({
    description: 'Name of the company',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Description of the company',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Website URL of the company',
  })
  websiteUrl?: string;

  @ApiPropertyOptional({
    description: 'Logo URL of the company',
  })
  logoUrl?: string;

  @ApiPropertyOptional({
    description: 'Address of the company',
  })
  address?: string;

  @ApiPropertyOptional({
    description: 'Official phone number of the company',
  })
  officialPhone?: string;

  @ApiPropertyOptional({
    description: 'Official email of the company',
  })
  officialEmail?: string;

  @ApiProperty({
    description: 'Verification status of the company',
  })
  isVerified: boolean;
} 