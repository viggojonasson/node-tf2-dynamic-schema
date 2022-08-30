import { createFormat, Format } from 'tf2-item-format';
import { Schema } from './classes/Schema';
import { fetchAll } from './schema-fetching/fetch-all';

export async function fetchSchema(apiKey: string): Promise<Format> {
    const schema = await fetchAll(apiKey);

    // @ts-ignore
    return createFormat(new Schema(schema));
}
