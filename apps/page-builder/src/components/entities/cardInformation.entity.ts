import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IsString, IsInt, IsOptional, IsDateString } from 'class-validator';
import { Wallet } from './wallet.entity';

@ObjectType()
export class CardInformation {
  @Field(() => Int)
  @IsInt()
  id: number;

  @Field()
  @IsString()
  card_holder_name: string;

  @Field()
  @IsString()
  card_number: string;

  @Field()
  @IsDateString()
  card_expired_date: Date;

  @Field(() => Int)
  @IsInt()
  walletID: number;

  @Field()
  @IsString()
  user_id: string;

  @Field(() => Wallet, { nullable: true })
  wallet?: Wallet;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updateAt?: Date;
}
