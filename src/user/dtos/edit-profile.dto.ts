import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { User } from '../entities/user.entity';

export class EditProfileBody extends PickType(User, ['nickname']) {
  @IsOptional()
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    example: 'uploads/example.jpg',
  })
  image: any;
}

export class EditProfileResponse {
  @ApiProperty()
  nickname: string;

  @ApiProperty()
  imageUrl: string;
}
