import { Schema } from "ajv";

export const schema: Schema = {
    type: "object",
    additionalProperties: false,
    required: ["projectName"],
    properties: {
        projectName: { type: "string" },
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
                required: ["name"],
                properties: {
                    name: {type:"string"},
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