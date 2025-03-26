import {
  InputType,
  Field,
  Int,
  PartialType,
  ObjectType,
} from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { Property } from '../entities/property.entity';
import { Upload } from 'scalars/upload.scalar';
import { pathFinderMiddlewareForArrayOfString } from 'middleware/pathFinderMiddleware';

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
import { RoleUSER } from '../../../../user-service/src/prisma/role.enum';

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

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

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
}

@InputType()
export class UpdatePropertyDto extends PartialType(CreatePropertyDto) {
  @Field(() => Int)
  id: number;
}

@ObjectType()
export class PropertyPaginatedResult {
  @Field(() => [Property], { defaultValue: [] }) // Ensuring it's always an array
  properties: Property[] = [];

  @Field(() => Int)
  totalPages: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  totalCount: number;

  constructor(
    properties: Property[],
    totalPages: number,
    currentPage: number,
    totalCount: number,
  ) {
    this.properties = properties ?? [];
    this.totalPages = totalPages;
    this.currentPage = currentPage;
    this.totalCount = totalCount;
  }
}
