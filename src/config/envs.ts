import 'dotenv/config'
import * as joi from 'joi'


interface EnvVars   {
    PORT:number
    JWT_SECRET:string 
    DBNAME:string
    DBUSER:string   
    DBPASSWORD:string
    DBHOST:string
}

const envsSchema = joi.object({
    PORT:joi.number().required(),
    JWT_SECRET:joi.string().required(),
    DBNAME:joi.string().required(), 
    DBUSER:joi.string().required(),
    DBPASSWORD:joi.string().required(),
    DBHOST:joi.string().required()
}).unknown(true)


const {error,value} = envsSchema.validate(process.env)


if(error){
    throw new Error(`Config validation error${error.message}`)
}

const envVars: EnvVars= value

export const envs ={
    port: envVars.PORT,
    jwtSecret: envVars.JWT_SECRET,
    dbName: envVars.DBNAME, 
    dbUser: envVars.DBUSER,
    dbPassword: envVars.DBPASSWORD,
    dbHost: envVars.DBHOST
    
}