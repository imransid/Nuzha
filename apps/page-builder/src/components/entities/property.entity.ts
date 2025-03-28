import { ObjectType, Field, Int } from '@nestjs/graphql';
import { pathFinderMiddleware } from 'middleware/pathFinderMiddleware';
import { GraphQLJSONObject } from 'graphql-type-json';
import {
  IsOptional,
  IsBoolean,
  IsString,
  IsArray,
  MaxLength,
  IsNumber,
} from 'class-validator';

@ObjectType()
export class PropertyData {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  id?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  price?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsArray()
  facility?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  location?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  longitudeCode?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  latitudeCode?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  country?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  street?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  city?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  postcode?: string;

  @Field(() => [PropertyPhotos], { nullable: true })
  @IsOptional()
  propertyImage?: PropertyPhotos[];

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  propertyType?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  otherItem?: string; // Structured JSON for additional details
}

@ObjectType()
export class PropertyPhotos {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  id?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  propertyId?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  url?: string;

  @Field({ nullable: true })
  @IsOptional()
  createdAt?: Date;

  @Field({ nullable: true })
  @IsOptional()
  updateAt?: Date;
}

@ObjectType()
export class PropertyPaginatedResult {
  @Field(() => [PropertyData], { defaultValue: [] }) // Ensuring it's always an array
  properties: PropertyData[] = [];

  @Field(() => Int)
  totalPages: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  totalCount: number;

  constructor(
    properties: PropertyData[],
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
