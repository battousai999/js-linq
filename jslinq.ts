export class Linq<T>
{
    private array: Array<T>;
    private deferredSort: DeferredSort<T, any> = null;

    // Constructors

    constructor(array: Array<T>, copyArray: boolean = true)
    {
        this.array = (copyArray ? array.slice(0) : array);
        this.deferredSort = null;
    }

    /**
     * Creates a new Linq object from either an Array or another Linq object.
     * @param collection The collection of items around which this created Linq object wraps
     */
    public static from<T>(collection: LinqCompatible<T>): Linq<T>
    {
        if (collection == null)
            return new Linq<T>([]);

        if (collection instanceof Linq)
            return collection;
        else if (collection instanceof Array)
            return new Linq<T>(collection);
        else
            throw new Error('Invalid collection');
    }

    /**
     * Creates a new Linq object that contains a range of integers.
     * @param from The starting value of the range
     * @param to The ending value of the range
     * @param step Optional, the amount by which to increment each iteration of the range
     */
    public static range(from: number, to: number, step: number = 1)
    {
        if (from == null)
            throw new Error('Invalid \'from\' value.');

        if (to == null)
            throw new Error('Invalid \'to\' value.');

        let array = new Array<number>();

        for (let i = from; i <= to; i += step)
        {
            array.push(i);
        }

        return new Linq<number>(array, false);
    }

    /**
     * Create a new Linq object that contains a given number of repetitions of an object.
     * @param item The item to repeat
     * @param repetitions Optional, the number of times to repeat the object (defaults to 1)
     */
    public static repeat<T>(item: T, repetitions: number = 1): Linq<T>
    {
        if (repetitions == null)
            repetitions = 1;

        let array = new Array<T>();

        for (let i = 0; i < repetitions; i++)
        {
            array.push(item);
        }

        return new Linq(array, false);
    }

    /**
     * Create a new Linq object that contains all of the matches for a regex pattern.  Note that
     * 'g' does not need to be added to the flags parameter (it will implicitly be added).
     * @param text The input string for the regular expression
     * @param pattern The pattern string or RegExp object for the regular expression
     * @param flags Optional, the RegExp flags to use (e.g., 'i' = ignore case, 'm' = multiline)
     */
    public static matches(text: string, pattern: string | RegExp, flags: string = ''): Linq<string>
    {
        if (pattern == null)
            throw new Error('Invalid \'pattern\' value.');

        if (text == null)
            return new Linq([], false);

        if (flags == null)
            flags = '';

        if (flags.indexOf('g') < 0)
            flags += 'g';

        let internalPattern: string;

        if (pattern instanceof RegExp)
        {
            if ((flags.indexOf('i') < 0) && pattern.ignoreCase)
                flags += 'i';

            if ((flags.indexOf('m') < 0) && pattern.multiline)
                flags += 'm';

            internalPattern = pattern.source;
        }
        else
            internalPattern = pattern;

        let regex = new RegExp(internalPattern, flags);
        let matches = text.match(regex);

        return new Linq((matches == null ? [] : matches), false);
    }

    /**
     * Create a new Linq object that contains an element for each property of the 'object' passed
     * to the method.  Each element will have a property named by the 'keyPropertyName' parameter
     * whose value will equal the name of the property and a property named by the 'valuePropertyName'
     * parameter whose value will equal the value of the property.  If the 'keyPropertyName'
     * parameter is not given, then it will default to "key"; if the 'valuePropertyName' parameter 
     * is not given, then it will default to "value".
     * @param obj The object from which to enumerate properties
     * @param keyPropertyName Optional, the name of the property in the resultant elements containing the property's key
     * @param valuePropertyName Optional, the name of the property in the resultant elements containing the property's value
     */
    public static properties(obj: any, keyPropertyName?: string, valuePropertyName?: string): Linq<any>
    {
        if (obj == null)
            return new Linq([]);

        if (keyPropertyName == null || keyPropertyName == '')
            keyPropertyName = 'key';
        
        if (valuePropertyName == null || valuePropertyName == '')
            valuePropertyName = 'value';

        let selector = (key: any) =>
        {
            let result: any = {};

            result[keyPropertyName] = key;
            result[valuePropertyName] = obj[key];

            return result;
        };

        return new Linq(Object.keys(obj).map(selector), false);
    }


    // Helper properties and functions

    public static get defaultStringComparer(): Comparer<string>
    {
        return this.caseSensitiveStringComparer;
    }

    public static get caseSensitiveStringComparer(): Comparer<string>
    {
        return this._caseSensitiveStringComparer;
    }

    private static _caseSensitiveStringComparer(x: string, y: string): number
    {
        return this._generalComparer(x, y);
    }

    public static get caseInsensitiveStringComparer(): Comparer<string>
    {
        return this._caseInsensitiveStringComparer;
    }

    private static _caseInsensitiveStringComparer(x: string, y: string): number
    {
        let lowerX = (x == null ? null : x.toLowerCase());
        let lowerY = (y == null ? null : y.toLowerCase());

        return this._caseSensitiveStringComparer(lowerX, lowerY);
    }

    public static get defaultConvertingStringComparer(): Comparer<any>
    {
        return this.caseSensitiveConvertingStringComparer;
    }

    public static get caseSensitiveConvertingStringComparer(): Comparer<any>
    {
        return this._caseSensitiveConvertingStringComparer;
    }

    public static get caseInsensitiveConvertingStringComparer(): Comparer<any>
    {
        return this._caseInsensitiveConvertingStringComparer;
    }

    private static _caseSensitiveConvertingStringComparer: Comparer<any> = Linq.buildConvertingStringComparer(Linq._caseSensitiveStringComparer);
    private static _caseInsensitiveConvertingStringComparer: Comparer<any> = Linq.buildConvertingStringComparer(Linq._caseInsensitiveStringComparer);

    private static buildConvertingStringComparer(comparer: Comparer<string>): Comparer<any>
    {
        return (x: any, y: any) =>
        {
            let convertedX = this.convertToString(x);
            let convertedY = this.convertToString(y);

            return comparer(convertedX, convertedY);
        };
    }

    public static get generalComparer(): Comparer<any>
    {
        return this._generalComparer;
    }

    private static _generalComparer(x: any, y: any): number
    {
        if (x == null && y == null)
            return 0;

        if (x == null)
            return -1;

        if (y == null)
            return 1;

        return (x < y ? -1 : (x > y ? 1 : 0));
    }

    public static normalizeComparer<U>(comparer: Comparer<U> | EqualityComparer<U>): EqualityComparer<U>
    {
        return (x: U, y: U): boolean => 
        {
            let value: any = comparer(x, y);

            if (this.isBoolean(value))
                return value;
            else
                return (value == 0);
        };
    }

    private static convertToString(value: any) : string
    {
        if (this.isString(value))
            return value;
        else 
            return (value == null ? null : value.toString());
    }

    public static isString(value: any): boolean { return (typeof value === 'string' || value instanceof String); }
    public static isBoolean(value: any): boolean { return (typeof value === 'boolean' || value instanceof Boolean); }
    public static isNumber(value: any): boolean { return (typeof value === 'number' || value instanceof Number); }
    public static isFunction(value: any): boolean { return (typeof value === 'function'); }
    public static isArray(value: any): boolean { return (Object.prototype.toString.call(value) === '[object Array]'); }

    public static identity(value: any): any { return value; }
    public static merge<U, V>(x: U, y: V): any { return [x, y]; }


    // Linq operators

    /**
     * Returns the aggregate value of performing the 'operation' function on each of the values of
     * 'this' collection, starting with a value equal to 'seed' (or to the value of the first element
     * of 'this' collection, if 'seed' is null).  The final value is either directly returned (if no
     * 'result selector' function is given) or the final value is first passed to the 'result selector'
     * function and the return value from that function is returned.
     * @param seed The initial value of the aggregation
     * @param operation The function to use to aggregate the values of 'this' collection
     * @param resultSelector Optional, the function that projects the final value to the returned result
     * @return The final, aggregate value.
     */
    public aggregate<U, V>(seed: U, operation: (accum: U, element: T) => U, resultSelector?: Selector<U, V>): V
    {
        if (operation == null)
            throw new Error('Invalid operation.');

        this.processDeferredSort();

        let length = this.array.length;

        if ((length == 0) && (seed == null))
            throw new Error('Cannot aggregate on empty collection when a seed is not given.');

        let current: any = (seed == null ? this.array[0] : seed);
        let startingIndex = (seed == null ? 1 : 0);

        for (let i = startingIndex; i < length; i++)
        {
            if (i in this.array)
                current = operation(current, this.array[i]);
        }

        return (resultSelector == null ? current : resultSelector(current));
    }

    /**
     * Returns a boolean value indicating whether all of the elements of the collection satisfy the
     * predicate.  Returns 'true' if the collection is empty.
     * @param predicate The predicate applied to the collection.
     */
    public all(predicate: Predicate<T>): boolean
    {
        if (predicate == null)
            throw new Error('Invalid predicate');

        this.processDeferredSort();

        return this.array.every(predicate);
    }

    /**
     * Returns a boolean value indicating whether any of the elements of the collection satisfy the
     * predicate.  Returns 'false' if the collection is empty.  If the predicate is not given, then
     * this method returns 'true' if the collection is not empty (and 'false', otherwise).
     * @param predicate Optional, the predicate applied to the collection
     */
    public any(predicate?: Predicate<T>): boolean
    {
        this.processDeferredSort();

        if (predicate == null)
            return (this.array.length > 0);

        return this.array.some(predicate);
    }

    /**
     * Returns the average value of all of the elements (or projection of the elements, if there is
     * a selector), excluding null values.  If any of the elements (or projection of the elements) are
     * NaN (i.e., not a number), then an exception will be thrown.
     * @param selector Optional, a projection function that returns the value to be averaged
     * @returns The average value.
     */
    public average(selector?: Selector<T, number>): number
    {
        this.processDeferredSort();

        let length = this.array.length;
        let result = 0;
        let counter = 1;

        for (let i = 0; i < length; i++)
        {
            if (!(i in this.array))
                continue;

            let value: number = (selector == null ? this.castAsNumber(this.array[i]) : selector(this.array[i]));

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
     * Returns an array with the elements of 'this' collection grouped into separate 
     * arrays (i.e., "buckets") of the 'size' given.  If the 'result selector' is given
     * the the buckets will contain the values projected from the elements by the result
     * selector.  The given 'size' must be greater than zero.
     * @param size The size of buckets into which to group the elements
     * @param resultSelector Optional, the function to use to project the result values
     * @returns A Linq object containing arrays of the batched elements.
     */
    public batch<U>(size: number, resultSelector?: Selector<T, U>): Linq<Array<U | T>>
    {
        if (size == null || size <= 0)
            throw new Error('Invalid size.');

        this.processDeferredSort();

        let results = new Array<Array<U | T>>();
        let index = 0;
        let length = this.array.length;
        let currentBucket: Array<U | T> = null;

        for (let i = 0; i < length; i++)
        {
            if (!(i in this.array))
                continue;
            
            if (currentBucket == null)
            {
                currentBucket = new Array<U | T>();
                results.push(currentBucket);
            }

            currentBucket.push(resultSelector == null ? this.array[i] : resultSelector(this.array[i]));
            index += 1;

            if (index == size)
            {
                currentBucket = null;
                index = 0;
            }
        }

        return new Linq(results, false);
    }

    /**
     * Returns a collection containing all of the elements of 'this' collection followed by 
     * all of the elements of the 'second' collection.
     * @param second The collection of items to append to 'this' collection
     * @returns A Linq object representing the concatenation.
     */
    public concat(second: LinqCompatible<T>): Linq<T>
    {
        this.processDeferredSort();

        if (second == null)
            return new Linq(this.array, true);

        let secondLinq = Linq.from(second);

        secondLinq.processDeferredSort();

        return new Linq(this.array.concat(secondLinq.array), false);
    }

    /**
     * Returns a boolean value indicating whether 'this' collection contains the given 'item'.  The
     * 'comparer' function can be used to specify how the 'item' is compared to the elements of 'this' 
     * collection.  If 'comparer' is not given, the "===" operator is used to compare elements.
     * @param item The item to search for in 'this' collection
     * @param comparer Optional, the function to use to compare elements to the 'item'
     */
    public contains(item: T, comparer?: Comparer<T> | EqualityComparer<T>): boolean
    {
        let normalizedComparer = (comparer == null ? null : Linq.normalizeComparer(comparer));

        this.processDeferredSort();

        return this.array.some(x => normalizedComparer == null ? x === item : normalizedComparer(x, item));
    }

    /**
     * Returns the number of items in 'this' collection (if no 'predicate' is given) or the number of
     * items in 'this' collection that satisfy the 'predicate'.
     * @param predicate Optional, the predicate used to count elements in 'this' collection
     */
    public count(predicate?: Predicate<T>): number
    {
        this.processDeferredSort();

        if (predicate == null)
            return this.array.length;

        let length = this.array.length;
        let counter = 0;

        for (let i = 0; i < length; i++)
        {
            if ((i in this.array) && predicate(this.array[i]))
                counter += 1;
        }

        return counter;
    }

    /**
     * Returns either 'this' collection, if 'this' collection is empty, or a collection containing
     * only the 'defaultValue' as an element.  In other words, this function always returns a collection 
     * containing at least one element.
     * @param defaultValue The value for the resulting collection to contain if 'this' collection is empty
     */
    public defaultIfEmpty(defaultValue: T): Linq<T>
    {
        this.processDeferredSort();

        if (this.array.length == 0)
            return new Linq([defaultValue], false);
        else
            return new Linq(this.array, true);
    }

    /**
     * Returns a collection of all of the distinct elements of 'this' collection, using 'comparer' (if it
     * is given) to determine whether two elements are equal.  If 'comparer' is not given, the "===" operator
     * is used to compare elements.
     * @param comparer Optional, the function used to compare elements
     */
    public distinct(comparer?: Comparer<T> | EqualityComparer<T>): Linq<T>
    {
        return this.distinctBy(Linq.identity, comparer);
    }    

    /**
     * Returns a collection of all of the elements that are considered distinct relative to the key value returned
     * by the 'keySelector' projection, using 'comparer' (if it is given) to determine whether to keys are equal.
     * If 'comparer' is not given, the "===" operator is used to compare keys.
     * @param keySelector The projection function to return keys for the elements
     * @param comparer Optional, the function used to compare keys
     */
    public distinctBy<U>(keySelector: Selector<T, U>, comparer?: Comparer<U> | EqualityComparer<U>): Linq<T>
    {
        if (keySelector == null)
            throw new Error('Invalid key selector.');

        this.processDeferredSort();

        return this
            .groupBy(keySelector, null, comparer)
            .select((x: IGrouping<U, T>) => (new Linq(x.values, false))
            .first());
    }

    /**
     * Returns the element of 'this' collection located at the ordinal position given by 'index' (a zero-based 
     * index).  If that position is either less than zero or greater than or equal to the size of 'this' 
     * collection, then an error will be thrown.
     * @param index The zero-based index of the element to return
     */
    public elementAt(index: number): T
    {
        if (index == null || index < 0 || index >= this.array.length)
            throw new Error('Invalid index.');

        this.processDeferredSort();

        return this.array[index];
    }

    /**
     * Returns either the element of 'this' collection located at the ordinal position given by 'index' (a
     * zero-based index), if the 'index' is contained within the bounds of 'this' collection, or the 'defaultValue',
     * if the 'index' is not contained within the bounds of 'this' collection.
     * @param index The zero-based index of the element to return
     * @param defaultValue The value to return if the 'index' is outside the bounds of 'this' collection
     */
    public elementAtOrDefault(index: number, defaultValue: T): T
    {
        if (index == null || index < 0 || index >= this.array.length)
            return defaultValue;

        this.processDeferredSort();

        return this.array[index];
    }

    /**
     * Returns 'this' collection "zipped-up" with the 'second' collection such that each value of the
     * returned collection is the value projected from the corresponding element from each of 'this'
     * collection and the 'second' collection.  If the size of 'this' collection and the 'second' 
     * collection are not equal, then an exception will be thrown.
     * @param second The collection to zip with 'this' collection
     * @param resultSelector Optional, the function to use to project the result values
     */
    public equiZip<U, V>(second: LinqCompatible<U>, resultSelector?: MergeSelector<T, U, V>): Linq<T | V>
    {
        let actualResultSelector = (resultSelector == null ? Linq.merge : resultSelector);

        this.processDeferredSort();

        let secondLinq = Linq.from(second);

        secondLinq.processDeferredSort();

        if (this.array.length != secondLinq.array.length)
            throw new Error("The two collections being equi-zipped are not of equal lengths.");

        let length = this.array.length;
        let results = new Array<T | V>();

        for (let i = 0; i < length; i++)
        {
            results.push(actualResultSelector(this.array[i], secondLinq.array[i]));
        }

        return new Linq(results, false);
    }

    /**
     * Returns elements in 'this' collection that do not also exist in the 'second' collection, using 'comparer'
     * (if it is given) to determine whether two items are equal.  Also, the returned elements will not include
     * duplicates from 'this' collection. If 'comparer' is not given, the "===" operator is used to compare elements.
     * @param second The collection to use to exclude elements
     * @param comparer Optional, the function used to compare elements
     */
    public except(second: LinqCompatible<T>, comparer?: Comparer<T> | EqualityComparer<T>): Linq<T>
    {
        let normalizedComparer = (comparer == null ? null : Linq.normalizeComparer(comparer));

        this.processDeferredSort();

        if (second == null)
            second = [];
        
        let secondLinq = Linq.from(second);

        secondLinq.processDeferredSort();

        let length = this.array.length;
        let results = new Linq([], false);

        for (let i = 0; i < length; i++)
        {
            if (!(i in this.array))
                continue;
            
            let value = this.array[i];

            let predicate = (x: T) =>
            {
                if (normalizedComparer == null)
                    return x === value;
                else
                    return normalizedComparer(x, value);
            };

            let inFirst = results.array.some(predicate);
            let inSecond = secondLinq.array.some(predicate);

            if (!inFirst && !inSecond)
                results.array.push(value);
        }

        return results;
    }

    /**
     * Returns either the first element of 'this' collection (if 'predicate' is not given) or the 
     * first element of 'this' collection that satisfies the 'predicate' (if 'predicate' is given).
     * If there is no "first" element to return (either because 'this' collection is empty or no element 
     * satisfies the 'predicate'), an error is thrown.
     * @param predicate Optional, the predicate function used to determine the element to return
     */
    public first(predicate?: Predicate<T>): T
    {
        return this.firstBasedOperator(predicate, null, true);
    }

    /**
     * Returns either the first element of 'this' collection (if 'predicate' is not given) or the
     * first element of 'this' collection that satisfies the 'predicate' (if 'predicate' is given).
     * If there is no "first" element to return (either because 'this' collection is empty or no element
     * satisfies the 'predicate'), the 'defaultValue' is returned.
     */
    public firstOrDefault(predicate?: Predicate<T>, defaultValue?: T): T
    {
        return this.firstBasedOperator(predicate, defaultValue, false);
    }

    private firstBasedOperator(predicate: Predicate<T>, defaultValue: T, throwIfNotFound: boolean): T
    {
        this.processDeferredSort();

        let length = this.array.length;

        for (let i = 0; i < length; i++)
        {
            if ((i in this.array) && ((predicate == null) || predicate(this.array[i])))
                return this.array[i];
        }

        if (throwIfNotFound)
            throw new Error('No first item was found in collection.');
        else
            return defaultValue;
    }

    /**
     * Executes the given 'action' on each element in 'this' collection.
     * @param action The function that is executed for each element in 'this' collection
     */
    public foreach(action: Action<T> | IndexedAction<T>): void
    {
        if (action == null)
            throw new Error('Invalid action');

        this.processDeferredSort();

        this.array.forEach(action);
    }

    /**
     * Return a collection of groupings (i.e., objects with a property called 'key' that
     * contains the grouping key and a property called 'values' that contains an array
     * of elements that are grouped under the grouping key).  The array of elements grouped
     * under the grouping key will be elements of 'this' collection (if no 'elementSelector' 
     * is given) or projected elements given by 'elementSelector'.  The grouping key for 
     * each element in 'this' collection is given by the 'keySelector' function.  If a
     * 'keyComparer' function is given, it will be used to determine equality among the
     * grouping keys (if 'comparer' is not given, it the "===" operator will be used).
     * @param keySelector The function that returns the grouping key for an element
     * @param elementSelector Optional, the function that projects elements to be returned in the results
     * @param keyComparer Optional, the function used to compare grouping keys
     */
    public groupBy<U, V>(keySelector: Selector<T, U>, elementSelector?: Selector<T, V>, keyComparer?: Comparer<U> | EqualityComparer<U>): Linq<IGrouping<U, T | V>>
    {
        if (keySelector == null)
            throw new Error('Invalid key selector.');

        let normalizedComparer = (keyComparer == null ? null : Linq.normalizeComparer(keyComparer));

        this.processDeferredSort();

        let length = this.array.length;
        let groupings = new Linq<Grouping<U, T | V>>([], false);

        for (let i = 0; i < length; i++)
        {
            let value = this.array[i];
            let key = keySelector(value);
            let element = (elementSelector == null ? value : elementSelector(value));

            let foundGroup = groupings
                .firstOrDefault(x =>
                {
                    if (normalizedComparer == null)
                        return (x.key === key);
                    else
                        return normalizedComparer(x.key, key);
                },
                null);

            if (foundGroup == null)
                groupings.array.push(new Grouping<U, T | V>(key, [element]));
            else
                foundGroup.values.push(element);
        }

        return groupings;
    }

    /**
     * Returns a "left outer" join of 'this' collection (the "outer" collection) and the 'inner'
     * collection, using the 'outerKeySelector' and 'innerKeySelector' to project the keys from 
     * each collection, and using the 'keyComparer' function (if it is given) to compare the
     * projected keys.  If the 'keyComparer' is not given, the "===" operator will be used to 
     * compare the projected keys.  The 'resultSelector' function is used to convert the joined 
     * results into the results that are returned by the groupJoin function.  The 'resultSelector' 
     * takes as parameters the outer object (of the join) and an array of the joined inner objects 
     * (this array will be an empty array if there were no inner elements associated with the outer
     * element).
     * @param inner The collection that is "left-outer" joined with 'this' collection
     * @param outerKeySelector The function that projects the key for the outer elements (in 'this' collection)
     * @param innerKeySelector The function that projects the key for the inner elements
     * @param resultSelector The function that converts the joined results into the results returned
     * @param keyComparer Optional, the function used to compare the projected keys
     */
    public groupJoin<U, V, W>(inner: LinqCompatible<U>, outerKeySelector: Selector<T, V>, innerKeySelector: Selector<U, V>, resultSelector: GroupJoinResultSelector<T, U, W>, keyComparer?: Comparer<V> | EqualityComparer<V>): Linq<W>
    {
        if (inner == null)
            throw new Error('Invalid inner collection.');

        if (outerKeySelector == null)
            throw new Error('Invalid outer key selector.');

        if (innerKeySelector == null)
            throw new Error('Invalid inner key selector.');
        
        if (resultSelector == null)
            throw new Error('Invalid result selector.');

        let normalizedKeyComparer = (keyComparer == null ? null : Linq.normalizeComparer(keyComparer));

        this.processDeferredSort();

        let innerLinq = Linq.from(inner);

        innerLinq.processDeferredSort();

        let groupings = innerLinq.groupBy<V, any>(innerKeySelector, null, normalizedKeyComparer);
        let length = this.array.length;
        let results = new Array<W>();

        for (let i = 0; i < length; i++)
        {
            if (!(i in this.array))
                continue;

            let value = this.array[i];
            let outerKey = outerKeySelector(value);

            let groupValues = groupings
                .firstOrDefault(x =>
                {
                    if (normalizedKeyComparer == null)
                        return (x.key === outerKey);
                    else
                        return normalizedKeyComparer(x.key, outerKey);
                },
                null);

            results.push(resultSelector(value, (groupValues == null ? new Array<V>() : groupValues.values)));
        }

        return new Linq(results, false);
    }

    /**
     * Returns a collection of objects with the "key" property of each object equal to either the zero-based
     * index of the element in 'this' collection (if 'startIndex' is not given) or the index, starting at
     * 'startIndex', of the element in 'this' collection, and with the "value" property of the object equal to
     * the element in 'this' collection.
     * @param startIndex Optional, the starting index for the results (defaults to '0')
     */
    public index(startIndex?: number): Linq<IKeyValuePair<number, T>>
    {
        if (startIndex == null)
            startIndex = 0;

        return this.select((x: T, i: number) => new KeyValuePair(startIndex + i, x));
    }

    /**
     * Returns the index of the first element that satisfies the 'predicate'.  Returns the value "-1" if
     * none of the elements satisfy the 'predicate'.
     * @param predicate The function used to determine which index to return
     */
    public indexOfFirst(predicate: Predicate<T>): number
    {
        if (predicate == null)
            throw new Error('Invalid predicate.');

        this.processDeferredSort();

        let length = this.array.length;

        for (let i = 0; i < length; i++)
        {
            if (i in this.array && predicate(this.array[i]))
                return i;
        }

        return -1;
    }



    /**
     * Returns the elements of 'this' collection sorted in ascending order of the projected value
     * given by the 'keySelector' function, using the 'comparer' function to compare the projected
     * values.  If the 'comparer' function is not given, a comparer that uses the natural ordering 
     * of the values will be used to compare the projected values.  Note that subsequent, immediate 
     * calls to either thenBy or thenByDescending will provide subsequent "levels" of sorting (that 
     * is, sorting when two elements are determined to be equal by this orderBy call).
     * @param keySelector The function that projects the value used to sort the elements
     * @param comparer Optional, the function that compares projected values
     */
    public orderBy<U>(keySelector: Selector<T, U>, comparer?: Comparer<U>): Linq<T>
    {
        if (keySelector == null)
            throw new Error('Invalid key selector.');

        let resolvedComparer = (comparer == null ? Linq.generalComparer : comparer);

        this.processDeferredSort();

        let results = new Linq(this.array, true);

        results.deferredSort = { keySelector: keySelector, comparer: resolvedComparer, reverse: false, next: null };

        return results;
    }

    /**
     * Returns a collection of values projected from the elements of 'this' collection.
     * @param selector The function that projects values from the elements
     */
    public select<U>(selector: Selector<T, U> | IndexedSelector<T, U>): Linq<U>
    {
        if (selector == null)
            throw new Error('Invalid selector.');

        this.processDeferredSort();

        return new Linq(this.array.map(selector), false);
    }

    /**
     * Returns the elements of 'this' collection that satisfy the 'predicate' function.
     * @param predicate The function that determines which elements to return
     */
    public where(predicate: Predicate<T>): Linq<T>
    {
        if (predicate == null)
            throw new Error('Invalid predicate.');

        this.processDeferredSort();

        return new Linq(this.array.filter(predicate), false);
    }
    
    /**
     * Returns an array with the same elements as 'this' collection.
     */
    public toArray(): Array<T>
    {
        this.processDeferredSort();

        return this.array.slice(0);
    }


    // Miscellaneous functions

    private castAsNumber(value: any): number
    {
        return (Linq.isNumber(value) ? value : NaN);
    }

    private processDeferredSort<U>(): void
    {
        if (this.deferredSort == null)
            return;

        let compare = (x: T, y: T, info: DeferredSort<T, U>): number =>
        {
            let value: number; 

            if (info.reverse)
                value = info.comparer(info.keySelector(y), info.keySelector(x));
            else
                value = info.comparer(info.keySelector(x), info.keySelector(y));

            if (value == 0)
            {
                if (info.next == null)
                    return 0;
                
                // Recursively evaluate the next level of ordering...
                return compare(x, y, info.next);
            }
            else
                return value;
        };

        this.array.sort((x, y) => compare(x, y, this.deferredSort));
        this.deferredSort = null;
    }
}

export type Predicate<T> = (item: T) => boolean;
export type Comparer<T> = (x: T, y: T) => number;
export type EqualityComparer<T> = (x: T, y: T) => boolean;
export type Selector<T, U> = (item: T) => U;
export type IndexedSelector<T, U> = (item: T, index: number) => U;
export type MergeSelector<T, U, V> = (item1: T, item2: U) => V;
export type LinqCompatible<T> = Array<T> | Linq<T>;
export type Action<T> = (item: T) => void;
export type IndexedAction<T> = (item: T, index: number) => void;
export type GroupJoinResultSelector<T, U, V> = (outerValue: T, innerValues: Array<U>) => V;

export interface IGrouping<Key, Value>
{
    key: Key;
    values: Array<Value>;
}

export class Grouping<Key, Value> implements IGrouping<Key, Value>
{
    private _key: Key;
    private _values: Array<Value>;

    public get key(): Key { return this._key; }
    public get values(): Array<Value> { return this._values; }

    constructor(key: Key, values?: Array<Value>)
    {
        this._key = key;
        this._values = (values == null ? new Array<Value>() : values.slice(0));
    }
}

export interface IKeyValuePair<Key, Value>
{
    key: Key;
    value: Value;
}

export class KeyValuePair<Key, Value> implements IKeyValuePair<Key, Value>
{
    private _key: Key;
    private _value: Value;

    public get key(): Key { return this._key; }
    public get value(): Value { return this._value; }

    constructor(key: Key, value: Value)
    {
        this._key = key;
        this._value = value;
    }
}

class DeferredSort<T, Key>
{
    keySelector: Selector<T, Key>;
    comparer: Comparer<Key>;
    reverse: boolean;
    next: DeferredSort<T, any>
}