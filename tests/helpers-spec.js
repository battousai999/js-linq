import {Linq} from '../jslinq';

describe('Linq helper functions', () =>
{
    let exampleFunction = Linq.identity;
    let exampleArray = [1, 2, 3];
    let exampleString = "testing";
    let exampleBoolean = true;
    let exampleNumber = 42;
    let exampleSymbol = Symbol("something");
    let exampleIterable = new Set([1, 2, 3, 4]);
    let exampleLinqObject = new Linq([1, 2]);

    function* exampleGenerator() { yield 1; }

    describe('(isFunction)', () =>
    {
        it('when called with a function returns true', () =>
        {
            expect(Linq.isFunction(exampleFunction)).toBeTruthy();
        });

        it('when called with an array then returns false', () =>
        {
            expect(Linq.isFunction(exampleArray)).toBeFalsy();
        });

        it('when called with a string then returns false', () =>
        {
            expect(Linq.isFunction(exampleString)).toBeFalsy();
        });

        it('when called with a boolean then returns false', () =>
        {
            expect(Linq.isFunction(exampleBoolean)).toBeFalsy();
        });

        it('when called with a number then returns false', () =>
        {
            expect(Linq.isFunction(exampleNumber)).toBeFalsy();
        });

        it('when called with a symbol then returns false', () =>
        {
            expect(Linq.isFunction(exampleSymbol)).toBeFalsy();
        });

        it('when called with an iterable then returns false', () =>
        {
            expect(Linq.isFunction(exampleIterable)).toBeFalsy();
        });

        it('when called with a generator then returns true', () =>
        {
            expect(Linq.isFunction(exampleGenerator)).toBeTruthy();
        });
        
        it('when called with a Linq object then returns false', () =>
        {
            expect(Linq.isFunction(exampleLinqObject)).toBeFalsy();
        });
    });

    describe('(isArray)', () =>
    {
        it('when called with a function returns false', () =>
        {
            expect(Linq.isArray(exampleFunction)).toBeFalsy();
        });

        it('when called with an array then returns true', () =>
        {
            expect(Linq.isArray(exampleArray)).toBeTruthy();
        });

        it('when called with a string then returns false', () =>
        {
            expect(Linq.isArray(exampleString)).toBeFalsy();
        });

        it('when called with a boolean then returns false', () =>
        {
            expect(Linq.isArray(exampleBoolean)).toBeFalsy();
        });

        it('when called with a number then returns false', () =>
        {
            expect(Linq.isArray(exampleNumber)).toBeFalsy();
        });

        it('when called with a symbol then returns false', () =>
        {
            expect(Linq.isArray(exampleSymbol)).toBeFalsy();
        });

        it('when called with an iterable then returns false', () =>
        {
            expect(Linq.isArray(exampleIterable)).toBeFalsy();
        });

        it('when called with a generator then returns false', () =>
        {
            expect(Linq.isArray(exampleGenerator)).toBeFalsy();
        });
        
        it('when called with a Linq object then returns false', () =>
        {
            expect(Linq.isArray(exampleLinqObject)).toBeFalsy();
        });
    });

    describe('(isString)', () => 
    {
        it('when called with a function returns false', () =>
        {
            expect(Linq.isString(exampleFunction)).toBeFalsy();
        });

        it('when called with an array then returns false', () =>
        {
            expect(Linq.isString(exampleArray)).toBeFalsy();
        });

        it('when called with a string then returns true', () =>
        {
            expect(Linq.isString(exampleString)).toBeTruthy();
        });

        it('when called with a boolean then returns false', () =>
        {
            expect(Linq.isString(exampleBoolean)).toBeFalsy();
        });

        it('when called with a number then returns false', () =>
        {
            expect(Linq.isString(exampleNumber)).toBeFalsy();
        });

        it('when called with a symbol then returns false', () =>
        {
            expect(Linq.isString(exampleSymbol)).toBeFalsy();
        });

        it('when called with an iterable then returns false', () =>
        {
            expect(Linq.isString(exampleIterable)).toBeFalsy();
        });

        it('when called with a generator then returns false', () =>
        {
            expect(Linq.isString(exampleGenerator)).toBeFalsy();
        });
        
        it('when called with a Linq object then returns false', () =>
        {
            expect(Linq.isString(exampleLinqObject)).toBeFalsy();
        });
    });

    describe('(isBoolean)', () =>
    {
        it('when called with a function returns false', () =>
        {
            expect(Linq.isBoolean(exampleFunction)).toBeFalsy();
        });

        it('when called with an array then returns false', () =>
        {
            expect(Linq.isBoolean(exampleArray)).toBeFalsy();
        });

        it('when called with a string then returns false', () =>
        {
            expect(Linq.isBoolean(exampleString)).toBeFalsy();
        });

        it('when called with a boolean of true then returns true', () =>
        {
            expect(Linq.isBoolean(true)).toBeTruthy();
        });

        it('when called with a boolena of false then returns true', () =>
        {
            expect(Linq.isBoolean(false)).toBeTruthy();
        });

        it('when called with a number then returns false', () =>
        {
            expect(Linq.isBoolean(exampleNumber)).toBeFalsy();
        });

        it('when called with a symbol then returns false', () =>
        {
            expect(Linq.isBoolean(exampleSymbol)).toBeFalsy();
        });

        it('when called with an iterable then returns false', () =>
        {
            expect(Linq.isBoolean(exampleIterable)).toBeFalsy();
        });

        it('when called with a generator then returns false', () =>
        {
            expect(Linq.isBoolean(exampleGenerator)).toBeFalsy();
        });
        
        it('when called with a Linq object then returns false', () =>
        {
            expect(Linq.isBoolean(exampleLinqObject)).toBeFalsy();
        });
    });

    describe('(isNumber)', () =>
    {
        it('when called with a function returns false', () =>
        {
            expect(Linq.isNumber(exampleFunction)).toBeFalsy();
        });

        it('when called with an array then returns false', () =>
        {
            expect(Linq.isNumber(exampleArray)).toBeFalsy();
        });

        it('when called with a string then returns false', () =>
        {
            expect(Linq.isNumber(exampleString)).toBeFalsy();
        });

        it('when called with a boolean then returns false', () =>
        {
            expect(Linq.isNumber(exampleBoolean)).toBeFalsy();
        });

        it('when called with an integer number then returns true', () =>
        {
            expect(Linq.isNumber(99)).toBeTruthy();
        });

        it('when called with a floating-point number then returns true', () =>
        {
            expect(Linq.isNumber(-12.445)).toBeTruthy();
        });

        it('when called with NaN then returns true', () =>
        {
            expect(Linq.isNumber(NaN)).toBeTruthy();
        });

        it('when called with a +Infinity number then returns true', () =>
        {
            expect(Linq.isNumber(42 / +0)).toBeTruthy();
        });

        it('when called with a -Infinity number then returns true', () =>
        {
            expect(Linq.isNumber(42 / -0)).toBeTruthy();
        });

        it('when called with a symbol then returns false', () =>
        {
            expect(Linq.isNumber(exampleSymbol)).toBeFalsy();
        });

        it('when called with an iterable then returns false', () =>
        {
            expect(Linq.isNumber(exampleIterable)).toBeFalsy();
        });

        it('when called with a generator then returns false', () =>
        {
            expect(Linq.isNumber(exampleGenerator)).toBeFalsy();
        });
        
        it('when called with a Linq object then returns false', () =>
        {
            expect(Linq.isNumber(exampleLinqObject)).toBeFalsy();
        });
    });

    describe('(isSymbol)', () =>
    {
        it('when called with a function returns false', () =>
        {
            expect(Linq.isSymbol(exampleFunction)).toBeFalsy();
        });

        it('when called with an array then returns false', () =>
        {
            expect(Linq.isSymbol(exampleArray)).toBeFalsy();
        });

        it('when called with a string then returns false', () =>
        {
            expect(Linq.isSymbol(exampleString)).toBeFalsy();
        });

        it('when called with a boolean then returns false', () =>
        {
            expect(Linq.isSymbol(exampleBoolean)).toBeFalsy();
        });

        it('when called with a number then returns false', () =>
        {
            expect(Linq.isSymbol(exampleNumber)).toBeFalsy();
        });

        it('when called with a symbol then returns true', () =>
        {
            expect(Linq.isSymbol(exampleSymbol)).toBeTruthy();
        });

        it('when called with an iterable then returns false', () =>
        {
            expect(Linq.isSymbol(exampleIterable)).toBeFalsy();
        });

        it('when called with a generator then returns false', () =>
        {
            expect(Linq.isSymbol(exampleGenerator)).toBeFalsy();
        });
        
        it('when called with a Linq object then returns false', () =>
        {
            expect(Linq.isSymbol(exampleLinqObject)).toBeFalsy();
        });
    });

    describe('(isIterable)', () =>
    {
        it('when called with a function returns false', () =>
        {
            expect(Linq.isIterable(exampleFunction)).toBeFalsy();
        });

        it('when called with an array then returns true', () =>
        {
            expect(Linq.isIterable(exampleArray)).toBeTruthy();
        });

        it('when called with a string then returns true', () =>
        {
            expect(Linq.isIterable(exampleString)).toBeTruthy();
        });

        it('when called with a boolean then returns false', () =>
        {
            expect(Linq.isIterable(exampleBoolean)).toBeFalsy();
        });

        it('when called with a number then returns false', () =>
        {
            expect(Linq.isIterable(exampleNumber)).toBeFalsy();
        });

        it('when called with a symbol then returns false', () =>
        {
            expect(Linq.isIterable(exampleSymbol)).toBeFalsy();
        });

        it('when called with an iterable then returns true', () =>
        {
            expect(Linq.isIterable(exampleIterable)).toBeTruthy();
        });

        it('when called with a generator then returns false', () =>
        {
            expect(Linq.isIterable(exampleGenerator)).toBeFalsy();
        });
        
        it('when called with a Linq object then returns false', () =>
        {
            expect(Linq.isIterable(exampleLinqObject)).toBeFalsy();
        });

    });

    describe('(isGenerator)', () =>
    {
        it('when called with a function returns false', () =>
        {
            expect(Linq.isGenerator(exampleFunction)).toBeFalsy();
        });

        it('when called with an array then returns false', () =>
        {
            expect(Linq.isGenerator(exampleArray)).toBeFalsy();
        });

        it('when called with a string then returns false', () =>
        {
            expect(Linq.isGenerator(exampleString)).toBeFalsy();
        });

        it('when called with a boolean then returns false', () =>
        {
            expect(Linq.isGenerator(exampleBoolean)).toBeFalsy();
        });

        it('when called with a number then returns false', () =>
        {
            expect(Linq.isGenerator(exampleNumber)).toBeFalsy();
        });

        it('when called with a symbol then returns false', () =>
        {
            expect(Linq.isGenerator(exampleSymbol)).toBeFalsy();
        });

        it('when called with an iterable then returns false', () =>
        {
            expect(Linq.isGenerator(exampleIterable)).toBeFalsy();
        });

        it('when called with a generator then returns true', () =>
        {
            expect(Linq.isGenerator(exampleGenerator)).toBeTruthy();
        });
        
        it('when called with a Linq object then returns false', () =>
        {
            expect(Linq.isGenerator(exampleLinqObject)).toBeFalsy();
        });
    });

    describe('(isLinq)', () =>
    {
        it('when called with a function returns false', () =>
        {
            expect(Linq.isLinq(exampleFunction)).toBeFalsy();
        });

        it('when called with an array then returns false', () =>
        {
            expect(Linq.isLinq(exampleArray)).toBeFalsy();
        });

        it('when called with a string then returns false', () =>
        {
            expect(Linq.isLinq(exampleString)).toBeFalsy();
        });

        it('when called with a boolean then returns false', () =>
        {
            expect(Linq.isLinq(exampleBoolean)).toBeFalsy();
        });

        it('when called with a number then returns false', () =>
        {
            expect(Linq.isLinq(exampleNumber)).toBeFalsy();
        });

        it('when called with a symbol then returns false', () =>
        {
            expect(Linq.isLinq(exampleSymbol)).toBeFalsy();
        });

        it('when called with an iterable then returns false', () =>
        {
            expect(Linq.isLinq(exampleIterable)).toBeFalsy();
        });

        it('when called with a generator then returns false', () =>
        {
            expect(Linq.isLinq(exampleGenerator)).toBeFalsy();
        });
        
        it('when called with a Linq object then returns true', () =>
        {
            expect(Linq.isLinq(exampleLinqObject)).toBeTruthy();
        });
    });

    describe('(isPrimitive)', () =>
    {
        it('when called with a function returns false', () =>
        {
            expect(Linq.isPrimitive(exampleFunction)).toBeFalsy();
        });

        it('when called with an array then returns false', () =>
        {
            expect(Linq.isPrimitive(exampleArray)).toBeFalsy();
        });

        it('when called with a string then returns true', () =>
        {
            expect(Linq.isPrimitive(exampleString)).toBeTruthy();
        });

        it('when called with a boolean then returns true', () =>
        {
            expect(Linq.isPrimitive(exampleBoolean)).toBeTruthy();
        });

        it('when called with a number then returns true', () =>
        {
            expect(Linq.isPrimitive(exampleNumber)).toBeTruthy();
        });

        it('when called with a symbol then returns true', () =>
        {
            expect(Linq.isPrimitive(exampleSymbol)).toBeTruthy();
        });

        it('when called with null then returns true', () =>
        {
            expect(Linq.isPrimitive(null)).toBeTruthy();
        });

        it('when called with undefined then returns true', () =>
        {
            expect(Linq.isPrimitive(undefined)).toBeTruthy();
        });

        it('when called with an iterable then returns false', () =>
        {
            expect(Linq.isPrimitive(exampleIterable)).toBeFalsy();
        });

        it('when called with a generator then returns false', () =>
        {
            expect(Linq.isPrimitive(exampleGenerator)).toBeFalsy();
        });
        
        it('when called with a Linq object then returns false', () =>
        {
            expect(Linq.isPrimitive(exampleLinqObject)).toBeFalsy();
        });
    });
});
