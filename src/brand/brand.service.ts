import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';

@Injectable()
export class BrandService {
  constructor(
    @InjectModel(Brand.name) private brandModel: Model<Brand>,
  ) {}

  async create(createBrandDto: CreateBrandDto): Promise<Brand> {
    const createdBrand = new this.brandModel(createBrandDto);
    return createdBrand.save();
  }

  async findAll(): Promise<Brand[]> {
    return this.brandModel.find().exec();
  }

  async findOne(id: string): Promise<Brand> {
    const brand = await this.brandModel.findById(id).exec();
    if (!brand) {
      throw new NotFoundException(`Brand with id ${id} not found`);
    }
    return brand;
  }

  async update(id: string, updateBrandDto: UpdateBrandDto): Promise<Brand> {
    const updatedBrand = await this.brandModel.findByIdAndUpdate(id, updateBrandDto, { new: true }).exec();
    if (!updatedBrand) {
      throw new NotFoundException(`Brand with id ${id} not found`);
    }
    return updatedBrand;
  }

  async remove(id: string): Promise<Brand> {
    const deletedBrand = await this.brandModel.findByIdAndDelete(id).exec();
    if (!deletedBrand) {
      throw new NotFoundException(`Brand with id ${id} not found`);
    }
    return deletedBrand;
  }
}
