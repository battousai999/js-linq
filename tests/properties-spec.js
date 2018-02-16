import {Linq} from '../jslinq';

describe('properties', () => 
{
    let obj1 = { prop1: 'value1', prop2: 'value2' };
    let arr1 = ['aaa', 'bbb', 'ccc'];
    let linq1 = Linq.properties(obj1);
    let linq2 = Linq.properties(arr1);

    it('when called then returns a Linq object', () => 
    {
        expect(linq1).not.toBeNull();
        expect(linq1 instanceof Linq).toBeTruthy();
        
        expect(linq2).not.toBeNull();
        expect(linq2 instanceof Linq).toBeTruthy();
    });

    it('when called with a null object then returns an empty Linq object', () => 
    {
        let linq = Linq.properties(null);

        expect(linq instanceof Linq).toBeTruthy();
        expect(linq.toArray().length).toEqual(0);
    });

    it('when called with an non-null object then returns a Linq object with as many elements as the number of properties on the object', () => 
    {
        expect(linq1.toArray().length).toEqual(2);
        expect(linq2.toArray().length).toEqual(3);
    });

    it('when called with a non-null \'keyPropertyName\' then returns a collection of objects having a property of that value', () => 
    {
        let linq1 = Linq.properties(obj1, 'name', null);
        let linq2 = Linq.properties(arr1, 'index');

        expect(linq1.toArray()).toEqual([{name: 'prop1', value: 'value1'}, {name: 'prop2', value: 'value2'}]);
        expect(linq2.toArray()).toEqual([{index: '0', value: 'aaa'}, {index: '1', value: 'bbb'}, {index: '2', value: 'ccc'}]);
    });

    it('when called with a null \'keyPropertyName\' then returns a collection of objects having a property name of \'key\'', () => 
    {
        expect(linq1.toArray()).toEqual([{key: 'prop1', value: 'value1'}, {key: 'prop2', value: 'value2'}]);
        expect(linq2.toArray()).toEqual([{key: '0', value: 'aaa'}, {key: '1', value: 'bbb'}, {key: '2', value: 'ccc'}]);
    });

    it('when called with a non-null \'valuePropertyName\' then returns a collection of objects having a property of that value', () => 
    {
        let linq1 = Linq.properties(obj1, null, 'result');
        let linq2 = Linq.properties(arr1, 'index', 'val');

        expect(linq1.toArray()).toEqual([{key: 'prop1', result: 'value1'}, {key: 'prop2', result: 'value2'}]);
        expect(linq2.toArray()).toEqual([{index: '0', val: 'aaa'}, {index: '1', val: 'bbb'}, {index: '2', val: 'ccc'}]);
    });

    it('when called with a null \'valuePropertyName\' then returns a collection of objects having a property name of \'key\'', () => 
    {
        expect(linq1.toArray()).toEqual([{key: 'prop1', value: 'value1'}, {key: 'prop2', value: 'value2'}]);
        expect(linq2.toArray()).toEqual([{key: '0', value: 'aaa'}, {key: '1', value: 'bbb'}, {key: '2', value: 'ccc'}]);
    });
});