import { ObjectType, Field } from '@nestjs/graphql';
import { PropertyData } from './property.entity';

@ObjectType()
export class StandardResponseProperty {
  @Field()
  data: PropertyData;

  @Field({ nullable: true })
  message?: string;
}
