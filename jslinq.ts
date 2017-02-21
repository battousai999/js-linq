export class Linq<T>
{
    private array: Array<T>;
    private deferredSort: DeferredSort<T, any> = null;

    constructor(array: Array<T>, copyArray: boolean = true)
    {
        this.array = (copyArray ? array.slice(0) : array);
        this.deferredSort = null;
    }

    /**
     * Creates a new Linq object from either an Array or another Linq object.
     * @param collection The collection of items around which this created Linq object wraps
     */
    public static from<T>(collection: Array<T> | Linq<T>): Linq<T>
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

    private processDeferredSort(): void
    {
        if (this.deferredSort == null)
            return;

        let compare = (x: T, y: T, info: DeferredSort<T, any>): number =>
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
    
    toArray(): Array<T>
    {
        this.processDeferredSort();

        return this.array.slice(0);
    }
}

export type Comparer<T> = (x: T, y: T) => number;
export type EqualityComparer<T> = (x: T, y: T) => boolean;
export type Selector<T, U> = (item: T) => U
export type Predicate<T> = (item: T) => boolean;

class DeferredSort<T, Key>
{
    keySelector: Selector<T, Key>;
    comparer: Comparer<Key>;
    reverse: boolean;
    next: DeferredSort<Key, T>
}