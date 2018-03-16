import {Linq} from '../jslinq';

describe('count', () => 
{
    let size = 20;
    let linq = Linq.range(1, size);
    let isEven = x => x % 2 === 0;    

    it('when called on an empty collection then return 0', () => 
    {
        expect(Linq.empty().count()).toEqual(0);
    });

    it('when called on a non-empty collection then return size of collection', () => 
    {
        expect(linq.count()).toEqual(size);
    });

    it('when called on a non-empty collection that has a `length` property then return value of length property', () => 
    {
        let arr = [1, 2, 3, 4, 5, 6, 7];
        let linq = new Linq(arr);

        expect(linq.count()).toEqual(arr.length);
    });

    it('when called on a non-empty collection that has a `size` property then return value of size property', () => 
    {
        let set = new Set([1, 2, 3, 4, 5]);
        let linq = new Linq(set);

        expect(linq.count()).toEqual(set.size);
    });

    it('when called with a predicate on a collection having all elements satisfying the predicate then return same value as collection size', () => 
    {
        expect(linq.count(x => x > 0)).toEqual(size);
    });

    it('when called with a predicate on a collection having no elements satisfying the predicate then return 0', () => 
    {
        expect(linq.count(x => x === 0)).toEqual(0);
    });

    it('when called with a predicate on a collection having some elements satisfying the predicate then return a value equal to the number of elements satisfying the predicate', () => 
    {
        expect(linq.count(isEven)).toEqual(10);
    });

    it('when called with a predicate on an empty collection then return 0', () => 
    {
        expect(Linq.empty().count(isEven)).toEqual(0);
    });

    it('when called with a non-function predicate then throw an exception', () => 
    {
        expect(() => { linq.count('not-a-function'); }).toThrow();
    });
});