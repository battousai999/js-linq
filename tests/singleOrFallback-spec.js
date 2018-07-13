import {Linq} from '../jslinq';

describe('singleOrFallback', () =>
{
    let col = new Linq([1, 2, 3, 4, 5]);

    it('when called on an empty collection then returns the value returned by the fallback function', () =>
    {
        let element = 99;
        let fallback = () => element;
        let results = Linq.empty().singleOrFallback(fallback);

        expect(results).toEqual(element);
    });

    it('when called on a singleton collection then returns the single element of the collection', () =>
    {
        let element = 99;
        let fallback = () => element + 1;
        let results = Linq.from([element]).singleOrFallback(fallback);

        expect(results).toEqual(element);
    });

    it('when called on a collection containing multiple elements then throws an exception', () =>
    {
        let fallback = () => 99;
        
        expect(() => { col.singleOrFallback(fallback); }).toThrow();
    });

    it('when called without a fallback function then throws an exception', () =>
    {
        expect(() => { col.singleOrFallback(); }).toThrow();
    });

    it('when called with a non-function fallback function then throws an exception', () =>
    {
        expect(() => { col.singleOrFallback('not-a-function'); }).toThrow();
    });
});
