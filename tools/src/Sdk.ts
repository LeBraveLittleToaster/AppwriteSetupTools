class Sdk{
    apiKey: string;
    url: string;
    
    constructor(apiKey: string, url:string = "localhost", ){
        this.apiKey = apiKey;
        this.url = url;
    }

    
}