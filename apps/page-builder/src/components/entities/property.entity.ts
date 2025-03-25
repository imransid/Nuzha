import { ObjectType, Field, Int } from '@nestjs/graphql';
import { pathFinderMiddleware } from 'middleware/pathFinderMiddleware';
import { GraphQLJSONObject } from 'graphql-type-json';

@ObjectType()
export class Property {
  @Field(() => Int)
  id: number;

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

  @Field(() => [PropertyPhotos])
  propertyImage: PropertyPhotos[]; // Array of image URLs

  @Field()
  isActive: boolean;

  @Field()
  addedBy: string; // User ID

  @Field()
  propertyType: string;

  @Field(() => GraphQLJSONObject, { nullable: true }) // ✅ Fix type
  others?: any;
}

@ObjectType()
export class PropertyPhotos {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  propertyId: number;

  @Field({ middleware: [pathFinderMiddleware] })
  url: string;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  updateAt?: Date;
}
