import { Linq, LinqCompatible, IKeyValuePair } from "../jslinq"

describe('Linq', () => {
    describe('from', () =>
    {
        let arr = [1, 2, 3, 4, 5, 6];
        let col = Linq.from(arr);

        it('should return a Linq object', () =>
        {
            expect(col).not.toBeNull();
            expect(col instanceof Linq).toBeTruthy();
        });

        it('has the correct length', () => { expect(col.toArray().length).toEqual(arr.length); });
        it('has the correct elements', () => { expect(col.toArray()).toEqual(arr); });

        it('contains a copy of the array', () => 
        {
            let arr = [1, 2, 3];
            let col = Linq.from(arr);

            arr.push(4);

            expect(col.toArray()).toEqual([1, 2, 3]);
        });

        it('can accept an array as a parameter', () => { expect(col.toArray()).toEqual(arr); });
        it('can accept null as a parameter', () => { expect(Linq.from(null).toArray()).toEqual([]); });
        it('can accept another Linq object as a parameter', () => { expect(Linq.from(col).toArray()).toEqual(arr); });
    });

    describe('range', () =>
    {
        let start = 1;
        let end = 11;
        let step = 3;
        let col1 = Linq.range(start, end);
        let col2 = Linq.range(start, end, step);

        it('should return a Linq object', () =>
        {
            expect(col1).not.toBeNull();
            expect(col1 instanceof Linq).toBeTruthy();

            expect(col2).not.toBeNull();
            expect(col2 instanceof Linq).toBeTruthy();
        });

        it('has the correct length', () => 
        {
            let expectedLength: number = 0;
            
            for (let i = start; i < end; i += step) { expectedLength += 1; }
        
            expect(col1.toArray().length).toEqual(end - start + 1);
            expect(col2.toArray().length).toEqual(expectedLength);
        });

        it('defaults to a "step" of "1" when that parameter is not given', () =>
        {
            expect(col1.toArray().length).toEqual(end - start + 1);
        });

        it('should not allow a null value for the "from" parameter', () =>
        {
            expect(() => { Linq.range(null, 10); }).toThrow();
        });

        it('should not allow a null value for the "to" parameter', () =>
        {
            expect(() => { Linq.range(1, null); }).toThrow();
        });
    });

    describe('repeat', () =>
    {
        let repetitions = 3;
        let col = Linq.repeat("stuff", repetitions);
        
        it('returns a Linq object', () => 
        {
            expect(col).not.toBeNull();
            expect(col instanceof Linq).toBeTruthy();
        });

        it('has the correct length', () => { expect(col.toArray().length).toEqual(repetitions); });

        it('has the correct elements', () =>
        {
            for (let i = 0; i < repetitions; i++)
            {
                expect(col.toArray()[i]).toEqual("stuff");
            }
        });

        it('uses the default value of "1" if no "repetitions" parameter is given', () =>
        {
            expect(Linq.repeat('that').toArray()).toEqual(['that']);
        });

        it('implies a value of "1" if the "repetitions" parameter is passed a null value', () =>
        {
            expect(Linq.repeat('this', null).toArray()).toEqual(['this']);
        });
    });

    describe('matches', () =>
    {
        let col1 = Linq.matches("this is a test", "\\w+");
        let col2 = Linq.matches("this is another test", /\w+/);
        let col3 = Linq.matches("test_1 TEST_2 test_3 TeSt_4", "test_\\d", "");
        let col4 = Linq.matches("test_1 TEST_2 test_3 TeSt_4", "test_\\d", "i");

        it('returns a Linq object', () =>
        {
            expect(col1).not.toBeNull();
            expect(col1 instanceof Linq).toBeTruthy();

            expect(col2).not.toBeNull();
            expect(col2 instanceof Linq).toBeTruthy();
            
            expect(col3).not.toBeNull();
            expect(col3 instanceof Linq).toBeTruthy();
            
            expect(col4).not.toBeNull();
            expect(col4 instanceof Linq).toBeTruthy();
        }); 

        it('has the correct elements', () => { expect(col1.toArray()).toEqual(['this', 'is', 'a', 'test']); });
        it('works with a RegExp pattern', () => { expect(col2.toArray()).toEqual(['this', 'is', 'another', 'test']); });
        it('defaults to a case-sensitive match', () => { expect(col3.toArray()).toEqual(['test_1', 'test_3']); });
        it('honors a case-insensitive match', () => { expect(col4.toArray()).toEqual(['test_1', 'TEST_2', 'test_3', 'TeSt_4']); });

        it('throws an exception on a null "pattern" parameter', () => { expect(() => { Linq.matches('this is a test', null); }).toThrow(); });
    });

    describe('properties', () =>
    {
        let obj1 = { prop1: 'value1', prop2: 100 };
        let arr1 = [ 'aaa', 'bbb', 'ccc' ];
        
        let col1 = Linq.properties(obj1);
        let col2 = Linq.properties(arr1);
        let col3 = Linq.properties({});
        let col4 = Linq.properties(null);
        let col5 = Linq.properties(obj1, 'name', 'result');
        let col6 = Linq.properties(obj1, 'Name', null);
        let col7 = Linq.properties(obj1, null, 'Value');
        
        it('returns an object', () =>
        {
            expect(col1).not.toBeNull();
            expect(col1 instanceof Linq).toBeTruthy();

            expect(col2).not.toBeNull();
            expect(col2 instanceof Linq).toBeTruthy();
            
            expect(col3).not.toBeNull();
            expect(col3 instanceof Linq).toBeTruthy();
            
            expect(col4).not.toBeNull();
            expect(col4 instanceof Linq).toBeTruthy();
            
            expect(col5).not.toBeNull();
            expect(col5 instanceof Linq).toBeTruthy();
            
            expect(col6).not.toBeNull();
            expect(col6 instanceof Linq).toBeTruthy();
            
            expect(col7).not.toBeNull();
            expect(col7 instanceof Linq).toBeTruthy();            
        });
        
        it('has the correct number of elements', () =>
        {
            expect(col1.toArray().length).toEqual(2);
            expect(col2.toArray().length).toEqual(3);
            expect(col3.toArray().length).toEqual(0);
            expect(col4.toArray().length).toEqual(0);
            expect(col5.toArray().length).toEqual(2);
            expect(col6.toArray().length).toEqual(2);
            expect(col7.toArray().length).toEqual(2);
        });
        
        it('returns elements with the correct property names and values', () =>
        {
            expect(col1.toArray()).toEqual([{ key: 'prop1', value: 'value1' }, { key: 'prop2', value: 100 }]);
            expect(col2.toArray()).toEqual([{ key: '0', value: 'aaa' }, { key: '1', value: 'bbb' }, { key: '2', value: 'ccc' }]);
            expect(col3.toArray()).toEqual([]);
            expect(col4.toArray()).toEqual([]);
            expect(col5.toArray()).toEqual([{ name: 'prop1', result: 'value1' }, { name: 'prop2', result: 100 }]);
            expect(col6.toArray()).toEqual([{ Name: 'prop1', value: 'value1' }, { Name: 'prop2', value: 100 }]);
            expect(col7.toArray()).toEqual([{ key: 'prop1', Value: 'value1' }, { key: 'prop2', Value: 100 }]);
        });
    });

    describe('aggregate', () =>
    {
        let col1 = Linq.from([1, 4, 5]);
        let col2 = Linq.from(['a', 'b', 'c', 'd', 'e']);
        let col3 = Linq.from([1, 2, 3, 4, 5, 6]);

        let sampleAggregate = (current: number, value: number) => current * 2 + value;
        let addition = (x: number, y: number) => x + y;

        it('works on a non-empty collection', () =>
        {
            expect(col1.aggregate(5, sampleAggregate)).toEqual(57);
            expect(col1.aggregate(null, sampleAggregate)).toEqual(17);
        });

        it('works on an empty collection with a seed', () =>
        {
            expect(Linq.from([]).aggregate(99, sampleAggregate)).toEqual(99);
        });

        it('works with a result selector', () =>
        {
            expect(col1.aggregate(5, sampleAggregate, x => 'value: ' + x)).toEqual('value: 57');
        });

        it('works with a lambda aggregate function', () =>
        {
            expect(col2.aggregate('', (x, y) => x + y)).toEqual('abcde');
        });

        it('works with a lambda result selector', () =>
        {
            expect(col1.aggregate(5, sampleAggregate, x => "value: " + x)).toEqual('value: 57');
        });

        it('works with a non-empty collection without a seed', () =>
        {
            expect(col3.aggregate(null, addition)).toEqual(21);
        });

        it('throws an exception on an empty collection without a seed', () =>
        {
            expect(() => { Linq.from([]).aggregate(null, sampleAggregate); }).toThrow();
        });

        it('throws an exception on a null operation', () =>
        {
            expect(() => { col1.aggregate(1, null); }).toThrow();
        });
    });

    describe('all', () =>
    {
        let allEvenCol = Linq.from([2, 4, 6, 8]);
        let mixedCol = Linq.from([1, 2, 3, 4, 5, 6]);

        it('works with a predicate', () =>
        {
            let allEven1 = allEvenCol.all(x => x % 2 == 0);
            let allEven2 = mixedCol.all(x => x % 2 == 0);
            let emptyCol = Linq.from([]).all(x => x % 2 == 0);

            expect(allEven1).toBeTruthy();
            expect(allEven2).toBeFalsy();
            expect(emptyCol).toBeTruthy();
        });

        it('throws an exception on null "predicate" parameter', () =>
        {
            expect(() => { mixedCol.all(null); }).toThrow();
        });
    });

    describe('any', () =>
    {
        let col = Linq.from([2, 4, 6, 8]);

        it('works without a predicate', () =>
        {
            let basicAny = col.any();
            let basicNotAny = Linq.from([]).any();

            expect(basicAny).toBeTruthy();
            expect(basicNotAny).toBeFalsy();
        });

        it('works with a predicate', () =>
        {
            let anyEven = col.any(x => x % 2 == 0);
            let anyOdd = col.any(x => x % 2 == 1);

            expect(anyEven).toBeTruthy();
            expect(anyOdd).toBeFalsy();
        });

        it('works with a null predicate', () =>
        {
            expect(col.any(null)).toBeTruthy();
            expect(Linq.from([]).any(null)).toBeFalsy();
        });
    });

    describe('average', () =>
    {
        let col1 = Linq.from([1, 2, 3, 4, 5, 6, 7, 8]);
        let col2 = Linq.from([{ id: 1, value: 100 }, { id: 2, value: 200 }, { id: 3, value: 300 }, { id: 4, value: 400 }]);

        it('works with a non-empty collection', () =>
        {
            expect(col1.average()).toEqual(4.5);
        });

        it('works with a selector', () =>
        {
            expect(col2.average(x => x.value)).toEqual(250);
        });

        it('throws an exception on a collection containing a non-number', () =>
        {
            expect(function () { Linq.from([1, 2, 'a']).average(); }).toThrow();
        });
    });

    describe('batch', () =>
    {
        var col = Linq.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

        it('works without a result selector', () =>
        {
            expect(col.batch(5).toArray()).toEqual([[1, 2, 3, 4, 5], [6, 7, 8, 9, 10], [11, 12]]);
        });

        it('works with a result selector', () =>
        {
            expect(col.batch(4, x => x * 2).toArray()).toEqual([[2, 4, 6, 8], [10, 12, 14, 16], [18, 20, 22, 24]]);
        });

        it('works with a batch size larger than the size of the collection', () =>
        {
            expect(col.batch(10000).toArray()).toEqual([[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]]);
        });

        it('works with a batch size of "1"', () =>
        {
            expect(col.batch(1).toArray()).toEqual([[1], [2], [3], [4], [5], [6], [7], [8], [9], [10], [11], [12]]);
        });

        it('works on an empty collection', () =>
        {
            expect(Linq.from([]).batch(10).toArray()).toEqual([]);
        });

        it('throws an exception on a batch size less than or equal to "0"', function ()
        {
            expect(function () { col.batch(0); }).toThrow();
            expect(function () { col.batch(-1); }).toThrow();
        });
    });

    describe('concat', () =>
    {
        let col1 = Linq.from([1, 2, 3]);
        let col2 = Linq.from([4, 5, 6]);

        it('works on non-empty collections', () =>
        {
            expect(col1.concat(col2).toArray()).toEqual([1, 2, 3, 4, 5, 6]);
        });

        it('works with an array', () =>
        {
            expect(col1.concat([7, 8, 9]).toArray()).toEqual([1, 2, 3, 7, 8, 9]);
        });

        it('works on empty collections', () =>
        {
            expect(Linq.from([]).concat([2, 4, 6]).toArray()).toEqual([2, 4, 6]);
            expect(col1.concat([]).toArray()).toEqual([1, 2, 3]);
        });

        it('works with a null collection', () =>
        {
            expect(col1.concat(null).toArray()).toEqual([1, 2, 3]);
        });

        it('resolves deferred ordering in the "left-hand side" of the concatenation', () =>
        {
            let col3 = col1.orderBy(x => -x);

            expect(col3.concat(col2).toArray()).toEqual([3, 2, 1, 4, 5, 6]);
        });

        it('resolves deferred ordering in the "right-had side" of the concatenation', () =>
        {
            let col3 = col2.orderBy(x => -x);

            expect(col1.concat(col3).toArray()).toEqual([1, 2, 3, 6, 5, 4]);
        });
    });

    describe('contains', () =>
    {
        let col1 = Linq.from([1, 2, 3, 4, 5, 6]);
        let col2 = Linq.from(["one", "two", "three", "four", "five", "six"]);
        let comparer = (x: string, y: string) => x.toLowerCase() == y.toLowerCase();

        it('works with a collection that contains the item', () =>
        {
            expect(col1.contains(3)).toBeTruthy();
        });

        it('works with a collection that does not contain the item', () =>
        {
            expect(col1.contains(77)).toBeFalsy();
        });

        it('works on an empty collection', () =>
        {
            expect(Linq.from([]).contains('test')).toBeFalsy();
        });

        it('works with a comparer', function ()
        {
            expect(col2.contains('FOUR', comparer)).toBeTruthy();
            expect(col2.contains('TEN', comparer)).toBeFalsy();
        });
        
        it('works with a "-1/0/1"-returning comparer', function ()
        {
            let comparer2 = (x: string, y: string) =>
            { 
                x = x.toLowerCase();
                y = y.toLowerCase();
                
                return (x < y ? -1 : x > y ? 1 : 0); 
            };
            
            expect(col2.contains('THREE', comparer2)).toBeTruthy();
            expect(col2.contains('fifty', comparer2)).toBeFalsy();
        });
    });

    describe('count', () =>
    {
        let col = Linq.from([1, 2, 3, 4, 5, 6, 7, 8]);

        it('works without a predicate', () => { expect(col.count()).toEqual(8); });
        it('works with a predicate', () => { expect(col.count(x => x % 2 == 0)).toEqual(4); });
    });

    describe('defaultIfEmpty', () =>
    {
        it('works on an empty collection', () =>
        {
            let value = Linq.from([1, 2, 3, 4]).defaultIfEmpty(99).toArray();

            expect(value).toEqual([1, 2, 3, 4]);
        });

        it('works on a non-empty collection', () =>
        {
            var value = Linq.from([]).defaultIfEmpty(99).toArray();

            expect(value).toEqual([99]);
        });

        it('works with a null "defaultValue" parameter', () =>
        {
            var value = Linq.from([]).defaultIfEmpty(null).toArray();

            expect(value).toEqual([null]);
        });
    });

    describe('distinct', () =>
    {
        var col = Linq.from(["one", "two", "three", "ONE", "TWO", "THREE"]);

        it('works when there are duplicate elements', () =>
        {
            var value1 = Linq.from([1, 2, 3, 4, 5, 1, 2, 3, 4, 5]).distinct().toArray();
            var value2 = col.distinct((x, y) => x.toLowerCase() == y.toLowerCase()).toArray();

            expect(value1).toEqual([1, 2, 3, 4, 5]);
            expect(value2).toEqual(["one", "two", "three"]);
        });

        it('works when there are no duplicate elements', () =>
        {
            var value1 = Linq.from([1, 2, 3, 4, 5]).distinct().toArray();
            var value2 = col.distinct((x, y) => x == y).toArray();

            expect(value1).toEqual([1, 2, 3, 4, 5]);
            expect(value2).toEqual(["one", "two", "three", "ONE", "TWO", "THREE"]);
        });

        it('works on an empty collection', () =>
        {
            var value = Linq.from([]).distinct().toArray();

            expect(value).toEqual([]);
        });
    });

    describe('distinctBy', () =>
    {
        let col1 = Linq.from([{ id: 1, name: 'steve' }, { id: 2, name: 'barbara' }, { id: 3, name: 'david' }, { id: 4, name: 'steve' }]);
        let col2 = Linq.from([{ id: 1, name: 'steve' }, { id: 2, name: 'barbara' }, { id: 3, name: 'david' }, { id: 4, name: 'STEVE' }]);

        let nameProjection = (x: any) => x.name;
        let idProjection = (x: any) => x.id;

        it('works when there are duplicate elements', () =>
        {
            let value1 = col1
                .distinctBy(nameProjection)
                .select(idProjection)
                .toArray();

            let value2 = col2
                .distinctBy(nameProjection, (x, y) => x.toLowerCase() == y.toLowerCase())
                .select(idProjection)
                .toArray();

            expect(value1).toEqual([1, 2, 3]);
            expect(value2).toEqual([1, 2, 3]);
        });

        it('works when there are no duplicate elements', () =>
        {
            let value1 = col1
                .distinctBy(idProjection)
                .select(idProjection)
                .toArray();

            let value2 = col2
                .distinctBy(nameProjection, (x, y) => x == y)
                .select(idProjection)
                .toArray();

            expect(value1).toEqual([1, 2, 3, 4]);
            expect(value2).toEqual([1, 2, 3, 4]);
        });

        it('works on an empty collection', () =>
        {
            let value = Linq.from([])
                .distinctBy(idProjection)
                .toArray();

            expect(value).toEqual([]);
        });
    });

    describe('elementAt', () =>
    {
        let col1 = Linq.from([1, 2, 3, 4, 5, 6, 7, 8]);

        it('works with indexes that fall within the range of the collection', () =>
        {
            expect(col1.elementAt(0)).toEqual(1);
            expect(col1.elementAt(5)).toEqual(6);
            expect(col1.elementAt(7)).toEqual(8);
        });

        it('throws an exception on a null index', () =>
        {
            expect(() => { col1.elementAt(null); }).toThrow();
        });

        it('throws an exception on an index outside of the range of the collection', () =>
        {
            expect(() => { col1.elementAt(-11); }).toThrow();
            expect(() => { col1.elementAt(9999); }).toThrow();
        });
    });

    describe('elementAtOrDefault', () =>
    {
        let col1 = Linq.from([1, 2, 3, 4, 5, 6, 7, 8]);

        it('works with indexes that fall within the range of the collection', () =>
        {
            expect(col1.elementAtOrDefault(0, 99)).toEqual(1);
            expect(col1.elementAtOrDefault(5, 99)).toEqual(6);
            expect(col1.elementAtOrDefault(7, 99)).toEqual(8);
        });

        it('works with indexes that fall outside the range of the collection', () =>
        {
            expect(col1.elementAtOrDefault(-11, 99)).toEqual(99);
            expect(col1.elementAtOrDefault(9999, 99)).toEqual(99);
        });

        it('works with a null index', () =>
        {
            expect(col1.elementAtOrDefault(null, 99)).toEqual(99);
        });
    });

    describe('equiZip', () =>
    {
        let col1 = Linq.from(['a', 'b', 'c', 'd']);
        let col2 = Linq.from([1, 2, 3, 4]);

        let mapToString = (xs: LinqCompatible<number>) => Linq.from(xs).select((x: any) => x.toString()).toArray();
        let resultSelector = (x: string, y: string) => x + '_' + y;
        let mixedSelector = (x: any, y: any) => x + '_' + y;

        it('works on collections of the same size', () =>
        {
            let doubleMapper = (xs: Linq<string>) => xs.select((x: any) => x + x);

            expect(col1.equiZip(col2, mixedSelector).toArray()).toEqual(['a_1', 'b_2', 'c_3', 'd_4']);
            expect(col1.equiZip(doubleMapper(col1), resultSelector).toArray()).toEqual(['a_aa', 'b_bb', 'c_cc', 'd_dd']);
            expect(Linq.from([]).equiZip([], resultSelector).toArray()).toEqual([]);
            expect(Linq.from([]).equiZip(null, resultSelector).toArray()).toEqual([]);
        });

        it('works on an array', () =>
        {
            expect(col1.equiZip([11, 22, 33, 44], mixedSelector).toArray()).toEqual(['a_11', 'b_22', 'c_33', 'd_44']);
        });
        
        it('works with a null result selector', function ()
        {
            expect(col1.equiZip(col2).toArray()).toEqual([['a', 1], ['b', 2], ['c', 3], ['d', 4]]);
        });

        it('throws an exception when called on collections of unequal lengths', function ()
        {
            expect(function () { col1.equiZip([1, 2, 3, 4, 5, 6], mixedSelector); }).toThrow();
            expect(function () { col1.equiZip([], resultSelector); }).toThrow();
            expect(function () { col1.equiZip(null, resultSelector); }).toThrow();
        });
    });

    describe('except', () =>
    {
        let col1 = Linq.from([1, 2, 3, 4]);
        let col2 = Linq.from([3, 4, 5, 6]);
        let col3 = Linq.from(["one", "two", "two", "three", "four"]);
        let col4 = Linq.from(["three", "three", "four", "five", "six"]);
        let col5 = Linq.from(["THREE", "FOUR", "FIVE", "SIX"]);
        let col6 = Linq.from([1, 2, 3, 4, 1, 2, 3]);

        it('works when there are duplicates within the first set', () =>
        {
            let value = col6.except(col2).toArray();

            expect(value).toEqual([1, 2]);
        });

        it('works when there are duplicates between the sets', () =>
        {
            let value1 = col1.except(col2).toArray();
            let value2 = col2.except(col1).toArray();
            let value3 = col1.except([1, 2, 3, 4]).toArray();

            expect(value1).toEqual([1, 2]);
            expect(value2).toEqual([5, 6]);
            expect(value3).toEqual([]);
        });

        it('works when there are no duplicates between the sets', () =>
        {
            let value1 = col1.except([10, 11, 12, 13]).toArray();
            let value2 = col1.except([]).toArray();

            expect(value1).toEqual([1, 2, 3, 4]);
            expect(value2).toEqual([1, 2, 3, 4]);
        });

        it('works with an empty collection', () =>
        {
            let value = Linq.from([]).except(col1).toArray();

            expect(value).toEqual([]);
        });

        it('works with a null second collection', () =>
        {
            let value = col1.except(null).toArray();

            expect(value).toEqual([1, 2, 3, 4]);
        });

        it('works with a comparer', () =>
        {
            let value1 = col3.except(col4, function (x, y) { return x == y; }).toArray();
            let value2 = col3.except(col5, function (x, y) { return x.toLowerCase() == y.toLowerCase(); }).toArray();

            expect(value1).toEqual(["one", "two"]);
            expect(value2).toEqual(["one", "two"]);
        });
    });

    describe('first', () =>
    {
        var col = Linq.from([1, 2, 3, 4, 5, 6]);

        it('works with a predicate', () =>
        {
            var predicateFirst = col.first(x => x > 3);

            expect(predicateFirst).toEqual(4);
        });

        it('works without a predicate', () =>
        {
            var basicFirst = col.first();

            expect(basicFirst).toEqual(1);
        });
    });

    describe('firstOrDefault', () =>
    {
        let col = Linq.from([1, 2, 3, 4, 5, 6]);

        it('works with a predicate', () =>
        {
            let defaultFirst1 = col.firstOrDefault(x => x > 3, 99);
            let defaultFirst2 = col.firstOrDefault(x => x > 100, 99);

            expect(defaultFirst1).toEqual(4);
            expect(defaultFirst2).toEqual(99);
        });
        
        it('works with only a predicate', () =>
        {
            let defaultFirst3 = col.firstOrDefault(x => x > 4);
            let defaultFirst4 = col.firstOrDefault(x => x > 100);

            expect(defaultFirst3).toEqual(5);
            expect(defaultFirst4).toBeUndefined();
        });
        
        it('works without a predicate', () =>
        {
            var defaultFirst1 = col.firstOrDefault(null, 99);
            var defaultFirst2 = Linq.from([]).firstOrDefault(null, 99);
            var defaultFirst3 = Linq.from([]).firstOrDefault();

            expect(defaultFirst1).toEqual(1);
            expect(defaultFirst2).toEqual(99);
            expect(defaultFirst3).toBeUndefined();
        });
    });

    describe('foreach', () =>
    {
        let arr1 = [1, 2, 3, 4, 5, 6];
        let arr2 = ['a', 'b', 'c', 'd', 'e', 'f'];
        let testValue = '';

        it('works on a non-empty collection', () =>
        {
            Linq.from(arr1).foreach((x, i) => { arr2[i] = arr2[i] + x; });
            expect(arr2).toEqual(['a1', 'b2', 'c3', 'd4', 'e5', 'f6']);
            
            let results = new Array<string>();
            Linq.from(arr1).foreach((x: number) => { results.push(x + '*'); });
            expect(results).toEqual(['1*', '2*', '3*', '4*', '5*', '6*']);
        });

        it('works on an empty collection', () =>
        {
            Linq.from([]).foreach((x: string) => testValue += '*');
            expect(testValue).toEqual('');
        });

        it('throws an exception on a null action', () =>
        {
            expect(() => { Linq.from(arr1).foreach(null); }).toThrow();
        });
    });

    describe('groupBy', () =>
    {
        let col1 = Linq.from([{ name: 'steve', state: 'ut' }, { name: 'john', state: 'ut' }, { name: 'kelly', state: 'nv' }, { name: 'abbey', state: 'wa' }]);
        let col2 = Linq.from(['apple', 'carrot', 'corn', 'tomato', 'watermellon', 'watercrest']);
        let col3 = Linq.from([{ name: 'kevin', state: 'UT' }, { name: 'spencer', state: 'ut' }, { name: 'glenda', state: 'co' }, { name: 'may', state: 'CO' }]);

        let stateProjection = (x: any) => x.state;
        let groupSelector = (x: any) => x.key + ': ' + x.values.join(',');
        let nameSelector = (x: any) => x.name;

        it('returns grouped results', () =>
        {
            var value = col1.groupBy(stateProjection, nameSelector).select(groupSelector);

            expect(value.toArray()).toEqual(["ut: steve,john", "nv: kelly", "wa: abbey"]);
        });

        it('works with no element selector', () =>
        {
            var value = col2.groupBy(x => (x == null || x.length == 0 ? '' : x[0])).select(groupSelector);

            expect(value.toArray()).toEqual(["a: apple", "c: carrot,corn", "t: tomato", "w: watermellon,watercrest"]);
        });

        it('works on an empty collection', () =>
        {
            var value = Linq.from([]).groupBy(stateProjection, nameSelector);

            expect(value.toArray()).toEqual([]);
        });

        it('works with a comparer', () =>
        {
            var value = col3.groupBy(stateProjection, nameSelector, (x, y) => x.toLowerCase() == y.toLowerCase()).select(groupSelector);

            expect(value.toArray()).toEqual(["UT: kevin,spencer", "co: glenda,may"]);
        });

        it('throws an exception on a null "key selector" parameter', function ()
        {
            expect(() => { col1.groupBy(null); }).toThrow();
        });
    });

    describe('groupJoin', () =>
    {
        let col1 = Linq.from([{ id: 1, name: 'steve', color: 'blue' },
            { id: 2, name: 'paul', color: 'red' },
            { id: 3, name: 'eve', color: 'pink' },
            { id: 4, name: 'zoe', color: 'grey' }]);

        let col2 = Linq.from([{ personId: 1, make: 'Honda', model: 'Civic' },
            { personId: 2, make: 'Toyota', model: 'Camry' },
            { personId: 2, make: 'Acura', model: 'TL' },
            { personId: 3, make: 'Ford', model: 'Focus' }]);

        let col3 = Linq.from([{ color: 'blue', trait: 'reliable' }, { color: 'BLUE', trait: 'sincere' },
            { color: 'red', trait: 'courageous' }, { color: 'RED', trait: 'confident' },
            { color: 'green', trait: 'practical' }, { color: 'GREEN', trait: 'intelligent' },
            { color: 'pink', trait: 'friendly' }, { color: 'PINK', trait: 'sensitive' },
            { color: 'yellow', trait: 'happy' }, { color: 'YELLOW', trait: 'impulsive' }]);

        let carFunc = (outer: any, inner: any) =>
        {
            if (inner.length == 0)
                return outer.name + ': <none>';
            else
                return outer.name + ': ' + Linq.from(inner).select((x: any) => x.make + ' ' + x.model).toArray().join(', ');
        };

        let idProjection = (x: any) => x.id;
        let personIdProjection = (x: any) => x.personId;

        it('works on a join that should return results', () =>
        {
            let value = col1.groupJoin(col2, idProjection, personIdProjection, carFunc).toArray();

            expect(value).toEqual(["steve: Honda Civic", "paul: Toyota Camry, Acura TL", "eve: Ford Focus", "zoe: <none>"]);
        });

        it('works with an array', () =>
        {
            let value = col1.groupJoin([{ personId: 2, make: 'Lexus', model: 'LS' }], idProjection, personIdProjection, carFunc).toArray();

            expect(value).toEqual(["steve: <none>", "paul: Lexus LS", "eve: <none>", "zoe: <none>"]);
        });

        it('works with empty sources', () =>
        {
            let onEmpty = Linq.from([]).groupJoin(col2, idProjection, personIdProjection, carFunc).toArray();
            let withEmpty = col1.groupJoin([], idProjection, personIdProjection, carFunc).toArray();

            expect(onEmpty).toEqual([]);
            expect(withEmpty).toEqual(["steve: <none>", "paul: <none>", "eve: <none>", "zoe: <none>"]);
        });

        it('works with a comparer', () =>
        {
            let colorProjection = (x: any) => x.color;

            let value = col1.groupJoin(col3,
                colorProjection,
                colorProjection,
                (outer, inner) =>
                {
                    if (inner.length == 0)
                        return outer.name + ': <none>';
                    else
                        return outer.name + ': ' + Linq.from(inner).select((x: any) => x.trait).toArray().join(', ');
                },
                (x, y) => x.toLowerCase() == y.toLowerCase())
                .toArray();

            expect(value).toEqual(["steve: reliable, sincere", "paul: courageous, confident", "eve: friendly, sensitive", "zoe: <none>"]);
        });

        it('throws an exception on a null "inner" parameter', () =>
        {
            expect(() => { col1.groupJoin(null, idProjection, personIdProjection, carFunc); }).toThrow();
        });

        it('throws an exception on a null "outer selector" parameter', () =>
        {
            expect(() => { col1.groupJoin(col2, null, personIdProjection, carFunc); }).toThrow();
        });

        it('throws an exception on a null "inner selector" parameter', () =>
        {
            expect(() => { col1.groupJoin(col2, idProjection, null, carFunc); }).toThrow();
        });

        it('throws an exception on a null "result selector" parameter', () =>
        {
            expect(() => { col1.groupJoin(col2, idProjection, personIdProjection, null); }).toThrow();
        });
    });

    describe('index', () =>
    {
        let col = Linq.from(['a', 'b', 'c', 'd', 'e']);
        let kvpMapper = <T, U>(x: IKeyValuePair<T, U>) => { return { key: x.key, value: x.value }; };

        it('works with a starting index', () =>
        {
            expect(col.index(5).select(kvpMapper).toArray()).toEqual([{ key: 5, value: 'a' }, { key: 6, value: 'b' }, { key: 7, value: 'c' }, { key: 8, value: 'd' }, { key: 9, value: 'e' }]);
        });

        it('works without a starting index', () =>
        {
            expect(col.index().select(kvpMapper).toArray()).toEqual([{ key: 0, value: 'a' }, { key: 1, value: 'b' }, { key: 2, value: 'c' }, { key: 3, value: 'd' }, { key: 4, value: 'e' }]);
        });

        it('works on an empty collection', () =>
        {
            expect(Linq.from([]).index(0).toArray()).toEqual([]);
        });
    });

    describe('indexOfFirst', () =>
    {
        let col = Linq.from([1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6]);

        it('works on a non-empty collection', () =>
        {
            expect(col.indexOfFirst(x => x == 3)).toEqual(2);
            expect(col.indexOfFirst(x => x == 99)).toEqual(-1);
        });

        it('works with an empty collection', () =>
        {
            expect(Linq.from([]).indexOfFirst(x => x == 2)).toEqual(-1);
        });

        it('throws an exception on a null predicate', () =>
        {
            expect(() => { col.indexOfFirst(null); }).toThrow();
        });
    });

    describe('indexOfElement', () =>
    {        
        let col1 = Linq.from([1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6]);
        let col2 = Linq.from(['a', 'b', 'c', 'd', 'a', 'b', 'c', 'd']);

        it('works on a non-empty collection', () =>
        {
            expect(col1.indexOfElement(3)).toEqual(2);
            expect(col1.indexOfElement(99)).toEqual(-1);
        });

        it('works on an empty collection', () =>
        {
            expect(Linq.from([]).indexOfElement(2)).toEqual(-1);
        });

        it('works with a comparer', () =>
        {
            var comparer = (x: string, y: string) => x.toLowerCase() == y.toLowerCase();
            expect(col2.indexOfElement('B', comparer)).toEqual(1);
        });
    });

    describe('indexOfLast', () =>
    {
        let col = Linq.from([1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6]);

        it('works on a non-empty collection', () =>
        {
            expect(col.indexOfLast(x => x == 3)).toEqual(8);
            expect(col.indexOfLast(x => x == 99)).toEqual(-1);
        });

        it('works on an empty collection', () =>
        {
            expect(Linq.from([]).indexOfLast(x => x == 2)).toEqual(-1);
        });

        it('throws an exception on a null predicate', () =>
        {
            expect(() => { col.indexOfLast(null); }).toThrow();
        });
    });

    describe('intersect', () =>
    {
        let col1 = Linq.from([1, 2, 3, 4]);
        let col2 = Linq.from([1, 2, 3, 4, 5, 6, 7, 8]);
        let col3 = Linq.from([5, 6, 7, 8]);
        let col4 = Linq.from(["one", "two", "three", "three", "four"]);
        let col5 = Linq.from(["ONE", "TWO", "TWO", "THREE"]);

        it('works when there are duplicates between the sets', () =>
        {
            let value1 = col1.intersect(col2).toArray();
            let value2 = col2.intersect(col3).toArray();
            let value3 = col2.intersect([2, 4, 6, 100]).toArray();

            expect(value1).toEqual([1, 2, 3, 4]);
            expect(value2).toEqual([5, 6, 7, 8]);
            expect(value3).toEqual([2, 4, 6]);
        });

        it('works when there are no duplicates between the sets', () =>
        {
            let value1 = col1.intersect([5, 6, 7, 8]).toArray();
            let value2 = col4.intersect(col5).toArray();

            expect(value1).toEqual([]);
            expect(value2).toEqual([]);
        });

        it('works with an empty collection', () =>
        {
            let empty = Linq.from([]);

            let value1 = col1.intersect(empty).toArray();
            let value2 = empty.intersect(col2).toArray();
            let value3 = empty.intersect([]).toArray();

            expect(value1).toEqual([]);
            expect(value2).toEqual([]);
            expect(value3).toEqual([]);
        });

        it('works with a null second collection', () =>
        {
            let value = col1.intersect(null).toArray();

            expect(value).toEqual([]);
        });

        it('works with a comparer', () =>
        {
            let value1 = col4.intersect(col5, (x, y) => x == y).toArray();
            let value2 = col4.intersect(col5, (x, y) => x.toLowerCase() == y.toLowerCase()).toArray();

            expect(value1).toEqual([]);
            expect(value2).toEqual(["one", "two", "three"]);
        });
    });

    describe('join', () =>
    {
        let col1 = Linq.from([{ id: 1, name: 'steve', color: 'blue' }, { id: 2, name: 'paul', color: 'red' }, { id: 3, name: 'eve', color: 'pink' }, { id: 4, name: 'zoe', color: 'yellow' }]);
        let col2 = Linq.from([{ personId: 1, make: 'Honda', model: 'Civic' },
            { personId: 2, make: 'Toyota', model: 'Camry' },
            { personId: 2, make: 'Acura', model: 'TL' },
            { personId: 3, make: 'Ford', model: 'Focus' }]);
        let col3 = Linq.from([{ color: 'blue', trait: 'reliable' }, { color: 'BLUE', trait: 'sincere' },
            { color: 'red', trait: 'courageous' }, { color: 'RED', trait: 'confident' },
            { color: 'green', trait: 'practical' }, { color: 'GREEN', trait: 'intelligent' },
            { color: 'pink', trait: 'friendly' }, { color: 'PINK', trait: 'sensitive' },
            { color: 'yellow', trait: 'happy' }, { color: 'YELLOW', trait: 'impulsive' }]);

        let carFunc = (outer: any, inner: any) => outer.name + ': ' + inner.make + ' ' + inner.model;

        it('works on a join that should return results', () =>
        {
            let value = col1.join(col2,
                x => x.id,
                x => x.personId,
                carFunc);

            expect(value.toArray()).toEqual(["steve: Honda Civic", "paul: Toyota Camry", "paul: Acura TL", "eve: Ford Focus"]);
        });

        it('works on a join that should not return results', () =>
        {
            let value = col1.join(col2,
                x => x.id * 10,
                x => x.personId,
                carFunc);

            expect(value.toArray()).toEqual([]);
        });

        it('works with an array', () =>
        {
            let value = col1.join([{ personId: 2, make: 'Lexus', model: 'LS' }],
                x => x.id,
                x => x.personId,
                carFunc);

            expect(value.toArray()).toEqual(["paul: Lexus LS"]);
        });

        it('works with empty sources', () =>
        {
            let onEmpty = Linq.from([]).join(col2,
                x => x.id,
                x => x.personId,
                carFunc);

            let withEmpty = col1.join([],
                x => x.id,
                x => x.personId,
                carFunc);

            expect(onEmpty.toArray()).toEqual([]);
            expect(withEmpty.toArray()).toEqual([]);
        });

        it('works with a comparer', () =>
        {
            let value = col1.join(col3,
                x => x.color,
                x => x.color,
                (outer, inner) => outer.name + ': ' + inner.trait,
                (x: string, y: string) => x.toLowerCase() == y.toLowerCase());

            expect(value.toArray()).toEqual(["steve: reliable", "steve: sincere", "paul: courageous", "paul: confident", "eve: friendly", "eve: sensitive", "zoe: happy", "zoe: impulsive"]);
        });

        it('throws an exception on a null "inner" parameter', () =>
        {
            expect(function () { col1.join(null, x => x.id, (x: any) => x.id, (x, y) => null); }).toThrow();
        });

        it('throws an exception on a null "outer selector" parameter', () =>
        {
            expect(function () { col1.join(col2, null, (x: any) => x.personId, (x, y) => null); }).toThrow();
        });

        it('throws an exception on a null "inner selector" parameter', () =>
        {
            expect(function () { col1.join(col2, x => x.id, null, (x, y) => null); }).toThrow();
        });

        it('throws an exception on a null "result selector" parameter', () =>
        {
            expect(function () { col1.join(col2, x => x.id, x => x.personId, null); }).toThrow();
        });
    });

    describe('last', () =>
    {
        let col = Linq.from([1, 2, 3, 4, 5, 6]);

        it('works with a predicate', () =>
        {
            let predicateFirst = col.last(x => x < 4);

            expect(predicateFirst).toEqual(3);
        });

        it('works without a predicate', () =>
        {
            let basicFirst = col.last();

            expect(basicFirst).toEqual(6);
        });
    });

    describe('lastIndexOfElement', () =>
    {
        let col1 = Linq.from([1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6]);
        let col2 = Linq.from(['a', 'b', 'c', 'd', 'a', 'b', 'c', 'd']);

        it('works on a non-empty collection', () =>
        {
            expect(col1.lastIndexOfElement(3)).toEqual(8);
            expect(col1.lastIndexOfElement(99)).toEqual(-1);
        });

        it('works on an empty collection', () =>
        {
            expect(Linq.from([]).lastIndexOfElement(2)).toEqual(-1);
        });

        it('works with a comparer', () =>
        {
            var comparer = (x: string, y: string) => x.toLowerCase() == y.toLowerCase();
            expect(col2.lastIndexOfElement('B', comparer)).toEqual(5);
        });
    });

    describe('lastOrDefault', () =>
    {
        let col1 = Linq.from([1, 2, 3, 4, 5, 6]);
        let col2 = Linq.from([6, 5, 4, 3, 2, 1]);

        it('works with a predicate', () =>
        {
            let defaultLast1 = col1.lastOrDefault(x => x < 4, 99);
            let defaultLast2 = col1.lastOrDefault(x => x > 100, 99);
            let defaultLast3 = col2.lastOrDefault(x => x < 4, 99);
            let defaultLast4 = col2.lastOrDefault(x => x > 100, 99);

            expect(defaultLast1).toEqual(3);
            expect(defaultLast2).toEqual(99);
            expect(defaultLast3).toEqual(1);
            expect(defaultLast4).toEqual(99);
        });
        
        it('works with only a predicate', () =>
        {
            let defaultLast1 = col1.lastOrDefault(x => x < 4);
            let defaultLast2 = col1.lastOrDefault(x => x > 100);
            let defaultLast3 = col2.lastOrDefault(x => x < 4);
            let defaultLast4 = col2.lastOrDefault(x => x > 100, null);

            expect(defaultLast1).toEqual(3);
            expect(defaultLast2).toBeUndefined();
            expect(defaultLast3).toEqual(1);
            expect(defaultLast4).toBeNull();
        });

        it('works without a predicate', () =>
        {
            let defaultLast1 = col1.lastOrDefault(null, 99);
            let defaultLast2 = Linq.from([]).lastOrDefault(null, 99);

            expect(defaultLast1).toEqual(6);
            expect(defaultLast2).toEqual(99);
        });
    });

    describe('min', () =>
    {
        let col1 = Linq.from([15, 42, 98, 6, 475, 3, 333]);
        let col2 = Linq.from([{ id: 1, value: 9000 }, { id: 2, value: 57 }, { id: 3, value: 17 }, { id: 4, value: 23 }, { id: 5, value: 94 }]);

        it('works without a selector', () =>
        {
            expect(col1.min()).toEqual(3);
        });

        it('works with a selector', () =>
        {
            var value = col2.min(x => x.value);

            expect(value).toEqual(17);
        });

        it('throws an exception on an empty collection', () =>
        {
            expect(() => { Linq.from([]).min(); }).toThrow();
        });
    });

    describe('minBy', () =>
    {
        let col = Linq.from([{ id: 1, value: 9000 }, { id: 2, value: 57 }, { id: 3, value: 17 }, { id: 4, value: 23 }, { id: 5, value: 94 }]);

        it('works with a non-empty collection', () =>
        {
            var value = col.minBy(x => x.value);

            expect(value).toEqual({ id: 3, value: 17 });
        });

        it('throws an exception on a null "selector" function', () =>
        {
            expect(() => { col.minBy(null); }).toThrow();
        });

        it('throws an exception on an empty collection', () =>
        {
            expect(() => { Linq.from([]).minBy(x => x.value); }).toThrow();
        });
    });

    describe('max', () =>
    {
        let col1 = Linq.from([15, 42, 98, 6, 475, 3, 333]);
        let col2 = Linq.from([{ id: 1, value: 9000 }, { id: 2, value: 57 }, { id: 3, value: 17 }, { id: 4, value: 23 }, { id: 5, value: 94 }]);

        it('works without a selector', () =>
        {
            expect(col1.max()).toEqual(475);
        });

        it('works with a selector', () =>
        {
            var value = col2.max(x => x.value);

            expect(value).toEqual(9000);
        });

        it('throws an exception on an empty collection', () =>
        {
            expect(() => { Linq.from([]).max(); }).toThrow();
        });
    });

    describe('maxBy', () =>
    {
        let col = Linq.from([{ id: 1, value: 9000 }, { id: 2, value: 57 }, { id: 3, value: 17 }, { id: 4, value: 23 }, { id: 5, value: 94 }]);

        it('works with a non-empty collection', () =>
        {
            var value = col.maxBy(x => x.value);

            expect(value).toEqual({ id: 1, value: 9000 });
        });

        it('throws an exception on a null "selector" function', () =>
        {
            expect(() => { col.maxBy(null); }).toThrow();
        });

        it('throws an exception on an empty collection', () =>
        {
            expect(() => { Linq.from([]).maxBy(x => x.value); }).toThrow();
        });
    });

    describe('orderBy', () =>
    {
        let col1 = Linq.from([2, 5, 1, 3, 4, 6]);
        let col2 = Linq.from([{ id: 3, value: 543 }, { id: 4, value: 956 }, { id: 1, value: 112 }, { id: 2, value: 456 }]);
        let col3 = Linq.from([{ id: 3, value: "c" }, { id: 4, value: "D" }, { id: 1, value: "a" }, { id: 2, value: "B" }]);

        let identityKeySelector = (x: any) => x;
        let keySelector = (x: any) => x.value;
        let selector = (x: any) => x.id;

        let comparer = (x: string, y: string) =>
        {
            let tempX = x.toLowerCase();
            let tempY = y.toLowerCase();

            if (tempX < tempY)
                return -1;
            else if (tempX > tempY)
                return 1;
            else
                return 0;
        };

        it('works with a given key selector', () =>
        {
            expect(col1.orderBy(identityKeySelector).toArray()).toEqual([1, 2, 3, 4, 5, 6]);
            expect(col1.orderBy(Linq.identity).toArray()).toEqual([1, 2, 3, 4, 5, 6]);
            expect(col2.orderBy(keySelector).select(selector).toArray()).toEqual([1, 2, 3, 4]);
        });

        it('works with string keys and no comparer passed', () =>
        {
            expect(col3.orderBy(keySelector).select(selector).toArray()).toEqual([2, 4, 1, 3]);
        });

        it('works with a comparer', () =>
        {
            expect(col3.orderBy(keySelector, comparer).select(selector).toArray()).toEqual([1, 2, 3, 4]);
        });

        it('throws an exception on a null key selector', () =>
        {
            expect(function () { col1.orderBy(null); }).toThrow();
        });
    });

    describe('orderByDescending', () =>
    {
        let col1 = Linq.from([2, 5, 1, 3, 4, 6]);
        let col2 = Linq.from([{ id: 3, value: 543 }, { id: 4, value: 956 }, { id: 1, value: 112 }, { id: 2, value: 456 }]);
        let col3 = Linq.from([{ id: 3, value: "c" }, { id: 4, value: "D" }, { id: 1, value: "a" }, { id: 2, value: "B" }]);

        let identityKeySelector = (x: any) => x;
        let keySelector = (x: any) => x.value;
        let selector = (x: any) => x.id;

        let comparer = function (x: string, y: string)
        {
            let tempX = x.toLowerCase();
            let tempY = y.toLowerCase();

            if (tempX < tempY)
                return -1;
            else if (tempX > tempY)
                return 1;
            else
                return 0;
        };

        it('works with a given key selector', () =>
        {
            expect(col1.orderByDescending(identityKeySelector).toArray()).toEqual([6, 5, 4, 3, 2, 1]);
            expect(col1.orderByDescending(Linq.identity).toArray()).toEqual([6, 5, 4, 3, 2, 1]);
            expect(col2.orderByDescending(keySelector).select(selector).toArray()).toEqual([4, 3, 2, 1]);
        });

        it('works with string keys and no comparer passed', () =>
        {
            expect(col3.orderByDescending(keySelector).select(selector).toArray()).toEqual([3, 1, 4, 2]);
        });

        it('works with a comparer', () =>
        {
            expect(col3.orderByDescending(keySelector, comparer).select(selector).toArray()).toEqual([4, 3, 2, 1]);
        });

        it('throws an exception on a null key selector', () =>
        {
            expect(() => { col1.orderByDescending(null); }).toThrow();
        });
    });

    describe('pad', () =>
    {
        let col = Linq.from([1, 2, 3, 4]);

        it('works on a non-empty collection', () =>
        {
            expect(col.pad(8, 0).toArray()).toEqual([1, 2, 3, 4, 0, 0, 0, 0]);
        });

        it('works on an empty collection', () =>
        {
            expect(Linq.from([]).pad(8, 'a').toArray()).toEqual(['a', 'a', 'a', 'a', 'a', 'a', 'a', 'a']);
        });

        it('works in a situation when no padding needs to occur', () =>
        {
            expect(col.pad(4, 99).toArray()).toEqual([1, 2, 3, 4]);
        });

        it('works with a null padding value', () =>
        {
            expect(col.pad(6, null).toArray()).toEqual([1, 2, 3, 4, null, null]);
        });
    });

    describe('padWith', () =>
    {
        let col = Linq.from([0, 1, 2, 3]);

        let padFunc = (i: number) => i * 10 + i;

        it('works on a non-empty collection', () =>
        {
            expect(col.padWith(8, padFunc).toArray()).toEqual([0, 1, 2, 3, 44, 55, 66, 77]);
        });

        it('works on an empty collection', () =>
        {
            expect(Linq.from([]).padWith(8, padFunc).toArray()).toEqual([0, 11, 22, 33, 44, 55, 66, 77]);
        });

        it('works in a situation where no padding needs to occur', () =>
        {
            expect(col.padWith(4, padFunc).toArray()).toEqual([0, 1, 2, 3]);
        });

        it('throws an exception on a null padding selector', () =>
        {
            expect(() => { col.padWith(8, null); }).toThrow();
        });
    });

    describe('pipe', () =>
    {
        let col1 = Linq.from([1, 2, 3, 4]);

        let obj1 = { val: 1, result: 0 },
            obj2 = { val: 2, result: 0 },
            obj3 = { val: 3, result: 0 };

        let col2 = Linq.from([obj1, obj2, obj3]);
        let arr1 = new Array<number>(),
            arr2 = new Array<number>(),
            arr3 = new Array<any>();

        it('works with a non-empty collection', () =>
        {
            expect(col1.pipe((x: any) => { arr1.push(x); }).toArray()).toEqual([1, 2, 3, 4]);
            expect(arr1).toEqual([1, 2, 3, 4]);

            expect(col1.pipe((x, i) => { arr2.push(i); }).toArray()).toEqual([1, 2, 3, 4]);
            expect(arr2).toEqual([0, 1, 2, 3]);
        });

        it('works with an empty collection', () =>
        {
            expect(Linq.from([]).pipe((x: any) => { arr3.push(x); }).toArray()).toEqual([]);
            expect(arr3).toEqual([]);
        });
    });

    describe('prepend', () =>
    {
        let col = Linq.from([2, 3, 4, 5, 6, 7]);

        it('works on a non-empty collection', () =>
        {
            expect(col.prepend(1).toArray()).toEqual([1, 2, 3, 4, 5, 6, 7]);
        });

        it('works on an empty collection', () =>
        {
            expect(Linq.from([]).prepend('a').toArray()).toEqual(['a']);
        });

        it('works with a null value to prepend', () =>
        {
            expect(col.prepend(null).toArray()).toEqual([null, 2, 3, 4, 5, 6, 7]);
        });
    });

    

    describe('select', () =>
    {
        let col = Linq.from([1, 2, 3, 4, 5]);

        it('works by itself', () =>
        { 
            let doubleCol = col.select((x: number) => x * 2);

            expect(doubleCol.toArray()).toEqual([2, 4, 6, 8, 10]); 
        });

        it('works in conjunction with "where"', function ()
        {
            let whereAndDouble = col.where((x: number) => x < 4).select((x: number) => x * 2);
            let whereAndDouble2 = col.where((x: number) => x < 4).select((x: number) => "a" + x);

            expect(whereAndDouble.toArray()).toEqual([2, 4, 6]);
            expect(whereAndDouble2.toArray()).toEqual(["a1", "a2", "a3"]);
        });

        it('throws an exception on null "selector" parameter', function ()
        {
            expect(function () { col.select(null); }).toThrow();
        });
    });

    describe('where', () =>
    {
        let col = Linq.from([1, 2, 3, 4, 5]);

        it('is correct with partitioned results', () =>
        { 
            var lessThan4 = col.where((x: number) => x < 4);

            expect(lessThan4.toArray()).toEqual([1, 2, 3]); 
        });

        it('is correct with empty results', () =>
        { 
            var none = col.where((x: number) => x < 0);

            expect(none.toArray()).toEqual([]); 
        });

        it('is correct with full results', function () 
        { 
            var all = col.where((x: number) => x > 0);

            expect(all.toArray()).toEqual([1, 2, 3, 4, 5]); 
        });

        it('throws an exception on a null "predicate" parameter', function () { expect(function () { col.where(null); }).toThrow(); });
    });
});