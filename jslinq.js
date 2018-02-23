/*
    $linq Version 2.0.0 (by Kurtis Jones @ https://github.com/battousai999/js-linq)
*/

class LinqHelper
{
    static convertToString(value) { return (value == null ? null : value.toString()); }
    static convertToNumber(value) { return (Linq.isNumber(value) ? value : NaN); }    
    static isConstructorCompatibleSource(source) { return Linq.isIterable(source) || Linq.isGenerator(source) || Linq.isFunction(source) || Linq.isLinq(source); }
    static isStringNullOrEmpty(str) { return (str == null || str === ''); }

    static buildRangeGenerator(from, to, step)
    {
        function compare(x, y)
        {
            if (step > 0)
                return (x <= y);
            else
                return (x >= y);
        }

        function *gen()
        {
            for (let i = from; compare(i, to); i += step)
            {
                yield i;
            }
        }

        return gen;
    }

    static buildRepeatGenerator(item, repetitions)
    {
        function *gen()
        {
            for (let i = 0; i < repetitions; i++)
            {
                yield item;
            }
        }

        return gen;
    }

    static ValidateRequiredFunction(func, message)
    {
        if ((func == null) || !Linq.isFunction(func))
            throw new Error(message);
    }

    static ValidateOptionalFunction(func, message)
    {
        if ((func != null) && !Linq.isFunction(func))
            throw new Error(message);
    }
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

        if (LinqHelper.isConstructorCompatibleSource(source))
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
    static tuple(x, y) { return [x, y]; }

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

    // Constructor functions

    /**
     * Creates a new Linq object, acting very similarly as the Linq constructor, but also accepts:
     * 
     * (1) jQuery objects, and 
     * (2) objects that would cause the constructor to throw an exception (resulting in a Linq object 
     *     that represents a single-item list containing the object).
     * 
     * @param {*} source - A source of items
     * @returns {Linq} 
     */
    static from(source)
    {
        if (source == null || LinqHelper.isConstructorCompatibleSource(source))
            return new Linq(source);
        else if (typeof jQuery !== 'undefined' && (collection instanceof jQuery))
            return new Linq(source.get());
        else
            return new Linq([source]);
    }

    /**
     * Create a new Linq object that contains a range of integers.
     * 
     * @param {num} from - The starting value of the range
     * @param {num} to - The ending value of the range
     * @param {num} [step=1] - The amount by which to increment each iteration
     * @returns {Linq} 
     */
    static range(from, to, step)
    {
        if ((from == null) || isNaN(from))
            throw new Error("Invalid 'from' value.");

        if ((to == null) || isNaN(to))
            throw new Error("Invalid 'to' value.");

        if ((step == null) || isNaN(step))
            step = 1;

        if (step == 0)
            throw new Error("Invalid 'step' value--cannot be zero.");

        return new Linq(LinqHelper.buildRangeGenerator(from, to, step));
    }

    /**
     * Create a new Linq object that contains a given number of repetitions of an object.
     * 
     * @param {*} item - The item to repeat
     * @param {num} [repetitions=1] - The number of times to repeat the object
     * @returns {Linq}
     */
    static repeat(item, repetitions)
    {
        if ((repetitions == null) || isNaN(repetitions))
            repetitions = 1;

        return new Linq(LinqHelper.buildRepeatGenerator(item, repetitions));
    }

    /**
     * Create a new linq object that contains all of the matches for a regex pattern.  Note that 'g' does not need to be added 
     * to the flags parameter (it will be automatically added).
     * 
     * @param {string} text 
     * @param {string|RegExp} pattern 
     * @param {string} [flags] 
     */
    static matches(text, pattern, flags)
    {
        if (pattern == null)
            throw new Error('Invalid \'pattern\' value.');

        if (text == null)
            return new Linq();

        if (!Linq.isString(text))
            throw new Error('Parameter \'text\' is not a string.');

        if (flags == null)
            flags = '';
        
        if (!flags.includes('g'))
            flags += 'g';

        let internalPattern;

        if (pattern instanceof RegExp)
        {
            if (!flags.includes('i') && pattern.ignoreCase)
                flags += 'i';

            if (!flags.includes('m') && pattern.multiline)
                flags += 'm';

            internalPattern = pattern.source;
        }
        else
            internalPattern = pattern;

        let regex = new RegExp(internalPattern, flags);
        let matches = text.match(regex);

        return new Linq(matches = null ? [] : matches);
    }

    /**
     * Create a new linq object that contains an element for each property of the 'object' passed
     * to the method.  Each element will have a property named by the 'keyPropertyName' parameter
     * whose value will equal the name of the property and a property named by the 'valuePropertyName'
     * parameter whose value will equal the value of the property.  If the 'keyPropertyName'
     * parameter is not given, then it will default to "key"; if the 'valuePropertyName' parameter 
     * is not given, then it will default to "value".
     * 
     * @param {*} obj - The object from which to enumerate properties
     * @param {string} [keyPropertyName=key] - The name of the property in the resultant elements containing
            the property's key
     * @param {string} [valuePropertyName=value] - The name of the property in the resultant elements containing
            the property's value
     */
    static properties(obj, keyPropertyName, valuePropertyName)
    {
        if (obj == null)
            return new Linq();

        if (LinqHelper.isStringNullOrEmpty(keyPropertyName))
            keyPropertyName = 'key';

        if (LinqHelper.isStringNullOrEmpty(valuePropertyName))
            valuePropertyName = 'value';

        let projection = key =>
        {
            let result = {};

            result[keyPropertyName] = key;
            result[valuePropertyName] = obj[key];

            return result;
        };

        return new Linq(Object.keys(obj).map(projection));
    }

    // Linq operators

    aggregate(seed, operation, resultSelector)
    {
        LinqHelper.ValidateRequiredFunction(operation, "Invalid operation.");
        LinqHelper.ValidateOptionalFunction(resultSelector, "Invalid result selector.");

        let iterator = this.toIterable();
        let result = seed;
        let isFirstElement = true;

        for (let current of iterator)
        {
            if (isFirstElement && seed == null)
            {
                isFirstElement = false;
                result = current;
            }
            else
                result = operation(result, current);
        }

        if (isFirstElement && seed == null)
            throw new Error("Cannot evaluate aggregation of an empty collection with no seed.");

        return (resultSelector == null ? result : resultSelector(result));
    }

    /**
     * Returns an iterable (as defined by the "iterable protocol"--see
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#iterable) that 
     * represents the contents of the Linq object.
     */
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

    /**
     * Returns an array that represents the contents of the Linq object.
     */
    toArray()
    {
        return Array.from(this.toIterable());
    }
}
