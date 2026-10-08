import { IsString, Length, IsOptional, IsDateString, MaxLength } from 'class-validator';
export class CreateProfileDto {
@IsString()
@Length(2, 120)
fullName: string = "";

@IsOptional()
@IsDateString()
birthDate?: string; // ISO 8601 (ex: "1990-01-15T00:00:00Z")

@IsOptional()
@MaxLength(500)
avatarUrl?: string; // URL da imagem do avatar
}