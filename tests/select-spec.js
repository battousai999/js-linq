import {Linq} from '../jslinq';

describe('select', () => 
{
    it('when called on an empty collection then returns an empty collection', () => 
    {
        let results = Linq.empty()
            .select(x => x + 1)
            .toArray();

        expect(results).toEqual([]);
    });

    it('when called with a selector then returns a collection of projected elements', () => 
    {
        let results = Linq.from([1, 2, 3, 4, 5])
            .select(x => x * 2)
            .toArray();

        expect(results).toEqual([2, 4, 6, 8, 10]);
    });

    it('when called without a selector then throws an exception', () => 
    {
        expect(() => { Linq.from([1, 2, 3]).select(); }).toThrow();
    });

    it('when called with a non-function selector then throws an exception', () => 
    {
        expect(() => { Linq.from([1, 2, 3]).select('not-a-function'); }).toThrow();
    });
});
