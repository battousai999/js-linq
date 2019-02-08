import {Linq} from '../jslinq';

describe('lastOrDefault', () => 
{
    let col1 = new Linq([1, 2, 3, 4, 5, 6]);
    let col2 = new Linq([6, 5, 4, 3, 2, 1]);

    it('when called on an empty collection returns default value', () => 
    {
        let result1 = Linq.empty().lastOrDefault(null, 99);
        let result2 = Linq.empty().lastOrDefault(x => x === 1, 99);

        expect(result1).toEqual(99);
        expect(result2).toEqual(99);
    });

    it('when called on an empty collection without a default value then returns undefined', () => 
    {
        let results = Linq.empty().lastOrDefault();

        expect(results).toBeUndefined();
    });

    it('when called on a non-empty collection without a predicate then returns the last element', () => 
    {
        let result1 = col1.lastOrDefault();
        let result2 = col2.lastOrDefault();

        expect(result1).toEqual(6);
        expect(result2).toEqual(1);
    });

    it('when called on a collection containing one element that satisfies the predicate then returns that element', () => 
    {
        let results = col1.lastOrDefault(x => x % 5 === 3);

        expect(results).toEqual(3);
    });

    it('when called on a collection containing multiple elements that satisfy the predicate then returns the last one', () => 
    {
        let results = col2.lastOrDefault(x => x % 4 === 2);

        expect(results).toEqual(2);
    });

    it('when called on a collection containing no elements that satisfy the predicate then returns default value', () => 
    {
        let results = col1.lastOrDefault(x => x < 0, 999);

        expect(results).toEqual(999);
    });

    it('when called with a non-function predicate then throws an exception', () => 
    {
        expect(() => { col1.lastOrDefault('not-a-function'); }).toThrow();
    });
});
