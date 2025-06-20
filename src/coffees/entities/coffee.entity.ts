import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Coffees extends Document {
    @Prop()
    name: string;

    @Prop()
    brand: string;

    @Prop([String])
    flavours: string[];
}

export const CoffeeSchema = SchemaFactory.createForClass(Coffees);