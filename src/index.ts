import {
    createFormat as createItemFormat,
    Format,
    ISchema,
} from 'tf2-item-format';
import { Schema } from './classes/Schema';
import { fetchAll, SchemaFetch } from './schema-fetching/fetch-all';

export type CreateFormatResponse = {
    format: Format;
    schema: SchemaFetch;
};

export async function createFormat(
    apiKey: string
): Promise<CreateFormatResponse> {
    const schema = await fetchAll(apiKey);

    return {
        // @ts-ignore
        format: createItemFormat(new Schema(schema)),
        schema,
    };
}

export async function fetchSchema(apiKey: string): Promise<Format> {
    const schema = await fetchAll(apiKey);

    // @ts-ignore
    return createItemFormat(new Schema(schema));
}

export { Schema };
