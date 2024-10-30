// src/products/dto/response-product.dto.ts
import { Exclude, Expose, Type } from 'class-transformer';
import { CreateProductDto } from './create-product.dto';

export class ResponseProductDto extends CreateProductDto {
  constructor(partial: Partial<ResponseProductDto>) {
    super();
    Object.assign(this, partial);
  }
}
