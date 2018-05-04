import {Linq} from '../jslinq';

describe('where', () => 
{
    let arr = [1, 2, 3, 4, 5];
    let col = new Linq(arr);

    it('when called on an empty collection returns an empty collection', () => 
    {
        let results = Linq.empty()
            .where(x => x > 5)
            .toArray();

        expect(results).toEqual([]);
    });

    it('when called on a collection with no elements satisfying the predicate then returns an empty collection', () => 
    {
        let results = col
            .where(x => x > 99)
            .toArray();

        expect(results).toEqual([]);
    });

    it('when called on a collection with all elements satisfying the predciate then returns an equal collection', () => 
    {
        let results = col
            .where(x => x > 0)
            .toArray();

        expect(results).toEqual(arr);
    });

    it('when called on a collection with some elements satisfying the predicate then returns a collection with the satisfying elements', () => 
    {
        let results = col
            .where(x => x > 2)
            .toArray();

        expect(results).toEqual([3, 4, 5]);
    });

    it('when called without a predicate then throws an exception', () => 
    {
        expect(() => { col.where(); }).toThrow();
    });

    it('when called with a non-function predicate then throws an exception', () => 
    {
        expect(() => { col.where('not-a-function'); }).toThrow();
    });
});
