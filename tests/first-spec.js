import {Linq} from '../jslinq';

describe('first', () => 
{
    let col = new Linq([1, 2, 3, 4, 5, 6]);

    it('when called on an empty collection then throws an exception', () => 
    {
        expect(() => { Linq.empty().first(); }).toThrow();
        expect(() => { Linq.empty(x => x !== 0).first(); }).toThrow();
    });

    it('when called on a non-empty collection without a predicate then returns the first element', () => 
    {
        expect(col.first()).toEqual(1);
    });

    it('when called on a non-empty collection with a satisfied predicate then returns the first element satisfying the predciate', () => 
    {
        let results = col.first(x => x > 3);

        expect(results).toEqual(4);
    });

    it('when called on a non-empty collection with a non-satisfied predicate then throws an exception', () => 
    {
        expect(() => { col.first(x => x < 0); }).toThrow();
    });

    it('when called with a non-function predicate then throws an exception', () => 
    {
        expect(() => { col.first('not-a-function'); }).toThrow();
    });
});
