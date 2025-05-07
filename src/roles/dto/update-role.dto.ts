import { IsNotEmpty, IsString, isString } from "class-validator";

export class UpdateRoleDto{
    @IsNotEmpty()
    @IsString()
    name: string
}
