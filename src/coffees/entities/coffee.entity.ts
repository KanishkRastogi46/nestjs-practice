import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Coffees {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public name: string;

    @Column()
    public brand: string;

    @Column('json', { nullable: true })
    public flavors: string[];
}