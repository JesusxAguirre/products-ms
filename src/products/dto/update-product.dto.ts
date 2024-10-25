import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsNumber, IsUUID } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {

    @IsUUID()
    id: string;

}


