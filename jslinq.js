/*
    $linq Version 2.0.0 (by Kurtis Jones @ https://github.com/battousai999/js-linq)
*/

class LinqHelper
{
    
}

export class Linq
{
    constructor(array, copyArray = true)
    {
        if (copyArray)
            this.array = (array == null ? [] : array.slice(0));
        else
            this.array = array;

        this.deferredSort = null;
    }

    static isFunction(func) { return (typeof func == "function"); }
    static isArray(obj) { return Array.isArray(obj); }  // Kept for backwards-compatibility reasons
    static isString(obj) { return (typeof obj === 'string' || obj instanceof String); }
    static isBoolean(obj) { return (typeof obj === 'boolean' || obj instanceof Boolean); }
    static isNumber(obj) { return (typeof obj === 'number' || obj instanceof Number); }

    static identity(x) { return x; }
    static merge(x, y) { return [x, y]; }
}
