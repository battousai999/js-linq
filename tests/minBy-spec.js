import {Linq} from '../jslinq';

describe('minBy', () => 
{
    let col = new Linq([
        { id: 1, value: 9000 }, 
        { id: 2, value: 57 }, 
        { id: 3, value: 17 }, 
        { id: 4, value: 23 }, 
        { id: 5, value: 94 }
    ]);

    it('when called with a selector then returns the element with the minimum _selected_ value', () => 
    {
        let results = col.minBy(x => x.value);

        expect(results.id).toEqual(3);
    });

    it('when called without a selector then throws an exception', () => 
    {
        expect(() => { col.minBy(); }).toThrow();
    });

    it('when called on a collection containing a single element then returns that single element', () => 
    {
        let results = Linq.from([{ id: 42, value: 999 }]).minBy(x => x.value);

        expect(results.id).toEqual(42);
    });

    it('when called with a non-function selector then throws an exception', () => 
    {
        expect(() => { col.minBy('not-a-function'); }).toThrow();
    });

    it('when called on an empty collection then throws an exception', () => 
    {
        expect(() => { Linq.empty().minBy(x => x.value); }).toThrow();
    });
});
