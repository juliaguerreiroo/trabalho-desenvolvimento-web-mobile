import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateUserDTO } from 'src/dtos/create-users-dto';
import bcrypt from 'bcryptjs';
import { GetUserDTO } from 'src/dtos/get-user-dto';

@Injectable()
export class UsersService {

    constructor(
        private prisma: PrismaService
    ) { }

    async createUser(dto: CreateUserDTO) {
        const passwordHash = await bcrypt.hash(dto.passwordHash, 10);
        return await this.prisma.user.create({
            data: {
                name: dto.name,
                email: dto.email,
                passwordHash: passwordHash
            }
        })
    }


    async getAllUsers(): Promise<GetUserDTO[]> {
        return this.prisma.user.findMany({
            select: { id: true, name: true, email: true, createdAt: true },
            orderBy: { name: 'asc' },
        });
    }

    async getUser(id: number): Promise<GetUserDTO> {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: { id: true, name: true, email: true, createdAt: true },
        });
        if (!user) throw new NotFoundException('Usuário não encontrado.');
        return user;
    }

    async updateUser(userId: number, id: number, dto: CreateUserDTO): Promise<void> {
        if (userId !== id) throw new NotFoundException('Usuário não encontrado.');
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                name: dto.name ?? '',
                email: dto.email ?? ''
            }
        });
    }
    async deleteUser(userId: number, id: number): Promise<void> {
        if (userId !== id) throw new NotFoundException('Usuário não encontrado.');
        await this.prisma.user.delete({
            where: { id: userId }
        });
    }
    async findByEmail(email: string) {
        return this.prisma.user.findUnique({ where: { email } });
    }


}
