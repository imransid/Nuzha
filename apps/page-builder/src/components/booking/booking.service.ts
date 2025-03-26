import {
  Injectable,
  Logger,
  NotFoundException,
  HttpException,
} from '@nestjs/common';
import { PrismaPageBuilderService } from '../../../../../prisma/prisma-page-builder.service';
import {
  CreateBookingDto,
  PaginatedBookingResult,
  UpdateBookingDto,
} from '../dto/booking.dto';
import { Booking } from '../entities/booking.entity';

@Injectable()
export class BookingService {
  private logger = new Logger('BookingService');

  constructor(private readonly prisma: PrismaPageBuilderService) {}

  // Create a new booking
  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    try {
      const { paymentInfo, contactInfo, ...bookingData } = createBookingDto;

      // Create the booking
      const booking = await this.prisma.booking.create({
        data: {
          ...bookingData,
          contactInfo: {
            create: contactInfo?.map((info) => ({
              name: info.name,
              email: info.email,
              phone: info.phone,
            })),
          },
          paymentInfo: {
            create: paymentInfo?.map((info) => ({
              paymentInfo: info.paymentInfo,
              transactionID: info.transactionID,
              cardholderName: info.cardholderName,
              cardName: info.cardName,
              experienceDate: info.experienceDate,
            })),
          },
        },
        include: {
          contactInfo: true,
          paymentInfo: true,
        },
      });

      return booking;
    } catch (error) {
      this.logger.error('Error creating booking', error);
      throw new HttpException('Error creating booking', 500);
    }
  }

  // Fetch all bookings with pagination
  async findAll(page: number, limit: number): Promise<PaginatedBookingResult> {
    try {
      const skip = (page - 1) * limit;

      const [bookings, totalCount] = await this.prisma.booking.findMany({
        skip,
        take: limit,
        include: {
          contactInfo: true,
          paymentInfo: true,
        },
      });

      const totalPages = Math.ceil(totalCount / limit);

      return new PaginatedBookingResult(bookings, totalPages, page, totalCount);
    } catch (error) {
      this.logger.error('Error fetching bookings', error);
      throw new HttpException('Error fetching bookings', 500);
    }
  }

  // Fetch a booking by its ID
  async findOne(id: number): Promise<Booking> {
    try {
      const booking = await this.prisma.booking.findUnique({
        where: { id },
        include: {
          contactInfo: true,
          paymentInfo: true,
        },
      });

      if (!booking) {
        throw new NotFoundException(`Booking with ID ${id} not found`);
      }

      return booking;
    } catch (error) {
      this.logger.error('Error fetching booking', error);
      throw new HttpException('Error fetching booking', 500);
    }
  }

  // Update a booking
  async update(
    id: number,
    updateBookingDto: UpdateBookingDto,
  ): Promise<Booking> {
    try {
      const existingBooking = await this.prisma.booking.findUnique({
        where: { id },
      });

      if (!existingBooking) {
        throw new NotFoundException(`Booking with ID ${id} not found`);
      }

      const updatedBooking = await this.prisma.booking.update({
        where: { id },
        data: updateBookingDto,
      });

      return updatedBooking;
    } catch (error) {
      this.logger.error('Error updating booking', error);
      throw new HttpException('Error updating booking', 500);
    }
  }

  // Remove a booking
  async remove(id: number): Promise<Booking> {
    try {
      const booking = await this.prisma.booking.findUnique({
        where: { id },
      });

      if (!booking) {
        throw new NotFoundException(`Booking with ID ${id} not found`);
      }

      const deletedBooking = await this.prisma.booking.delete({
        where: { id },
      });

      return deletedBooking;
    } catch (error) {
      this.logger.error('Error removing booking', error);
      throw new HttpException('Error removing booking', 500);
    }
  }

  // Search bookings based on a query
  async search(
    query: string,
    page: number,
    limit: number,
  ): Promise<PaginatedBookingResult> {
    try {
      const skip = (page - 1) * limit;

      const [bookings, totalCount] = await this.prisma.booking.findMany({
        where: {
          OR: [
            { adult_guest: { contains: query, mode: 'insensitive' } },
            { children: { contains: query, mode: 'insensitive' } },
            { cost: { contains: query, mode: 'insensitive' } },
          ],
        },
        skip,
        take: limit,
        include: {
          contactInfo: true,
          paymentInfo: true,
        },
      });

      const totalPages = Math.ceil(totalCount / limit);

      return new PaginatedBookingResult(bookings, totalPages, page, totalCount);
    } catch (error) {
      this.logger.error('Error searching bookings', error);
      throw new HttpException('Error searching bookings', 500);
    }
  }
}
