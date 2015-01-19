# $linq
*This project was migrated from the CodePlex site: http://jscriptlinq.codeplex.com*

### Project Description
$linq is a Javascript version of .NET's Linq to Objects, with some query operations inspired by MoreLinq (an extension to Linq to Objects).

### What is $linq?
$linq is an implementation of .NET Linq to Objects for Javascript.  It implements most of the corresponding .NET Linq to Objects methods.  It also implements some methods inspired by MoreLinq ([url:http://code.google.com/p/morelinq]).  $linq will work with arrays and jQuery collections.  $linq can also generate values from a numerical range, as an item repeated a given number of times, and from RegExp match results.

### NuGet package page
http://www.nuget.org/packages/jscriptlinq/

### Some of the Linq to Objects methods implemented
* select
* selectMany
* where
* orderBy
* thenBy
* distinct
* groupBy
* groupJoin
* join
* except
* union
* intersect
* take/takeWhile/takeUntil
* skip/skipWhile/skipUntil

### Examples
A simple example of breaking up a sequence of numbers into even and odd arrays:
``` javascript
var list = $linq([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

var evens = list.where(function (x) { return x % 2 == 0; }).toArray();
var odds = list.where("x => x % 2 == 1").toArray();
```
Ordering a list of people:
``` javascript
var people = [{first: "Jason", last: "Bourne"},
    {first: "Gandalf", last: "The Grey"},
    {first: "John", last: "Smith"},
    {first: "Albert", last: "Smith"}];
    
var results = $linq(people)
    .orderBy(function (x) { return x.last; })
    .thenBy("x => x.first")
    .toArray();
```
Using an inner join:
``` javascript
var users = [{username: "asmith", domain: "north_america"},
    {username: "tmcfarland", domain: "europe"},
    {username: "cdeckard", domain: "north_america"}];
    
var groups = [{user: "ASMITH", groupName: "base_users"},
    {user: "TMCFARLAND", groupName: "admins"},
    {user: "CDECKARD", groupName: "base_users"},
    {user: "CDECKARD", groupName: "testers"}];
    
var results = $linq(users).join(groups,
    function (x) { return x.username; },    // key for 'users'
    "x => x.user",                          // key for 'groups'
    function (outer, inner)                 // function to generate results
    { 
        return "user: " + outer.username + 
            ", domain: " + outer.domain +
            ", group: " + inner.groupName;
    },
    "(x, y) => x.toLowerCase() == y.toLowerCase()");    
```
### License
The MIT License (MIT)
Copyright (c) 2012 Kurtis Jones

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
