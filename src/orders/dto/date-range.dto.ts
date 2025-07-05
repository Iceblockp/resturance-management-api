import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEnum, IsOptional } from "class-validator";

export enum DateRangePreset {
  TODAY = "today",
  YESTERDAY = "yesterday",
  WEEK = "week",
  MONTH = "month",
  ALL = "all",
}

export class DateRangeDto {
  @ApiProperty({
    enum: DateRangePreset,
    example: DateRangePreset.WEEK,
    required: false,
  })
  @IsEnum(DateRangePreset)
  @IsOptional()
  preset?: DateRangePreset;

  @ApiProperty({ example: "2023-01-01T00:00:00Z", required: false })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({ example: "2023-01-31T23:59:59Z", required: false })
  @IsDateString()
  @IsOptional()
  endDate?: string;
}
