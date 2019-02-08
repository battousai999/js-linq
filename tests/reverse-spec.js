import {Linq} from '../jslinq';

describe('reverse', () => 
{
    it('when called on an empty collection then returns an empty collection', () => 
    {
        let results = Linq.empty()
            .reverse()
            .toArray();

        expect(results).toEqual([]);
    });

    it('when called on a single-item collection then returns an equal collection', () => 
    {
        let results = Linq.from([99])
            .reverse()
            .toArray();

        expect(results).toEqual([99]);
    });

    it('when called on a multi-item collection then returns a reversed collection', () => 
    {
        let arr = [1, 2, 3, 4, 5];

        let results = Linq.from(arr)
            .reverse()
            .toArray();

        expect(results).toEqual(arr.reverse());
    });

    it('when called on a non-array but indexable collection then returns a reversed collection', () => 
    {
        let arr = [1, 2, 3, 4];
        let set = new Set(arr);

        let results = Linq.from(set)
            .reverse()
            .toArray();

        expect(results).toEqual(arr.reverse());
    });

    it('when called on a non-indexable collection then returns a reversed collection', () =>
    {
        function* gen()
        {
            yield 1;
            yield 2;
            yield 3;
            yield 4;
            yield 5;
            yield 6;
        }

        let results = Linq.from(gen)
            .reverse()
            .toArray();

        expect(results).toEqual([6, 5, 4, 3, 2, 1]);
    });
});
