import { StringInput } from '@/common/decorators/input-property.decorator';
import { User } from '@/user/entities/user.entity';
import { PickType } from '@nestjs/swagger';

export class SignUpBody extends PickType(User, ['email', 'password']) {
  @StringInput({ example: '123' })
  passwordConfirm: string;
}
