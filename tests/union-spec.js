import {Linq} from '../jslinq';

describe('union', () =>
{
    let col1 = new Linq([1, 2, 3, 4]);
    let col2 = new Linq([5, 6, 7, 8]);
    let col3 = new Linq(["one", "two", "three", "three", "four"]);
    let col4 = new Linq(["ONE", "TWO", "TWO", "THREE"]);

    it('when called on an empty collection with a second empty collection then returns an empty collection', () =>
    {
        let results = Linq.empty()
            .union([])
            .toArray();

        expect(results).toEqual([]);
    });

    it('when called on an emtpy collection with a second non-empty collection then returns the second collection', () =>
    {
        let results = Linq.empty()
            .union(col1)
            .toArray();

        expect(results).toEqual(col1.toArray());
    });

    it('when called on a non-empty collection with an empty second collection then returns the original collection', () =>
    {
        let results1 = col2.union([]).toArray();
        let results2 = col2.union(null).toArray();

        expect(results1).toEqual(col2.toArray());
        expect(results2).toEqual(col2.toArray());
    });

    it('when called on non-empty collections with no elements in common then returns a collection with the elements of both collections', () =>
    {
        let results = col1.union(col2).toArray();

        expect(results).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    });

    it('when called on non-empty collections with some elements in common then returns a collection with the elements of both collections but with no duplicates', () =>
    {
        let results1 = col1.union([3, 4, 5, 6]).toArray();
        let results2 = col3.union(col4).toArray();

        expect(results1).toEqual([1, 2, 3, 4, 5, 6]);
        expect(results2).toEqual(["one", "two", "three", "four", "ONE", "TWO", "THREE"]);
    });

    it('when called on non-empty collections each having duplicates within themselves then returns a collection with no duplicates', () =>
    {
        let results1 = Linq.from([1, 2, 3, 4, 1, 2, 3, 4])
            .union([5, 6, 7, 8, 5, 6])
            .toArray();

        let results2 = Linq.from(['one', 'two', 'three', 'four', 'ONE', 'TWO', 'THREE'])
            .union(['THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN'], Linq.caseInsensitiveStringComparer)
            .toArray();

        expect(results1).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
        expect(results2).toEqual(['one', 'two', 'three', 'four', 'FIVE', 'SIX', 'SEVEN']);
    });

    it('when called with a comparer then unions the two collections within the context of the comparer', () =>
    {
        let results = col3.union(col4, Linq.caseInsensitiveStringComparer).toArray();

        expect(results).toEqual(['one', 'two', 'three', 'four']);
    });

    it('when called with a non-function comparer then throws an exception', () =>
    {
        expect(() => { col1.union(col2, 'not-a-function'); }).toThrow();
    });
});
