import {Linq} from '../jslinq';

describe('lastIndexOfElement', () => 
{
    let arr = [1, 2, 3, 4, 5, 6];
    let col1 = new Linq(arr);
    let col2 = new Linq(['a', 'b', 'c', 'd', 'a', 'b', 'c', 'd']);
    let col3 = new Linq(arr.concat(arr));

    it('when called on an empty collection then returns -1', () => 
    {
        let results = Linq.empty().lastIndexOfElement(1);

        expect(results).toEqual(-1);
    });

    it('when called on a collection containing the element then returns the index of the element', () => 
    {
        let results = col1.lastIndexOfElement(3);

        expect(results).toEqual(2);
    });

    it('when called on a collection containing multiple instances of the element then returns the index of the last instance', () => 
    {
        let results = col3.lastIndexOfElement(4);

        expect(results).toEqual(9);
    });

    it('when called on a collection not containing the element then returns -1', () => 
    {
        let results = col1.lastIndexOfElement(99);

        expect(results).toEqual(-1);
    });

    it('when called with a comparer on a collection containing the element, from the perspective of the comparer, then returns the index of the element', () => 
    {
        let results = col2.lastIndexOfElement('B', Linq.caseInsensitiveStringComparer);

        expect(results).toEqual(5);
    });

    it('when called with a non-function comparer then throws an exception', () => 
    {
        expect(() => { col2.lastIndexofElement('D', 'not-a-function'); }).toThrow();
    });
});
