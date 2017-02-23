import { Linq, LinqCompatible } from "../jslinq"

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

        let mapToString = (xs: LinqCompatible<number>) => Linq.from(xs).select(x => x.toString()).toArray();
        let resultSelector = (x: string, y: string) => x + '_' + y;
        let mixedSelector = (x: any, y: any) => x + '_' + y;

        it('works on collections of the same size', () =>
        {
            let doubleMapper = (xs: Linq<string>) => xs.select(x => x + x);

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

    describe('select', () =>
    {
        let col = Linq.from([1, 2, 3, 4, 5]);

        it('works by itself', () =>
        { 
            let doubleCol = col.select(x => x * 2);

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