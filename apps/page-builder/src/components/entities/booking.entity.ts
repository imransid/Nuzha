import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  IsBoolean,
} from 'class-validator';
import { ContactInfo } from './contactInfo.entity';
import { PaymentInfo } from './paymentInfo.entity';
import { PropertyData } from './property.entity';

@ObjectType()
export class Booking {
  @Field(() => Int)
  @IsNumber()
  id: number;

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

  @Field()
  @IsString()
  user_id: string;

  @Field(() => [ContactInfo], { nullable: true })
  @IsOptional()
  contactInfo?: ContactInfo[];

  @Field(() => [PaymentInfo], { nullable: true })
  @IsOptional()
  paymentInfo?: PaymentInfo[];

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  propertyDataId?: number;

  @Field(() => PropertyData, { nullable: true })
  @IsOptional()
  propertyData?: PropertyData;

  @Field({ nullable: true })
  @IsOptional()
  createdAt?: Date;

  @Field({ nullable: true })
  @IsOptional()
  updateAt?: Date;
}

@ObjectType()
export class StandardResponseBooking {
  @Field()
  message: string;

  @Field(() => Booking, { nullable: true })
  data?: Booking;
}
