describe('jslinq', function ()
{
    describe('from (constructor)', function ()
    {
        var arr = [1, 2, 3, 4, 5, 6];
        var col = linq.from(arr);
    
        it('returns an object', function () { expect(col).not.toBeNull(); });
        it('has the correct length', function () { expect(col.array.length).toEqual(arr.length); });
        
        it('has the correct elements', function () 
        { 
            for (var i = 0; i < arr.length; i++)
            {
                expect(col.array[i]).toEqual(arr[i]);
            }
        });        
        
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
        
        it('throws exception for null "from"', function () { expect(function () { linq.range(null, end); }).toThrow(); });
        it('throws exception for null "to"', function () { expect(function () { linq.range(start, null); }).toThrow(); });
    });

});