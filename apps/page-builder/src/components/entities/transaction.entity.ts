import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IsString, IsInt } from 'class-validator';
import { Wallet } from './wallet.entity';

@ObjectType()
export class Transaction {
  @Field(() => Int)
  @IsInt()
  id: number;

  @Field()
  @IsString()
  transaction_receiver_name: string;

  @Field()
  @IsString()
  card_number: string;

  @Field()
  @IsString()
  transaction_type: string;

  @Field(() => Int)
  @IsInt()
  walletID: number;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updateAt?: Date;
}
