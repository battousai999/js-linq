import {Linq} from '../jslinq';

describe('except', () => 
{
    let col1 = new Linq([1, 2, 3, 4]);
    let col2 = new Linq([3, 4, 5, 6]);
    let col3 = new Linq(["one", "two", "two", "three", "four"]);
    let col4 = new Linq(["three", "three", "four", "five", "six"]);
    let col5 = new Linq(["THREE", "FOUR", "FIVE", "SIX"]);
    let col6 = new Linq([1, 2, 3, 4, 1, 2, 3]);

    it('when called on an empty collection then returns an empty collection', () => 
    {
        let empty = Linq.empty();

        expect(empty.except(col1).toArray()).toEqual([]);
        expect(empty.except(empty).toArray()).toEqual([]);
    });

    it('when called on a non-empty collection (having no duplicates) with no common elements then returns copy of collection', () => 
    {
        let results1 = col1.except([10, 11, 12, 13]).toArray();
        let results2 = col1.except([]).toArray();
        let originalArray = col1.toArray();

        expect(results1).toEqual(originalArray);
        expect(results2).toEqual(originalArray);
    });

    it('when called on a non-empty collection (having duplicates) with no common elments then returns collection with duplicates removed', () => 
    {
        let results = col6.except([99, 100, 101]).toArray();

        expect(results).toEqual([1, 2, 3, 4]);
    });

    it('when called on a non-empty collection (having no duplicates) with common elements then returns collection with common elements removed', () => 
    {
        let results1 = col1.except(col2).toArray();
        let results2 = col2.except(col1).toArray();
        let results3 = col1.except(col1).toArray();

        expect(results1).toEqual([1, 2]);
        expect(results2).toEqual([5, 6]);
        expect(results3).toEqual([]);
    });

    it('when called on a non-empty collection (having duplicates) with common elements then returns collection with duplicates and common elements removed', () => 
    {
        let results = col6.except([1, 2]).toArray();

        expect(results).toEqual([3, 4]);
    });

    it('when called with a empty second collection then returns copy of collection', () => 
    {
        let results = col1.except([]).toArray();
        let originalArray = col1.toArray();

        expect(results).toEqual(originalArray);
    });

    it('when called with a null second collection then returns copy of collection', () => 
    {
        let results = col1.except(null).toArray();
        let originalArray = col1.toArray();

        expect(results).toEqual(originalArray);
    });

    it('when called with a comparer then removes common elements with the context of the comparer', () => 
    {
        let results1 = col3.except(col4, Linq.strictComparer).toArray();
        let results2 = col3.except(col5, Linq.caseInsensitiveStringComparer).toArray();

        expect(results1).toEqual(["one", "two"]);
        expect(results2).toEqual(["one", "two"]);
    });

    it('when called with a non-function comparer then throws an exception', () => 
    {
        expect(() => { col1.except(col2, 'not-a-function'); }).toThrow();
    });
});
