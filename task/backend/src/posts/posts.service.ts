import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.post.findMany({ orderBy: { id: 'asc' } });
  }

  async findOne(id: number) {
    const p = await this.prisma.post.findUnique({ where: { id } });
    if (!p) throw new NotFoundException('Post not found');
    return p;
  }

  async create(dto: CreatePostDto) {
    await this.prisma.user.findUniqueOrThrow({ where: { id: dto.userId } });
    return this.prisma.post.create({ data: dto });
  }

  async update(id: number, dto: UpdatePostDto) {
    await this.findOne(id);
    return this.prisma.post.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.post.delete({ where: { id } });
  }
}
