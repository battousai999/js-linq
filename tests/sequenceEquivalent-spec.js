import {Linq} from '../jslinq';

describe('sequenceEquivalent', () =>
{
    let col1 = new Linq([1, 2, 3, 4, 5]);
    let col2 = new Linq([5, 4, 3, 2, 1]);
    let col3 = new Linq([1, 7, 3, 4, 5]);
    let col4 = new Linq(["one", "two", "three", "four"]);
    let col5 = new Linq(["FOUR", "THREE", "TWO", "ONE"]);
    let col6 = new Linq(["three", "two", "one"]);
    let col7 = new Linq([1, 1, 2, 2, 3, 4]);
    let col8 = new Linq([1, 1, 2, 2, 3, 4]);
    let col9 = new Linq([1, 2, 2, 3, 3, 4]);

    it('when called with empty collections then returns true', () =>
    {
        let results = Linq.empty().sequenceEquivalent(Linq.empty());

        expect(results).toBeTruthy();
    });

    it('when called with one of the collections being empty then returns false', () =>
    {
        let results1 = Linq.empty().sequenceEquivalent(col1);
        let results2 = col1.sequenceEquivalent(Linq.empty());

        expect(results1).toBeFalsy();
        expect(results2).toBeFalsy();
    });

    it('when when called with two collections that are equal then returns true', () =>
    {
        let results = col7.sequenceEquivalent(col8);

        expect(results).toBeTruthy();
    });

    it('when called with two collections that are equivalent then returns true', () =>
    {
        let results = col1.sequenceEquivalent(col2);

        expect(results).toBeTruthy();
    });

    it('when called with two collections that are equivalent but with the second collection being an array then returns true', () =>
    {
        let results = col1.sequenceEquivalent([5, 4, 3, 2, 1]);

        expect(results).toBeTruthy();
    });

    it('when called with the second collection as null then returns false', () =>
    {
        let results = col1.sequenceEquivalent(null);

        expect(results).toBeFalsy();
    });

    it('when called with two collections that are not equivalent then returns false', () =>
    {
        let results1 = col1.sequenceEquivalent(col3);
        let results2 = col1.sequenceEquivalent(col7);
        let results3 = col7.sequenceEquivalent(col9);

        expect(results1).toBeFalsy();
        expect(results2).toBeFalsy();
        expect(results3).toBeFalsy();
    });

    it('when called with a comparer and two collections that are only equivalent with regards to the comparer then returns true', () =>
    {
        let results = col4.sequenceEquivalent(col5, Linq.caseInsensitiveStringComparer);

        expect(results).toBeTruthy();
    });

    it('when called with a comparer and two non-equivalent collections then returns false', () =>
    {
        let results = col4.sequenceEquivalent(col6, Linq.caseInsensitiveStringComparer);

        expect(results).toBeFalsy();
    });

    it('when called with a non-function comparer then throws an exception', () =>
    {
        expect(() => { col1.sequenceEquivalent(col2, 'not-a-function'); }).toThrow();
    });
});
