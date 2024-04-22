import {generatePassword} from "@/utils/helpers";
import {Employee} from "@/app/models";

export default async function userSeeder() {
    let EMAIL = process.env.SUPER_ADMIN_EMAIL;
    let PASSWORD = process.env.SUPER_ADMIN_PASSWORD;
    if (!EMAIL || !PASSWORD) {
        EMAIL = "admin@zent.vn";
        PASSWORD = "Zent@123.edu.vn";
        console.warn("---------------------------------------------------------------");
        console.warn('"Super Admin" is not configured. Using the default account:');
        console.warn(`Email: ${EMAIL}`);
        console.warn(`Password: ${PASSWORD}`);
        console.warn("---------------------------------------------------------------");
    }
    const superAdmin = {
        name: "Super Admin",
        permission : "unlimited",
        email: EMAIL,
        password: generatePassword(PASSWORD),
    };

    await Employee.findOneAndUpdate(
        {email: superAdmin.email},
        {$set: superAdmin},
        {upsert: true}
    );
}
