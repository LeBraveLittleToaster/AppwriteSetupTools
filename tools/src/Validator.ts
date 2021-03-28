import Ajv, { ErrorObject, ValidateFunction } from "ajv";
import { readFileSync } from "fs";
import {schema} from './AppwriteSchema'
import { AppwriteConfig } from "./data/AppwriteConfig";
const ajv = new Ajv();


function appwriteConfigFromValidJson(json: JSON): AppwriteConfig {
    return AppwriteConfig.decode(json);
}

export const validateAppwriteConfig = (filePath:string) :[boolean, ErrorObject<string, Record<string, any>, unknown>[] | null | undefined, AppwriteConfig | undefined] => {
    const file = readFileSync(filePath, "utf-8");
    const input = JSON.parse(file);
    const validatorF:ValidateFunction = ajv.compile(schema);
    const valid = validatorF(input);
    if(valid){
        return [true, undefined, appwriteConfigFromValidJson(input)]
    }else{
        return [false, validatorF.errors, undefined]
    }
    
}
