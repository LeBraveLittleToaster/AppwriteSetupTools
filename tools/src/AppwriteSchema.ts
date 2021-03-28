import { Schema } from "ajv";

export const schema: Schema = {
    type: "object",
    additionalProperties: false,
    required: ["projectName"],
    properties: {
        projectName: { type: "string" },
        eraseOldData: {type: "boolean"},
        documentgenerators: {
            type: "array",
            items: {
                type: "object",
                additionalProperties: false,
                required: ["collectionIndex", "count", "substituteStr", "data"],
                properties: {
                    collectionIndex : {type:"number"},
                    count: {type:"number"},
                    substituteStr: {type: "string"},
                    data: {type: "object"}
                }
            }
        },
        usergenerators: {
            type: "array",
            items: {
                type: "object",
                additionalProperties: false,
                required: ["count", "emailPraefix", "emailAppendix", "passwordPraefix", "namePraefix"],
                properties: {
                    count: { type: "number" },
                    emailPraefix: { type: "string" },
                    emailAppendix: { type: "string" },
                    passwordPraefix: { type: "string" },
                    namePraefix: { type: "string" }
                }
            }
        },
        users: {
            type: "array",
            items: {
                type: "object",
                additionalProperties: false,
                required: ["email", "password", "name"],
                properties: {
                    email: { type: "string" },
                    password: { type: "string" },
                    name: { type: "string" }
                }
            }
        },
        collections: {
            type: "array",
            items: {
                type: "object",
                additionalProperties: false,
                required: ["name", "index"],
                properties: {
                    name: { type: "string" },
                    index: {type: "number"},
                    rules: {
                        type: "array",
                        items: {
                            type: "object",
                            additionalProperties: false,
                            required: ["label", "key", "type", "defaultValue", "required", "array"],
                            properties: {
                                label: { type: "string" },
                                key: { type: "string" },
                                type: { type: "string" },
                                defaultValue: { type: "string" },
                                required: { type: "boolean" },
                                array: { type: "boolean" }
                            }
                        }
                    }
                }
            }
        }
    }
}