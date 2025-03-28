import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IsOptional, IsString, MaxLength, IsNumber } from 'class-validator';
import { PropertyData } from './property.entity';

@ObjectType()
export class Category {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  id?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  photo?: string;

  @Field(() => [PropertyData], { nullable: true })
  @IsOptional()
  PropertyData?: PropertyData[];
}

@ObjectType()
export class CategoryPaginatedResult {
  @Field(() => [Category], { defaultValue: [] }) // Ensuring it's always an array
  category: Category[] = [];

  @Field(() => Int)
  totalPages: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  totalCount: number;

  constructor(
    category: Category[],
    totalPages: number,
    currentPage: number,
    totalCount: number,
  ) {
    this.category = category ?? [];
    this.totalPages = totalPages;
    this.currentPage = currentPage;
    this.totalCount = totalCount;
  }
}

@ObjectType()
export class StandardResponseCategory {
  @Field()
  data: Category;

  @Field({ nullable: true })
  message?: string;
}
