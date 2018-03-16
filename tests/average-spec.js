import {Linq} from '../jslinq';

describe('average', () => 
{
    let arr = [1, 2, 3, 4, 5, 6, 7, 8];
    let linq1 = new Linq(arr);
    let linq2 = new Linq([{ id: 1, value: 100 }, { id: 2, value: 200 }, { id: 3, value: 300 }, { id: 4, value: 400 }]);

    it('when called with a selector then returns correct average value', () => 
    {
        expect(linq2.average(x => x.value)).toEqual(250);
    });

    it('when called without a selector then returns correct average value', () => 
    {
        expect(linq1.average()).toEqual(4.5);
    });

    it('when called on an empty collection then returns 0', () => 
    {
        let linq = Linq.empty();

        expect(linq.average()).toEqual(0);
    });

    it('when called with a non-function selector then throws an exception', () => 
    {
        expect(() => { linq1.average('not-a-function'); }).toThrow();
    });

    it('when called on a collection containing some null values then returns the save value as the collection without null values', () =>
    {
        let linq = new Linq([null, ...arr]);
        let expectedValue = linq1.average();

        expect(linq.average()).toEqual(expectedValue);
    });

    it('when called without a selector on a collection containing a non-number value then throws an exception', () => 
    {
        let linq = new Linq([1, 2, 'a', 3, 4]);

        expect(() => { linq.average(); }).toThrow();
    });

    it('when called with a selector that returns a non-number value then throws an exception', () => 
    {
        let selector = x => (x.id > 1 ? 'a' : x.value);

        expect(() => { linq2.average(selector); }).toThrow();
    });
});