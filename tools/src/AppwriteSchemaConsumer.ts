import { AppwriteService } from "./AppwriteService";
import { AppwriteCollection, AppwriteConfig, AppwriteUser } from "./data/AppwriteConfig";
import { AppwriteGenerators, AppwriteGenericUserGenerator } from "./data/AppwriteGenerators";


export async function consume(config: AppwriteConfig | undefined, generators: AppwriteGenerators | undefined, service: AppwriteService) {

    if (config !== undefined && config.eraseOldData) {
        console.log("Erasing old content...Users...")
        await service.deleteAllUsers();
        console.log("Erasing old content...collections...")
        await service.deleteAllCollections();
        console.log("Finished erasing")
    }

    let collectionIds: string[] = []

    if (config !== undefined && config.collections !== undefined) {
        let indexToColId = await Promise.all(config.collections.map(async (e: AppwriteCollection) => {
            return new Promise<[number, string]>((resolve, reject) => {
                service.createCollection(e.name, undefined, undefined, e.rules).then((col: any) => {
                    resolve([e.index, col.$id]);
                }).catch((error) => {
                    console.log(error)
                    reject()
                })
            })
        }));
        collectionIds = indexToColId.sort((a, b) => a[0] - b[0]).map(x => x[1]);

        if (generators !== undefined && generators?.documentgenerators !== undefined) {
            generators.documentgenerators.forEach((e) => {
                if ((collectionIds.length >= e.collectionIndex)) {
                    for (let i: number = 0; i < e.count; i++) {
                        let dataSubstituted = JSON.parse(
                            JSON.stringify(e.data).split(e.substituteStr).join("" + i).repeat(1));
                        service.createDocument(collectionIds[e.collectionIndex], dataSubstituted)
                            .then(() => console.log("Created doc " + i))
                            .catch((error) => console.log("Failed to create " + i + " " + error))
                    }
                } else {
                    console.error("Collectionindex not in creation! INDEX: " + e.collectionIndex)
                }
            })
        }
    }


    if (config !== undefined && config.users !== undefined) {
        config.users.forEach((e: AppwriteUser) => {
            service.createUser(e.email, e.password, e.name)
                .then(() => console.log("Created user " + e.name))
                .catch((error: any) => console.log("Creation failed for user " + e.name + " | Cause " + error))
        })
    }

    if (generators !== undefined && generators.usergenerators !== undefined) {
        generators.usergenerators.forEach((e: AppwriteGenericUserGenerator) => {
            for (let i: number = 0; i < e.count; i++) {
                let name: string = e.emailPraefix + i + "@" + e.emailAppendix;
                service.createUser(name, e.passwordPraefix + i, e.namePraefix + i)
                    .then((user: any) => {
                        console.log("Created user " + i + " | name = " + name)
                        service.activateUser(user["$id"])
                            .then(() => console.log("Successfull activated " + user["$id"]))
                            .catch((error) => console.log(error));
                    })
                    .catch((error: any) => console.log("Creation failed for user " + name + " | Cause " + error))
            }
        })
    }
    
}