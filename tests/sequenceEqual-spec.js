import {Linq} from '../jslinq';

describe('sequenceEqual', () =>
{
    let arr = [1, 2, 7, 4, 5];
    let col1 = new Linq([1, 2, 3, 4, 5]);
    let col2 = new Linq([1, 2, 3, 4, 5]);
    let col3 = new Linq([1, 2, 2, 3, 4, 5]);
    let col4 = new Linq(arr);
    let col5 = new Linq(["one", "two", "three", "four"]);
    let col6 = new Linq(["ONE", "TWO", "THREE", "FOUR"]);
    let col7 = new Linq(["ONE", "TWO", "THREE"]);
    let col8 = new Linq(["ONE", "SEVEN", "THREE", "FOUR"]);

    it('when called with empty collections then returns true', () =>
    {
        let results = Linq.empty().sequenceEqual(Linq.empty());

        expect(results).toBeTruthy();
    });

    it('when called with one of the collections being empty then returns false', () =>
    {
        let results1 = Linq.empty().sequenceEqual(col1);
        let results2 = col1.sequenceEqual(Linq.empty());

        expect(results1).toBeFalsy();
        expect(results2).toBeFalsy();
    });

    it('when called with two collections that are equal then returns true', () => 
    {
        let results = col1.sequenceEqual(col2);        

        expect(results).toBeTruthy();        
    });

    it('when called with two collections that are equal but with the second collection being an array then returns true', () =>
    {
        let results = col4.sequenceEqual(arr);

        expect(results).toBeTruthy();
    });

    it('when called with the second collection as null then returns false', () =>
    {
        let results1 = col1.sequenceEqual(null);
        let results2 = Linq.empty().sequenceEqual(null);

        expect(results1).toBeFalsy();
        expect(results2).toBeFalsy();
    });

    it('when called with two collections that are not equal then returns false', () =>
    {
        let results1 = col1.sequenceEqual(col3);
        let results2 = col1.sequenceEqual(col4);
        let results3 = col1.sequenceEqual(col5);

        expect(results1).toBeFalsy();
        expect(results2).toBeFalsy();
        expect(results3).toBeFalsy();
    });

    it('when called with a comparer and two collections that are only equal with regards to the comparer then returns true', () =>
    {
        let results = col5.sequenceEqual(col6, Linq.caseInsensitiveStringComparer);

        expect(results).toBeTruthy();
    });

    it('when called with a comparer and two non-equal collections then returns false', () =>
    {
        let results1 = col5.sequenceEqual(col7, Linq.caseInsensitiveStringComparer);
        let results2 = col5.sequenceEqual(col8, Linq.caseInsensitiveStringComparer);

        expect(results1).toBeFalsy();
        expect(results2).toBeFalsy();
    });

    it('when called with a non-function comparer then throws an exception', () =>
    {
        expect(() => { col1.sequenceEqual(col2, 'not-a-function'); }).toThrow();
    });
});
