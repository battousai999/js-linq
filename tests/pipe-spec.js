import {Linq} from '../jslinq';

describe('pipe', () => 
{
    let arr = ['a', 'b', 'c', 'd', 'e'];
    let col = new Linq(arr);

    let noop = () => {};

    let actionFactory = (elements, indices) => 
    {
        return (x, i) => 
        {
            if (elements != null)
                elements.push(x);

            if (indices != null)
                indices.push(i);
        };
    };

    it('when called on an empty collection then action is not invoked', () => 
    {
        let elements = [];
        let action = actionFactory(elements);

        Linq.empty().pipe(action);

        expect(elements.length).toEqual(0);
    });

    it('when called on an empty collection then returns an empty collection', () => 
    {
        let results = Linq.empty()
            .pipe(noop)
            .toArray();

        expect(results).toEqual([]);
    });

    it('when called on a non-empty array then returns the an equalivalent collection', () => 
    {
        let results = col.pipe(noop).toArray();

        expect(results).toEqual(arr);
    });

    it('when called with an action then invokes the action for each element', () => 
    {
        let elements = [];
        let action = actionFactory(elements);

        col.pipe(action);

        expect(elements).toEqual(arr);
    });

    it('when called with an action that takes the index then invokes the action with the correct indices', () => 
    {
        let indices = [];
        let action = actionFactory(null, indices);

        col.pipe(action);

        expect(indices).toEqual([0, 1, 2, 3, 4]);
    });

    it('when called without an action then throws an exception', () => 
    {
        expect(() => { col.pipe(); }).toThrow();
    });

    it('when called with a non-function action then throws an exception', () => 
    {
        expect(() => { col.pipe('not-a-function'); }).toThrow();
    });
});
