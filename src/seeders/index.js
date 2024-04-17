import {db} from "../configs";
import userSeeder from "./user.seeder";

async function seed() {
    try {
        await db.connect();
        console.log("Initializing data...");

        await userSeeder();

        console.log("Data has been initialized!");
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

seed();
