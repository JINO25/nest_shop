/* eslint-disable prettier/prettier */

import { registerAs } from "@nestjs/config";
import * as path from "path";

export default registerAs('database', () => ({
    type: process.env.DATABASE_TYPE,
    host: process.env.HOST_DB,
    port: process.env.PORT_DB || 5432,
    username: process.env.USER_DB,
    password: process.env.PASS_DB,
    database: process.env.DATABASE,
    url: process.env.URL_DB,
    entities: [path.join(__dirname, '..') + '/**/*.entity{.ts,.js}'],
    synchronize: process.env.DATABASE_SYNC === 'true' ? true : false,

}))