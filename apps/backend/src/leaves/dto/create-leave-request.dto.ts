import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateLeaveRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  leaveTypeCode: string;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'startDate must be in YYYY-MM-DD format',
  })
  startDate: string;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'endDate must be in YYYY-MM-DD format',
  })
  endDate: string;

  @IsOptional()
  @IsBoolean()
  halfDay?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  reason?: string | null;
}
