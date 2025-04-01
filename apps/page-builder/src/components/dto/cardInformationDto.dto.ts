import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsString, IsInt, IsDateString } from 'class-validator';

//
// Create DTO
//
@InputType()
export class CreateCardInformationDto {
  @Field()
  @IsString()
  card_holder_name: string;

  @Field()
  @IsString()
  card_number: string;

  @Field()
  @IsString()
  user_id?: string;

  @Field()
  @IsDateString()
  card_expired_date: Date;

  @Field(() => Int)
  @IsInt()
  walletID: number;
}

//
// Update DTO
//
@InputType()
export class UpdateCardInformationDto extends PartialType(
  CreateCardInformationDto,
) {
  @Field(() => Int)
  @IsInt()
  id: number;
}
