import {Linq} from '../jslinq';

describe('pad', () => 
{
    it('when called on a collection of less than width length then returns a collection of width length', () => 
    {
        let width = 8;

        let results = Linq.from([1, 2, 3, 4])
            .pad(width, 0)
            .toArray();

        expect(results.length).toEqual(width);
    });

    it('when called on a collection of less than width length then returns a collection whose last (width - original_size) elements are equal to the padding value', () => 
    {
        let arr = ['a', 'b', 'c'];
        let width = 10;
        let addedCount = width - arr.length;

        let results = Linq.from(arr)
            .pad(10, '*')
            .toArray()
            .slice(width - addedCount);

        expect(results.every(x => x === '*')).toBeTruthy();
    });

    it('when called on a collection of greater than width length then returns a collection equal to the original collection', () => 
    {
        let arr = [1, 2, 3, 4, 5, 6, 7];

        let results = Linq.from(arr)
            .pad(5, '*')
            .toArray();

        expect(results).toEqual(arr);
    });

    it('when called on an empty collection then returns a collection of width size with every element equal to the padding value', () => 
    {
        let width = 10;
        let paddingValue = '*';

        let results = Linq.empty()
            .pad(width, paddingValue)
            .toArray();

        expect(results.length).toEqual(width);
        expect(results.every(x => x === paddingValue)).toBeTruthy();
    });

    it('when called with a non-number width then throws an exception', () => 
    {
        expect(() => { Linq.from([1, 2, 3]).pad('not-a-number', '*'); }).toThrow();
    });
});
