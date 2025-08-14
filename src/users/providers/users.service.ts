/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException, RequestTimeoutException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/User.entity';
import { DataSource, Repository } from 'typeorm';
import { Role } from '../../entities/Role.entity';
import { Address } from '../../entities/Address.entity';
import { EmailAlreadyExistsException } from '../../common/exceptions/EmailAlreadyExistsException ';
import { HashingProvider } from '../../auth/providers/hashing.provider';
import { CartService } from '../../cart/providers/cart.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Role)
    private roleRepo: Repository<Role>,

    @InjectRepository(Address)
    private addrRepo: Repository<Address>,

    @Inject(forwardRef(() => HashingProvider))
    private hashingProvider: HashingProvider,

    private cartService: CartService,

    private dataSource: DataSource,

  ) { }

  async create(createUserDto: CreateUserDto) {
    return await this.dataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);
      const roleRepo = manager.getRepository(Role);
      const addrRepo = manager.getRepository(Address);

      const existingUser = await userRepo.findOne({ where: { email: createUserDto.email } });
      if (existingUser) throw new EmailAlreadyExistsException('Email already exists');

      let defaultRole = await roleRepo.findOne({ where: { role: 'ROLE_USER' } });
      if (!defaultRole) {
        defaultRole = roleRepo.create({ role: 'ROLE_USER' });
        await roleRepo.save(defaultRole);
      }

      const hashedPassword = await this.hashingProvider.hashPassword(createUserDto.password);

      const user = userRepo.create({
        email: createUserDto.email,
        name: createUserDto.name,
        password: hashedPassword,
        photo: createUserDto.photo,
        createAt: new Date(),
        role: defaultRole,
      });

      const savedUser = await userRepo.save(user);

      const address = addrRepo.create({
        city: createUserDto.city,
        country: createUserDto.country,
        street: createUserDto.street,
        phoneNumber: createUserDto.phoneNumber,
        user: savedUser,
      });

      await addrRepo.save(address);

      await this.cartService.createCart(savedUser, manager);

      return savedUser;
    });
  }


  async findAll(): Promise<User[]> {
    return await this.userRepo.find({
      relations: ['addresses']
    });
  }

  async findOneById(id: number): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['role']
    });
    if (!user) {
      throw new BadRequestException(`User with id: ${id} not found!`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepo.findOne({ where: { id } });

    if (!user) {
      throw new BadRequestException(`No user with id: ${id}`);
    }

    let isUpdated = false;

    if (updateUserDto.name && updateUserDto.name !== user.name) {
      user.name = updateUserDto.name;
      console.log(user.name);

      isUpdated = true;
    }

    if (updateUserDto.photo && updateUserDto.photo !== user.photo) {
      user.photo = updateUserDto.photo;
      console.log(user.photo);
      isUpdated = true;
    }

    if (isUpdated) {
      return await this.userRepo.save(user);
    }

    return `Update fail! Try again`;
  }


  async remove(id: number) {
    await this.userRepo.delete({ id });
    return `This action removes a #${id} user`;
  }

  public async findOneByEmail(email: string) {
    let user;

    try {
      user = await this.userRepo.findOne({
        where: { email },
        relations: ['role']
      });
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Could not fetch the user',
      });
    }

    if (!user) {
      throw new NotFoundException('User does not exists');
    }

    return user;
  }
}
