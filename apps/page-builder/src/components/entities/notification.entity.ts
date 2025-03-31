// src/notification/notification.model.ts
import { Field, ObjectType, Int } from '@nestjs/graphql';

@ObjectType()
export class Notification {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  userId: number;

  @Field()
  message: string;

  @Field()
  type: string;

  @Field()
  timestamp: Date;

  @Field()
  read: boolean;
}
