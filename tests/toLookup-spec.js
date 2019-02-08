import {Linq} from '../jslinq';
import {Utils} from './utils';

describe('toLookup', () =>
{
    let col = Linq.from([
        { category: 'Utah', score: 'A' },            
        { category: 'New York', score: 'B' },            
        { category: 'Colorado', score: 'C' },            
        { category: 'Montana', score: 'C' },            
        { category: 'Kansas', score: 'A' },            
        { category: 'Maine', score: 'B' },            
        { category: 'Kentucky', score: 'C' }
    ]);

    let expectToBeTruthy = (results, expected) => expect(Utils.isEqualIgnoringOrder(results, expected)).toBeTruthy();

    it('when called with a key selector that groups into unique elements then returns a collection with lookup sets that each have a single element', () =>
    {
        let col1 = Linq.from([1, 2, 3, 4, 5, 6]);

        let results = col1
            .toLookup(Linq.identity)
            .select(x => x.values.length)
            .toArray();

        let expectedResults = col1.toArray().map(() => 1);

        expect(results).toEqual(expectedResults);
    });

    it('when called with a key selector that groups into not-entirely-unique elements then returns a collection with lookup sets that have multiple elements', () =>
    {
        let results = col.toLookup(x => x.score);

        let collectCategory = key => results.first(x => x.key === key).values.map(x => x.category);

        let aList = collectCategory('A');
        let bList = collectCategory('B');
        let cList = collectCategory('C');

        expectToBeTruthy(aList, ['Utah', 'Kansas']);
        expectToBeTruthy(bList, ['New York', 'Maine']);
        expectToBeTruthy(cList, ['Colorado', 'Montana', 'Kentucky']);
    });

    it('when called with a key comparer that is an equality comparer then returns appropriate results', () =>
    {
        let isAB = x => x === 'A' || x === 'B';

        let comparer = (x, y) =>
        {
            if (isAB(x) && isAB(y))
                return true;
            else
                return (x === y);
        };

        let results = col.toLookup(x => x.score, comparer);

        let collectCategory = predicate => results.first(predicate).values.map(x => x.category);

        let firstList = collectCategory(x => isAB(x.key));
        let secondList = collectCategory(x => x.key === 'C');

        expectToBeTruthy(firstList, ['Utah', 'Kansas', 'New York', 'Maine']);
        expectToBeTruthy(secondList, ['Colorado', 'Montana', 'Kentucky']);
    });

    it('when called with a key comparer that is a comparer then returns appropriate results', () =>
    {
        let mapScore = score =>
        {
            if (score === 'A')
                return 1;
            else if (score === 'B')
                return 2;
            else if (score === 'C')
                return 3;
            else
                return 4;
        };

        let col2 = col.select(x => ({ category: x.category, score: mapScore(x.score) }));
        let comparer = (x, y) => x - y;
        let results = col2.toLookup(x => x.score, comparer);

        let collectCategory = key => results.first(x => x.key === key).values.map(x => x.category);

        let list1 = collectCategory(1);
        let list2 = collectCategory(2);
        let list3 = collectCategory(3);

        expectToBeTruthy(list1, ['Utah', 'Kansas']);
        expectToBeTruthy(list2, ['New York', 'Maine']);
        expectToBeTruthy(list3, ['Colorado', 'Montana', 'Kentucky']);
    });

    it('when called without a key selector then throws an exception', () => 
    {
        expect(() => { col.toLookup(); }).toThrow();
    });

    it('when called with a non-function key selector then throws an exception', () =>
    {
        expect(() => { col.toLookup('not-a-function'); }).toThrow();
    });

    it('when called with a non-function key comparer then throws an exception', () =>
    {
        expect(() => { col.toLookup(x => x.score, 'not-a-function'); }).toThrow();
    });
});
