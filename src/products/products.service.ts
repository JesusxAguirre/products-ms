import {
  HttpStatus,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { ResponseProductDto } from './dto/response-product.dto';
import { PaginationDto, ResponsePaginationDto } from 'src/core';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async create(
    createProductDto: CreateProductDto,
  ): Promise<ResponseProductDto> {
    const new_product = await this.product.create({
      data: createProductDto,
    });

    return plainToInstance(ResponseProductDto, new_product);
  }

  async findAll(paginationDto: PaginationDto): Promise<ResponsePaginationDto> {
    const { page, limit } = paginationDto;

    const totalItems = await this.product.count({
      where: {
        isActive: true,
      },
    });

    const products = await this.product.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        isActive: true,
      },
    });

    const responseProducts = plainToInstance(ResponseProductDto, products);

    return new ResponsePaginationDto({
      page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
      items: responseProducts,
    });
  }

  async findOne(id: string): Promise<ResponseProductDto> {
    const product = await this.product.findUnique({
      where: {
        id: id,

        isActive: true,
      },
    });

    if (!product) {
      throw new RpcException({
        message: `Product with id #${id} not found`,
        status: HttpStatus.NOT_FOUND,
      });
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
        isActive: false,
      },
    });
  }

  async validateProducts(ids: string[]) {
    ids = Array.from(new Set(ids));

    const products = await this.product.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    if (products.length !== ids.length) {
      throw new RpcException({
        message: 'Some products not found',
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return products;
  }
}
