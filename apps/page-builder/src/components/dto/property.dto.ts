import {
  InputType,
  Field,
  Int,
  PartialType,
  ObjectType,
} from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { Property } from '../entities/property.entity';
import { Upload } from '../../../../../scalars/upload.scalar';
import { pathFinderMiddlewareForArrayOfString } from 'middleware/pathFinderMiddleware';

@InputType()
export class CreatePropertyDto {
  @Field()
  title: string;

  @Field(() => Int)
  price: string;

  @Field()
  category: string;

  @Field()
  description: string;

  @Field(() => [String])
  facility: string[];

  @Field()
  location: string;

  @Field()
  longitudeCode: string;

  @Field()
  latitudeCode: string;

  @Field()
  country: string;

  @Field()
  street: string;

  @Field()
  city: string;

  @Field()
  postcode: string;

  @Field(() => [Upload], {
    nullable: true,
    description: 'Input for the attachment files.',
    middleware: [pathFinderMiddlewareForArrayOfString],
  })
  photosPropertyImage?: Upload[];

  @Field()
  isActive: boolean;

  @Field()
  addedBy: string; // User ID

  @Field()
  propertyType: string;

  @Field(() => [GraphQLJSONObject], {
    nullable: true,
    description: 'Additional structured property details',
  })
  others?: any; // Array of objects for extra metadata
}

@InputType()
export class UpdatePropertyDto extends PartialType(CreatePropertyDto) {
  @Field(() => Int)
  id: number;
}

@ObjectType()
export class PropertyPaginatedResult {
  @Field(() => [Property], { defaultValue: [] }) // Ensuring it's always an array
  properties: Property[] = [];

  @Field(() => Int)
  totalPages: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  totalCount: number;

  constructor(
    properties: Property[],
    totalPages: number,
    currentPage: number,
    totalCount: number,
  ) {
    this.properties = properties ?? [];
    this.totalPages = totalPages;
    this.currentPage = currentPage;
    this.totalCount = totalCount;
  }
}
