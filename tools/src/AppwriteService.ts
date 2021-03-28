import { AppwriteRules } from "./data/AppwriteConfig";

const sdk = require('node-appwrite');

export class AppwriteService{
    usersSdk: any;
    databaseSdk: any;
    
    constructor(endpoint:string, projectId:string, apiKey: string){
        let client = new sdk.Client();
        client
            .setEndpoint(endpoint)
            .setProject(projectId)
            .setKey(apiKey)
            .setSelfSigned();
        this.usersSdk = new sdk.Users(client)
        this.databaseSdk = new sdk.Database(client)
        
    }

    createDocument(collectionId:string, data:any, read:string[]=["*"], write:string[] = ["*"]) : Promise<object>{
        return this.databaseSdk.createDocument(collectionId, data, read, write)
    }

    async deleteAllCollections() {
        let response = await this.databaseSdk.listCollections(undefined, 100);
        await Promise.all(response.collections.map((e:any) => this.databaseSdk.deleteCollection(e.$id)))
        if(response.sum >= 100){
            console.log("Collections left " + (response.sum - 100))
            this.deleteAllCollections();
        }
        console.log("Finished deleting collections")
    }

    createUser(email:string, password:string, name:string) : Promise<object>{
        return this.usersSdk.create(email, password, name);
    }

    async deleteAllUsers() : Promise<void> {
        let response = await this.usersSdk.list(undefined, 100);
        await Promise.all(response.users.map((e:any) => this.usersSdk.deleteUser(e.$id)))
        if(response.sum >= 100){
            console.log("Users left " + (response.sum - 100))
            this.deleteAllUsers();
        }
        console.log("Finished deleting users")
    }

    activateUser(id: string) :Promise<object> {
        return this.usersSdk.updateStatus(id, 1);
    }

    createCollection(name:string, read:string[] = ["*"], write:string[] = ["*"] , rules:AppwriteRules[]) : Promise<object>{
        console.log(Array.isArray(read))
        console.log(typeof write)
        console.log(JSON.stringify(rules))
        return this.databaseSdk.createCollection(name, read, write, rules.map(e => e.toJsonObject()));
    }
}