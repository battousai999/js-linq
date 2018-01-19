import {Linq} from '../jslinq';
import {Utils} from './utils';

describe('constructor', () =>
{
    it('when called with array then has elements', () => 
    {
        let arr = [1, 2, 3, 4, 5];
        let linq = new Linq(arr);

        expect(linq.toArray()).toEqual(arr);
    });

    it('when called with an iterable then has elements', () =>
    {
        let testValue = ['t', 'e', 's', 't', 'i', 'n', 'g'];
        let linq = new Linq(testValue.join(''));

        expect(linq.toArray()).toEqual(testValue);
    })

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

    it('when called with a function that returns an iterator then has elements', () => 
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
        }

        let linq = new Linq(testFunc);

        expect(linq.toArray()).toEqual([1, 2, 3, 4]);
    });

    it('when called with a function that returns a generator then has elements', () => 
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

    it('when called with null then returns empty linq object', () => 
    {
        let linq = new Linq(null);

        expect(linq.toArray()).toEqual([]);
    });
});