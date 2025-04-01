import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsOptional,
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsDateString,
} from 'class-validator';

@InputType()
export class CreateContactInfoDto {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  user_id?: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsPhoneNumber()
  phone: string;

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
export class UpdateContactInfoDto {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  createdAt?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  updateAt?: Date;
}
