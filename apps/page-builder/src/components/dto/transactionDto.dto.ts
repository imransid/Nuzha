import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsString, IsInt } from 'class-validator';

//
// Create DTO
//
@InputType()
export class CreateTransactionDto {
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
}

//
// Update DTO
//
@InputType()
export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {
  @Field(() => Int)
  @IsInt()
  id: number;
}
