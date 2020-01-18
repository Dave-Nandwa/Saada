var prefix = 'assets/eIcons';
var postfix = '.svg';
const medical = ["+254719624552"];
const fire = ["+254719624552"];
const police = ["+254719624552"];
const poison = ["+254719624552"];
const animalControl = ["+254719624552"];
const general = ["+254719624552"];

export const services = [
    {
        "name": 'Heart Attack',
        "icon": `${prefix}/heart${postfix}`,
        "tels": medical,  
        "active":true
    },
    {
        "name": 'Animal Bite',
        "icon": `${prefix}/animal_bite${postfix}`,
        "tels": medical,  
        "active":false
    },
    {
        "name": 'Bleeding',
        "icon": `${prefix}/bleeding${postfix}`,
        "tels": medical,  
        "active":false
    },
    {
        "name": 'Poison',
        "icon": `${prefix}/poison${postfix}`,
        "tels": medical.concat(poison),  
        "active":false
    },
    {
        "name": 'Fire',
        "icon": `${prefix}/fire_truck${postfix}`,
        "tels": fire,  
        "active":false
    },
    {
        "name": 'Heat Stroke',
        "icon": `${prefix}/sun${postfix}`,
        "tels": medical,  
        "active":false
    },
    {
        "name": 'Accident',
        "icon": `${prefix}/accident${postfix}`,
        "tels": medical,  
        "active":false
    },
    {
        "name": 'Allergic Reaction',
        "icon": `${prefix}/drugs${postfix}`,
        "tels": medical,  
        "active":false
    },
    {
        "name": 'Shock /\n Trauma',
        "icon": `${prefix}/anaphylactic${postfix}`,
        "tels": medical,  
        "active":false
    },
    {
        "name": 'Crime',
        "icon": `${prefix}/crime${postfix}`,
        "tels": police,  
        "active":false
    },
    {
        "name": 'Other',
        "icon": `${prefix}/other${postfix}`,
        "tels": general,  
        "active":false
    }
]