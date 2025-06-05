import {
  InputType,
  Field,
  Int,
  ObjectType,
  PartialType,
} from '@nestjs/graphql';
import { IsString, IsOptional, IsInt, MaxLength } from 'class-validator';
import { Review } from '../entities/review.entity';

@InputType()
export class CreateReviewDto {
  @Field()
  @IsString()
  userId: string;

  @Field()
  @IsString()
  @MaxLength(5)
  rating: string;

  @Field()
  @IsString()
  @MaxLength(1000)
  comment: string;

  @Field(() => Int)
  @IsInt()
  propertyId: number;
}

@InputType()
export class UpdateReviewDto extends PartialType(CreateReviewDto) {
  @Field(() => Int)
  @IsInt()
  id: number;
}

@ObjectType()
export class PaginatedReviewResult {
  @Field(() => [Review], { defaultValue: [] })
  reviews: Review[] = [];

  @Field(() => Int)
  totalPages: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  totalCount: number;

  constructor(
    reviews: Review[],
    totalPages: number,
    currentPage: number,
    totalCount: number,
  ) {
    this.reviews = reviews ?? [];
    this.totalPages = totalPages;
    this.currentPage = currentPage;
    this.totalCount = totalCount;
  }
}
