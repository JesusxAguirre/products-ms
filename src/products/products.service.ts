import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { ResponseProductDto } from './dto/response-product.dto';
import { PaginationDto, ResponsePaginationDto } from 'src/core';

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

  async findAll(paginationDto: PaginationDto): Promise<ResponsePaginationDto<ResponseProductDto>> {
    const { page, limit } = paginationDto;

    const totalItems = await this.product.count({
      where: {
        is_active: true,
      }
    });

    const products = await this.product.findMany(
      {
        skip: (page - 1) * limit,
        take: limit,
        where: {
          is_active: true,
        },
      }
    );
    const responseProducts = plainToInstance(ResponseProductDto, products);

    return new ResponsePaginationDto({
      page: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems: totalItems,
      items: responseProducts,

    })

  }

  async findOne(id: string): Promise<ResponseProductDto> {
    const product = await this.product.findUnique({
      where: {
        id: id,
        is_active: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with id #${id} not found`);
    }

    return plainToInstance(ResponseProductDto, product);
  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    const { id: __, ...data } = updateProductDto;

    await this.findOne(id);

    const updatedProduct = await this.product.update({
      where: {
        id: id,
      },
      data: data,
    });

    return plainToInstance(ResponseProductDto, updatedProduct);
  }

  async remove(id: string) {

    await this.findOne(id);

    return this.product.update({
      where: {
        id: id,
      },
      data: {
        is_active: false,
      },
    });
  }
}
