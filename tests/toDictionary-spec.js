import {Linq} from '../jslinq';

describe('toDictionary', () =>
{
    let col1 = new Linq([{ prop: 'color', value: 'red' }, { prop: 'align', value: 'center' }, { prop: 'text', value: 'nicole' }]);
    let col2 = new Linq(['a_blue', 'b_red', 'c_green', 'd_purple']);
    let col3 = new Linq(['1_one', '1_uno', '2_two', '3_three']);


    it('when called on an empty collection then returns an empty object', () =>
    {
        let results = Linq.empty().toDictionary(x => x.prop);

        expect(results).toEqual({});
    });

    it('when called with an element selector then returns an object whose properties are derived from the element selector', () =>
    {
        let results = col1.toDictionary(x => x.prop, x => x.value);

        expect(results).toEqual({ color: 'red', align: 'center', text: 'nicole' });
    });

    it('when called without an element selector then returns an object whose properties contain the elements of the collection', () =>
    {
        let results = col2.toDictionary(x => x[0]);

        expect(results).toEqual({ a: 'a_blue', b: 'b_red', c: 'c_green', d: 'd_purple' });
    });

    it('when called on a collection whose resolved keys will contain a duplicate then throws an exception', () =>
    {
        expect(() => { col3.toDictionary(x => x[0], x => x.slice[2]); }).toThrow();
    });

    it('when called without a key selector then throws an exception', () =>
    {
        expect(() => { col1.toDictionary(); }).toThrow();
    });

    it('when called with a non-function key selector then throws an exception', () =>
    {
        expect(() => { col1.toDictionary('not-a-function'); }).toThrow();
    });

    it('when called with a non-function element selector then throws an exception', () =>
    {
        expect(() => { col1.toDictionary(x => x.prop, 'not-a-function'); }).toThrow();
    });
});
