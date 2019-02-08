import {Linq} from '../jslinq';

describe('toDelimitedString', () =>
{
    let col = new Linq(['this', 'is', 'a', 'test']);

    it('when called on an empty collection then returns an empty string', () =>
    {
        let results = Linq.empty().toDelimitedString('; ');

        expect(results).toEqual('');
    });

    it('when called on a single-element collection then returns the single item', () =>
    {
        let value = 'test';
        let results = Linq.from([value]).toDelimitedString('; ');

        expect(results).toEqual(value);
    });

    it('when called on a multiple-element collection with an empty delimiter then returns the concatenated elements', () =>
    {
        let results = col.toDelimitedString('');

        expect(results).toEqual('thisisatest');
    });

    it('when called on a multiple-element collection with a non-empty delimiter then returns the elements concatenated but with the delimiter between them', () =>
    {
        let results = col.toDelimitedString('; ');

        expect(results).toEqual('this; is; a; test');
    });

    it('when called on a multiple-element collection without a delimiter then returns the elements concatenated but with a comma delimiter between them', () =>
    {
        let results = col.toDelimitedString();

        expect(results).toEqual('this,is,a,test');
    });

    it('when called on a multiple-element collection of integers then returns the integers converted to strings', () =>
    {
        let results = Linq.from([1, 2, 3, 4, 5]).toDelimitedString('-');

        expect(results).toEqual('1-2-3-4-5');
    });
});
