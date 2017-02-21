export class Linq<T>
{
    private array: Array<T>;
    private deferredSort: DeferredSort<T> = null;

    constructor(array: Array<T>, copyArray: boolean = true)
    {
        this.array = (copyArray ? array.slice(0) : array);
        this.deferredSort = null;
    }

    /**
     * Creates a new Linq object from either an Array or another Linq object.
     * @param collection The collection of items around which this created Linq object wraps
     * @returns A new Linq object.
     */
    static from<T>(collection: Array<T> | Linq<T>): Linq<T>
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
     * @returns A new Linq object.
     */
    static range(from: number, to: number, step: number = 1)
    {
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
     * @returns A new Linq object.
     */
    static repeat<T>(item: T, repetitions: number = 1): Linq<T>
    {
        let array = new Array<T>();

        for (let i = 0; i < repetitions; i++)
        {
            array.push(item);
        }

        return new Linq(array, false);
    }

    private processDeferredSort(): void
    {
        if (this.deferredSort == null)
            return;

        let compare = (x: T, y: T, info: DeferredSort<T>): number =>
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
export type Selector<T> = (item: any) => T

class DeferredSort<T>
{
    keySelector: Selector<T>;
    comparer: Comparer<T>;
    reverse: boolean;
    next: DeferredSort<T>
}