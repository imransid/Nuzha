import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserType } from '../../prisma/user-type.enum';
import { RoleUSER } from '../../prisma/role.enum';

@ObjectType()
export class LoginAttempt {
  @Field()
  email: string;

  @Field()
  tryToAttemptTime: string;

  @Field()
  lockedTime: string;
}
@ObjectType()
export class Auth {
  @Field((type) => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  token: string;



  @Field(() => RoleUSER, { defaultValue: RoleUSER.USERS }) 
  role: keyof typeof RoleUSER;

}

@ObjectType()
export class GCode {
  @Field()
  success: boolean;

  @Field()
  message: string;
}
