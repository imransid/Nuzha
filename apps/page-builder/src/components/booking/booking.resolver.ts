import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { BookingService } from './booking.service';
import { CreateBookingDto, UpdateBookingDto } from '../dto/booking.dto';
import { Booking, StandardResponseBooking } from '../entities/booking.entity';
import { NotFoundException } from '@nestjs/common';
import { GraphQLException } from 'exceptions/graphql-exception';
import { PaginatedBookingResult } from '../dto/booking.dto';

@Resolver(() => Booking)
export class BookingResolver {
  constructor(private readonly bookingService: BookingService) {}

  @Mutation(() => StandardResponseBooking)
  async createBooking(
    @Args('createBookingDto') createBookingDto: CreateBookingDto,
  ) {
    try {
      let res = await this.bookingService.create(createBookingDto);
      return {
        message: 'Booking created successfully!',
        data: res,
      };
    } catch (error) {
      throw new GraphQLException(
        'Failed to create booking',
        'INTERNAL_SERVER_ERROR',
      );
    }
  }

  @Query(() => PaginatedBookingResult)
  async bookings(
    @Args('page', { type: () => Int, nullable: true, defaultValue: 1 })
    page: number,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number,
  ): Promise<PaginatedBookingResult> {
    try {
      return await this.bookingService.findAll(page, limit);
    } catch (error) {
      throw new GraphQLException(
        'Failed to fetch bookings',
        'INTERNAL_SERVER_ERROR',
      );
    }
  }

  @Query(() => Booking)
  async booking(@Args('id', { type: () => Int }) id: number): Promise<Booking> {
    try {
      return await this.bookingService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `Booking with ID ${id} not found`,
          'NOT_FOUND',
        );
      }
      throw new GraphQLException(
        'Failed to fetch booking',
        'INTERNAL_SERVER_ERROR',
      );
    }
  }

  @Mutation(() => Booking)
  async updateBooking(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateBookingInput') updateBookingInput: UpdateBookingDto,
  ): Promise<Booking> {
    try {
      return await this.bookingService.update(id, updateBookingInput);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `Booking with ID ${id} not found`,
          'NOT_FOUND',
        );
      }
      throw new GraphQLException(
        'Failed to update booking',
        'INTERNAL_SERVER_ERROR',
      );
    }
  }

  @Mutation(() => Booking)
  async removeBooking(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Booking> {
    try {
      return await this.bookingService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `Booking with ID ${id} not found`,
          'NOT_FOUND',
        );
      }
      throw new GraphQLException(
        'Failed to remove booking',
        'INTERNAL_SERVER_ERROR',
      );
    }
  }

  @Query(() => PaginatedBookingResult)
  async searchBookings(
    @Args('query', { type: () => String }) query: string,
    @Args('page', { type: () => Int, nullable: true, defaultValue: 1 })
    page: number,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number,
  ): Promise<PaginatedBookingResult> {
    try {
      return await this.bookingService.search(query, page, limit);
    } catch (error) {
      throw new GraphQLException(
        'Failed to search bookings',
        'INTERNAL_SERVER_ERROR',
      );
    }
  }
}
