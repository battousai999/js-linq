import {Linq} from '../jslinq';

describe('take', () =>
{
    let arr = [1, 2, 3, 4, 5, 6, 7, 8];
    let col = new Linq(arr);

    it('when called on an empty collection returns an empty collection', () =>
    {
        let results = Linq.empty()
            .take(10)
            .toArray();

        expect(results).toEqual([]);
    });

    it('when called with a count smaller than the size of the collection then returns a smaller collection', () =>
    {
        let results = col.take(4).toArray();

        expect(results).toEqual([1, 2, 3, 4]);
    });

    it('when called with a count equal to the size of the collection then returns the collection', () =>
    {
        let results = col.take(arr.length).toArray();

        expect(results).toEqual(arr);
    });

    it('when called with a count greater than the size of the collection then returns the collection', () =>
    {
        let results = col.take(arr.length + 99).toArray();

        expect(results).toEqual(arr);
    });

    it('when called with a negative count then returns an empty collection', () =>
    {
        let results = col.take(-10).toArray();

        expect(results).toEqual([]);
    });

    it('when called with a count of zero then returns an empty collection', () =>
    {
        let results = col.take(0).toArray();

        expect(results).toEqual([]);

    });

    it('when called without a count then throws an exception', () =>    
    {
        expect(() => { col.take(); }).toThrow();
    });

    it('when called with a non-numeric count then throws an exception', () =>
    {
        expect(() => { col.take('not-a-number'); }).toThrow();
    });
});
