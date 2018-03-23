import {Linq} from '../jslinq';
import {Utils} from './utils';

describe('from', () => 
{
    it('when called then returns a Linq object', () => 
    {
        let linq = Linq.from([1, 2, 3]);

        expect(linq).not.toBeNull();
        expect(linq instanceof Linq).toBeTruthy();
    });

    it('when called with an iterable (Array) then has elements', () => 
    {
        let arr = [2, 3, 4, 5, 6];
        let linq = Linq.from(arr);

        expect(linq.toArray()).toEqual(arr);
    });

    it('when called with an iterable (TypedArray) then has elements', () => 
    {
        let testValues = [20, 30, 40, 50];
        let arr = new Int16Array(4);

        [arr[0], arr[1], arr[2], arr[3]] = testValues;

        let linq = Linq.from(arr);
        let results = linq.toArray();

        expect(results).toEqual(testValues);
    });

    it('when called with an iterable (Set) then has elements', () => 
    {
        let testValues = [10, 'test', 33, 'THIS', 99];
        let linq = Linq.from(new Set(testValues));

        expect(Utils.isEqualIgnoringOrder(linq.toArray(), testValues)).toBeTruthy();
    });

    it('when called with an iterable (Map) then has elements', () => 
    {
        let testValues = [
            [-300, 'limit'],
            [0, 'yes'], 
            [7, 'no'], 
            [99, 'div']
        ];

        let linq = Linq.from(new Map(testValues));
        let results1 = linq.toArray().map(x => x[0]);
        let expected1 = testValues.map(x => x[0]);
        let results2 = linq.toArray().map(x => x[1]);
        let expected2 = testValues.map(x => x[1]);

        expect(results1).toEqual(expected1);
        expect(results2).toEqual(expected2);
    });

    it('when called with an iterable (String) then has elements', () => 
    {
        let testValue = 'monomorphism';
        let linq = Linq.from(testValue);
        let expected = testValue.split('');

        expect(linq.toArray()).toEqual(expected);
    });

    it('when called with a generator then has elements', () => 
    {
        function* gen()
        {
            yield 3;
            yield 4;
            yield 1;
            yield 2;
        }
    
        let linq = Linq.from(gen);

        expect(linq.toArray()).toEqual([3, 4, 1, 2]);
    });

    it('when called with a function that returns a generator then has elements', () => 
    {
        let testFunc = () => 
        {
            function* gen()
            {
                yield 3;
                yield 4;
                yield 1;
                yield 2;
            }
        
            return gen;
        };

        let linq = Linq.from(testFunc);

        expect(linq.toArray()).toEqual([3, 4, 1, 2]);
    });

    it('when called with a function that returns an iterator then has elements', () => 
    {
        let testValue = ['t', 'e', 's', 't', 'i', 'n', 'g', ' ', 's', 't', 'u', 'f', 'f'];
        let testFunc = () => testValue.join('');
        let linq = Linq.from(testFunc);

        expect(linq.toArray()).toEqual(testValue);
    });

    it('when called with a function that returns neither an iterator nor a generator and toIterator is called then throws exception', () => 
    {
        let testFunc = () => null;
        let linq = Linq.from(testFunc);

        expect(() => linq.toIterable()).toThrow();
    });

    it('when called with null then returns an empty linq object', () => 
    {
        let linq = Linq.from(null);

        expect(linq.toArray()).toEqual([]);
    });

    it('when called with a Linq object then has elements', () => 
    {
        let arr = [4, 6, 8, 10, 12];
        let originalLinq = new Linq(arr);
        let linq = new Linq(originalLinq);

        expect(linq.toArray()).toEqual(arr);
    });
});
