import { ApiProperty } from '@nestjs/swagger';

export class DashboardMetricsResponseDto {
  @ApiProperty({ description: 'Total number of investments' })
  totalInvestments: number;

  @ApiProperty({ description: 'Total value of all investments' })
  totalInvestmentValue: number;

  @ApiProperty({ description: 'Number of pending approvals' })
  pendingApprovals: number;

  @ApiProperty({ description: 'Total number of active investments' })
  activeInvestments?: number;

  @ApiProperty({ description: 'Total number of completed investments' })
  completedInvestments?: number;

  @ApiProperty({ description: 'Total amount raised across all investments' })
  totalAmountRaised?: number;
}
