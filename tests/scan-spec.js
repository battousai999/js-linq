import {Linq} from '../jslinq';

describe('scan', () => 
{
    let arr = [1, 2, 3, 4, 5, 6, 7];
    let col1 = new Linq(arr);
    let col2 = new Linq(['a', 'b', 'c', 'd', 'e']);

    let addition = (x, y) => x + y;

    it('when called on an empty collection then returns an empty collection', () =>
    {
        let results = Linq.empty()
            .scan(addition)
            .toArray();

        expect(results).toEqual([]);
    });

    it('when called on a non-empty collection with no seed then returns a collection of the same size', () =>
    {
        let results = col1.scan(addition).toArray();

        expect(results.length).toEqual(arr.length);
    });

    it('when called on a non-empty collection with no seed then returns a collection with the correct values', () =>
    {
        let result1 = col1.scan(addition).toArray();
        let result2 = col2.scan(addition).toArray();

        expect(result1).toEqual([1, 3, 6, 10, 15, 21, 28]);
        expect(result2).toEqual(['a', 'ab', 'abc', 'abcd', 'abcde']);
    });

    it('when called on a non-empty collection with a seed then returns a collection with the correct values', () => 
    {
        let results = col1.scan(addition, 10).toArray();

        expect(results).toEqual([10, 11, 13, 16, 20, 25, 31, 38]);
    });

    it('when called without an operation then throws an exception', () => 
    {
        expect(() => { col1.scan(); }).toThrow();
    });

    it('when called with a non-function operation then throws an exception', () => 
    {
        expect(() => { col1.scan('not-a-function'); }).toThrow();
    });
});
