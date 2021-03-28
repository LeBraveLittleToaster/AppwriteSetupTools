import Ajv, { ErrorObject, ValidateFunction } from "ajv";
import { readFileSync } from "fs";
import { join } from "node:path";
import {schema} from './AppwriteSchema'
import { AppwriteConfig } from "./data/AppwriteConfig";
import { AppwriteGenerators } from "./data/AppwriteGenerators";
const ajv = new Ajv();


function appwriteConfigFromValidJson(json: JSON): AppwriteConfig {
    return AppwriteConfig.decode(json);
}

function appwriteGeneratorsFromValidJson(input: JSON): AppwriteGenerators {
    return AppwriteGenerators.decode(input);
}

export const validateAppwriteConfig = (filePath:string) :[boolean, ErrorObject<string, Record<string, any>, unknown>[] | null | undefined, AppwriteConfig | undefined, AppwriteGenerators | undefined] => {
    const file = readFileSync(filePath, "utf-8");
    const input = JSON.parse(file);
    const validatorF:ValidateFunction = ajv.compile(schema);
    const valid = validatorF(input);
    if(valid){
        return [true, undefined, appwriteConfigFromValidJson(input), appwriteGeneratorsFromValidJson(input)]
    }else{
        return [false, validatorF.errors, undefined, undefined]
    }
    
}


