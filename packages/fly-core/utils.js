export function isObject (obj) {
    return obj !== null && typeof obj === 'object'
}

export function makeArray(array){
    if(Array.isArray(array)) return array;
    if(array == null) return [];
    return [array];
}