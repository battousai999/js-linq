import {Linq} from '../jslinq';

describe('groupJoin', () => 
{
    let col1 = new Linq([
        { id: 1, name: 'steve', color: 'blue' },
        { id: 2, name: 'paul', color: 'red' },
        { id: 3, name: 'eve', color: 'pink' },
        { id: 4, name: 'zoe', color: 'grey' }
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

    let carFunc = (outer, inner) =>
    {
        if (inner.length === 0)
            return `${outer.name}: <none>`;
        else
        {
            let values = Linq.from(inner)
                .select(x => `${x.make} ${x.model}`)
                .toArray()
                .join(', ');

            return `${outer.name}: ${values}`;
        }
    };

    it('when called with a Linq inner collection then returns the correctly-joined results', () => 
    {
        let results = col1
            .groupJoin(col2,
                x => x.id,
                x => x.personId,
                carFunc)
            .toArray();

        expect(results).toEqual(["steve: Honda Civic", "paul: Toyota Camry, Acura TL", "eve: Ford Focus", "zoe: <none>"]);
    });

    it('when called with an Array inner collection then returns the correctly-joined results', () => 
    {
        let results = col1
            .groupJoin([{ personId: 2, make: 'Lexus', model: 'LS' }],
                x => x.id,
                x => x.personId,
                carFunc)
            .toArray();

        expect(results).toEqual(["steve: <none>", "paul: Lexus LS", "eve: <none>", "zoe: <none>"]);
    });

    it('when called on an empty outer collection then returns an empty collection', () => 
    {
        let results = Linq.empty()
            .groupJoin(col2,
                x => x.id,
                x => x.personId,
                carFunc)
            .toArray();

        expect(results).toEqual([]);
    });

    it('when called with an empty inner collection then returns a collection with empty joined parts', () => 
    {
        let results = col1
            .groupJoin(Linq.empty(),
                x => x.id,
                x => x.personId,
                carFunc)
            .toArray();

        expect(results).toEqual(["steve: <none>", "paul: <none>", "eve: <none>", "zoe: <none>"]);
    });

    it('when called with a comparer then joins using the comparer', () => 
    {
        let resultSelector = (outer, inner) =>
        {
            if (inner.length === 0)
                return `${outer.name}: <none>`;
            else
            {
                let values = Linq.from(inner)
                    .select(x => x.trait)
                    .toArray()
                    .join(', ');

                return `${outer.name}: ${values}`;
            }
        };

        let results = col1
            .groupJoin(col3,
                x => x.color,
                x => x.color,
                resultSelector,
                Linq.caseInsensitiveStringComparer)
            .toArray();

        expect(results).toEqual(["steve: reliable, sincere", "paul: courageous, confident", "eve: friendly, sensitive", "zoe: <none>"]);
    });

    it('when called without an inner collection then throws an exception', () => 
    {
        expect(() => { col1.groupJoin(null, Linq.identity, Linq.identity, Linq.tuple); }).toThrow();
    });

    it('when called without an inner key selector then throws an exception', () => 
    {
        expect(() => { col1.groupJoin(col2, Linq.identity, null, Linq.tuple); }).toThrow();
    });

    it('when called with a non-function inner key selector then throws an exception', () => 
    {
        expect(() => { col1.groupJoin(col2, Linq.identity, 'not-a-function', Linq.tuple); }).toThrow();
    });

    it('when called without an outer key selector then throws an exception', () => 
    {
        expect(() => { col1.groupJoin(col2, null, Linq.identity, Linq.tuple); }).toThrow();
    });

    it('when called with a non-function outer key selector then throws an exception', () => 
    {
        expect(() => { col1.groupJoin(col2, 'not-a-function', Linq.identity, Linq.tuple); }).toThrow();
    });

    it('when called without a result selector then throws an exception', () => 
    {
        expect(() => { col1.groupJoin(col2, Linq.identity, Linq.identity); }).toThrow();
    });

    it('when called with a non-function result selector then throws an exception', () => 
    {
        expect(() => { col1.groupJoin(col2, Linq.identity, Linq.identity, 'not-a-function'); }).toThrow();
    });

    it('when called a non-function key comparer then throws an exception', () => 
    {
        expect(() => { col1.groupJoin(col2, Linq.identity, Linq.identity, Linq.tuple, 'not-a-function'); }).toThrow();
    });
});
