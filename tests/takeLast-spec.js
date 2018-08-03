import {Linq} from '../jslinq';

describe('takeLast', () =>
{
    let arr = [1, 2, 3, 4, 5, 6, 7, 8];
    let col1 = new Linq(arr);

    let genSize = 5;

    function* gen()
    {
        for (let i = 0; i < genSize; i++)
        {
            yield i;
        }
    }

    let col2 = new Linq(gen);

    it('when called on an empty collection then returns an empty collection', () =>
    {
        let results = Linq.empty()
            .takeLast(3)
            .toArray();

        expect(results).toEqual([]);
    });

    it('when called with a count of 0 then returns an empty collection', () =>
    {
        let results = col1.takeLast(0).toArray();

        expect(results).toEqual([]);
    });

    it('when called on a collection when length is greater than the count then returns last count elements', () =>
    {
        let results = col1.takeLast(3).toArray();

        expect(results).toEqual([6, 7, 8]);
    });

    it('when called on a collection whose length is equal to the count then returns entire collection', () =>
    {
        let results = col1.takeLast(arr.length).toArray();

        expect(results).toEqual(arr);
    });

    it('when called on a collection whose length is less than the count then returns the entire collection', () =>
    {
        let results = col1.takeLast(arr.length + 5).toArray();

        expect(results).toEqual(arr);
    });

    it('when called on a collection without explicit length whose cardinality is greater than the count then returns the last count elements', () =>
    {
        let length = Math.round(genSize / 2);
        let results = col2.takeLast(length).toArray();
        let expected = [...gen()].slice(-length);

        expect(results).toEqual(expected);
    });

    it('when called on a collection without explicit length whose cardinality is equal to the count then returns the entire collection', () =>
    {
        let results = col2.takeLast(genSize).toArray();
        let expected = [...gen()];

        expect(results).toEqual(expected);
    });

    it('when called on a collection without explicit length whose cardinality is less than the count then returns the entire collection', () =>
    {
        let results = col2.takeLast(genSize + 5).toArray();
        let expected = [...gen()];

        expect(results).toEqual(expected);
    });

    it('when called without a count then throws an exception', () =>
    {
        expect(() => { col1.takeLast(); }).toThrow();
    });

    it('when called with a non-numeric count then throws an exception', () => 
    {
        expect(() => { col1.takeLast('not-a-number'); }).toThrow();
    });

    it('when called with a negative count then throws an exception', () =>
    {
        expect(() => { col1.takeLast(-5); }).toThrow();
    });
});
