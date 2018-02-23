import {Linq} from '../jslinq';

describe('aggregate', () => 
{
    let empty = new Linq([]);
    let linq1 = new Linq([1, 4, 5]);
    let linq2 = new Linq(['a', 'b', 'c', 'd', 'e']);
    let linq3 = new Linq([1, 2, 3, 4, 5, 6]);

    let aggregateFunc = (current, value) => current * 2 + value;
    let addition = (x, y) => x + y;

    it('when called with a seed a non-empty collection then returns correct aggregate value', () => 
    {
        expect(linq1.aggregate(5, aggregateFunc)).toEqual(57);
        expect(linq2.aggregate('', addition)).toEqual('abcde');
    });

    it('when called with a seed and an empty collection then returns the seed', () => 
    {
        let seed = 99;

        expect(empty.aggregate(seed, aggregateFunc)).toEqual(seed);
    });

    it('when called without a seed and with an empty collection then throws an exception', () => 
    {
        expect(() => { empty.aggregate(null, aggregateFunc); }).toThrow();
    });

    it('when called without a seed and with a single-element collection then returns the value of the single element', () => 
    {
        let value = 111;
        let linq = new Linq([value]);

        expect(linq.aggregate(null, aggregateFunc)).toEqual(value);
    });

    it('when called without a seed and with a collection of size greater than 1 then returns correct aggregate value', () => 
    {
        expect(linq1.aggregate(null, aggregateFunc)).toEqual(17);
        expect(linq3.aggregate(null, addition)).toEqual(21);
    });

    it('when called with a resultSelector then returns the value of the aggregation passed to the resultSelector', () => 
    {
        let selector = x => 'value: ' + x;

        expect(linq1.aggregate(5, aggregateFunc, selector)).toEqual('value: 57');
    });

    it('when called without an operation then throws an exception', () => 
    {
        expect(() => { linq1.aggregate(5, null); }).toThrow();
    });

    it('when called with an operation that is not a function then throws an exception', () => 
    {
        expect(() => { linq2.aggregate('', 'not-a-function'); }).toThrow();
    });

    it('when called with a resultSelector that is not a function then throws an exception', () => 
    {
        expect(() => { linq1.aggregate(5, aggregateFunc, 'not-a-function'); }).toThrow();
    });
});