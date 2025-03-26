import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PropertyService } from './property.service';
import { CreatePropertyDto, UpdatePropertyDto } from '../dto/property.dto';
import {
  PropertyData,
  PropertyPaginatedResult,
} from '../entities/property.entity';
import { NotFoundException } from '@nestjs/common';
import { GraphQLException } from 'exceptions/graphql-exception';
import { StandardResponseProperty } from '../entities/standard-response-entity';

@Resolver(() => PropertyData)
export class PropertyResolver {
  constructor(private readonly propertyService: PropertyService) {}

  @Mutation(() => StandardResponseProperty)
  async createProperty(
    @Args('createPropertyDto') createPropertyDto: CreatePropertyDto,
  ) {
    try {
      let res = await this.propertyService.create(createPropertyDto);
      return {
        message: 'Property added successfully!',
        data: res,
      };
    } catch (error) {
      throw new GraphQLException(
        'Failed to create property',
        'INTERNAL_SERVER_ERROR',
      );
    }
  }

  @Query(() => PropertyPaginatedResult)
  async properties(
    @Args('page', { type: () => Int, nullable: true, defaultValue: 1 })
    page: number,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number,
  ): Promise<PropertyPaginatedResult> {
    try {
      return await this.propertyService.findAll(page, limit);
    } catch (error) {
      throw new GraphQLException(
        'Failed to fetch properties',
        'INTERNAL_SERVER_ERROR',
      );
    }
  }

  @Query(() => PropertyData)
  async property(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<PropertyData> {
    try {
      return await this.propertyService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `Property with ID ${id} not found`,
          'NOT_FOUND',
        );
      }
      throw new GraphQLException(
        'Failed to fetch property',
        'INTERNAL_SERVER_ERROR',
      );
    }
  }

  @Mutation(() => PropertyData)
  async updateProperty(
    @Args('id', { type: () => Int }) id: number,
    @Args('updatePropertyInput') updatePropertyInput: UpdatePropertyDto,
  ): Promise<PropertyData> {
    try {
      return await this.propertyService.update(id, updatePropertyInput);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `Property with ID ${id} not found`,
          'NOT_FOUND',
        );
      }
      throw new GraphQLException(
        'Failed to update property',
        'INTERNAL_SERVER_ERROR',
      );
    }
  }

  @Mutation(() => PropertyData)
  async removeProperty(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<PropertyData> {
    try {
      return await this.propertyService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `Property with ID ${id} not found`,
          'NOT_FOUND',
        );
      }
      throw new GraphQLException(
        'Failed to remove property',
        'INTERNAL_SERVER_ERROR',
      );
    }
  }

  @Query(() => PropertyPaginatedResult)
  async searchProperties(
    @Args('query', { type: () => String }) query: string,
    @Args('page', { type: () => Int, nullable: true, defaultValue: 1 })
    page: number,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number,
  ): Promise<PropertyPaginatedResult> {
    try {
      return await this.propertyService.search(query, page, limit);
    } catch (error) {
      throw new GraphQLException(
        'Failed to search properties',
        'INTERNAL_SERVER_ERROR',
      );
    }
  }
}
