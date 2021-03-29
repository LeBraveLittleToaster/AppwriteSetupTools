import { getCombinedModifierFlags } from "typescript";
import { AppwriteService } from "./AppwriteService";
import { AppwriteCollection, AppwriteConfig, AppwriteUser } from "./data/AppwriteConfig";
import { AppwriteDocumentGenerator, AppwriteGenerators, AppwriteGenericUserGenerator } from "./data/AppwriteGenerators";

const sleepMillis:number = 10

const sleep = (milliseconds:number) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, milliseconds)

async function generatingUsers(usergenerators: AppwriteGenericUserGenerator[], service: AppwriteService) {
    usergenerators.forEach((e: AppwriteGenericUserGenerator) => {
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
                sleep(sleepMillis)
        }
    })
}

async function createUsers(users: AppwriteUser[], service: AppwriteService) {
    users.forEach((e: AppwriteUser) => {
        service.createUser(e.email, e.password, e.name)
            .then(() => console.log("Created user " + e.name))
            .catch((error: any) => console.log("Creation failed for user " + e.name + " | Cause " + error))
    })
}

async function generateDocuments(collectionIds: string[], documentgenerators: AppwriteDocumentGenerator[], service: AppwriteService) {
    documentgenerators.forEach((e) => {
        if ((collectionIds.length >= e.collectionIndex)) {
            for (let i: number = 0; i < e.count; i++) {
                let dataSubstituted = JSON.parse(
                    JSON.stringify(e.data).split(e.substituteStr).join("" + i).repeat(1));
                service.createDocument(collectionIds[e.collectionIndex], dataSubstituted)
                    .then(() => console.log("Created doc " + i))
                    .catch((error) => console.log("Failed to create " + i + " " + error));
                sleep(sleepMillis);
            }
        } else {
            console.error("Collectionindex not in creation! INDEX: " + e.collectionIndex)
        }
    })
}

async function createCollections(collections: AppwriteCollection[], service: AppwriteService): Promise<string[]> {
    let indexToColId: [number, string][] = await Promise.all(collections.map(async (e: AppwriteCollection) => {
        return new Promise<[number, string]>((resolve, reject) => {
            service.createCollection(e.name, undefined, undefined, e.rules).then((col: any) => {
                resolve([e.index, col.$id]);
            }).catch((error) => {
                console.log(error)
                reject()
            })
        })
    }));
    return new Promise<string[]>((resolve, reject) => {
        resolve(indexToColId.sort((a, b) => a[0] - b[0]).map(x => x[1]))
    });
}

async function eraseContent(service: AppwriteService) {
    await service.deleteAllUsers();
    await service.deleteAllCollections();
}

export async function consume(config: AppwriteConfig | undefined, generators: AppwriteGenerators | undefined, service: AppwriteService) {
    let collectionsIds = undefined;
    if (config !== undefined) {
        if (config.eraseOldData) {
            await eraseContent(service);
        }
        if (config.collections !== undefined) {
            console.log("Creating collections...")
            collectionsIds = await createCollections(config.collections, service);
        }
        if (config.users !== undefined) {
            console.log("Creating users collections...")
            createUsers(config.users, service);
        }
        if (collectionsIds !== undefined && generators !== undefined && generators.documentgenerators !== undefined) {
            console.log("Generating documents...")
            generateDocuments(collectionsIds, generators.documentgenerators, service)
        }
        if (generators !== undefined && generators.usergenerators !== undefined) {
            console.log("Generating users...")
            generatingUsers(generators.usergenerators, service);
        }
    }
}