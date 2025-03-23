import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PrismaUserService } from '../../../../prisma/prisma-user.service';
import * as bcrypt from 'bcrypt';
import {
  GCodeData,
  GoogleLoginInput,
  LoginInput,
  UpdatePasswordDate,
} from './dto/login.input';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwtPayload.interface';
import { User } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { sendMail } from '../utils/email.util';
import { MailerService } from '@nestjs-modules/mailer';
import { ChangePasswordInput } from './dto/change-password.input';
import * as path from 'path';
import {
  deleteFileAndDirectory,
  uploadFileStream,
} from 'utils/file-upload.util';

@Injectable()
export class UserService {
  private uploadDir = path.join(process.env.UPLOAD_DIR, `UserS`, 'files');
  constructor(
    @Inject(PrismaUserService) private prismaService: PrismaUserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly mailService: MailerService,
  ) {}
  async create(createUserInput: CreateUserInput) {
    const { email, password } = createUserInput;
    let user = await this.prismaService.users.findUnique({ where: { email } });
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const imageFile: any = await createUserInput.photoUpload;
    const fileName = `${Date.now()}_${imageFile.filename}`;
    const filePath = await uploadFileStream(
      imageFile.createReadStream,
      this.uploadDir,
      fileName,
    );

    user = await this.prismaService.users.create({
      data: {
        ...createUserInput,
        password: hashedPassword,
        photo: filePath,
      },
    });

    return {
      message: `User ${user.fullName} has been successfully created.`,
      data: user,
    };
  }

  async findAll(page: number = 1, limit: number = 20) {
    return await this.prismaService.users.findMany({ take: limit });
  }

  async findOne(id: number) {
    return await this.prismaService.users.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateUserInput: UpdateUserInput): Promise<User> {
    try {
      const isUserExist = await this.findOne(id);

      if (!isUserExist) {
        throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);
      }

      var userPPUrl = isUserExist.photo;

      if (updateUserInput?.photoUpload) {
        if (isUserExist.photo) {
          const prevPPPath = isUserExist.photo.replace(
            `${process.env.BASE_URL}/`,
            '',
          );
          deleteFileAndDirectory(prevPPPath);
        }
        const imageFile: any = await updateUserInput?.photoUpload;
        const fileName = `${Date.now()}_${imageFile.filename}`;
        const filePath = await uploadFileStream(
          imageFile.createReadStream,
          this.uploadDir,
          fileName,
        );
        userPPUrl = filePath;
      }

      // Remove 'id' from the data object
      const { id: _, ...updateData } = updateUserInput;

      const updatedUserData = await this.prismaService.users.update({
        data: {
          ...updateData,
          role: updateUserInput.role || isUserExist.role, // Ensure role is always present
          photo: userPPUrl,
        },
        where: { id },
      });

      return updatedUserData;
    } catch (e) {
      throw new HttpException(
        `Error Updating User: ${e.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async changePassword(
    changePasswordInput: ChangePasswordInput,
  ): Promise<User> {
    try {
      const isUserExist: User = await this.prismaService.users.findUnique({
        where: {
          email: changePasswordInput.email,
        },
      });
      if (isUserExist) {
        const emailVarifiedAt = new Date().toISOString();
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(
          changePasswordInput.password,
          salt,
        );
        const updatedUserData: User = await this.prismaService.users.update({
          data: {
            password: hashedPassword,
          },
          where: {
            id: isUserExist.id,
          },
        });
        return updatedUserData;
      } else {
        throw new HttpException(
          'Change Password: User Email not found',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (e) {
      throw new HttpException(`Error Change Password  Request : ${e}`, 500);
    }
  }

  async forgotPassword(email: string): Promise<User> {
    try {
      const isUserExist: User = await this.prismaService.users.findUnique({
        where: {
          email,
        },
      });
      if (isUserExist) {
        const code = Math.floor(Math.random() * 10000);
        const rememberToken = `EWU-${code}`;
        const salt = await bcrypt.genSalt(12);
        const hashedToken = await bcrypt.hash(rememberToken, salt);
        const updatedUserData: User = await this.prismaService.users.update({
          data: {
            // rememberToken: hashedToken,
          },
          where: {
            id: isUserExist.id,
          },
        });

        return updatedUserData;
      } else {
        throw new HttpException(
          'Forgot Password: User Email not found',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (e) {
      throw new HttpException(`Error Forgot Password  Request : ${e}`, 500);
    }
  }

  async remove(id: number): Promise<User> {
    try {
      const isUserExist = await this.findOne(id);
      if (isUserExist) {
        await this.prismaService.users.delete({
          where: {
            id,
          },
        });
        return isUserExist;
      } else {
        throw new HttpException('User not exist', HttpStatus.BAD_REQUEST);
      }
    } catch (e) {
      throw new HttpException(`Error Deleting User  : ${e}`, 500);
    }
  }

  async login(data: LoginInput) {
    const { email, password } = data;
    const isEmailValid: User = await this.prismaService.users.findUnique({
      where: { email },
    });

    if (!isEmailValid) {
      throw new UnauthorizedException('Invalid username/password');
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      isEmailValid.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Password invalid.');
    }

    const payLoad: JwtPayload = {
      id: isEmailValid.id,
      userType: isEmailValid.role,
    };
    const accessToken = await this.jwtService.sign(payLoad, {
      secret: this.configService.get('JWT_SECRET'),
    });

    return {
      id: isEmailValid.id,
      name: isEmailValid.fullName,
      token: accessToken,
      userType: isEmailValid.role,
    };
  }
}
