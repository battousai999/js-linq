import {Linq} from '../jslinq';

describe('indexOfElement', () => 
{
    let col1 = new Linq([1, 2, 3, 4, 5]);
    let col2 = new Linq(['a', 'b', 'c', 'd', 'e']);

    it('when called on an empty collection then returns -1', () => 
    {
        let results = Linq.empty().indexOfElement(99);

        expect(results).toEqual(-1);
    });

    it('when called on a collection containing the element then returns the index of the element', () => 
    {
        let results = col1.indexOfElement(4);

        expect(results).toEqual(3);
    });

    it('when called on a collection not containing the element then returns -1', () => 
    {
        let results = col1.indexOfElement(99);

        expect(results).toEqual(-1);
    });

    it('when called with a comparer on a collection containing the element, from the perspective of the comparer, then returns the index of the element', () => 
    {
        let results = col2.indexOfElement('C', Linq.caseInsensitiveStringComparer);

        expect(results).toEqual(2);
    });

    it('when called with a non-function comparer then throws an exception', () => 
    {
        expect(() => { col1.indexOfElement(3, 'not-a-function'); }).toThrow();
    });
});
