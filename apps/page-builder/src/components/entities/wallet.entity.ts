import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IsString, IsInt, IsOptional, IsDateString } from 'class-validator';
import { CardInformation } from './cardInformation.entity';
import { Transaction } from './transaction.entity';

@ObjectType()
export class Wallet {
  @Field(() => Int)
  @IsInt()
  id: number;

  @Field()
  @IsString()
  wallet_total_balance: string;

  @Field()
  @IsString()
  user_id: string;

  @Field(() => [CardInformation], { nullable: true })
  @IsOptional()
  cardInformation?: CardInformation[];

  @Field(() => [Transaction], { nullable: true })
  @IsOptional()
  transaction?: Transaction[];

  @Field({ nullable: true })
  @IsOptional()
  createdAt?: Date;

  @Field({ nullable: true })
  @IsOptional()
  updateAt?: Date;
}

@ObjectType()
export class StandardResponseWallet {
  @Field()
  message: string;

  @Field(() => Wallet, { nullable: true })
  data?: Wallet;
}
