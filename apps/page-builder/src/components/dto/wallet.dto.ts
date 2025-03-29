import {
  InputType,
  Field,
  Int,
  ObjectType,
  PartialType,
} from '@nestjs/graphql';
import { IsString, IsOptional, IsInt, IsDateString } from 'class-validator';
import { Wallet } from '../entities/wallet.entity';
import { CreateCardInformationDto } from './cardInformationDto.dto';
import { CreateTransactionDto } from './transactionDto.dto';

@InputType()
export class CreateWalletDto {
  @Field()
  @IsString()
  wallet_total_balance: string;

  @Field(() => [CreateCardInformationDto], { nullable: true })
  @IsOptional()
  cardInformation?: CreateCardInformationDto[];

  @Field(() => [CreateTransactionDto], { nullable: true })
  @IsOptional()
  transaction?: CreateTransactionDto[];
}

@InputType()
export class UpdateWalletDto extends PartialType(CreateWalletDto) {
  @Field(() => Int)
  @IsInt()
  id: number;
}

@ObjectType()
export class PaginatedWalletResult {
  @Field(() => [Wallet], { defaultValue: [] })
  wallets: Wallet[] = [];

  @Field(() => Int)
  totalPages: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  totalCount: number;

  constructor(
    wallets: Wallet[],
    totalPages: number,
    currentPage: number,
    totalCount: number,
  ) {
    this.wallets = wallets ?? [];
    this.totalPages = totalPages;
    this.currentPage = currentPage;
    this.totalCount = totalCount;
  }
}
