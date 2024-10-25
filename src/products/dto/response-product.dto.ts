// src/products/dto/response-product.dto.ts
import { Exclude, Expose, Type } from 'class-transformer';
import { CreateProductDto } from './create-product.dto';

export class ResponseProductDto extends CreateProductDto {


    @Exclude()
    created_at: Date;

    @Exclude()
    updated_at: Date;

    constructor(partial: Partial<ResponseProductDto>) {
        super();
        Object.assign(this, partial);
    }
}
