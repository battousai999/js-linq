describe('jslinq', function ()
{
    beforeEach(function ()
    {
        this.addMatchers({
            toEqualIgnoringOrder: function (arr)
            {
                var result = this.actual;

                if (arr == null || result == null || arr.length != result.length)
                    return false;

                var length = arr.length;

                for (var i = 0; i < length; i++)
                {
                    var found = false;

                    for (var j = 0; j < length; j++)
                    {
                        if (arr[i] == result[j])
                            found = true;
                    }

                    if (!found)
                        return false;
                }

                return true;
            }
        });
    });

    describe('from (constructor)', function ()
    {
        var arr = [1, 2, 3, 4, 5, 6];
        var col = linq.from(arr);
    
        it('returns an object', function () { expect(col).not.toBeNull(); });
        it('has the correct length', function () { expect(col.array.length).toEqual(arr.length); });
        
        it('has the correct elements', function () { expect(col.array).toEqual(arr); });
           
        it('contains a copy of the original array', function () { expect(col.array).not.toBe(arr); });
        it('can be empty', function () { expect(linq.from(null).array).toEqual([]); });        
    });
    
    describe('range (constructor)', function ()
    {
        var start = 1;
        var end = 11;
        var step = 3;
        var col1 = linq.range(start, end);
        var col2 = linq.range(start, end, step);
        
        it('returns an object', function ()
        {
            expect(col1).not.toBeNull();
            expect(col2).not.toBeNull();
        });
        
        it('has the correct length', function ()
        {
            var expectedLength = 0;
            
            for (var i = start; i < end; i += step) { expectedLength += 1; }
        
            expect(col1.array.length).toEqual(end - start + 1);
            expect(col2.array.length).toEqual(expectedLength);
        });
        
        it('throws exception on a null "from" parameter', function () { expect(function () { linq.range(null, end); }).toThrow(); });
        it('throws exception on a null "to" parameter', function () { expect(function () { linq.range(start, null); }).toThrow(); });
    });

    describe('repeat (constructor)', function () 
    {
        var repetitions = 3;
        var col = linq.repeat("stuff", repetitions);
        
        it('returns an object', function () { expect(col).not.toBeNull(); });
        it('has the correct length', function () { expect(col.array.length).toEqual(repetitions); });
        
        it('has the correct elements', function () 
        { 
            for (var i = 0; i < repetitions; i++)
            {
                expect(col.array[i]).toEqual("stuff");
            }
        });
    });
    
    describe('matches (constructor)', function ()
    {
        var col1 = linq.matches("this is a test", "\\w+");
        var col2 = linq.matches("this is another test", /\w+/);
        var col3 = linq.matches("test_1 TEST_2 test_3 TeSt_4", "test_\\d", "");
        var col4 = linq.matches("test_1 TEST_2 test_3 TeSt_4", "test_\\d", "i");
        
        it('returns an object', function ()
        {
            expect(col1).not.toBeNull();
            expect(col2).not.toBeNull();
            expect(col3).not.toBeNull();
            expect(col4).not.toBeNull();
        });
        
        it('has the correct elements', function () { expect(col1.array).toEqual(['this', 'is', 'a', 'test']); });
        it('works with a RegExp pattern', function () { expect(col2.array).toEqual(['this', 'is', 'another', 'test']); });
        it('defaults to a case-sensitive match', function () { expect(col3.array).toEqual(['test_1', 'test_3']); });
        it('honors a case-insensitive match', function () { expect(col4.array).toEqual(['test_1', 'TEST_2', 'test_3', 'TeSt_4']); });
        
        it('throws an exception on a null "pattern" parameter', function () { expect(function () { linq.matches('this is a test', null); }).toThrow(); });
        it('throws an exception on a non-string "text" parameter', function () { expect(function () { linq.matches(99, '\\w+'); }).toThrow(); });
    });
    
    describe('$linq (constructor)', function ()
    {
        var col1 = $linq([1, 2, 3, 4, 5]);
        var col2 = $linq(col1);
        
        it('returns an object', function () 
        {
            expect(col1).not.toBeNull();
        });
        
        it('can take an array as a parameter', function () { expect(col1.array).toEqual([1, 2, 3, 4, 5]); });
        it('can take another linq object as a parameter', function () { expect(col2.array).toEqual([1, 2, 3, 4, 5]); });
        
        it('can take a jQuery object as a parameter', function ()
        {
            var div = $('<div>');
            
            $('<span>').attr('id', 'construct_jquery_1').appendTo(div);
            $('<span>').attr('id', 'construct_jquery_2').appendTo(div);
            $('<span>').attr('id', 'construct_jquery_3').appendTo(div);
            $('<span>').attr('id', 'construct_jquery_4').appendTo(div);
            
            var spans = $('span', div);
            var col = $linq(spans);
            var results = [];
            
            for (var i = 0; i < col.array.length; i++)
            {
                results.push(col.array[i].id);
            }
            
            expect(results).toEqual(['construct_jquery_1', 'construct_jquery_2', 'construct_jquery_3', 'construct_jquery_4']);
        });
    });
    
    describe('lambda function construction', function ()
    {
        var col = $linq([1, 2, 3, 4, 5]);
       
        it('handles identity functions', function ()
        {
            var identity1 = col.select("x => x");
            var identity2 = col.select("$");

            expect(identity1.toArray()).toEqual([1, 2, 3, 4, 5]);
            expect(identity2.toArray()).toEqual([1, 2, 3, 4, 5]);
        });
        
        it('handles basic functions', function ()
        {
            var basic1 = col.select("x => x * 2");
            var basic2 = col.select("$ * 2");

            expect(basic1.toArray()).toEqual([2, 4, 6, 8, 10]);
            expect(basic2.toArray()).toEqual([2, 4, 6, 8, 10]);
        });
        
        it('handles comparer functions', function ()
        {
            var comparer1 = col.orderByDescending("x => x", "x, y => x - y");
            var comparer2 = col.orderByDescending("x => x", "(x, y) => x - y");
            var comparer3 = col.orderByDescending("$", "$ - $$");

            expect(comparer1.toArray()).toEqual([5, 4, 3, 2, 1]);
            expect(comparer2.toArray()).toEqual([5, 4, 3, 2, 1]);
            expect(comparer3.toArray()).toEqual([5, 4, 3, 2, 1]);
        });
    });

    describe('where', function ()
    {
        var col = $linq([1, 2, 3, 4, 5]);

        it('is correct with partitioned results', function () 
        { 
            var lessThan4 = col.where(function (x) { return x < 4; });

            expect(lessThan4.toArray()).toEqual([1, 2, 3]); 
        });

        it('is correct with empty results', function () 
        { 
            var none = col.where(function (x) { return x < 0; });

            expect(none.toArray()).toEqual([]); 
        });

        it('is correct with full results', function () 
        { 
            var all = col.where(function (x) { return x > 0; });

            expect(all.toArray()).toEqual([1, 2, 3, 4, 5]); 
        });

        it('works with lambda functions', function () 
        { 
            var lambda = col.where("x => x < 4");

            expect(lambda.toArray()).toEqual([1, 2, 3]); 
        });

        it('throws an exception on a null "predicate" parameter', function () { expect(function () { col.where(null); }).toThrow(); });
    });

    describe('select', function ()
    {
        var col = $linq([1, 2, 3, 4, 5]);

        it('works by itself', function () 
        { 
            var doubleCol = col.select(function (x) { return x * 2; });

            expect(doubleCol.toArray()).toEqual([2, 4, 6, 8, 10]); 
        });

        it('works in conjunction with "where"', function ()
        {
            var whereAndDouble = col.where(function (x) { return x < 4; }).select(function (x) { return x * 2; });
            var whereAndDouble2 = col.where(function (x) { return x < 4; }).select(function (x) { return "a" + x; });

            expect(whereAndDouble.toArray()).toEqual([2, 4, 6]);
            expect(whereAndDouble2.toArray()).toEqual(["a1", "a2", "a3"]);
        });

        it('works with lambda functions', function ()
        {
            var lambda = col.select("x => x * 2");

            expect(lambda.toArray()).toEqual([2, 4, 6, 8, 10]);
        });

        it('throws an exception on null "selector" parameter', function ()
        {
            expect(function () { col.select(null); }).toThrow();
        });
    });

    describe('count', function ()
    {
        var col = $linq([1, 2, 3, 4, 5, 6, 7, 8]);

        it('works without a predicate', function () { expect(col.count()).toEqual(8); });
        it('works with a predicate', function () { expect(col.count(function (x) { return x % 2 == 0; })).toEqual(4); });
        it('works with a lambda predicate', function () { expect(col.count('x => x % 2 == 0')).toEqual(4); });

        it('throws an exception on non-function "predicate" parameter', function ()
        {
            expect(function () { col.count(99); }).toThrow();
        });
    });

    describe('selectMany', function ()
    {
        var col = $linq([{ str: "test", list: [1, 2, 3] }, { str: "part", list: [4, 5, 6] }, { str: "time", list: [7, 8, 9] }]);

        it('works with a projection', function ()
        {
            var projection = col.selectMany(function (x) { return x.list; }, function (x) { return "a" + x; });

            expect(projection.toArray()).toEqualIgnoringOrder(["a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8", "a9"]);
        });

        it('works with a projection and an index', function ()
        {
            var projectionAndIndex = col.selectMany(
                function (x, i) { var l = x.list.slice(0); l.push((i + 1) * 10); return l; },
                function (x) { return "b" + x; });

            var projectionAndIndex2 = col.selectMany(
                function (x, i) { var l = x.list.slice(0); l.push((i + 1) * 10); return l; },
                function (x, parent) { return parent.str + "-" + "b" + x; });

            expect(projectionAndIndex.toArray()).toEqualIgnoringOrder(["b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "b10", "b20", "b30"]);
            expect(projectionAndIndex2.toArray()).toEqualIgnoringOrder(["test-b1", "test-b2", "test-b3", "part-b4", "part-b5", "part-b6", "time-b7", "time-b8", "time-b9", "test-b10", "part-b20", "time-b30"]);
        });

        it('works with an embedded $linq within the projection', function ()
        {
            var linqInLinq = col.selectMany(
                function (x) { return $linq(x.list).where(function (x) { return x % 2 == 0; }); },
                function (x) { return "c" + x; });

            expect(linqInLinq.toArray()).toEqualIgnoringOrder(["c2", "c4", "c6", "c8"]);
        });

        it('works with a lambda projection', function ()
        {
            var lambda = col.selectMany("x => x.list", "x => 'a' + x");

            expect(lambda.toArray()).toEqualIgnoringOrder(["a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8", "a9"]);
        });

        it('throws an exception on null "collection selector" parameter', function ()
        {
            expect(function () { col.selectMany(null); }).toThrow();
        });

        it('throws an exception on non-function "result selector" parameter', function ()
        {
            expect(function () { col.selectMany(function () { }, 99); }).toThrow();
        });
    });

    describe('any', function ()
    {
        var col = $linq([2, 4, 6, 8]);

        it('works without a predicate', function ()
        {
            var basicAny = col.any();
            var basicNotAny = $linq([]).any();

            expect(basicAny).toBeTruthy();
            expect(basicNotAny).toBeFalsy();
        });

        it('works with a predicate', function ()
        {
            var anyEven = col.any(function (x) { return x % 2 == 0; });
            var anyOdd = col.any(function (x) { return x % 2 == 1; });

            expect(anyEven).toBeTruthy();
            expect(anyOdd).toBeFalsy();
        });

        it('works with a lambda predicate', function ()
        {
            var lambda = col.any("x => x % 2 == 0");

            expect(lambda).toBeTruthy();
        });

        it('throws an exception on non-function "predicate" parameter', function ()
        {
            expect(function () { col.any(99); }).toThrow();
        });
    });

    describe('all', function ()
    {
        var allEvenCol = $linq([2, 4, 6, 8]);
        var mixedCol = $linq([1, 2, 3, 4, 5, 6]);

        it('works with a predicate', function ()
        {
            var allEven1 = allEvenCol.all(function (x) { return x % 2 == 0; });
            var allEven2 = mixedCol.all(function (x) { return x % 2 == 0; });
            var emptyCol = $linq([]).all(function (x) { return x % 2 == 0; });

            expect(allEven1).toBeTruthy();
            expect(allEven2).toBeFalsy();
            expect(emptyCol).toBeTruthy();
        });

        it('works with a lambda predicate', function ()
        {
            var lambda = allEvenCol.all("x => x % 2 == 0");

            expect(lambda).toBeTruthy();
        });

        it('throws an exception on null "predicate" parameter', function ()
        {
            expect(function () { mixedCol.all(null); }).toThrow();
        });
    });

    describe('first', function ()
    {
        var col = $linq([1, 2, 3, 4, 5, 6]);

        it('works with a predicate', function ()
        {
            var predicateFirst = col.first(function (x) { return x > 3; });

            expect(predicateFirst).toEqual(4);
        });

        it('works without a predicate', function ()
        {
            var basicFirst = col.first();

            expect(basicFirst).toEqual(1);
        });

        it('works with a lambda predicate', function ()
        {
            var lambda = col.first("x => x > 3");

            expect(lambda).toEqual(4);
        });

        it('throws an exception on non-function "predicate" parameter', function ()
        {
            expect(function () { col.first(99); }).toThrow();
        });
    });

    describe('firstOrDefault', function ()
    {
        var col = $linq([1, 2, 3, 4, 5, 6]);

        it('works with a predicate', function ()
        {
            var defaultFirst1 = col.firstOrDefault(99, function (x) { return x > 3; });
            var defaultFirst2 = col.firstOrDefault(99, function (x) { x > 100; });

            expect(defaultFirst1).toEqual(4);
            expect(defaultFirst2).toEqual(99);
        });

        it('works without a predicate', function ()
        {
            var defaultFirst1 = col.firstOrDefault(99);
            var defaultFirst2 = $linq([]).firstOrDefault(99);

            expect(defaultFirst1).toEqual(1);
            expect(defaultFirst2).toEqual(99);
        });

        it('works with a lambda predicate', function ()
        {
            var lambda = col.firstOrDefault(99, "x => x > 3");

            expect(lambda).toEqual(4);
        });

        it('throws an exception on non-function "predicate" parameter', function ()
        {
            expect(function () { col.firstOrDefault(99, 99); }).toThrow();
        });
    });
});