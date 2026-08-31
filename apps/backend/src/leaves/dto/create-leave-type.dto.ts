import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateLeaveTypeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  @Matches(/^[A-Z0-9_-]+$/, {
    message: 'code must contain only uppercase letters, numbers, - or _',
  })
  code: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  annualQuota?: number | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxDaysPerRequest?: number | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  requiresDocumentationOverDays?: number | null;
}
