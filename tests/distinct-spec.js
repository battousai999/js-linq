import {Linq} from '../jslinq';

describe('distinct', () => 
{
    let arr1 = [1, 2, 3, 4, 5];
    let arr2 = ["one", "two", "three"];
    let arr3 = arr2.concat(arr2.map(x => x.toUpperCase()));
    let nodups1 = new Linq(arr1);
    let nodups2 = new Linq(arr2);
    let dups1 = new Linq(arr1.concat(arr1));
    let dups2 = new Linq(arr3);

    let strictComparer = (x, y) => x === y;

    it('when called on an empty collection then returns an empty collection', () => 
    {
        let results1 = Linq.empty().distinct().toArray();
        let results2 = Linq.empty().distinct(strictComparer).toArray();

        expect(results1).toEqual([]);
        expect(results2).toEqual([]);
    });

    it('when called without a comparer on a collection without duplicates then returns collection with same elements as original collection', () => 
    {
        let results = nodups1.distinct().toArray();

        expect(results).toEqual(arr1);
    });

    it('when called with a comparer on a collection without duplicates then returns collection with the same elements as origin collection', () => 
    {
        let results = nodups2
            .distinct(Linq.caseSensitiveStringComparer)
            .toArray();

        expect(results).toEqual(arr2);
    });

    it('when called with an equality comparer on a collection without duplicates then returns collection with the same elements as origin collection', () => 
    {
        let results = nodups2
            .distinct(Linq.caseSensitiveStringEqualityComparer)
            .toArray()

        expect(results).toEqual(arr2);
    });

    it('when called without a comparer on a collection with duplicates then returns collection with duplicates removed', () => 
    {
        let results = dups1.distinct().toArray();

        expect(results).toEqual(arr1);
    });

    it('when called with a comparer on a collection with duplicates then returns collection with duplicates removed', () => 
    {
        let results = dups2
            .distinct(Linq.caseInsensitiveStringComparer)
            .toArray();

        expect(results).toEqual(arr2);
    });

    it('when called with an equality comparer on a collection with duplicates then returns collection with duplicates removed', () => 
    {
        let results = dups2
            .distinct(Linq.caseInsensitiveStringEqualityComparer)
            .toArray();

        expect(results).toEqual(arr2);
    });

    it('when called with a non-function comparer then throws an exception', () => 
    {
        expect(() => { dups1.distinct('not-a-function'); }).toThrow();
    });
});