import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { WalletService } from './wallet.service';
import {
  CreateWalletDto,
  UpdateWalletDto,
  PaginatedWalletResult,
} from '../dto/wallet.dto';
import { Wallet, StandardResponseWallet } from '../entities/wallet.entity';
import { NotFoundException } from '@nestjs/common';
import { GraphQLException } from 'exceptions/graphql-exception';

@Resolver(() => Wallet)
export class WalletResolver {
  constructor(private readonly walletService: WalletService) {}

  @Mutation(() => StandardResponseWallet)
  async createWallet(
    @Args('createWalletDto') createWalletDto: CreateWalletDto,
  ) {
    try {
      const res = await this.walletService.create(createWalletDto);
      return {
        message: 'Wallet created successfully!',
        data: res,
      };
    } catch (error) {
      throw new GraphQLException(
        'Failed to create wallet',
        'INTERNAL_SERVER_ERROR',
      );
    }
  }

  @Query(() => PaginatedWalletResult)
  async wallets(
    @Args('page', { type: () => Int, nullable: true, defaultValue: 1 })
    page: number,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number,
  ): Promise<PaginatedWalletResult> {
    try {
      return await this.walletService.findAll(page, limit);
    } catch (error) {
      throw new GraphQLException(
        'Failed to fetch wallets',
        'INTERNAL_SERVER_ERROR',
      );
    }
  }

  @Query(() => Wallet)
  async wallet(@Args('id', { type: () => Int }) id: number): Promise<Wallet> {
    try {
      return await this.walletService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `Wallet with ID ${id} not found`,
          'NOT_FOUND',
        );
      }
      throw new GraphQLException(
        'Failed to fetch wallet',
        'INTERNAL_SERVER_ERROR',
      );
    }
  }

  @Mutation(() => Wallet)
  async updateWallet(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateWalletDto') updateWalletDto: UpdateWalletDto,
  ): Promise<Wallet> {
    try {
      return await this.walletService.update(id, updateWalletDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `Wallet with ID ${id} not found`,
          'NOT_FOUND',
        );
      }
      throw new GraphQLException(
        'Failed to update wallet',
        'INTERNAL_SERVER_ERROR',
      );
    }
  }

  @Mutation(() => Wallet)
  async removeWallet(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Wallet> {
    try {
      return await this.walletService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `Wallet with ID ${id} not found`,
          'NOT_FOUND',
        );
      }
      throw new GraphQLException(
        'Failed to remove wallet',
        'INTERNAL_SERVER_ERROR',
      );
    }
  }

  @Query(() => PaginatedWalletResult)
  async searchWallets(
    @Args('query', { type: () => String }) query: string,
    @Args('page', { type: () => Int, nullable: true, defaultValue: 1 })
    page: number,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number,
  ): Promise<PaginatedWalletResult> {
    try {
      return await this.walletService.search(query, page, limit);
    } catch (error) {
      throw new GraphQLException(
        'Failed to search wallets',
        'INTERNAL_SERVER_ERROR',
      );
    }
  }
}
