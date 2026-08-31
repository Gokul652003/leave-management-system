import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class RejectLeaveRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  comments: string;
}
