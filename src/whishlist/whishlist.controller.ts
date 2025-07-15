import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WhishlistService } from './whishlist.service';
import { CreateWhishlistDto } from './dto/create-whishlist.dto';
import { UpdateWhishlistDto } from './dto/update-whishlist.dto';

@Controller('whishlist')
export class WhishlistController {
  constructor(private readonly whishlistService: WhishlistService) {}

  @Post()
  create(@Body() createWhishlistDto: CreateWhishlistDto) {
    return this.whishlistService.create(createWhishlistDto);
  }

  @Get()
  findAll() {
    return this.whishlistService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.whishlistService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWhishlistDto: UpdateWhishlistDto) {
    return this.whishlistService.update(+id, updateWhishlistDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.whishlistService.remove(+id);
  }
}
