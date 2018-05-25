import {Linq} from '../jslinq';

describe('last', () => 
{
    let arr = [1, 2, 3, 4, 5, 6];
    let col = new Linq(arr);

    it('when called on an empty collection then throws an exception', () => 
    {
        expect(() => { Linq.empty().last(); }).toThrow();
        expect(() => { Linq.empty().last(x => x === 1); }).toThrow();
    });

    it('when called on a non-empty collection without a predicate then returns the last element', () => 
    {
        let results = col.last();

        expect(results).toEqual(arr[arr.length - 1]);
    });

    it('when called on a collection containing one element that satisfies the predicate then returns that element', () => 
    {
        let results = col.last(x => x === 4);

        expect(results).toEqual(4);
    });

    it('when called on a collection containing multiple elements that satisfy the predicate then returns the last one', () => 
    {
        let results = col.last(x => x < 5);

        expect(results).toEqual(4);
    });

    it('when called on a collection containing no elements that satisfy the predicate then throws an exception', () => 
    {
        expect(() => { col.last(x => x < 0); }).toThrow();
    });

    it('when called on a collection containing at least one null value with a predicate that is satisfied with a null value then returns null', () => 
    {
        let results = Linq.from([1, null, 2, null, 3]).last(x => x === null);
        
        expect(results).toBeNull();
    });

    it('when called with a non-function predicate then throws an exception', () => 
    {
        expect(() => { col.last('not-a-function'); }).toThrow();
    });

    it('when called on a non-indexable collection containing at least one element that satisfies the predicate then returns the element', () => 
    {
        function* gen()
        {
            yield 1;
            yield 2;
            yield 3;
            yield 4;
            yield 5;
        }

        let results = Linq.from(gen).last(x => x < 3);

        expect(results).toEqual(2);
    });

    it('when called on a non-indexable collection containing no elements that satisfy the predicate then throws an exception', () => 
    {
        function* gen()
        {
            yield 1;
            yield 2;
            yield 3;
            yield 4;
            yield 5;
        }

        let col2 = new Linq(gen);
        
        expect(() => { col2.last(x => x < 0); }).toThrow();
    });

    it('when called on a non-indexable collection without a predicate then returns last element', () => 
    {
        function* gen()
        {
            yield 1;
            yield 2;
            yield 3;
            yield 4;
            yield 5;
        }

        let results = Linq.from(gen).last();

        expect(results).toEqual(5);
    });
});
