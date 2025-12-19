import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Company } from './entities/company.entity';

import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async createCompany(payload: CreateCompanyDto): Promise<Company> {
    const existingCompany = await this.companyRepository.findOneBy({ name: payload.name });
    if (existingCompany) {
      throw new ConflictException(`Company with name ${payload.name} already exists`);
    } 
    
    const company = this.companyRepository.create(payload);
    return await this.companyRepository.save(company);
  }

  async getCompanies(): Promise<Company[]> {
    return await this.companyRepository.find();
  }

  async getCompany(id: string): Promise<Company> {
    const company = await this.companyRepository.findOneBy({ id });
    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
    return company;
  }

  async updateCompany(id: string, payload: UpdateCompanyDto): Promise<Company> {
    const company = await this.companyRepository.findOneBy({ id });
    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
    Object.assign(company, payload);
    return await this.companyRepository.save(company);
  }
}