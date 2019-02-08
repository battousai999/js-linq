import {Linq} from '../jslinq';

describe('orderBy', () => 
{
    let col1 = Linq.from([2, 5, 1, 3, 4, 6]);
    let col2 = Linq.from([{ id: 3, value: 543 }, { id: 4, value: 956 }, { id: 1, value: 112 }, { id: 2, value: 456 }]);
    let col3 = Linq.from([{ id: 3, value: "c" }, { id: 4, value: "D" }, { id: 1, value: "a" }, { id: 2, value: "B" }]);

    it('when called with a key selector of identity then returns a collection ordered by the items themselves', () => 
    {
        let results = col1.orderBy(Linq.identity).toArray();

        expect(results).toEqual([1, 2, 3, 4, 5, 6]);
    });
    
    it('when called with a key selector then returns a collection ordered by the key', () => 
    {
        let results = col2
            .orderBy(x => x.value)
            .select(x => x.id)
            .toArray();

        expect(results).toEqual([1, 2, 3, 4]);
    });

    it('when called with a comparer then returns a collection ordered with the comparer', () => 
    {
        let results = col3
            .orderBy(x => x.value, Linq.caseInsensitiveStringComparer)
            .select(x => x.id)
            .toArray();

        expect(results).toEqual([1, 2, 3, 4]);
    });

    it('when called with string keys and without a comparer then returns a collection ordered by the string keys', () =>
    {
        let results = col3
            .orderBy(x => x.value)
            .select(x => x.id)
            .toArray();

        expect(results).toEqual([2, 4, 1, 3]);
    });

    it('when called without a key selector then throws an exception', () => 
    {
        expect(() => { col1.orderBy(); }).toThrow();
    });

    it('when called with a non-function key selector then throws an exception', () => 
    {
        expect(() => { col1.orderBy('not-a-function'); }).toThrow();
    });

    it('when called with a non-function comparer then throws an exception', () =>
    {
        expect(() => { col1.orderBy(Linq.identity, 'not-a-function'); }).toThrow();
    });
});
