import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { InvestmentCategory } from './entities/investment-category.entity';

import { CreateInvestmentCategoryDto } from './dto/create-investment-category.dto';
import { UpdateInvestmentCategoryDto } from './dto/update-investment-category.dto';

@Injectable()
export class InvestmentCategoriesService {
  constructor(
    @InjectRepository(InvestmentCategory)
    private readonly investmentCategoryRepo: Repository<InvestmentCategory>,
  ) {}

  async createInvestmentCategory(payload: CreateInvestmentCategoryDto) {
    const categoryExists = await this.investmentCategoryRepo.findOneBy({ name: payload.name });
    if (categoryExists) {
      throw new ConflictException('Investment category already exists');
    }

    const newCategory = await this.investmentCategoryRepo.create({ 
      name: payload.name, 
      description: payload.description, 
      icon: payload.icon 
    });
    await this.investmentCategoryRepo.save(newCategory);

    return {
      name: newCategory.name,
      description: newCategory.description,
      icon: newCategory.icon,
    };
  }

  async getInvestmentCategories() {
    return await this.investmentCategoryRepo.find();
  }

  async updateInvestmentCategory(payload: UpdateInvestmentCategoryDto) {
    const category = await this.investmentCategoryRepo.findOneBy({ name: payload.name });
    if (!category) {
      throw new NotFoundException('Investment category not found');
    }
    category.name = payload.name;
    category.description = payload.description;
    category.icon = payload.icon;
    await this.investmentCategoryRepo.save(category);

    return {
      name: category.name,
      description: category.description,
      icon: category.icon,
    };
  }
}
