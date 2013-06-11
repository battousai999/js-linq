describe('jslinq', function ()
{
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
        
        var identity1 = col.select("x => x");
        var identity2 = col.select("$");
        var basic1 = col.select("x => x * 2");
        var basic2 = col.select("$ * 2");
        var comparer1 = col.orderByDescending("x => x", "x, y => x - y");
        var comparer2 = col.orderByDescending("x => x", "(x, y) => x - y");
        var comparer3 = col.orderByDescending("$", "$ - $$");
        
        it('handles identity functions', function ()
        {
            expect(identity1.toArray()).toEqual([1, 2, 3, 4, 5]);
            expect(identity2.toArray()).toEqual([1, 2, 3, 4, 5]);
        });
        
        it('handles basic functions', function ()
        {
            expect(basic1.toArray()).toEqual([2, 4, 6, 8, 10]);
            expect(basic2.toArray()).toEqual([2, 4, 6, 8, 10]);
        });
        
        it('handles comparer functions', function ()
        {
            expect(comparer1.toArray()).toEqual([5, 4, 3, 2, 1]);
            expect(comparer2.toArray()).toEqual([5, 4, 3, 2, 1]);
            expect(comparer3.toArray()).toEqual([5, 4, 3, 2, 1]);
        });
    });
});