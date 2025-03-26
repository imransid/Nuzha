import { ObjectType, Field } from '@nestjs/graphql';
import { Property } from './property.entity';

@ObjectType()
export class StandardResponseProperty {
  @Field()
  data: Property;

  @Field({ nullable: true })
  message?: string;
}
