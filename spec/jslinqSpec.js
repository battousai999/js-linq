describe('jslinq', function ()
{
    beforeEach(function ()
    {
		jasmine.addMatchers({
			toEqualIgnoringOrder: function (util, customEqualityTesters)
			{
				return {
					compare: function (actual, expected)
					{
						if (expected == null || actual == null || expected.length != actual.length)
							return false;
						
						var length = expected.length;
						
						for (var i = 0; i < length; i++)
						{
							var found = false;
							
							for (var j = 0; j < length; j++)
							{
								if (expected[i] == actual[j])
									found = true;
							}
							
							if (!found)
								return { pass: false };
						}
						
						return { pass: true };
					}
				};
			}
		});
    });

    describe('from (constructor)', function ()
    {
        var arr = [1, 2, 3, 4, 5, 6];
        var col = linq.from(arr);

        var div = $('#divTest');
        
        $('<span>').attr('id', 'test_jquery_1').appendTo(div);
        $('<span>').attr('id', 'test_jquery_2').appendTo(div);
        $('<span>').attr('id', 'test_jquery_3').appendTo(div);
        $('<span>').attr('id', 'test_jquery_4').appendTo(div);

        var spans = $('span', div);
    
        it('returns an object', function () { expect(col).not.toBeNull(); });
        it('has the correct length', function () { expect(col.array.length).toEqual(arr.length); });
        
        it('has the correct elements', function () { expect(col.array).toEqual(arr); });
           
        it('contains a copy of the original array', function () { expect(col.array).not.toBe(arr); });

        it('can accept a null', function () { expect(linq.from(null).array).toEqual([]); });
        it('can accept another linq object', function () { expect(linq.from($linq(arr)).array).toEqual(arr); });
        it('can accept a jQuery object', function () { expect(linq.from(spans).array).toEqual(spans.get()); });
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

        it('throws an exception on a non-function "predicate" parameter', function ()
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

        it('throws an exception on a non-function "result selector" parameter', function ()
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

        it('throws an exception on a non-function "predicate" parameter', function ()
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

        it('throws an exception on a non-function "predicate" parameter', function ()
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
            var defaultFirst2 = col.firstOrDefault(99, function (x) { return x > 100; });

            expect(defaultFirst1).toEqual(4);
            expect(defaultFirst2).toEqual(99);
        });
		
		it('works with only a predicate', function ()
		{
			var defaultFirst3 = col.firstOrDefault(function (x) { return x > 4; });
			var defaultFirst4 = col.firstOrDefault(function (x) { return x > 100; });

			expect(defaultFirst3).toEqual(5);
			expect(defaultFirst4).toBeNull();
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
            var value1 = col.firstOrDefault(99, "x => x > 3");
            var value2 = col.firstOrDefault(99, "x => x > 100");

            expect(value1).toEqual(4);
            expect(value2).toEqual(99);
        });

        it('throws an exception on a non-function "predicate" parameter', function ()
        {
            expect(function () { col.firstOrDefault(99, 99); }).toThrow();
        });
    });

    describe('single', function ()
    {
        var col = $linq([1, 2, 3, 4, 5]);

        it('works with a predicate', function ()
        {
            var value = col.single(function (x) { return x > 4; });

            expect(value).toEqual(5);
        });

        it('works without a predicate', function ()
        {
            var value = $linq([1]).single();

            expect(value).toEqual(1);
        });

        it('works with a lambda predicate', function ()
        {
            var value = col.single("x => x > 4");

            expect(value).toEqual(5);
        });

        it('throws an exception on a non-function "predicate" parameter', function ()
        {
            expect(function () { col.single(99); }).toThrow();
        });

        it('throws an exception when called on an empty collection', function ()
        {
            var empty = $linq([]);
            var func = function (x) { return x > 100; };

            expect(function () { empty.single(); }).toThrow();
            expect(function () { empty.single(function (x) { return x > 100; }); }).toThrow();
        });

        it('throws an exception when no elements in the collection satisfy the predicate', function ()
        {
            expect(function () { col.single(function (x) { return x > 100; }); }).toThrow();
        });

        it('throws an exception when called on a collection with more than one element (and no predicate)', function ()
        {
            expect(function () { col.single(); }).toThrow();
        });

        it('throws an exception when multiple elements in the collection satisfy the predicate', function ()
        {
            expect(function () { col.single(function (x) { return x > 1; }); }).toThrow();
        });
    });

    describe('singleOrDefault', function ()
    {
        var col = $linq([1, 2, 3, 4, 5]);

        it('works with a predicate', function ()
        {
            var value1 = col.singleOrDefault(99, function (x) { return x > 4; });
            var value2 = col.singleOrDefault(99, function (x) { return x > 100; });

            expect(value1).toEqual(5);
            expect(value2).toEqual(99);
        });

        it('works without a predicate', function ()
        {
            var value1 = $linq([1]).singleOrDefault(99);
            var value2 = $linq([]).singleOrDefault(99);

            expect(value1).toEqual(1);
            expect(value2).toEqual(99);
        });

        it('works with a lambda predicate', function ()
        {
            var value1 = col.singleOrDefault(99, "x => x > 4");
            var value2 = col.singleOrDefault(99, "x => x > 100");

            expect(value1).toEqual(5);
            expect(value2).toEqual(99);
        });

        it('throws an exception on a non-function "predicate" parameter', function ()
        {
            expect(function () { col.singleOrDefault(99, 99); }).toThrow();
        });

        it('throws an exception when called on a collection with more than one element (and no predicate)', function ()
        {
            expect(function () { col.singleOrDefault(99); }).toThrow();
        });

        it('throws an exception when multple elements in the collection satisfy the predicate', function ()
        {
            expect(function () { col.singleOrDefault(99, function (x) { return x > 1; }); }).toThrow();
        });
    });

    describe('last', function ()
    {
        var col = $linq([1, 2, 3, 4, 5, 6]);

        it('works with a predicate', function ()
        {
            var predicateFirst = col.last(function (x) { return x < 4; });

            expect(predicateFirst).toEqual(3);
        });

        it('works without a predicate', function ()
        {
            var basicFirst = col.last();

            expect(basicFirst).toEqual(6);
        });

        it('works with a lambda predicate', function ()
        {
            var lambda = col.last("x => x < 4");

            expect(lambda).toEqual(3);
        });

        it('throws an exception on a non-function "predicate" parameter', function ()
        {
            expect(function () { col.last(99); }).toThrow();
        });
    });

    describe('lastOrDefault', function ()
    {
        var col = $linq([1, 2, 3, 4, 5, 6]);

        it('works with a predicate', function ()
        {
            var defaultFirst1 = col.lastOrDefault(99, function (x) { return x < 4; });
            var defaultFirst2 = col.lastOrDefault(99, function (x) { x > 100; });

            expect(defaultFirst1).toEqual(3);
            expect(defaultFirst2).toEqual(99);
        });

        it('works without a predicate', function ()
        {
            var defaultFirst1 = col.lastOrDefault(99);
            var defaultFirst2 = $linq([]).lastOrDefault(99);

            expect(defaultFirst1).toEqual(6);
            expect(defaultFirst2).toEqual(99);
        });

        it('works with a lambda predicate', function ()
        {
            var value1 = col.lastOrDefault(99, "x => x < 4");
            var value2 = col.lastOrDefault(99, "x => x > 100");

            expect(value1).toEqual(3);
            expect(value2).toEqual(99);
        });

        it('throws an exception on a non-function "predicate" parameter', function ()
        {
            expect(function () { col.lastOrDefault(99, 99); }).toThrow();
        });
    });

    describe('defaultIfEmpty', function ()
    {
        it('works on an empty collection', function ()
        {
            var value = $linq([1, 2, 3, 4]).defaultIfEmpty(99).toArray();

            expect(value).toEqual([1, 2, 3, 4]);
        });

        it('works on a non-empty collection', function ()
        {
            var value = $linq([]).defaultIfEmpty(99).toArray();

            expect(value).toEqual([99]);
        });

        it('works with a null "defaultValue" parameter', function ()
        {
            var value = $linq([]).defaultIfEmpty(null).toArray();

            expect(value).toEqual([null]);
        });
    });

    describe('distinct', function ()
    {
        var col = $linq(["one", "two", "three", "ONE", "TWO", "THREE"]);

        it('works when there are duplicate elements', function ()
        {
            var value1 = $linq([1, 2, 3, 4, 5, 1, 2, 3, 4, 5]).distinct().toArray();
            var value2 = col.distinct(function (x, y) { return x.toLowerCase() == y.toLowerCase(); }).toArray();

            expect(value1).toEqual([1, 2, 3, 4, 5]);
            expect(value2).toEqual(["one", "two", "three"]);
        });

        it('works when there are no duplicate elements', function ()
        {
            var value1 = $linq([1, 2, 3, 4, 5]).distinct().toArray();
            var value2 = col.distinct(function (x, y) { return x == y; }).toArray();

            expect(value1).toEqual([1, 2, 3, 4, 5]);
            expect(value2).toEqual(["one", "two", "three", "ONE", "TWO", "THREE"]);
        });

        it('works on an empty collection', function ()
        {
            var value = $linq([]).distinct().toArray();

            expect(value).toEqual([]);
        });

        it('works with a lambda comparer', function ()
        {
            var value = col.distinct("(x, y) => x == y").toArray();

            expect(value).toEqual(["one", "two", "three", "ONE", "TWO", "THREE"]);
        });

        it('throws an exception on a non-function "comparer" parameter', function ()
        {
            expect(function () { col.distinct(99); }).toThrow();
        });
    });

    describe('distinctBy', function ()
    {
        var col1 = $linq([{ id: 1, name: 'steve' }, { id: 2, name: 'barbara' }, { id: 3, name: 'david' }, { id: 4, name: 'steve' }]);
        var col2 = $linq([{ id: 1, name: 'steve' }, { id: 2, name: 'barbara' }, { id: 3, name: 'david' }, { id: 4, name: 'STEVE' }]);

        var nameProjection = function (x) { return x.name; };
        var idProjection = function (x) { return x.id; };

        it('works when there are duplicate elements', function ()
        {
            var value1 = col1
                .distinctBy(nameProjection)
                .select(idProjection)
                .toArray();

            var value2 = col2
                .distinctBy(nameProjection, function (x, y) { return x.toLowerCase() == y.toLowerCase(); })
                .select(idProjection)
                .toArray();

            expect(value1).toEqual([1, 2, 3]);
            expect(value2).toEqual([1, 2, 3]);
        });

        it('works when there are no duplicate elements', function ()
        {
            var value1 = col1
                .distinctBy(idProjection)
                .select(idProjection)
                .toArray();

            var value2 = col2
                .distinctBy(nameProjection, function (x, y) { return x == y; })
                .select(idProjection)
                .toArray();

            expect(value1).toEqual([1, 2, 3, 4]);
            expect(value2).toEqual([1, 2, 3, 4]);
        });

        it('works on an empty collection', function ()
        {
            var value = $linq([])
                .distinctBy(idProjection)
                .toArray();

            expect(value).toEqual([]);
        });

        it('works with a lambda projection and comparer', function ()
        {
            var value = col2
                .distinctBy("x => x.name", "(x, y) => x == y")
                .select(idProjection)
                .toArray();

            expect(value).toEqual([1, 2, 3, 4]);
        });

        it('throws an exception on a non-function "key selector" parameter', function ()
        {
            expect(function () { col1.distinctBy(99); }).toThrow();
        });

        it('throws an exception on a non-function "comparer" parameter', function ()
        {
            expect(function () { col1.distinctBy(nameProjection, 99); }).toThrow();
        });
    });

    describe('union', function ()
    {
        var col1 = $linq([1, 2, 3, 4]);
        var col2 = $linq([5, 6, 7, 8]);
        var col3 = $linq(["one", "two", "three", "three", "four"]);
        var col4 = $linq(["ONE", "TWO", "TWO", "THREE"]);

        it('works with distinct elements in the sets', function ()
        {
            var value1 = col1.union(col2).toArray();
            var value2 = col1.union([11, 22, 33, 44]).toArray();

            expect(value1).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
            expect(value2).toEqual([1, 2, 3, 4, 11, 22, 33, 44]);
        });

        it('works with non-distinct elements in the sets', function ()
        {
            var value1 = col1.union([3, 4, 5, 6]).toArray();
            var value2 = col3.union(col4).toArray();

            expect(value1).toEqual([1, 2, 3, 4, 5, 6]);
            expect(value2).toEqual(["one", "two", "three", "four", "ONE", "TWO", "THREE"]);
        });

        it('works with a comparer', function ()
        {
            var value = col3.union(col4, function (x, y) { return x.toLowerCase() == y.toLowerCase(); }).toArray();

            expect(value).toEqual(["one", "two", "three", "four"]);
        });

        it('works with a lambda comparer', function ()
        {
            var value = col3.union(col4, "(x, y) => x.toLowerCase() == y.toLowerCase()").toArray();

            expect(value).toEqual(["one", "two", "three", "four"]);
        });

        it('works with an empty collection', function ()
        {
            var value1 = col1.union([]).toArray();
            var value2 = $linq([]).union(col2).toArray();

            expect(value1).toEqual([1, 2, 3, 4]);
            expect(value2).toEqual([5, 6, 7, 8]);
        });

        it('works with a null second collection', function ()
        {
            var value = col1.union(null).toArray();

            expect(value).toEqual([1, 2, 3, 4]);
        });

        it('throws an exception on a non-function "comparer" parameter', function ()
        {
            expect(function () { col1.union(col2, 99); }).toThrow();
        });
    });

    describe('intersect', function ()
    {
        var col1 = $linq([1, 2, 3, 4]);
        var col2 = $linq([1, 2, 3, 4, 5, 6, 7, 8]);
        var col3 = $linq([5, 6, 7, 8]);
        var col4 = $linq(["one", "two", "three", "three", "four"]);
        var col5 = $linq(["ONE", "TWO", "TWO", "THREE"]);

        it('works when there are duplicates between the sets', function ()
        {
            var value1 = col1.intersect(col2).toArray();
            var value2 = col2.intersect(col3).toArray();
            var value3 = col2.intersect([2, 4, 6, 100]).toArray();

            expect(value1).toEqual([1, 2, 3, 4]);
            expect(value2).toEqual([5, 6, 7, 8]);
            expect(value3).toEqual([2, 4, 6]);
        });

        it('works when there are no duplicates between the sets', function ()
        {
            var value1 = col1.intersect([5, 6, 7, 8]).toArray();
            var value2 = col4.intersect(col5).toArray();

            expect(value1).toEqual([]);
            expect(value2).toEqual([]);
        });

        it('works with an empty collection', function ()
        {
            var empty = $linq([]);

            var value1 = col1.intersect(empty).toArray();
            var value2 = empty.intersect(col2).toArray();
            var value3 = empty.intersect([]).toArray();

            expect(value1).toEqual([]);
            expect(value2).toEqual([]);
            expect(value3).toEqual([]);
        });

        it('works with a null second collection', function ()
        {
            var value = col1.intersect(null).toArray();

            expect(value).toEqual([]);
        });

        it('works with a comparer', function ()
        {
            var value1 = col4.intersect(col5, function (x, y) { return x == y; }).toArray();
            var value2 = col4.intersect(col5, function (x, y) { return x.toLowerCase() == y.toLowerCase(); }).toArray();

            expect(value1).toEqual([]);
            expect(value2).toEqual(["one", "two", "three"]);
        });

        it('works with a lambda comparer', function ()
        {
            var value = col4.intersect(col5, "(x, y) => x.toLowerCase() == y.toLowerCase()").toArray();

            expect(value).toEqual(["one", "two", "three"]);
        });

        it('throws an exception on a non-function "comparer" parameter', function ()
        {
            expect(function () { col1.intersect(col2, 99); }).toThrow();
        });
    });

    describe('except', function ()
    {
        var col1 = $linq([1, 2, 3, 4]);
        var col2 = $linq([3, 4, 5, 6]);
        var col3 = $linq(["one", "two", "two", "three", "four"]);
        var col4 = $linq(["three", "three", "four", "five", "six"]);
        var col5 = $linq(["THREE", "FOUR", "FIVE", "SIX"]);
        var col6 = $linq([1, 2, 3, 4, 1, 2, 3]);

        it('works when there are duplicates within the first set', function ()
        {
            var value = col6.except(col2).toArray();

            expect(value).toEqual([1, 2]);
        });

        it('works when there are duplicates between the sets', function ()
        {
            var value1 = col1.except(col2).toArray();
            var value2 = col2.except(col1).toArray();
            var value3 = col1.except([1, 2, 3, 4]).toArray();

            expect(value1).toEqual([1, 2]);
            expect(value2).toEqual([5, 6]);
            expect(value3).toEqual([]);
        });

        it('works when there are no duplicates between the sets', function ()
        {
            var value1 = col1.except([10, 11, 12, 13]).toArray();
            var value2 = col1.except([]).toArray();

            expect(value1).toEqual([1, 2, 3, 4]);
            expect(value2).toEqual([1, 2, 3, 4]);
        });

        it('works with an empty collection', function ()
        {
            var value = $linq([]).except(col1).toArray();

            expect(value).toEqual([]);
        });

        it('works with a null second collection', function ()
        {
            var value = col1.except(null).toArray();

            expect(value).toEqual([1, 2, 3, 4]);
        });

        it('works with a comparer', function ()
        {
            var value1 = col3.except(col4, function (x, y) { return x == y; }).toArray();
            var value2 = col3.except(col5, function (x, y) { return x.toLowerCase() == y.toLowerCase(); }).toArray();

            expect(value1).toEqual(["one", "two"]);
            expect(value2).toEqual(["one", "two"]);
        });

        it('works with a lambda comparer', function ()
        {
            var value = col3.except(col4, "(x, y) => x == y").toArray();

            expect(value).toEqual(["one", "two"]);
        });

        it('throws an exception on a non-function "comparer" parameter', function ()
        {
            expect(function () { col1.except(col2, 99); }).toThrow();
        });
    });

    describe('join', function ()
    {
        var col1 = $linq([{ id: 1, name: 'steve', color: 'blue' }, { id: 2, name: 'paul', color: 'red' }, { id: 3, name: 'eve', color: 'pink' }, { id: 4, name: 'zoe', color: 'yellow' }]);
        var col2 = $linq([{ personId: 1, make: 'Honda', model: 'Civic' },
            { personId: 2, make: 'Toyota', model: 'Camry' },
            { personId: 2, make: 'Acura', model: 'TL' },
            { personId: 3, make: 'Ford', model: 'Focus' }]);
        var col3 = $linq([{ color: 'blue', trait: 'reliable' }, { color: 'BLUE', trait: 'sincere' },
            { color: 'red', trait: 'courageous' }, { color: 'RED', trait: 'confident' },
            { color: 'green', trait: 'practical' }, { color: 'GREEN', trait: 'intelligent' },
            { color: 'pink', trait: 'friendly' }, { color: 'PINK', trait: 'sensitive' },
            { color: 'yellow', trait: 'happy' }, { color: 'YELLOW', trait: 'impulsive' }]);

        var carFunc = function (outer, inner) { return outer.name + ': ' + inner.make + ' ' + inner.model; };

        it('works on a join that should return results', function ()
        {
            var value = col1.join(col2,
                function (x) { return x.id; },
                function (x) { return x.personId; },
                carFunc);

            expect(value.toArray()).toEqual(["steve: Honda Civic", "paul: Toyota Camry", "paul: Acura TL", "eve: Ford Focus"]);
        });

        it('works on a join that should not return results', function ()
        {
            var value = col1.join(col2,
                function (x) { return x.id * 10; },
                function (x) { return x.personId; },
                carFunc);

            expect(value.toArray()).toEqual([]);
        });

        it('works with an array', function ()
        {
            var value = col1.join([{ personId: 2, make: 'Lexus', model: 'LS' }],
                function (x) { return x.id; },
                function (x) { return x.personId; },
                carFunc);

            expect(value.toArray()).toEqual(["paul: Lexus LS"]);
        });

        it('works with empty sources', function ()
        {
            var onEmpty = $linq([]).join(col2,
                function (x) { return x.id; },
                function (x) { return x.personId; },
                carFunc);

            var withEmpty = col1.join([],
                function (x) { return x.id; },
                function (x) { return x.personId; },
                carFunc);

            expect(onEmpty.toArray()).toEqual([]);
            expect(withEmpty.toArray()).toEqual([]);
        });

        it('works with a comparer', function ()
        {
            var value = col1.join(col3,
                function (x) { return x.color; },
                function (x) { return x.color; },
                function (outer, inner) { return outer.name + ': ' + inner.trait; },
                function (x, y) { return x.toLowerCase() == y.toLowerCase(); });

            expect(value.toArray()).toEqual(["steve: reliable", "steve: sincere", "paul: courageous", "paul: confident", "eve: friendly", "eve: sensitive", "zoe: happy", "zoe: impulsive"]);
        });

        it('works with a lambda comparer', function ()
        {
            var value = col1.join(col2, "x => x.id", "x => x.personId", carFunc);

            expect(value.toArray()).toEqual(["steve: Honda Civic", "paul: Toyota Camry", "paul: Acura TL", "eve: Ford Focus"]);
        });

        it('throws an exception on a null "inner" parameter', function ()
        {
            expect(function () { col1.join(null, function (x) { return x.id; }, function (x) { return x.id; }, function (x, y) { return null; }); }).toThrow();
        });

        it('throws an exception on a non-function "key comparer" parameter', function ()
        {
            expect(function () { col1.join(col2, function (x) { return x.id; }, function (x) { return x.personId; }, function (x, y) { return null; }, 99); }).toThrow();
        });

        it('throws an exception on a null "outer selector" parameter', function ()
        {
            expect(function () { col1.join(col2, null, function (x) { return x.personId; }, function (x, y) { return null; }); }).toThrow();
        });

        it('throws an exception on a null "inner selector" parameter', function ()
        {
            expect(function () { col1.join(col2, function (x) { return x.id; }, null, function (x, y) { return null; }); }).toThrow();
        });

        it('throws an exception on a null "result selector" parameter', function ()
        {
            expect(function () { col1.join(col2, function (x) { return x.id; }, function (x) { return x.personId; }, null); }).toThrow();
        });
    });

    describe('groupBy', function ()
    {
        var col1 = $linq([{ name: 'steve', state: 'ut' }, { name: 'john', state: 'ut' }, { name: 'kelly', state: 'nv' }, { name: 'abbey', state: 'wa' }]);
        var col2 = $linq(['apple', 'carrot', 'corn', 'tomato', 'watermellon', 'watercrest']);
        var col3 = $linq([{ name: 'kevin', state: 'UT' }, { name: 'spencer', state: 'ut' }, { name: 'glenda', state: 'co' }, { name: 'may', state: 'CO' }]);

        var stateProjection = function (x) { return x.state; };
        var groupSelector = function (x) { return x.key + ': ' + x.values.join(','); };
        var nameSelector = function (x) { return x.name; };

        it('returns grouped results', function ()
        {
            var value = col1.groupBy(stateProjection, nameSelector).select(groupSelector);

            expect(value.toArray()).toEqual(["ut: steve,john", "nv: kelly", "wa: abbey"]);
        });

        it('works with no element selector', function ()
        {
            var value = col2.groupBy(function (x) { return (x == null || x.length == 0 ? '' : x[0]); }).select(groupSelector);

            expect(value.toArray()).toEqual(["a: apple", "c: carrot,corn", "t: tomato", "w: watermellon,watercrest"]);
        });

        it('works on an empty collection', function ()
        {
            var value = $linq([]).groupBy(stateProjection, nameSelector);

            expect(value.toArray()).toEqual([]);
        });

        it('works with a comparer', function ()
        {
            var value = col3.groupBy(stateProjection, nameSelector, function (x, y) { return x.toLowerCase() == y.toLowerCase(); }).select(groupSelector);

            expect(value.toArray()).toEqual(["UT: kevin,spencer", "co: glenda,may"]);
        });

        it('works with a lambda comparer', function ()
        {
            var value = col3.groupBy("x => x.state", "x => x.name", "x, y => x.toLowerCase() == y.toLowerCase()").select(groupSelector);

            expect(value.toArray()).toEqual(["UT: kevin,spencer", "co: glenda,may"]);
        });

        it('throws an exception on a null "key selector" parameter', function ()
        {
            expect(function () { col1.groupBy(null); }).toThrow();
        });

        it('throws an exception on a non-function "element selector" parameter', function ()
        {
            expect(function () { col1.groupBy(stateProjection, 99); }).toThrow();
        });

        it('throws an exception on a non-function "key selector" parmeter', function ()
        {
            expect(function () { col1.groupBy(stateProjection, null, 99); }).toThrow();
        });
    });

    describe("groupJoin", function ()
    {
        var col1 = $linq([{ id: 1, name: 'steve', color: 'blue' },
            { id: 2, name: 'paul', color: 'red' },
            { id: 3, name: 'eve', color: 'pink' },
            { id: 4, name: 'zoe', color: 'grey' }]);
        var col2 = $linq([{ personId: 1, make: 'Honda', model: 'Civic' },
            { personId: 2, make: 'Toyota', model: 'Camry' },
            { personId: 2, make: 'Acura', model: 'TL' },
            { personId: 3, make: 'Ford', model: 'Focus' }]);
        var col3 = $linq([{ color: 'blue', trait: 'reliable' }, { color: 'BLUE', trait: 'sincere' },
            { color: 'red', trait: 'courageous' }, { color: 'RED', trait: 'confident' },
            { color: 'green', trait: 'practical' }, { color: 'GREEN', trait: 'intelligent' },
            { color: 'pink', trait: 'friendly' }, { color: 'PINK', trait: 'sensitive' },
            { color: 'yellow', trait: 'happy' }, { color: 'YELLOW', trait: 'impulsive' }]);

        var carFunc = function (outer, inner)
        {
            if (inner.length == 0)
                return outer.name + ': <none>';
            else
                return outer.name + ': ' + $linq(inner).select(function (x) { return x.make + ' ' + x.model; }).toArray().join(', ');
        };

        var idProjection = function (x) { return x.id; };
        var personIdProjection = function (x) { return x.personId; };

        it('works on a join that should return results', function ()
        {
            var value = col1.groupJoin(col2, idProjection, personIdProjection, carFunc).toArray();

            expect(value).toEqual(["steve: Honda Civic", "paul: Toyota Camry, Acura TL", "eve: Ford Focus", "zoe: <none>"]);
        });

        it('works with an array', function ()
        {
            var value = col1.groupJoin([{ personId: 2, make: 'Lexus', model: 'LS' }], idProjection, personIdProjection, carFunc).toArray();

            expect(value).toEqual(["steve: <none>", "paul: Lexus LS", "eve: <none>", "zoe: <none>"]);
        });

        it('works with empty sources', function ()
        {
            var onEmpty = $linq([]).groupJoin(col2, idProjection, personIdProjection, carFunc).toArray();
            var withEmpty = col1.groupJoin([], idProjection, personIdProjection, carFunc).toArray();

            expect(onEmpty).toEqual([]);
            expect(withEmpty).toEqual(["steve: <none>", "paul: <none>", "eve: <none>", "zoe: <none>"]);
        });

        it('works with a comparer', function ()
        {
            var colorProjection = function (x) { return x.color; };

            var value = col1.groupJoin(col3,
                colorProjection,
                colorProjection,
                function (outer, inner)
                {
                    if (inner.length == 0)
                        return outer.name + ': <none>';
                    else
                        return outer.name + ': ' + $linq(inner).select(function (x) { return x.trait; }).toArray().join(', ');
                },
                function (x, y) { return x.toLowerCase() == y.toLowerCase(); })
                .toArray();

            expect(value).toEqual(["steve: reliable, sincere", "paul: courageous, confident", "eve: friendly, sensitive", "zoe: <none>"]);
        });

        it('works with a lambda functions', function ()
        {
            var value = col1.groupJoin(col2, "x => x.id", "x => x.personId", carFunc).toArray();

            expect(value).toEqual(["steve: Honda Civic", "paul: Toyota Camry, Acura TL", "eve: Ford Focus", "zoe: <none>"]);
        });

        it('throws an exception on a null "inner" parameter', function ()
        {
            expect(function () { col1.groupJoin(null, idProjection, personIdProjection, carFunc); }).toThrow();
        });

        it('throws an exception on a non-function "key comparer" parameter', function ()
        {
            expect(function () { col1.groupJoin(col2, idProjection, personIdProjection, carFunc, 99); }).toThrow();
        });

        it('throws an exception on a null "outer selector" parameter', function ()
        {
            expect(function () { col1.groupJoin(col2, null, personIdProjection, carFunc); }).toThrow();
        });

        it('throws an exception on a null "inner selector" parameter', function ()
        {
            expect(function () { col1.groupJoin(col2, idProjection, null, carFunc); }).toThrow();
        });

        it('throws an exception on a null "result selector" parameter', function ()
        {
            expect(function () { col1.groupJoin(col2, idProjection, personIdProjection, null); }).toThrow();
        });
    });

    describe('take', function ()
    {
        var col1 = $linq([1, 2, 3, 4, 5, 6, 7, 8]);

        it('works when taking fewer elements than in the collection', function ()
        {
            var value = col1.take(4).toArray();

            expect(value).toEqual([1, 2, 3, 4]);
        });

        it('works when taking more elements than in the collection', function ()
        {
            var value = col1.take(20).toArray();

            expect(value).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
        });

        it('works when taking the same number of elements as in the collection', function ()
        {
            var value = col1.take(8).toArray();

            expect(value).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
        });

        it('works on an empty collection', function ()
        {
            var value = $linq([]).take(4).toArray();

            expect(value).toEqual([]);
        });

        it('works when taking no elements', function ()
        {
            var value = col1.take(0).toArray();

            expect(value).toEqual([]);
        });

        it('throws an exception on a null "count" parameter', function ()
        {
            expect(function () { col1.take(null); }).toThrow();
        });

        it('throws an exception on a non-number "count" parameter', function ()
        {
            expect(function () { col1.take("stuff"); }).toThrow();
        });
    });

    describe('takeWhile', function ()
    {
        var col1 = $linq([1, 2, 3, 4, 5, 6, 7, 8]);
        var col2 = $linq([1, 2, 3, 4, 5, 1, 2, 3, 4, 5]);

        it('works when taking some of the elements of the collection', function ()
        {
            var value1 = col1.takeWhile(function (x) { return x < 5; }).toArray();
            var value2 = col2.takeWhile(function (x) { return x < 5; }).toArray();

            expect(value1).toEqual([1, 2, 3, 4]);
            expect(value2).toEqual([1, 2, 3, 4]);
        });

        it('works when taking all of the elements of the collection', function ()
        {
            var value = col1.takeWhile(function (x) { return x < 100; }).toArray();

            expect(value).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
        });

        it('works when taking none of the elements of the collection', function ()
        {
            var value = col1.takeWhile(function (x) { return x < 0; }).toArray();

            expect(value).toEqual([]);
        });

        it('works on an empty collection', function ()
        {
            var value = $linq([]).takeWhile(function (x) { return x < 5; }).toArray();

            expect(value).toEqual([]);
        });

        it('works with a lambda predicate', function ()
        {
            var value = col2.takeWhile("x => x < 5").toArray();

            expect(value).toEqual([1, 2, 3, 4]);
        });

        it('throws an exception on a null "predicate" parameter', function ()
        {
            expect(function () { col1.takeWhile(null); }).toThrow();
        });
    });

    describe('skip', function ()
    {
        var col = $linq([1, 2, 3, 4, 5, 6, 7, 8]);

        it('skips some of the elements', function ()
        {
            expect(col.skip(4).toArray()).toEqual([5, 6, 7, 8]);
        });

        it('skips all of the elements', function ()
        {
            expect(col.skip(8).toArray()).toEqual([]);
            expect(col.skip(100).toArray()).toEqual([]);
        });

        it('skips none of the elements', function ()
        {
            expect(col.skip(0).toArray()).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
        });

        it('works on an empty collection', function ()
        {
            expect($linq([]).skip(4).toArray()).toEqual([]);
        });

        it('throws an exception on a null "count" parameter', function ()
        {
            expect(function () { col.skip(null); }).toThrow();
        });

        it('throws an exception on a non-number "count" parameter', function ()
        {
            expect(function () { col.skip("stuff"); }).toThrow();
        });
    });

    describe('skipWhile', function ()
    {
        var col1 = $linq([1, 2, 3, 4, 5, 6, 7, 8]);
        var col2 = $linq([1, 2, 3, 4, 5, 1, 2, 3, 4, 5]);

        it('skips some of the elements', function ()
        {
            expect(col1.skipWhile(function (x) { return x < 5; }).toArray()).toEqual([5, 6, 7, 8]);
            expect(col2.skipWhile(function (x) { return x < 5; }).toArray()).toEqual([5, 1, 2, 3, 4, 5]);
        });

        it('skips all of the elements', function ()
        {
            expect(col1.skipWhile(function (x) { return x < 1000; }).toArray()).toEqual([]);
        });

        it('skips none of the elements', function ()
        {
            expect(col1.skipWhile(function (x) { return x < 0; }).toArray()).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
        });

        it('works on an empty collection', function ()
        {
            var value = $linq([]).skipWhile(function (x) { return x < 4; }).toArray();

            expect(value).toEqual([]);
        });

        it('works with a lambda predicate', function ()
        {
            var value = col2.skipWhile("x => x < 5").toArray();

            expect(value).toEqual([5, 1, 2, 3, 4, 5]);
        });

        it('throws an exception on a null "predicate" parameter', function ()
        {
            expect(function () { col1.skipWhile(null); }).toThrow();
        });
    });

    describe('toDictionary', function ()
    {
        var col1 = $linq([{ prop: 'color', value: 'red' }, { prop: 'align', value: 'center' }, { prop: 'text', value: 'nicole' }]);
        var col2 = $linq(['a_blue', 'b_red', 'c_green', 'd_purple']);
        var col3 = $linq(['1_one', '1_uno', '2_two', '3_three']);

        it('works with a key selector and an element selector', function ()
        {
            var value = col1.toDictionary(function (x) { return x.prop; }, function (x) { return x.value; });

            expect(value).toEqual({ color: 'red', align: 'center', text: 'nicole' });
        });

        it('works with just a key selector', function ()
        {
            var value = col2.toDictionary(function (x) { return x[0]; });

            expect(value).toEqual({ a: 'a_blue', b: 'b_red', c: 'c_green', d: 'd_purple' });
        });

        it('works on an empty collection', function ()
        {
            var value = $linq([]).toDictionary(function (x) { return x.prop; });

            expect(value).toEqual({});
        });

        it('works with lambda functions', function ()
        {
            var value = col1.toDictionary("x => x.prop", "x => x.value");

            expect(value).toEqual({ color: 'red', align: 'center', text: 'nicole' });
        });

        it('throws an exception on a null "key selector" parameter', function ()
        {
            expect(function () { col1.toDictionary(null); }).toThrow();
        });

        it('throws an exception on a non-function "element selector" parameter', function ()
        {
            expect(function () { col1.toDictionary("x => x.prop", 99); }).toThrow();
        });

        it('throws an exception when there is a duplicate key', function ()
        {
            expect(function () { col3.toDictionary("x => x[0]", "x => x.slice(2)"); }).toThrow();
        });
    });

    describe('reverse', function ()
    {
        var col1 = $linq([1, 2, 3, 4, 5, 6]);

        it('reverses a non-empty collection', function ()
        {
            expect(col1.reverse().toArray()).toEqual([6, 5, 4, 3, 2, 1]);
        });

        it('works with a single-element collection', function ()
        {
            var value = $linq([111]).reverse();

            expect(value.toArray()).toEqual([111]);
        });

        it('works with an empty collection', function ()
        {
            expect($linq([]).reverse().toArray()).toEqual([]);
        });
    });

    describe('sum', function ()
    {
        var col1 = $linq([1, 2, 3, 4, 5, 6]);
        var col2 = $linq([{ id: 1, value: 100 }, { id: 2, value: 200 }, { id: 3, value: 300 }, { id: 4, value: 400 }]);

        it('works without a projection', function ()
        {
            expect(col1.sum()).toEqual(21);
        });

        it('works with an empty collection', function ()
        {
            expect($linq([]).sum()).toEqual(0);
        });

        it('works with a projection', function ()
        {
            var value = col2.sum(function (x) { return x.value; });

            expect(value).toEqual(1000);
        });

        it('works with a lambda projection', function ()
        {
            var value = col2.sum("x => 2 * x.value");

            expect(value).toEqual(2000);
        });

        it('throws an exception on a non-function "selector" parameter', function ()
        {
            expect(function () { col2.sum(99); }).toThrow();
        });
    });

    describe('min', function ()
    {
        var col1 = $linq([15, 42, 98, 6, 475, 3, 333]);
        var col2 = $linq([{ id: 1, value: 9000 }, { id: 2, value: 57 }, { id: 3, value: 17 }, { id: 4, value: 23 }, { id: 5, value: 94 }]);

        it('works without a selector', function ()
        {
            expect(col1.min()).toEqual(3);
        });

        it('works with a selector', function ()
        {
            var value = col2.min(function (x) { return x.value; });

            expect(value).toEqual(17);
        });

        it('works with a lambda selector', function ()
        {
            expect(col2.min("x => x.value")).toEqual(17);
        });

        it('throws an exception on a non-function "selector" parameter', function ()
        {
            expect(function () { col2.min(99); }).toThrow();
        });

        it('throws an exception on an empty collection', function ()
        {
            expect(function () { $linq([]).min(); }).toThrow();
        });
    });

    describe('minBy', function ()
    {
        var col = $linq([{ id: 1, value: 9000 }, { id: 2, value: 57 }, { id: 3, value: 17 }, { id: 4, value: 23 }, { id: 5, value: 94 }]);

        it('works with a non-empty collection', function ()
        {
            var value = col.minBy(function (x) { return x.value; });

            expect(value).toEqual({ id: 3, value: 17 });
        });

        it('works with a lambda selector', function ()
        {
            expect(col.minBy("x => x.value")).toEqual({ id: 3, value: 17 });
        });

        it('throws an exception on a null "selector" function', function ()
        {
            expect(function () { col.minBy(null); }).toThrow();
        });

        it('throws an exception on an empty collection', function ()
        {
            expect(function () { $linq([]).minBy("x => x.value"); }).toThrow();
        });
    });

    describe('max', function ()
    {
        var col1 = $linq([15, 42, 98, 6, 475, 3, 333]);
        var col2 = $linq([{ id: 1, value: 9000 }, { id: 2, value: 57 }, { id: 3, value: 17 }, { id: 4, value: 23 }, { id: 5, value: 94 }]);

        it('works without a selector', function ()
        {
            expect(col1.max()).toEqual(475);
        });

        it('works with a selector', function ()
        {
            var value = col2.max(function (x) { return x.value; });

            expect(value).toEqual(9000);
        });

        it('works with a lambda selector', function ()
        {
            expect(col2.max("x => x.value")).toEqual(9000);
        });

        it('throws an exception on a non-function "selector" parameter', function ()
        {
            expect(function () { col2.max(99); }).toThrow();
        });

        it('throws an exception on an empty collection', function ()
        {
            expect(function () { $linq([]).max(); }).toThrow();
        });
    });

    describe('maxBy', function ()
    {
        var col = $linq([{ id: 1, value: 9000 }, { id: 2, value: 57 }, { id: 3, value: 17 }, { id: 4, value: 23 }, { id: 5, value: 94 }]);

        it('works with a non-empty collection', function ()
        {
            var value = col.maxBy(function (x) { return x.value; });

            expect(value).toEqual({ id: 1, value: 9000 });
        });

        it('works with a lambda selector', function ()
        {
            expect(col.maxBy("x => x.value")).toEqual({ id: 1, value: 9000 });
        });

        it('throws an exception on a null "selector" function', function ()
        {
            expect(function () { col.maxBy(null); }).toThrow();
        });

        it('throws an exception on an empty collection', function ()
        {
            expect(function () { $linq([]).maxBy("x => x.value"); }).toThrow();
        });
    });

    describe('average', function ()
    {
        var col1 = $linq([1, 2, 3, 4, 5, 6, 7, 8]);
        var col2 = $linq([{ id: 1, value: 100 }, { id: 2, value: 200 }, { id: 3, value: 300 }, { id: 4, value: 400 }]);

        it('works with a non-empty collection', function ()
        {
            expect(col1.average()).toEqual(4.5);
        });

        it('works with a selector', function ()
        {
            expect(col2.average(function (x) { return x.value; })).toEqual(250);
        });

        it('works with a lambda selector', function ()
        {
            expect(col2.average("x => x.value * 2")).toEqual(500);
        });

        it('throws an exception on a non-function "selector" function', function ()
        {
            expect(function () { col1.average(99); }).toThrow();
        });

        it('throws an exception on a collection containing a non-number', function ()
        {
            expect(function () { $linq([1, 2, 'a']).average(); }).toThrow();
        });
    });

    describe('contains', function ()
    {
        var col1 = $linq([1, 2, 3, 4, 5, 6]);
        var col2 = $linq(["one", "two", "three", "four", "five", "six"]);
        var comparer = function (x, y) { return x.toLowerCase() == y.toLowerCase(); };

        it('works with a collection that contains the item', function ()
        {
            expect(col1.contains(3)).toBeTruthy();
        });

        it('works with a collection that does not contain the item', function ()
        {
            expect(col1.contains(77)).toBeFalsy();
        });

        it('works on an empty collection', function ()
        {
            expect($linq([]).contains('test')).toBeFalsy();
        });

        it('works with a comparer', function ()
        {
            expect(col2.contains('FOUR', comparer)).toBeTruthy();
            expect(col2.contains('TEN', comparer)).toBeFalsy();
        });

        it('works with a lambda comparer', function ()
        {
            var comparer2 = "x, y => x.toLowerCase() == y.toLowerCase()";

            expect(col2.contains('FIVE', comparer2)).toBeTruthy();
            expect(col2.contains('twenty', comparer2)).toBeFalsy();
        });
        
        it('works with a "-1/0/1"-returning comparer', function ()
        {
            var comparer2 = function (x, y) 
            { 
                x = x.toLowerCase();
                y = y.toLowerCase();
                
                return (x < y ? -1 : x > y ? 1 : 0); 
            };
            
            expect(col2.contains('THREE', comparer2)).toBeTruthy();
            expect(col2.contains('fifty', comparer2)).toBeFalsy();
        });

        it('throws an exception on a non-function "comparer" function', function ()
        {
            expect(function () { col2.contains("test", 99); }).toThrow();
        });
    });

    describe('sequenceEqual', function ()
    {
        var col1 = $linq([1, 2, 3, 4, 5]);
        var col2 = $linq([1, 2, 3, 4, 5]);
        var col3 = $linq([1, 2, 2, 3, 4, 5]);
        var col4 = $linq([1, 2, 7, 4, 5]);
        var col5 = $linq(["one", "two", "three", "four"]);
        var col6 = $linq(["ONE", "TWO", "THREE", "FOUR"]);
        var col7 = $linq(["ONE", "TWO", "THREE"]);
        var col8 = $linq(["ONE", "SEVEN", "THREE", "FOUR"]);

        var comparer = function (x, y) { return x.toLowerCase() == y.toLowerCase(); };

        it('works when the collections are equal', function ()
        {
            expect(col1.sequenceEqual(col2)).toBeTruthy();
        });

        it('works when the collections are not equal', function ()
        {
            expect(col1.sequenceEqual(col3)).toBeFalsy();
            expect(col1.sequenceEqual(col4)).toBeFalsy();
        });

        it('works when conducted against an array', function ()
        {
            expect(col1.sequenceEqual([1, 2, 3, 4, 5])).toBeTruthy();
            expect(col1.sequenceEqual([1, 2, 3])).toBeFalsy();
            expect(col1.sequenceEqual([1, 2, 7, 4, 5])).toBeFalsy();
        });

        it('works when conducted against null', function ()
        {
            expect(col1.sequenceEqual(null)).toBeFalsy();
        });

        it('works when conducted against an empty collection', function ()
        {
            expect(col1.sequenceEqual([])).toBeFalsy();
        });

        it('works with a comparer function', function ()
        {
            expect(col5.sequenceEqual(col6, comparer)).toBeTruthy();
            expect(col5.sequenceEqual(col7, comparer)).toBeFalsy();
            expect(col5.sequenceEqual(col8, comparer)).toBeFalsy();
        });

        it('works with a lambda comparer function', function ()
        {
            var comparer2 = "x, y => x.toLowerCase() == y.toLowerCase()";

            expect(col5.sequenceEqual(col6, comparer2)).toBeTruthy();
            expect(col5.sequenceEqual(col7, comparer2)).toBeFalsy();
            expect(col5.sequenceEqual(col8, comparer2)).toBeFalsy();
        });

        it('throws an exception on a non-function "comparer" function', function ()
        {
            expect(function () { col1.sequenceEqual(col1, 99); }).toThrow();
        });
    });

    describe('sequenceEquivalent', function ()
    {
        var col1 = $linq([1, 2, 3, 4, 5]);
        var col2 = $linq([5, 4, 3, 2, 1]);
        var col3 = $linq([1, 7, 3, 4, 5]);
        var col4 = $linq(["one", "two", "three", "four"]);
        var col5 = $linq(["FOUR", "THREE", "TWO", "ONE"]);
        var col6 = $linq(["three", "two", "one"]);
        var col7 = $linq([1, 1, 2, 2, 3, 4]);
        var col8 = $linq([1, 1, 2, 2, 3, 4]);
        var col9 = $linq([1, 2, 2, 3, 3, 4]);

        var comparer = function (x, y) { return x.toLowerCase() == y.toLowerCase(); };

        it('works when the collections are equivalent', function ()
        {
            expect(col1.sequenceEquivalent(col2)).toBeTruthy();
            expect(col7.sequenceEquivalent(col8)).toBeTruthy();
        });

        it('works when the collections are not equivalent', function ()
        {
            expect(col1.sequenceEquivalent(col3)).toBeFalsy();
            expect(col1.sequenceEquivalent(col7)).toBeFalsy();
            expect(col7.sequenceEquivalent(col9)).toBeFalsy();
        });

        it('works when conducted against an array', function ()
        {
            expect(col1.sequenceEquivalent([5, 4, 3, 2, 1])).toBeTruthy();
            expect(col1.sequenceEquivalent([1, 2, 3, 4, 5])).toBeTruthy();
            expect(col1.sequenceEquivalent([1, 2, 3])).toBeFalsy();
            expect(col1.sequenceEquivalent([1, 7, 3, 4, 5])).toBeFalsy();
        });

        it('works when conducted against null', function ()
        {
            expect(col1.sequenceEquivalent(null)).toBeFalsy();
        });

        it('works when conducted against an empty collection', function ()
        {
            expect(col1.sequenceEquivalent([])).toBeFalsy();
        });

        it('works with a comparer function', function ()
        {
            expect(col4.sequenceEquivalent(col5, comparer)).toBeTruthy();
            expect(col4.sequenceEquivalent(col5, linq.caseInsensitiveComparer)).toBeTruthy();
            expect(col4.sequenceEquivalent(col6, comparer)).toBeFalsy();
        });

        it('works with a lambda comparer function', function ()
        {
            var comparer2 = "(x, y) => x.toLowerCase() == y.toLowerCase()";

            expect(col4.sequenceEquivalent(col5, comparer2)).toBeTruthy();
            expect(col4.sequenceEquivalent(col6, comparer2)).toBeFalsy();
        });

        it('throws an exception on a non-function "comparer" function', function ()
        {
            expect(function () { col1.sequenceEquivalent(col1, 99); }).toThrow();
        });
    });

    describe('zip', function ()
    {
        var col1 = $linq(['a', 'b', 'c', 'd']);
        var col2 = $linq(['a', 'b', 'c', 'd', 'e', 'f']);
        var col3 = $linq([1, 2, 3, 4]);

        var resultSelector = function (x, y) { return x + '_' + y; };

        it('works on collections of equal length', function ()
        {
            expect(col1.zip(col3, resultSelector).toArray()).toEqual(['a_1', 'b_2', 'c_3', 'd_4']);
        });

        it('works on collections of unequal length', function ()
        {
            expect(col2.zip(col3, resultSelector).toArray()).toEqual(['a_1', 'b_2', 'c_3', 'd_4']);
        });

        it('works with an array', function ()
        {
            expect(col1.zip([1, 2, 3, 4, 5, 6, 7, 8], resultSelector).toArray()).toEqual(['a_1', 'b_2', 'c_3', 'd_4']);
        });
        
        it('works with a null result selector', function ()
        {
            expect(col1.zip(col3).toArray()).toEqual([['a', 1], ['b', 2], ['c', 3], ['d', 4]]);
        });

        it('works with an empty array', function ()
        {
            expect(col1.zip([], resultSelector).toArray()).toEqual([]);
        });

        it('works with a null array', function ()
        {
            expect(col1.zip(null, resultSelector).toArray()).toEqual([]);
        });

        it('works with a lambda result selector', function ()
        {
            expect(col1.zip(col3, "(x, y) => x + '_' + y").toArray()).toEqual(['a_1', 'b_2', 'c_3', 'd_4']);
        });

        it('throws an exception on a non-function result selector', function ()
        {
            expect(function () { col1.zip(col2, 99); }).toThrow();
        });
    });

    describe('orderBy', function ()
    {
        var col1 = $linq([2, 5, 1, 3, 4, 6]);
        var col2 = $linq([{ id: 3, value: 543 }, { id: 4, value: 956 }, { id: 1, value: 112 }, { id: 2, value: 456 }]);
        var col3 = $linq([{ id: 3, value: "c" }, { id: 4, value: "D" }, { id: 1, value: "a" }, { id: 2, value: "B" }]);

        var identityKeySelector = function (x) { return x; };
        var keySelector = function (x) { return x.value; };
        var selector = function (x) { return x.id; };

        var comparer = function (x, y)
        {
            var tempX = x.toLowerCase();
            var tempY = y.toLowerCase();

            if (tempX < tempY)
                return -1;
            else if (tempX > tempY)
                return 1;
            else
                return 0;
        };

        it('works with a given key selector', function ()
        {
            expect(col1.orderBy(identityKeySelector).toArray()).toEqual([1, 2, 3, 4, 5, 6]);
            expect(col1.orderBy(linq.identity).toArray()).toEqual([1, 2, 3, 4, 5, 6]);
            expect(col2.orderBy(keySelector).select(selector).toArray()).toEqual([1, 2, 3, 4]);
        });

        it('works with string keys and no comparer passed', function ()
        {
            expect(col3.orderBy(keySelector).select(selector).toArray()).toEqual([2, 4, 1, 3]);
        });

        it('works with a comparer', function ()
        {
            expect(col3.orderBy(keySelector, comparer).select(selector).toArray()).toEqual([1, 2, 3, 4]);
        });

        it('works with a lambda key selector and a lambda comparer', function ()
        {
            var comparer2 = 'x, y => ((x.toLowerCase() < y.toLowerCase()) ? -1 : ((x.toLowerCase() > y.toLowerCase()) ? 1 : 0))';
            expect(col3.orderBy('x => x.value', comparer2).select(selector).toArray()).toEqual([1, 2, 3, 4]);
        });

        it('throws an exception on a null key selector', function ()
        {
            expect(function () { col1.orderBy(null); }).toThrow();
        });

        it('throws an exception on a non-function key selector', function ()
        {
            expect(function () { col1.orderBy(99); }).toThrow();
        });

        it('throws an exception on a non-function comparer', function ()
        {
            expect(function () { col1.orderBy(identityKeySelector, 99); }).toThrow();
        });
    });

    describe('orderByDescending', function ()
    {
        var col1 = $linq([2, 5, 1, 3, 4, 6]);
        var col2 = $linq([{ id: 3, value: 543 }, { id: 4, value: 956 }, { id: 1, value: 112 }, { id: 2, value: 456 }]);
        var col3 = $linq([{ id: 3, value: "c" }, { id: 4, value: "D" }, { id: 1, value: "a" }, { id: 2, value: "B" }]);

        var identityKeySelector = function (x) { return x; };
        var keySelector = function (x) { return x.value; };
        var selector = function (x) { return x.id; };

        var comparer = function (x, y)
        {
            var tempX = x.toLowerCase();
            var tempY = y.toLowerCase();

            if (tempX < tempY)
                return -1;
            else if (tempX > tempY)
                return 1;
            else
                return 0;
        };

        it('works with a given key selector', function ()
        {
            expect(col1.orderByDescending(identityKeySelector).toArray()).toEqual([6, 5, 4, 3, 2, 1]);
            expect(col1.orderByDescending(linq.identity).toArray()).toEqual([6, 5, 4, 3, 2, 1]);
            expect(col2.orderByDescending(keySelector).select(selector).toArray()).toEqual([4, 3, 2, 1]);
        });

        it('works with string keys and no comparer passed', function ()
        {
            expect(col3.orderByDescending(keySelector).select(selector).toArray()).toEqual([3, 1, 4, 2]);
        });

        it('works with a comparer', function ()
        {
            expect(col3.orderByDescending(keySelector, comparer).select(selector).toArray()).toEqual([4, 3, 2, 1]);
        });

        it('works with a lambda key selector and a lambda comparer', function ()
        {
            var comparer2 = 'x, y => ((x.toLowerCase() < y.toLowerCase()) ? -1 : ((x.toLowerCase() > y.toLowerCase()) ? 1 : 0))';
            expect(col3.orderByDescending('x => x.value', comparer2).select(selector).toArray()).toEqual([4, 3, 2, 1]);
        });

        it('throws an exception on a null key selector', function ()
        {
            expect(function () { col1.orderByDescending(null); }).toThrow();
        });

        it('throws an exception on a non-function key selector', function ()
        {
            expect(function () { col1.orderByDescending(99); }).toThrow();
        });

        it('throws an exception on a non-function comparer', function ()
        {
            expect(function () { col1.orderByDescending(identityKeySelector, 99); }).toThrow();
        });
    });

    describe('thenBy', function ()
    {
        var col1 = $linq([{ id: 3, level1: 222, level2: 99 }, { id: 7, level1: 444, level2: 44 }, { id: 1, level1: 111, level2: 10 }, { id: 4, level1: 333, level2: 44 }, { id: 8, level1: 555, level2: 99 }, { id: 5, level1: 333, level2: 66 }, { id: 6, level1: 444, level2: 22 }, { id: 2, level1: 111, level2: 20 }]);
        var col2 = $linq([{ id: 3, level1: 222, level2: 'a' }, { id: 7, level1: 444, level2: 'B' }, { id: 1, level1: 111, level2: 'A' }, { id: 4, level1: 333, level2: 'a' }, { id: 8, level1: 555, level2: 'a' }, { id: 5, level1: 333, level2: 'C' }, { id: 6, level1: 444, level2: 'a' }, { id: 2, level1: 111, level2: 'b' }]);

        var level1Selector = function (x) { return x.level1; };
        var level2Selector = function (x) { return x.level2; };
        var resultSelector = function (x) { return x.id; };

        var comparer = function (x, y)
        {
            var tempX = x.toLowerCase();
            var tempY = y.toLowerCase();

            if (tempX < tempY)
                return -1;
            else if (tempX > tempY)
                return 1;
            else
                return 0;
        };

        it('works with a given key selector', function ()
        {
            expect(col1.orderBy(level1Selector).thenBy(level2Selector).select(resultSelector).toArray()).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
        });

        it('works with string keys and no comparer passed', function ()
        {
            expect(col2.orderBy(level1Selector).thenBy(level2Selector).select(resultSelector).toArray()).toEqual([1, 2, 3, 5, 4, 7, 6, 8]);
        });

        it('works with a comparer', function ()
        {
            expect(col2.orderBy(level1Selector).thenBy(level2Selector, comparer).select(resultSelector).toArray()).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
        });

        it('works with a lambda key selector and a lambda comparer', function ()
        {
            var comparer2 = 'x, y => ((x.toLowerCase() < y.toLowerCase()) ? -1 : ((x.toLowerCase() > y.toLowerCase()) ? 1 : 0))';
            expect(col2.orderBy(level1Selector).thenBy('x => x.level2', comparer2).select(resultSelector).toArray()).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
        });

        it('throws an exception on a null key selector', function ()
        {
            expect(function () { col1.orderBy(level1Selector).thenBy(null); }).toThrow();
        });

        it('throws an exception on a non-function key selector', function ()
        {
            expect(function () { col1.orderBy(level1Selector).thenBy(99); }).toThrow();
        });

        it('throws an exception on a non-function comparer', function ()
        {
            expect(function () { col1.orderBy(level1Selector).thenBy(level2Selector, 99); }).toThrow();
        });
    });

    describe('thenByDescending', function ()
    {
        var col1 = $linq([{ id: 3, level1: 222, level2: 99 }, { id: 7, level1: 444, level2: 44 }, { id: 1, level1: 111, level2: 10 }, { id: 4, level1: 333, level2: 44 }, { id: 8, level1: 555, level2: 99 }, { id: 5, level1: 333, level2: 66 }, { id: 6, level1: 444, level2: 22 }, { id: 2, level1: 111, level2: 20 }]);
        var col2 = $linq([{ id: 3, level1: 222, level2: 'a' }, { id: 7, level1: 444, level2: 'B' }, { id: 1, level1: 111, level2: 'A' }, { id: 4, level1: 333, level2: 'a' }, { id: 8, level1: 555, level2: 'a' }, { id: 5, level1: 333, level2: 'C' }, { id: 6, level1: 444, level2: 'a' }, { id: 2, level1: 111, level2: 'b' }]);

        var level1Selector = function (x) { return x.level1; };
        var level2Selector = function (x) { return x.level2; };
        var resultSelector = function (x) { return x.id; };

        var comparer = function (x, y)
        {
            var tempX = x.toLowerCase();
            var tempY = y.toLowerCase();

            if (tempX < tempY)
                return -1;
            else if (tempX > tempY)
                return 1;
            else
                return 0;
        };

        it('works with a given key selector', function ()
        {
            expect(col1.orderBy(level1Selector).thenByDescending(level2Selector).select(resultSelector).toArray()).toEqual([2, 1, 3, 5, 4, 7, 6, 8]);
        });

        it('works with string keys and no comparer passed', function ()
        {
            expect(col2.orderBy(level1Selector).thenByDescending(level2Selector).select(resultSelector).toArray()).toEqual([2, 1, 3, 4, 5, 6, 7, 8]);
        });

        it('works with a comparer', function ()
        {
            expect(col2.orderBy(level1Selector).thenByDescending(level2Selector, comparer).select(resultSelector).toArray()).toEqual([2, 1, 3, 5, 4, 7, 6, 8]);
        });

        it('works with a lambda key selector and a lambda comparer', function ()
        {
            var comparer2 = 'x, y => ((x.toLowerCase() < y.toLowerCase()) ? -1 : ((x.toLowerCase() > y.toLowerCase()) ? 1 : 0))';
            expect(col2.orderBy(level1Selector).thenByDescending('x => x.level2', comparer2).select(resultSelector).toArray()).toEqual([2, 1, 3, 5, 4, 7, 6, 8]);
        });

        it('throws an exception on a null key selector', function ()
        {
            expect(function () { col1.orderBy(level1Selector).thenByDescending(null); }).toThrow();
        });

        it('throws an exception on a non-function key selector', function ()
        {
            expect(function () { col1.orderBy(level1Selector).thenByDescending(99); }).toThrow();
        });

        it('throws an exception on a non-function comparer', function ()
        {
            expect(function () { col1.orderBy(level1Selector).thenByDescending(level2Selector, 99); }).toThrow();
        });
    });

    describe('elementAt', function ()
    {
        var col1 = $linq([1, 2, 3, 4, 5, 6, 7, 8]);

        it('works with indexes that fall within the range of the collection', function ()
        {
            expect(col1.elementAt(0)).toEqual(1);
            expect(col1.elementAt(5)).toEqual(6);
            expect(col1.elementAt(7)).toEqual(8);
        });

        it('throws an exception on a null index', function ()
        {
            expect(function () { col1.elementAt(null); }).toThrow();
        });

        it('throws an exception on a NaN index', function ()
        {
            expect(function () { col1.elementAt("stuff"); }).toThrow();
        });

        it('throws an exception on an index outside of the range of the collection', function ()
        {
            expect(function () { col1.elementAt(-11); }).toThrow();
            expect(function () { col1.elementAt(9999); }).toThrow();
        });
    });

    describe('elementAtOrDefault', function ()
    {
        var col1 = $linq([1, 2, 3, 4, 5, 6, 7, 8]);

        it('works with indexes that fall within the range of the collection', function ()
        {
            expect(col1.elementAtOrDefault(0, 99)).toEqual(1);
            expect(col1.elementAtOrDefault(5, 99)).toEqual(6);
            expect(col1.elementAtOrDefault(7, 99)).toEqual(8);
        });

        it('works with indexes that fall outside the range of the collection', function ()
        {
            expect(col1.elementAtOrDefault(-11, 99)).toEqual(99);
            expect(col1.elementAtOrDefault(9999, 99)).toEqual(99);
        });

        it('works with a NaN index', function ()
        {
            expect(col1.elementAtOrDefault("stuff", 99)).toEqual(99);
        });

        it('works with a null index', function ()
        {
            expect(col1.elementAtOrDefault(null, 99)).toEqual(99);
        });
    });

    describe('concat', function ()
    {
        var col1 = $linq([1, 2, 3]);
        var col2 = $linq([4, 5, 6]);

        it('works on non-empty collections', function ()
        {
            expect(col1.concat(col2).toArray()).toEqual([1, 2, 3, 4, 5, 6]);
        });

        it('works with an array', function ()
        {
            expect(col1.concat([7, 8, 9]).toArray()).toEqual([1, 2, 3, 7, 8, 9]);
        });

        it('works on empty collections', function ()
        {
            expect($linq([]).concat([2, 4, 6]).toArray()).toEqual([2, 4, 6]);
            expect(col1.concat([]).toArray()).toEqual([1, 2, 3]);
        });

        it('works with a null collection', function ()
        {
            expect(col1.concat(null).toArray()).toEqual([1, 2, 3]);
        });
    });

    describe('skipUntil', function ()
    {
        var col1 = $linq([1, 2, 3, 4, 5, 6, 7, 8]);
        var col2 = $linq([1, 2, 3, 4, 5, 1, 2, 3, 4, 5]);

        var predicate = function (x) { return x > 4; };

        it('works to skip some of the elements of the collection', function ()
        {
            expect(col1.skipUntil(predicate).toArray()).toEqual([5, 6, 7, 8]);
            expect(col2.skipUntil(predicate).toArray()).toEqual([5, 1, 2, 3, 4, 5]);
        });

        it('works on an empty collection', function ()
        {
            expect($linq([]).skipUntil(predicate).toArray()).toEqual([]);
        });

        it('works in a situation where it should skip no elements', function ()
        {
            expect(col1.skipUntil(function (x) { return x > 0; }).toArray()).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
        });

        it('works with a lambda predicate', function ()
        {
            expect(col2.skipUntil('x => x > 4').toArray()).toEqual([5, 1, 2, 3, 4, 5]);
        });

        it('throws an exception on a null predicate', function ()
        {
            expect(function () { col1.skipUntil(null); }).toThrow();
        });

        it('throws an exception on a non-function predicate', function ()
        {
            expect(function () { col1.skipUntil(99); }).toThrow();
        });
    });

    describe('takeUntil', function ()
    {
        var col1 = $linq([1, 2, 3, 4, 5, 6, 7, 8]);
        var col2 = $linq([1, 2, 3, 4, 5, 1, 2, 3, 4, 5]);

        var predicate = function (x) { return x > 4; };

        it('works in a situation where it should take some of the elements', function ()
        {
            expect(col1.takeUntil(predicate).toArray()).toEqual([1, 2, 3, 4]);
            expect(col2.takeUntil(predicate).toArray()).toEqual([1, 2, 3, 4]);
        });

        it('works on an empty collection', function ()
        {
            expect($linq([]).takeUntil(predicate).toArray()).toEqual([]);
        });

        it('works in a situation where it should take none of the elements', function ()
        {
            expect(col1.takeUntil(function (x) { return x > 0; }).toArray()).toEqual([]);
        });

        it('works in a situation where it should take all of the elements', function () 
        {
            expect(col1.takeUntil(function (x) { return x > 9999; }).toArray()).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
        });

        it('works with a lambda predicate', function ()
        {
            expect(col2.takeUntil('x => x > 4').toArray()).toEqual([1, 2, 3, 4]);
        });

        it('throws an exception on a null predicate', function ()
        {
            expect(function () { col1.takeUntil(null); }).toThrow();
        });

        it('throws an exception on a non-function predicate', function ()
        {
            expect(function () { col1.takeUntil(99); }).toThrow();
        });
    });

    describe('takeLast', function ()
    {
        var col1 = $linq([1, 2, 3, 4, 5, 6, 7, 8]);

        it('works in a situation where it should take some of the elements', function ()
        {
            expect(col1.takeLast(3).toArray()).toEqual([6, 7, 8]);
        });

        it('works on an empty collection', function ()
        {
            expect($linq([]).takeLast(3).toArray()).toEqual([]);
        });

        it('works in a situation where it should take all of the elements', function ()
        {
            expect(col1.takeLast(8).toArray()).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
            expect(col1.takeLast(20).toArray()).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
        });

        it('works in a situation where it should take none of the elements', function ()
        {
            expect(col1.takeLast(0).toArray()).toEqual([]);
        });

        it('throws an exception on a null count', function ()
        {
            expect(function () { col1.takeLast(null); }).toThrow();
        });

        it('throws an exception on a non-number count', function ()
        {
            expect(function () { col1.takeLast("stuff"); }).toThrow();
        });
    });

    describe('takeEvery', function ()
    {
        var col = $linq([1, 2, 3, 4, 5, 6, 7, 8, 9]);

        it('works in a situation where it should take some of the elements', function ()
        {
            expect(col.takeEvery(3).toArray()).toEqual([1, 4, 7]);
        });

        it('works with a count larger that the size of the collection', function ()
        {
            expect(col.takeEvery(20).toArray()).toEqual([1]);
        });

        it('works on an empty collection', function ()
        {
            expect($linq([]).takeEvery(3).toArray()).toEqual([]);
        });

        it('works in a situation where it should take all of the elements', function ()
        {
            expect(col.takeEvery(1).toArray()).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        });

        it('throws an exception on a null count', function ()
        {
            expect(function () { col.takeEvery(null); }).toThrow();
        });

        it('throws an exception on a non-number count', function ()
        {
            expect(function () { col.takeEvery("stuff"); }).toThrow();
        });
    });

    describe('foreach', function ()
    {
        var arr1 = [1, 2, 3, 4, 5, 6];
        var arr2 = ['a', 'b', 'c', 'd', 'e', 'f'];
        var testValue = '';

        it('works on a non-empty collection', function ()
        {
            $linq(arr1).foreach(function (x, i) { arr2[i] = arr2[i] + x; });
            expect(arr2).toEqual(['a1', 'b2', 'c3', 'd4', 'e5', 'f6']);
        });

        it('works on an empty collection', function ()
        {
            $linq([]).foreach(function (x) { testValue += '*'; });
            expect(testValue).toEqual('');
        });

        it('throws an exception on a null action', function ()
        {
            expect(function () { $linq(arr1).foreach(null); }).toThrow();
        });

        it('throws an exception on a non-function action', function ()
        {
            expect(function () { $linq(arr1).foreach("stuff"); }).toThrow();
            expect(function () { $linq(arr1).foreach(99); }).toThrow();
        });
    });

    describe('toDelimitedString', function ()
    {
        var col = $linq(['a', 'b', 'c', 'd', 'e']);

        it('works with a single-character delimiter', function ()
        {
            expect(col.toDelimitedString('|')).toEqual('a|b|c|d|e');
        });

        it('works with a multi-character delimiter', function ()
        {
            expect(col.toDelimitedString(', ')).toEqual('a, b, c, d, e');
        });

        it('works with an implied delimiter', function ()
        {
            expect(col.toDelimitedString()).toEqual('a,b,c,d,e');
        });

        it('works with an empty delimiter', function ()
        {
            expect(col.toDelimitedString('')).toEqual('abcde');
        });
    });

    describe('index', function ()
    {
        var col = $linq(['a', 'b', 'c', 'd', 'e']);

        it('works with a starting index', function ()
        {
            expect(col.index(5).toArray()).toEqual([{ key: 5, value: 'a' }, { key: 6, value: 'b' }, { key: 7, value: 'c' }, { key: 8, value: 'd' }, { key: 9, value: 'e' }]);
        });

        it('works without a starting index', function ()
        {
            expect(col.index().toArray()).toEqual([{ key: 0, value: 'a' }, { key: 1, value: 'b' }, { key: 2, value: 'c' }, { key: 3, value: 'd' }, { key: 4, value: 'e' }]);
        });

        it('works on an empty collection', function ()
        {
            expect($linq([]).index(0).toArray()).toEqual([]);
        });

        it('throws an exception on a non-number index', function ()
        {
            expect(function () { col.index("stuff"); }).toThrow();
        });
    });

    describe('batch', function ()
    {
        var col = $linq([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

        it('works without a result selector', function ()
        {
            expect(col.batch(5).toArray()).toEqual([[1, 2, 3, 4, 5], [6, 7, 8, 9, 10], [11, 12]]);
        });

        it('works with a result selector', function ()
        {
            expect(col.batch(4, function (x) { return x * 2; }).toArray()).toEqual([[2, 4, 6, 8], [10, 12, 14, 16], [18, 20, 22, 24]]);
        });

        it('works with a batch size larger than the size of the collection', function ()
        {
            expect(col.batch(10000).toArray()).toEqual([[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]]);
        });

        it('works with a batch size of "1"', function ()
        {
            expect(col.batch(1).toArray()).toEqual([[1], [2], [3], [4], [5], [6], [7], [8], [9], [10], [11], [12]]);
        });

        it('works on an empty collection', function ()
        {
            expect($linq([]).batch(10).toArray()).toEqual([]);
        });

        it('works with a lambda result selector', function ()
        {
            expect(col.batch(8, 'x => x + 1').toArray()).toEqual([[2, 3, 4, 5, 6, 7, 8, 9], [10, 11, 12, 13]]);
        });

        it('throws an exception on a non-function result selector', function ()
        {
            expect(function () { col.batch(10, 99); }).toThrow();
        });

        it('throws an exception on a non-number batch size', function ()
        {
            expect(function () { col.batch("stuff"); }).toThrow();
        });

        it('throws an exception on a batch size less than "1"', function ()
        {
            expect(function () { col.batch(0); }).toThrow();
        });
    });

    describe('equiZip', function ()
    {
        var col1 = $linq(['a', 'b', 'c', 'd']);
        var col2 = $linq([1, 2, 3, 4]);

        var resultSelector = function (x, y) { return x + '_' + y; };

        it('works on collections of the same size', function ()
        {
            expect(col1.equiZip(col2, resultSelector).toArray()).toEqual(['a_1', 'b_2', 'c_3', 'd_4']);
            expect($linq([]).equiZip([], resultSelector).toArray()).toEqual([]);
            expect($linq([]).equiZip(null, resultSelector).toArray()).toEqual([]);
        });

        it('works on an array', function ()
        {
            expect(col1.equiZip([11, 22, 33, 44], resultSelector).toArray()).toEqual(['a_11', 'b_22', 'c_33', 'd_44']);
        });

        it('works with a lambda result selector', function ()
        {
            expect(col1.equiZip(col2, '(x, y) => x + "=" + y').toArray()).toEqual(['a=1', 'b=2', 'c=3', 'd=4']);
        });
        
        it('works with a null result selector', function ()
        {
            expect(col1.equiZip(col2).toArray()).toEqual([['a', 1], ['b', 2], ['c', 3], ['d', 4]]);
        });

        it('throws an exception on a non-function result selector', function ()
        {
            expect(function () { col1.equiZip(col2, 99); }).toThrow();
        });

        it('throws an exception when called on collections of unequal lengths', function ()
        {
            expect(function () { col1.equiZip([1, 2, 3, 4, 5, 6], resultSelector); }).toThrow();
            expect(function () { col1.equiZip([], resultSelector); }).toThrow();
            expect(function () { col1.equiZip(null, resultSelector); }).toThrow();
        });
    });

    describe('zipLongest', function ()
    {
        var col1 = $linq(['a', 'b', 'c', 'd']);
        var col2 = $linq(['a', 'b', 'c', 'd', 'e', 'f']);
        var col3 = $linq([1, 2, 3, 4]);

        var resultSelector = function (x, y) { return x + '_' + y; };
        var defaultFirst = '*';
        var defaultSecond = '$';

        it('works on collections of the same length', function ()
        {
            expect(col1.zipLongest(col3, defaultFirst, defaultSecond, resultSelector).toArray()).toEqual(['a_1', 'b_2', 'c_3', 'd_4']);
        });

        it('works on collections that are not of the same length', function ()
        {
            expect(col3.zipLongest(col2, defaultFirst, defaultSecond, resultSelector).toArray()).toEqual(['1_a', '2_b', '3_c', '4_d', '*_e', '*_f']);
            expect(col2.zipLongest(col3, defaultFirst, defaultSecond, resultSelector).toArray()).toEqual(['a_1', 'b_2', 'c_3', 'd_4', 'e_$', 'f_$']);
        });

        it('works on arrays', function ()
        {
            expect(col1.zipLongest([1, 2, 3, 4, 5, 6, 7, 8], defaultFirst, defaultSecond, resultSelector).toArray()).toEqual(['a_1', 'b_2', 'c_3', 'd_4', '*_5', '*_6', '*_7', '*_8']);
        });
        
        it('works on a null result selector', function ()
        {
            expect(col1.zipLongest(col3, defaultFirst, defaultSecond).toArray()).toEqual([['a', 1], ['b', 2], ['c', 3], ['d', 4]]);
        });

        it('works on empty collections', function ()
        {
            expect(col1.zipLongest([], defaultFirst, defaultSecond, resultSelector).toArray()).toEqual(['a_$', 'b_$', 'c_$', 'd_$']);
            expect($linq([]).zipLongest(col1, defaultFirst, defaultSecond, resultSelector).toArray()).toEqual(['*_a', '*_b', '*_c', '*_d']);
        });

        it('works on null collections', function ()
        {
            expect(col1.zipLongest(null, defaultFirst, defaultSecond, resultSelector).toArray()).toEqual(['a_$', 'b_$', 'c_$', 'd_$']);
        });

        it('works with a lambda result selector', function ()
        {
            expect(col1.zipLongest(col3, defaultFirst, defaultSecond, '(x, y) => x + "=" + y').toArray()).toEqual(['a=1', 'b=2', 'c=3', 'd=4']);
        });

        it('works with null default values', function ()
        {
            var resultSelector2 = function (x, y)
            {
                return (x == null ? '<null>' : x) + '=' + (y == null ? '<null>' : y);
            };

            expect(col2.zipLongest(col3, null, null, resultSelector2).toArray()).toEqual(['a=1', 'b=2', 'c=3', 'd=4', 'e=<null>', 'f=<null>']);
            expect(col3.zipLongest(col2, null, null, resultSelector2).toArray()).toEqual(['1=a', '2=b', '3=c', '4=d', '<null>=e', '<null>=f']);
        });

        it('throws an exception on a non-function result selector', function ()
        {
            expect(function () { col1.zipLongest(col2, defaultFirst, defaultSecond, 99); }).toThrow();
        });
    });

    describe('prepend', function ()
    {
        var col = $linq([2, 3, 4, 5, 6, 7]);

        it('works on a non-empty collection', function ()
        {
            expect(col.prepend(1).toArray()).toEqual([1, 2, 3, 4, 5, 6, 7]);
        });

        it('works on an empty collection', function ()
        {
            expect($linq([]).prepend('a').toArray()).toEqual(['a']);
        });

        it('works with a null value to prepend', function ()
        {
            expect(col.prepend(null).toArray()).toEqual([null, 2, 3, 4, 5, 6, 7]);
        });
    });

    describe('pad', function ()
    {
        var col = $linq([1, 2, 3, 4]);

        it('works on a non-empty collection', function ()
        {
            expect(col.pad(8, 0).toArray()).toEqual([1, 2, 3, 4, 0, 0, 0, 0]);
        });

        it('works on an empty collection', function ()
        {
            expect($linq([]).pad(8, 'a').toArray()).toEqual(['a', 'a', 'a', 'a', 'a', 'a', 'a', 'a']);
        });

        it('works in a situation when no padding needs to occur', function ()
        {
            expect(col.pad(4, '$').toArray()).toEqual([1, 2, 3, 4]);
        });

        it('works with a null padding value', function ()
        {
            expect(col.pad(6, null).toArray()).toEqual([1, 2, 3, 4, null, null]);
        });

        it('throws an exception on a non-number padding width', function ()
        {
            expect(function () { col.pad("stuff", 0); }).toThrow();
        });
    });

    describe('padWith', function ()
    {
        var col = $linq([0, 1, 2, 3]);

        var padFunc = function (i) { return i * 10 + i; };

        it('works on a non-empty collection', function ()
        {
            expect(col.padWith(8, padFunc).toArray()).toEqual([0, 1, 2, 3, 44, 55, 66, 77]);
        });

        it('works on an empty collection', function ()
        {
            expect($linq([]).padWith(8, padFunc).toArray()).toEqual([0, 11, 22, 33, 44, 55, 66, 77]);
        });

        it('works in a situation where no padding needs to occur', function ()
        {
            expect(col.padWith(4, padFunc).toArray()).toEqual([0, 1, 2, 3]);
        });

        it('works with a lambda padding selector', function ()
        {
            expect(col.padWith(6, 'x => "_" + x + "_"').toArray()).toEqual([0, 1, 2, 3, '_4_', '_5_']);
        });

        it('throws an exception on a null padding selector', function ()
        {
            expect(function () { col.padWith(8, null); }).toThrow();
        });

        it('throws an exception on a non-function padding selector', function ()
        {
            expect(function () { col.padWith(8, 99); }).toThrow();
        });
    });

    describe('toJQuery', function ()
    {
        // TODO: Figure out how to test with jQuery.  The following is the original unit test code:

        //var div = $('#divTest');

        //$('<span>').attr('id', 'test_jquery_1').appendTo(div);
        //$('<span>').attr('id', 'test_jquery_2').appendTo(div);
        //$('<span>').attr('id', 'test_jquery_3').appendTo(div);
        //$('<span>').attr('id', 'test_jquery_4').appendTo(div);

        //var spans = $('span', div);

        //assertEquals("setup correct", spans.length, 4);

        //var col = $linq($.makeArray(spans));

        //var results = col.toJQuery();

        //assertTrue("returns jquery object", results instanceof jQuery);
        //assertEquals("element 1 is 'test_jquery_1'", results[0].id, 'test_jquery_1');
        //assertEquals("element 2 is 'test_jquery_2'", results[1].id, 'test_jquery_2');
        //assertEquals("element 3 is 'test_jquery_3'", results[2].id, 'test_jquery_3');
        //assertEquals("element 4 is 'test_jquery_4'", results[3].id, 'test_jquery_4');

        //div.empty();
    });

    describe('pipe', function ()
    {
        var col1 = $linq([1, 2, 3, 4]);

        var obj1 = { val: 1, result: 0 },
            obj2 = { val: 2, result: 0 },
            obj3 = { val: 3, result: 0 };

        var col2 = $linq([obj1, obj2, obj3]);
        var arr1 = [],
            arr2 = [],
            arr3 = [];

        it('works with a non-empty collection', function ()
        {
            expect(col1.pipe(function (x) { arr1.push(x); }).toArray()).toEqual([1, 2, 3, 4]);
            expect(arr1, [1, 2, 3, 4]);

            expect(col1.pipe(function (x, i) { arr2.push(i); }).toArray()).toEqual([1, 2, 3, 4]);
            expect(arr2, [0, 1, 2, 3]);
        });

        it('works with an empty collection', function ()
        {
            expect($linq([]).pipe(function (x) { arr3.push(x); }).toArray()).toEqual([]);
            expect(arr3, []);
        });

        it('works with a lambda action', function ()
        {
            expect(col2.pipe('x => x.result = x.val').select('x => x.val').toArray()).toEqual([1, 2, 3]);
            expect(obj1.result).toEqual(1);
            expect(obj2.result).toEqual(2);
            expect(obj3.result).toEqual(3);
        });
    });

    describe('singleOrFallback', function ()
    {
        var col1 = $linq([1]);
        var col2 = $linq([1, 2, 3, 4]);

        var fallback = function () { return 99; };

        it('works in a situation where it does not need the fallback value', function ()
        {
            expect(col1.singleOrFallback(fallback)).toEqual(1);
        });

        it('works in a situation where it does need the fallback value', function ()
        {
            expect($linq([]).singleOrFallback(fallback)).toEqual(99);
        });

        it('works with a lambda fallback function', function ()
        {
            expect($linq([]).singleOrFallback('() => 111')).toEqual(111);
        });

        it('throws an exception on a non-function fallback', function ()
        {
            expect(function () { col1.singleOrFallback(99); }).toThrow();
        });

        it('throws an exception on a collection with multiple elements', function ()
        {
            expect(function () { col2.singleOrFallback(fallback); }).toThrow();
        });
    });

    describe('indexOf', function ()
    {
        var col = $linq([1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6]);

        it('works on a non-empty collection', function ()
        {
            expect(col.indexOf(function (x) { return x == 3 })).toEqual(2);
            expect(col.indexOf(function (x) { return x == 99; })).toEqual(-1);
        });

        it('works with an empty collection', function ()
        {
            expect($linq([]).indexOf(function (x) { return x == 2; })).toEqual(-1);
        });

        it('works with a lambda predicate', function ()
        {
            expect(col.indexOf('x => x == 6')).toEqual(5);
        });

        it('throws an exception on a null predicate', function ()
        {
            expect(function () { col.indexOf(null); }).toThrow();
        });

        it('throws an exception on a non-function predicate', function ()
        {
            expect(function () { col.indexOf(99); }).toThrow();
        });
    });

    describe('indexOfElement', function ()
    {
        var col1 = $linq([1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6]);
        var col2 = $linq(['a', 'b', 'c', 'd', 'a', 'b', 'c', 'd']);

        it('works on a non-empty collection', function ()
        {
            expect(col1.indexOfElement(3)).toEqual(2);
            expect(col1.indexOfElement(99)).toEqual(-1);
        });

        it('works on an empty collection', function ()
        {
            expect($linq([]).indexOfElement(2)).toEqual(-1);
        });

        it('works with a comparer', function ()
        {
            var comparer = function (x, y) { return x.toLowerCase() == y.toLowerCase(); };
            expect(col2.indexOfElement('B', comparer)).toEqual(1);
        });

        it('works with a lambda comparer', function ()
        {
            expect(col2.indexOfElement('C', '(x, y) => x.toLowerCase() == y.toLowerCase()')).toEqual(2);
        });

        it('throws an exception on a non-function comparer', function ()
        {
            expect(function () { col2.indexOfElement('D', 99); }).toThrow();
        });
    });

    describe('lastIndexOf', function ()
    {
        var col = $linq([1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6]);

        it('works on a non-empty collection', function ()
        {
            expect(col.lastIndexOf(function (x) { return x == 3; })).toEqual(8);
            expect(col.lastIndexOf(function (x) { return x == 99; })).toEqual(-1);
        });

        it('works on an empty collection', function ()
        {
            expect($linq([]).lastIndexOf(function (x) { return x == 2; })).toEqual(-1);
        });

        it('works with a lambda predicate', function ()
        {
            expect(col.lastIndexOf('x => x == 6')).toEqual(11);
        });

        it('throws an exception on a null predicate', function ()
        {
            expect(function () { col.lastIndexOf(null); }).toThrow();
        });

        it('throws an exception on a non-function predicate', function ()
        {
            expect(function () { col.lastIndexOf(99); }).toThrow();
        });
    });

    describe('lastIndexOfElement', function ()
    {
        var col1 = $linq([1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6]);
        var col2 = $linq(['a', 'b', 'c', 'd', 'a', 'b', 'c', 'd']);

        it('works on a non-empty collection', function ()
        {
            expect(col1.lastIndexOfElement(3)).toEqual(8);
            expect(col1.lastIndexOfElement(99)).toEqual(-1);
        });

        it('works on an empty collection', function ()
        {
            expect($linq([]).lastIndexOfElement(2)).toEqual(-1);
        });

        it('works with a comparer', function ()
        {
            var comparer = function (x, y) { return x.toLowerCase() == y.toLowerCase(); };
            expect(col2.lastIndexOfElement('B', comparer)).toEqual(5);
        });

        it('works with a lambda comparer', function ()
        {
            expect(col2.lastIndexOfElement('C', '(x, y) => x.toLowerCase() == y.toLowerCase()')).toEqual(6);
        });

        it('throws an exception on a non-function comparer', function ()
        {
            expect(function () { col2.lastIndexOfElement('D', 99); }).toThrow();
        });
    });

    describe('scan', function ()
    {
        var col1 = $linq([1, 2, 3, 4, 5, 6, 7]);
        var col2 = $linq(['a', 'b', 'c', 'd', 'e']);

        var addition = function (x, y) { return x + y; };

        it('works on a non-empty collection', function ()
        {
            expect(col1.scan(addition).toArray()).toEqual([1, 3, 6, 10, 15, 21, 28]);
            expect(col2.scan(addition).toArray()).toEqual(['a', 'ab', 'abc', 'abcd', 'abcde']);
        });

        it('works with a lambda operation', function ()
        {
            expect(col1.scan('(x, y) => x * y').toArray()).toEqual([1, 2, 6, 24, 120, 720, 5040]);
        });

        it('throws an exception on an empty collection', function ()
        {
            expect(function () { $linq([]).scan(addition); }).toThrow();
        });

        it('throws an exception on a null operation', function ()
        {
            expect(function () { col1.scan(null); }).toThrow();
        });

        it('throws an exception on a non-function operation', function ()
        {
            expect(function () { col1.scan(99); }).toThrow();
        });
    });

    describe('prescan', function ()
    {
        var col1 = $linq([1, 2, 3, 4, 5, 6, 7]);
        var col2 = $linq(['a', 'b', 'c', 'd', 'e']);

        var addition = function (x, y) { return x + y; };

        it('works on a non-empty collection', function ()
        {
            expect(col1.prescan(addition, 0).toArray()).toEqual([0, 1, 3, 6, 10, 15, 21]);
            expect(col2.prescan(addition, '').toArray()).toEqual(['', 'a', 'ab', 'abc', 'abcd']);
        });

        it('works on an empty collection', function ()
        {
            expect($linq([]).prescan(addition, 0).toArray()).toEqual([]);
        });

        it('works with a lamdba operation', function ()
        {
            expect(col1.prescan('(x, y) => x * y', 1).toArray()).toEqual([1, 1, 2, 6, 24, 120, 720]);
        });

        it('combines with zip to implement scan', function ()
        {
            var list1 = col1.prescan(addition, 0);
            var list2 = col1.zip(list1, addition);
            var list3 = col1.scan(addition);

            expect(list2.toArray()).toEqual(list3.toArray());
        });

        it('throws an exception on a null operation', function ()
        {
            expect(function () { col1.prescan(null, 0); }).toThrow();
        });

        it('throws an exception on a non-function operation', function ()
        {
            expect(function () { col1.prescan(99, 1); }).toThrow();
        });
    });

    describe('aggregate', function ()
    {
        var col1 = $linq([1, 4, 5]);
        var col2 = $linq(['a', 'b', 'c', 'd', 'e']);

        var sampleAggregate = function (current, value) { return current * 2 + value; };

        it('works on a non-empty collection', function ()
        {
            expect(col1.aggregate(5, sampleAggregate)).toEqual(57);
            expect(col1.aggregate(null, sampleAggregate)).toEqual(25);
        });

        it('works on an empty collection with a seed', function ()
        {
            expect($linq([]).aggregate(99, sampleAggregate)).toEqual(99);
        });

        it('works with a result selector', function ()
        {
            expect(col1.aggregate(5, sampleAggregate, function (x) { return 'value: ' + x; })).toEqual('value: 57');
        });

        it('works with a lambda aggregate function', function ()
        {
            expect(col2.aggregate('', '(x, y) => x + y')).toEqual('abcde');
        });

        it('works with a lambda result selector', function ()
        {
            expect(col1.aggregate(5, sampleAggregate, 'x => "value: " + x')).toEqual('value: 57');
        });

        it('throws an exception on an empty collection without a seed', function ()
        {
            expect(function () { $linq([]).aggregate(null, sampleAggregate); }).toThrow();
        });

        it('throws an exception on a null operation', function ()
        {
            expect(function () { col1.aggregate(1, null); }).toThrow();
        });

        it('throws an exception on a non-function operation', function ()
        {
            expect(function () { col1.aggregate(1, 99); }).toThrow();
        });

        it('throws an exception on a non-function result selector', function ()
        {
            expect(function () { col1.aggregate(1, sampleAggregate, 99); }).toThrow();
        });
    });

    describe('helper functions', function ()
    {
        var isFunction = function (x) { return (typeof x == 'function'); };

        it('exposes "identity"', function ()
        {
            expect(linq.identity != null && isFunction(linq.identity)).toBeTruthy();
            expect(linq.identity(99) == 99).toBeTruthy();
        });

        it('exposes "isString"', function ()
        {
            expect(linq.isString != null && isFunction(linq.isString)).toBeTruthy();
            expect(linq.isString("test")).toBeTruthy();
            expect(linq.isString(99)).toBeFalsy();
        });

        it('exposes "isBoolean"', function ()
        {
            expect(linq.isBoolean != null && isFunction(linq.isBoolean)).toBeTruthy();
            expect(linq.isBoolean(true)).toBeTruthy();
            expect(linq.isBoolean(99)).toBeFalsy();
        });

        it('exposes "isNumber"', function ()
        {
            expect(linq.isNumber != null && isFunction(linq.isNumber)).toBeTruthy();
            expect(linq.isNumber(99)).toBeTruthy();
            expect(linq.isNumber("test")).toBeFalsy();
        });

        it('exposes "caseInsensitiveComparer"', function ()
        {
            expect(linq.caseInsensitiveComparer != null && isFunction(linq.caseInsensitiveComparer)).toBeTruthy();
            expect(linq.caseInsensitiveComparer('abc', 'ABC')).toEqual(0);
            expect(linq.caseInsensitiveComparer('abc', 'abc')).toEqual(0);
            expect(linq.caseInsensitiveComparer('abc', 'def')).toEqual(-1);
            expect(linq.caseInsensitiveComparer('def', 'abe')).toEqual(1);
        });

        it('exposes "caseSensitiveComparer"', function ()
        {
            expect(linq.caseSensitiveComparer != null && isFunction(linq.caseSensitiveComparer)).toBeTruthy();
            expect(linq.caseSensitiveComparer('abc', 'abc')).toEqual(0);
            expect(linq.caseSensitiveComparer('abc', 'ABC')).toEqual(1);
            expect(linq.caseSensitiveComparer('abc', 'def')).toEqual(-1);
        });

        it('exposes "defaultStringComparer"', function ()
        {
            expect(linq.defaultStringComparer != null && isFunction(linq.defaultStringComparer)).toBeTruthy();
            expect(linq.defaultStringComparer('abc', 'abc')).toEqual(0);
        });

        it('exposes "strictComparer"', function ()
        {
            expect(linq.strictComparer != null && isFunction(linq.strictComparer)).toBeTruthy();
            expect(linq.strictComparer('abc', 'abc')).toBeTruthy();
            expect(linq.strictComparer('abc', 'ABC')).toBeFalsy();
            expect(linq.strictComparer('1', 1)).toBeFalsy();
        });
    });
});