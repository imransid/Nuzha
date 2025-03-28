import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';
import { Category, CategoryPaginatedResult } from '../entities/category.entity';
import { NotFoundException } from '@nestjs/common';
import { GraphQLException } from 'exceptions/graphql-exception';
import { StandardResponseCategory } from '../entities/category.entity';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  // Create a new category
  @Mutation(() => StandardResponseCategory)
  async createCategory(
    @Args('createCategoryDto') createCategoryDto: CreateCategoryDto,
  ) {
    try {
      const res = await this.categoryService.create(createCategoryDto);
      return {
        message: 'Category created successfully!',
        data: res,
      };
    } catch (error) {
      throw new GraphQLException(
        'Failed to create category',
        'INTERNAL_SERVER_ERROR',
      );
    }
  }

  // Fetch paginated list of categories
  @Query(() => CategoryPaginatedResult)
  async categories(
    @Args('page', { type: () => Int, nullable: true, defaultValue: 1 })
    page: number,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number,
  ): Promise<CategoryPaginatedResult> {
    try {
      return await this.categoryService.findAll(page, limit);
    } catch (error) {
      throw new GraphQLException(
        'Failed to fetch categories',
        'INTERNAL_SERVER_ERROR',
      );
    }
  }

  // Get a single category by ID
  @Query(() => Category)
  async category(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Category> {
    try {
      return await this.categoryService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `Category with ID ${id} not found`,
          'NOT_FOUND',
        );
      }
      throw new GraphQLException(
        'Failed to fetch category',
        'INTERNAL_SERVER_ERROR',
      );
    }
  }

  // Update an existing category
  @Mutation(() => Category)
  async updateCategory(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateCategoryInput') updateCategoryInput: UpdateCategoryDto,
  ): Promise<Category> {
    try {
      return await this.categoryService.update(id, updateCategoryInput);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `Category with ID ${id} not found`,
          'NOT_FOUND',
        );
      }
      throw new GraphQLException(
        'Failed to update category',
        'INTERNAL_SERVER_ERROR',
      );
    }
  }

  // Delete a category
  @Mutation(() => Category)
  async removeCategory(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Category> {
    try {
      return await this.categoryService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `Category with ID ${id} not found`,
          'NOT_FOUND',
        );
      }
      throw new GraphQLException(
        'Failed to remove category',
        'INTERNAL_SERVER_ERROR',
      );
    }
  }
}
