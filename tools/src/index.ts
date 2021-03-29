import { ErrorObject } from "ajv";
import { consume } from "./AppwriteSchemaConsumer";
import { AppwriteService } from "./AppwriteService";
import { AppwriteCollection, AppwriteConfig, AppwriteUser } from "./data/AppwriteConfig";
import { AppwriteGenerators } from "./data/AppwriteGenerators";
import { validateAppwriteConfig } from "./Validator";

const args = process.argv.slice(2);
if(args.length !== 3){
    console.log("Expected: [filepath, endpoint, projectId]")
    process.exit(1)
}
if(process.env.APPWRITE_API_KEY === undefined){
    console.log("APPWRITE_API_KEY environment variable not set")
    process.exit(1)
}

const [valid, errors, config, generators] : [boolean, ErrorObject<string, Record<string, any>, unknown>[] | null | undefined, AppwriteConfig | undefined, AppwriteGenerators|undefined] = validateAppwriteConfig(args[0])

if(valid){
    let service:AppwriteService = new AppwriteService(args[1], args[2], process.env.APPWRITE_API_KEY)
    consume(config, generators, service)
    
}else{
    console.log(errors)
}