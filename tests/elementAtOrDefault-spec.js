import {Linq} from '../jslinq';

describe('', () => 
{
    let arr = [1, 2, 3, 4, 5, 6, 7, 8];
    let linq = new Linq(arr);

    it('when called with a negative index then returns default value', () => 
    {
        expect(linq.elementAtOrDefault(-1, 99)).toEqual(99); 
    });

    it('when called without an index then returns default value', () => 
    {
        expect(linq.elementAtOrDefault()).toBeUndefined();
    });

    it('when called with a non-numeric index then returns default value', () => 
    {
        expect(linq.elementAtOrDefault('not-a-number', 99)).toEqual(99);
    });

    it('when called on an iterable having length and with an index larger than the size of the collection then returns default value', () => 
    {
        expect(linq.elementAtOrDefault(arr.length, 99)).toEqual(99);
    });

    it('when called on an iterable having size and with an index larger than the size of the collection then returns default value', () => 
    {
        let arr2 = [1, 2, 3, 4];
        let linq2 = new Linq(new Set(arr2));

        expect(linq2.elementAtOrDefault(arr2.length, 99)).toEqual(99);
    });

    it('when called on an iterable without length or size and with an index larger than the size of the collection then returns default value', () => 
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

        expect(linq2.elementAtOrDefault(5, 'z')).toEqual('z');
    });

    it('when called with an index within the bounds of the collection then returns the index-th element', () => 
    {
        expect(linq.elementAtOrDefault(0, 99)).toEqual(1);
        expect(linq.elementAtOrDefault(5, 99)).toEqual(6);
        expect(linq.elementAtOrDefault(7, 99)).toEqual(8);
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

        expect(linq2.elementAtOrDefault(0, 'z')).toEqual('a');
        expect(linq2.elementAtOrDefault(2, 'z')).toEqual('c');
        expect(linq2.elementAtOrDefault(4, 'z')).toEqual('e');
    });
});
