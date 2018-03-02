import {Linq} from '../jslinq';

describe('concat', () => 
{
    let arr = [1, 2, 3];
    let linq = new Linq(arr);
    let empty = new Linq([]);

    it('when called on an empty collection then returns the passed collection', () => 
    {
        let results = empty.concat(linq).toArray();
        
        expect(results).toEqual(arr);
    });

    it('when called with an empty collection then returns the source collection', () => 
    {
        let results = linq.concat(empty).toArray();

        expect(results).toEqual(arr)
    });

    it('when called with a non-empty collection then returns the concatenation', () => 
    {
        let linq2 = new Linq([4, 5, 6]);
        let results = linq.concat(linq2).toArray();

        expect(results).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('when called with a null collection then returns the source collection', () => 
    {
        let results = linq.concat(null).toArray();

        expect(results).toEqual(arr);
    });

    it('when called with an iterable then returns the concatenation', () => 
    {
        let results = linq.concat([4, 5, 6]).toArray();

        expect(results).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('when called with a generator then returns the concatenation', () => 
    {
        function* gen()
        {
            yield 3;
            yield 2;
            yield 1;
        }

        let results = linq.concat(gen).toArray();

        expect(results).toEqual([1, 2, 3, 3, 2, 1]);
    });
});