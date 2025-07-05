import { IsString, IsNumber, IsBoolean, IsOptional } from "class-validator";

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsBoolean()
  isActive: boolean;

  @IsNumber()
  sortOrder: number;
}
