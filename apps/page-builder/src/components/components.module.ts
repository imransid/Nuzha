import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../../prisma/prisma.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PropertyResolver } from './property/property.resolver';
import { PropertyService } from './property/property.service';
import { BookingResolver } from './booking/booking.resolver';
import { BookingService } from './booking/booking.service';
import { CategoryResolver } from './category/category.resolver';
import { CategoryService } from './category/category.service';
import { WalletResolver } from './wallet/wallet.resolver';
import { WalletService } from './wallet/wallet.service';

@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: 3600,
        },
      }),
    }),
  ],
  providers: [
    JwtService,
    ConfigService,
    PropertyResolver,
    PropertyService,
    BookingResolver,
    BookingService,
    CategoryResolver,
    CategoryService,
    WalletService,
    WalletResolver,
  ],

  //PropertyService
})
export class ComponentsModule {}
