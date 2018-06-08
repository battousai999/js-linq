import {Linq} from '../jslinq';

describe('padWith', () => 
{
    it('when called on a collection of less than width length then returns a collection of width length', () => 
    {
        let width = 10;

        let results = Linq.from([1, 2, 3, 4])
            .padWith(width, () => '*')
            .toArray();

        expect(results.length).toEqual(width);
    });

    it('when called on a collection of less than width length then returns a collection whose last (width - original_size) elements are equal to appropriate padding value', () => 
    {
        let results = Linq.from([0, 1, 2, 3, 4])
            .padWith(10, i => `*${i}`)
            .toArray();

        expect(results).toEqual([0, 1, 2, 3, 4, '*5', '*6', '*7', '*8', '*9']);
    });

    it('when called on a collection of greater than width length then returns a collection equal to the original collection', () => 
    {
        let arr = [1, 2, 3, 4, 5, 6, 7];

        let results = Linq.from(arr)
            .padWith(5, i => `*${i}`)
            .toArray();

        expect(results).toEqual(arr);
    });

    it('when called on an empty collection then returns a collection of width size with every element equal to the appropriate padding value', () => 
    {
        let width = 15;
        
        let results = Linq.empty()
            .padWith(width, i => `*${i}`)
            .toArray();

        expect(results.length).toEqual(width);
        expect(results.every((x, i) => x === `*${i}`)).toBeTruthy();
    });

    it('when called with a non-number width then throws an exception', () => 
    {
        expect(() => { Linq.from([1, 2, 3]).padWith('not-a-number', Linq.identity); }).toThrow();
    });

    it('when called with a non-function paddingSelector then throws an exception', () => 
    {
        expect(() => { Linq.from([1, 2, 3]).padWith(10, 'not-a-function'); }).toThrow();
    });
});
