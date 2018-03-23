import {Linq} from '../jslinq';

describe('empty', () => 
{
    it('when called returns an empty collection', () => 
    {
        expect(Linq.empty().toArray()).toEqual([]);
    });
});
