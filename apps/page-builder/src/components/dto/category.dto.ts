import {
  InputType,
  Field,
  Int,
  PartialType,
  ObjectType,
} from '@nestjs/graphql';
import { Upload } from 'scalars/upload.scalar';

import {
  IsAlpha,
  IsEmail,
  IsOptional,
  Length,
  Matches,
  MaxLength,
  MinLength,
  IsBoolean,
  IsEnum,
  IsString,
  IsPhoneNumber,
} from 'class-validator';

@InputType()
export class CreateCategoryDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name: string;

  @Field()
  @IsString()
  user_id?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  propertyType?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => [Upload], {
    nullable: true,
    description: 'Input for the Photo Image.',
  })
  @IsOptional()
  photoUpload: Upload[];
}

@InputType()
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @Field(() => Int)
  id: number;
}
