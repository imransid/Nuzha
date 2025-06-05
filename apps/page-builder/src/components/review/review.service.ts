import {
  Injectable,
  Logger,
  NotFoundException,
  HttpException,
} from '@nestjs/common';
import { PrismaPageBuilderService } from '../../../../../prisma/prisma-page-builder.service';
import {
  CreateReviewDto,
  PaginatedReviewResult,
  UpdateReviewDto,
} from '../dto/review.dto';
import { Review } from '../entities/review.entity';

@Injectable()
export class ReviewService {
  private logger = new Logger('ReviewService');

  constructor(private readonly prisma: PrismaPageBuilderService) {}

  // Create a new review
  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    try {
      const review = await this.prisma.review.create({
        data: {
          userId: createReviewDto.userId,
          propertyId: createReviewDto.propertyId,
          rating: createReviewDto.rating,
          comment: createReviewDto.comment,
        },
      });

      return review;
    } catch (error) {
      this.logger.error('Error creating review', error);
      throw new HttpException('Error creating review', 500);
    }
  }

  // Get all reviews with pagination
  async findAll(page: number, limit: number): Promise<PaginatedReviewResult> {
    try {
      const skip = (page - 1) * limit;

      const reviews = await this.prisma.review.findMany({
        skip,
        take: limit,
        include: {
          property: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      const totalCount = await this.prisma.review.count();
      const totalPages = Math.ceil(totalCount / limit);

      return new PaginatedReviewResult(reviews, totalPages, page, totalCount);
    } catch (error) {
      this.logger.error('Error fetching reviews', error);
      throw new HttpException('Error fetching reviews', 500);
    }
  }

  // Find a single review by ID
  async findOne(id: number): Promise<Review> {
    try {
      const review = await this.prisma.review.findUnique({
        where: { id },
        include: {
          property: true,
        },
      });

      if (!review) {
        throw new NotFoundException(`Review with ID ${id} not found`);
      }

      return review;
    } catch (error) {
      this.logger.error('Error fetching review', error);
      throw new HttpException('Error fetching review', 500);
    }
  }

  // Update a review by ID
  async update(id: number, updateReviewDto: UpdateReviewDto): Promise<Review> {
    try {
      const existingReview = await this.prisma.review.findUnique({
        where: { id },
      });

      if (!existingReview) {
        throw new NotFoundException(`Review with ID ${id} not found`);
      }

      const updatedReview = await this.prisma.review.update({
        where: { id },
        data: {
          ...updateReviewDto,
          updateAt: new Date(),
        },
      });

      return updatedReview;
    } catch (error) {
      this.logger.error('Error updating review', error);
      throw new HttpException('Error updating review', 500);
    }
  }

  // Delete a review
  async remove(id: number): Promise<Review> {
    try {
      const existingReview = await this.prisma.review.findUnique({
        where: { id },
      });

      if (!existingReview) {
        throw new NotFoundException(`Review with ID ${id} not found`);
      }

      return await this.prisma.review.delete({ where: { id } });
    } catch (error) {
      this.logger.error('Error deleting review', error);
      throw new HttpException('Error deleting review', 500);
    }
  }

  // Search reviews by keyword
  async search(
    query: string,
    page: number,
    limit: number,
  ): Promise<PaginatedReviewResult> {
    try {
      const skip = (page - 1) * limit;

      const reviews = await this.prisma.review.findMany({
        where: {
          OR: [
            { rating: { contains: query, mode: 'insensitive' } },
            { comment: { contains: query, mode: 'insensitive' } },
          ],
        },
        skip,
        take: limit,
        include: {
          property: true,
        },
      });

      const totalCount = await this.prisma.review.count({
        where: {
          OR: [
            { rating: { contains: query, mode: 'insensitive' } },
            { comment: { contains: query, mode: 'insensitive' } },
          ],
        },
      });

      const totalPages = Math.ceil(totalCount / limit);

      return new PaginatedReviewResult(reviews, totalPages, page, totalCount);
    } catch (error) {
      this.logger.error('Error searching reviews', error);
      throw new HttpException('Error searching reviews', 500);
    }
  }
}
