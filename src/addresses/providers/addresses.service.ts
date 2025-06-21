/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from '../../entities/Address.entity';
import { Repository } from 'typeorm';
import { User } from '../../entities/User.entity';
import { AddressDTO } from '../dto/address.dto';

@Injectable()
export class AddressesService {
    constructor(
        @InjectRepository(Address)
        private readonly addressRepo: Repository<Address>,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) { }

    async createAddress(dto: AddressDTO, userId: number): Promise<any> {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');
        const address = this.addressRepo.create({ ...dto, user });
        const saveAddress = await this.addressRepo.save(address);
        return saveAddress;
    }


    async getAddressByUserId(userId: number): Promise<Address[]> {
        const address = await this.addressRepo.find({
            where: { user: { id: userId } },
            relations: ['user'],
        });

        if (!address) {
            throw new NotFoundException(`Address not found for user ID: ${userId}`);
        }

        return address;
    }


    async updateAddressByUserId(dto: AddressDTO, addressId: number, userId: number): Promise<Address> {

        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException(`User not found with ID: ${userId}`);

        const address = await this.addressRepo.findOne({ where: { id: addressId } });
        if (!address) throw new NotFoundException(`Address not found with ID: ${addressId}`);

        Object.assign(address, dto);
        return this.addressRepo.save(address);
    }

    async deleteAddressByUserId(addressId: number): Promise<void> {
        const address = await this.addressRepo.findOne({ where: { id: addressId } });
        if (!address) throw new NotFoundException(`Address not found with ID: ${addressId}`);

        await this.addressRepo.remove(address);
    }
}
