import { Injectable } from '@nestjs/common';
import { CreateWhishlistDto } from './dto/create-whishlist.dto';
import { UpdateWhishlistDto } from './dto/update-whishlist.dto';

@Injectable()
export class WhishlistService {
  create(createWhishlistDto: CreateWhishlistDto) {
    return 'This action adds a new whishlist';
  }

  findAll() {
    return `This action returns all whishlist`;
  }

  findOne(id: number) {
    return `This action returns a #${id} whishlist`;
  }

  update(id: number, updateWhishlistDto: UpdateWhishlistDto) {
    return `This action updates a #${id} whishlist`;
  }

  remove(id: number) {
    return `This action removes a #${id} whishlist`;
  }
}
