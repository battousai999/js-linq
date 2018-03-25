import {Linq} from '../jslinq';

describe('equiZip', () =>
{
    let arr1 = [1, 2, 3, 4];
    let arr2 = ['a', 'b', 'c', 'd'];

    it('when called with two empty collections then returns an empty collection', () => 
    {
        let linq1 = Linq.empty();
        let linq2 = Linq.empty();
        let results = linq1.equiZip(linq2).toArray();

        expect(results).toEqual([]);
    });

    it('when called with a first empty collection then throws an exception', () => 
    {
        let linq1 = Linq.empty();
        let linq2 = new Linq(arr2);

        expect(() => { linq1.equiZip(linq2).toArray(); }).toThrow();
    });

    it('when called with a second empty collection then throws an exception', () => 
    {
        let linq1 = new Linq(arr1);
        let linq2 = Linq.empty();

        expect(() => { linq1.equiZip(linq2).toArray(); }).toThrow();
    });

    it('when called with two collections of the same size then returns a zipped collection', () => 
    {
        let linq1 = new Linq(arr1);
        let linq2 = new Linq(arr2);
        let results = linq1.equiZip(linq2).toArray();

        expect(results).toEqual([[1, 'a'], [2, 'b'], [3, 'c'], [4, 'd']]);
    });

    it('when called with two collections of different sizes then throws an exception', () => 
    {
        let linq1 = new Linq(arr1.concat([5, 6]));
        let linq2 = new Linq(arr2);

        expect(() => { linq1.equiZip(linq2).toArray(); }).toThrow();
    });

    it('when called with two generator-based collections of different sizes then throws an exception', () => 
    {
        function* gen1()
        {
            yield 1;
            yield 2;
            yield 3;
            yield 4;
        }

        function* gen2()
        {
            yield 'a';
            yield 'b';
            yield 'c';
        }

        function* gen3()
        {
            yield* gen2;
            yield 'd';
            yield 'e';
            yield 'f';
        }

        let linq1 = new Linq(gen1);
        let linq2 = new Linq(gen2);
        let linq3 = new Linq(gen3);

        expect(() => { linq1.equiZip(linq2).toArray(); }).toThrow();
        expect(() => { linq1.equiZip(linq3).toArray(); }).toThrow();
    });

    it('when called without a result selector then returns a collection of tuples', () => 
    {
        let linq1 = new Linq(arr1);
        let linq2 = new Linq(arr2);
        let results = linq1.equiZip(linq2).toArray();

        expect(results).toEqual([[1, 'a'], [2, 'b'], [3, 'c'], [4, 'd']]);
    });

    it('when called with a result selector then returns a collection of elements combinded by the result selector', () => 
    {
        let linq1 = new Linq(arr1);
        let linq2 = new Linq(arr2);
        let results = linq1.equiZip(linq2, (x, y) => x + y).toArray();

        expect(results).toEqual(['1a', '2b', '3c', '4d']);
    });

    it('when called with a non-function result selector then throws an exception', () => 
    {
        let linq1 = new Linq(arr1);
        let linq2 = new Linq(arr2);

        expect(() => { linq1.equiZip(linq2, 'not-a-function').toArray(); }).toThrow();
    });
});
