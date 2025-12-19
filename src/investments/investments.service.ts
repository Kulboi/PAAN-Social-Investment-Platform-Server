import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Investment } from './entities/investment.entity';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { UpdateInvestmentDto } from './dto/update-investment.dto';
import { QueryInvestmentDto } from './dto/query-investment.dto';
import { InvestmentResponseDto } from './dto/investment-response.dto';
import { InvestmentStatus } from './dto/create-investment.dto';

@Injectable()
export class InvestmentsService {
  constructor(
    @InjectRepository(Investment)
    private readonly investmentRepository: Repository<Investment>,
  ) {}

  async create(createInvestmentDto: CreateInvestmentDto, userId: string): Promise<InvestmentResponseDto> {
    const startDate = new Date(createInvestmentDto.start_date);
    const endDate = new Date(createInvestmentDto.end_date);
    
    if (startDate >= endDate) {
      throw new BadRequestException('End date must be after start date');
    }

    if (startDate < new Date()) {
      throw new BadRequestException('Start date cannot be in the past');
    }

    const investment = this.investmentRepository.create({
      ...createInvestmentDto,
      creator_id: userId,
      status: InvestmentStatus.PENDING,
      totalRaised: 0,
      images: createInvestmentDto.images || [],
    });

    const savedInvestment = await this.investmentRepository.save(investment);
    return this.mapToResponseDto(savedInvestment);
  }

  async findAll(queryDto: QueryInvestmentDto): Promise<{
    investments: InvestmentResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC', ...filters } = queryDto;
    
    const whereConditions: FindOptionsWhere<Investment> = {};
    
    if (filters.search) {
      whereConditions.title = Like(`%${filters.search}%`);
    }
    
    if (filters.category) {
      whereConditions.category = filters.category;
    }
    
    if (filters.status) {
      whereConditions.status = filters.status;
    }
    
    if (filters.creatorId) {
      whereConditions.creator_id = filters.creatorId;
    }

    const [investments, total] = await this.investmentRepository.findAndCount({
      where: whereConditions,
      order: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['owner'],
    });

    const totalPages = Math.ceil(total / limit);

    return {
      investments: investments.map(investment => this.mapToResponseDto(investment)),
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: number): Promise<InvestmentResponseDto> {
    const investment = await this.investmentRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!investment) {
      throw new NotFoundException(`Investment with ID ${id} not found`);
    }

    return this.mapToResponseDto(investment);
  }

  async update(id: number, updateInvestmentDto: UpdateInvestmentDto, userId: string): Promise<InvestmentResponseDto> {
    const investment = await this.investmentRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!investment) {
      throw new NotFoundException(`Investment with ID ${id} not found`);
    }

    if (investment.creator_id !== userId) {
      throw new ForbiddenException('You can only update your own investments');
    }

    Object.assign(investment, updateInvestmentDto);
    investment.updatedAt = new Date();

    const updatedInvestment = await this.investmentRepository.save(investment);
    return this.mapToResponseDto(updatedInvestment);
  }

  async remove(id: number, userId: string): Promise<{ message: string }> {
    const investment = await this.investmentRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!investment) {
      throw new NotFoundException(`Investment with ID ${id} not found`);
    }

    if (investment.creator_id !== userId) {
      throw new ForbiddenException('You can only delete your own investments');
    }

    if (investment.status === InvestmentStatus.ACTIVE && investment.totalRaised > 0) {
      throw new BadRequestException('Cannot delete investment with active investments');
    }

    await this.investmentRepository.remove(investment);
    return { message: 'Investment deleted successfully' };
  }

  async updateStatus(id: number, status: InvestmentStatus, userId: string): Promise<InvestmentResponseDto> {
    const investment = await this.investmentRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!investment) {
      throw new NotFoundException(`Investment with ID ${id} not found`);
    }

    if (investment.creator_id !== userId) {
      throw new ForbiddenException('You can only update your own investments');
    }

    investment.status = status;
    investment.updatedAt = new Date();

    const updatedInvestment = await this.investmentRepository.save(investment);
    return this.mapToResponseDto(updatedInvestment);
  }

  async findByOwner(userId: string): Promise<InvestmentResponseDto[]> {
    const investments = await this.investmentRepository.find({
      where: { creator_id: userId },
      order: { createdAt: 'DESC' },
      relations: ['creator'],
    });

    return investments.map(investment => this.mapToResponseDto(investment));
  }

  async getFeaturedInvestments(limit: number = 5): Promise<InvestmentResponseDto[]> {
    const investments = await this.investmentRepository.find({
      where: { status: InvestmentStatus.ACTIVE },
      order: { expected_return: 'DESC' },
      take: limit,
      relations: ['owner'],
    });

    return investments.map(investment => this.mapToResponseDto(investment));
  }

  private mapToResponseDto(investment: Investment): InvestmentResponseDto {
    const percentageRaised = investment.targeted_amount > 0 
      ? Math.round((investment.totalRaised / investment.targeted_amount) * 100)
      : 0;

    return {
      id: investment.id,
      title: investment.title,
      description: investment.description,
      creator_id: investment.creator_id,
      images: investment.images,
      category: investment.category,
      start_date: investment.start_date,
      end_date: investment.end_date,
      status: investment.status,
      country: investment.country,
      state: investment.state,
      lga: investment.lga,
      city: investment.city,
      address: investment.address,
      targeted_amount: investment.targeted_amount,
      expected_return: investment.expected_return,
      duration: investment.duration,
      minimum_investment: investment.minimum_investment,
      riskLevel: investment.riskLevel,
      totalRaised: investment.totalRaised,
      percentageRaised,
      createdAt: investment.createdAt,
      updatedAt: investment.updatedAt,
    };
  }
}
