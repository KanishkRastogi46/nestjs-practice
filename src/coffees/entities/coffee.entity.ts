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

    @Column({default: 0})
    recommendations: number;

    @JoinTable()
    @ManyToMany(
        _ =>  Flavours,
        flavour => flavour.coffees,
        { 
            cascade: true,
            eager: true
        }
    )
    public flavours: Flavours[]
}