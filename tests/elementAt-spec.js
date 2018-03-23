import {Linq} from '../jslinq';

describe('elementAt', () => 
{
    let arr = [1, 2, 3, 4, 5, 6, 7, 8];
    let linq = new Linq(arr);

    it('when called with a negative index then throws an exception', () => 
    {
        expect(() => { linq.elementAt(-1); }).toThrow();
    });

    it('when called without an index then throws an exception', () => 
    {
        expect(() => { linq.elementAt(); }).toThrow();
    });

    it('when called with a non-numeric index then throws an exception', () => 
    {
        expect(() => { linq.elementAt('not-a-number'); }).toThrow();
    });

    it('when called on an iterable having length and with an index larger than the size of the collection then throws an exception', () => 
    {
        expect(() => { linq.elementAt(arr.length); }).toThrow();
    });

    it('when called on an iterable having size and with an index larger than the size of the collection then throws an exception', () => 
    {
        let arr2 = [1, 2, 3, 4];
        let linq2 = new Linq(new Set(arr2));

        expect(() => { linq2.elementAt(arr.length); }).toThrow();
    });

    it('when called on an iterable without length or size and with an index larger than the size of the collection then throws an exception', () => 
    {
        function* gen()
        {
            yield 'a';
            yield 'b';
            yield 'c';
            yield 'd';
            yield 'e';
        }

        let linq2 = new Linq(gen);

        expect(() => { linq2.elementAt(5); }).toThrow();
    });

    it('when called with an index within the bounds of the collection then returns the index-th element', () => 
    {
        expect(linq.elementAt(0)).toEqual(1);
        expect(linq.elementAt(5)).toEqual(6);
        expect(linq.elementAt(7)).toEqual(8);
    });

    it('when called on a generator-based collection with an index within the bounds of the collection then returns the index-th element', () => 
    {
        function* gen()
        {
            yield 'a';
            yield 'b';
            yield 'c';
            yield 'd';
            yield 'e';
        }

        let linq2 = new Linq(gen);

        expect(linq2.elementAt(0)).toEqual('a');
        expect(linq2.elementAt(2)).toEqual('c');
        expect(linq2.elementAt(4)).toEqual('e');
    });
});
