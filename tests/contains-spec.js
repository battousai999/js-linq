import {Linq} from '../jslinq';

describe('contains', () => 
{
    let linq1 = new Linq([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    let linq2 = new Linq(['ichi', 'NI', 'San', 'shi', 'go', 'roku', 'SHICHI', 'hachi', 'ku', 'jyuu']);

    let comparer = Linq.caseInsensitiveStringComparer;
    let equalityComparer = Linq.caseInsensitiveStringEqualityComparer;

    it('when called on a collection that contains the item then returns true', () => 
    {
        expect(linq1.contains(5)).toBeTruthy();
    });

    it('when called on a collection that does not contain the item then returns false', () => 
    {
        expect(linq1.contains(99)).toBeFalsy();
    });

    it('when called on an empty collection then returns false', () => 
    {
        expect(Linq.from([]).contains(99)).toBeFalsy();
    });

    it('when called with a comparer on a collection that contains the item then returns true', () => 
    {
        expect(linq2.contains('ichi', comparer)).toBeTruthy();
        expect(linq2.contains('shichi', comparer)).toBeTruthy();
        expect(linq2.contains('jyuu', comparer)).toBeTruthy();
    });

    it('when called with a comparer on a collection that does not contain the item then returns false', () => 
    {
        expect(linq2.contains('jyuuichi', comparer)).toBeFalsy();
        expect(linq2.contains('ni', Linq.caseSensitiveStringComparer)).toBeFalsy();
    });

    it('when called with an equality comparer on a collection that contains the item the returns true', () => 
    {
        expect(linq2.contains('ni', equalityComparer)).toBeTruthy();
        expect(linq2.contains('ROKU', equalityComparer)).toBeTruthy();
        expect(linq2.contains('shi', equalityComparer)).toBeTruthy();
    });

    it('when called with an equality comparer on a collection that does not contain the item the returns false', () => 
    {
        expect(linq2.contains('yonjyuushi', equalityComparer)).toBeFalsy();
        expect(linq2.contains('shichi', Linq.caseSensitiveStringEqualityComparer)).toBeFalsy();
    });

    it('when called with a non-function comparer then throws an exception', () => 
    {
        expect(() => { linq1.contains('ichi', 'not-a-function'); }).toThrow();
    });

    it('when called on an infinite collection that contains the item then eventually returns', () => 
    {
        function* gen()
        {
            let str = '';

            while (true)
            {
                str += '*';
                yield str;
            }
        }

        expect(Linq.from(gen).contains('*******')).toBeTruthy();
    }, 10000);
});