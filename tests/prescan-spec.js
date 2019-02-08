import {Linq} from '../jslinq';

describe('prescan', () => 
{
    let arr = [1, 2, 3, 4, 5, 6, 7];
    let col1 = new Linq(arr);
    let col2 = new Linq(['a', 'b', 'c', 'd', 'e']);

    let addition = (x, y) => x + y;

    it('when called on an empty collection then returns an empty collection', () =>
    {
        let results = Linq.empty()
            .prescan(addition, 0)
            .toArray();

        expect(results).toEqual([]);
    });

    it('when called on a non-empty collection then returns a collection of the same size', () =>
    {
        let results = col1.prescan(addition, 0).toArray();

        expect(results.length).toEqual(arr.length);
    });

    it('when called on a non-empty collection then returns collection with correct values', () =>
    {
        let results1 = col1.prescan(addition, 0).toArray();
        let results2 = col2.prescan(addition, '').toArray();

        expect(results1).toEqual([0, 1, 3, 6, 10, 15, 21]);
        expect(results2).toEqual(['', 'a', 'ab', 'abc', 'abcd']);
    });

    it('when results are zipped with original collection then returns same results as the scan operator', () =>
    {
        let prescanResults = col1.prescan(addition, 0);
        let zipResults = col1.zip(prescanResults, addition).toArray();
        let scanResults = col1.scan(addition).toArray();

        expect(zipResults).toEqual(scanResults);
    });

    it('when called without an operation then throws an exception', () =>
    {
        expect(() => { col1.prescan(); }).toThrow();
    });

    it('when called with a non-function operation then throws an exception', () =>
    {
        expect(() => { col1.prescan('not-a-function'); }).toThrow();
    });
});
