/*
    $linq Version 1.6.0 (by Kurtis Jones @ https://github.com/battousai999/js-linq)
*/

(function (root, undefined)
{
    var linq_helper = {};

    linq_helper.map = function (array, func /*, thisp*/)
    {
        var thisp = arguments[2];

        if (array.map !== undefined)
            return array.map(func, thisp);

        var len = array.length;

        if (!linq_helper.isFunction(func))
            throw new TypeError();

        var res = new Array(len);

        for (var i = 0; i < len; i++)
        {
            if (i in array)
                res[i] = func.call(thisp, array[i], i, array);
        }

        return res;
    };

    linq_helper.filter = function (array, func /*, thisp */)
    {
        var thisp = arguments[2];

        if (array.filter !== undefined)
            return array.filter(func, thisp);

        var len = array.length;

        if (!linq_helper.isFunction(func))
            throw new TypeError();

        var res = new Array();

        for (var i = 0; i < len; i++)
        {
            if (i in array)
            {
                var val = array[i]; // in case fun mutates this
                if (func.call(thisp, val, i, array))
                    res.push(val);
            }
        }

        return res;
    };

    linq_helper.every = function (array, func /*, thisp */)
    {
        var thisp = arguments[2];

        if (array.every !== undefined)
            return array.every(func, thisp);

        var len = array.length;

        if (!linq_helper.isFunction(func))
            throw new TypeError();

        for (var i = 0; i < len; i++)
        {
            if ((i in array) && !func.call(thisp, array[i], i, array))
                return false;
        }

        return true;
    };

    linq_helper.some = function (array, func /*, thisp */)
    {
        var thisp = arguments[2];

        if (array.some !== undefined)
            return array.some(func, thisp);

        var len = array.length;

        for (var i = 0; i < len; i++)
        {
            if ((i in array) && func.call(thisp, array[i], i, array))
                return true;
        }

        return false;
    };
    
    linq_helper.object_keys = function (obj)
    {
        if (Object.keys !== undefined)
            return Object.keys(obj);
        
        if (obj !== Object(obj))
            throw new TypeError('object_keys called on a non-object.');
            
        var arr = [], property;
        
        for (property in obj)
        {
            if (Object.prototype.hasOwnProperty.call(obj, property))
                arr.push(property);
        }
        
        return arr;
    };

    linq_helper.isFunction = function (func)
    {
        return (typeof func == "function");
    };

    linq_helper.isArray = function (obj)
    {
        return (Object.prototype.toString.call(obj) === '[object Array]');
    };

    linq_helper.extendDeferredSort = function (info, appendInfo)
    {
        var helper = function (x)
        {
            return {
                keySelector: x.keySelector,
                comparer: x.comparer,
                reverse: x.reverse,
                next: (x.next == null ? appendInfo : helper(x.next))
            };
        };

        return helper(info);
    };

    linq_helper.createLambda = function (expr)
    {
        if (linq_helper.isFunction(expr))
            return expr;

        if ((typeof expr == typeof "") && (expr !== ""))
        {
            if (expr.indexOf("=>") < 0)
                return new Function("$,$$,$$$", "return " + expr);

            var match = expr.match(/^\s*\(?\s*([^)]*)\s*\)?\s*=>(.*)/);
            return new Function(match[1], "return " + match[2]);
        }

        return expr;
    };

    linq_helper.processDeferredSort = function (collection)
    {
        if (collection.deferredSort == null)
            return;

        var compare = function (x, y, info)
        {
            var value;

            if (info.reverse)
                value = info.comparer(info.keySelector(y), info.keySelector(x));
            else
                value = info.comparer(info.keySelector(x), info.keySelector(y));

            if (value == 0)
            {
                if (info.next == null)
                    return 0;

                // Recursively evaluate the next level of ordering...
                return compare(x, y, info.next);
            }
            else
                return value;
        };

        collection.array.sort(function (x, y) { return compare(x, y, collection.deferredSort); });
        collection.deferredSort = null;
    };

    linq_helper.identity = function (x) { return x; };
    linq_helper.merge = function (x, y) { return [x, y]; };
    
    linq_helper.isString = function (x) { return (typeof x === 'string' || x instanceof String); }
    linq_helper.isBoolean = function (x) { return (typeof x === 'boolean' || x instanceof Boolean); }
    linq_helper.isNumber = function (x) { return (typeof x === 'number' || x instanceof Number); }
    
    linq_helper.caseInsensitiveComparer = function (x, y)
    {
        var tempX = (linq_helper.isString(x) ? x.toLowerCase() : x);
        var tempY = (linq_helper.isString(x) ? y.toLowerCase() : y);
        
        return (tempX < tempY ? -1 : tempX > tempY ? 1 : 0);
    };
    
    linq_helper.caseSensitiveComparer = function (x, y) { return (x < y ? -1 : x > y ? 1 : 0); };
    linq_helper.defaultStringComparer = linq_helper.caseSensitiveComparer;
    linq_helper.strictComparer = function (x, y) { return (x === y); };
    
    // Allows "-1/0/1"-returning comparers (used for ordered comparisons) to be used where
    // "true/false"-returning comparers are expected.
    linq_helper.normalizeComparer = function (func)
    {
        return function (x, y)
        {
            var tempValue = func(x, y);
            
            if (linq_helper.isBoolean(tempValue))
                return tempValue;
            else if (linq_helper.isNumber(tempValue))
                return (tempValue == 0);
            else
                throw new Error("Invalid value from comparer function.");
        };
    };
    
    /**
        Creates a new linq object.
        @constructor
        @param array The array that contains the elements to include
        @param copyArray Optional, a flag indicating whether to directly use the array or make a copy, first
    */
    var linq = function (array)
    {
        var copyArray = true;

        if ((arguments.length >= 1) && (arguments[1] != null) && !arguments[1])
            copyArray = false;

        if (copyArray)
            this.array = (array == null ? [] : array.slice(0));
        else
            this.array = array;

        this.deferredSort = null;
    };

    // Add helper functions to linq class
    linq.isFunction = linq_helper.isFunction;
    linq.isArray = linq_helper.isArray;
    linq.identity = linq_helper.identity;
    linq.isString = linq_helper.isString;
    linq.isBoolean = linq_helper.isBoolean;
    linq.isNumber = linq_helper.isNumber;
    linq.caseInsensitiveComparer = linq_helper.caseInsensitiveComparer;
    linq.caseSensitiveComparer = linq_helper.caseSensitiveComparer;
    linq.defaultStringComparer = linq_helper.defaultStringComparer;
    linq.strictComparer = linq_helper.strictComparer;

    /**
        Creates a new linq object from either another linq object, an array, a jQuery object, or otherwise an array with 'collection'
        as the only element.
        @param collection The collection-like object to use to constuct a linq object
        @returns A new linq object.
    */
    linq.from = function (collection)
    {
        if (collection == null)
            return new linq([]);

        if (collection instanceof linq)
            return collection;

        if (linq_helper.isArray(collection))
            return new linq(collection);

        if (typeof jQuery !== 'undefined' && (collection instanceof jQuery))
            return new linq(collection.get());

        // Create an array with 'collection' as the only element
        return new linq([collection], false);
    };

    /**
        Create a new linq object that contains a range of integers.
        @param from The starting value of the range
        @param to The ending value of the range
        @param step Optional, the amount by which to increment each iteration
        @returns A new linq object.
    */
    linq.range = function (from, to, step)
    {
        if ((from == null) || isNaN(from))
            throw new Error("Invalid 'from' value.");

        if ((to == null) || isNaN(to))
            throw new Error("Invalid 'to' value.");

        if ((step == null) || isNaN(step))
            step = 1;

        var array = [];

        for (var i = from; i <= to; i += step)
        {
            array.push(i);
        }

        return new linq(array, false);
    };

    /**
        Create a new linq object that contains a given number of repetitions of an object.
        @param item The item to repeat
        @param repetitions Optional, the number of times to repeat the object (defaults to 1)
        @returns A new linq object.
    */
    linq.repeat = function (item, repetitions)
    {
        if ((repetitions == null) || isNaN(repetitions))
            repetitions = 1;

        var array = [];

        for (var i = 0; i < repetitions; i++)
        {
            array.push(item);
        }

        return new linq(array, false);
    };

    /**
        Create a new linq object that contains all of the matches for a regex pattern.  Note that
        'g' does not need to be added to the flags parameter (it will be automatically added).
        @param text The input string for the regular expression
        @param pattern The pattern string or RegExp object for the regular expression
        @param flags Optional, the RegExp flags to use (e.g., 'i' = ignore case, 'm' = multiline)
    */
    linq.matches = function (text, pattern, flags)
    {
        if (pattern == null)
            throw new Error("Invalid 'pattern' value.");

        if (text == null)
            return new linq([]);

        if (typeof text != typeof "")
            throw new Error("Parameter 'text' is not a string.");

        if (flags == null)
            flags = '';

        if (flags.indexOf('g') < 0)
            flags += 'g';

        var internalPattern;

        if (pattern instanceof RegExp)
        {
            if ((flags.indexOf('i') < 0) && pattern.ignoreCase)
                flags += 'i';

            if ((flags.indexOf('m') < 0) && pattern.multiline)
                flags += 'm';

            internalPattern = pattern.source;
        }
        else
            internalPattern = pattern;

        var regex = new RegExp(internalPattern, flags);
        var matches = text.match(regex);

        return new linq((matches == null ? [] : matches), false);
    };

    /**
        Create a new linq object that contains an element for each property of the 'object' passed
        to the method.  Each element will have a property named by the 'keyPropertyName' parameter
        whose value will equal the name of the property and a property named by the 'valuePropertyName'
        parameter whose value will equal the value of the property.  If the 'keyPropertyName'
        parameter is not given, then it will default to "key"; if the 'valuePropertyName' parameter 
        is not given, then it will default to "value".
        @param obj The object from which to enumerate properties
        @param keyPropertyName Optional, the name of the property in the resultant elements containing
            the property's key
        @param valuePropertyName Optional, the name of the property in the resultant elements containing
            the property's value           
     */
    linq.properties = function (obj, keyPropertyName, valuePropertyName)
    {
        if (obj == null)
            return new linq([]);
            
        if (keyPropertyName == null || keyPropertyName == '')
            keyPropertyName = 'key';
            
        if (valuePropertyName == null || keyPropertyName == '')
            valuePropertyName = 'value';
            
        var selector = function (key)
        {
            var result = {};
            
            result[keyPropertyName] = key;
            result[valuePropertyName] = obj[key];
            
            return result;
        };       
            
        return new linq(linq_helper.map(linq_helper.object_keys(obj), selector), false);
    };

    linq.prototype = {
        /**
            Returns the aggregate value of performing the 'operation' function on each of the values of
            'this' collection, starting with a value equal to 'seed' (or to the value of the first element
            of 'this' collection, if 'seed' is null).  The final value is either directly returned (if no
            'result selector' function is given) or the final value is first passed to the 'result selector'
            function and the return value from that function is returned.
            @param seed The initial value of the aggregation
            @param operation The function to use to aggregate the values of 'this' collection
            @param resultSelector Optional, the function that projects the final value to the returned result
        */
        aggregate: function (seed, operation, resultSelector)
        {
            operation = linq_helper.createLambda(operation);
            resultSelector = linq_helper.createLambda(resultSelector);

            if ((operation == null) || !linq_helper.isFunction(operation))
                throw new Error("Invalid operation.");

            if ((resultSelector != null) && !linq_helper.isFunction(resultSelector))
                throw new Error("Invalid result selector.");

            linq_helper.processDeferredSort(this);

            var len = this.array.length;

            if ((len == 0) && (seed == null))
                throw new Error("Cannot aggregate on empty collection when seed is not given.");

            var current = (seed == null ? this.array[0] : seed);
            var startingIndex = (seed == null ? 1 : 0);

            for (var i = startingIndex; i < len; i++)
            {
                if (i in this.array)
                    current = operation(current, this.array[i]);
            }

            return (resultSelector == null ? current : resultSelector(current));
        },

        /**
            Returns a boolean value indicating whether all of the elements of the collection satisfy the 
            predicate.  Returns 'true' if the collection is empty.
            @param predicate The predicate applied to the collection
        */
        all: function (predicate)
        {
            predicate = linq_helper.createLambda(predicate);

            if ((predicate == null) || !linq_helper.isFunction(predicate))
                throw new Error("Invalid predicate.");

            linq_helper.processDeferredSort(this);

            return linq_helper.every(this.array, predicate);
        },

        /**
            Returns a boolean value indicating whether any of the elements of the collection satisfy the 
            predicate.  Returns 'false' if the collection is empty.
            @param predicate The predicate applied to the collection
        */
        any: function (predicate)
        {
            predicate = linq_helper.createLambda(predicate);

            if ((predicate != null) && !linq_helper.isFunction(predicate))
                throw new Error("Invalid predicate.");

            linq_helper.processDeferredSort(this);

            if (predicate == null)
                return (this.array.length > 0);

            return linq_helper.some(this.array, predicate);
        },

        /**
            Returns the average value of all of the elements (or projection of the elements, if there is
            a selector), excluding null values.  If any of the elements (or projection of the elements) are
            NaN (i.e., not a number), then an exception will be thrown.
            @param selector Optional, a projection function that returns the value to be averaged
        */
        average: function (selector)
        {
            selector = linq_helper.createLambda(selector);

            if ((selector != null) && !linq_helper.isFunction(selector))
                throw new Error("Invalid selector.");

            linq_helper.processDeferredSort(this);

            var len = this.array.length;
            var result = 0;
            var counter = 1;

            for (var i = 0; i < len; i++)
            {
                if (i in this.array)
                {
                    var value = (selector == null ? this.array[i] : selector(this.array[i]));

                    if (value == null)
                        continue;

                    if (isNaN(value))
                        throw new Error("Encountered an element that is not a number.");

                    result += (value - result) / counter;
                    counter += 1;
                }
            }

            return result;
        },

        /**
            Returns an array with the elements of 'this' collection grouped into separate 
            arrays (i.e., "buckets") of the 'size' given.  If the 'result selector' is given
            the the buckets will contain the values projected from the elements by the result
            selector.  The given 'size' must be greater than zero.
            @param size The size of buckets into which to group the elements
            @param resultSelector Optional, the function to use to project the result values
        */
        batch: function (size, resultSelector)
        {
            resultSelector = linq_helper.createLambda(resultSelector);

            if ((resultSelector != null) && !linq_helper.isFunction(resultSelector))
                throw new Error("Invalid result selector.");

            if ((size == null) || isNaN(size) || (size <= 0))
                throw new Error("Invalid size.");

            linq_helper.processDeferredSort(this);

            var results = [];
            var index = 0;
            var len = this.array.length;
            var currentBucket = null;

            for (var i = 0; i < len; i++)
            {
                if (i in this.array)
                {
                    if (currentBucket == null)
                    {
                        currentBucket = [];
                        results.push(currentBucket);
                    }

                    currentBucket[index] = (resultSelector == null ? this.array[i] : resultSelector(this.array[i]));
                    index += 1;

                    if (index == size)
                    {
                        currentBucket = null;
                        index = 0;
                    }
                }
            }

            return new linq(results, false);
        },

        /**
            Returns a collection containing all of the elements of 'this' collection followed by 
            all of the elements of the 'second' collection.
            @param second The collection of items to append to 'this' collection
        */
        concat: function (second)
        {
            linq_helper.processDeferredSort(this);

            if (second == null)
                return new linq(this.array);

            var secondLinq = linq.from(second);

            linq_helper.processDeferredSort(secondLinq);

            return new linq(this.array.concat(secondLinq.array), false);
        },

        /**
            Returns a boolean value indicating whether 'this' collection contains the given 'item'.  The
            'comparer' function can be used to specify how the 'item' is compared to the elements of 'this' 
            collection.  If 'comparer' is not given, the "===" operator is used to compare elements.
            @param item The item to search for in 'this' collection
            @param comparer Optional, the function to use to compare elements to the 'item'
        */
        contains: function (item, comparer)
        {
            comparer = linq_helper.createLambda(comparer);

            if ((comparer != null) && !linq_helper.isFunction(comparer))
                throw new Error("Invalid comparer.");
                
            if (comparer != null)
                comparer = linq_helper.normalizeComparer(comparer);

            linq_helper.processDeferredSort(this);

            return linq_helper.some(this.array, function (x)
            {
                if (comparer == null)
                    return (x === item);
                else
                    return comparer(x, item);
            });
        },

        /**
            Returns the number of items in 'this' collection (if no 'predicate' is given) or the number of
            items in 'this' collection that satisfy the 'predicate'.
            @param predicate Optional, the predicate used to count elements in 'this' collection
        */
        count: function (predicate)
        {
            predicate = linq_helper.createLambda(predicate);

            if ((predicate != null) && !linq_helper.isFunction(predicate))
                throw new Error("Invalid predicate.");

            linq_helper.processDeferredSort(this);

            if (predicate == null)
                return this.array.length;

            var len = this.array.length;
            var counter = 0;

            for (var i = 0; i < len; i++)
            {
                if ((i in this.array) && predicate(this.array[i]))
                    counter += 1;
            }

            return counter;
        },

        /**
            Returns either 'this' collection, if 'this' collection is empty, or a collection containing
            only the 'defaultValue' as an element.  In other words, this function always returns a collection 
            containing at least one element.
            @param defaultValue The value for the resulting collection to contain if 'this' collection is empty
        */
        defaultIfEmpty: function (defaultValue)
        {
            linq_helper.processDeferredSort(this);

            if (this.array.length == 0)
                return new linq([defaultValue], false);
            else
                return new linq(this.array);
        },

        /**
            Returns a collection of all of the distinct elements of 'this' collection, using 'comparer' (if it
            is given) to determine whether two elements are equal.  If 'comparer' is not given, the "===" operator
            is used to compare elements.
            @param comparer Optional, the function used to compare elements
        */
        distinct: function (comparer)
        {
            return this.distinctBy(linq_helper.identity, comparer);
        },

        /**
            Returns a collection of all of the elements that are considered distinct relative to the key value returned
            by the 'keySelector' projection, using 'comparer' (if it is given) to determine whether to keys are equal.
            If 'comparer' is not given, the "===" operator is used to compare keys.
            @param keySelector The projection function to return keys for the elements
            @param comparer Optional, the function used to compare keys
        */
        distinctBy: function (keySelector, comparer)
        {
            keySelector = linq_helper.createLambda(keySelector);
            comparer = linq_helper.createLambda(comparer);

            if ((keySelector == null) || !linq_helper.isFunction(keySelector))
                throw new Error("Invalid key selector.");

            if ((comparer != null) && !linq_helper.isFunction(comparer))
                throw new Error("Invalid comparer.");

            linq_helper.processDeferredSort(this);

            return this.groupBy(keySelector, null, comparer)
                .select(function (x) { return (new linq(x.values, false)).first(); });
        },

        /**
            Returns the element of 'this' collection located at the ordinal position given by 'index' (a zero-based 
            index).  If that position is either less than zero or greater than or equal to the size of 'this' 
            collection, then an error will be thrown.
            @param index The zero-based index of the element to return
        */
        elementAt: function (index)
        {
            if ((index == null) || isNaN(index) || (index < 0) || (index >= this.array.length))
                throw new Error("Invalid index.");

            linq_helper.processDeferredSort(this);

            return this.array[index];
        },

        /**
            Returns either the element of 'this' collection located at the ordinal position given by 'index' (a
            zero-based index), if the 'index' is contained within the bounds of 'this' collection, or the 'defaultValue',
            if the 'index' is not contained within the bounds of 'this' collection.
            @param index The zero-based index of the element to return
            @param defaultValue The value to return if the 'index' is outside the bounds of 'this' collection
        */
        elementAtOrDefault: function (index, defaultValue)
        {
            if ((index == null) || isNaN(index) || (index < 0) || (index >= this.array.length))
                return defaultValue;

            linq_helper.processDeferredSort(this);

            return this.array[index];
        },

        /**
            Returns 'this' collection "zipped-up" with the 'second' collection such that each value of the
            returned collection is the value projected from the corresponding element from each of 'this'
            collection and the 'second' collection.  If the size of 'this' collection and the 'second' 
            collection are not equal, then an exception will be thrown.
            @param second The collection to zip with 'this' collection
            @param resultSelector Optional, the function to use to project the result values
        */
        equiZip: function (second, resultSelector)
        {
            resultSelector = linq_helper.createLambda(resultSelector);

            if ((resultSelector != null) && !linq_helper.isFunction(resultSelector))
                throw new Error("Invalid result selector.");
                
            if (resultSelector == null)
                resultSelector = linq_helper.merge;

            linq_helper.processDeferredSort(this);

            var secondLinq = linq.from(second);

            linq_helper.processDeferredSort(secondLinq);

            if (this.array.length != secondLinq.array.length)
                throw new Error("The two collections being equi-zipped are not of equal lengths.");

            var len = this.array.length;
            var results = [];

            for (var i = 0; i < len; i++)
            {
                results.push(resultSelector(this.array[i], secondLinq.array[i]));
            }

            return new linq(results, false);
        },

        /**
            Returns elements in 'this' collection that do not also exist in the 'second' collection, using 'comparer'
            (if it is given) to determine whether two items are equal.  Also, the returned elements will not include
            duplicates from 'this' collection. If 'comparer' is not given, the "===" operator is used to compare elements.
            @param second The collection to use to exclude elements
            @param comparer Optional, the function used to compare elements
        */
        except: function (second, comparer)
        {
            comparer = linq_helper.createLambda(comparer);

            if ((comparer != null) && !linq_helper.isFunction(comparer))
                throw new Error("Invalid comparer.");
                
            if (comparer != null)
                comparer = linq_helper.normalizeComparer(comparer);

            linq_helper.processDeferredSort(this);

            if (second == null)
                second = [];

            var secondLinq = linq.from(second);

            linq_helper.processDeferredSort(secondLinq);

            var len = this.array.length;
            var results = new linq([], false);

            for (var i = 0; i < len; i++)
            {
                if (i in this.array)
                {
                    var value = this.array[i];

                    var predicate = function (x)
                    {
                        if (comparer == null)
                            return (x === value);
                        else
                            return comparer(x, value);
                    };

                    var inFirst = linq_helper.some(results.array, predicate);
                    var inSecond = linq_helper.some(secondLinq.array, predicate);

                    if (!inFirst && !inSecond)
                        results.array.push(value);
                }
            }

            return results;
        },

        /**
            Returns either the first element of 'this' collection (if 'predicate' is not given) or the 
            first element of 'this' collection that satisfies the 'predicate' (if 'predicate' is given).
            If there is no "first" element to return (either because 'this' collection is empty or no element 
            satisfies the 'predicate'), an error is thrown.
            @param predicate Optional, the predicate function used to determine the element to return
        */
        first: function (predicate)
        {
            predicate = linq_helper.createLambda(predicate);

            if ((predicate != null) && !linq_helper.isFunction(predicate))
                throw new Error("Invalid predicate.");

            linq_helper.processDeferredSort(this);

            var len = this.array.length;

            for (var i = 0; i < len; i++)
            {
                if ((i in this.array) && ((predicate == null) || predicate(this.array[i])))
                    return this.array[i];
            }

            throw new Error("No first item was found in collection.");
        },

        /**
            Returns either the first element of 'this' collection (if 'predicate' is not given) or the
            first element of 'this' collection that satisfies the 'predicate' (if 'predicate' is given).
            If there is no "first" element to return (either because 'this' collection is empty or no element
            satisfies the 'predicate'), the 'defaultValue' is returned.
            
            Alternately, if only one parameter is passed to this function and that single parameter is a
            function, then it will be treated as the 'predicate' and the 'defaultValue' will be considered
            to be null.
            @param defaultValue The value to return if no "first" element is found
            @param predicate Optional, the predicate function used to determine the element to return
        */
        firstOrDefault: function (defaultValue, predicate)
        {
            // If there is only one parameter, and it is a function, then assume that it is
            // the predicate and that the defaultValue is null
            if (arguments.length == 1 && linq_helper.isFunction(defaultValue))
            {
                predicate = defaultValue;
                defaultValue = null;
            }
            
            predicate = linq_helper.createLambda(predicate);

            if ((predicate != null) && !linq_helper.isFunction(predicate))
                throw new Error("Invalid predicate.");

            linq_helper.processDeferredSort(this);

            var len = this.array.length;

            for (var i = 0; i < len; i++)
            {
                if ((i in this.array) && ((predicate == null) || predicate(this.array[i])))
                    return this.array[i];
            }

            return defaultValue;
        },

        /**
            Executes the given 'action' on each element in 'this' collection.
            @param action The function that is executed for each element in 'this' collection
        */
        foreach: function (action)
        {
            action = linq_helper.createLambda(action);

            if ((action == null) || !linq_helper.isFunction(action))
                throw new Error("Invalid action.");

            linq_helper.processDeferredSort(this);

            var len = this.array.length;

            for (var i = 0; i < len; i++)
            {
                if (i in this.array)
                    action(this.array[i], i);
            }
        },

        /**
            Return a collection of groupings (i.e., objects with a property called 'key' that
            contains the grouping key and a property called 'values' that contains an array
            of elements that are grouped under the grouping key).  The array of elements grouped
            under the grouping key will be elements of 'this' collection (if no 'elementSelector' 
            is given) or projected elements given by 'elementSelector'.  The grouping key for 
            each element in 'this' collection is given by the 'keySelector' function.  If a
            'keyComparer' function is given, it will be used to determine equality among the
            grouping keys (if 'comparer' is not given, it the "===" operator will be used).
            @param keySelector The function that returns the grouping key for an element
            @param elementSelector Optional, the function that projects elements to be returned in the results
            @param keyComparer Optional, the function used to compare grouping keys
        */
        groupBy: function (keySelector, elementSelector, keyComparer)
        {
            keySelector = linq_helper.createLambda(keySelector);
            elementSelector = linq_helper.createLambda(elementSelector);
            keyComparer = linq_helper.createLambda(keyComparer);

            if ((keySelector == null) || !linq_helper.isFunction(keySelector))
                throw new Error("Invalid key selector.");

            if ((elementSelector != null) && !linq_helper.isFunction(elementSelector))
                throw new Error("Invalid element selector.");

            if ((keyComparer != null) && !linq_helper.isFunction(keyComparer))
                throw new Error("Invalid key comparer.");
                
            if (keyComparer != null)
                keyComparer = linq_helper.normalizeComparer(keyComparer);

            linq_helper.processDeferredSort(this);

            var len = this.array.length;
            var groupings = new linq([], false);

            for (var i = 0; i < len; i++)
            {
                var value = this.array[i];
                var key = keySelector(value);
                var element = (elementSelector == null ? value : elementSelector(value));

                var foundGroup = groupings.firstOrDefault(null, function (x)
                {
                    if (keyComparer == null)
                        return (x.key === key);
                    else
                        return keyComparer(x.key, key);
                });

                if (foundGroup == null)
                    groupings.array.push({ key: key, values: [element] });
                else
                    foundGroup.values.push(element);
            }

            return groupings;
        },

        /**
            Returns a "left outer" join of 'this' collection (the "outer" collection) and the 'inner'
            collection, using the 'outerKeySelector' and 'innerKeySelector' to project the keys from 
            each collection, and using the 'keyComparer' function (if it is given) to compare the
            projected keys.  If the 'keyComparer' is not given, the "===" operator will be used to 
            compare the projected keys.  The 'resultSelector' function is used to convert the joined 
            results into the results that are returned by the groupJoin function.  The 'resultSelector' 
            takes as parameters the outer object (of the join) and an array of the joined inner objects 
            (this array will be an empty array if there were no inner elements associated with the outer
            element).
            @param inner The collection that is "left-outer" joined with 'this' collection
            @param outerKeySelector The function that projects the key for the outer elements (in 'this' collection)
            @param innerKeySelector The function that projects the key for the inner elements
            @param resultSelector The function that converts the joined results into the results returned
            @param keyComparer Optional, the function used to compare the projected keys
        */
        groupJoin: function (inner, outerKeySelector, innerKeySelector, resultSelector, keyComparer)
        {
            outerKeySelector = linq_helper.createLambda(outerKeySelector);
            innerKeySelector = linq_helper.createLambda(innerKeySelector);
            resultSelector = linq_helper.createLambda(resultSelector);
            keyComparer = linq_helper.createLambda(keyComparer);

            if (inner == null)
                throw new Error("Invalid inner collection.");

            if ((outerKeySelector == null) || !linq_helper.isFunction(outerKeySelector))
                throw new Error("Invalid outer key selector.");

            if ((innerKeySelector == null) || !linq_helper.isFunction(innerKeySelector))
                throw new Error("Invalid inner key selector.");

            if ((resultSelector == null) || !linq_helper.isFunction(resultSelector))
                throw new Error("Invalid result selector.");

            if ((keyComparer != null) && !linq_helper.isFunction(keyComparer))
                throw new Error("Invalid key comparer.");
                
            if (keyComparer != null)
                keyComparer = linq_helper.normalizeComparer(keyComparer);

            linq_helper.processDeferredSort(this);

            var innerLinq = linq.from(inner);
            var groupings = innerLinq.groupBy(innerKeySelector, null, keyComparer);

            var len = this.array.length;
            var results = [];

            for (var i = 0; i < len; i++)
            {
                if (i in this.array)
                {
                    var value = this.array[i];
                    var outerKey = outerKeySelector(value);

                    var groupValues = groupings.firstOrDefault(null, function (x)
                    {
                        if (keyComparer == null)
                            return (x.key === outerKey);
                        else
                            return keyComparer(x.key, outerKey);
                    });

                    results.push(resultSelector(value, (groupValues == null ? [] : groupValues.values)));
                }
            }

            return new linq(results, false);
        },

        /**
            Returns a collection of objects with the "key" property of each object equal to either the zero-based
            index of the element in 'this' collection (if 'startIndex' is not given) or the index, starting at
            'startIndex', of the element in 'this' collection, and with the "value" property of the object equal to
            the element in 'this' collection.
            @param startIndex Optional, the starting index for the results (defaults to '0')
        */
        index: function (startIndex)
        {
            if (startIndex == null)
                startIndex = 0;

            if (isNaN(startIndex))
                throw new Error("Invalid startIndex");

            return this.select(function (x, i) { return { key: (startIndex + i), value: x }; });
        },

        /**
            Returns the index of the first element that satisfies the 'predicate'.  Returns the value "-1" if
            none of the elements satisfy the 'predicate'.
            @param predicate The function used to determine which index to return
        */
        indexOf: function (predicate)
        {
            predicate = linq_helper.createLambda(predicate);

            if ((predicate == null) || !linq_helper.isFunction(predicate))
                throw new Error("Invalid predicate.");

            linq_helper.processDeferredSort(this);

            var len = this.array.length;

            for (var i = 0; i < len; i++)
            {
                if ((i in this.array) && predicate(this.array[i]))
                    return i;
            }

            return -1;
        },

        /**
            Returns the index of the first element to be equal to the given 'item'.  If the optional 'comparer' 
            function is given, then the 'comparer' function is used to determine equality between the elements 
            of 'this' collection and the given 'item'.
            @param item The item to find within 'this' collection
            @param comparer Optional, the function used to compare the elements of 'this' collection with the given 'item'
        */
        indexOfElement: function (item, comparer)
        {
            comparer = linq_helper.createLambda(comparer);

            if ((comparer != null) && !linq_helper.isFunction(comparer))
                throw new Error("Invalid comparer.");
                
            if (comparer != null)
                comparer = linq_helper.normalizeComparer(comparer);

            linq_helper.processDeferredSort(this);

            var len = this.array.length;

            for (var i = 0; i < len; i++)
            {
                if (i in this.array)
                {
                    if (((comparer == null) && (this.array[i] === item)) ||
                        ((comparer != null) && comparer(this.array[i], item)))
                    {
                        return i;
                    }
                }
            }

            return -1;
        },

        /**
            Returns the intersection of elements in 'this' collection and the 'second' collection, using the
            'comparer' function to determine whether two different elements are equal.  If the 'comparer' 
            function is not given, then the "===" operator will be used to compare elements.
            @param second The collection of elements to test for intersection
            @param comparer Optional, the function used to compare elements
        */
        intersect: function (second, comparer)
        {
            if (second == null)
                return new linq([], false);

            comparer = linq_helper.createLambda(comparer);

            var secondLinq = linq.from(second);

            linq_helper.processDeferredSort(secondLinq);

            if ((comparer != null) && !linq_helper.isFunction(comparer))
                throw new Error("Invalid comparer.");
                
            if (comparer != null)
                comparer = linq_helper.normalizeComparer(comparer);

            linq_helper.processDeferredSort(this);

            var len = this.array.length;
            var results = new linq([], false);

            for (var i = 0; i < len; i++)
            {
                if (i in this.array)
                {
                    var value = this.array[i];

                    var predicate = function (x)
                    {
                        if (comparer == null)
                            return (x === value);
                        else
                            return comparer(x, value);
                    };

                    var inFirst = linq_helper.some(results.array, predicate);
                    var inSecond = linq_helper.some(secondLinq.array, predicate);

                    if (!inFirst && inSecond)
                        results.array.push(value);
                }
            }

            return results;
        },

        /**
            Returns an "inner" join of 'this' collection (the "outer" collection) and the 'inner'
            collection, using the 'outerKeySelector' and 'innerKeySelector' functions to project the
            keys from each collection, and using the 'keyComparer' function (if it is given) to compare
            the projected keys.  If the 'keyComparer' is not given, the "===" operator will be used to 
            compare the projected keys.  The 'resultSelector' function is used to convert the joined
            results into the results that are returned by the join function.  The 'resultSelector' 
            function takes as parameters the outer object and the inner object of the join.
            @param inner The collection that is "inner" joined with 'this' collection
            @param outerKeySelector The function that projects the key for the outer elements (in 'this' collection)
            @param innerKeySelector The function that projects the key for the inner elements
            @param resultSelector The function that converts the joined results into the results returned
            @param keyComparer Optional, the function used to compare the projected keys
        */
        join: function (inner, outerKeySelector, innerKeySelector, resultSelector, keyComparer)
        {
            outerKeySelector = linq_helper.createLambda(outerKeySelector);
            innerKeySelector = linq_helper.createLambda(innerKeySelector);
            resultSelector = linq_helper.createLambda(resultSelector);
            keyComparer = linq_helper.createLambda(keyComparer);

            if (inner == null)
                throw new Error("Invalid inner collection.");

            if ((outerKeySelector == null) || !linq_helper.isFunction(outerKeySelector))
                throw new Error("Invalid outer key selector.");

            if ((innerKeySelector == null) || !linq_helper.isFunction(innerKeySelector))
                throw new Error("Invalid inner key selector.");

            if ((resultSelector == null) || !linq_helper.isFunction(resultSelector))
                throw new Error("Invalid result selector.");

            if ((keyComparer != null) && !linq_helper.isFunction(keyComparer))
                throw new Error("Invalid key comparer.");
                
            if (keyComparer != null)
                keyComparer = linq_helper.normalizeComparer(keyComparer);

            linq_helper.processDeferredSort(this);

            var innerLinq = linq.from(inner);
            var groupings = innerLinq.groupBy(innerKeySelector, null, keyComparer);

            var len = this.array.length;
            var results = [];

            for (var i = 0; i < len; i++)
            {
                if (i in this.array)
                {
                    var value = this.array[i];
                    var outerKey = outerKeySelector(value);

                    var groupValues = groupings.firstOrDefault(null, function (x)
                    {
                        if (keyComparer == null)
                            return (x.key === outerKey);
                        else
                            return keyComparer(x.key, outerKey);
                    });

                    if ((groupValues != null) && (groupValues.values.length > 0))
                    {
                        var len2 = groupValues.values.length;

                        for (var j = 0; j < len2; j++)
                        {
                            results.push(resultSelector(value, groupValues.values[j]));
                        }
                    }
                }
            }

            return new linq(results, false);
        },

        /**
            Returns either the last element of 'this' collection (if 'predicate' is not given) or the
            last element of 'this' collection that satisfies the 'predicate' (if 'predicate' is given).
            If there is no "last" element to return (either because 'this' collection is empty or no element
            satisfies the 'predicate'), an error is thrown.
            @param predicate Optional, the predicate function used to determine the element to return
        */
        last: function (predicate)
        {
            predicate = linq_helper.createLambda(predicate);

            if ((predicate != null) && !linq_helper.isFunction(predicate))
                throw new Error("Invalid predicate.");

            linq_helper.processDeferredSort(this);

            for (var i = this.array.length - 1; i >= 0; i--)
            {
                if ((i in this.array) && ((predicate == null) || predicate(this.array[i])))
                    return this.array[i];
            }

            throw new Error("No last item was found in collection.");
        },

        /**
            Returns the index of the last element that satisfies the 'predicate'.  Returns the value "-1" if
            none of the elements satisfy the 'predicate'.
            @param predicate The function used to determine which index to return
        */
        lastIndexOf: function (predicate)
        {
            predicate = linq_helper.createLambda(predicate);

            if ((predicate == null) || !linq_helper.isFunction(predicate))
                throw new Error("Invalid predicate.");

            linq_helper.processDeferredSort(this);

            var len = this.array.length;

            for (var i = len - 1; i >= 0; i--)
            {
                if ((i in this.array) && predicate(this.array[i]))
                    return i;
            }

            return -1;
        },

        /**
            Returns the index of the last element to be equal to the given 'item'.  If the optional 'comparer' 
            function is given, then the 'comparer' function is used to determine equality between the elements 
            of 'this' collection and the given 'item'.
            @param item The item to find within 'this' collection
            @param comparer Optional, the function used to compare the elements of 'this' collection with the given 'item'
        */
        lastIndexOfElement: function (item, comparer)
        {
            comparer = linq_helper.createLambda(comparer);

            if ((comparer != null) && !linq_helper.isFunction(comparer))
                throw new Error("Invalid comparer.");
                
            if (comparer != null)
                comparer = linq_helper.normalizeComparer(comparer);

            linq_helper.processDeferredSort(this);

            var len = this.array.length;

            for (var i = len - 1; i >= 0; i--)
            {
                if (i in this.array)
                {
                    if (((comparer == null) && (this.array[i] === item)) ||
                        ((comparer != null) && comparer(this.array[i], item)))
                    {
                        return i;
                    }
                }
            }

            return -1;
        },

        /**
            Returns either the last element of 'this' collection (if 'predicate' is not given) or the
            last element of 'this' collection that satisfies the 'predicate' (if 'predicate is given).
            If there is no "last" element to return (either because 'this' collection is empty or no element
            satisfies the 'predicate'), the 'defaultValue' is returned.
            
            Alternately, if only one parameter is passed to this function and that single parameter is a
            function, then it will be treated as the 'predicate' and the 'defaultValue' will be considered
            to be null.
            @param defaultValue the value to return if no "last" element is found
            @param predicate Optional, the predicate function used to determine the element to return
        */
        lastOrDefault: function (defaultValue, predicate)
        {
            // If there is only one parameter, and it is a function, then assume that it is
            // the predicate and that the defaultValue is null
            if (arguments.length == 1 && linq_helper.isFunction(defaultValue))
            {
                predicate = defaultValue;
                defaultValue = null;
            }
            
            predicate = linq_helper.createLambda(predicate);

            if ((predicate != null) && !linq_helper.isFunction(predicate))
                throw new Error("Invalid predicate.");

            linq_helper.processDeferredSort(this);

            for (var i = this.array.length - 1; i >= 0; i--)
            {
                if ((i in this.array) && ((predicate == null) || predicate(this.array[i])))
                    return this.array[i];
            }

            return defaultValue;
        },

        /**
            Returns either the minimum element (if 'selector' is not given) or the minimum element projected by 
            the 'selector' function in 'this' collection.  If 'this' collection is empty, an error is thrown.
            @param selector Optional, the function that projects the value of which to determine a minimum
        */
        min: function (selector)
        {
            if (this.array.length == 0)
                throw new Error("No minimum element.");

            selector = linq_helper.createLambda(selector);

            if ((selector != null) && !linq_helper.isFunction(selector))
                throw new Error("Invalid selector.");

            linq_helper.processDeferredSort(this);

            var len = this.array.length;
            var minValue = (selector == null ? this.array[0] : selector(this.array[0]));

            for (var i = 1; i < len; i++)
            {
                if (i in this.array)
                {
                    var tempValue = (selector == null ? this.array[i] : selector(this.array[i]));

                    if (tempValue < minValue)
                        minValue = tempValue;
                }
            }

            return minValue;
        },

        /**
            Returns the "minimum" element of 'this' collection, determined by the value projected by 
            the 'selector' function.  If 'this' collection is empty, an error is thrown.
            @param selector Optional, the function that projects the value to used to determine a minimum element
        */
        minBy: function (selector)
        {
            if (this.array.length == 0)
                throw new Error("No mininum element.");

            selector = linq_helper.createLambda(selector);

            if ((selector == null) || !linq_helper.isFunction(selector))
                throw new Error("Invalid selector.");

            linq_helper.processDeferredSort(this);

            var len = this.array.length;
            var minValue = selector(this.array[0]);
            var minObject = this.array[0];

            for (var i = 1; i < len; i++)
            {
                if (i in this.array)
                {
                    var tempObject = this.array[i];
                    var tempValue = selector(tempObject);

                    if (tempValue < minValue)
                    {
                        minValue = tempValue;
                        minObject = tempObject;
                    }
                }
            }

            return minObject;
        },

        /**
            Returns either the maximum element (if 'selector' is not given) or the maximum element projected by 
            the 'selector' function in 'this' collection.  If 'this' collection is empty, an error is thrown.
            @param selector Optional, the function that projects the value of which to determine a maximum
        */
        max: function (selector)
        {
            if (this.array.length == 0)
                throw new Error("No maximum element.");

            selector = linq_helper.createLambda(selector);

            if ((selector != null) && !linq_helper.isFunction(selector))
                throw new Error("Invalid selector.");

            linq_helper.processDeferredSort(this);

            var len = this.array.length;
            var maxValue = (selector == null ? this.array[0] : selector(this.array[0]));

            for (var i = 1; i < len; i++)
            {
                if (i in this.array)
                {
                    var tempValue = (selector == null ? this.array[i] : selector(this.array[i]));

                    if (tempValue > maxValue)
                        maxValue = tempValue;
                }
            }

            return maxValue;
        },

        /**
            Returns the "maximum" element of 'this' collection, determined by the value projected by 
            the 'selector' function.  If 'this' collection is empty, an error is thrown.
            @param selector Optional, the function that projects the value to used to determine a maximum element
        */
        maxBy: function (selector)
        {
            if (this.array.length == 0)
                throw new Error("No maximum element.");

            selector = linq_helper.createLambda(selector);

            if ((selector == null) || !linq_helper.isFunction(selector))
                throw new Error("Invalid selector.");

            linq_helper.processDeferredSort(this);

            var len = this.array.length;
            var maxValue = selector(this.array[0]);
            var maxObject = this.array[0];

            for (var i = 1; i < len; i++)
            {
                if (i in this.array)
                {
                    var tempObject = this.array[i];
                    var tempValue = selector(tempObject);

                    if (tempValue > maxValue)
                    {
                        maxValue = tempValue;
                        maxObject = tempObject;
                    }
                }
            }

            return maxObject;
        },

        /**
            Returns the elements of 'this' collection sorted in ascending order of the projected value
            given by the 'keySelector' function, using the 'comparer' function to compare the projected
            values.  If the 'comparer' function is not given, a comparer that uses the natural ordering 
            of the values will be used to compare the projected values.  Note that subsequent, immediate 
            calls to either thenBy or thenByDescending will provide subsequent "levels" of sorting (that 
            is, sorting when two elements are determined to be equal by this orderBy call).
            @param keySelector The function that projects the value used to sort the elements
            @param comparer Optional, the function that compares projected values
        */
        orderBy: function (keySelector, comparer)
        {
            keySelector = linq_helper.createLambda(keySelector);
            comparer = linq_helper.createLambda(comparer);

            if ((keySelector == null) || !linq_helper.isFunction(keySelector))
                throw new Error("Invalid key selector.");

            if ((comparer != null) && !linq_helper.isFunction(comparer))
                throw new Error("Invalid comparer.");

            if (comparer == null)
                comparer = linq_helper.defaultStringComparer;

            linq_helper.processDeferredSort(this);

            var results = new linq(this.array);

            results.deferredSort = { keySelector: keySelector, comparer: comparer, reverse: false, next: null };

            return results;
        },

        /**
            Returns the elements of 'this' collection sorted in descending order of the projected value
            given by the 'keySelector' function, using the 'comparer' function to compare the projected
            values.  If the 'comparer' function is not given, a comparer that uses the natural ordering 
            of the values will be used to compare the projected values.  Note that subsequent, immediate 
            calls to either thenBy or thenByDescending will provide subsequent "levels" of sorting (that 
            is, sorting when two elements are determined to be equal by this orderBy call).
            @param keySelector The function that projects the value used to sort the elements
            @param comparer Optional, the function that compares projected values
        */
        orderByDescending: function (keySelector, comparer)
        {
            keySelector = linq_helper.createLambda(keySelector);
            comparer = linq_helper.createLambda(comparer);

            if ((keySelector == null) || !linq_helper.isFunction(keySelector))
                throw new Error("Invalid key selector.");

            if ((comparer != null) && !linq_helper.isFunction(comparer))
                throw new Error("Invalid comparer.");

            if (comparer == null)
                comparer = linq_helper.defaultStringComparer;

            linq_helper.processDeferredSort(this);

            var results = new linq(this.array);

            results.deferredSort = { keySelector: keySelector, comparer: comparer, reverse: true, next: null };

            return results;
        },

        /**
            Returns a collection the same elements as 'this' collection but with extra elements added 
            to the end so that the results collection has a length of at least 'width'.  The extra
            elements that are added are equal to the 'padding' value.
            @param width The length that the results collection will be at least equal to
            @param padding The value that is added to the results collection to fill it out
        */
        pad: function (width, padding)
        {
            if ((width == null) || isNaN(width))
                throw new Error("Invalid width.");

            linq_helper.processDeferredSort(this);

            var len = this.array.length;

            if (len >= width)
                return new linq(this.array);

            return new linq(this.array.concat(linq.repeat(padding, width - len).array), false);
        },

        /**
            Returns a collection the same elements as 'this' collection but with extra elements added 
            to the end so that the results collection has a length of at least 'width'.  The extra
            elements that are added are determined by the 'paddingSelector' function.  
            @param width The length that the results collection will be at least equal to
            @param paddingSelector The function that indicates the value to add to the results collection
        */
        padWith: function (width, paddingSelector)
        {
            if ((width == null) || isNaN(width))
                throw new Error("Invalid width");

            paddingSelector = linq_helper.createLambda(paddingSelector);

            if ((paddingSelector == null) || !linq_helper.isFunction(paddingSelector))
                throw new Error("Invalid padding selector.");

            linq_helper.processDeferredSort(this);

            var len = this.array.length;

            if (len >= width)
                return new linq(this.array);

            var paddingArray = [];

            for (var i = len; i < width; i++)
            {
                paddingArray.push(paddingSelector(i));
            }

            return new linq(this.array.concat(paddingArray), false);
        },

        /**
            Returns the same elements as 'this' collection, but first executes an 'action' on
            each element of 'this' collection.
            @param action The function to execute on each element of 'this' collection
        */
        pipe: function (action)
        {
            action = linq_helper.createLambda(action);

            if ((action == null) || !linq_helper.isFunction(action))
                throw new Error("Invalid action.");

            linq_helper.processDeferredSort(this);

            var len = this.array.length;

            for (var i = 0; i < len; i++)
            {
                if (i in this.array)
                {
                    action(this.array[i], i);
                }
            }

            return new linq(this.array);
        },

        /**
            Returns 'this' collection with the 'value' prepended (i.e, added to the front).
            @param value The value to be prepended to 'this' collection
        */
        prepend: function (value)
        {
            linq_helper.processDeferredSort(this);

            return new linq([value].concat(this.array), false);
        },

        /**
            Returns an equal-length collection where the N-th element is the aggregate of the
            'operation' function performed on the first N-1 elements of 'this' collection (the
            first element of the results is set to the 'identity' value).  The 'operation' 
            function should be a commutative, binary operation (e.g., sum, multiplication, etc.)
            @param operation The function that aggregates the values of 'this' collection
        */
        prescan: function (operation, identity)
        {
            operation = linq_helper.createLambda(operation);

            if ((operation == null) || !linq_helper.isFunction(operation))
                throw new Error("Invalid operation.");

            linq_helper.processDeferredSort(this);

            var len = this.array.length;

            if (len == 0)
                return new linq([], false);

            var aggregate = identity;
            var results = [aggregate];

            for (var i = 0; i < len - 1; i++)
            {
                if (i in this.array)
                {
                    aggregate = operation(aggregate, this.array[i]);
                    results.push(aggregate);
                }
            }

            return new linq(results, false);
        },

        /**
            Returns the elements of 'this' collection in reverse order.
        */
        reverse: function ()
        {
            linq_helper.processDeferredSort(this);

            return new linq(this.array.reverse(), false);
        },

        /**
            Returns an equal-length collection where the N-th element is the aggregate of 
            the 'operation' function performed on the first N elements of 'this' collection.  
            The 'operation' function should be a commutative, binary operation (e.g., sum, 
            multiplication, etc.).
            @param operation The function that aggregates the values of 'this' collection
        */
        scan: function (operation)
        {
            operation = linq_helper.createLambda(operation);

            if ((operation == null) || !linq_helper.isFunction(operation))
                throw new Error("Invalid operation.");

            linq_helper.processDeferredSort(this);

            var len = this.array.length;

            if (len == 0)
                throw new Error("Cannot scan on empty collection.");

            var aggregate = this.array[0];
            var results = [aggregate];

            for (var i = 1; i < len; i++)
            {
                if (i in this.array)
                {
                    aggregate = operation(aggregate, this.array[i]);
                    results.push(aggregate);
                }
            }

            return new linq(results, false);
        },

        /**
            Returns a collection of values projected from the elements of 'this' collection.
            @param selector The function that projects values from the elements
        */
        select: function (selector)
        {
            selector = linq_helper.createLambda(selector);

            if ((selector == null) || !linq_helper.isFunction(selector))
                throw new Error("Invalid selector.");

            linq_helper.processDeferredSort(this);

            return new linq(linq_helper.map(this.array, selector), false);
        },

        /**
            Returns the concatenation of values projected from the elements of 'this' collection by the
            'collectionSelector' function.  If the 'resultSelector' function is given, then the results
            returned by this function will be projected from an element in the concatenation and the 
            element that originated the part of the concatenation.  Otherwise, the results returned by
            this function will be the element of the concatenation.
            @param collectionSelector The function that projects a collection of values from an element 
            @param resultSelector Optional, the function that projects the results from the concatenated results
        */
        selectMany: function (collectionSelector, resultSelector)
        {
            collectionSelector = linq_helper.createLambda(collectionSelector);
            resultSelector = linq_helper.createLambda(resultSelector);

            if ((collectionSelector == null) || !linq_helper.isFunction(collectionSelector))
                throw new Error("Invalid collection selector.");

            if ((resultSelector != null) && !linq_helper.isFunction(resultSelector))
                throw new Error("Invalid result selector.");

            linq_helper.processDeferredSort(this);

            var innerLength = this.array.length;
            var results = [];

            for (var i = 0; i < innerLength; i++)
            {
                var outerItem = this.array[i];
                var outerArray = collectionSelector(outerItem, i);

                if (!linq_helper.isArray(outerArray))
                    outerArray = (linq.from(outerArray)).toArray();

                if ((outerArray != null) && (outerArray.length > 0))
                {
                    var outerLength = outerArray.length;

                    for (var j = 0; j < outerLength; j++)
                    {
                        var innerItem = outerArray[j];
                        var innerResult = (resultSelector == null ? innerItem : resultSelector(innerItem, outerItem));

                        results.push(innerResult);
                    }
                }
            }

            return new linq(results, false);
        },

        /**
            Returns whether 'this' collection is equal to the 'second' collection (that is, has the same elements in the
            same order).  If the 'comparer' function is given, it is used to determine whether elements from each of the
            two collections are equal.  Otherwise, the "===" operator is used to determine equality.
            @param second The collection to which 'this' collection is compared
            @param comparer Optional, the function used to compare elements of the two collections
        */
        sequenceEqual : function (second, comparer)
        {
            if (second == null)
                return false;

            comparer = linq_helper.createLambda(comparer);

            if ((comparer != null) && !linq_helper.isFunction(comparer))
                throw new Error("Invalid comparer");
                
            if (comparer != null)
                comparer = linq_helper.normalizeComparer(comparer);

            linq_helper.processDeferredSort(this);

            var secondLinq = linq.from(second);

            linq_helper.processDeferredSort(secondLinq);

            var len = this.array.length;

            if (len != secondLinq.array.length)
                return false;

            for (var i = 0; i < len; i++)
            {
                if (comparer == null)
                {
                    if (this.array[i] !== secondLinq.array[i])
                        return false;
                }
                else if (!comparer(this.array[i], secondLinq.array[i]))
                    return false;
            }

            return true;
        },

        /**
            Returns whether 'this' collection is equivalent to the 'second' collection (that is, has the 
            same elements regardless of order).  If the 'comparer' function is given, it is used to determine
            whether elements from each of the two collections are equal.  Otherwise, the "===" operator is
            used to determine equality.
            @param second The collection to which 'this' collection is compared
            @param comparer Optional, the function used to compare elements of the two collections
        */
        sequenceEquivalent: function (second, comparer)
        {
            if (second == null)
                return false;

            comparer = linq_helper.createLambda(comparer);

            if ((comparer != null) && !linq_helper.isFunction(comparer))
                throw new Error("Invalid comparer.");
                
            if (comparer != null)
                comparer = linq_helper.normalizeComparer(comparer);

            linq_helper.processDeferredSort(this);

            var secondLinq = linq.from(second);

            linq_helper.processDeferredSort(secondLinq);

            var len1 = this.array.length;
            var len2 = secondLinq.array.length;

            if (len1 != len2)
                return false;

            var lookup1 = this.toLookup("x => x", comparer);
            var lookup2 = secondLinq.toLookup("x => x", comparer);

            return ((lookup1.count() == lookup2.count()) &&
                lookup1.all(function (x)
                {
                    var lookupNode = lookup2.firstOrDefault(null, function (y)
                    {
                        if (comparer == null)
                            return (y.key === x.key);
                        else
                            return comparer(y.key, x.key);
                    });

                    if (lookupNode == null)
                        return false;

                    return (x.values.length == lookupNode.values.length);
                }));
        },

        /**
            Returns either the only element of 'this' collection (if 'predicate' is not given) or the
            first (and only) element of 'this' collection that satisfies the 'predicate' (if 'predicate' is 
            given).  If there are either multiple elements in 'this' collection (if 'predicate is not given)
            or there are multiple elements that satisfy the 'predicate' (if 'predicate' is given), then an
            error is thrown.  If there is no "single" element (either because 'this' collection is empty or
            no element satisfies the 'predicate'), an error is thrown.
            @param predicate Optional, the predicate function used to determine the element to return
        */
        single: function (predicate)
        {
            predicate = linq_helper.createLambda(predicate);

            if (predicate == null)
            {
                if (this.array.length == 0)
                    throw new Error("No single item in the collection.");

                if (this.array.length > 1)
                    throw new Error("More than one item in the collection.");

                linq_helper.processDeferredSort(this);

                return this.array[0];
            }

            if (!linq_helper.isFunction(predicate))
                throw new Error("Invalid predicate.");

            linq_helper.processDeferredSort(this);

            var len = this.array.length;
            var isFound = false;
            var foundValue = null;

            for (var i = 0; i < len; i++)
            {
                if ((i in this.array) && predicate(this.array[i]))
                {
                    if (isFound)
                        throw new Error("More than one item matched the predicate in the collection.");

                    isFound = true;
                    foundValue = this.array[i];
                }
            }

            if (!isFound)
                throw new Error("No single item matched the predicate in the collection.");

            return foundValue;
        },

        /**
            Returns either the only element of 'this' collection (if 'predicate' is not given) or the
            first (and only) element of 'this' collection that satisfies the 'predicate' (if 'predicate' is 
            given).  If there are either multiple elements in 'this' collection (if 'predicate is not given)
            or there are multiple elements that satisfy the 'predicate' (if 'predicate' is given), then an
            error is thrown.  If there is no "single" element (either because 'this' collection is empty or
            no element satisfies the 'predicate'), the 'defaultValue' is returned.
            
            Alternately, if only one parameter is passed to this function and that single parameter is a
            function, then it will be treated as the 'predicate' and the 'defaultValue' will be considered
            to be null.
            @param defaultValue The default value that is returned if no "single" element is found
            @param predicate Optional, the predicate function used to determine the element to return
        */
        singleOrDefault: function (defaultValue, predicate)
        {
            // If there is only one parameter, and it is a function, then assume that it is
            // the predicate and that the defaultValue is null
            if (arguments.length == 1 && linq_helper.isFunction(defaultValue))
            {
                predicate = defaultValue;
                defaultValue = null;
            }
            
            predicate = linq_helper.createLambda(predicate);

            if (predicate == null)
            {
                if (this.array.length == 0)
                    return defaultValue;

                if (this.array.length > 1)
                    throw new Error("More than one item in the collection.");

                linq_helper.processDeferredSort(this);

                return this.array[0];
            }

            if (!linq_helper.isFunction(predicate))
                throw new Error("Invalid predicate.");

            linq_helper.processDeferredSort(this);

            var len = this.array.length;
            var isFound = false;
            var foundValue = null;

            for (var i = 0; i < len; i++)
            {
                if ((i in this.array) && predicate(this.array[i]))
                {
                    if (isFound)
                        throw new Error("More than one item matched the predicate in the collection.");

                    isFound = true;
                    foundValue = this.array[i];
                }
            }

            return (isFound ? foundValue : defaultValue);
        },

        /**
            Returns either the only element of 'this' collection or the value returned by the 'fallback'
            function if 'this' collection is empty.  If there are more than one element in 'this' collection,
            then an exception will be thrown.
            @param fallback The function that determines the value to return if there are no elements in 'this' collection
        */
        singleOrFallback: function (fallback)
        {
            fallback = linq_helper.createLambda(fallback);

            if ((fallback == null) || !linq_helper.isFunction(fallback))
                throw new Error("Invalid fallback");

            linq_helper.processDeferredSort(this);

            if (this.array.length == 0)
                return fallback();
            else if (this.array.length == 1)
                return this.array[0];
            else
                throw new Error("More than one item in the collection.");

        },

        /**
            Returns the elements of 'this' collection with the first 'count' number of elements skipped.
            @param count The number of elements to skip from 'this' collection
        */
        skip: function (count)
        {
            if ((count == null) || isNaN(count))
                throw new Error("Invalid count.");

            linq_helper.processDeferredSort(this);

            return new linq(this.array.slice(count), false);
        },

        /**
            Returns the elements of 'this' collection, skipping initial elements until an element satisfies
            the 'predicate' function (that first element that satisfies the 'predicate' function is 
            included in the results).
            @param predicate The function that indicates when to stop skipping elements
        */
        skipUntil: function (predicate)
        {
            predicate = linq_helper.createLambda(predicate);

            if ((predicate == null) || !linq_helper.isFunction(predicate))
                throw new Error("Invalid predicate");

            return this.skipWhile(function (x) { return !predicate(x); });
        },

        /**
            Returns the elements of 'this' collection skipping initial elements until an element does not
            satisfy the 'predicate' function (that first element that fails to satisfy the 'predicate' function
            is included in the results).
            @param predicate The function that indicates which of the initial elements to skip
        */
        skipWhile: function (predicate)
        {
            predicate = linq_helper.createLambda(predicate);

            if ((predicate == null) || !linq_helper.isFunction(predicate))
                throw new Error("Invalid predicate.");

            linq_helper.processDeferredSort(this);

            var len = this.array.length;
            var results = [];
            var isSkipping = true;

            for (var i = 0; i < len; i++)
            {
                var value = this.array[i];

                if (!isSkipping)
                    results.push(value);
                else if (!predicate(value))
                {
                    isSkipping = false;
                    results.push(value);
                }
            }

            return new linq(results, false);
        },

        /**
            Returns either the sum of the elements of 'this' collection (if 'selector' is not given) or the
            sum of the projected value of each element of 'this' collection (if 'selector' is given).
            @param selector Optional, the function that projects the values to be summed
        */
        sum: function (selector)
        {
            linq_helper.processDeferredSort(this);

            if (this.array.length == 0)
                return 0;

            selector = linq_helper.createLambda(selector);

            if ((selector != null) && (!linq_helper.isFunction(selector)))
                throw new Error("Invalid selector.");

            var len = this.array.length;
            var sumValue = 0;

            for (var i = 0; i < len; i++)
            {
                if (i in this.array)
                {
                    var value = (selector == null ? this.array[i] : selector(this.array[i]));

                    if (value != null)
                        sumValue += value;
                }
            }

            return sumValue;
        },

        /**
            Returns the elements of 'this' collection taking only the first 'count' number of elements.
            @param count The number of elements to take from the beginning of the collection
        */
        take: function (count)
        {
            if ((count == null) || isNaN(count))
                throw new Error("Invalid count.");

            linq_helper.processDeferredSort(this);

            return new linq(this.array.slice(0, count), false);
        },

        /**
            Returns every n-th (n = step) element of 'this' collection.
            @param step The number of elements to bypass before returning the next element
        */
        takeEvery: function (step)
        {
            if ((step == null) || isNaN(step))
                throw new Error("Invalid count.");

            linq_helper.processDeferredSort(this);

            return this.where(function (x, i) { return (i % step) == 0; });
        },

        /**
            Returns the elements of 'this' collection, taking only the last 'count' number of elements.
            @param count The number of elements to take from the end of the collection
        */
        takeLast: function (count)
        {
            if ((count == null) || isNaN(count))
                throw new Error("Invalid count.");

            linq_helper.processDeferredSort(this);

            if (count <= 0)
                return new linq([], false);

            if (count > this.array.length)
                count = this.array.length;

            return new linq(this.array.slice(this.array.length - count), false);
        },

        /**
            Returns the elements of 'this' collection taking element until an element satisfies the
            'predicate' function (that first element that satisfies the 'predicate' function is not
            included in the results).
            @param predicate The function that indicates when to stop including elements in the results
        */
        takeUntil: function (predicate)
        {
            predicate = linq_helper.createLambda(predicate);

            if ((predicate == null) || !linq_helper.isFunction(predicate))
                throw new Error("Invalid predicate");

            return this.takeWhile(function (x) { return !predicate(x); });
        },

        /**
            Returns the elements of 'this' collection taking elements until an element does not satisfy
            the 'predicate' function (that first element that fails to satisfy the 'predicate' function
            is not included in the results).
            @param predicate The function that indicates which of the initial elements to include in the results
        */
        takeWhile: function (predicate)
        {
            predicate = linq_helper.createLambda(predicate);

            if ((predicate == null) || !linq_helper.isFunction(predicate))
                throw new Error("Invalid predicate.");

            linq_helper.processDeferredSort(this);

            var len = this.array.length;
            var results = [];
            var isTaking = true;

            for (var i = 0; (i < len) && isTaking; i++)
            {
                var value = this.array[i];

                if (!predicate(value))
                    isTaking = false;
                else
                    results.push(value);
            }

            return new linq(results, false);
        },

        /**
            Returns the elements of 'this' collection further sorted (from an immediately preceeding orderBy 
            call) in ascending order of the projected value given by the 'keySelector' function, using the
            'comparer' function to compare the projected values.  If the 'comparer' function is not given,
            a comparer that uses the natural ordering of the values will be used to compare the projected values.  
            Note that this thenBy call must be immediately preceeded by either an orderBy, orderByDescending, 
            thenBy, or thenByDescending call.
            @param keySelector The function that projects the value used to sort elements
            @param comparer Optional, the function that compares projected values
        */
        thenBy: function (keySelector, comparer)
        {
            keySelector = linq_helper.createLambda(keySelector);
            comparer = linq_helper.createLambda(comparer);

            if ((keySelector == null) || !linq_helper.isFunction(keySelector))
                throw new Error("Invalid key selector.");

            if ((comparer != null) && !linq_helper.isFunction(comparer))
                throw new Error("Invalid comparer.");

            if (this.deferredSort == null)
                throw new Error("ThenBy can only be called following an OrderBy/OrderByDescending.");

            if (comparer == null)
                comparer = linq_helper.defaultStringComparer;

            var results = new linq(this.array);

            results.deferredSort = linq_helper.extendDeferredSort(this.deferredSort, { keySelector: keySelector, comparer: comparer, reverse: false, next: null });

            return results;
        },

        /**
            Returns the elements of 'this' collection further sorted (from an immediately preceeding orderBy 
            call) in descending order of the projected value given by the 'keySelector' function, using the
            'comparer' function to compare the projected values.  If the 'comparer' function is not given,
            a comparer that uses the natural ordering of the values will be used to compare the projected values.  
            Note that this thenBy call must be immediately preceeded by either an orderBy, orderByDescending, 
            thenBy, or thenByDescending call.
            @param keySelector The function that projects the value used to sort elements
            @param comparer Optional, the function that compares projected values
        */
        thenByDescending: function (keySelector, comparer)
        {
            keySelector = linq_helper.createLambda(keySelector);
            comparer = linq_helper.createLambda(comparer);

            if ((keySelector == null) || !linq_helper.isFunction(keySelector))
                throw new Error("Invalid key selector.");

            if ((comparer != null) && !linq_helper.isFunction(comparer))
                throw new Error("Invalid comparer.");

            if (this.deferredSort == null)
                throw new Error("ThenByDescending can only be called following an OrderBy/OrderByDescending.");

            if (comparer == null)
                comparer = linq_helper.defaultStringComparer;

            var results = new linq(this.array);

            results.deferredSort = linq_helper.extendDeferredSort(this.deferredSort, { keySelector: keySelector, comparer: comparer, reverse: true, next: null });

            return results;
        },

        /**
            Returns a string consisting of all of the elements of 'this' collection delimited by the given
            'delimiter' value.  If a 'delimiter' value is not given, then the delimiter "," is used.
            @param delimiter The delimiter separating the elements in the results
        */
        toDelimitedString: function (delimiter)
        {
            if (delimiter == null)
                delimiter = ',';

            linq_helper.processDeferredSort(this);

            return this.array.join(delimiter);
        },

        /**
            Returns an object that represents a "dictionary" of the elements of 'this' collection.  The
            'keySelector' function is used to project the "key" value for each element of 'this' collection.
            If the 'elementSelector' function is given, the "value" associated with each "key" value is the
            value projected by the 'elementSelector' function.  If the 'elementSelector' function is not 
            given, the "value" associated with each "key" value is the element, itself.
            @param keySelector The function that projects the key for each element
            @param elementSelector Optional, the function that projects the value for each key
        */
        toDictionary: function (keySelector, elementSelector)
        {
            keySelector = linq_helper.createLambda(keySelector);
            elementSelector = linq_helper.createLambda(elementSelector);

            if ((keySelector == null) || !linq_helper.isFunction(keySelector))
                throw new Error("Invalid key selector.");

            if ((elementSelector != null) && !linq_helper.isFunction(elementSelector))
                throw new Error("Invalid element selector.");

            linq_helper.processDeferredSort(this);

            var len = this.array.length;
            var results = {};

            for (var i = 0; i < len; i++)
            {
                var value = this.array[i];
                var key = keySelector(value);

                if (key in results)
                    throw new Error("Duplicate key in collection.");

                results[key] = (elementSelector == null ? value : elementSelector(value));
            }

            return results;
        },

        /**
            Returns a jQuery collection containing the elements of 'this' collection.  If jQuery is not
            available, an exception will be thrown.
        */
        toJQuery: function ()
        {
            if (!jQuery)
                throw new Error("Cannot return jQuery object--jQuery not available.");

            linq_helper.processDeferredSort(this);

            return jQuery(this.array);
        },

        /**
            Returns a lookup-collection with the elements of 'this' collection grouped by a key
            projected by the 'keySelector' function.  If the optional 'comparer' is provided, then
            the comparer will be used to determine equality between keys.  If the 'comparer is not
            provided, the '===' operator will be used to determine equality between keys.
            @param keySelector The function used to project keys from the elements of 'this' collection
            @param comparer Optional, the function used to compare keys
        */
        toLookup: function (keySelector, comparer)
        {
            keySelector = linq_helper.createLambda(keySelector);
            comparer = linq_helper.createLambda(comparer);

            if ((keySelector == null) || !linq_helper.isFunction(keySelector))
                throw new Error("Invalid key selector.");

            if ((comparer != null) && !linq_helper.isFunction(comparer))
                throw new Error("Invalid comparer");
                
            if (comparer != null)
                comparer = linq_helper.normalizeComparer(comparer);

            linq_helper.processDeferredSort(this);

            var results = new linq([], false);
            var len = this.array.length;

            for (var i = 0; i < len; i++)
            {
                if (i in this.array)
                {
                    var item = this.array[i];
                    var key = keySelector(item);

                    var lookupNode = results.firstOrDefault(null, function (x)
                    {
                        if (comparer == null)
                            return x.key === key;
                        else
                            return comparer(x.key, key);
                    });

                    if (lookupNode == null)
                    {
                        lookupNode = { key: key, values: [] };
                        results.array.push(lookupNode);
                    }

                    lookupNode.values.push(item);
                }
            }

            return results;
        },

        /**
            Returns the union of elements in 'this' collection and the 'second' collection, using the
            'comparer' function to determine whether two different elements are equal.  If the 'comparer'
            function is not given, then the "===" operator will be used to compare elements.
            @param second The collection of elements to test for union
            @param comparer Optional, the function used to compare elements
        */
        union: function (second, comparer)
        {
            comparer = linq_helper.createLambda(comparer);

            if ((comparer != null) && !linq_helper.isFunction(comparer))
                throw new Error("Invalid comparer.");
                
            if (comparer != null)
                comparer = linq_helper.normalizeComparer(comparer);

            linq_helper.processDeferredSort(this);

            var secondLinq = linq.from(second == null ? [] : second);

            linq_helper.processDeferredSort(secondLinq);

            var len = this.array.length;
            var results = new linq([], false);

            for (var i = 0; i < len; i++)
            {
                if (i in this.array)
                {
                    var value = this.array[i];

                    var inResults = linq_helper.some(results.array, function (x)
                    {
                        if (comparer == null)
                            return (x === value);
                        else
                            return comparer(x, value);
                    });

                    if (!inResults)
                        results.array.push(value);
                }
            }

            len = secondLinq.array.length;

            for (var i = 0; i < len; i++)
            {
                if (i in secondLinq.array)
                {
                    var value = secondLinq.array[i];

                    var inResults = linq_helper.some(results.array, function (x)
                    {
                        if (comparer == null)
                            return (x === value);
                        else
                            return comparer(x, value);
                    });

                    if (!inResults)
                        results.array.push(value);
                }
            }

            return results;
        },

        /**
            Returns the elements of 'this' collection that satisfy the 'predicate' function.
            @param predicate The function that determines which elements to return
        */
        where: function (predicate)
        {
            predicate = linq_helper.createLambda(predicate);

            if ((predicate == null) || !linq_helper.isFunction(predicate))
                throw new Error("Invalid predicate.");

            linq_helper.processDeferredSort(this);

            return new linq(linq_helper.filter(this.array, predicate), false);
        },

        /**
            Returns 'this' collection "zipped-up" with the 'second' collection such that each value of the
            returned collection is the value projected from the corresponding element from each of 'this'
            collection and the 'second' collection.  If the size of 'this' collection and the 'second' 
            collection are not equal, the size of the returned collection will equal the minimum of the
            sizes of 'this' collection and the 'second' collection.
            @param second The collection to zip with 'this' collection
            @param resultSelector Optional, the function to use to project the result values
        */
        zip: function (second, resultSelector)
        {
            resultSelector = linq_helper.createLambda(resultSelector);

            if ((resultSelector != null) && !linq_helper.isFunction(resultSelector))
                throw new Error("Invalid result selector.");
                
            if (resultSelector == null)
                resultSelector = linq_helper.merge;

            linq_helper.processDeferredSort(this);

            if (second == null)
                return new linq([], false);

            var secondLinq = linq.from(second);

            linq_helper.processDeferredSort(secondLinq);

            var len = Math.min(this.array.length, secondLinq.array.length);
            var results = [];

            for (var i = 0; i < len; i++)
            {
                results.push(resultSelector(this.array[i], secondLinq.array[i]));
            }

            return new linq(results, false);
        },

        /**
            Returns 'this' collection "zipped-up" with the 'second' collection such that each value of the
            returned collection is the value projected from the corresponding element from each of 'this'
            collection and the 'second' collection.  If the size of 'this' collection and the 'second' 
            collection are not equal, the size of the returned collection will equal the maximum of the
            sizes of 'this' collection and the 'second' collection, and the shorter collection with use
            values given by the 'defaultForFirst' and 'defaultForSecond' parameters (corresponding with
            which corresponding list is shorter).
            @param second The collection to zip with 'this' collection
            @param resultSelector Optional, the function to use to project the result values
        */
        zipLongest: function (second, defaultForFirst, defaultForSecond, resultSelector)
        {
            resultSelector = linq_helper.createLambda(resultSelector);

            if ((resultSelector != null) && !linq_helper.isFunction(resultSelector))
                throw new Error("Invalid result selector.");
                
            if (resultSelector == null)
                resultSelector = linq_helper.merge;

            linq_helper.processDeferredSort(this);

            var secondLinq = linq.from(second);

            linq_helper.processDeferredSort(secondLinq);

            var len = Math.max(this.array.length, secondLinq.array.length);
            var results = [];

            for (var i = 0; i < len; i++)
            {
                results.push(
                    resultSelector(
                        (i >= this.array.length ? defaultForFirst : this.array[i]), 
                        (i >= secondLinq.array.length ? defaultForSecond : secondLinq.array[i])));
            }

            return new linq(results, false);
        },

        /**
            Returns an array with the same elements as 'this' collection.
        */
        toArray: function ()
        {
            linq_helper.processDeferredSort(this);

            return this.array.slice(0);
        }
    };

    if (typeof module !== 'undefined' && module.exports)
        module.exports = linq;
    else
    {
        root.linq = linq;
        root.$linq = linq.from;
    }
})(this);