import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) private repo: Repository<Product>) {}

  create(data: Partial<Product>) {
    const p = this.repo.create(data);
    return this.repo.save(p);
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  async update(id: number, data: Partial<Product>) {
    const p = await this.findOne(id);
    if (!p) throw new NotFoundException('Product not found');
    Object.assign(p, data);
    return this.repo.save(p);
  }

  async remove(id: number) {
    const p = await this.findOne(id);
    if (!p) throw new NotFoundException('Product not found');
    return this.repo.remove(p);
  }
}
