import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ReviewService } from './review.service';
import {
  CreateReviewDto,
  UpdateReviewDto,
  PaginatedReviewResult,
} from '../dto/review.dto';
import { Review, StandardResponseReview } from '../entities/review.entity';
import { NotFoundException } from '@nestjs/common';
import { GraphQLException } from 'exceptions/graphql-exception';

@Resolver(() => Review)
export class ReviewResolver {
  constructor(private readonly reviewService: ReviewService) {}

  @Mutation(() => StandardResponseReview)
  async createReview(
    @Args('createReviewDto') createReviewDto: CreateReviewDto,
  ): Promise<StandardResponseReview> {
    try {
      const res = await this.reviewService.create(createReviewDto);
      return {
        message: 'Review created successfully!',
        data: res,
      };
    } catch (error) {
      throw new GraphQLException(
        'Failed to create review',
        'INTERNAL_SERVER_ERROR',
      );
    }
  }

  @Query(() => PaginatedReviewResult)
  async reviews(
    @Args('page', { type: () => Int, nullable: true, defaultValue: 1 })
    page: number,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number,
  ): Promise<PaginatedReviewResult> {
    try {
      return await this.reviewService.findAll(page, limit);
    } catch (error) {
      throw new GraphQLException(
        'Failed to fetch reviews',
        'INTERNAL_SERVER_ERROR',
      );
    }
  }

  @Query(() => Review)
  async review(@Args('id', { type: () => Int }) id: number): Promise<Review> {
    try {
      return await this.reviewService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `Review with ID ${id} not found`,
          'NOT_FOUND',
        );
      }
      throw new GraphQLException(
        'Failed to fetch review',
        'INTERNAL_SERVER_ERROR',
      );
    }
  }

  @Mutation(() => Review)
  async updateReview(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateReviewDto') updateReviewDto: UpdateReviewDto,
  ): Promise<Review> {
    try {
      return await this.reviewService.update(id, updateReviewDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `Review with ID ${id} not found`,
          'NOT_FOUND',
        );
      }
      throw new GraphQLException(
        'Failed to update review',
        'INTERNAL_SERVER_ERROR',
      );
    }
  }

  @Mutation(() => Review)
  async removeReview(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Review> {
    try {
      return await this.reviewService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `Review with ID ${id} not found`,
          'NOT_FOUND',
        );
      }
      throw new GraphQLException(
        'Failed to remove review',
        'INTERNAL_SERVER_ERROR',
      );
    }
  }

  @Query(() => PaginatedReviewResult)
  async searchReviews(
    @Args('query', { type: () => String }) query: string,
    @Args('page', { type: () => Int, nullable: true, defaultValue: 1 })
    page: number,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number,
  ): Promise<PaginatedReviewResult> {
    try {
      return await this.reviewService.search(query, page, limit);
    } catch (error) {
      throw new GraphQLException(
        'Failed to search reviews',
        'INTERNAL_SERVER_ERROR',
      );
    }
  }
}
