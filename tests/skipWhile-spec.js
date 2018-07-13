import {Linq} from '../jslinq';

describe('skipWhile', () =>
{
    let col1 = new Linq([1, 2, 3, 4, 5, 6, 7, 8]);
    let col2 = new Linq([1, 2, 3, 4, 5, 1, 2, 3, 4, 5]);

    it('when called on an empty collection then returns an empty collection', () =>
    {
        let results = Linq.empty()
            .skipWhile(x => x > 5)
            .toArray();

        expect(results).toEqual([]);
    });

    it('when called on a collection, all of whose elements satisfy the predicate, then returns an empty collection', () =>
    {
        let results = col1.skipWhile(x => x < 1000).toArray();

        expect(results).toEqual([]);
    });

    it('when called on a collection, none of whose elements satisfy the predicate, then returns the original collection', () => 
    {
        let results = col1.skipWhile(x => x < 0).toArray();
        let expectedResults = col1.toArray();

        expect(results).toEqual(expectedResults);
    });

    it('when called on a collection, some of whose elements satisfy the predicate, then returns a collection with appropriate elements', () =>
    {
        let results = col1.skipWhile(x => x < 5).toArray();

        expect(results).toEqual([5, 6, 7, 8]);
    });

    it('when called on a collection, the elements of which that satisfy the predicate are located both at the beginning and the end of the collection, then returns the appropriate elements', () => 
    {
        let results = col2.skipWhile(x => x < 5).toArray();

        expect(results).toEqual([5, 1, 2, 3, 4, 5]);
    });

    it('when called without a predicate then throws an exception', () =>
    {
        expect(() => { col1.skipWhile(); }).toThrow();
    });

    it('when called with a non-function predicate then throws an exception', () =>
    {
        expect(() => { col1.skipWhile('not-a-function'); }).toThrow();
    });
});
