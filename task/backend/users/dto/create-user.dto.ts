import { IsEmail, IsNotEmpty } from 'class-validator'
export class CreateUserDto {
  @IsNotEmpty() name!: string
  @IsNotEmpty() username!: string
  @IsEmail() email!: string
}
