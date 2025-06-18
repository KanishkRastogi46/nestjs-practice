import { registerAs } from "@nestjs/config";

export default registerAs('coffees', () => ({
    name: 'Nescafe',
    description: 'This is a coffee service configuration',
}))