/*
    $linq Version 2.0.0 (by Kurtis Jones @ https://github.com/battousai999/js-linq)
*/

class LinqInternal
{
    static convertToString(value) { return (value == null ? null : value.toString()); }
    static convertToNumber(value) { return (Linq.isNumber(value) ? value : NaN); }    
    static isConstructorCompatibleSource(source) { return Linq.isIterable(source) || Linq.isGenerator(source) || Linq.isFunction(source) || Linq.isLinq(source); }
    static isStringNullOrEmpty(str) { return (str == null || str === ''); }
    static isTypedArray(x) { return ArrayBuffer.isView(x) && !(x instanceof DataView); }
    static isIndexedCollection(x) { return Array.isArray(x) || Linq.isString(x) || LinqInternal.isTypedArray(x); }
    static isCollectionHavingLength(x) { return LinqInternal.isIndexedCollection(x); }
    static isCollectionHavingSize(x) { return (x instanceof Set) || (x instanceof Map); }
    static isCollectionHavingExplicitCardinality(x) { return LinqInternal.isCollectionHavingLength(x) || LinqInternal.isCollectionHavingSize(x); }
    
    static getExplicitCardinality(x) 
    {
        if (LinqInternal.isCollectionHavingLength(x))
            return x.length;
            
        if (LinqInternal.isCollectionHavingSize(x))
            return x.size;

        return null;
    }

    static isEmptyIterable(iterable)
    {
        if (LinqInternal.isCollectionHavingExplicitCardinality(iterable))
            return (LinqInternal.getExplicitCardinality(iterable) === 0);

        let iterator = LinqInternal.getIterator(iterable);
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

    static lastBasedOperator(iterable, predicate, defaultValue, throwIfNotFound)
    {
        if (LinqInternal.isIndexedCollection(iterable) && LinqInternal.isCollectionHavingExplicitCardinality(iterable))
        {
            let length = LinqInternal.getExplicitCardinality(iterable);

            for (let i = length - 1; i >= 0; i--)
            {
                let item = iterable[i];

                if ((predicate == null) || predicate(item))
                    return item;
            }
        }
        else
        {
            let foundElement;
            let isFound = false;

            for (let item of iterable)
            {
                if ((predicate == null) || predicate(item))
                {
                    foundElement = item;
                    isFound = true;
                }
            }

            if (isFound)
                return foundElement;
        }

        if (throwIfNotFound)
            throw new Error('No last item was found in the collection.');
        else
            return defaultValue;
    }

    static elementAtBasedOperator(index, iterableFunc, outOfBoundsFunc)
    {
        if ((index == null) || isNaN(index) || (index < 0))
            return outOfBoundsFunc();

        let iterable = iterableFunc();

        if (LinqInternal.isCollectionHavingExplicitCardinality(iterable) && (index >= LinqInternal.getExplicitCardinality(iterable)))
            return outOfBoundsFunc();

        if (LinqInternal.isIndexedCollection(iterable))
            return iterable[index];

        let counter = 0;

        for (let item of iterable)
        {
            if (counter === index)
                return item;

            counter += 1;
        }

        return outOfBoundsFunc();
    }

    static normalizeComparerOrDefault(comparer)
    {
        return (comparer == null ? Linq.strictComparer : Linq.normalizeComparer(comparer));
    }

    static ensureLinq(collection)
    {
        return (Linq.isLinq(collection) ? collection : new Linq(collection));
    }

    static buildContainsEvaluator(iterable, normalizedComparer)
    {
        return x =>
        {
            for (let item of iterable)
            {
                if (normalizedComparer(x, item))
                    return true;
            }

            return false;    
        };
    }

    static createDeferredSort(keySelector, comparer, isReverse, parent = null)
    {
        return {
            keySelector,
            comparer,
            isReverse,
            parent
        };
    }

    static performDeferredSort(buffer, deferredSort)
    {
        let sortChain = LinqInternal.buildSortChain(deferredSort);

        let compare = (x, y, info) =>
        {
            let value;

            if (info.isReverse)
                value = info.comparer(info.keySelector(y), info.keySelector(x));
            else
                value = info.comparer(info.keySelector(x), info.keySelector(y));

            if (value === 0)
            {
                if (info.next == null)
                    return 0;

                return compare(x, y, info.next);
            }
            else
                return value;
        };

        buffer.sort((x, y) => compare(x, y, sortChain));
    }

    static buildSortChain(deferredSort)
    {
        let helper = (ds, child) =>
        {
            let chainItem = {
                keySelector: ds.keySelector,
                comparer: ds.comparer,
                isReverse: ds.isReverse,
                next: child
            };

            if (ds.parent == null)
                return chainItem;

            return helper(ds.parent, chainItem);
        };

        return helper(deferredSort, null);
    }

    static orderByBasedOperator(originalLinq, keySelector, comparer, isReverse)
    {
        LinqInternal.validateRequiredFunction(keySelector);
        LinqInternal.validateOptionalFunction(comparer);

        if (comparer == null)
            comparer = Linq.generalComparer;

        let linq = new Linq(originalLinq);

        linq[deferredSortSymbol] = LinqInternal.createDeferredSort(keySelector, comparer, isReverse);

        return linq;
    }

    static thenByBasedOperator(originalLinq, keySelector, comparer, isReverse)
    {
        LinqInternal.validateRequiredFunction(keySelector);
        LinqInternal.validateOptionalFunction(comparer);

        let parentDeferredSort = originalLinq[deferredSortSymbol];

        if (parentDeferredSort == null)
            throw new Error(`${isReverse ? 'ThenByDescending' : 'ThenBy'} can only be called following OrderBy, OrderByDescending, ThenBy, or ThenByDescending.`);

        if (comparer == null)
            comparer = Linq.generalComparer;

        let linq = new Linq(originalLinq);

        linq[deferredSortSymbol] = LinqInternal.createDeferredSort(keySelector, comparer, isReverse, parentDeferredSort);

        return linq;
    }

    static getExtremeValue(linq, iterable, compareSelector, isMoreExtremeFunc, resultSelector)
    {
        let aggregationFunc = (extremeItem, x) =>
        {
            let extremeValue = compareSelector(extremeItem);
            let tempValue = compareSelector(x);

            return (isMoreExtremeFunc(tempValue, extremeValue) ? x : extremeItem);
        };

        return linq.aggregate(null, aggregationFunc, resultSelector);
    }

    static minComparer(x, y) { return x < y; }
    static maxComparer(x, y) { return x > y; }
}

// Used in the Linq.isGenerator() function to test for being a generator.
var GeneratorFunction = (function*(){}).constructor;

var deferredSortSymbol = Symbol('Provides private-like access for a deferredSort property.');

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
     * A function that can act as a projection function (i.e., projects a value into some other value),
     * but also passes in the positional, zero-based index of the element.
     * @callback indexedProjection
     * @param {*} value - The value to be projected
     * @param {number} [index] - The zero-based index of the value
     * @returns {*} - The projected value.
     */

    /**
     * A function that projects two values into a third value.
     * @callback biSourceProjection
     * @param {*} firstValue - The first of the values to involve in the projection
     * @param {*} secondValue - The second of the values to involve in the projection
     * @returns {*} - The projected value.
     */

    /**
     * A function that projects a value into a LinqCompatible value
     * @callback collectionProjection
     * @param {*} value - The value to be projected
     * @returns {LinqCompatible} - The projected set of values
     */

    /**
     * A function that can act as a predicate function (i.e., projects a value to a boolean value).
     * @callback predicate
     * @param {*} value - The value to test
     * @returns {boolean}
     */

     /**
      * A function that acts upon a value.
      * @callback action
      * @param {*} value - The value upon which to act
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
     * A function that aggregates two values into a single value.
     * @callback aggregator
     * @param {*} acc - The seed or previously-accumulated value
     * @param {*} value - The new value to aggregate
     * @returns {*} - The new, accumulated value
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

        if (LinqInternal.isConstructorCompatibleSource(source))
            this.source = source;
        else
            throw new Error('The \'source\' is neither an iterable, a generator, nor a function that returns such.');
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
    static strictComparer(x, y) { return x === y; }
    static defaultStringComparer(x, y) { return Linq.caseSensitiveStringComparer(x, y); }

    static caseSensitiveStringComparer(x, y) 
    { 
        let normalize = value => (value == null ? null : LinqInternal.convertToString(value));

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

        let normalizedComparer = LinqInternal.normalizeComparerOrDefault(comparer);

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
        if (source == null || LinqInternal.isConstructorCompatibleSource(source))
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

        return new Linq(LinqInternal.buildRangeGenerator(from, to, step));
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

        return new Linq(LinqInternal.buildRepeatGenerator(item, repetitions));
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

        if (LinqInternal.isStringNullOrEmpty(keyPropertyName))
            keyPropertyName = 'key';

        if (LinqInternal.isStringNullOrEmpty(valuePropertyName))
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
     * @param {aggregator} operation - The function to use to aggregate the values of 'this' collection
     * @param {projection} [resultSelector] - The function that projects the final value to the returned result
     * @returns {*} - The aggregate value.
     */
    aggregate(seed, operation, resultSelector)
    {
        LinqInternal.validateRequiredFunction(operation, "Invalid operation.");
        LinqInternal.validateOptionalFunction(resultSelector, "Invalid result selector.");

        let iterator = LinqInternal.getIterator(this.toIterable());
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
        LinqInternal.validateRequiredFunction(predicate, 'Invalid predicate.');

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
        LinqInternal.validateOptionalFunction(predicate, 'Invalid predicate.');

        let iterable = this.toIterable();

        if (predicate == null)
            return !LinqInternal.isEmptyIterable(iterable);

        for (let item of iterable)
        {
            if (predicate(item))
                return true;
        }

        return false;
    }

    /**
     * Returns a collection containing the same elements as the 'this' collection but also including
     * the `value` element appended to the end.
     * 
     * @param {*} value - The value to append to the 'this' collection
     * @returs {Linq}
     */
    append(value)
    {
        let iterable = this.toIterable();

        function* appendGenerator()
        {
            for (let item of iterable)
            {
                yield item;
            }

            yield value;
        }

        return new Linq(appendGenerator);
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
        LinqInternal.validateOptionalFunction(selector, 'Invalid selector.');

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
        LinqInternal.validateOptionalFunction(resultSelector, 'Invalid result selector.');

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

        var secondLinq = LinqInternal.ensureLinq(second);

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
        LinqInternal.validateOptionalFunction(comparer, 'Invalid comparer.');

        let normalizedComparer = LinqInternal.normalizeComparerOrDefault(comparer);
        let iterable = this.toIterable();
        let evaluator = LinqInternal.buildContainsEvaluator(iterable, normalizedComparer);

        return evaluator(item);
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
        LinqInternal.validateOptionalFunction(predicate, 'Invalid predicate.');

        let iterable = this.toIterable();

        if (predicate == null && LinqInternal.isCollectionHavingExplicitCardinality(iterable))
            return LinqInternal.getExplicitCardinality(iterable);

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

        if (LinqInternal.isEmptyIterable(iterable))
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
        LinqInternal.validateRequiredFunction(keySelector, 'Invalid key selector.');
        LinqInternal.validateOptionalFunction(comparer, 'Invalid comparer.');

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
        return LinqInternal.elementAtBasedOperator(index,
            () => this.toIterable(),
            () => { throw new Error('Invalid index.'); });
    }

    /**
     * Returns either the element of 'this' collection located at the ordinal position given by `index` (a
     * zero-based index), if the `index` is contained within the bounds of 'this' collection, or the `defaultValue`,
     * if the `index` is not contained within the bounds of 'this' collection.
     * 
     * @param {number} index - The zero-based index of the element to return
     * @param {*} defaultValue - The value to return if the `index` is outside the bounds of 'this' collection
     * @returns {*}
     */
    elementAtOrDefault(index, defaultValue)
    {
        return LinqInternal.elementAtBasedOperator(index, 
            () => this.toIterable(),
            () => defaultValue);
    }

    /**
     * Returns 'this' collection "zipped-up" with the `second` collection such that each value of the
     * returned collection is the value projected from the corresponding element from each of 'this'
     * collection and the `second` collection.  If the size of 'this' collection and the `second` 
     * collection are not equal, then an exception will be thrown.
     * 
     * @param {LinqCompatible} second - The collection to zip with 'this' collection 
     * @param {projection} [resultSelector] - The function to use to project the result values
     * @returns {Linq}
     */
    equiZip(second, resultSelector)
    {
        LinqInternal.validateOptionalFunction(resultSelector, 'Invalid result selector.');

        if (resultSelector == null)
            resultSelector = Linq.tuple;

        let secondLinq = LinqInternal.ensureLinq(second);
        let firstIterable = this.toIterable();
        let secondIterable = secondLinq.toIterable();

        if (LinqInternal.isCollectionHavingExplicitCardinality(firstIterable) &&
            LinqInternal.isCollectionHavingExplicitCardinality(secondIterable) &&
            (LinqInternal.getExplicitCardinality(firstIterable) !== LinqInternal.getExplicitCardinality(secondIterable)))
        {
            throw new Error('The two collections being equi-zipped are not of equal lengths.');
        }

        function* equizipGenerator()
        {
            let firstIterator = LinqInternal.getIterator(firstIterable);
            let secondIterator = LinqInternal.getIterator(secondIterable);

            let firstState = firstIterator.next();
            let secondState = secondIterator.next();

            while (!firstState.done)
            {
                if (secondState.done)
                    throw new Error('Second collection is too short.');

                yield resultSelector(firstState.value, secondState.value);

                firstState = firstIterator.next();
                secondState = secondIterator.next();
            }

            if (!secondState.done)
                throw new Error('First collection is too short.');
        }

        return new Linq(equizipGenerator);
    }

    /**
     * Returns elements in 'this' collection that do not also exist in the `second` collection, using `comparer`
     * (if it is given) to determine whether two items are equal.  Also, the returned elements will not include
     * duplicates from 'this' collection. If `comparer` is not given, the "===" operator is used to compare elements.
     * 
     * @param {LinqCompatible} second - The collection to use to exlude elements
     * @param {comparer|equalityComparer} [comparer] - The function used to compare elements 
     */
    except(second, comparer)
    {
        LinqInternal.validateOptionalFunction(comparer, 'Invalid comparer.');

        let normalizedComparer = LinqInternal.normalizeComparerOrDefault(comparer);
        let secondLinq = LinqInternal.ensureLinq(second);

        let firstIterable = this.toIterable();
        let secondIterable = secondLinq.toIterable();

        let isInSecond = LinqInternal.buildContainsEvaluator(secondIterable, normalizedComparer);

        // Unfortunately, no Set class with custom equality comparison--so has to be done in a much less-efficient way
        let seenList = [];
        let seenLinq = new Linq(seenList);
        let isAlreadySeen = x => 
        {
            let isSeen = seenLinq.contains(x, normalizedComparer);

            if (!isSeen)
                seenList.push(x);

            return isSeen;
        };

        function* exceptGenerator()
        {
            for (let item of firstIterable)
            {
                if (!isInSecond(item) && !isAlreadySeen(item))
                    yield item;
            }
        }

        return new Linq(exceptGenerator);
    }

    /**
     * Returns either the first element of 'this' collection (if 'predicate' is not given) or the 
     * first element of 'this' collection that satisfies the 'predicate' (if 'predicate' is given).
     * If there is no "first" element to return (either because 'this' collection is empty or no element 
     * satisfies the 'predicate'), an error is thrown.
     * 
     * @param {predicate} [predicate] - The predicate function used to determine the element to return
     * @returns {*}
     */
    first(predicate)
    {
        LinqInternal.validateOptionalFunction(predicate, 'Invalid predicate.');

        let iterable = this.toIterable();

        return LinqInternal.firstBasedOperator(iterable, predicate, null, true);
    }
    
    /**
     * Returns either the first element of 'this' collection (if `predicate` is not given) or the
     * first element of 'this' collection that satisfies the `predicate` (if `predicate` is given).
     * If there is no "first" element to return (either because 'this' collection is empty or no element
     * satisfies the `predicate`), the `defaultValue` is returned.
     * 
     * @param {predicate} [predicate] - The predicate function used to determine the element to return 
     * @param {*} [defaultValue] - The value to return if no "first" element is found
     * @returns {*}
     */
    firstOrDefault(predicate, defaultValue)
    {
        LinqInternal.validateOptionalFunction(predicate, 'Invalid predicate.');

        let iterable = this.toIterable();

        return LinqInternal.firstBasedOperator(iterable, predicate, defaultValue, false);
    }

    /**
     * Executes the given `action` on each element of 'this' collection.
     * @param {action} action - The function that is executed for each element 
     */
    foreach(action)
    {
        LinqInternal.validateRequiredFunction(action, 'Invalid action.');

        let iterable = this.toIterable();
        let counter = 0;

        for (let item of iterable)
        {
            action(item, counter);

            counter += 1;
        }
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
        LinqInternal.validateRequiredFunction(keySelector, 'Invalid key selector.');
        LinqInternal.validateOptionalFunction(elementSelector, 'Invalid element selector.');
        LinqInternal.validateOptionalFunction(keyComparer, 'Invalid key comparer.');

        let normalizedKeyComparer = LinqInternal.normalizeComparerOrDefault(keyComparer);

        let iterable = this.toIterable();
        let groupings = [];
        let groupingsLinq = new Linq(groupings);

        for (let item of iterable)
        {
            let key = keySelector(item);
            let element = (elementSelector == null ? item : elementSelector(item));

            let foundGroup = groupingsLinq.firstOrDefault(x => normalizedKeyComparer(x.key, key), null);

            if (foundGroup == null)
                groupings.push(new Grouping(key, [element]));
            else
                foundGroup.values.push(element);
        }

        return groupingsLinq;
    }

    /**
     * Returns a "left outer" join of 'this' collection (the "outer" collection) and the `inner`
     * collection, using the `outerKeySelector` and `innerKeySelector` to project the keys from 
     * each collection, and using the `keyComparer` function (if it is given) to compare the
     * projected keys.  If the `keyComparer` is not given, the "===" operator will be used to 
     * compare the projected keys.  The `resultSelector` function is used to convert the joined 
     * results into the results that are returned by the groupJoin function.  The `resultSelector` 
     * takes as parameters the outer object (of the join) and an array of the joined inner objects 
     * (this array will be an empty array if there were no inner elements associated with the outer
     * element).
     * 
     * @param {LinqCompatible} inner - The collection that is "left-outer" joined with 'this' collection
     * @param {projection} outerKeySelector - The function that projects the key for the outer elements (in 'this' collection)
     * @param {projection} innerKeySelector - The function that projects the key for the inner elements
     * @param {biSourceProjection} resultSelector - The function that converts the joined results into the results returned
     * @param {comparer|equalityComparer} [keyComparer] - The function used to compare the projected keys
     * @returns {Linq}
     */
    groupJoin(inner, outerKeySelector, innerKeySelector, resultSelector, keyComparer)
    {
        if (inner == null)
            throw new Error('Invalid inner collection.');

        LinqInternal.validateRequiredFunction(outerKeySelector, 'Invalid outer key selector.');
        LinqInternal.validateRequiredFunction(innerKeySelector, 'Invalid inner key selector.');
        LinqInternal.validateRequiredFunction(resultSelector, 'Invalid result selector.');
        LinqInternal.validateOptionalFunction(keyComparer, 'Invalid key comparer.');

        let normalizedKeyComparer = LinqInternal.normalizeComparerOrDefault(keyComparer);
        let innerLinq = LinqInternal.ensureLinq(inner);
        let iterable = this.toIterable();
        let groupings = innerLinq.groupBy(innerKeySelector, null, keyComparer);
        let results = [];

        for (let item of iterable)
        {
            let outerKey = outerKeySelector(item);

            let groupValues = groupings.firstOrDefault(x => normalizedKeyComparer(x.key, outerKey));

            results.push(resultSelector(item, (groupValues == null ? [] : groupValues.values)));
        }

        return new Linq(results);
    }

    /**
     * Returns a collection of objects with the "key" property of each object equal to either the zero-based
     * index of the element in 'this' collection (if `startIndex` is not given) or the index, starting at
     * `startIndex`, of the element in 'this' collection, and with the "value" property of the object equal to
     * the element in 'this' collection.
     * 
     * @param {number} [startIndex] - The starting index for the results (defaults to `0`)
     */
    index(startIndex)
    {
        if (startIndex == null)
            startIndex = 0;

        if (isNaN(startIndex))
            throw new Error('Invalid startIndex.');

        return this.select((x, i) => ({ key: (startIndex + i), value: x }));
    }

    /**
     * Returns the index of the first element that satisfies the `predicate`.  Returns the value "-1" if
     * none of the elements satisfy the `predicate`.
     * 
     * @param {predicate} predicate - The function used to determine which index to return
     * @returns {number}
     */
    indexOf(predicate)
    {
        LinqInternal.validateRequiredFunction(predicate, 'Invalid predicate.');

        let iterable = this.toIterable();
        let counter = 0;

        for (let item of iterable)
        {
            if (predicate(item))
                return counter;

            counter += 1;
        }

        return -1;
    }

    /**
     * Returns the index of the first element to be equal to the given `element`.  If the optional `comparer` 
     * function is given, then the `comparer` function is used to determine equality between the elements 
     * of 'this' collection and the given `element`.
     * 
     * @param {*} element - The element to find within the collection
     * @param {comparer|equalityComparer} [comparer] = The function used to compare the elements of the collection
     * @returns {number}
     */
    indexOfElement(element, comparer)
    {
        LinqInternal.validateOptionalFunction(comparer, 'Invalid comparer.');

        let normalizedComparer = LinqInternal.normalizeComparerOrDefault(comparer);
        let iterable = this.toIterable();
        let counter = 0;

        for (let item of iterable)
        {
            if (normalizedComparer(element, item))
                return counter;

            counter += 1;
        }

        return -1;
    }

    /**
     * Returns the intersection of elements in 'this' collection and the `second` collection, using the
     * `comparer` function to determine whether two different elements are equal.  If the `comparer` 
     * function is not given, then the "===" operator will be used to compare elements.
     * 
     * @param {LinqCompatible} second - The collection of elements to test for intersection
     * @param {comparer|equalityComparer} [comparer] - The function used to compare elements
     * @returns {Linq}
     */
    intersect(second, comparer)
    {
        LinqInternal.validateOptionalFunction(comparer, 'Invalid comparer.');

        let secondLinq = LinqInternal.ensureLinq(second);
        let normalizedComparer = LinqInternal.normalizeComparerOrDefault(comparer);

        let firstIterable = this.toIterable();
        let secondIterable = secondLinq.toIterable();

        let isInSecond = LinqInternal.buildContainsEvaluator(secondIterable, normalizedComparer);

        // Unfortunately, no Set class with custom equality comparison--so has to be done in a much less-efficient way
        let seenList = [];
        let seenLinq = new Linq(seenList);
        let isAlreadySeen = x => 
        {
            let isSeen = seenLinq.contains(x, normalizedComparer);

            if (!isSeen)
                seenList.push(x);

            return isSeen;
        };

        function* intersectGenerator()
        {
            for (let item of firstIterable)
            {
                if (isInSecond(item) && !isAlreadySeen(item))
                    yield item;
            }
        }

        return new Linq(intersectGenerator);
    }

    /**
     * Returns an "inner" join of 'this' collection (the "outer" collection) and the `inner`
     * collection, using the `outerKeySelector` and `innerKeySelector` functions to project the
     * keys from each collection, and using the `keyComparer` function (if it is given) to compare
     * the projected keys.  If the `keyComparer` is not given, the "===" operator will be used to 
     * compare the projected keys.  The `resultSelector` function is used to convert the joined
     * results into the results that are returned by the join function.  The `resultSelector` 
     * function takes as parameters the outer object and the inner object of the join.
     * 
     * @param {LinqCompatible} inner - The collection that is "inner" joined with 'this' collection
     * @param {projection} outerKeySelector - The function that projects the key for the outer elements (in 'this' collection)
     * @param {projection} innerKeySelector - The function that projects the key for the inner elements
     * @param {biSourceProjection} resultSelector - The function that converts the joined results into results returned
     * @param {comparer|equalityComparer} [keyComparer] - The function used to compare the projected keys
     */
    join(inner, outerKeySelector, innerKeySelector, resultSelector, keyComparer)
    {
        if (inner == null)
            throw new Error('Invalid inner collection.');

        LinqInternal.validateRequiredFunction(outerKeySelector, 'Invalid outer key selector.');
        LinqInternal.validateRequiredFunction(innerKeySelector, 'Invalid inner key selector.');
        LinqInternal.validateRequiredFunction(resultSelector, 'Invalid result selector.');
        LinqInternal.validateOptionalFunction(keyComparer, 'Invalid key comparer.');

        let innerLinq = LinqInternal.ensureLinq(inner);
        let normalizedComparer = LinqInternal.normalizeComparerOrDefault(keyComparer);
        let innerGroupings = innerLinq.groupBy(innerKeySelector, null, normalizedComparer);
        let outerIterable = this.toIterable();

        function* joinGenerator()
        {
            for (let item of outerIterable)
            {
                let outerKey = outerKeySelector(item);
                let groupValues = innerGroupings.firstOrDefault(x => normalizedComparer(x.key, outerKey));

                if ((groupValues != null) && (groupValues.values.length > 0))
                {
                    for (let groupItem of groupValues.values)
                    {
                        yield resultSelector(item, groupItem);
                    }
                }
            }
        }

        return new Linq(joinGenerator);
    }

    /**
     * Returns either the last element of 'this' collection (if `predicate` is not given) or the
     * last element of 'this' collection that satisfies the `predicate` (if `predicate` is given).
     * If there is no "last" element to return (either because 'this' collection is empty or no element
     * satisfies the `predicate`), an error is thrown.
     * 
     * @param {predicate} [predicate] - The function used to determine the element to return
     * @returns {*}
     */
    last(predicate)
    {
        LinqInternal.validateOptionalFunction(predicate, 'Invalid predicate.');

        let iterable = this.toIterable();

        return LinqInternal.lastBasedOperator(iterable, predicate, null, true);
    }

    /**
     * Returns the index of the last element that satisfies the `predicate`.  Returns the value "-1" if
     * none of the elements satisfy the `predicate`.
     * 
     * @param {predicate} predicate - The function used to determine which index to return
     * @returns {number}
     */
    lastIndexOf(predicate)
    {
        LinqInternal.validateRequiredFunction(predicate, 'Invalid predicate.');

        let element = this.index()
            .where(x => predicate(x.value))
            .reverse()
            .firstOrDefault();

        return (element == null ? -1 : element.key);
    }

    /**
     * Returns the index of the last element to be equal to the given `item`.  If the optional `comparer` 
     * function is given, then the `comparer` function is used to determine equality between the elements 
     * of 'this' collection and the given 'item'.
     * 
     * @param {*} item - The item to find within 'this' collection
     * @param {comparer|equalityComparer} [comparer] - The function used to compare the elements of 'this' collection with the given `item`
     * @returns {*} 
     */
    lastIndexOfElement(item, comparer)
    {
        LinqInternal.validateOptionalFunction(comparer, 'Invalid comparer.');

        let normalizedComparer = LinqInternal.normalizeComparerOrDefault(comparer);

        return this.lastIndexOf(x => normalizedComparer(x, item));
    }

    /**
     * Returns either the last element of 'this' collection (if 'predicate' is not given) or the
     * last element of 'this' collection that satisfies the 'predicate' (if 'predicate is given).
     * If there is no "last" element to return (either because 'this' collection is empty or no element
     * satisfies the 'predicate'), the 'defaultValue' is returned.
     * 
     * @param {predicate} [predicate] - The predicate function used to determine the element to return 
     * @param {*} [defaultValue] - The value to return if no "last" element is found
     * @returns {*} 
     */
    lastOrDefault(predicate, defaultValue)
    {
        LinqInternal.validateOptionalFunction(predicate, 'Invalid predicate.');

        let iterable = this.toIterable();

        return LinqInternal.lastBasedOperator(iterable, predicate, defaultValue, false);
    }

    /**
     * Returns either the minimum element (if `selector` is not given) or the minimum element projected by 
     * the `selector` function in 'this' collection.  If 'this' collection is empty, an error is thrown.
     * 
     * @param {projection} [selector] - The function that projects the value to use to determine a minimum
     * @returns {*} 
     */
    min(selector)
    {
        LinqInternal.validateOptionalFunction(selector, 'Invalid selector.');        

        let iterable = this.toIterable();

        if (LinqInternal.isEmptyIterable(iterable))
            throw new Error('No minimum element.');
        
        if (selector == null)
            selector = Linq.identity;

        return LinqInternal.getExtremeValue(this, iterable, selector, LinqInternal.minComparer, selector);
    }

    /**
     * Returns the "minimum" element of 'this' collection, determined by the value projected by 
     * the `selector` function.  If 'this' collection is empty, an error is thrown.
     * 
     * @param {projection} selector - The function that projects the value to use to determine a minimum
     * @returns {*}
     */
    minBy(selector)
    {
        LinqInternal.validateRequiredFunction(selector, 'Invalid selector.');

        let iterable = this.toIterable();

        if (LinqInternal.isEmptyIterable(iterable))
            throw new Error('No minimum element.');

        return LinqInternal.getExtremeValue(this, iterable, selector, LinqInternal.minComparer, Linq.identity);
    }

    /**
     * Returns either the maximum element (if `selector` is not given) or the maximum element projected by 
     * the `selector` function in 'this' collection.  If 'this' collection is empty, an error is thrown.
     * 
     * @param {projection} [selector] - The function that projects the value to use to determine the maximum
     * @returns {*} 
     */
    max(selector)
    {
        LinqInternal.validateOptionalFunction(selector, 'Invalid selector.');

        let iterable = this.toIterable();

        if (LinqInternal.isEmptyIterable(iterable))
            throw new Error('No maximum element.');

        if (selector == null)
            selector = Linq.identity;

        return LinqInternal.getExtremeValue(this, iterable, selector, LinqInternal.maxComparer, selector);
    }

    /**
     * Returns the "maximum" element of 'this' collection, determined by the value projected by 
     * the `selector` function.  If 'this' collection is empty, an error is thrown.
     * 
     * @param {projection} selector - The function that projects the value to use to determine the maximum
     * @returns {*} 
     */
    maxBy(selector)
    {
        LinqInternal.validateRequiredFunction(selector, 'Invalid selector.');

        let iterable = this.toIterable();

        if (LinqInternal.isEmptyIterable(iterable))
            throw new Error('No maximum element.');

        return LinqInternal.getExtremeValue(this, iterable, selector, LinqInternal.maxComparer, Linq.identity);
    }

    /**
     * Returns the elements of 'this' collection sorted in ascending order of the projected value
     * given by the `keySelector` function, using the `comparer` function to compare the projected
     * values.  If the `comparer` function is not given, a comparer that uses the natural ordering 
     * of the values will be used to compare the projected values.  Note that subsequent, immediate 
     * calls to either thenBy or thenByDescending will provide subsequent "levels" of sorting (that 
     * is, sorting when two elements are determined to be equal by this orderBy call).
     * 
     * @param {projection} keySelector - The function that projects the value used to sort the elements
     * @param {comparer} [comparer] - The function that compares the projected values
     * @returns {Linq}
     */
    orderBy(keySelector, comparer)
    {
        return LinqInternal.orderByBasedOperator(this, keySelector, comparer, false);
    }

    /**
     * Returns the elements of 'this' collection sorted in descending order of the projected value
     * given by the `keySelector` function, using the `comparer` function to compare the projected
     * values.  If the `comparer` function is not given, a comparer that uses the natural ordering 
     * of the values will be used to compare the projected values.  Note that subsequent, immediate 
     * calls to either thenBy or thenByDescending will provide subsequent "levels" of sorting (that 
     * is, sorting when two elements are determined to be equal by this orderBy call).
     * 
     * @param {projection} keySelector - The function that projects the value used to sort the elements
     * @param {comparer} [comparer] - The function that compares the projected values
     * @returns {Linq}
     */
    orderByDescending(keySelector, comparer)
    {
        return LinqInternal.orderByBasedOperator(this, keySelector, comparer, true);
    }

    /**
     * Returns a collection the same elements as 'this' collection but with extra elements added 
     * to the end so that the results collection has a length of at least `width`.  The extra
     * elements that are added are equal to the `padding` value.
     * 
     * @param {number} width - The length that the results collection will be at least equal to
     * @param {*} padding - The value that is added to the results collection to fill it out
     * @returns {Linq}
     */
    pad(width, padding)
    {
        return this.padWith(width, () => padding);
    }

    /**
     * Returns a collection the same elements as 'this' collection but with extra elements added 
     * to the end so that the results collection has a length of at least `width`.  The extra
     * elements that are added are determined by the `paddingSelector` function—a function that 
     * takes an integer as a parameter (i.e., the position/index that the element returned by the 
     * `paddingSelector` function will have in the results collection .  
     * 
     * @param {number} width - The length that the results collection will be at least equal to
     * @param {projection} paddingSelector - The function that indicates the value to add to the results collection
     * @returns {Linq}
     */
    padWith(width, paddingSelector)
    {
        if ((width == null) || isNaN(width))
            throw new Error('Invalid width.');

        LinqInternal.validateRequiredFunction(paddingSelector, 'Invalid padding selector.');

        let iterable = this.toIterable();

        function* padWithGenerator()
        {
            let counter = 0;

            for (let item of iterable)
            {
                yield item;
                counter += 1;
            }

            while (counter < width)
            {
                yield paddingSelector(counter);
                counter += 1;
            }
        }

        return new Linq(padWithGenerator);
    }

    /**
     * Returns the same elements as 'this' collection, but first executes an `action` on
     * each element of 'this' collection.
     * 
     * @param {action} action - The function to execute on each element of 'this' collection
     * @returns {Linq}
     */
    pipe(action)
    {
        LinqInternal.validateRequiredFunction(action, 'Invalid action.');

        let iterable = this.toIterable();
        let counter = 0;

        for (let item of iterable)
        {
            action(item, counter);

            counter += 1;
        }

        return new Linq(this.source);
    }

    /**
     * Returns 'this' collection with the `value` prepended (i.e, added to the front).
     * 
     * @param {*} value - The value to be prepended to 'this' collection
     * @returns {Linq}
     */
    prepend(value)
    {
        let iterable = this.toIterable();

        function* prependGenerator()
        {
            yield value;

            for (let item of iterable)
            {
                yield item;
            }
        }

        return new Linq(prependGenerator);
    }

    /**
     * Returns an equal-length collection where the N-th element is the aggregate of the
     * `operation` function performed on the first N-1 elements of 'this' collection (the
     * first element of the results is set to the `identity` value).  The `operation` 
     * function should be a commutative, binary operation (e.g., sum, multiplication, etc.)
     * Also, the `identity` parameter should be passed the value that is the "identity" for
     * the `operation`—that is, when the `operator` is applied to the `identity` value and 
     * any other value, the results is that same value (e.g., for addition, 0 + n = n; for
     * multiplication, 1 * n = n; for string concatenation, "" + str = str; etc.)
     * 
     * @param {aggregator} operation - The function that aggregates the values of 'this' collection 
     * @param {*} identity - The identity value of the operation
     * @returns {Linq}
     */
    prescan(operation, identity)
    {
        LinqInternal.validateRequiredFunction(operation, 'Invalid operation.');

        let iterable = this.toIterable();
        let iterator = LinqInternal.getIterator(iterable);

        function* prescanGenerator()
        {
            let acc = identity;
            let state = iterator.next();

            while (!state.done)
            {
                yield acc;

                let {value} = state;

                state = iterator.next();

                if (!state.done)
                    acc = operation(acc, value);
            }
        }

        return new Linq(prescanGenerator);
    }

    /**
     * Returns the elements of 'this' collection in reverse order.
     * 
     * @returns {Linq}
     */
    reverse()
    {
        let iterable = this.toIterable();

        function* gen()
        {
            for (let i = iterable.length - 1; i >= 0; i--)
            {
                yield iterable[i];
            }
        }

        if (!LinqInternal.isIndexedCollection(iterable) || !LinqInternal.isCollectionHavingLength(iterable))
            iterable = Array.from(iterable);

        return new Linq(gen);
    }

    /**
     * If the `seed` is not given, returns an equal-length collection where the N-th element
     * is the aggregate of the `operation` function performed on the first N elements of
     * 'this' collection.  
     * 
     * If the `seed` is given, then the same as the if the `seed` where not given but on 
     * 'this' collection with the `seed` prepended to it.  Note, that with the `seed` given,
     * this function returns the result of calling `aggregate` (with the same `operation` and
     * `seed`) but with the intermediate aggregation results included with the final aggregation
     * result.
     *   
     * The `operation` function should be a commutative, binary operation (e.g., sum, 
     * multiplication, etc.).
     * 
     * @param {aggregator} operation - The function that aggregates the values of 'this' collection
     * @param {*} [seed] - An initial, seed value that causes scan to generate intermediate values of aggregate function
     * @returns {Linq}
     */
    scan(operation, seed)
    {
        LinqInternal.validateRequiredFunction(operation, 'Invalid operation.');

        let col = (seed === undefined ? this : this.prepend(seed));

        function* scanGenerator()
        {
            let iterable = col.toIterable();
            let iterator = LinqInternal.getIterator(iterable);
            let state = iterator.next();

            if (state.done)
                return;

            let acc = state.value;

            yield acc;

            state = iterator.next();

            while (!state.done)
            {
                acc = operation(acc, state.value);
                yield acc;

                state = iterator.next();
            }
        }

        return new Linq(scanGenerator);
    }

    /**
     * Returns a collection of values projected from the elements of 'this' collection.
     * 
     * @param {indexedProjection} selector - The function that projects the values from the elements
     * @returns {Linq}
     */
    select(selector)
    {
        LinqInternal.validateRequiredFunction(selector, 'Invalid selector.');

        let iterable = this.toIterable();
        let i = 0;

        function* selectGenerator()
        {
            for (let item of iterable)
            {
                yield selector(item, i);

                i += 1;
            }
        }

        return new Linq(selectGenerator);
    }

    /**
     * Returns the concatenation of values projected from the elements of 'this' collection by the
     * `collectionSelector` function.  If the `resultSelector` function is given, then the results
     * returned by this function will be projected from an element in the concatenation and the 
     * element that originated the part of the concatenation.  Otherwise, the results returned by
     * this function will be the element of the concatenation.
     * 
     * @param {collectionProjection} collectionSelector - The function that projects a collection of values from an element
     * @param {projection} [resultSelector] - The function that projects the results from the concatenated results
     * @returns {Linq}
     */
    selectMany(collectionSelector, resultSelector)
    {
        LinqInternal.validateRequiredFunction(collectionSelector, 'Invalid collection selector.');
        LinqInternal.validateOptionalFunction(resultSelector, 'Invalid result selector.');

        var iterable = this.toIterable();

        function* selectManyGenerator()
        {
            let i = 0;

            for (let outerItem of iterable)
            {
                let projectedItems = collectionSelector(outerItem, i);

                i += 1;

                if (projectedItems == null)
                    continue;

                let innerIterable = LinqInternal.ensureLinq(projectedItems).toIterable();

                for (let innerItem of innerIterable)
                {
                    yield (resultSelector == null ? innerItem : resultSelector(innerItem, outerItem));
                }
            }
        }

        return new Linq(selectManyGenerator);
    }

    /**
     * Returns whether 'this' collection is equal to the `second` collection (that is, has the same elements in the
     * same order).  If the `comparer` function is given, it is used to determine whether elements from each of the
     * two collections are equal.  Otherwise, the "===" operator is used to determine equality.
     * 
     * @param {LinqCompatible} second - The collection to which 'this' collection is compared
     * @param {comparer|equalityComparer} [comparer] - The function used to compare elements of the two collections
     * @returns {boolean}
     */
    sequenceEqual(second, comparer)
    {
        LinqInternal.validateOptionalFunction(comparer, 'Invalid comparer.');

        if (second == null)
            return false;

        let normalizedComparer = LinqInternal.normalizeComparerOrDefault(comparer);

        let firstIterable = this.toIterable();
        let secondIterable = LinqInternal.ensureLinq(second).toIterable();
        let firstLength = LinqInternal.getExplicitCardinality(firstIterable);
        let secondLength = LinqInternal.getExplicitCardinality(secondIterable);
        
        if (firstLength != null && secondLength != null && firstLength !== secondLength)
            return false;

        let firstIterator = LinqInternal.getIterator(firstIterable);
        let secondIterator = LinqInternal.getIterator(secondIterable);
        let firstState = firstIterator.next();
        let secondState = secondIterator.next();
        
        while (!firstState.done && !secondState.done)
        {
            if (!normalizedComparer(firstState.value, secondState.value))
                return false;

            firstState = firstIterator.next();
            secondState = secondIterator.next();
        }

        if (!firstState.done || !secondState.done)
            return false;

        return true;
    }



    /**
     * Returns the elements of 'this' collection further sorted (from an immediately preceeding orderBy 
     * call) in ascending order of the projected value given by the `keySelector` function, using the
     * `comparer` function to compare the projected values.  If the `comparer` function is not given,
     * a comparer that uses the natural ordering of the values will be used to compare the projected values.  
     * Note that this thenBy call must be immediately preceeded by either an orderBy, orderByDescending, 
     * thenBy, or thenByDescending call.
     * 
     * @param {projection} keySelector - The function that projects the value used to sort the elements
     * @param {comparer} [comparer] - The function that compares the projected values
     * @returns {Linq}
     */
    thenBy(keySelector, comparer)
    {
        return LinqInternal.thenByBasedOperator(this, keySelector, comparer, false);
    }

    /**
     * Returns the elements of 'this' collection further sorted (from an immediately preceeding orderBy 
     * call) in descending order of the projected value given by the `keySelector` function, using the
     * `comparer` function to compare the projected values.  If the `comparer` function is not given,
     * a comparer that uses the natural ordering of the values will be used to compare the projected values.  
     * Note that this thenBy call must be immediately preceeded by either an orderBy, orderByDescending, 
     * thenBy, or thenByDescending call.
     * 
     * @param {projection} keySelector - The function that projects the value used to sort the elements
     * @param {comparer} [comparer] - The function that compares the projected values
     * @returns {Linq}
     */
    thenByDescending(keySelector, comparer)
    {
        return LinqInternal.thenByBasedOperator(this, keySelector, comparer, true);
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
                return helper(source.source);
            else if (Linq.isIterable(source))
                return source;
            else if (Linq.isGenerator(source))
                return source();
            else if (Linq.isFunction(source))
                return helper(source());
            else 
                throw new Error('Could not return an iterable because the \'source\' was not valid.');
        };

        let iterable = helper(this.source);
        let deferredSort = this[deferredSortSymbol];

        if (deferredSort == null)
            return iterable;

        function* deferredSortGenerator()
        {
            let buffer = Array.from(iterable);

            LinqInternal.performDeferredSort(buffer, deferredSort);

            for (let item of buffer)
            {
                yield item;
            }
        }

        return deferredSortGenerator();
    }

    /**
     * Returns an array that represents the contents of the Linq object.
     */
    toArray()
    {
        return Array.from(this.toIterable());
    }



    /**
     * Returns the elements of 'this' collection that satisfy the `predicate` function.
     * 
     * @param {predicate} predicate 
     * @returns {Linq}
     */
    where(predicate)
    {
        LinqInternal.validateRequiredFunction(predicate, 'Invalid predicate.');

        let iterable = this.toIterable();

        function* whereGenerator()
        {
            for (let item of iterable)
            {
                if (predicate(item))
                    yield item;
            }
        }

        return new Linq(whereGenerator);
    }



    /**
     * Returns 'this' collection "zipped-up" with the `second` collection such that each value of the
     * returned collection is the value projected from the corresponding element from each of 'this'
     * collection and the `second` collection.  If the size of 'this' collection and the `second` 
     * collection are not equal, the size of the returned collection will equal the minimum of the
     * sizes of 'this' collection and the `second` collection.
     * 
     * @param {LinqCompatible} second 
     * @param {biSourceProjection} [resultSelector] 
     */
    zip(second, resultSelector)
    {
        LinqInternal.validateOptionalFunction(resultSelector, 'Invalid result selector.');

        if (resultSelector == null)
            resultSelector = Linq.tuple;

        let secondLinq = LinqInternal.ensureLinq(second);
        let firstIterator = LinqInternal.getIterator(this.toIterable());
        let secondIterator = LinqInternal.getIterator(secondLinq.toIterable());

        function* zipGenerator()
        {
            let firstState = firstIterator.next();
            let secondState = secondIterator.next();

            while (!firstState.done && !secondState.done)
            {
                yield resultSelector(firstState.value, secondState.value);

                firstState = firstIterator.next();
                secondState = secondIterator.next();
            }
        }

        return new Linq(zipGenerator);
    }
}
