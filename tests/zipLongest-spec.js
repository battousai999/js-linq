import {Linq} from '../jslinq';

describe('zipLongest', () =>
{
    let col1 = new Linq(['a', 'b', 'c', 'd']);
    let col2 = new Linq(['a', 'b', 'c', 'd', 'e', 'f']);
    let col3 = new Linq([1, 2, 3, 4]);

    let resultSelector = (x, y) => `${x}_${y}`;
    let defaultFirst = '*';
    let defaultSecond = '$';

    it('when called with both collections being empty then returns an empty collection', () =>
    {
        let results = Linq.empty()
            .zipLongest(Linq.empty(), defaultFirst, defaultSecond, resultSelector)
            .toArray();

        expect(results).toEqual([]);
    });

    it('when called with non-empty collections of equal length then returns a zipped-up collection', () =>
    {
        let results = col1.zipLongest(col3, defaultFirst, defaultSecond, resultSelector).toArray();

        expect(results).toEqual(['a_1', 'b_2', 'c_3', 'd_4']);
    });

    it('when called on an empty collection then returns a collection zipped with the first default values', () =>
    {
        let results = Linq.empty()
            .zipLongest(col1, defaultFirst, defaultSecond, resultSelector)
            .toArray();

        expect(results).toEqual(['*_a', '*_b', '*_c', '*_d']);
    });

    it('when called with an empty second collection then returns a collection zipped with the second default values', () =>
    {
        let results = col3.zipLongest(Linq.empty(), defaultFirst, defaultSecond, resultSelector).toArray();

        expect(results).toEqual(['1_$', '2_$', '3_$', '4_$']);
    });

    it('when called with non-empty collections where the first collection is shorter than the second then returns a collection zipped with the first default values', () =>
    {
        let results = col3.zipLongest(col2, defaultFirst, defaultSecond, resultSelector).toArray();

        expect(results).toEqual(['1_a', '2_b', '3_c', '4_d', '*_e', '*_f']);
    });

    it('when called with non-empty collections where the second collection is shorter than the first collection then returns a collection zipped with the second default values', () =>
    {
        let results = col2.zipLongest(col3, defaultFirst, defaultSecond, resultSelector).toArray();

        expect(results).toEqual(['a_1', 'b_2', 'c_3', 'd_4', 'e_$', 'f_$']);
    });

    it('when without a result selector then returns a collection zipped-up with Linq.tuple', () =>
    {
        let results = col1.zipLongest(col3, defaultFirst, defaultSecond).toArray();

        expect(results).toEqual([['a', 1], ['b', 2], ['c', 3], ['d', 4]]);
    });

    it('when called with a non-function result selector then throws an exception', () =>
    {
        expect(() => { col1.zipLongest(col2, defaultFirst, defaultSecond, 'not-a-function'); }).toThrow();
    });
});
