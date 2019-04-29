import { Sensors } from "./Sensors";
import { Address } from "./address";

export interface User {
    first_name: string;
    last_name: string;
    email: string;
    age: number;
    password: string;
    confirmPassword? : string;
    address:Address,
    is_Admin? : boolean;
    created_at? : Date;
    updated_at? : Date;
    sensors?: Sensors;
}


