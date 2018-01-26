/*
    $linq Version 2.0.0 (by Kurtis Jones @ https://github.com/battousai999/js-linq)
*/

class LinqHelper
{
    static convertToString(value) { return (value == null ? null : value.toString()); }
    static convertToNumber(value) { return (Linq.isNumber(value) ? value : NaN); }    
}

// Used in the Linq.isGenerator() function to test for being a generator.
var GeneratorFunction = (function*(){}).constructor;

export class Linq
{
    /**
     * Creates a new linq object.  If `source` is a function, then it is expected to return an iterable, a generator
     * or another function that returns either an iterable or a generator.
     * 
     * The iterables that can be passed in `source` are those defined by the "iterable protocol" (see
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#iterable).
     * 
     * @constructor
     * @param {iterable|generator|Linq|function} source - The source from which this linq object enumerates values
     * @throws If `source` is not an iterable, a generator, or a function.
     */
    constructor(source)
    {
        if (source == null)
            source = [];

        if (Linq.isIterable(source) || Linq.isGenerator(source) || Linq.isFunction(source) || Linq.isLinq(source))
            this.source = source;
        else
            throw new Error('The \'source\' is not either an iterable or a generator.');
    }

    // Helper functions
    static isFunction(func) { return (typeof func == "function"); }
    static isArray(obj) { return Array.isArray(obj); }  // Kept for backwards-compatibility reasons
    static isString(obj) { return (typeof obj === 'string' || obj instanceof String); }
    static isBoolean(obj) { return (typeof obj === 'boolean' || obj instanceof Boolean); }
    static isNumber(obj) { return (typeof obj === 'number' || obj instanceof Number); }
    static isIterable(obj) { return obj != null && typeof obj[Symbol.iterator] === 'function'; }
    static isGenerator(obj) { return (obj instanceof GeneratorFunction); }
    static isLinq(obj) { return (obj instanceof Linq); }

    static identity(x) { return x; }
    static merge(x, y) { return [x, y]; }

    // Comparer functions
    static defaultStringComparer(x, y) { return Linq.caseSensitiveStringComparer(x, y); }

    static caseSensitiveStringComparer(x, y) 
    { 
        let normalize = value => (value == null ? null : LinqHelper.convertToString(value));

        return Linq.generalComparer(normalize(x), normalize(y)); 
    }

    static caseInsensitiveStringComparer(x, y) 
    {  
        let normalize = value => (Linq.isString(value) ? value.toLowerCase() : value);

        return Linq.caseSensitiveStringComparer(normalize(x), normalize(y));
    }

    static defaultStringEqualityComparer(x, y) { return Linq.caseSensitiveStringEqualityComparer(x, y); }
    static caseSensitiveStringEqualityComparer(x, y) { return (Linq.caseSensitiveStringComparer(x, y) === 0); }
    static caseInsensitiveStringEqualityComparer(x, y) { return (Linq.caseInsensitiveStringComparer(x, y) === 0); }

    static generalComparer(x, y) 
    {  
        if (x == null && y == null)
            return 0;

        if (x == null)
            return -1;

        if (y == null)
            return 1;

        return (x < y ? -1 : (x > y ? 1 : 0));
    }

    static normalizeComparer(comparer)
    {
        return (x, y) =>
        {
            let value = comparer(x, y);

            if (Linq.isBoolean(value))
                return value;
            else
                return (value == 0);
        };
    }

    static createProjectionComparer(projection, comparer = null)
    {
        if (projection == null)
            throw new Error('Invalid projection.');

        if (comparer == null)
            comparer = (x, y) => Linq.generalComparer(x, y);

        return (x, y) => {
            let results = comparer(projection(x), projection(y));

            if (Linq.isBoolean(results))
                throw new Error('The given \'comparer\' was an equality comparer instead of a comparer.');

            return results;
        };
    }

    static createProjectionEqualityComparer(projection, comparer = null)
    {
        if (projection == null)
            throw new Error('Invalid projection.');

        let normalizedComparer;

        if (comparer == null)
            normalizedComparer = (x, y) => x === y;
        else
            normalizedComparer = Linq.normalizeComparer(comparer);

        return (x, y) => normalizedComparer(projection(x), projection(y));
    }

    // Linq operators
    toIterable()
    {
        let helper = source =>
        {
            if (Linq.isLinq(source))
                return source.toIterable();
            else if (Linq.isIterable(source))
                return source;
            else if (Linq.isGenerator(source))
                return source();
            else if (Linq.isFunction(source))
                return helper(source());
            else 
                throw new Error('Could not return an iterable because the \'source\' was not valid.');
        };

        return helper(this.source);
    }

    toArray()
    {
        return Array.from(this.toIterable());
    }
}
