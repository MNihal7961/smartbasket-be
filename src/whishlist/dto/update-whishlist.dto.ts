import { PartialType } from '@nestjs/swagger';
import { CreateWhishlistDto } from './create-whishlist.dto';

export class UpdateWhishlistDto extends PartialType(CreateWhishlistDto) {}
