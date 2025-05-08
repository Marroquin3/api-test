import { IsOptional, IsString } from "class-validator";
import { PartialType } from '@nestjs/mapped-types';
import { PaginationDto } from "./pagination-global.dto";

export class SearchUserDto extends PartialType(PaginationDto) {
    @IsString()
    @IsOptional()
    userName?: string = "";

    @IsString()
    @IsOptional()
    role?: string = "";

    @IsString()
    @IsOptional()
    active?: string = "1";
}
