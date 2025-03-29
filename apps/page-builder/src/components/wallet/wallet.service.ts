import {
  Injectable,
  Logger,
  NotFoundException,
  HttpException,
} from '@nestjs/common';
import { PrismaPageBuilderService } from '../../../../../prisma/prisma-page-builder.service';
import {
  CreateWalletDto,
  PaginatedWalletResult,
  UpdateWalletDto,
} from '../dto/wallet.dto';
import { Wallet } from '../entities/wallet.entity';

@Injectable()
export class WalletService {
  private logger = new Logger('WalletService');

  constructor(private readonly prisma: PrismaPageBuilderService) {}

  // Create a new wallet
  async create(createWalletDto: CreateWalletDto): Promise<any> {
    try {
      const { cardInformation, transaction, ...walletData } = createWalletDto;

      const wallet = await this.prisma.wallet.create({
        data: {
          ...walletData,
          cardInformation: {
            create: cardInformation?.map((card) => ({
              card_holder_name: card.card_holder_name,
              card_number: card.card_number,
              card_expired_date: card.card_expired_date,
            })),
          },
          transaction: {
            create: transaction?.map((txn) => ({
              transaction_receiver_name: txn.transaction_receiver_name,
              card_number: txn.card_number,
              transaction_type: txn.transaction_type,
            })),
          },
        },
        // include: {
        //   cardInformation: true,
        //   transaction: true,
        // },
      });

      return wallet;
    } catch (error) {
      this.logger.error('Error creating wallet', error);
      throw new HttpException('Error creating wallet', 500);
    }
  }

  // Get all wallets with pagination
  async findAll(page: number, limit: number): Promise<PaginatedWalletResult> {
    try {
      const skip = (page - 1) * limit;

      const wallets = await this.prisma.wallet.findMany({
        skip,
        take: limit,
        include: {
          cardInformation: true,
          transaction: true,
        },
      });

      const totalCount = await this.prisma.wallet.count();
      const totalPages = Math.ceil(totalCount / limit);

      return new PaginatedWalletResult(wallets, totalPages, page, totalCount);
    } catch (error) {
      this.logger.error('Error fetching wallets', error);
      throw new HttpException('Error fetching wallets', 500);
    }
  }

  // Find a single wallet by ID
  async findOne(id: number): Promise<Wallet> {
    try {
      const wallet = await this.prisma.wallet.findUnique({
        where: { id },
        include: {
          cardInformation: true,
          transaction: true,
        },
      });

      if (!wallet) {
        throw new NotFoundException(`Wallet with ID ${id} not found`);
      }

      return wallet;
    } catch (error) {
      this.logger.error('Error fetching wallet', error);
      throw new HttpException('Error fetching wallet', 500);
    }
  }

  // Update a wallet
  async update(id: number, updateWalletDto: UpdateWalletDto): Promise<Wallet> {
    try {
      const existingWallet = await this.prisma.wallet.findUnique({
        where: { id },
      });

      if (!existingWallet) {
        throw new NotFoundException(`Wallet with ID ${id} not found`);
      }

      const {
        id: _,
        cardInformation,
        transaction,
        ...walletFields
      } = updateWalletDto;

      const data: any = {
        ...walletFields,
      };

      // Only add nested relations if they're provided
      if (cardInformation?.length) {
        data.cardInformation = {
          create: cardInformation.map((card) => ({
            card_holder_name: card.card_holder_name,
            card_number: card.card_number,
            card_expired_date: card.card_expired_date,
          })),
        };
      }

      if (transaction?.length) {
        data.transaction = {
          create: transaction.map((txn) => ({
            transaction_receiver_name: txn.transaction_receiver_name,
            card_number: txn.card_number,
            transaction_type: txn.transaction_type,
          })),
        };
      }

      const updatedWallet = await this.prisma.wallet.update({
        where: { id },
        data,
        include: {
          cardInformation: true,
          transaction: true,
        },
      });

      return updatedWallet;
    } catch (error) {
      this.logger.error('Error updating wallet', error);
      throw new HttpException('Error updating wallet', 500);
    }
  }

  // Delete a wallet
  async remove(id: number): Promise<Wallet> {
    try {
      const wallet = await this.prisma.wallet.findUnique({ where: { id } });

      if (!wallet) {
        throw new NotFoundException(`Wallet with ID ${id} not found`);
      }

      return await this.prisma.wallet.delete({ where: { id } });
    } catch (error) {
      this.logger.error('Error removing wallet', error);
      throw new HttpException('Error removing wallet', 500);
    }
  }

  // Search wallets
  async search(
    query: string,
    page: number,
    limit: number,
  ): Promise<PaginatedWalletResult> {
    try {
      const skip = (page - 1) * limit;

      const wallets = await this.prisma.wallet.findMany({
        where: {
          wallet_total_balance: {
            contains: query,
            mode: 'insensitive',
          },
        },
        skip,
        take: limit,
        include: {
          cardInformation: true,
          transaction: true,
        },
      });

      const totalCount = await this.prisma.wallet.count({
        where: {
          wallet_total_balance: {
            contains: query,
            mode: 'insensitive',
          },
        },
      });

      const totalPages = Math.ceil(totalCount / limit);

      return new PaginatedWalletResult(wallets, totalPages, page, totalCount);
    } catch (error) {
      this.logger.error('Error searching wallets', error);
      throw new HttpException('Error searching wallets', 500);
    }
  }
}
