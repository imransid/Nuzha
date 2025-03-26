import { InputType, Field, Int } from '@nestjs/graphql';
import { IsOptional, IsString, IsInt, IsDateString } from 'class-validator';

@InputType()
export class CreatePaymentInfoDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  paymentInfo?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  transactionID?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  cardholderName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  cardName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  experienceDate?: string;

  @Field()
  @IsInt()
  userId: number;

  @Field()
  @IsInt()
  propertyId: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  createdAt?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  updateAt?: Date;
}

@InputType()
export class UpdatePaymentInfoDto {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  paymentInfo?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  transactionID?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  cardholderName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  cardName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  experienceDate?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  userId?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  propertyId?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  createdAt?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  updateAt?: Date;
}
