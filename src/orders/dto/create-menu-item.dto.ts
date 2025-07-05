import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsArray,
} from "class-validator";

export class CreateMenuItemDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsString()
  categoryId: string;

  @IsNumber()
  preparationTime: number;

  @IsOptional()
  @IsString()
  image?: string;

  @IsBoolean()
  isAvailable: boolean;

  @IsOptional()
  @IsArray()
  allergens?: string[];

  @IsOptional()
  @IsArray()
  ingredients?: string[];
}
