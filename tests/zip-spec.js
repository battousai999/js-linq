import {Linq} from '../jslinq';

describe('zip', () => 
{
    let col1 = new Linq(['a', 'b', 'c', 'd']);
    let col2 = new Linq(['a', 'b', 'c', 'd', 'e', 'f']);
    let col3 = new Linq([1, 2, 3, 4]);

    let resultSelector = (x, y) => `${x}_${y}`;

    it('when called when either collection is empty then returns an empty collection', () =>
    {
        let result1 = col1.zip(Linq.empty()).toArray();

        let result2 = Linq.empty()
            .zip(col1)
            .toArray();

        let result3 = Linq.empty()
            .zip(Linq.empty())
            .toArray();

        expect(result1).toEqual([]);
        expect(result2).toEqual([]);
        expect(result3).toEqual([]);
    });

    it('when called on non-empty collections of equal length then returns a zipped-up collection of the same length', () =>
    {
        let results = col1.zip(col3, resultSelector).toArray();

        expect(results).toEqual(['a_1', 'b_2', 'c_3', 'd_4']);
    });

    it('when called on non-empty collections of unequal length then returns a zipped-up collection of a size equal to the smallest of the collections', () =>
    {
        let results = col2.zip(col3, resultSelector).toArray();

        expect(results).toEqual(['a_1', 'b_2', 'c_3', 'd_4']);
    });

    it('when called with a null second collection then returns an empty collection', () =>
    {
        let results = col1.zip(null, resultSelector).toArray();

        expect(results).toEqual([]);
    });

    it('when called with an array as the second collection then returns a zipped-up collection', () =>
    {
        let results = col2.zip([1, 2, 3, 4, 5, 6, 7, 8], resultSelector).toArray();

        expect(results).toEqual(['a_1', 'b_2', 'c_3', 'd_4', 'e_5', 'f_6']);
    });

    it('when called without a result selector then returns a collection zipped-up using Linq.tuple', () =>
    {
        let results = col1.zip(col3).toArray();

        expect(results).toEqual([['a', 1], ['b', 2], ['c', 3], ['d', 4]]);
    });

    it('when called with a non-function result selector then throws an exception', () =>
    {
        expect(() => { col1.zip(col3, 'not-a-function'); }).toThrow();
    });
});
