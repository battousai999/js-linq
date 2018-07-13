import {Linq} from '../jslinq';

describe('skip', () =>
{
    let arr = [1, 2, 3, 4, 5, 6, 7, 8];
    let col = new Linq(arr);

    it('when called on an empty collection then returns an empty collection', () =>
    {
        let results = Linq.empty()
            .skip(10)
            .toArray();

        expect(results).toEqual([]);
    });

    it('when called with a non-positive count then returns the original collection', () =>
    {
        let results1 = col.skip(-9).toArray();
        let results2 = col.skip(0).toArray();

        expect(results1).toEqual(arr);
        expect(results2).toEqual(arr);
    });

    it('when called with a count smaller than the size of the collection then returns the appropriate elements', () =>
    {
        let results = col.skip(5).toArray();

        expect(results).toEqual([6, 7, 8]);
    });

    it('when called with a count greater than or equal to the size of the collecction then returns an empty collection', () =>
    {
        let results1 = col.skip(arr.length).toArray();
        let results2 = col.skip(arr.length + 10).toArray();

        expect(results1).toEqual([]);
        expect(results2).toEqual([]);
    });

    it('when called without a count then throws an exception', () =>
    {
        expect(() => { col.skip(); }).toThrow();
    });

    it('when called with a non-numeric count then throws an exception', () =>
    {
        expect(() => { col.skip('not-a-number'); }).toThrow();
    });
});
