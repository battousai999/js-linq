import {Linq} from '../jslinq';
import {Utils} from './utils';

describe('selectMany', () => 
{
    let col = new Linq([
        { str: 'test', list: [1, 2, 3] }, 
        { str: 'part', list: [4, 5, 6] }, 
        { str: 'time', list: [7, 8, 9] }
    ]);

    it('when called on an empty collection then returns an empty collection', () =>
    {
        let results = Linq.empty()
            .selectMany(x => x.list)
            .toArray();

        expect(results).toEqual([]);
    });

    it('when called with a collection selector then returns a collection containing the appropriate elements', () =>
    {
        let results = col.selectMany(x => x.list).toArray();

        expect(results).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    it('when called with a collection selector that takes the index as the second parameter then returns a collection containing the appropriate elements', () =>
    {
        let results = col
            .selectMany(
                (x, i) => Linq.from(x.list).append((i + 1) * 10),
                x => `b${x}`
            )
            .toArray();

        expect(Utils.isEqualIgnoringOrder(results, ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9', 'b10', 'b20', 'b30'])).toBeTruthy();
    });

    it('when called with a collection selector that returns Linq objects then returns a collection containing the appropriate elements', () =>
    {
        let results = col
            .selectMany(x => Linq.from(x.list).where(y => y % 2 === 0))
            .toArray();

        expect(results).toEqual([2, 4, 6, 8]);
    });

    it('when called with a result selector then returns a collection containing elements to which the result selector was applied', () =>
    {
        let results = col
            .selectMany(
                (x, i) => Linq.from(x.list).append((i + 1) * 10),
                (x, parent) => `${parent.str}-b${x}`
            )
            .toArray();

        expect(Utils.isEqualIgnoringOrder(results, ["test-b1", "test-b2", "test-b3", "part-b4", "part-b5", "part-b6", "time-b7", "time-b8", "time-b9", "test-b10", "part-b20", "time-b30"])).toBeTruthy();
    });

    it('when called without a collection selector then throws an exception', () =>
    {
        expect(() => { col.selectMany(); }).toThrow();
    });

    it('when called with a non-function collection selector then throws an exception', () =>
    {
        expect(() => { col.selectMany('not-a-function'); }).toThrow();
    });

    it('when called with a non-function result selector then throws an exception', () => 
    {
        expect(() => { col.selectMany(x => x.list, 'not-a-function'); }).toThrow();
    });
});
