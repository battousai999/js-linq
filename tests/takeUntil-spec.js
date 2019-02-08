import {Linq} from '../jslinq';

describe('takeUntil', () =>
{
    let arr = [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1];
    let col = new Linq(arr);

    it('when called on an empty collection then returns an empty collection', () =>
    {
        let results = Linq.empty()
            .takeUntil(x => x > 4)
            .toArray();

        expect(results).toEqual([]);
    });

    it('when called on a collection all, of whose elements satisfy the predicate, then returns an empty collection', () =>
    {
        let results = col.takeUntil(x => x > 0).toArray();

        expect(results).toEqual([]);
    });

    it('when called on a collection, none of whose elements satisfy the predicate, then returns the entire collection', () =>
    {
        let results = col.takeUntil(x => x > 999).toArray();

        expect(results).toEqual(arr);
    });

    it('when called on a collection, some of whose elements satisfy the predicate, then returns the first set of consecutive non-satisfying elements', () =>
    {
        let results = col.takeUntil(x => x > 4).toArray();

        expect(results).toEqual([1, 2, 3, 4]);
    });

    it('when called without a predicate then throws an exception', () =>
    {
        expect(() => { col.takeUntil(); }).toThrow();
    });

    it('when called with a non-function predicate then throws an exception', () =>
    {
        expect(() => { col.takeUntil('not-a-function'); }).toThrow();
    });
});
