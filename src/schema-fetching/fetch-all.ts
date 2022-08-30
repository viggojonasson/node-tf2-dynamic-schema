import { getItemsGame } from './items-game';
import { getPaintKits } from './paint-kits';
import { getSchemaItems } from './schema-items';
import { getSchemaOverview } from './schema-overview';

export async function fetchAll(apiKey) {
    const [itemsGame, paintKits, schemaItems, overview] = await Promise.all([
        getItemsGame(),
        getPaintKits(),
        getSchemaItems(apiKey),
        getSchemaOverview(apiKey),
    ]);

    /**
     * Sorted into objects that will be saved as JSON files.
     */
    return {
        itemsGame,
        paintKits,

        qualities: overview.qualities,
        effects: overview.effects,
        origins: overview.origins,
        attributes: overview.attributes,
        sets: overview.sets,
        levels: overview.levels,
        parts: overview.parts,
        lookups: overview.lookups,

        itemNames: schemaItems.itemNames,
        items: schemaItems.items,
    };
}
