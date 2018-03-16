import {Linq} from '../jslinq';

describe('distinctBy', () => 
{
    let col1 = new Linq([{ id: 1, name: 'steve' }, { id: 2, name: 'barbara' }, { id: 3, name: 'david' }, { id: 4, name: 'steve' }]);
    let col2 = new Linq([{ id: 1, name: 'steve' }, { id: 2, name: 'barbara' }, { id: 3, name: 'david' }, { id: 4, name: 'STEVE' }]);

    let nameProjection = x => x.name;
    let idProjection = x => x.id;

    it('when called on an empty collection then returns an empty collection', () => 
    {
        let results = Linq.empty().distinctBy(nameProjection).toArray();

        expect(results).toEqual([]);
    });

    it('when called without a comparer on a collection without duplicate keys then returns same elements as original collection', () => 
    {
        let results = col1
            .distinctBy(idProjection)
            .select(idProjection)
            .toArray();

        expect(results).toEqual([1, 2, 3, 4]);
    });

    it('when called with a comparer on a collection without duplicate keys then returns same elements as original collection', () => 
    {
        let results = col2
            .distinctBy(nameProjection, Linq.caseSensitiveStringComparer)
            .select(idProjection)
            .toArray();

        expect(results).toEqual([1, 2, 3, 4]);
    });

    it('when called with an equality comparer on a collection without duplicate keys then returns same elements as original collection', () => 
    {        
        let results = col2
            .distinctBy(nameProjection, Linq.caseSensitiveStringEqualityComparer)
            .select(idProjection)
            .toArray();

        expect(results).toEqual([1, 2, 3, 4]);
    });
    
    it('when called without a comparer on a collection with duplicate keys then returns collection with elements of duplicate keys removed', () => 
    {
        let results = col1
            .distinctBy(nameProjection)
            .select(idProjection)
            .toArray();

        expect(results).toEqual([1, 2, 3]);
    });

    it('when called with a comparer on a collection with duplicate keys then returns collection with elements of duplicate keys removed', () => 
    {
        let results = col2
            .distinctBy(nameProjection, Linq.caseInsensitiveStringComparer)
            .select(idProjection)
            .toArray();

        expect(results).toEqual([1, 2, 3]);
    });

    it('when called with an equality comparer on a collection with duplicate keys then returns collection with elements of duplicate keys removed', () => 
    {
        let results = col2
            .distinctBy(nameProjection, Linq.caseInsensitiveStringEqualityComparer)
            .select(idProjection)
            .toArray();

        expect(results).toEqual([1, 2, 3]);
    });

    it('when called without a key selector then throws an exception', () => 
    {
        expect(() => { col1.distinctBy(); }).toThrow();
    });

    it('when called with a non-function key selector then throws an exception', () => 
    {
        expect(() => { col1.distinctBy('not-a-function'); }).toThrow();
    });

    it('when called with a non-function comparer then throws an exception', () => 
    {
        expect(() => { col1.distinctBy(nameProjection, 'not-a-function'); }).toThrow();
    });
});