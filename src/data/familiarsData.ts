import { Familiar } from '../types';

/**
 * Pre-defined familiar data for quick setup.
 */

export const GRINDLETTE: Familiar = {
    id: 'grindlette',
    name: 'Grindlette',
    type: 'imp',
    hp: 10,
    maxHp: 10,
    ac: 13,
    speed: 20,
    flySpeed: 40,
    isInvisible: false,
    traits: ["Devil's Sight", "Magic Resistance", "Shapechanger"],
    attacks: [{
        name: 'Sting',
        toHit: 5,
        damage: '1d4+3 + 3d6',
        damageType: 'piercing + poison (DC 11 CON halves)',
    }],
};

export const PSEUDODRAGON: Familiar = {
    id: 'pseudodragon',
    name: 'Pseudodragon',
    type: 'pseudodragon',
    hp: 4,
    maxHp: 4,
    ac: 13,
    speed: 15,
    flySpeed: 60,
    isInvisible: false,
    traits: ['Blindsight', 'Keen Senses', 'Limited Telepathy', 'Magic Resistance', 'Poisonous Breath'],
    attacks: [{
        name: 'Sting',
        toHit: 4,
        damage: '1d4-2',
        damageType: 'piercing + poison (DC 11 CON halves)',
    }],
};

export const QUASIT: Familiar = {
    id: 'quasit',
    name: 'Quasit',
    type: 'quasit',
    hp: 7,
    maxHp: 7,
    ac: 13,
    speed: 40,
    isInvisible: false,
    traits: ['Shapechanger', 'Magic Resistance', 'Invisibility', 'Scare'],
    attacks: [{
        name: 'Claws',
        toHit: 4,
        damage: '1d4+2',
        damageType: 'slashing',
    }],
};

export const SPRITE: Familiar = {
    id: 'sprite',
    name: 'Sprite',
    type: 'sprite',
    hp: 2,
    maxHp: 2,
    ac: 15,
    speed: 10,
    flySpeed: 40,
    isInvisible: false,
    traits: ['Heart Sight', 'Invisibility', 'Flyby', 'Superior Invisibility', 'Variant: Poison'],
    attacks: [{
        name: 'Longsword',
        toHit: 4,
        damage: '1d4+2',
        damageType: 'piercing',
    }],
};
