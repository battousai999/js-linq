import {Linq} from '../jslinq';

describe('singleOrDefault', () =>
{
    let defaultValue = 999;
    let col = new Linq([1, 2, 3, 4, 5]);

    it('when called with an empty collection then returns default value', () =>
    {
        let results1 = Linq.empty().singleOrDefault(x => x > 10, defaultValue);
        let results2 = Linq.empty().singleOrDefault(null, defaultValue);

        expect(results1).toEqual(defaultValue);
        expect(results2).toEqual(defaultValue);
    });

    it('when called without a predicate and with a singleton collection then returns the single element of the collection', () =>
    {
        let element = 99;
        let results = Linq.from([element]).singleOrDefault(null, defaultValue);

        expect(results).toEqual(element);
    });

    it('when called with a predicate and with a collection containing a single element that satisfies the predicate then returns the satisfying element', () =>
    {
        let element = 99;
        let results = Linq.from([element, -element]).singleOrDefault(x => x > 10, defaultValue);

        expect(results).toEqual(element);
    });

    it('when called with a predicate and with a collection containing no element that satisfies the predicate the returns the default value', () =>
    {
        let results = col.singleOrDefault(x => x > 10, defaultValue);

        expect(results).toEqual(defaultValue);
    });

    it('when called with a predicate and with a collection containing multiple elements that satisfy the predicate then throws an exception', () =>
    {
        expect(() => { col.singleOrDefault(x => x > 0, defaultValue); }).toThrow();
    });

    it('when called without a predicate and with a collection containing multiple elements then throws an exception', () =>
    {
        expect(() => { col.singleOrDefault(null, defaultValue); }).toThrow();
    });

    it('when called without a predicate on an empty collection and without a default value then returns `undefined`', () =>
    {
        let results = Linq.empty().singleOrDefault();

        expect(results).toBeUndefined();
    });

    it('when called with a non-function predicate then throws an exception', () =>
    {  
        expect(() => { col.singleOrDefault('not-a-function'); }).toThrow();
    });
});
