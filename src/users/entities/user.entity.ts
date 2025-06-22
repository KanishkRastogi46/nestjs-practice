import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Roles } from "../enums/roles.enum";
import { Permission, PermissionType } from "src/iam/authorization/permissions.type";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true, nullable: false })
    email: string

    @Column({ nullable: false })
    password: string

    @Column({ enum: Roles })
    role: Roles

    @Column({ type: 'json', enum: Permission })
    permissions: PermissionType[]
}
