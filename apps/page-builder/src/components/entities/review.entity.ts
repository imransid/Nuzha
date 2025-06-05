import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  IsString,
  IsInt,
  IsOptional,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { PropertyData } from './property.entity';

@ObjectType()
export class Review {
  @Field(() => Int)
  @IsInt()
  id: number;

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

  @Field(() => PropertyData, { nullable: true })
  @IsOptional()
  property?: PropertyData;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  createdAt?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  updateAt?: Date;
}

@ObjectType()
export class StandardResponseReview {
  @Field()
  message: string;

  @Field(() => Review, { nullable: true })
  data?: Review;
}
