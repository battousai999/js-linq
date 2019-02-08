import {Linq} from '../jslinq';

describe('max', () => 
{
    let col1 = new Linq([15, 42, 98, 6, 475, 3, 333]);
    let col2 = new Linq([{ id: 1, value: 9000 }, { id: 2, value: 57 }, { id: 3, value: 17 }, { id: 4, value: 23 }, { id: 5, value: 94 }]);

    it('when called with a selector then returns the maximum _selected_ value', () => 
    {
        let results = col2.max(x => x.value);

        expect(results).toEqual(9000);
    });

    it('when called without a selector then returns the maximum element', () => 
    {
        let results = col1.max();

        expect(results).toEqual(475);
    });

    it('when called called on a collection containing a single element then returns that single element', () => 
    {
        let value = 777;
        let results = Linq.from([value]).max();

        expect(results).toEqual(value);
    });

    it('when called with a non-function selector then throws an exception', () => 
    {
        expect(() => { col1.max('not-a-function'); }).toThrow();
    });

    it('when called on an empty collection then throws an exception', () => 
    {
        expect(() => { Linq.empty().max(x => x.value); }).toThrow();
    });
});
