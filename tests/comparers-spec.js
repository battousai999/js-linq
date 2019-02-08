import {Linq} from '../jslinq';

let isInOrder = x => expect(x).toBeLessThan(0);
let isOutOfOrder = x => expect(x).toBeGreaterThan(0);
let isEqualOrder = x => expect(x).toBe(0);

let isEqual = x => expect(x).toBeTruthy();
let isNotEqual = x => expect(x).toBeFalsy();

let runTestScenarios = (comparer, expectation, samples) =>
{
    return samples.every(([x, y]) => expectation(comparer(x, y)));
};

describe('generalComparer', () => 
{
    let compare = Linq.generalComparer;

    it('when only first parameter is null then indicate as in-order', () => 
    {
        runTestScenarios(compare, isInOrder,
            [
                [null, 99],
                [null, true],
                [null, 'testing']
            ]);
    });

    it('when only second parameter is null then indicate as out-of-order', () => 
    {
        runTestScenarios(compare, isOutOfOrder,
            [
                [99, null],
                [true, null],
                ['testing', null]
            ]);
    });

    it('when both parameters are null then indicate as equal', () => 
    {
        runTestScenarios(compare, isEqualOrder,
            [
                [null, null],
                [undefined, undefined]
            ]);
    });

    it('when first parameter is \'smaller\' than second parameter then indicate as in-order', () => 
    {
        runTestScenarios(compare, isInOrder,
            [
                [11, 222],
                [-3224, 34],
                [9.7, 103.6],
                [-5919.1, 103.6],
                [false, true],
                ['aaa', 'bbb']
            ]);
    });

    it('when first parameter is \'larger\' than second parameter then indicate as out-of-order', () => 
    {
        runTestScenarios(compare, isOutOfOrder,
            [
                [2345, 4],
                [135, -34221],
                [999.99, 3.2],
                [999.99, -12345.9],
                [true, false],
                ['yyy', 'ccc']
            ]);
    });

    it('when first parameter is neither \'smaller-than\' nor \'larger-than\' second parameter then indicate as equal', () => 
    {
        runTestScenarios(compare, isEqualOrder,
            [
                [24, 24],
                [-152, -152],
                [92.7, 92.7],
                [-599.31, -599.31],
                [false, false],
                ['eee', 'eee']
            ]);
    });
});

describe('caseSensitiveStringComparer', () => 
{
    let compare = Linq.caseSensitiveStringComparer;

    it('when first parameter is null then indicate as in-order', () => 
    {
        runTestScenarios(compare, isInOrder,
            [
                [null, 'test'],
                [null, '']
            ]);
    });

    it('when second parameter is null then indicate as out-of-order', () => 
    {
        runTestScenarios(compare, isOutOfOrder,
            [
                ['testing', null],
                ['', null]
            ]);
    });

    it('when both parameters are null then indicate as equal', () => 
    {
        runTestScenarios(compare, isEqualOrder,
            [
                [null, null],
                [undefined, undefined]
            ]);
    });

    it('when first parameter is lexicographically smaller-than second parameter then indicate as in-order', () => 
    {
        // Note: computer lexicographical ordering puts uppercase before lowercase
        runTestScenarios(compare, isInOrder,
            [
                ['', 'testing'],
                ['TEST', 'test'],
                ['teSt', 'test'],
                ['aaa', 'bbb'],
                ['aaabbb', 'aaaccc'],
                ['aaa', 'b'],
                ['ZZZ', 'aa'],
                ['aaa', 'aaaa']
            ]);
    });

    it('when first parameter is lexicographically larger-than second parameter then indicate as out-of-order', () => 
    {
        // Note: computer lexicographical ordering puts uppercase before lowercase
        runTestScenarios(compare, isOutOfOrder,
            [
                ['tester', ''],
                ['cat', 'CAT'],
                ['haskell', 'hasKell'],
                ['ddd', 'aaa'],
                ['aaazzz', 'aaafff'],
                ['c', 'bbb'],
                ['bb', 'YYYY']
            ]);
    });

    it('when first parameter is neither lexicographically smaller-than nor lexicographically larger-than second parameter then indicate as equal', () => 
    {
        runTestScenarios(compare, isEqualOrder,
            [
                ['', ''],
                ['abcdef', 'abcdef'],
                ['TESTING', 'TESTING'],
                ['fuNCTor', 'fuNCTor']
            ]);
    });

    it('when first parameter is a non-string then compares with first parameter converted to string', () => 
    {
        runTestScenarios(compare, isInOrder, [[11, '222'], [123, 'test'], [321, 'TEST']]);
        runTestScenarios(compare, isEqualOrder, [[111, '111'], [12345, '12345']]);
        runTestScenarios(compare, isOutOfOrder, [[333, '111'], [12345, '1234'], [111111, '111'], [33333, '3331111']]);
    });

    it('when second parameter is a non-string then compares with second parameter converted to string', () => 
    {
        runTestScenarios(compare, isInOrder, [['111', 333], ['1234', 12345], ['111', 111111], ['3331111', 33333]]);
        runTestScenarios(compare, isEqualOrder, [['111', 111], ['12345', 12345]]);
        runTestScenarios(compare, isOutOfOrder, [['222', 11], ['test', 123], ['TEST', 321]]);
    });
});

describe('caseInsensitiveStringComparer', () => 
{
    let compare = Linq.caseInsensitiveStringComparer;

    it('when first parameter is null then indicate as in-order', () => 
    {
        runTestScenarios(compare, isInOrder,
            [
                [null, 'test'],
                [null, 'TEST'],
                [null, 'tESt'],
                [null, '']
            ]);
    });

    it('when second parameter is null then indicate as out-of-order', () => 
    {
        runTestScenarios(compare, isOutOfOrder,
            [
                ['testing', null],
                ['TESTING', null],
                ['teSTing', null],
                ['', null]
            ]);
    });

    it('when both parameters are null then indicate as equal', () => 
    {
        runTestScenarios(compare, isEqualOrder,
            [
                [null, null],
                [undefined, undefined]
            ]);
    });

    it('when first parameter is (disregarding case) lexicographically smaller-than second parameter then indicate as in-order', () => 
    {
        // Note: computer lexicographical ordering puts uppercase before lowercase
        runTestScenarios(compare, isInOrder,
            [
                ['', 'testing'],
                ['test', 'TESTER'],
                ['TEst', 'tester'],
                ['aaa', 'bbb'],
                ['aaabbb', 'aaaccc'],
                ['aaa', 'b'],
                ['aa', 'ZZZ'],
                ['aaa', 'aaaa']
            ]);
    });

    it('when first parameter is (disregarding case) lexicographically larger-than second parameter then indicate as out-of-order', () => 
    {
        // Note: computer lexicographical ordering puts uppercase before lowercase
        runTestScenarios(compare, isOutOfOrder,
            [
                ['tester', ''],
                ['CATman', 'cat'],
                ['ddd', 'aaa'],
                ['aaazzz', 'aaafff'],
                ['c', 'bbb'],
                ['YYYY', 'bb']
            ]);
    });

    it('when first parameter is (disregarding case) neither lexicographically smaller-than nor lexicographically larger-than second parameter then indicate as equal', () => 
    {
        runTestScenarios(compare, isEqualOrder,
            [
                ['', ''],
                ['abcdef', 'abcdef'],
                ['TESTING', 'TESTING'],
                ['fuNCTor', 'fuNCTor'],
                ['SABER', 'saber'],
                ['chocolate', 'CHOCOLATE'],
                ['monomorphism', 'monoMORPhism'],
                ['epIMOrphism', 'epimorphism']
            ]);
    });

    it('when first parameter is a non-string then compares (disregarding case) with first parameter converted to string', () => 
    {
        runTestScenarios(compare, isInOrder, [[11, '222'], [123, 'test'], [321, 'TEST'], [true, 'truest']]);
        runTestScenarios(compare, isEqualOrder, [[111, '111'], [12345, '12345'], [true, 'TRUE'], [false, 'false']]);
        runTestScenarios(compare, isOutOfOrder, [[333, '111'], [12345, '1234'], [111111, '111'], [33333, '3331111'], [true, 'aaa'], [false, 'fal']]);
    });

    it('when second parameter is a non-string then compares (disregarding case) with second parameter converted to string', () => 
    {
        runTestScenarios(compare, isInOrder, [['111', 333], ['1234', 12345], ['111', 111111], ['3331111', 33333], ['fall', false]]);
        runTestScenarios(compare, isEqualOrder, [['111', 111], ['12345', 12345], [true, 'TRUE'], [false, 'false']]);
        runTestScenarios(compare, isOutOfOrder, [['222', 11], ['test', 123], ['TEST', 321], ['zzz', true], ['green', false]]);
    });
});

describe('defaultStringComparer', () => 
{
    let compare = Linq.defaultStringComparer;
    let isSameAsCaseSensitiveStringComparer = (results, x, y) => expect(results).toBe(Linq.caseSensitiveStringComparer(x, y));
    
    let runTestScenarios2 = samples =>
    {
        return samples.every(([x, y]) => isSameAsCaseSensitiveStringComparer(compare(x, y), x, y));
    };
    
    it('when first parameter is null then it acts the same as caseSensitiveStringComparer', () => 
    {
        runTestScenarios2([
            [null, 'test'],
            [null, '']
        ]);
    });

    it('when second parameter is null then it acts the same as caseSensitiveStringComparer', () => 
    {
        runTestScenarios2([
            ['testing', null],
            ['', null]
        ]);
    });

    it('when both parameters are null then it acts the same as caseSensitiveStringComparer', () => 
    {
        runTestScenarios2([
            [null, null],
            [undefined, undefined]
        ]);
    });

    it('when first parameter is lexicographically smaller-than second parameter then it acts the same as caseSensitiveStringComparer', () => 
    {
        // Note: computer lexicographical ordering puts uppercase before lowercase
        runTestScenarios2([
            ['', 'testing'],
            ['TEST', 'test'],
            ['teSt', 'test'],
            ['aaa', 'bbb'],
            ['aaabbb', 'aaaccc'],
            ['aaa', 'b'],
            ['ZZZ', 'aa'],
            ['aaa', 'aaaa']
        ]);
    });

    it('when first parameter is lexicographically larger-than second parameter then it acts the same as caseSensitiveStringComparer', () => 
    {
        // Note: computer lexicographical ordering puts uppercase before lowercase
        runTestScenarios2([
            ['tester', ''],
            ['cat', 'CAT'],
            ['haskell', 'hasKell'],
            ['ddd', 'aaa'],
            ['aaazzz', 'aaafff'],
            ['c', 'bbb'],
            ['bb', 'YYYY']
        ]);
    });

    it('when first parameter is neither lexicographically smaller-than nor lexicographically larger-than second parameter then it acts the same as caseSensitiveStringComparer', () => 
    {
        runTestScenarios2([
            ['', ''],
            ['abcdef', 'abcdef'],
            ['TESTING', 'TESTING'],
            ['fuNCTor', 'fuNCTor']
        ]);
    });

    it('when first parameter is a non-string then it acts the same as caseSensitiveStringComparer', () => 
    {
        runTestScenarios2([[11, '222'], [123, 'test'], [321, 'TEST']]);
        runTestScenarios2([[111, '111'], [12345, '12345']]);
        runTestScenarios2([[333, '111'], [12345, '1234'], [111111, '111'], [33333, '3331111']]);
    });

    it('when second parameter is a non-string then it acts the same as caseSensitiveStringComparer', () => 
    {
        runTestScenarios2([['111', 333], ['1234', 12345], ['111', 111111], ['3331111', 33333]]);
        runTestScenarios2([['111', 111], ['12345', 12345]]);
        runTestScenarios2([['222', 11], ['test', 123], ['TEST', 321]]);
    });
});

describe('caseSensitiveStringEqualityComparer', () => 
{
    let compare = Linq.caseSensitiveStringEqualityComparer;

    it('when first parameter is null then indicate as not equal', () => 
    {
        runTestScenarios(compare, isNotEqual,
            [
                [null, 'test'],
                [null, '']
            ]);
    });

    it('when second parameter is null then indicate as not equal', () => 
    {
        runTestScenarios(compare, isNotEqual,
            [
                ['testing', null],
                ['', null]
            ]);
    });

    it('when both parameters are null then indicate as equal', () => 
    {
        runTestScenarios(compare, isEqual,
            [
                [null, null],
                [undefined, undefined]
            ]);
    });

    it('when first parameter is lexicographically smaller-than second parameter then indicate as not equal', () => 
    {
        // Note: computer lexicographical ordering puts uppercase before lowercase
        runTestScenarios(compare, isNotEqual,
            [
                ['', 'testing'],
                ['TEST', 'test'],
                ['teSt', 'test'],
                ['aaa', 'bbb'],
                ['aaabbb', 'aaaccc'],
                ['aaa', 'b'],
                ['ZZZ', 'aa'],
                ['aaa', 'aaaa']
            ]);
    });

    it('when first parameter is lexicographically larger-than second parameter then indicate as not equal', () => 
    {
        // Note: computer lexicographical ordering puts uppercase before lowercase
        runTestScenarios(compare, isNotEqual,
            [
                ['tester', ''],
                ['cat', 'CAT'],
                ['haskell', 'hasKell'],
                ['ddd', 'aaa'],
                ['aaazzz', 'aaafff'],
                ['c', 'bbb'],
                ['bb', 'YYYY']
            ]);
    });

    it('when first parameter is neither lexicographically smaller-than nor lexicographically larger-than second parameter then indicate as equal', () => 
    {
        runTestScenarios(compare, isEqual,
            [
                ['', ''],
                ['abcdef', 'abcdef'],
                ['TESTING', 'TESTING'],
                ['fuNCTor', 'fuNCTor']
            ]);
    });

    it('when first parameter is a non-string then compares with first parameter converted to string', () => 
    {
        runTestScenarios(compare, isNotEqual, [[11, '222'], [123, 'test'], [321, 'TEST']]);
        runTestScenarios(compare, isEqual, [[111, '111'], [12345, '12345']]);
        runTestScenarios(compare, isNotEqual, [[333, '111'], [12345, '1234'], [111111, '111'], [33333, '3331111']]);
    });

    it('when second parameter is a non-string then compares with second parameter converted to string', () => 
    {
        runTestScenarios(compare, isNotEqual, [['111', 333], ['1234', 12345], ['111', 111111], ['3331111', 33333]]);
        runTestScenarios(compare, isEqual, [['111', 111], ['12345', 12345]]);
        runTestScenarios(compare, isNotEqual, [['222', 11], ['test', 123], ['TEST', 321]]);
    });
});

describe('caseInsensitiveStringEqualityComparer', () => 
{
    let compare = Linq.caseInsensitiveStringEqualityComparer;

    it('when first parameter is null then indicate as not equal', () => 
    {
        runTestScenarios(compare, isNotEqual,
            [
                [null, 'test'],
                [null, 'TEST'],
                [null, 'tESt'],
                [null, '']
            ]);
    });

    it('when second parameter is null then indicate as not equal', () => 
    {
        runTestScenarios(compare, isNotEqual,
            [
                ['testing', null],
                ['TESTING', null],
                ['teSTing', null],
                ['', null]
            ]);
    });

    it('when both parameters are null then indicate as equal', () => 
    {
        runTestScenarios(compare, isEqual,
            [
                [null, null],
                [undefined, undefined]
            ]);
    });

    it('when first parameter is (disregarding case) lexicographically smaller-than second parameter then indicate as not equal', () => 
    {
        // Note: computer lexicographical ordering puts uppercase before lowercase
        runTestScenarios(compare, isNotEqual,
            [
                ['', 'testing'],
                ['test', 'TESTER'],
                ['TEst', 'tester'],
                ['aaa', 'bbb'],
                ['aaabbb', 'aaaccc'],
                ['aaa', 'b'],
                ['aa', 'ZZZ'],
                ['aaa', 'aaaa']
            ]);
    });

    it('when first parameter is (disregarding case) lexicographically larger-than second parameter then indicate as not equal', () => 
    {
        // Note: computer lexicographical ordering puts uppercase before lowercase
        runTestScenarios(compare, isNotEqual,
            [
                ['tester', ''],
                ['CATman', 'cat'],
                ['ddd', 'aaa'],
                ['aaazzz', 'aaafff'],
                ['c', 'bbb'],
                ['YYYY', 'bb']
            ]);
    });

    it('when first parameter is (disregarding case) neither lexicographically smaller-than nor lexicographically larger-than second parameter then indicate as equal', () => 
    {
        runTestScenarios(compare, isEqual,
            [
                ['', ''],
                ['abcdef', 'abcdef'],
                ['TESTING', 'TESTING'],
                ['fuNCTor', 'fuNCTor'],
                ['SABER', 'saber'],
                ['chocolate', 'CHOCOLATE'],
                ['monomorphism', 'monoMORPhism'],
                ['epIMOrphism', 'epimorphism']
            ]);
    });

    it('when first parameter is a non-string then compares (disregarding case) with first parameter converted to string', () => 
    {
        runTestScenarios(compare, isNotEqual, [[11, '222'], [123, 'test'], [321, 'TEST'], [true, 'truest']]);
        runTestScenarios(compare, isEqual, [[111, '111'], [12345, '12345'], [true, 'TRUE'], [false, 'false']]);
        runTestScenarios(compare, isNotEqual, [[333, '111'], [12345, '1234'], [111111, '111'], [33333, '3331111'], [true, 'aaa'], [false, 'fal']]);
    });

    it('when second parameter is a non-string then compares (disregarding case) with second parameter converted to string', () => 
    {
        runTestScenarios(compare, isNotEqual, [['111', 333], ['1234', 12345], ['111', 111111], ['3331111', 33333], ['fall', false]]);
        runTestScenarios(compare, isEqual, [['111', 111], ['12345', 12345], [true, 'TRUE'], [false, 'false']]);
        runTestScenarios(compare, isNotEqual, [['222', 11], ['test', 123], ['TEST', 321], ['zzz', true], ['green', false]]);
    });
});

describe('defaultStringEqualityComparer', () => 
{
    let compare = Linq.defaultStringEqualityComparer;
    let isSameAsCaseSensitiveStringEqualityComparer = (results, x, y) => expect(results).toBe(Linq.caseSensitiveStringEqualityComparer(x, y));
    
    let runTestScenarios2 = samples =>
    {
        return samples.every(([x, y]) => isSameAsCaseSensitiveStringEqualityComparer(compare(x, y), x, y));
    };
    
    it('when first parameter is null then it acts the same as caseSensitiveStringEqualityComparer', () => 
    {
        runTestScenarios2([
            [null, 'test'],
            [null, '']
        ]);
    });

    it('when second parameter is null then it acts the same as caseSensitiveStringEqualityComparer', () => 
    {
        runTestScenarios2([
            ['testing', null],
            ['', null]
        ]);
    });

    it('when both parameters are null then it acts the same as caseSensitiveStringEqualityComparer', () => 
    {
        runTestScenarios2([
            [null, null],
            [undefined, undefined]
        ]);
    });

    it('when first parameter is lexicographically smaller-than second parameter then it acts the same as caseSensitiveStringEqualityComparer', () => 
    {
        // Note: computer lexicographical ordering puts uppercase before lowercase
        runTestScenarios2([
            ['', 'testing'],
            ['TEST', 'test'],
            ['teSt', 'test'],
            ['aaa', 'bbb'],
            ['aaabbb', 'aaaccc'],
            ['aaa', 'b'],
            ['ZZZ', 'aa'],
            ['aaa', 'aaaa']
        ]);
    });

    it('when first parameter is lexicographically larger-than second parameter then it acts the same as caseSensitiveStringEqualityComparer', () => 
    {
        // Note: computer lexicographical ordering puts uppercase before lowercase
        runTestScenarios2([
            ['tester', ''],
            ['cat', 'CAT'],
            ['haskell', 'hasKell'],
            ['ddd', 'aaa'],
            ['aaazzz', 'aaafff'],
            ['c', 'bbb'],
            ['bb', 'YYYY']
        ]);
    });

    it('when first parameter is neither lexicographically smaller-than nor lexicographically larger-than second parameter then it acts the same as caseSensitiveStringEqualityComparer', () => 
    {
        runTestScenarios2([
            ['', ''],
            ['abcdef', 'abcdef'],
            ['TESTING', 'TESTING'],
            ['fuNCTor', 'fuNCTor']
        ]);
    });

    it('when first parameter is a non-string then it acts the same as caseSensitiveStringEqualityComparer', () => 
    {
        runTestScenarios2([[11, '222'], [123, 'test'], [321, 'TEST']]);
        runTestScenarios2([[111, '111'], [12345, '12345']]);
        runTestScenarios2([[333, '111'], [12345, '1234'], [111111, '111'], [33333, '3331111']]);
    });

    it('when second parameter is a non-string then it acts the same as caseSensitiveStringEqualityComparer', () => 
    {
        runTestScenarios2([['111', 333], ['1234', 12345], ['111', 111111], ['3331111', 33333]]);
        runTestScenarios2([['111', 111], ['12345', 12345]]);
        runTestScenarios2([['222', 11], ['test', 123], ['TEST', 321]]);
    });
});

describe('normalizeComparer', () => 
{
    let tests = [
        ['', ''],
        ['test', 'test'],
        ['test', 'TEST'],
        ['', 'test'],
        ['', 'TEST'],
        ['abc', 'def'],
        ['DEF', 'abc'],
        ['test', ''],
        ['TEST', ''],
        ['def', 'abc'],
        ['abc', 'DEF']
    ];

    let interpretOrder = x =>
    {
        if (Linq.isBoolean(x))
            return x;
        else if (Linq.isNumber(x))
            return (x === 0);
        else
            throw new Error('Unexpected value.');
    };

    let runTestScenarios2 = (firstComparer, secondComparer, samples) =>
    {
        let p = ([x, y]) => expect(interpretOrder(firstComparer(x, y)) === interpretOrder(secondComparer(x, y))).toBeTruthy();

        return samples.every(p);
    };

    it('when passed a regular (non-equality) comparer then convert to a function that returns boolean values', () => 
    {
        let normalizedComparer = Linq.normalizeComparer(Linq.caseSensitiveStringComparer);
        let results = tests.every(([x, y]) => Linq.isBoolean(normalizedComparer(x, y)));

        expect(results).toBeTruthy();
    });

    it('when passed a regular (non-equality) comparer then the returned comparer orders the same as the passed-in comparer', () => 
    {
        let baseComparer = Linq.caseSensitiveStringComparer;
        let normalizedComparer = Linq.normalizeComparer(baseComparer);

        runTestScenarios2(baseComparer, normalizedComparer, tests);
    });

    it('when passed an equality comparer then convert to a function that returns boolean values', () => 
    {
        let normalizedComparer = Linq.normalizeComparer(Linq.caseSensitiveStringEqualityComparer);
        let results = tests.every(([x, y]) => Linq.isBoolean(normalizedComparer(x, y)));

        expect(results).toBeTruthy();
    });

    it('when passed an equality comparer then the returned comparer orders the same as the passed-in comparer', () => 
    {
        let baseComparer = Linq.caseSensitiveStringEqualityComparer;
        let normalizedComparer = Linq.normalizeComparer(baseComparer);

        runTestScenarios2(baseComparer, normalizedComparer, tests);
    });
});

describe('createProjectionComparer', () => 
{
    let tests = [
        [0, 2],
        [0, 10],
        [12, 99],
        [7, -5],
        [-31, 5],
        [-9, 11]
    ];

    let projection = x => 2 - x;
    let comparer = Linq.createProjectionComparer(projection);

    let runTestScenarios2 = (firstComparer, secondComparer, samples) =>
    {
        return samples.every(([x, y]) => expect(firstComparer(x, y) === secondComparer(x, y)).toBeTruthy());
    };

    it('when passed a null projection then throws an exception', () => 
    {
        expect(() => Linq.createProjectionComparer(null)).toThrow();
    });

    it('when passed a non-null projection then returns a function that returns numbers', () => 
    {
        let results = tests.every(([x, y]) => Linq.isNumber(comparer(x, y)));

        expect(results).toBeTruthy();
    });

    it('when passed a null comparer then compares projected values equivalently to Linq.generalComparer', () => 
    {
        let baselineComparer = Linq.createProjectionComparer(projection, Linq.generalComparer);

        runTestScenarios2(comparer, baselineComparer, tests);
    });

    it('when passed a non-null comparer then compares projected values with comparer', () => 
    {
        let baselineComparer = (x, y) => Linq.caseInsensitiveStringComparer(x[0], y[0]);
        let comparer2 = Linq.createProjectionComparer(x => x[0], Linq.caseInsensitiveStringComparer);

        runTestScenarios2(comparer2, baselineComparer, tests);
    });
});

describe('createProjectionEqualityComparer', () => 
{
    let tests = [
        [0, 2],
        [0, 10],
        [12, 99],
        [7, -5],
        [-31, 5],
        [-9, 11]
    ];

    let projection = x => 2 - x;
    let comparer = Linq.createProjectionEqualityComparer(projection);

    let runTestScenarios2 = (firstComparer, secondComparer, samples) =>
    {
        return samples.every(([x, y]) => expect(firstComparer(x, y) === secondComparer(x, y)).toBeTruthy());
    };

    it('when passed a null projection then throws an exception', () => 
    {
        expect(() => Linq.createProjectionEqualityComparer(null)).toThrow();
    });

    it('when passed a non-null projection then returns a function that returns booleans', () => 
    {
        let results = tests.every(([x, y]) => Linq.isBoolean(comparer(x, y)));

        expect(results).toBeTruthy();
    });

    it('when passed a null equality comparer then compares projected values equivalently to strict equality', () => 
    {
        let baselineComparer = Linq.createProjectionEqualityComparer(projection, (x, y) => x === y);

        runTestScenarios2(comparer, baselineComparer, tests);
    });

    it('when passed a non-null equality comparer then compares projected values with equality comparer', () => 
    {
        let baselineComparer = (x, y) => Linq.caseInsensitiveStringEqualityComparer(x[0], y[0]);
        let comparer2 = Linq.createProjectionEqualityComparer(x => x[0], Linq.caseInsensitiveStringEqualityComparer);

        runTestScenarios2(comparer2, baselineComparer, tests);
    });

    it('when passed a non-equality comparer then compares projected values with the comparer converted to an equality comparer', () => 
    {
        let baselineComparer = (x, y) => Linq.caseInsensitiveStringEqualityComparer(x[0], y[0]);
        let comparer2 = Linq.createProjectionEqualityComparer(x => x[0], Linq.caseInsensitiveStringComparer);

        runTestScenarios2(comparer2, baselineComparer, tests);
    });
});
