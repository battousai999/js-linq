import {Linq} from '../jslinq';

describe('takeEvery', () => 
{
    let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let col = new Linq(arr);

    it('when called on an empty collection then returns empty collection', () =>
    {
        let results = Linq.empty()
            .takeEvery(3)
            .toArray();

        expect(results).toEqual([]);
    });

    it('when called on a collection relatively larger than the step value then returns every step-th element', () =>
    {
        let results = col.takeEvery(3).toArray();

        expect(results).toEqual([1, 4, 7]);
    });

    it('when called with a step of 1 then returns the entire collection', () =>
    {
        let results = col.takeEvery(1).toArray();

        expect(results).toEqual(arr);
    });

    it('when called on a collection whose size is smaller than the step value then returns the first element', () =>
    {
        let results = col.takeEvery(100).toArray();

        expect(results).toEqual([1]);
    });

    it('when called with a non-positive step then throws an exception', () =>
    {
        expect(() => { col.takeEvery(-3); }).toThrow();
    });

    it('when called with a non-numeric step then throws an exception', () =>
    {
        expect(() => { col.takeEvery('not-a-number'); }).toThrow();
    });

    it('when called without a step then throws an exception', () =>
    {
        expect(() => { col.takeEvery(); }).toThrow();
    });
});
