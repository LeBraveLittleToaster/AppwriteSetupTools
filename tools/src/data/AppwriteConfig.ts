class AppwriteConfig{
    projectName: string;
    collections: AppwriteCollection[];
    users: AppwriteUser[];
    constructor(projectName:string, collections:AppwriteCollection[], users:AppwriteUser[]){
        this.projectName = projectName;
        this.collections = collections;
        this.users = users;
    }

    static decode(json:object) :AppwriteConfig {
        let config = Object.create(AppwriteConfig.prototype);
        let appC:AppwriteConfig = Object.assign(config, json);
        appC.collections = appC.collections?.map(e => AppwriteCollection.decode(e))
        appC.users = appC.users?.map(e => AppwriteUser.decode(e))
        return appC;
    }
}

class AppwriteCollection{
    rules: AppwriteRules[];
    name: string;
    constructor(name:string, rules:AppwriteRules[]){
        this.name = name;
        this.rules = rules;
    }
    static decode(json:object) : AppwriteCollection {
        let config = Object.create(AppwriteCollection.prototype);
        let appCol:AppwriteCollection = Object.assign(config, json);
        appCol.rules = appCol.rules?.map(e => AppwriteRules.decode(e))
        return appCol;
    }
}

class AppwriteRules{
    label: string;
    key: string;
    type: string;
    defaultValue: string;
    required: boolean;
    array: boolean;
    constructor(label:string, key:string, type:string, defaultValue:string, required: boolean, array:boolean){
        this.label = label;
        this.key = key;
        this.type = type;
        this.defaultValue = defaultValue;
        this.required = required
        this.array = array;
    }

    static decode(json:object) : AppwriteRules {
        let config = Object.create(AppwriteRules.prototype);
        return Object.assign(config, json);
    }    
}

class AppwriteUser{
    email:string;
    password: string;
    name:string;

    constructor(email:string, password:string, name:string){
        this.email = email;
        this.password = password;
        this.name = name;
    }
    static decode(json:object) : AppwriteUser {
        let config = Object.create(AppwriteUser.prototype);
        return Object.assign(config, json);
    }
}

export {
    AppwriteCollection, AppwriteConfig, AppwriteRules, AppwriteUser
}