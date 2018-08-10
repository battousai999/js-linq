import {Linq} from '../jslinq';

describe('takeWhile', () =>
{
    let arr = [1, 2, 3, 4, 5, 1, 2, 3, 4, 5];
    let col = new Linq(arr);

    it('when called on an empty collection then returns an empty collection', () =>
    {
        let results = Linq.empty()
            .takeWhile(x => x > 4)
            .toArray();

        expect(results).toEqual([]);
    });

    it('when called on a collection all, of whose elements satisfy the predicate, then returns the entire collection', () =>
    {
        let results = col.takeWhile(x => x > 0).toArray();

        expect(results).toEqual(arr);
    });

    it('when called on a collection, none of whose elements satisfy the predicate, then returns an empty collection', () =>
    {
        let results = col.takeWhile(x => x > 999).toArray();

        expect(results).toEqual([]);
    });

    it('when called on a collection, some of whose elements satisfy the predicate, then returns the first set of consecutive satisfying elements', () =>
    {
        let results = col.takeWhile(x => x < 4).toArray();

        expect(results).toEqual([1, 2, 3]);
    });

    it('when called without a predicate then throws an exception', () =>
    {
        expect(() => { col.takeWhile(); }).toThrow();
    });

    it('when called with a non-function predicate then throws an exception', () =>
    {
        expect(() => { col.takeWhile('not-a-function'); }).toThrow();
    });
});
