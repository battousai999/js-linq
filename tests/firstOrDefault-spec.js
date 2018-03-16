import {Linq} from '../jslinq';

describe('firstOrDefault', () => 
{
    let arr = [1, 2, 3, 4, 5, 6];
    let empty = Linq.empty();
    let linq = new Linq(arr);

    it('when called on an empty collection then returns the default value', () => 
    {
        expect(empty.firstOrDefault(x => x > 10, 99)).toEqual(99);
        expect(empty.firstOrDefault(x => x > 10, null)).toBeNull();
    });

    it('when called on an empty collection without any parameters then returns undefined', () => 
    {
        expect(empty.firstOrDefault()).toBeUndefined();
    });

    it('when called on a non-empty collection without a predicate then returns first element', () => 
    {
        expect(linq.firstOrDefault()).toEqual(arr[0]);
    });

    it('when called on a non-empty collection with a satisfied predicate then returns element satisfying the predicate', () => 
    {
        expect(linq.firstOrDefault(x => x % 2 === 0, 99)).toEqual(2);
    });
    
    it('when called on a non-empty collection with a non-satisfied predicate then returns default value', () => 
    {
        expect(linq.firstOrDefault(x => x < 0, 99)).toEqual(99);
        expect(linq.firstOrDefault(x => x > 99)).toBeUndefined();
    });

    it('when called with a non-function predicate then throws an exception', () => 
    {
        expect(() => { linq.firstOrDefault('not-a-function'); }).toThrow();
    });
});