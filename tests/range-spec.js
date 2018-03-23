import {Linq} from '../jslinq';

describe('range', () => 
{
    it('when called then returns a Linq object', () => 
    {
        let linq = Linq.range(1, 10);

        expect(linq).not.toBeNull();
        expect(linq instanceof Linq).toBeTruthy();
    });

    it('when called with a \'to\' larger than its \'from\' (and with positive \'step\') then returns a Linq object with the correct contents', () => 
    {
        let linq = Linq.range(2, 10);

        expect(linq.toArray()).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });

    it('when called with a \'to\' of the same value as its \'from\' then returns a Linq object of size 1', () => 
    {
        let linq = Linq.range(10, 10);

        expect(linq.toArray().length).toEqual(1);
        expect(linq.toArray()).toEqual([10]);
    });

    it('when called with a \'to\' smaller than its \'from\' (and with positive \'step\') then returns a Linq object of size 0', () => 
    {
        let linq = Linq.range(10, 8);

        expect(linq.toArray().length).toEqual(0);
    });

    it('when called without a \'step\' then the \'step\' value defaults to 1', () => 
    {
        let linq = Linq.range(20, 22);

        expect(linq.toArray()).toEqual([20, 21, 22]);
    });

    it('when called with a \'to\' smaller than its \'from\' (and with negative \'step\') then returns a Linq object with the correct contents', () => 
    {
        let linq = Linq.range(10, 6, -2);

        expect(linq.toArray()).toEqual([10, 8, 6]);
    });

    it('when called with a \'to\' larger than its \'from\' (and with negative \'step\') then returns a Linq object of size 0', () => 
    {
        let linq = Linq.range(5, 11, -3);

        expect(linq.toArray().length).toEqual(0);
    });

    it('when called with a \'step\' of 0 then throws an exception', () => 
    {
        expect(() => Linq.range(9, 99, 0)).toThrow();
    });

    it('when called with a null \'from\' value then throws an exception', () => 
    {
        expect(() => Linq.range(null, 5)).toThrow();
    });

    it('when called with a null \'to\' value then throws an exception', () => 
    {
        expect(() => Linq.range(1, null)).toThrow();
    });
});
