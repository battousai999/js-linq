import {Linq} from '../jslinq';

describe('single', () => 
{
    let col = new Linq([1, 2, 3, 4, 5]);

    it('when called with an empty collection then throws an exception', () =>
    {
        expect(() => { Linq.empty().single(); }).toThrow();
        expect(() => { Linq.empty().single(x => x > 1); }).toThrow();
    });

    it('when called without a predicate and with a singleton collection then returns the single element of the collection', () =>
    {
        let element = 99;
        let results = Linq.from([element]).single();

        expect(results).toEqual(element);
    });

    it('when called with a predicate and with a collection containing a single element that satisfies the predicate then reutrns the satisfying element', () =>
    {
        let element = 42;
        let results = Linq.from([element]).single(x => x > 10);

        expect(results).toEqual(element);
    });

    it('when called with a predicate and with a collection containing no element that satisfies the predicate then throws an exception', () =>
    {
        expect(() => { col.single(x => x > 10); }).toThrow();
    });

    it('when called with a predicate and with a collection containing multiple elements that satisfies the predciate then throws an exception', () =>
    {
        expect(() => { col.single(x => x > 0); }).toThrow();
    });

    it('when called without a predicate and with a collection containing multiple elements then throws an exception', () =>
    {
        expect(() => { col.single(); }).toThrow();
    });

    it('when called with a non-function predicate then throws an exception', () =>
    {
        expect(() => { col.single('not-a-function'); }).toThrow();
    });
});
