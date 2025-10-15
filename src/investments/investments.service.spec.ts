import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvestmentsService } from './investments.service';
import { Investment } from './entities/investment.entity';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { InvestmentStatus } from './dto/create-investment.dto';

describe('InvestmentsService', () => {
  let service: InvestmentsService;
  let repository: Repository<Investment>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvestmentsService,
        {
          provide: getRepositoryToken(Investment),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<InvestmentsService>(InvestmentsService);
    repository = module.get<Repository<Investment>>(getRepositoryToken(Investment));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an investment successfully', async () => {
      const createDto: CreateInvestmentDto = {
        title: 'Test Investment',
        description: 'Test Description',
        category: 'Test Category',
        start_date: '2024-01-01',
        end_date: '2024-12-31',
        country: 'Nigeria',
        state: 'Lagos',
        city: 'Victoria Island',
        address: 'Test Address',
        targeted_amount: 1000000,
        expected_return: 15,
        duration: 12,
        minimum_investment: 10000,
        riskLevel: 'medium' as any,
      };

      const mockInvestment = {
        id: 1,
        ...createDto,
        owner: { id: 1 },
        status: InvestmentStatus.PENDING,
        totalRaised: 0,
        images: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.create.mockReturnValue(mockInvestment);
      mockRepository.save.mockResolvedValue(mockInvestment);

      const result = await service.create(createDto, 1);

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.status).toBe(InvestmentStatus.PENDING);
    });
  });

  describe('findAll', () => {
    it('should return paginated investments', async () => {
      const mockInvestments = [
        {
          id: 1,
          title: 'Investment 1',
          owner: { id: 1 },
          totalRaised: 0,
          targeted_amount: 1000000,
        } as any,
      ];

      mockRepository.findAndCount.mockResolvedValue([mockInvestments, 1]);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.investments).toBeDefined();
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return an investment by id', async () => {
      const mockInvestment = {
        id: 1,
        title: 'Test Investment',
        owner: { id: 1 },
        totalRaised: 0,
        targeted_amount: 1000000,
              } as any;

      mockRepository.findOne.mockResolvedValue(mockInvestment);

      const result = await service.findOne(1);

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
    });

    it('should throw NotFoundException when investment not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow('Investment with ID 999 not found');
    });
  });
});
