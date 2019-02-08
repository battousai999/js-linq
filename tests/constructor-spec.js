import {Linq} from '../jslinq';
import {Utils} from './utils';

describe('constructor', () =>
{
    it('when called with iterable (Array) then has elements', () => 
    {
        let arr = [1, 2, 3, 4, 5];
        let linq = new Linq(arr);

        expect(linq.toArray()).toEqual(arr);
    });

    it('when called with an iterable (TypedArray) then has elements', () => 
    {
        let testValues = [10, 20, 30, 40];
        let arr = new Int16Array(4);

        [arr[0], arr[1], arr[2], arr[3]] = testValues;

        let linq = new Linq(arr);
        let results = linq.toArray();

        expect(results).toEqual(testValues);
    });

    it('when called with an iterable (Set) then has elements', () => 
    {
        let testValues = [10, 'test', 33, 'THIS'];
        let linq = new Linq(new Set(testValues));

        expect(Utils.isEqualIgnoringOrder(linq.toArray(), testValues)).toBeTruthy();
    });

    it('when called with an iterable (Map) then has elements', () => 
    {
        let testValues = [
            [0, 'yes'], 
            [7, 'no'], 
            [99, 'div'], 
            [-300, 'limit']
        ];

        let linq = new Linq(new Map(testValues));
        let results1 = linq.toArray().map(x => x[0]);
        let expected1 = testValues.map(x => x[0]);
        let results2 = linq.toArray().map(x => x[1]);
        let expected2 = testValues.map(x => x[1]);

        expect(results1).toEqual(expected1);
        expect(results2).toEqual(expected2);
    });

    it('when called with an iterable (String) then has elements', () => 
    {
        let testValue = 'contravariant';
        let linq = new Linq(testValue);
        let expected = testValue.split('');

        expect(linq.toArray()).toEqual(expected);
    });

    it('when called with a generator then has elements', () => 
    {
        function* gen()
        {
            yield 1;
            yield 2;
            yield 3;
            yield 4;
        }
    
        let linq = new Linq(gen);

        expect(linq.toArray()).toEqual([1, 2, 3, 4]);
    });

    it('when called with a Linq object then has elements', () => 
    {
        let arr = [2, 4, 6, 8, 10];
        let originalLinq = new Linq(arr);
        let linq = new Linq(originalLinq);

        expect(linq.toArray()).toEqual(arr);
    });

    it('when called with a function that returns a generator then has elements', () => 
    {
        let testFunc = () => 
        {
            function* gen()
            {
                yield 1;
                yield 2;
                yield 3;
                yield 4;
            }
        
            return gen;
        };

        let linq = new Linq(testFunc);

        expect(linq.toArray()).toEqual([1, 2, 3, 4]);
    });

    it('when called with a function that returns an iterator then has elements', () => 
    {
        let testValue = ['t', 'e', 's', 't', 'i', 'n', 'g'];
        let testFunc = () => testValue.join('');
        let linq = new Linq(testFunc);

        expect(linq.toArray()).toEqual(testValue);
    });

    it('when called with a function that returns neither an iterator nor a generator and toIterator is called then throws exception', () => 
    {
        let testFunc = () => 99;
        let linq = new Linq(testFunc);

        expect(() => linq.toIterable()).toThrow();
    });

    it('when called with a value that is not a "compatible source" then throws an exception', () => 
    {
        expect(() => 
        { 
            let test = new Linq(99); 
            
            test.toArray();
        }).toThrow();
    });

    it('when called with null then returns empty linq object', () => 
    {
        let linq = new Linq(null);

        expect(linq.toArray()).toEqual([]);
    });
});
