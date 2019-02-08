import {Linq} from '../jslinq';

describe('prepend', () => 
{
    let col = new Linq([2, 3, 4, 5, 6]);

    it('when called on an empty collection then returns a collection containing only the prepended value', () => 
    {
        let results = Linq.empty()
            .prepend('a')
            .toArray();

        expect(results).toEqual(['a']);
    });

    it('when called on a non-empty collection then returns a collection containing the prepended value followed by the original elements', () =>
    {
        let results = col.prepend(1).toArray();

        expect(results).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('when called with a value to prepend of null then returns the value null prepended', () =>
    {
        let results = col.prepend(null).toArray();

        expect(results).toEqual([null, 2, 3, 4, 5, 6]);
    });
});
