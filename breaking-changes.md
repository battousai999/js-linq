# Breaking Changes

Version 2.0.0 is a rewrite of the $linq library in ES6—a version of JavaScript that provides access to new features, such as [generators](http://es6-features.org/#GeneratorFunctionIteratorProtocol) and [lambda functions](http://es6-features.org/#ExpressionBodies), that allow this library to finally have lazily-evaluated functions (like many of the .NET Linq-to-Objects functions are).

The following are breaking changes between version 1.6.0 and 2.0.0.

## The `linq` function is now the `Linq` class

In version 1.6.0, the library was encapsulated in the "linq" function/constructor.  For example:

```
// Constructor used to create a linq object
var col1 = new linq([1, 2, 3]);

// Helper and comparer methods
var value1 = linq.isArray([1, 2, 3]);
var value2 = linq.caseInsensitiveComparer('yes', 'YES');

// "Static"-like constructor functions
var col2 = linq.from([1, 2, 3]);
var col3 = linq.range(1, 100);
```

In version 2.0.0, these are now provided in the `Linq` class.  For example:

```
// Constructor used to create a linq object
let col1 = new Linq([1, 2, 3]);

// Helper and comparer methods
let value1 = Linq.isArray([1, 2, 3]);
let value2 = Linq.caseInsensitiveStringComparer('yes', 'YES');

// "Static"-like constructor functions
let col2 = Linq.from([1, 2, 3]);
let col3 = Linq.range(1, 100);
```

This breaking change can be mitigated by using the following assignment to the "global" object (assuming `window`, for this example):

```
window.linq = window.Linq;
```

## The `array` property is no longer exposed

Although not highly visible in version 1.6.0, a linq object had an `array` property that exposed the internal array for the linq object:

```
var col = $linq([1, 2, 3]);
var arr = col.array;
```

This `array` property no longer exists in version 2.0.0.  Instead, the `toArray` function should be used:

```
let col = Linq.from([1, 2, 3]);
let arr = col.toArray();
```

## $linq operators no longer accept "string lamba functions"

In version 1.6.0, linq object functions that took functions as parameters (such as selectors, comparers, projections, etc.) could take "lambda functions" in string format in place of those functions.  For instance:

```
var col = linq.from([1, 2, 3]);
var results = col.select("x => x + 1").toArray();
```

Since ES6 provides proper lambda functions, version 2.0.0 no longer accepts these "string" versions of lambda functions.  Instead, either proper lambda functions should be used, or the functions should be expressed in inline function form.  For example:

```
let col = Linq.from([1, 2, 3]);
let results1 = col.select(x => x + 1).toArray();
let results2 = col.select(function (x) { return x + 1; }).toArray();
```

Alternately, the following function (which is an internal helper function from version 1.6.0) can be used to convert the "string" lambda functions into proper functions.

```
function convertLambda (expr)
{
    if (typeof expr == "function")
        return expr;

    if ((typeof expr == typeof "") && (expr !== ""))
    {
        if (expr.indexOf("=>") < 0)
            return new Function("$,$$,$$$", "return " + expr);

        var match = expr.match(/^\s*\(?\s*([^)]*)\s*\)?\s*=>(.*)/);
        return new Function(match[1], "return " + match[2]);
    }

    return expr;
}
```

And then:

```
let col = Linq.from([1, 2, 3]);
let results = col.select(convertLambda("x => x + 1")).toArray();
```

## The order of parameters have chagned for the `firstOrDefault`, `singleOrDefault` and `lastOrDefault` functions

In version 1.6.0, the `firstOrDefault`, `singleOrDefault` and `lastOrDefault` functions all accepted `defaultValue` and `predicate` parameters in that unfortunate (i.e., different from .NET's Linq-to-objects) order:

```
var col = linq.from([1, 2, 3]);

var results1 = col.firstOrDefault(99, function (x) { return x > 50; });
var results2 = col.singleOrDefault(88, function (x) { return x > 2; });
var results3 = col.lastOrDefault(77, function (x) { return x > 0; });
```

Note, that with version 1.4.0, the `firstOrDefault` function (and with a later version, `lastOrDefault` and `singleOrDefault`) was modified to use the first parameter as the predicate if only one parameter was given and that parameter was a function.

In version 2.0.0, the parameters for these three function have been reversed to better match the parameter order of these functions in .NET's Linq-to-objects:

```
let col = Linq.from([1, 2, 3]);

let results1 = col.firstOrDefault(x => x > 50, 99);
let results2 = col.singleOrDefault(x => x > 2, 88);
let results3 = col.lastOrDefault(x => x > 0, 77);
```

## The `scan` function no longer throws an exception on an empty collection

In version 1.6.0, the `scan` function would throw an exception if called upon an empty collection.

It's not much of a "breaking" change, but in version 2.0.0, the `scan` function no longer throws an exception when called upon an empty collection.  If existing code relies upon that function throwing an exception for that case, then it will need to be refactored.

## The `caseInsensitiveComparer` and `caseSensitiveComparer` functions are now called `caseInsensitiveStringComparer` and `caseSensitiveStringComparer`, respectively

In version 1.6.0, the linq function provided two string comparers, `caseInsensitiveComparer` and `caseSensitiveComparer`.

```
var col = linq.from(['one', 'two', 'three']);

var results1 = col.contains('ONE', linq.caseInsensitiveComparer);
var results2 = col.contains('two', linq.caseSensitiveComparer);
```

In version 2.0.0, these two comparers have been renamed to `caseInsensitiveStringComparer` and `caseSensitiveStringComparer`, respectively.

```
let col = Linq.from(['one', 'two', 'three']);

var results1 = col.contains('ONE', linq.caseInsensitiveStringComparer);
var results2 = col.contains('two', linq.caseSensitiveStringComparer);
```
