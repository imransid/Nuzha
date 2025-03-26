import {
  InputType,
  Field,
  Int,
  ObjectType,
  PartialType,
} from '@nestjs/graphql';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsInt,
} from 'class-validator';
import { CreatePaymentInfoDto } from './payment-info.dto';
import { CreateContactInfoDto } from './contact-info.dto';
import { Booking } from '../entities/booking.entity';

@InputType()
export class CreateBookingDto {
  @Field()
  @IsDateString()
  booking_date_start: Date;

  @Field()
  @IsDateString()
  booking_date_end: Date;

  @Field()
  @IsString()
  adult_guest: string;

  @Field()
  @IsString()
  children: string;

  @Field()
  @IsString()
  cost: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  userId?: string;

  @Field(() => [CreateContactInfoDto], { nullable: true })
  @IsOptional()
  contactInfo?: CreateContactInfoDto[];

  @Field(() => [CreatePaymentInfoDto], { nullable: true })
  @IsOptional()
  paymentInfo?: CreatePaymentInfoDto[];

  @Field(() => Int)
  @IsOptional()
  propertyDataId?: number;
}

@InputType()
export class UpdateBookingDto extends PartialType(CreateBookingDto) {
  @Field(() => Int)
  id: number;
}

@ObjectType()
export class PaginatedBookingResult {
  @Field(() => [Booking], { defaultValue: [] })
  bookings: Booking[] = [];

  @Field(() => Int)
  totalPages: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  totalCount: number;

  constructor(
    bookings: Booking[],
    totalPages: number,
    currentPage: number,
    totalCount: number,
  ) {
    this.bookings = bookings ?? [];
    this.totalPages = totalPages;
    this.currentPage = currentPage;
    this.totalCount = totalCount;
  }
}
