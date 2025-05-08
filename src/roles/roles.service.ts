import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Role) private readonly rolRepository: Repository <Role>,
    ){}

    async create (createRoleDto : CreateRoleDto) {
        try{
            const role = this.rolRepository.create(createRoleDto);
            await this.rolRepository.save(role);

            return{
                ok: true,
                message: "Accion realizada correctamente",
                status: 201,
            };
        }catch(error){
            return{ok: false, mesagge: "Ocurrio un error", status: 500,}       }
    }
    
    async findAll() {
        try {
            const roles = await this.rolRepository.find({where: {isActive: true}});

            if(roles.length>0){
                return {ok: true, roles, status: 200}
            }

            return {ok: false, message: "Ah ocurrido un error", status: 404} 
        } catch (error) {
            return {
                ok: false, message: "Ocurrio un error al obtener los roles",
                status: 500
            }
            
        }
    }

    async findOne(id: number){
        try {
            const rol = await this.rolRepository.findOne({where: {id}});
            if(!rol){
                return {ok: false, message: "Rol no encontrado", status: 401};
            }
            return {ok: true, rol, status:500}
        } catch (error) {
            return {ok: false, message: "Ocurrio un error", status: 500};
        }
    }

    async update(id: number, updateRoleDto: UpdateRoleDto) {
        try {
            const rol = await this.rolRepository.findOne({ where: { id } });
            if (!rol) {
                return { ok: false, message: "Rol no encontrado", status: 404 };
            }
            rol.name = updateRoleDto.name;
            await this.rolRepository.save(rol);
            return { ok: true, message: "Rol actualizado correctamente", status: 200 };
        } catch (error) {
            return { ok: false, message: "Ocurrió un error", status: 500 };
        }
    }
    
    async remove(id: number) {
        try {
            const rol = await this.rolRepository.findOne({ where: { id } });
    
            if (!rol) {
                return {
                    ok: false,
                    message: 'Rol no encontrado',
                    status: 404
                };
            }
    
            rol.isActive = false;
            await this.rolRepository.save(rol);
    
            return {
                ok: true,
                message: 'Rol eliminado correctamente',
                status: 200
            };
        } catch (error) {
            return {
                ok: false,
                message: 'Ocurrió un error al eliminar',
                status: 500
            };
        }
    }
    
}


