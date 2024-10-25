import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { ResponseProductDto } from './dto/response-product.dto';
import { PaginationDto } from 'src/core';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {

  async onModuleInit() {
    await this.$connect();
  }

  async create(createProductDto: CreateProductDto): Promise<ResponseProductDto> {

    const new_product = await this.product.create({
      data: createProductDto,
    });

    return plainToInstance(ResponseProductDto, new_product);
  }

  async findAll(paginationDto: PaginationDto): Promise<ResponseProductDto[]> {
    const { page, limit } = paginationDto;

    const products = await this.product.findMany(
      {
        skip: (page - 1) * limit,
        take: limit,
      }
    );

    return plainToInstance(ResponseProductDto, products);

  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
