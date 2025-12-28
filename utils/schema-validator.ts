import fs from 'fs/promises';
import path from 'path';
import Ajv from 'ajv';
import { createSchema } from 'genson-js';
import addFormats from 'ajv-formats';

const SCHEMA_BASE_PATH = 'response-schemas';
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

export async function validateSchema(
    dirName: string,
    fileName: string,
    responceBody: object,
    createSchemaFlag: boolean = false
) {
    const schemaPath = path.join(SCHEMA_BASE_PATH, dirName, `${fileName}_schema.json`);

    if (createSchemaFlag) await generateNewSchema(responceBody, schemaPath);

    const schema = await loadSchema(schemaPath);
    const validate = ajv.compile(schema);

    const valid = validate(responceBody);
    if (!valid) {
        throw new Error(
            `Schema validation ${fileName}_schema.json failed:\n` +
                `${JSON.stringify(validate.errors, null, 4)}\n\n` +
                `Actual response body:\n` +
                `${JSON.stringify(responceBody, null, 4)}\n\n`
        );
    }
}

async function loadSchema(schemaPath: string) {
    try {
        const schemaContent = await fs.readFile(schemaPath, 'utf8');
        return JSON.parse(schemaContent);
    } catch (error) {
        throw new Error(`Failed to read the schema file: ${error instanceof Error ? error.message : String(error)}`);
    }
}

function addDateTimeFormatToSchema(schema: any): any {
    if (typeof schema !== 'object' || schema === null) {
        return schema;
    }

    // Create a copy to avoid mutating the original
    const processedSchema = Array.isArray(schema) ? [...schema] : { ...schema };

    // If this schema has properties, process them
    if (processedSchema.properties && typeof processedSchema.properties === 'object') {
        processedSchema.properties = { ...processedSchema.properties };
        
        // Check for createdAt and updatedAt properties and add format: "date-time"
        if (processedSchema.properties.createdAt && 
            processedSchema.properties.createdAt.type === 'string') {
            processedSchema.properties.createdAt = {
                ...processedSchema.properties.createdAt,
                format: 'date-time'
            };
        }
        
        if (processedSchema.properties.updatedAt && 
            processedSchema.properties.updatedAt.type === 'string') {
            processedSchema.properties.updatedAt = {
                ...processedSchema.properties.updatedAt,
                format: 'date-time'
            };
        }

        // Recursively process nested properties
        for (const key in processedSchema.properties) {
            processedSchema.properties[key] = addDateTimeFormatToSchema(processedSchema.properties[key]);
        }
    }

    // Process items in arrays
    if (processedSchema.items) {
        processedSchema.items = addDateTimeFormatToSchema(processedSchema.items);
    }

    // Process anyOf, oneOf, allOf
    if (processedSchema.anyOf) {
        processedSchema.anyOf = processedSchema.anyOf.map((item: any) => addDateTimeFormatToSchema(item));
    }
    if (processedSchema.oneOf) {
        processedSchema.oneOf = processedSchema.oneOf.map((item: any) => addDateTimeFormatToSchema(item));
    }
    if (processedSchema.allOf) {
        processedSchema.allOf = processedSchema.allOf.map((item: any) => addDateTimeFormatToSchema(item));
    }

    return processedSchema;
}

async function generateNewSchema(responceBody: object, schemaPath: string) {
    try {
        const generatedSchema = createSchema(responceBody);
        const schemaWithDateTimeFormat = addDateTimeFormatToSchema(generatedSchema);
        await fs.mkdir(path.dirname(schemaPath), { recursive: true });
        await fs.writeFile(schemaPath, JSON.stringify(schemaWithDateTimeFormat, null, 4));
    } catch (error) {
        throw new Error(`Failed to create schema file: ${error instanceof Error ? error.message : String(error)}`);
    }
}
