import { IsNotEmpty, IsNumber } from 'class-validator'
export class CreatePostDto {
  @IsNumber() userId!: number
  @IsNotEmpty() title!: string
  body?: string
}
