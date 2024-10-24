import 'dotenv/config';

import * as joi from 'joi';


const envSchema = joi.object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
}).unknown(true);


const { error, value } = envSchema.validate(process.env,);
if (error) throw new Error('Config validation issue');

export const env = {
    PORT: value.PORT,
    DATABASE_URL: value.DATABASE_URL,
}

