import {Linq} from '../jslinq';

describe('join', () => 
{
    let col1 = new Linq([
        { id: 1, name: 'steve', color: 'blue' }, 
        { id: 2, name: 'paul', color: 'red' }, 
        { id: 3, name: 'eve', color: 'pink' }, 
        { id: 4, name: 'zoe', color: 'yellow' }
    ]);

    let col2 = new Linq([
        { personId: 1, make: 'Honda', model: 'Civic' },
        { personId: 2, make: 'Toyota', model: 'Camry' },
        { personId: 2, make: 'Acura', model: 'TL' },
        { personId: 3, make: 'Ford', model: 'Focus' }
    ]);

    let col3 = new Linq([
        { color: 'blue', trait: 'reliable' }, { color: 'BLUE', trait: 'sincere' },
        { color: 'red', trait: 'courageous' }, { color: 'RED', trait: 'confident' },
        { color: 'green', trait: 'practical' }, { color: 'GREEN', trait: 'intelligent' },
        { color: 'pink', trait: 'friendly' }, { color: 'PINK', trait: 'sensitive' },
        { color: 'yellow', trait: 'happy' }, { color: 'YELLOW', trait: 'impulsive' }
    ]);

    let carFunc = (outer, inner) => `${outer.name}: ${inner.make} ${inner.model}`;

    it('when called on an empty collection then returns an empty collection', () => 
    {
        let results = Linq.empty()
            .join(col1,
                x => x.id,
                x => x.personId,
                carFunc)
            .toArray();

        expect(results).toEqual([]);
    });

    it('when called with an empty inner collection then returns an empty collection', () => 
    {
        let results = col1
            .join(Linq.empty(),
                x => x.id,
                x => x.personId,
                carFunc)
            .toArray();

        expect(results).toEqual([]);
    });

    it('when called on a collection that has common keys then returns the common, joined results', () => 
    {
        let results = col1
            .join(col2,
                x => x.id,
                x => x.personId,
                carFunc)
            .toArray();

        expect(results).toEqual(["steve: Honda Civic", "paul: Toyota Camry", "paul: Acura TL", "eve: Ford Focus"]);
    });

    it('when called on a collection that has no common keys then returns an empty collection', () => 
    {
        let results = col1
            .join(col2,
                x => x.id * 10,
                x => x.personId,
                carFunc)
            .toArray();

        expect(results).toEqual([]);
    });

    it('when called with an inner collection that is an array then returns common, joined results', () => 
    {
        let results = col1
            .join(col2.toArray().slice(0, 3),
                x => x.id,
                x => x.personId,
                carFunc)
            .toArray();

        expect(results).toEqual(["steve: Honda Civic", "paul: Toyota Camry", "paul: Acura TL"]);
    });

    it('when called with a key comparer on a collection that would have no common keys, without the comparer, then returns common, joined results', () => 
    {
        let results = col1
            .join(col3,
                x => x.color,
                x => x.color,
                (outer, inner) => `${outer.name}: ${inner.trait}`,
                Linq.caseInsensitiveStringComparer)
            .toArray();

        expect(results).toEqual(["steve: reliable", "steve: sincere", "paul: courageous", "paul: confident", "eve: friendly", "eve: sensitive", "zoe: happy", "zoe: impulsive"]);
    });

    it('when called with a null inner collection then throws an exception', () => 
    {
        expect(() => { col1.join(null, Linq.identity, Linq.identity, Linq.merge); }).toThrow();
    });

    it('when called without an outer key selector throws an exception', () => 
    {
        expect(() => { col1.join(col2, null, Linq.identity, Linq.merge); }).toThrow();
    });

    it('when called with a non-function outer key selector then throws an exception', () => 
    {
        expect(() => { col1.join(col2, 'not-a-function', Linq.identity, Linq.merge); }).toThrow();
    });

    it('when called without an inner key selector throws an exception', () => 
    {
        expect(() => { col1.join(col2, Linq.identity, null, Linq.merge); }).toThrow();
    });

    it('when called with a non-function inner key selector then throws an exception', () => 
    {
        expect(() => { col1.join(col2, Linq.identity, 'not-a-function', Linq.merge); }).toThrow();
    });

    it('when called without a result selector throws an exception', () => 
    {
        expect(() => { col1.join(col2, Linq.identity, Linq.identity); }).toThrow();
    });

    it('when called with a non-function result selector then throws an exception', () => 
    {
        expect(() => { col1.join(col2, Linq.identity, Linq.identity, 'not-a-function'); }).toThrow();
    });

    it('when called with a non-function key comparer then throws an exception', () => 
    {
        expect(() => { col1.join(col2, Linq.identity, Linq.identity, Linq.merge, 'not-a-function'); }).toThrow();
    });
});
