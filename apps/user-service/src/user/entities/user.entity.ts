import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsBoolean, IsString } from 'class-validator';
import { RoleUSER } from '../../prisma/role.enum';

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field()
  @IsEmail()
  email: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  fullName?: string;

  @Field({ nullable: true })
  @IsOptional()
  phone?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  password?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  bio?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  method?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isPhoneVerified?: boolean;

  @Field(() => RoleUSER, { defaultValue: RoleUSER.USERS })
  role: keyof typeof RoleUSER;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  twoStepVerification?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isUserActive?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  photo?: string;

  // @Field()
  // createdAt: Date;

  // @Field()
  // updatedAt: Date;
}
