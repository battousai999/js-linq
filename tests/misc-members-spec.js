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