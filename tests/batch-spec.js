import {Linq} from '../jslinq';

describe('batch', () => 
{
    let linq = new Linq([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

    it('when called with a size of 1 then returns singleton arrays', () => 
    {
        let results = linq.batch(1).toArray();

        expect(results).toEqual([[1], [2], [3], [4], [5], [6], [7], [8], [9], [10], [11], [12]]);
    });

    it('when called with a size greater than 1 then returns batched arrays', () => 
    {
        let results = linq.batch(5).toArray();

        expect(results).toEqual([[1, 2, 3, 4, 5], [6, 7, 8, 9, 10], [11, 12]]);
    });

    it('when called with a size greater than the size of the collection then returns a single array', () => 
    {
        let results = linq.batch(10000).toArray();

        expect(results).toEqual([[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]]);
    });

    it('when called on an empty collection then returns an empty collection', () => 
    {
        let results = Linq.empty().batch(10).toArray();

        expect(results).toEqual([]);
    });

    it('when called with a size that does not evenly divide the collection size then returns a smaller final bucket', () =>
    {
        let size = 7;
        let results = linq.batch(size).toArray();

        expect(linq.toArray().length % size).not.toEqual(0);
        expect(results[1].length).toBeLessThan(size);
    });

    it('when called with a result selector then returns projected values', () => 
    {
        let results = linq.batch(4, x => x * 2).toArray();

        expect(results).toEqual([[2, 4, 6, 8], [10, 12, 14, 16], [18, 20, 22, 24]]);
    });

    // This test is to verify that the generator function internal to the batch function
    // can successfully be consecutively invoked.
    it('when called multiple times then each instance returns results', () => 
    {
        let results1 = linq.batch(4).toArray();
        let results2 = linq.batch(6).toArray();

        expect(results1).toEqual([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]);
        expect(results2).toEqual([[1, 2, 3, 4, 5, 6], [7, 8, 9, 10, 11, 12]]);
    });

    it('when called with a non-function result selector then throws an exception', () => 
    {
        expect(() => { linq.batch(5, 'not-a-function'); }).toThrow();
    });

    it('when called with a non-number size then throws an exception', () => 
    {
        expect(() => { linq.batch('not-a-number'); }).toThrow();
    });

    it('when called with a size less than 1 then throws an exception', () => 
    {
        expect(() => { linq.batch(-11); }).toThrow();
        expect(() => { linq.batch(0); }).toThrow();
    });
});