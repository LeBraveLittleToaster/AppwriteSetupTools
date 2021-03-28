import { ErrorObject } from "ajv";
import { AppwriteCollection, AppwriteConfig, AppwriteUser } from "./data/AppwriteConfig";
import { validateAppwriteConfig } from "./Validator";

const args = process.argv.slice(2);
if(args.length !== 1){
    console.log("Only filepath allowed")
    process.exit(1)
}

const [valid, errors, config] : [boolean, ErrorObject<string, Record<string, any>, unknown>[] | null | undefined, AppwriteConfig | undefined] = validateAppwriteConfig(args[0])

if(valid){
    console.log(config)
}else{
    console.log(errors)
}