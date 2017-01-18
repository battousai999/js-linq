type LinqCompatible = any[] | Linq | any;
type ComparerResult = number | boolean;
type Predicate = ((item: any) => boolean) | string;
type Selector<T> = ((item: any) => T) | string;
type Comparer<T> = ((x: T, y: T) => ComparerResult) | string;

interface LinqStatic 
{
    isFunction(func: any): boolean;
    isArray(obj: any): boolean;
    identity(x: any): any;
    isString(x: any): boolean;
    isBoolean(x: any): boolean;
    isNumber(x: any): boolean;
    caseInsensitiveComparer(x: any, y: any): number;
    caseSensitiveComparer(x: any, y: any): number;
    defaultStringComparer(x: string, y: string): number;
    strictComparer(x: any, y: any): boolean;

    from(collection?: any): Linq;
    range(from: number, to: number, step?: number): Linq;
    repeat(item: any, repetitions?: number): Linq;
    matches(text: string, pattern: string | RegExp, flags?: string): Linq;
    properties(obj?: any, keyPropertyName?: string, valuePropertyName?: string): Linq;
}

interface Linq
{
    constructor(arr: any[]);

    aggregate(seed: any, operation: ((acc: any, item: any) => any) | string, resultSelector?: Selector<any>): any;
    all(predicate?: Predicate): boolean;
    any(predicate?: Predicate): boolean;
    average(selector?: Selector<number>): number;
    batch(size: number, resultSelector?: Selector<any>): Linq;
    concat(second: LinqCompatible): Linq;
    contains<T>(item: T, comparer?: Comparer<T>): boolean;
    count(predicate?: Predicate): number;
    defaultIfEmpty(defaultValue: any): Linq;
    distinct(comparer?: Comparer<any>): Linq;
    distinctBy<T>(keySelector: Selector<T>, comparer?: Comparer<T>): Linq;
    elementAt(index: number): any;
    elementAtOrDefault(index: number, defaultValue: any): any;
    equiZip(second: LinqCompatible, resultSelector?: ((outer: any, inner: any) => any) | string): Linq;
    except(second: LinqCompatible, comparer?: Comparer<any>): Linq;
    first(predicate?: Predicate): any;
    firstOrDefault(defaultValueOrPredicate: any | Predicate, predicate?: Predicate): any;
    foreach(action: ((item: any) => void) | string): void;
    groupBy<Key>(keySelector: Selector<Key>, elementSelector?: Selector<any>, keyComparer?: Comparer<Key>): Linq;
    groupJoin<Key>(inner: LinqCompatible, outerKeySelector: Selector<Key>, innerKeySelector: Selector<Key>, resultSelector: ((outer: any, inner: any) => any) | string, keyComparer?: Comparer<Key>): Linq;
    index(startIndex?: number): Linq;
    indexOf(predicate: Predicate): number;
    indexOfElement(item: any, comparer?: Comparer<any>): number;
    intersect(second: LinqCompatible, comparer?: Comparer<any>): Linq;
    join<Key>(inner: LinqCompatible, outerKeySelector: Selector<Key>, innerKeySelector: Selector<Key>, resultSelector: ((outer: any, inner: any) => any) | string, keyComparer?: Comparer<Key>): Linq;
    last(predicate?: Predicate): any;
    lastIndexOf(predicate: Predicate): number;
    lastIndexOfElement(item: any, comparer?: Comparer<any>): number;
    lastOrDefault(defaultValueOrPredicate: any | Predicate, predicate?: Predicate): any;
    min(selector?: Selector<any>): any;
    minBy(selector?: Selector<any>): any;
    max(selector?: Selector<any>): any;
    maxBy(selector?: Selector<any>): any;
    orderBy<Key>(keySelector: Selector<Key>, comparer?: Comparer<Key>): Linq;
    orderByDescending<Key>(keySelector: Selector<Key>, comparer?: Comparer<Key>): Linq;
    pad(width: number, padding: any): Linq;
    padWith(width: number, paddingSelector: ((index: number) => any) | string): Linq;
    pipe(action: ((item: any) => void) | string): Linq;
    prepend(value: any): Linq;
    prescan(operation: ((acc: any, item: any) => any) | string, identity: any): Linq;
    reverse(): Linq;
    scan(operation: ((acc: any, item: any) => any) | string): Linq;
    select(selector: Selector<any>): Linq;
    selectMany<T>(collectionSelector: Selector<T> | ((item: any, index: number) => T), resultSelector?: ((innerItem: T, outerItem: any) => any) | string): Linq;
    sequenceEqual(second: LinqCompatible, comparer?: Comparer<any>): boolean;
    sequenceEquivalent(second: LinqCompatible, comparer?: Comparer<any>): boolean;
    single(predicate?: Predicate): any;
    singleOrDefault(defaultValueOrPredicate: any | Predicate, predicate?: Predicate): any;
    singleOrFallback(fallback: (() => any) | string): any;
    skip(count: number): Linq;
    skipUntil(predicate: Predicate): Linq;
    skipWhile(predicate: Predicate): Linq;
    sum(selector?: Selector<number>): number;
    take(count: number): Linq;
    takeEvery(step: number): Linq;
    takeLast(count: number): Linq;
    takeUntil(predicate: Predicate): Linq;
    takeWhile(predicate: Predicate): Linq;
    thenBy<Key>(keySelector: Selector<Key>, comparer?: Comparer<Key>): Linq;
    thenByDescending<Key>(keySelector: Selector<Key>, comparer?: Comparer<Key>): Linq;
    toDelimitedString(delimiter?: string): string;
    toDictionary(keySelector: Selector<any>, elementSelector?: Selector<any>): any;
    toJQuery(): any;
    toLookup<Key>(keySelector: Selector<Key>, comparer?: Comparer<Key>): Linq;
    union(second: LinqCompatible, comparer?: Comparer<any>): Linq;
    where(predicate: Predicate): Linq;
    zip(second: LinqCompatible, resultSelector?: ((outer: any, inner: any) => any) | string): Linq;
    zipLongest(second: LinqCompatible, defaultForFirst: any, defaultForSecond: any, resultSelector?: ((outer: any, inner: any) => any) | string): Linq;
    toArray(): any[];
}

declare module "js-line" {
    export = linq;
}

declare var linq: LinqStatic;