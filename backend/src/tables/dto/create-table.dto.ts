import { IsString, IsOptional, IsEnum } from 'class-validator';
import { TableStatus } from '../entities/table.entity';

export class CreateTableDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(TableStatus)
  status?: TableStatus;
}
