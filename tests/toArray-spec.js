import {Linq} from '../jslinq';

describe('toArray', () => 
{
    it('when called returns an array', () => 
    {
        let linq = new Linq([1, 2, 3, 4]);

        expect(Linq.isArray(linq.toArray())).toBeTruthy();
    });

    it('when called on a Linq object that is empty returns an empty array', () => 
    {
        let linq = Linq.empty();

        expect(linq.toArray()).toEqual([]);
    });

    it('when called on a Linq object that is not empty returns a non-empty array', () => 
    {
        let arr = [2, 4, 6, 8, 10];
        let linq = new Linq(arr);

        expect(linq.toArray()).toEqual(arr);
    });
});