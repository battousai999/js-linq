/*
    $linq Version 2.0.0 (by Kurtis Jones @ https://github.com/battousai999/js-linq)
*/

class LinqHelper
{
    static convertToString(value) { return (value == null ? null : value.toString()); }
    static convertToNumber(value) { return (Linq.isNumber(value) ? value : NaN); }    
    static isConstructorCompatibleSource(source) { return Linq.isIterable(source) || Linq.isGenerator(source) || Linq.isFunction(source) || Linq.isLinq(source); }
    static isStringNullOrEmpty(str) { return (str == null || str === ''); }
    static isTypedArray(x) { return ArrayBuffer.isView(x) && !(x instanceof DataView); }
    static isIndexedCollection(x) { return Array.isArray(x) || Linq.isString(x) || LinqHelper.isTypedArray(x); }
    static isCollectionHavingLength(x) { return LinqHelper.isIndexedCollection(x); }
    static isCollectionHavingSize(x) { return (x instanceof Set) || (x instanceof Map); }

    static isEmptyIterable(iterable)
    {
        if (LinqHelper.isCollectionHavingLength(iterable))
            return (iterable.length === 0);

        if (LinqHelper.isCollectionHavingSize(iterable))
            return (iterable.size === 0);

        let iterator = LinqHelper.getIterator(iterable);
        let state = iterator.next();

        return state.done;
    }

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

    static validateRequiredFunction(func, message)
    {
        if ((func == null) || !Linq.isFunction(func))
            throw new Error(message);
    }

    static validateOptionalFunction(func, message)
    {
        if ((func != null) && !Linq.isFunction(func))
            throw new Error(message);
    }

    static getIterator(iterable)
    {        
        if (!Linq.isIterable(iterable))
            return new Error('Value is not an iterable.');

        return iterable[Symbol.iterator]();
    }

    static firstBasedOperator(iterable, predicate, defaultValue, throwIfNotFound)
    {
        for (let item of iterable)
        {
            if ((predicate == null) || predicate(item))
                return item;
        }

        if (throwIfNotFound)
            throw new Error('No first item was found in the collection.');
        else
            return defaultValue;
    }
}

// Used in the Linq.isGenerator() function to test for being a generator.
var GeneratorFunction = (function*(){}).constructor;

export class Grouping
{
    constructor(key, values)
    {
        this.key = key;
        this.values = (values == null ? [] : Array.from(values));
    }
}

export class Linq
{
    /**
     * A type that can be passed the the Linq constructor.
     * @typedef {iterable|generator|Linq|function} LinqCompatible
     */

    /**
     * A function that can act as a projection function (i.e., projects a value into some other value).
     * @callback projection
     * @param {*} value - The value to be projected
     * @returns {*} - The projected value.
     */

    /**
     * A function that can act as a predicate function (i.e., projects a value to a boolean value).
     * @callback predicate
     * @param {*} value - The value to test
     * @returns {boolean}
     */

    /**
     * A comparer is a function that takes two values and returns 0 if they are considered the "same" (by
     * the comparer), -1 if they are considered "in order", and 1 if they are considered "out-of-order".
     * @callback comparer
     * @param {*} value1 - The first value to compare
     * @param {*} value2 - The second value to compare
     * @returns {number} - The value (-1/0/1) that represents the ordering of the two values.
     */

    /**
     * An equality comparer is a function that takes two values and returns a boolean value indicating 
     * whether the two values are considered the "same" (by the equality comparer).
     * @callback equalityComparer
     * @param {*} value1 - The first value to compare
     * @param {*} value2 - The second value to compare
     * @returns {boolean} - The value indicating whether the two values are the same.
     */

    /**
     * Creates a new linq object.  If `source` is a function, then it is expected to return an iterable, a generator
     * or another function that returns either an iterable or a generator.
     * 
     * The iterables that can be passed in `source` are those defined by the "iterable protocol" (see
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#iterable).
     * 
     * @constructor
     * @param {LinqCompatible} source - The source from which this linq object enumerates values
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

    /**
     * This function converts a "comparer" into an "equality comparer".  If the function is already an equality
     * comparer, then the resultant function will remain an equality comparer.
     * 
     * @param {comparer} comparer - The function to convert into an equality comparer
     * @returns {equalityComparer}
     */
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

    /**
     * This function creates a new comparer based upon the `projection` of values passed to the new comparer.  This
     * function can also be passed a `comparer` that is used in the new comparer to compare the projected values.
     * 
     * @param {projection} projection - The projection from which compare projected values
     * @param {comparer} [comparer] - A comparer with which to compare projected values
     * @returns {comparer}
     */
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

    /**
     * This function create a new equality comparer based upon the `projection` of the values passed to the new equality
     * comparer.  This function can also be passed a `comparer` that is used in the new equality comparer to compare the
     * projected values.
     * 
     * @param {projection} projection - The projection from which to compare projected values
     * @param {comparer|equalityComparer} [comparer] - The comparer with which to compare projected values
     * @returns {equalityComparer}
     */
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
        else if (typeof jQuery !== 'undefined' && (source instanceof jQuery))
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
     * to the `flags` parameter (it will be automatically added).
     * 
     * @param {string} text 
     * @param {string|RegExp} pattern 
     * @param {string} [flags] 
     * @returns {Linq}
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

        return new Linq(matches == null ? [] : matches);
    }

    /**
     * Create a new linq object that contains an element for each property of the 'object' passed
     * to the method.  Each element will have a property named by the `keyPropertyName` parameter
     * whose value will equal the name of the property and a property named by the `valuePropertyName`
     * parameter whose value will equal the value of the property.  If the `keyPropertyName`
     * parameter is not given, then it will default to "key"; if the `valuePropertyName` parameter 
     * is not given, then it will default to "value".
     * 
     * @param {*} obj - The object from which to enumerate properties
     * @param {string} [keyPropertyName=key] - The name of the property in the resultant elements containing
     *      the property's key
     * @param {string} [valuePropertyName=value] - The name of the property in the resultant elements containing
     *      the property's value
     * @returns {Linq}
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

    /**
     * Returns a new empty Linq object.
     * 
     * @returns {Linq}
     */
    static empty()
    {
        return new Linq([]);
    }

    // Linq operators

    /**
     * Returns the aggregate value of performing the `operation` function on each of the values of
     * 'this' collection, starting with a value equal to `seed` (or to the value of the first element
     * of 'this' collection, if `seed` is null).  The final value is either directly returned (if no
     * `resultSelector` function is given) or the final value is first passed to the `resultSelector`
     * function and the return value from that function is returned.
     * 
     * @param {*} seed - The initial value of the aggregation 
     * @param {*} operation - The function to use to aggregate the values of 'this' collection
     * @param {projection} [resultSelector] - The function that projects the final value to the returned result
     * @returns {*} - The aggregate value.
     */
    aggregate(seed, operation, resultSelector)
    {
        LinqHelper.validateRequiredFunction(operation, "Invalid operation.");
        LinqHelper.validateOptionalFunction(resultSelector, "Invalid result selector.");

        let iterator = LinqHelper.getIterator(this.toIterable());
        let currentValue = null;
        let result = null;

        let getNext = () => 
        {
            let state = iterator.next();

            currentValue = state.value;

            return !state.done;
        };

        if (getNext())
            result = (seed == null ? currentValue : operation(seed, currentValue));
        else if (seed == null)
            throw new Error("Cannot evaluate aggregation of an empty collection with no seed.");
        else
            return (resultSelector == null ? seed : resultSelector(seed));

        while (getNext())
        {
            result = operation(result, currentValue);
        }

        return (resultSelector == null ? result : resultSelector(result));
    }

    /**
     * Returns a boolean value indicating whether all of the elements of the collection satisfy the 
     * predicate.  Returns 'true' if the collection is empty.
     * 
     * @param {predicate} predicate - The predicate applied to the collection
     * @returns {boolean} - A value indicating whether all of the elements satisfied the predicate.
     */
    all(predicate)
    {
        LinqHelper.validateRequiredFunction(predicate, 'Invalid predicate.');

        let iterable = this.toIterable();

        for (let item of iterable)
        {
            if (!predicate(item))
                return false;
        }

        return true;
    }

    /**
     * Returns a boolean value indicating whether any of the elements of the collection satisfy the 
     * predicate.  Returns 'false' if the collection is empty.
     * 
     * @param {predicate} [predicate] - The predicate applied to the collection
     * @returns {boolean} - A value indicating whether any of the elements satisfied the predicate. 
     */
    any(predicate)
    {
        LinqHelper.validateOptionalFunction(predicate, 'Invalid predicate.');

        let iterable = this.toIterable();

        if (predicate == null)
            return !LinqHelper.isEmptyIterable(iterable);

        for (let item of iterable)
        {
            if (predicate(item))
                return true;
        }

        return false;
    }

    /**
     * Returns the average value of all of the elements (or projection of the elements, if there is
     * a selector), excluding null values.  If any of the elements (or projection of the elements) are
     * NaN (i.e., not a number), then an exception will be thrown.
     * 
     * @param {projection} [selector] - A projection function that returns the value to be averaged
     * @returns {number} - The average value calculated from the collection.
     */
    average(selector)
    {
        LinqHelper.validateOptionalFunction(selector, 'Invalid selector.');

        let iterable = this.toIterable();
        let result = 0;
        let counter = 1;

        for (let item of iterable)
        {
            let value = (selector == null ? item : selector(item));

            if (value == null)
                continue;

            if (isNaN(value))
                throw new Error('Encountered an element that is not a number.');

            result += (value - result) / counter;
            counter += 1;
        }

        return result;
    }

    /**
     * Returns an collection with the elements of 'this' collection grouped into separate 
     * arrays (i.e., "buckets") of the 'size' given.  If the 'result selector' is given
     * the the buckets will contain the values projected from the elements by the result
     * selector.  The given 'size' must be greater than zero.
     * 
     * @param {number} size - The size of buckets into which to group the elements
     * @param {projection} [resultSelector] - The projection function to use to project the result values
     * @returns {Linq}
     */
    batch(size, resultSelector)
    {
        LinqHelper.validateOptionalFunction(resultSelector, 'Invalid result selector.');

        if ((size == null) || isNaN(size) || (size <= 0))
            throw new Error('Invalid size.');

        let iterable = this.toIterable();

        function* batchGenerator()
        {
            let bucket = null;
            let index = 0;

            for (let item of iterable)
            {
                if (bucket == null)
                    bucket = [];

                bucket[index] = (resultSelector == null ? item : resultSelector(item));
                index += 1;

                if (index == size)
                {
                    yield bucket;

                    bucket = null;
                    index = 0;
                }
            }

            if ((bucket != null) && (index > 0))
                yield bucket;
        }

        return new Linq(batchGenerator);
    }

    /**
     * Returns a collection containing all of the elements of 'this' collection followed by 
     * all of the elements of the 'second' collection.
     * 
     * @param {LinqCompatible} [second] - The collection of items to append to 'this' collection
     * @returns {Linq} - The concatenation of the collection with a second collection.
     */
    concat(second)
    {
        if (second == null)
            return new Linq(this);

        var secondLinq = (Linq.isLinq(second) ? second : new Linq(second));

        let firstIterable = this.toIterable();
        let secondIterable = secondLinq.toIterable();

        function* concatGenerator()
        {
            for (let item of firstIterable)
            {
                yield item;
            }

            for (let item of secondIterable)
            {
                yield item;
            }
        }

        return new Linq(concatGenerator);
    }

    /**
     * Returns a boolean value indicating whether 'this' collection contains the given `item`.  The
     * `comparer` function can be used to specify how the `item` is compared to the elements of 'this' 
     * collection.  If `comparer` is not given, the "===" operator is used to compare elements.
     * 
     * @param {*} item - The item to search for in 'this' collection
     * @param {comparer|equalityComparer} [comparer] - The function to use to compare elements
     * @returns {boolean}
     */
    contains(item, comparer)
    {
        LinqHelper.validateOptionalFunction(comparer, 'Invalid comparer.');

        if (comparer == null)
            comparer = (x, y) => x === y;
        else
            comparer = Linq.normalizeComparer(comparer);

        let iterable = this.toIterable();

        for (let x of iterable)
        {
            if (comparer(x, item))
                return true;
        }

        return false;
    }

    /**
     * Returns the number of items in 'this' collection (if no `predicate` is given) or the number of
     * items in 'this' collection that satisfy the `predicate`.
     * 
     * @param {predicate} [predicate] - The predicate used to count elements
     * @returns {number}
     */
    count(predicate)
    {
        LinqHelper.validateOptionalFunction(predicate, 'Invalid predicate.');

        let iterable = this.toIterable();

        if (predicate == null && LinqHelper.isCollectionHavingLength(iterable))
            return iterable.length;

        if (predicate == null && LinqHelper.isCollectionHavingSize(iterable))
            return iterable.size;

        let counter = 0;

        for (let item of iterable)
        {
            if (predicate == null || predicate(item))
                counter += 1;
        }

        return counter;
    }

    /**
     * Returns either 'this' collection, if 'this' collection is empty, or a collection containing
     * only the `defaultValue` as an element.  In other words, this function always returns a collection 
     * containing at least one element.
     * 
     * @param {*} defaultValue 
     * @returns {Linq}
     */
    defaultIfEmpty(defaultValue)
    {
        let iterable = this.toIterable();

        if (LinqHelper.isEmptyIterable(iterable))
            return new Linq([defaultValue]);
        else
            return new Linq(this);
    }

    /**
     * Returns a collection of all of the distinct elements of 'this' collection, using `comparer` (if it
     * is given) to determine whether two elements are equal.  If `comparer` is not given, the "===" operator
     * is used to compare elements.
     * 
     * @param {comparer|equalityComparer} [comparer] - The function used to compare elements
     * @returns {Linq} 
     */
    distinct(comparer)
    {
        return this.distinctBy(Linq.identity, comparer);
    }

    /**
     * Returns a collection of all of the elements that are considered distinct relative to the key value returned
     * by the `keySelector` projection, using `comparer` (if it is given) to determine whether to keys are equal.
     * If `comparer` is not given, the "===" operator is used to compare keys.
     * 
     * @param {projection} keySelector - The projection function used to return keys for the elements
     * @param {comparer|equalityComparer} [comparer] - The function used to compare keys
     * @returns {Linq} 
     */
    distinctBy(keySelector, comparer)
    {
        LinqHelper.validateRequiredFunction(keySelector, 'Invalid key selector.');
        LinqHelper.validateOptionalFunction(comparer, 'Invalid comparer.');

        // So sad--ES6's Set class does not allow for custom equality comparison, so have to use
        // groupBy instead of Set, which would perform more quickly.
        return this.groupBy(keySelector, null, comparer).select(x => x.values[0]);
    }

    /**
     * Returns the element of 'this' collection located at the ordinal position given by `index` (a zero-based 
     * index).  If that position is either less than zero or greater than or equal to the size of 'this' 
     * collection, then an error will be thrown.
     * 
     * @param {number} index - The zero-based index of the element to return
     * @returns {*}
     */
    elementAt(index)
    {
        let createError = () => new Error('Invalid index.');

        if ((index == null) || isNaN(index) || (index < 0))
            throw createError();

        let iterable = this.toIterable();

        if (LinqHelper.isCollectionHavingLength(iterable) && (index >= iterable.length))
            throw createError();

        if (LinqHelper.isCollectionHavingSize(iterable) && (index >= iterable.size))
            throw createError();

        if (LinqHelper.isIndexedCollection(iterable))
            return iterable[index];

        let counter = 0;

        for (let item of iterable)
        {
            if (counter === index)
                return item;

            counter += 1;
        }

        throw createError();
    }


    
    /**
     * Returns either the first element of 'this' collection (if `predicate` is not given) or the
     * first element of 'this' collection that satisfies the `predicate` (if `predicate` is given).
     * If there is no "first" element to return (either because 'this' collection is empty or no element
     * satisfies the `predicate`), the `defaultValue` is returned.
     * 
     * @param {predicate} [predicate] - The predicate function used to determine the element to return 
     * @param {*} [defaultValue] - The value to return if no "first" element is found
     * @returns {*} - The element that was found.
     */
    firstOrDefault(predicate, defaultValue)
    {
        LinqHelper.validateOptionalFunction(predicate, 'Invalid predicate.');

        let iterable = this.toIterable();

        return LinqHelper.firstBasedOperator(iterable, predicate, defaultValue, false);
    }



    /**
     * Return a collection of groupings (i.e., objects with a property called 'key' that
     * contains the grouping key and a property called 'values' that contains an array
     * of elements that are grouped under the grouping key).  The array of elements grouped
     * under the grouping key will be elements of 'this' collection (if no `elementSelector` 
     * is given) or projected elements given by `elementSelector`.  The grouping key for 
     * each element in 'this' collection is given by the `keySelector` function.  If a
     * `keyComparer` function is given, it will be used to determine equality among the
     * grouping keys (if `comparer` is not given, it the "===" operator will be used).
     * 
     * @param {projection} keySelector - The function that returns the grouping key for an element 
     * @param {projection} [elementSelector] - The function that projects elements to be returned 
     * @param {comparer|equalityComparer} [keyComparer] - The function used to compare grouping keys
     * @returns {Linq} - A Linq object representing a collection of `Grouping` objects.
     */
    groupBy(keySelector, elementSelector, keyComparer)
    {
        LinqHelper.validateRequiredFunction(keySelector, 'Invalid key selector.');
        LinqHelper.validateOptionalFunction(elementSelector, 'Invalid element selector.');
        LinqHelper.validateOptionalFunction(keyComparer, 'Invalid key comparer.');

        if (keyComparer != null)
            keyComparer = Linq.normalizeComparer(keyComparer);

        let iterable = this.toIterable();
        let groupings = [];
        let groupingsLinq = new Linq(groupings);

        for (let item of iterable)
        {
            let key = keySelector(item);
            let element = (elementSelector == null ? item : elementSelector(item));

            let foundGroup = groupingsLinq.firstOrDefault(x =>
                {
                    if (keyComparer == null)
                        return (x.key === key);
                    else
                        return keyComparer(x.key, key);
                    },
                null);

            if (foundGroup == null)
                groupings.push(new Grouping(key, [element]));
            else
                foundGroup.values.push(element);
        }

        return groupingsLinq;
    }

    

    /**
     * Returns a collection of values projected from the elements of 'this' collection.
     * 
     * @param {projection} selector - The function that projects the values from the elements
     * @returns {Linq}
     */
    select(selector)
    {
        LinqHelper.validateRequiredFunction(selector, 'Invalid selector.');

        let iterable = this.toIterable();

        function* selectGenerator()
        {
            for (let item of iterable)
            {
                yield selector(item);
            }
        }

        return new Linq(selectGenerator);
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
