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
export class CreatePropertyDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  price?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  propertyType?: string;

  @Field(() => Int)
  categoryId: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  facility?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  location?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  longitudeCode?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  latitudeCode?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  street?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  postcode?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @Field(() => [Upload], {
    nullable: true,
    description: 'Input for the Photo Image.',
  })
  photoUpload: Upload[];

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  otherItem?: string; // Array of objects for extra metadata

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  rating?: string; // Array of objects for extra metadata

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  roomDetails?: string; // Array of objects for extra metadata

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  roomFeatures?: string; // Array of objects for extra metadata

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  adult_guest?: string; // Array of objects for extra metadata

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  child_guest?: string; // Array of objects for extra metadata

  @Field()
  @IsString()
  user_id?: string; // Array of objects for extra metadata
}

@InputType()
export class UpdatePropertyDto extends PartialType(CreatePropertyDto) {
  @Field(() => Int)
  id: number;
}
