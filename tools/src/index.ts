import { ErrorObject } from "ajv";
import { AppwriteCollection, AppwriteConfig, AppwriteUser } from "./data/AppwriteConfig";
import { validateAppwriteConfig } from "./Validator";

const args = process.argv.slice(2);
if(args.length !== 1){
    console.log("Expected: [filepath]")
    process.exit(1)
}
if(process.env.APPWRITE_API_KEY === undefined){
    console.log("APPWRITE_API_KEY environment variable not set")
    process.exit(1)
}

const [valid, errors, config] : [boolean, ErrorObject<string, Record<string, any>, unknown>[] | null | undefined, AppwriteConfig | undefined] = validateAppwriteConfig(args[0])

if(valid){
    console.log(config)
    let sdk:Sdk = new Sdk(process.env.APPWRITE_API_KEY)
}else{
    console.log(errors)
}