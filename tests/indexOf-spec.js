import {Linq} from '../jslinq';

describe('indexOf', () => 
{
    let col = new Linq([1, 2, 3, 4, 5]);

    it('when called on an empty collection then returns -1', () => 
    {
        let results = Linq.empty().indexOf(x => x === 0);

        expect(results).toEqual(-1);
    });

    it('when called on a collection containing at least one element that satisfies the predicate then returns the index of that element', () => 
    {
        let results = col.indexOf(x => x > 3);

        expect(results).toEqual(3);
    });

    it('when called on a collection not containing any elements that satisfy the predciate then returns -1', () => 
    {
        let results = col.indexOf(x => x > 999);

        expect(results).toEqual(-1);
    });

    it('when called without a predicate then throws an exception', () => 
    {
        expect(() => { col.indexOf(); }).toThrow();
    });

    it('when called with a non-function preducate then throws an exception', () => 
    {
        expect(() => { col.indexOf('not-a-function'); }).toThrow();
    });
});
