import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Flavours } from "./flavour.entity";

@Entity()
export class Coffees {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({nullable: false})
    public name: string;

    @Column({nullable: false})
    public brand: string;

    @JoinTable()
    @ManyToMany(
        type =>  Flavours,
        flavour => flavour.coffees,
        { cascade: true }
    )
    public flavours: Flavours[]
}