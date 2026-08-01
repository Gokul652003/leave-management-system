import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  department: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  role: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  managerId?: number | null;

  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'joinDate must be in YYYY-MM-DD format',
  })
  joinDate?: string | null;
}
