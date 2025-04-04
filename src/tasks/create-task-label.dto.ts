import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTaskLabelDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;
}
