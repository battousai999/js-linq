import {Linq} from '../jslinq';

describe('append', () =>
{
    it('when called on an empty collection then returns a singleton collection', () => 
    {
        let results = Linq.empty()
            .append('something')
            .toArray();

        expect(results).toEqual(['something']);
    });

    it('when called on a collection then returns the original collection with the value appended', () =>
    {
        let results = Linq.from([1, 2, 3])
            .append(99)
            .toArray();

        expect(results).toEqual([1, 2, 3, 99]);
    });
});
