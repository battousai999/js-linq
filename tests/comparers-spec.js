import {Linq} from '../jslinq';

let isInOrder = x => expect(x).toBeLessThan(0);
let isOutOfOrder = x => expect(x).toBeGreaterThan(0);
let isEqualOrder = x => expect(x).toBe(0);

let isEqual = x => expect(x).toBeTruthy();
let isNotEqual = x => expect(x).toBeFalsy();

let runTestScenarios = (comparer, expectation, samples) =>
{
    let p = ([x, y]) => expectation(comparer(x, y));
    return samples.map(p).every(Linq.identity);
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
                ['testing', null],
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
                ['',''],
                ['abcdef','abcdef'],
                ['TESTING','TESTING'],
                ['fuNCTor','fuNCTor'],
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
                ['',''],
                ['abcdef','abcdef'],
                ['TESTING','TESTING'],
                ['fuNCTor','fuNCTor'],
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
    let isSameAsCaseSensitiveStringComparer = (results, x, y)  => expect(results).toBe(Linq.caseSensitiveStringComparer(x, y));
    
    let runTestScenarios = samples =>
    {
        let p = ([x, y]) => isSameAsCaseSensitiveStringComparer(compare(x, y), x, y);
        return samples.map(p).every(Linq.identity);
    };
    
    it('when first parameter is null then it acts the same as caseSensitiveStringComparer', () => 
    {
        runTestScenarios([
            [null, 'test'],
            [null, '']
        ]);
    });

    it('when second parameter is null then it acts the same as caseSensitiveStringComparer', () => 
    {
        runTestScenarios([
            ['testing', null],
            ['', null]
        ]);
    });

    it('when both parameters are null then it acts the same as caseSensitiveStringComparer', () => 
    {
        runTestScenarios([
            [null, null],
            [undefined, undefined]
        ]);
    });

    it('when first parameter is lexicographically smaller-than second parameter then it acts the same as caseSensitiveStringComparer', () => 
    {
        // Note: computer lexicographical ordering puts uppercase before lowercase
        runTestScenarios([
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
        runTestScenarios([
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
        runTestScenarios([
            ['',''],
            ['abcdef','abcdef'],
            ['TESTING','TESTING'],
            ['fuNCTor','fuNCTor'],
        ]);
    });

    it('when first parameter is a non-string then it acts the same as caseSensitiveStringComparer', () => 
    {
        runTestScenarios([[11, '222'], [123, 'test'], [321, 'TEST']]);
        runTestScenarios([[111, '111'], [12345, '12345']]);
        runTestScenarios([[333, '111'], [12345, '1234'], [111111, '111'], [33333, '3331111']]);
    });

    it('when second parameter is a non-string then it acts the same as caseSensitiveStringComparer', () => 
    {
        runTestScenarios([['111', 333], ['1234', 12345], ['111', 111111], ['3331111', 33333]]);
        runTestScenarios([['111', 111], ['12345', 12345]]);
        runTestScenarios([['222', 11], ['test', 123], ['TEST', 321]]);
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
                ['',''],
                ['abcdef','abcdef'],
                ['TESTING','TESTING'],
                ['fuNCTor','fuNCTor'],
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
                ['',''],
                ['abcdef','abcdef'],
                ['TESTING','TESTING'],
                ['fuNCTor','fuNCTor'],
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
    let isSameAsCaseSensitiveStringEqualityComparer = (results, x, y)  => expect(results).toBe(Linq.caseSensitiveStringEqualityComparer(x, y));
    
    let runTestScenarios = samples =>
    {
        let p = ([x, y]) => isSameAsCaseSensitiveStringEqualityComparer(compare(x, y), x, y);
        return samples.map(p).every(Linq.identity);
    };
    
    it('when first parameter is null then it acts the same as caseSensitiveStringEqualityComparer', () => 
    {
        runTestScenarios([
            [null, 'test'],
            [null, '']
        ]);
    });

    it('when second parameter is null then it acts the same as caseSensitiveStringEqualityComparer', () => 
    {
        runTestScenarios([
            ['testing', null],
            ['', null]
        ]);
    });

    it('when both parameters are null then it acts the same as caseSensitiveStringEqualityComparer', () => 
    {
        runTestScenarios([
            [null, null],
            [undefined, undefined]
        ]);
    });

    it('when first parameter is lexicographically smaller-than second parameter then it acts the same as caseSensitiveStringEqualityComparer', () => 
    {
        // Note: computer lexicographical ordering puts uppercase before lowercase
        runTestScenarios([
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
        runTestScenarios([
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
        runTestScenarios([
            ['',''],
            ['abcdef','abcdef'],
            ['TESTING','TESTING'],
            ['fuNCTor','fuNCTor'],
        ]);
    });

    it('when first parameter is a non-string then it acts the same as caseSensitiveStringEqualityComparer', () => 
    {
        runTestScenarios([[11, '222'], [123, 'test'], [321, 'TEST']]);
        runTestScenarios([[111, '111'], [12345, '12345']]);
        runTestScenarios([[333, '111'], [12345, '1234'], [111111, '111'], [33333, '3331111']]);
    });

    it('when second parameter is a non-string then it acts the same as caseSensitiveStringEqualityComparer', () => 
    {
        runTestScenarios([['111', 333], ['1234', 12345], ['111', 111111], ['3331111', 33333]]);
        runTestScenarios([['111', 111], ['12345', 12345]]);
        runTestScenarios([['222', 11], ['test', 123], ['TEST', 321]]);
    });
});

describe('normalizeComparer', () => 
{
    it('when passed a regular (non-equality) comparer then convert to an equality comparer', () => 
    {
        var baseComparer = Linq.caseSensitiveStringComparer;

        // Stopping here (failing as a bookmark)
        expect(false).toBeTruthy();
    });

    it('when passed an equality comparer then continue acting as an equality comparer', () => {});
});

describe('createProjectionComparer', () => {});
describe('createProjectionEqualityComparer', () => {});
