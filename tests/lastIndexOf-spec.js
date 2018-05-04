import {Linq} from '../jslinq';

describe('lastIndexOf', () => 
{
    let col = new Linq([1, 2, 3, 4, 5]);

    it('when called on an empty collection then returns -1', () => 
    {
        let results = Linq.empty().lastIndexOf(x => x === 0);

        expect(results).toEqual(-1);
    });

    it('when called on a collection containing at one element that satisfies the predicate then returns the index of that element', () => 
    {
        let results = col.lastIndexOf(x => x < 3);

        expect(results).toEqual(1);
    });

    it('when called on a collection containing multiple elements that satisfy the predicate then returns the index of the last one', () => 
    {
        let arr = col.toArray();
        let col2 = new Linq(arr.concat(arr));
        let results = col2.lastIndexOf(x => x < 3);

        expect(results).toEqual(6);
    });

    it('when called on a collection not containing any elements that satisfy the predciate then returns -1', () => 
    {
        let results = col.lastIndexOf(x => x > 999);

        expect(results).toEqual(-1);
    });

    it('when called without a predicate then throws an exception', () => 
    {
        expect(() => { col.lastIndexOf(); }).toThrow();
    });

    it('when called with a non-function preducate then throws an exception', () => 
    {
        expect(() => { col.lastIndexOf('not-a-function'); }).toThrow();
    });
});
