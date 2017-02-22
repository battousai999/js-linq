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
        else
            return new Linq<T>(collection);
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
            return new Linq([]);

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

    public static normalizeComparer<U>(comparer: Comparer<U>): EqualityComparer<U>
    {
        return (x: U, y: U) => comparer(x, y) == 0;
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
    public static merge<U, V>(x: U, y: V): Array<U | V>  { return [x, y]; }


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
            return new Linq(this.array);

        let secondLinq = Linq.from(second);

        secondLinq.processDeferredSort();

        return new Linq(this.array.concat(secondLinq.array), false);
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

        let results = new Linq(this.array);

        results.deferredSort = { keySelector: keySelector, comparer: resolvedComparer, reverse: false, next: null };

        return results;
    }

    /**
     * Returns a collection of values projected from the elements of 'this' collection.
     * @param selector The function that projects values from the elements
     */
    public select<U>(selector: Selector<T, U>): Linq<U>
    {
        if (selector == null)
            throw new Error('Invalid selector.');

        this.processDeferredSort();

        return new Linq(this.array.map(selector), false);
    }
    
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
            var value: number; 

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

export type Comparer<T> = (x: T, y: T) => number;
export type EqualityComparer<T> = (x: T, y: T) => boolean;
export type Selector<T, U> = (item: T) => U
export type Predicate<T> = (item: T) => boolean;
export type LinqCompatible<T> = Linq<T> | Array<T>;

class DeferredSort<T, Key>
{
    keySelector: Selector<T, Key>;
    comparer: Comparer<Key>;
    reverse: boolean;
    next: DeferredSort<T, any>
}