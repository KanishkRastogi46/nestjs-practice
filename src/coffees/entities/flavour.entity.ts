import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { Coffees } from "./coffee.entity";

@Entity()
export class Flavours {
    @PrimaryGeneratedColumn()
    public id: number

    @Column()
    public name: string

    @ManyToMany(
        _  => Coffees,
        coffees => coffees.flavours,
        {onUpdate: 'CASCADE'}
    )
    public coffees: Coffees[]
}