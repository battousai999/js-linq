import {Linq} from '../jslinq';

describe('groupBy', () => 
{
        let col1 = new Linq([{ name: 'steve', state: 'ut' }, { name: 'john', state: 'ut' }, { name: 'kelly', state: 'nv' }, { name: 'abbey', state: 'wa' }]);
        let col2 = new Linq(['apple', 'carrot', 'corn', 'tomato', 'watermellon', 'watercrest']);
        let col3 = new Linq([{ name: 'kevin', state: 'UT' }, { name: 'spencer', state: 'ut' }, { name: 'glenda', state: 'co' }, { name: 'may', state: 'CO' }]);

        let stateProjection = x => x.state;
        let groupSelector = x => `${x.key}: ${x.values.join(',')}`;
        let nameSelector = x => x.name;

    it('when called on an empty collection then returns an empty collection', () => 
    {
        let results = Linq.empty()
            .groupBy(stateProjection, nameSelector)
            .toArray();

        expect(results).toEqual([]);
    });

    it('when called with only a key selector then returns grouped elements', () => 
    {
        let results = col2
            .groupBy(x => (x == null || x.length == 0 ? '' : x[0]))
            .toArray()
            .map(groupSelector);

        expect(results).toEqual(["a: apple", "c: carrot,corn", "t: tomato", "w: watermellon,watercrest"]);
    });

    it('when called with an element selector then returns grouped elements projected by the element selector', () => 
    {
        let results = col1
            .groupBy(stateProjection, nameSelector)
            .toArray()
            .map(groupSelector);

        expect(results).toEqual(["ut: steve,john", "nv: kelly", "wa: abbey"]);
    });

    it('when called with a comparer then groups according to the comparer', () => 
    {
        let results = col3
            .groupBy(stateProjection, nameSelector, Linq.caseInsensitiveStringComparer)
            .toArray()
            .map(groupSelector);

        expect(results).toEqual(["UT: kevin,spencer", "co: glenda,may"]);
    });

    it('when called with an equality comparer then groups according to the equality comparer', () => 
    {
        let results = col3
            .groupBy(stateProjection, nameSelector, Linq.caseInsensitiveStringEqualityComparer)
            .toArray()
            .map(groupSelector);

        expect(results).toEqual(["UT: kevin,spencer", "co: glenda,may"]);
    });

    it('when called without a key selector then throws an exception', () => 
    {
        expect(() => { col1.groupBy(); }).toThrow();
    });

    it('when called with a non-function key selector then throws an exception', () => 
    {
        expect(() => { col1.groupBy('not-a-function'); }).toThrow();
    });

    it('when called with a non-function element selector then throws an exception', () => 
    {
        expect(() => { col1.groupBy(stateProjection, 'not-a-function'); }).toThrow();
    });

    it('when called with a non-function comparer then throws an exception', () => 
    {
        expect(() => { col1.groupBy(stateProjection, nameSelector, 'non-a-function'); }).toThrow();
    });
});
