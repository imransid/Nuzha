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
  // async create(createBookingDto: CreateBookingDto): Promise<Booking> {
  async create(createBookingDto: CreateBookingDto): Promise<any> {
    try {
      const { paymentInfo, contactInfo, ...bookingData } = createBookingDto;

      // Create the booking
      const booking = await this.prisma.booking.create({
        data: {
          user_id: createBookingDto.user_id,
          propertyDataId: createBookingDto.propertyDataId,
          ...bookingData,
          contactInfo: {
            create: contactInfo?.map((info) => ({
              name: info.name,
              email: info.email,
              user_id: createBookingDto.user_id,
              phone: info.phone,
            })),
          },
          paymentInfo: {
            create: paymentInfo?.map((info) => ({
              user_id: createBookingDto.user_id,
              propertyId: createBookingDto.propertyDataId,
              paymentInfo: info.paymentInfo,
              transactionID: info.transactionID,
              cardholderName: info.cardholderName,
              cardName: info.cardName,
              experienceDate: info.experienceDate,
            })),
          },
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

      // Fetch bookings with pagination
      const bookings = await this.prisma.booking.findMany({
        skip,
        take: limit,
        include: {
          contactInfo: true,
          paymentInfo: true,
        },
      });

      // Ensure the paymentInfo bookingId is transformed to a string if needed
      const transformedBookings = bookings.map((booking) => ({
        ...booking,
        paymentInfo: booking.paymentInfo.map((payment) => ({
          ...payment,
          bookingId: String(payment.bookingId), // Ensure bookingId is a string
        })),
      }));

      // Get the total count of bookings
      const totalCount = await this.prisma.booking.count();

      const totalPages = Math.ceil(totalCount / limit);

      return new PaginatedBookingResult(
        transformedBookings,
        totalPages,
        page,
        totalCount,
      );
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

      const transformedBooking = {
        ...booking,
        paymentInfo: booking.paymentInfo.map((payment) => ({
          ...payment,
          bookingId: String(payment.bookingId), // Ensure bookingId is a string
        })),
      };

      return transformedBooking;
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

      // Construct the update data for the booking
      const updateData: any = { ...updateBookingDto };

      // If propertyDataId is provided, make sure it's set as a relation connect
      if (updateBookingDto.propertyDataId) {
        updateData.propertyData = {
          connect: { id: updateBookingDto.propertyDataId },
        };
        delete updateData.propertyDataId; // Prisma expects propertyData to be a relation, not just an ID
      }

      const updatedBooking = await this.prisma.booking.update({
        where: { id },
        data: updateData,
      });

      return updatedBooking;
    } catch (error) {
      this.logger.error('Error updating booking', error);
      throw new HttpException('Error updating booking', 500);
    }
  }

  // // Remove a booking
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

      // Fetch bookings with the given query
      const bookings = await this.prisma.booking.findMany({
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

      // Manually convert bookingId to string in paymentInfo
      const updatedBookings = bookings.map((booking) => ({
        ...booking,
        paymentInfo: booking.paymentInfo.map((payment) => ({
          ...payment,
          bookingId: String(payment.bookingId), // Ensure bookingId is a string
        })),
      }));

      // Fetch total count of bookings that match the query
      const totalCount = await this.prisma.booking.count({
        where: {
          OR: [
            { adult_guest: { contains: query, mode: 'insensitive' } },
            { children: { contains: query, mode: 'insensitive' } },
            { cost: { contains: query, mode: 'insensitive' } },
          ],
        },
      });

      const totalPages = Math.ceil(totalCount / limit);

      return new PaginatedBookingResult(
        updatedBookings,
        totalPages,
        page,
        totalCount,
      );
    } catch (error) {
      this.logger.error('Error searching bookings', error);
      throw new HttpException('Error searching bookings', 500);
    }
  }
}
