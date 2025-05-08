import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import * as bcrypt from 'bcrypt'; 
import { Role } from 'src/roles/entities/role.entity';


@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userName: string;

    @Column()
    password: string;

    @ManyToOne(() => Role)
    role: Role;

    @RelationId((user: User) => user.role)
    roleId: number;

    @Column({ default: true })
    active: boolean;

    hashPassword(): void {
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
    }

    checkPassword(password: string): boolean {
    return bcrypt.compareSync(password, this.password);
    }
}
