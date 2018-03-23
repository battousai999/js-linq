import {Linq} from '../jslinq';

describe('matches', () => 
{
    it('when called then returns a Linq object', () => 
    {
        let linq1 = Linq.matches('abcdefg', 'abc');
        let linq2 = Linq.matches('hijklmn', /i.*m/);

        expect(linq1).not.toBeNull();
        expect(linq1 instanceof Linq).toBeTruthy();        

        expect(linq2).not.toBeNull();
        expect(linq2 instanceof Linq).toBeTruthy();        
    });

    it('when called with a string pattern then returns matched elements', () => 
    {
        let linq = Linq.matches('test_1 test_2 value-9 test_3 test_a test_777', 'test_\\d');

        expect(linq.toArray()).toEqual(['test_1', 'test_2', 'test_3', 'test_7']);
    });

    it('when called with a RegExp pattern then returns matched elements', () => 
    {
        let linq = Linq.matches('value-1 test_9 value-2 value-3 value-null value-555', /value-\d/);

        expect(linq.toArray()).toEqual(['value-1', 'value-2', 'value-3', 'value-5']);
    });

    it('when called with a RegExp pattern specifying ignoreCase then ignores case', () => 
    {
        let linq = Linq.matches('starting with-yes test-value tHIs-YES in-YeS MIND-yEs -', /\w+-yes/i);

        expect(linq.toArray()).toEqual(['with-yes', 'tHIs-YES', 'in-YeS', 'MIND-yEs']);
    });

    it('when called with a \'i\' flag then ignores case', () => 
    {
        let expected = ['May-val', 'the-vaL', 'force-VAL', 'be-Val', 'with-val', 'you-VAl'];
        let linq1 = Linq.matches('>>> beginning May-val the-vaL force-VAL middle be-Val with-value you-VAl ending <<<', /\w+-val/, 'i');
        let linq2 = Linq.matches('>>> beginning May-val the-vaL force-VAL middle be-Val with-value you-VAl ending <<<', '\\w+-val', 'i');

        expect(linq1.toArray()).toEqual(expected);
        expect(linq2.toArray()).toEqual(expected);
    });

    it('when called with a RegExp pattern specifying multiline then matches in multiline mode', () => 
    {
        let linq = Linq.matches('This*\nis!\nnot\njust#\na@\ntest%', /^\w+[!@#%*]$/m);

        expect(linq.toArray()).toEqual(['This*', 'is!', 'just#', 'a@', 'test%']);
    });

    it('when called with a \'m\' flag then matches in multiline mode', () => 
    {
        let linq = Linq.matches('This*\nis!\nnot\njust#\na@\ntest%', /^\w+[!@#%*]$/, 'm');

        expect(linq.toArray()).toEqual(['This*', 'is!', 'just#', 'a@', 'test%']);
    });

    it('when called without a case-insensitive flag/pattern then defaults to a case-sensitive match', () => 
    {
        let linq1 = Linq.matches('test-1 TEST-2 Test-3 test-4', /test-\d/);
        let linq2 = Linq.matches('test-6 TEST-7 Test-8 test-9', 'test-\\d');

        expect(linq1.toArray()).toEqual(['test-1', 'test-4']);
        expect(linq2.toArray()).toEqual(['test-6', 'test-9']);
    });

    it('when called without a multiline mode flag/pattern then defaults to non-multiline mode', () => 
    {
        let linq1 = Linq.matches('This\nis\na\ntest', /^\w+/);
        let linq2 = Linq.matches('This\nis\na\ntest', '^\\w+');

        expect(linq1.toArray()).toEqual(['This']);
        expect(linq2.toArray()).toEqual(['This']);
    });

    it('when called with a null \'pattern\' parameter then throws an exception', () => 
    {
        expect(() => { Linq.matches('testing', null); }).toThrow();
    });
});
