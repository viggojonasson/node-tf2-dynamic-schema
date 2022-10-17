import {
    DefindexToName,
    ISchema,
    ItemsGame,
    SchemaEnum,
} from 'tf2-item-format';
import { DEFINDEXES, NAMES } from '../lib/exceptions';
import isNumber from '../util/isNumber';

type SchemaItem = {
    name: string;
    defindex: number;
    item_class: string;
    item_type_name: string;
    item_name: string;
    proper_name: boolean;
    item_slot: string;
    model_player: string;
    item_quality: number;
    image_inventory: string;
    min_ilevel: number;
    max_ilevel: number;
    image_url: string;
    image_url_large: string;
    craft_class: string;
    craft_material_type: string;
    capabilities: {
        nameable: boolean;
        can_gift_wrap: boolean;
        can_craft_mark: boolean;
        can_be_restored: boolean;
        strange_parts: boolean;
        can_card_upgrade: boolean;
        can_strangify: boolean;
        can_killstreakify: boolean;
        can_consume: boolean;
    };
    used_by_classes: string[];
    attributes: { name?: string; class?: string; value: number }[];
};

type SchemaObject = {
    effects: SchemaEnum;
    wears: SchemaEnum;
    killstreaks: SchemaEnum;
    textures: SchemaEnum;
    itemNames: DefindexToName;
    items: SchemaEnum[];
    qualities: SchemaEnum;
    itemsGame: ItemsGame;
};

export class Schema implements ISchema {
    public effects!: SchemaEnum;
    public wears!: SchemaEnum;
    public killstreaks: {
        None: 0;
        Killstreak: 1;
        'Specialized Killstreak': 2;
        'Professional Killstreak': 3;

        '0': 'None';
        '1': 'Killstreak';
        '2': 'Specialized Killstreak';
        '3': 'Professional Killstreak';
    };
    public textures!: SchemaEnum;
    public itemNames!: DefindexToName;
    public items!: SchemaEnum[];
    public qualities!: SchemaEnum;
    public itemsGame!: ItemsGame;

    constructor(schema: SchemaObject) {
        for (const key in schema) {
            this[key] = schema[key];
        }
    }

    getTextures() {
        return this.textures;
    }

    getEffects() {
        return this.effects;
    }

    getEffect(search: string | number): number | string {
        return this.effects[search];
    }

    getWear(search: string | number): number | string {
        return this.wears[search];
    }

    getKillstreak(search: string | number): number | string {
        return this.killstreaks[search];
    }

    getTexture(search: string | number): number | string {
        return this.textures[search];
    }

    /**
     * @todo https://github.com/Nicklason/tf2-automatic/blob/master/src/lib/items.ts
     * @param {string} search
     * @return {number}
     */
    getDefindex(search: number | string): number | null {
        if (typeof search === 'number') return search;

        // Exceptions
        if (DEFINDEXES[search]) return DEFINDEXES[search];

        let upgradeableDfx: number | null = null;
        for (let i = 0; i < this.items.length; i++) {
            // Honestly too lazy
            // @ts-ignore
            const item: SchemaItem = this.items[i];
            const name: string = selectName(item);
            if (name === search) {
                if (!hasUpgradeable(item) || isUpgradeable(item.name)) {
                    return item.defindex;
                }

                upgradeableDfx = item.defindex;
            }
        }

        return upgradeableDfx;
    }

    getName(search: number | string): string {
        if (!isNumber(search)) return search as string;
        const name = NAMES[search];
        if (name) return name;

        return this.itemNames[search as number];
    }

    getQuality(search: number | string): number | string {
        return this.qualities[search];
    }

    getEffectName(effect: number | string): string {
        if (!isNumber(effect)) return effect as string;

        return this.getEffect(effect as number) as string;
    }

    getWearName(wear: number | string): string {
        if (!isNumber(wear)) return wear as string;

        return this.getWear(wear as number) as string;
    }

    getKillstreakName(killstreak: number | string): string {
        if (!isNumber(killstreak)) return killstreak as string;

        return this.getKillstreak(killstreak as number) as string;
    }

    getTextureName(texture: number | string): string {
        if (!isNumber(texture)) return texture as string;

        return this.getTexture(texture as number) as string;
    }

    getQualityName(quality: number | string): string {
        if (!isNumber(quality)) return quality as string;

        return this.getQuality(quality as number) as string;
    }

    getEffectEnum(effect: number | string): number {
        if (isNumber(effect)) return effect as number;

        return this.getEffect(effect as string) as number;
    }

    getWearEnum(wear: number | string): number {
        if (isNumber(wear)) return wear as number;

        return this.getWear(wear as string) as number;
    }

    getKillstreakEnum(killstreak: number | string): number {
        if (isNumber(killstreak)) return killstreak as number;

        return this.getKillstreak(killstreak as string) as number;
    }

    getTextureEnum(texture: number | string): number {
        if (isNumber(texture)) return texture as number;

        return parseInt(this.getTexture(texture as string) as string);
    }

    getQualityEnum(quality: number | string): number {
        if (isNumber(quality)) return quality as number;

        return this.getQuality(quality as string) as number;
    }

    isUniqueHat(defindexOrName: string | number): boolean {
        if (isNumber(defindexOrName)) {
            defindexOrName = this.getName(defindexOrName);
        }

        const item = this.getSchemaItemFromName(defindexOrName);
        return !!item?.proper_name;
    }

    getCrateNumber(defindexOrName: string | number): number {
        if (!isNumber(defindexOrName)) {
            const defindex = this.getDefindex(defindexOrName);
            if (!defindex) return 0;
            defindexOrName = defindex;
        }

        const item = this.itemsGame.items[defindexOrName + ''];
        if (!item) return 0;

        const crateSeries = parseInt(
            (item.static_attrs &&
                item.static_attrs['set supply crate series']) as string
        );

        return isNaN(crateSeries) ? 0 : crateSeries;
    }

    private getSchemaItemFromName(search: string) {
        let byDefindex: number = 0;
        if (DEFINDEXES[search]) {
            byDefindex = DEFINDEXES[search];
        }

        let correctItem: SchemaItem | null = null;
        for (let i = 0; i < this.items.length; i++) {
            // Honestly too lazy here as well
            // @ts-ignore
            const item: SchemaItem = this.items[i];
            const name: string = selectName(item);
            if (byDefindex ? byDefindex === item.defindex : name === search) {
                if (!hasUpgradeable(item) || isUpgradeable(item.name)) {
                    return item;
                }

                correctItem = item;
            }
        }

        return correctItem;
    }
}

function selectName(item: SchemaItem): string {
    if (item.item_name === 'Kit') return item.item_type_name;
    // Due to BackpackTF naming colisions.
    if (item.defindex === 20003) return 'Professional Killstreak Fabricator';
    if (item.defindex === 20002) return 'Specialized Killstreak Fabricator';
    return item.item_name;
}

function isUpgradeable(name: string): boolean {
    return name.startsWith('Upgradeable ');
}

function hasUpgradeable(item: SchemaItem): boolean {
    return item.name.includes(item.item_class.toUpperCase());
}
