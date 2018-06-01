import {Linq} from '../jslinq';

describe('min', () => 
{
    let col1 = new Linq([15, 42, 98, 6, 475, 3, 333]);
    let col2 = new Linq([{ id: 1, value: 9000 }, { id: 2, value: 57 }, { id: 3, value: 17 }, { id: 4, value: 23 }, { id: 5, value: 94 }]);

    it('when called with a selector then returns the minimum _selected_ value', () => 
    {
        let results = col2.min(x => x.value);

        expect(results).toEqual(17);
    });

    it('when called without a selector then returns the minimum value', () => 
    {
        let results = col1.min();

        expect(results).toEqual(3);
    });

    it('when called on a collection containing a single item then returns that single item', () => 
    {
        let value = 999;
        let results = Linq.from([value]).min();

        expect(results).toEqual(value);
    });

    it('when called with a non-function selector then throws an exception', () => 
    {
        expect(() => { col1.min('not-a-function'); }).toThrow();
    });

    it('when called on an empty collection then throws an exception', () => 
    {
        expect(() => { Linq.empty().min(); }).toThrow();
    });
});
