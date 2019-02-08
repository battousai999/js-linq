import {Linq} from '../jslinq';

describe('sum', () =>
{
    let arr = [1, 2, 3, 4, 5, 6];
    let col1 = new Linq(arr);
    let col2 = new Linq(arr.map(x => ({ id: x, value: x * 100 })));
    let isEven = x => x % 2 === 0;

    it('when called on an empty collection then returns 0', () =>
    {
        let results1 = Linq.empty().sum();
        let results2 = Linq.empty().sum(x => x * 2);

        expect(results1).toEqual(0);
        expect(results2).toEqual(0);
    });

    it('when called without a selector on a collection containing null values then returns a sum with nulls as zero values', () =>
    {
        let col = new Linq(arr.map(x => (isEven(x) ? null : x)));
        let results = col.sum();

        expect(results).toEqual(9);
    });

    it('when called without a selector then returns the sum of the items', () =>
    {
        let results = col1.sum();

        expect(results).toEqual(21);
    });

    it('when called with a selector then returns the sum of the projected values', () =>
    {
        let results = col2.sum(x => 2 * x.value);

        expect(results).toEqual(4200);
    });

    it('when called with a selector that returns null values then returns the sum with the nulls as zero values', () =>
    {
        let results = col1.sum(x => (isEven(x) ? null : 2 * x));

        expect(results).toEqual(18);
    });

    it('when called with a selector that returns non-numeric values then throws an exception', () =>
    {
        expect(() => { col1.sum(x => (isEven(x) ? 'a' : x)); }).toThrow();
    });

    it('when called without a selector on a collection containing non-numeric values then throws an exception', () =>
    {
        let col = new Linq([1, 2, 3, 'a', 'b', 'c']);

        expect(() => { col.sum(); }).toThrow();
    });

    it('when called with a non-function selector then throws an exception', () =>
    {
        expect(() => { col1.sum('not-a-function'); }).toThrow();
    });
});
