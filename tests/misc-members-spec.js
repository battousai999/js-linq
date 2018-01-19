import {Linq} from '../jslinq';

describe('isFunction', () => 
{
    it('when called with a function then returns true', () => 
    {
        function testFunc() { return 'test'; }

        expect(Linq.isFunction(testFunc)).toBeTruthy();
        expect(Linq.isFunction((value) => value + 1)).toBeTruthy();
    });

    it('when called with a non-function then returns false', () => 
    {
        expect(Linq.isFunction(null)).toBeFalsy();
        expect(Linq.isFunction(undefined)).toBeFalsy();
        expect(Linq.isFunction('test')).toBeFalsy();
    });
});

describe('isArray', () => 
{
    it('when called with an array then returns true', () => 
    {
        expect(Linq.isArray([])).toBeTruthy();
        expect(Linq.isArray([1, 2, 3])).toBeTruthy();
    });

    it('when called with a non-array then returns false', () => 
    {
        expect(Linq.isArray(null)).toBeFalsy();
        expect(Linq.isArray(undefined)).toBeFalsy();
        expect(Linq.isArray(99)).toBeFalsy();
        expect(Linq.isArray('testing')).toBeFalsy();
    });

});

describe('isString', () => 
{
    it('when called with a string then returns true', () => 
    {
        expect(Linq.isString('')).toBeTruthy();
        expect(Linq.isString('testing')).toBeTruthy();
    });

    it('when called with a non-string then returns false', () => 
    {
        expect(Linq.isString(null)).toBeFalsy();
        expect(Linq.isString(undefined)).toBeFalsy();
        expect(Linq.isString(99)).toBeFalsy();
    });
});

describe('isBoolean', () => 
{
    it('when called with a boolean then returns true', () => 
    {
        expect(Linq.isBoolean(true)).toBeTruthy();
        expect(Linq.isBoolean(false)).toBeTruthy();
    });

    it('when called with a non-boolean then returns false', () => 
    {
        expect(Linq.isBoolean(null)).toBeFalsy();
        expect(Linq.isBoolean(undefined)).toBeFalsy();
        expect(Linq.isBoolean(88)).toBeFalsy();
        expect(Linq.isBoolean('testing')).toBeFalsy();
    });
});

describe('isNumber', () => 
{
    it('when called with a number then returns true', () => 
    {
        expect(Linq.isNumber(99)).toBeTruthy();
        expect(Linq.isNumber(-42)).toBeTruthy();
        expect(Linq.isNumber(3.14)).toBeTruthy();
        expect(Linq.isNumber(-17.17)).toBeTruthy();
    });

    it('when called with a non-number then returns false', () => 
    {
        expect(Linq.isNumber(null)).toBeFalsy();
        expect(Linq.isNumber(undefined)).toBeFalsy();
        expect(Linq.isNumber(true)).toBeFalsy();
        expect(Linq.isNumber('testing')).toBeFalsy();
    });
});

describe('identity', () => 
{
    it('when called with a value then it returns that same value', () => 
    {
        expect(Linq.identity(null)).toBe(null);
        expect(Linq.identity(undefined)).toBe(undefined);
        expect(Linq.identity(99)).toBe(99);
        expect(Linq.identity(true)).toBe(true);
        expect(Linq.identity('testing')).toBe('testing');
    });
});

describe('merge', () => 
{
    it('when called with two values then its first element is correct', () => 
    {
        expect(Linq.merge(11, 22)[0]).toEqual(11);
        expect(Linq.merge(true, false)[0]).toEqual(true);
        expect(Linq.merge('test', 'me')[0]).toEqual('test');
        expect(Linq.merge(null, undefined)[0]).toEqual(null);
    });

    it('when called with two values then its second element is correct', () => 
    {
        expect(Linq.merge(11, 22)[1]).toEqual(22);
        expect(Linq.merge(true, false)[1]).toEqual(false);
        expect(Linq.merge('test', 'me')[1]).toEqual('me');
        expect(Linq.merge(null, undefined)[1]).toEqual(undefined);
    });

    it('when called then it returns an array', () => 
    {
        expect(Array.isArray(Linq.merge(11, 22))).toBeTruthy();
    });

    it('when called with values of different type then it returns the correct elements', () => 
    {
        expect(Linq.merge(11, 'testing')).toEqual([11, 'testing']);
    });
});

describe('isIterable', () => 
{
    it('when called with an array then returns true', () => 
    {
        expect(Linq.isIterable([])).toBeTruthy();
    });

    it('when called with a generator then returns true', () => 
    {
        function* smallSeries()
        {
            yield 1;
            yield 2;
            yield 3;
            yield 4;
            yield 5;
        }

        expect(Linq.isIterable(smallSeries())).toBeTruthy();
    });

    it('when called with a null value then returns false', () => 
    {
        expect(Linq.isIterable(null)).toBeFalsy();
    });

    it('when called with a non-iterable then returns false', () => 
    {
        expect(Linq.isIterable(99)).toBeFalsy();
    });
});

describe('isGenerator', () => 
{
    it('when called with a null value then returns false', () => 
    {
        expect(Linq.isGenerator(null)).toBeFalsy();
    });

    it('when called with a non-generator then return false', () => 
    {
        expect(Linq.isGenerator(99)).toBeFalsy();
    });

    it('when called with a generator then return true', () => 
    {
        function* gen()
        {
            yield 1;
            yield 2;
            yield 3;
        }

        expect(Linq.isGenerator(gen)).toBeTruthy();
    });
});
