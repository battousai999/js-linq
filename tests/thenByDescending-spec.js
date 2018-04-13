import {Linq} from '../jslinq';

describe('thenByDescending', () => 
{
    let col1 = new Linq([{ id: 3, level1: 222, level2: 99 }, { id: 7, level1: 444, level2: 44 }, { id: 1, level1: 111, level2: 10 }, { id: 4, level1: 333, level2: 44 }, { id: 8, level1: 555, level2: 99 }, { id: 5, level1: 333, level2: 66 }, { id: 6, level1: 444, level2: 22 }, { id: 2, level1: 111, level2: 20 }]);
    let col2 = new Linq([{ id: 3, level1: 222, level2: 'a' }, { id: 7, level1: 444, level2: 'B' }, { id: 1, level1: 111, level2: 'A' }, { id: 4, level1: 333, level2: 'a' }, { id: 8, level1: 555, level2: 'a' }, { id: 5, level1: 333, level2: 'C' }, { id: 6, level1: 444, level2: 'a' }, { id: 2, level1: 111, level2: 'b' }]);

    let col3 = new Linq([
        { id: 2, level1: 222, level2: 'a', level3: 1 }, 
        { id: 1, level1: 111, level2: 'a', level3: 1 }, 
        { id: 4, level1: 222, level2: 'b', level3: 1 },
        { id: 3, level1: 222, level2: 'A', level3: 2 }, 
        { id: 5, level1: 333, level2: 'a', level3: 1 }
    ]);

    it('when called with a key selector then returns a collection sub-ordered by the key', () => 
    {
        let results = col1
            .orderBy(x => x.level1)
            .thenByDescending(x => x.level2)
            .select(x => x.id)
            .toArray();

        expect(results).toEqual([2, 1, 3, 5, 4, 7, 6, 8]);
    });

    it('when called with a comparer then returns a collecction sub-ordered with the comparer', () => 
    {
        let results = col2
            .orderBy(x => x.level1)
            .thenByDescending(x => x.level2, Linq.caseInsensitiveStringComparer)
            .select(x => x.id)
            .toArray();

        expect(results).toEqual([2, 1, 3, 5, 4, 7, 6, 8]);
    });

    it('when not called after an ordering operator then throws an exception', () => 
    {
        expect(() => { col1.thenByDescending(); }).toThrow();
    });

    it('when called after thenBy then returns a collection sub-ordered by the key', () => 
    {
        let results = col3
            .orderBy(x => x.level1)
            .thenBy(x => x.level2, Linq.caseInsensitiveStringComparer)
            .thenByDescending(x => x.level3)
            .select(x => x.id)
            .toArray();

        expect(results).toEqual([1, 3, 2, 4, 5]);
    });

    it('when called after thenByDescending then returns a collection sub-ordered by the key', () => 
    {
        let results = col3
            .orderBy(x => x.level1)
            .thenByDescending(x => x.level2, Linq.caseInsensitiveStringComparer)
            .thenByDescending(x => x.level3)
            .select(x => x.id)
            .toArray();

        expect(results).toEqual([1, 4, 3, 2, 5]);
    });

    it('when called without a key selector then throws an exception', () => 
    {
        expect(() => { col1.thenByDescending(); }).toThrow();
    });

    it('when called with a non-function key selector then throws an exception', () => 
    {
        expect(() => { col1.thenByDescending('not-a-function'); }).toThrow();
    });

    it('when called with a non-function comparer then throws an exception', () => 
    {
        expect(() => { col1.thenByDescending(Linq.identity, 'not-a-function'); }).toThrow();
    });
});
