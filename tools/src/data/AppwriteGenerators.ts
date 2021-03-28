class AppwriteGenerators {
    documentgenerators: AppwriteDocumentGenerator[]
    usergenerators: AppwriteGenericUserGenerator[]

    constructor(documentgenerators: AppwriteDocumentGenerator[],usergenerators: AppwriteGenericUserGenerator[]){
        this.documentgenerators = documentgenerators;
        this.usergenerators = usergenerators;
    }

    static decode(json: object): AppwriteGenerators {
        let config = Object.create(AppwriteGenerators.prototype);
        let appG: AppwriteGenerators = Object.assign(config, json);
        appG.documentgenerators = appG.documentgenerators?.map(e => AppwriteDocumentGenerator.decode(e))    
        appG.usergenerators = appG.usergenerators?.map(e => AppwriteGenericUserGenerator.decode(e))    
        return appG;
    }
}

class AppwriteGenericUserGenerator {
    count: number;
    emailPraefix: string;
    emailAppendix: String;
    passwordPraefix: string;
    namePraefix: string;

    constructor(count: number, emailPraefix: string, emailAppendix: String, passwordPraefix: string, namePraefix: string) {
        this.count = count;
        this.emailPraefix = emailPraefix;
        this.emailAppendix = emailAppendix;
        this.passwordPraefix = passwordPraefix;
        this.namePraefix = namePraefix;
    }

    static decode(json: object): AppwriteGenericUserGenerator {
        let config = Object.create(AppwriteGenericUserGenerator.prototype);
        return Object.assign(config, json);
    }
}

class AppwriteDocumentGenerator {
    collectionIndex: number;
    count: number;
    substituteStr: string;
    data: object;

    constructor(collectionIndex: number, count: number, substituteStr: string, data:object) {
        this.collectionIndex = collectionIndex;
        this.count = count;
        this.substituteStr = substituteStr;
        this.data = data;
    }

    static decode(json: object): AppwriteDocumentGenerator {
        let config = Object.create(AppwriteDocumentGenerator.prototype);
        return Object.assign(config, json);
    }
}


export {
    AppwriteGenerators, AppwriteGenericUserGenerator, AppwriteDocumentGenerator
}