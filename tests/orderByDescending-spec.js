import {Linq} from '../jslinq';

describe('orderByDescending', () => 
{
    let col1 = Linq.from([2, 5, 1, 3, 4, 6]);
    let col2 = Linq.from([{ id: 3, value: 543 }, { id: 4, value: 956 }, { id: 1, value: 112 }, { id: 2, value: 456 }]);
    let col3 = Linq.from([{ id: 3, value: "c" }, { id: 4, value: "D" }, { id: 1, value: "a" }, { id: 2, value: "B" }]);

    it('when called with a key selector of identity then returns a collection ordered by the items themselves', () => 
    {
        let results = col1.orderByDescending(Linq.identity).toArray();

        expect(results).toEqual([6, 5, 4, 3, 2, 1]);
    });

    it('when called with a key selector then returns a collection ordered by the key', () => 
    {
        let results = col2
            .orderByDescending(x => x.value)
            .select(x => x.id)
            .toArray();

        expect(results).toEqual([4, 3, 2, 1]);
    });

    it('when called with a comparer then returns a collection ordered with the comparer', () => 
    {
        let results = col3
            .orderByDescending(x => x.value, Linq.caseInsensitiveStringComparer)
            .select(x => x.id)
            .toArray();

        expect(results).toEqual([4, 3, 2, 1]);
    });

    it('when called with string keys and without a comparer then returns a collection ordered by the string keys', () => 
    {
        let results = col3
            .orderByDescending(x => x.value)
            .select(x => x.id)
            .toArray();

        expect(results).toEqual([3, 1, 4, 2]);
    });

    it('when called without a key selector then throws an exception', () => 
    {
        expect(() => { col1.orderByDescending(); }).toThrow();
    });

    it('when called with a non-function key selector then throws an exception', () => 
    {
        expect(() => { col1.orderByDescending('not-a-function'); }).toThrow();
    });

    it('when called with a non-function comparer then throws an exception', () => 
    {
        expect(() => { col1.orderByDescending(Linq.identity, 'not-a-function'); }).toThrow();
    });
});
