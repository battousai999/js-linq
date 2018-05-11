import {Linq} from '../jslinq';

describe('intersect', () => 
{
    let col1 = new Linq([1, 2, 3, 4]);
    let col2 = new Linq([1, 2, 3, 4, 5, 6, 7, 8]);
    let col3 = new Linq([5, 6, 7, 8]);
    let col4 = new Linq(["one", "two", "three", "three", "four"]);
    let col5 = new Linq(["ONE", "TWO", "TWO", "THREE"]);
    let col6 = new Linq(["two", "three", "ninety-nine"]);

    it('when called on an empty collection then returns an empty collection', () => 
    {
        let results = Linq.empty()
            .intersect(col1)
            .toArray();

        expect(results).toEqual([]);
    });

    it('when called on a non-empty collection with no common elements then returns an empty collection', () => 
    {
        let results = col1.intersect(col3).toArray();

        expect(results).toEqual([]);
    });

    it('when called on a non-empty collection (having no duplicates) with common elements then returns collection with common elements', () => 
    {
        let results1 = col1.intersect(col2).toArray();
        let results2 = col2.intersect(col3).toArray();

        expect(results1).toEqual([1, 2, 3, 4]);
        expect(results2).toEqual([5, 6, 7, 8]);
    });

    it('when called on a non-empty collection (having duplicates) with common elements then returns collection with distinct, common elements', () => 
    {
        let results = col4.intersect(col6).toArray();

        expect(results).toEqual(["two", "three"]);
    });

    it('when called with an empty second collection then returns an empty collection', () => 
    {
        let results = col1.intersect([]).toArray();

        expect(results).toEqual([]);
    });

    it('when called with a null second collection then reutrns an empty collection', () => 
    {
        let results = col1.intersect(null).toArray();

        expect(results).toEqual([]);
    });

    it('when called with a comparer then returns collection with common elements according to the comparer', () => 
    {
        let results = col4.intersect(col5, Linq.caseInsensitiveStringComparer).toArray();

        expect(results).toEqual(["one", "two", "three"]);
    });

    it('when called with a non-function comparer then throws an exception', () => 
    {
        expect(() => { col4.intersect(col5, 'non-a-function'); }).toThrow();
    });
});
