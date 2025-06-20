import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Coffees extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    brand: string;

    @Prop({default: 0})
    recommendations: number;

    @Prop({ type: [String], default: [] })
    flavours: string[];
}

export const CoffeeSchema = SchemaFactory.createForClass(Coffees);