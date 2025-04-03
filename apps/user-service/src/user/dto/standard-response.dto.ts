import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@ObjectType()
export class StandardResponse {
  @Field()
  data: User | null;

  @Field({ nullable: true })
  message?: string;
}
