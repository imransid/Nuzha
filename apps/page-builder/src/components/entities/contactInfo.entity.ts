import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IsOptional, IsString, IsNumber, IsEmail } from 'class-validator';

@ObjectType()
export class ContactInfo {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  id?: number;

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
  @IsString()
  phone?: string;

  @Field({ nullable: true })
  @IsOptional()
  createdAt?: Date;

  @Field({ nullable: true })
  @IsOptional()
  updateAt?: Date;
}
