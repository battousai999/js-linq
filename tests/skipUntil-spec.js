import {Linq} from '../jslinq';

describe('skipUntil', () =>
{
    let arr = [1, 2, 3, 4, 5, 6, 7, 8];
    let col1 = new Linq(arr);
    let col2 = new Linq([1, 2, 3, 4, 5, 1, 2, 3, 4, 5]);

    it('when called on an empty collection then returns an empty collection', () =>
    {
        let results = Linq.empty()
            .skipUntil(x => x > 4)
            .toArray();

        expect(results).toEqual([]);
    });

    it('when called on a collection, all of whose elements satisfy the predicate, then returns the original collection', () =>
    {
        let results = col1.skipUntil(x => x > 0).toArray();

        expect(results).toEqual(arr);
    });

    it('when called on a collection, none of whose elements satisfy the predicate, then returns an empty collection', () =>
    {
        let results = col1.skipUntil(x => x < 0).toArray();

        expect(results).toEqual([]);
    });

    it('when called on a collection, some of whose elements satisfy the predicate, then returns a collection with the appropriate elements', () =>
    {
        let results = col1.skipUntil(x => x > 4).toArray();

        expect(results).toEqual([5, 6, 7, 8]);
    });

    it('when called on a colletion, the elements of which that do not satisfy the predicate are located at the beginning and end of the collection, then return a collection with the appropriate elements', () =>
    {
        let results = col2.skipUntil(x => x > 4).toArray();

        expect(results).toEqual([5, 1, 2, 3, 4, 5]);
    });

    it('when called without a predicate then throws an exception', () =>
    {
        expect(() => { col1.skipUntil(); }).toThrow();
    });

    it('when called with a non-function predicate then throws an exception', () =>
    {
        expect(() => { col1.skipUntil('not-a-function'); }).toThrow();
    });
});
