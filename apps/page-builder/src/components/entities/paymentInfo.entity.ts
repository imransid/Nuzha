import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  IsUUID,
  MaxLength,
} from 'class-validator';

@ObjectType()
export class PaymentInfo {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  id?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  paymentInfo?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  transactionID?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  cardholderName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  cardName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  experienceDate?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  userId?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  propertyDataId?: number;

  @Field({ nullable: true })
  @IsOptional()
  createdAt?: Date;

  @Field({ nullable: true })
  @IsOptional()
  updateAt?: Date;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  bookingId?: string;
}
