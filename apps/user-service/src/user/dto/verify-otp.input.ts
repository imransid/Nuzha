import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString } from 'class-validator';

@InputType()
export class VerifyOtpInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  otp: string;
}
