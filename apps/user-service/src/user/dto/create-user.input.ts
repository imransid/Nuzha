import { InputType, Field } from '@nestjs/graphql';
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
import { RoleUSER } from '../../prisma/role.enum';
import { Upload } from 'scalars/upload.scalar';

@InputType()
export class CreateUserInput {
  @Field()
  @IsOptional()
  @IsAlpha()
  @Length(0, 255)
  firstName?: string;

  @Field()
  @IsOptional()
  @IsAlpha()
  @Length(0, 255)
  lastName?: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsPhoneNumber(null)
  phone?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  method?: string;

  @Field(() => Boolean, { defaultValue: false })
  @IsOptional()
  @IsBoolean()
  isPhoneVerified?: boolean;

  @Field(() => RoleUSER, { defaultValue: RoleUSER.USERS })
  @IsOptional()
  // @IsEnum(RoleUSER)
  role: keyof typeof RoleUSER;

  // @Field(() => YesOrNo, { defaultValue: YesOrNo.NO })
  // isWatermarkEnable: keyof typeof YesOrNo;

  @Field(() => Boolean, { defaultValue: false })
  @IsOptional()
  @IsBoolean()
  twoStepVerification?: boolean;

  @Field(() => Boolean, { defaultValue: true })
  @IsOptional()
  @IsBoolean()
  isUserActive?: boolean;

  @Field(() => Upload, {
    nullable: true,
    description: 'Input for the Photo Image.',
  })
  photoUpload: Upload;
}
