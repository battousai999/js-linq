import {Linq} from '../jslinq';

describe('defaultIfEmpty', () => 
{
    it('when called on an empty collection then returns collection with default value', () => 
    {
        var arr = Linq.empty().defaultIfEmpty(99).toArray();

        expect(arr).toEqual([99]);
    });

    it('when called on an non-empty collection then returns a collection equal to the original collection', () => 
    {
        var arr1 = [1, 2, 3, 4];
        var arr2 = Linq.from(arr1).defaultIfEmpty(99).toArray();

        expect(arr2).toEqual(arr1);
    });

    it('when called on an empty collection with a default value of `null` then returns a collection containing null', () => 
    {
        var arr = Linq.empty().defaultIfEmpty(null).toArray();

        expect(arr).toEqual([null]);
    });
});