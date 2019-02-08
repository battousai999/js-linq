import {Linq} from '../jslinq';

describe('index', () => 
{
    let arr = ['a', 'b', 'c', 'd', 'e'];
    let col = new Linq(arr);

    let isMonoticallyIncreasing = list =>
        {
            return list.reduce(
                (acc, x) => 
                {
                    if (!acc.satisfied)
                        return acc;

                    return {
                        satisfied: (acc.lastValue == null ? true : x > acc.lastValue),
                        lastValue: x
                    };
                }, 
                { satisfied: true, lastValue: null })
            .satisfied;
        };

    it('when called with a starting index then the key property of the first element is equal to the starting index', () => 
    {
        let results = col.index(5).toArray();

        expect(results[0].key).toEqual(5);
    });

    it('when called without a starting index then the key property of the first element is equal to zero', () => 
    {
        let results = col.index().toArray();

        expect(results[0].key).toEqual(0);
    });

    it('when called on an empty collection then returns an empty collection', () => 
    {
        let results = Linq.empty()
            .index()
            .toArray();

        expect(results).toEqual([]);
    });

    it('when called with a starting index then the key property of the elements are monotonically increasing', () => 
    {
        let results = col
            .index(7)
            .toArray()
            .map(x => x.key);

        expect(isMonoticallyIncreasing(results)).toBeTruthy();
    });

    it('when called without a starting index then the key property of the elements are monotonically increasing', () => 
    {
        let results = col
            .index()
            .toArray()
            .map(x => x.key);

        expect(isMonoticallyIncreasing(results)).toBeTruthy();
    });

    it('when called with a starting index then key property of elements are equal to (startingIndex + index_of_element)', () => 
    {
        let startingIndex = 2;

        let results = col
            .index(startingIndex)
            .toArray()
            .map((x, i) => x.key === startingIndex + i)
            .reduce((acc, x) => acc && x, true);

        expect(results).toBeTruthy();
    });

    it('when called without a starting index then the key property of elements are equal to index of element', () => 
    {
        let results = col
            .index()
            .toArray()
            .map((x, i) => x.key === i)
            .reduce((acc, x) => acc && x, true);

        expect(results).toBeTruthy();
    });

    it('when called with a starting index then the value property of each element will match the elements of the original collection', () => 
    {
        let results = col
            .index(7)
            .toArray()
            .map((x, i) => x.value === arr[i])
            .reduce((acc, x) => acc && x, true);

        expect(results).toBeTruthy();
    });

    it('when called without a starting index then the value property of each element will match the elements of the original collection', () => 
    {
        let results = col
            .index()
            .toArray()
            .map((x, i) => x.value === arr[i])
            .reduce((acc, x) => acc && x, true);

        expect(results).toBeTruthy();
    });

    it('when called with a non-numeric starting index then throws an exception', () => 
    {
        expect(() => { col.index('not-a-number'); }).toThrow();
    });
});
