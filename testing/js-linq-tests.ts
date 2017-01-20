import linq = require('js-linq');

var col: Linq;
var col2: Linq;

// from (constructor)
col = linq.from([1, 2, 3]);
col = linq.from(null);
col2 = linq.from(col);

// range (constructor)
col = linq.range(1, 11);
col = linq.range(1, 11, 3);

// repeat (constructor)
col = linq.repeat("stuff", 3);

// matches (constructor)
col = linq.matches("this is a test", "\\w+");
col = linq.matches("this is another test", /\w+/);
col = linq.matches("test_1 TEST_2 test_3 TeSt_4", "test_\\d", "i");

// properties (constructor)
col = linq.properties({ prop1: 'value1', prop2: 100 });
col = linq.properties(['aaa', 'bbb', 'ccc']);
col = linq.properties({ prop1: 'value1', prop2: 100 }, 'name', 'result');
col = linq.properties({ prop1: 'value1', prop2: 100 }, null, 'result');
col = linq.properties({ prop1: 'value1', prop2: 100 }, 'name', null);

// where
col = linq.from([1, 2, 3, 4]);
col2 = col.where(function (x) { return x < 4; });
col2 = col.where(x => x < 4);
col2 = col.where("x => x < 4");

// select 
col2 = col.select(function (x) { return x * 2; });
col2 = col.select(x => x * 2);
col2 = col.select("x => x * 2");

// count
let val: number;
val = col.count();
val = col.count(function (x) { return x % 2 == 0; });
val = col.count(x => x % 2 == 0);
val = col.count("x => x % 2 == 0");

// selectMany
col = linq.from([{ str: "test", list: [1, 2, 3] }, { str: "part", list: [4, 5, 6] }, { str: "time", list: [7, 8, 9] }]);
col2 = col.selectMany(function (x) { return x.list; }, function (x) { return "a" + x; });
col2 = col.selectMany(function (x) { return x.list; });

col2 = col.selectMany(
    function (x, i) { var l = x.list.slice(0); l.push((i + 1) * 10); return l; },
    function (x) { return "b" + x; });

col2 = col.selectMany(
    function (x, i) { var l = x.list.slice(0); l.push((i + 1) * 10); return l; },
    function (x, parent) { return parent.str + "-" + "b" + x; });

col2 = col.selectMany(
    function (x) { return linq.from(x.list).where(function (x) { return x % 2 == 0; }); },
    function (x) { return "c" + x; });

col2 = col.selectMany(x => x.list, x => 'a' + x);
col2 = col.selectMany("x => x.list", "x => 'a' + x");

// any
col = linq.from([1, 2, 3, 4]);
let val2: boolean;
val2 = col.any();
val2 = col.any(function (x) { return x % 2 == 0; });
val2 = col.any(x => x % 2 == 0);
val2 = col.any("x => x % 2 == 0");

// all
val2 = col.all();
val2 = col.all(function (x) { return x % 2 == 0; });
val2 = col.all(x => x % 2 == 0);
val2 = col.all("x => x % 2 == 0");

// first
val = col.first();
val = col.first(function (x) { return x > 3; });
val = col.first(x => x > 3);
val = col.first("x => x > 3");

// firstOrDefault
val = col.firstOrDefault(99, function (x) { return x > 3; });
val = col.firstOrDefault(99, x => x > 3);
val = col.firstOrDefault(99, "x => x > 3");
val = col.firstOrDefault(function (x) { return x > 3; });
val = col.firstOrDefault(x => x > 3);
val = col.firstOrDefault("x => x > 3");
val = col.firstOrDefault(99);

// single
val = col.single();
val = col.single(function (x) { return x > 3; });
val = col.single(x => x > 3);
val = col.single("x => x > 3");

// singleOrDefault
val = col.singleOrDefault(99, function (x) { return x > 3; });
val = col.singleOrDefault(99, x => x > 3);
val = col.singleOrDefault(99, "x => x > 3");
val = col.singleOrDefault(function (x) { return x > 3; });
val = col.singleOrDefault(x => x > 3);
val = col.singleOrDefault("x => x > 3");
val = col.singleOrDefault(99);

// last
val = col.last();
val = col.last(function (x) { return x > 3; });
val = col.last(x => x > 3);
val = col.last("x => x > 3");

// lastOrDefault
val = col.lastOrDefault(99, function (x) { return x > 3; });
val = col.lastOrDefault(99, x => x > 3);
val = col.lastOrDefault(99, "x => x > 3");
val = col.lastOrDefault(function (x) { return x > 3; });
val = col.lastOrDefault(x => x > 3);
val = col.lastOrDefault("x => x > 3");
val = col.lastOrDefault(99);

// defaultIfEmpty
col2 = col.defaultIfEmpty(99);

// distinct
col = linq.from(["one", "two", "three", "ONE", "TWO", "THREE"]);
col2 = col.distinct();
col2 = col.distinct(function (x, y) { return x.toLowerCase() == y.toLowerCase(); });
col2 = col.distinct((x, y) => x.toLowerCase() == y.toLowerCase());
col2 = col.distinct("(x, y) => x.toLowerCase() == y.toLowerCase()");

// distinctBy
col = linq.from([{ id: 1, name: 'steve' }, { id: 2, name: 'barbara' }, { id: 3, name: 'david' }, { id: 4, name: 'steve' }]);
col2 = col.distinctBy(function (x) { return x.name; });
col2 = col.distinctBy(x => x.name);
col2 = col.distinctBy("x => x.name");

// union
col = linq.from([1, 2, 3, 4]);
col2 = col.union(col);
col2 = col.union([1, 3, 3, 4, 5]);
col2 = col.union(null);
col = linq.from(["one", "two", "three"]);
col2 = col.union(col, function (x, y) { return x.toLowerCase() == y.toLowerCase(); });
col2 = col.union(col, (x, y) => x.toLowerCase() == y.toLowerCase());
col2 = col.union(col, "(x, y) => x.toLowerCase() == y.toLowerCase()");

// intersect
col = linq.from([1, 2, 3, 4]);
col2 = col.intersect(col);
col2 = col.intersect([1, 3, 3, 4, 5]);
col2 = col.intersect(null);
col = linq.from(["one", "two", "three"]);
col2 = col.intersect(col, function (x, y) { return x.toLowerCase() == y.toLowerCase(); });
col2 = col.intersect(col, (x, y) => x.toLowerCase() == y.toLowerCase());
col2 = col.intersect(col, "(x, y) => x.toLowerCase() == y.toLowerCase()");

// except
col = linq.from([1, 2, 3, 4]);
col2 = col.except(col);
col2 = col.except([1, 3, 3, 4, 5]);
col2 = col.except(null);
col = linq.from(["one", "two", "three"]);
col2 = col.except(col, function (x, y) { return x.toLowerCase() == y.toLowerCase(); });
col2 = col.except(col, (x, y) => x.toLowerCase() == y.toLowerCase());
col2 = col.except(col, "(x, y) => x.toLowerCase() == y.toLowerCase()");

// join
col = linq.from([{ id: 1, name: 'steve', color: 'blue' }, { id: 2, name: 'paul', color: 'red' }, { id: 3, name: 'eve', color: 'pink' }, { id: 4, name: 'zoe', color: 'yellow' }]);

col2 = col.join(col, 
    function (x) { return x.id; },
    function (x) { return x.id + 1; },
    function (outer, inner) { return outer.name + ': ' + inner.name; });

col2 = col.join(col, x => x.id, x => x.id + 1, (outer, inner) => outer.name + ': ' + inner.name);
col2 = col.join(col, "x => x.id", "x => x.id + 1", "(outer, inner) => outer.name + ': ' + inner.name");
col2 = col.join(col, x => x.name, x => x.name, (outer, inner) => outer.name + ': ' + inner.name, (x, y) => x.toLowerCase() == y.toLowerCase());
col2 = col.join(col, x => x.name, x => x.name, (outer, inner) => outer.name + ': ' + inner.name, "(x, y) => x.toLowerCase() == y.toLowerCase()");

// groupBy
col = linq.from([{ name: 'steve', state: 'ut' }, { name: 'john', state: 'ut' }, { name: 'kelly', state: 'nv' }, { name: 'abbey', state: 'wa' }]);
col2 = col.groupBy(function (x) { return x.state; }, function (x) { return x.name; }, function (x, y) { return x.toLowerCase() == y.toLowerCase(); });
col2 = col.groupBy(x => x.state, x => x.name, (x, y) => x.toLowerCase() == y.toLowerCase());
col2 = col.groupBy("x => x.state", "x => x.name", "(x, y) => x.toLowerCase() == y.toLowerCase()");
col2 = col.groupBy(x => x.state, x => x.name);
col2 = col.groupBy(x => x.state);

// groupJoin
col = linq.from([{ id: 1, name: 'steve', color: 'blue' }, { id: 2, name: 'paul', color: 'red' }, { id: 3, name: 'eve', color: 'pink' }, { id: 4, name: 'zoe', color: 'grey' }]);
col2 = col.groupJoin(col, function (x) { return x.id; }, function (x) { return x.id; }, function (outer, inner) { return outer.name + inner.name; }, function (x, y) { return x.toLowerCase() == y.toLowerCase(); });
col2 = col.groupJoin(col, x => x.id, x => x.id, (outer, inner) => outer.name + inner.name, (x, y) => x.toLowerCase() == y.toLowerCase());
col2 = col.groupJoin(col, "x => x.id", "x => x.id", "(outer, inner) => outer.name + inner.name", "(x, y) => x.toLowerCase() == y.toLowerCase()");
col2 = col.groupJoin([], x => x.id, x => x.id, (outer, inner) => outer.name + inner.name);
col2 = col.groupJoin(null, x => x.id, x => x.id, (outer, inner) => outer.name + inner.name);

// take
col = linq.from([1, 2, 3, 4, 5]);
col2 = col.take(4);

// takeWhile
col2 = col.takeWhile(function (x) { return x > 3; });
col2 = col.takeWhile(x => x > 3);
col2 = col.takeWhile("x => x > 3");

// skip
col2 = col.skip(2);

// skipWhile
col2 = col.skipWhile(function (x) { return x > 3; });
col2 = col.skipWhile(x => x > 3);
col2 = col.skipWhile("x => x > 3");

// toDictionary
col = linq.from([{ prop: 'color', value: 'red' }, { prop: 'align', value: 'center' }, { prop: 'text', value: 'nicole' }]);
col2 = col.toDictionary(function (x) { return x.prop; }, function (x) { return x.value; });
col2 = col.toDictionary(x => x.prop, x => x.value);
col2 = col.toDictionary("x => x.prop", "x => x.value");
col2 = col.toDictionary(x => x.prop);

// reverse
col = linq.from([1, 2, 3, 4]);
col2 = col.reverse();

// sum
col = linq.from([1, 2, 3, 4]);
val = col.sum();
val = col.sum(function (x) { return x + 1; });
val = col.sum(x => x + 1);
val = col.sum("x => x + 1");

// min
val = col.min();
val = col.min(function (x) { return x + 1; });
val = col.min(x => x + 1);
val = col.min("x => x + 1");

// minBy
val = col.minBy(function (x) { return x + 1; });
val = col.minBy(x => x + 1);
val = col.minBy("x => x + 1");

// max
val = col.max();
val = col.max(function (x) { return x + 1; });
val = col.max(x => x + 1);
val = col.max("x => x + 1");

// maxBy
val = col.maxBy(function (x) { return x + 1; });
val = col.maxBy(x => x + 1);
val = col.maxBy("x => x + 1");

// average
val = col.average();
val = col.average(function (x) { return x + 1; });
val = col.average(x => x + 1);
val = col.average("x => x + 1");

// contains
val2 = col.contains(3);
val2 = col.contains("test");
val2 = col.contains("test", function (x, y) { return x.toLowerCase() == y.toLowerCase(); });
val2 = col.contains("test", (x, y) => x.toLowerCase() == y.toLowerCase());
val2 = col.contains("test", "(x, y) => x.toLowerCase() == y.toLowerCase()");
val2 = col.contains(3, (x, y) => x - y);

// sequenceEqual
val2 = col.sequenceEqual(col);
val2 = col.sequenceEqual([]);
val2 = col.sequenceEqual(null);
val2 = col.sequenceEqual(col, function (x, y) { return x == y; });
val2 = col.sequenceEqual(col, (x, y) => x == y);
val2 = col.sequenceEqual(col, "(x, y) => x == y");

// sequenceEquivalent
val2 = col.sequenceEquivalent(col);
val2 = col.sequenceEquivalent([]);
val2 = col.sequenceEquivalent(null);
val2 = col.sequenceEquivalent(col, function (x, y) { return x == y; });
val2 = col.sequenceEquivalent(col, (x, y) => x == y);
val2 = col.sequenceEquivalent(col, "(x, y) => x == y");

// zip
col2 = col.zip(col);
col2 = col.zip([]);
col2 = col.zip(null);
col2 = col.zip(col, function (x, y) { return x + y; });
col2 = col.zip(col, (x, y) => x + y);
col2 = col.zip(col, "(x, y) => x + y");

// orderBy
col2 = col.orderBy(function (x) { return x + 1; }, function (x, y) { return x == y; });
col2 = col.orderBy(x => x + 1, (x, y) => x == y);
col2 = col.orderBy("x => x + 1", "(x, y) => x == y");
col2 = col.orderBy(x => x + 1);

// orderByDescending
col2 = col.orderByDescending(function (x) { return x + 1; }, function (x, y) { return x == y; });
col2 = col.orderByDescending(x => x + 1, (x, y) => x == y);
col2 = col.orderByDescending("x => x + 1", "(x, y) => x == y");
col2 = col.orderByDescending(x => x + 1);

// thenBy
col2 = col.thenBy(function (x) { return x + 1; }, function (x, y) { return x == y; });
col2 = col.thenBy(x => x + 1, (x, y) => x == y);
col2 = col.thenBy("x => x + 1", "(x, y) => x == y");
col2 = col.thenBy(x => x + 1);

// thenByDescending
col2 = col.thenByDescending(function (x) { return x + 1; }, function (x, y) { return x == y; });
col2 = col.thenByDescending(x => x + 1, (x, y) => x == y);
col2 = col.thenByDescending("x => x + 1", "(x, y) => x == y");
col2 = col.thenByDescending(x => x + 1);

// elementAt
val = col.elementAt(1);

// elementAtOrDefault
val = col.elementAtOrDefault(1, 99);
val = col.elementAtOrDefault(null, 99);

// concat
col2 = col.concat(col);
col2 = col.concat([]);
col2 = col.concat(null);

// skipUntil
col2 = col.skipUntil(function (x) { return x > 2; });
col2 = col.skipUntil(x => x > 2);
col2 = col.skipUntil("x => x > 2");

// takeUntil
col2 = col.takeUntil(function (x) { return x > 2; });
col2 = col.takeUntil(x => x > 2);
col2 = col.takeUntil("x => x > 2");

// takeLast
col2 = col.takeLast(2);

// takeEvery
col2 = col.takeEvery(2);

// foreach
col.foreach(function (x) { console.log(x); });
col.foreach(x => console.log(x));
col.foreach("x => console.log(x)");

// toDelimitedString
let val3: string;
val3 = col.toDelimitedString();
val3 = col.toDelimitedString(",");

// index
col2 = col.index();
col2 = col.index(2);

// batch
col2 = col.batch(3);
col2 = col.batch(3, function (x) { return x + 1; });
col2 = col.batch(3, x => x + 1);
col2 = col.batch(3, "x => x + 1");

// equiZip
col2 = col.equiZip(col);
col2 = col.equiZip(col, function (x, y) { return x + y; });
col2 = col.equiZip(col, (x, y) => x + y);
col2 = col.equiZip(col, "(x, y) => x + y");
col2 = col.equiZip([], (x, y) => x + y);

// zipLongest
col2 = col.zipLongest(col, 99, 99);
col2 = col.zipLongest(col, 99, 99, function (x, y) { return x + y; });
col2 = col.zipLongest(col, 99, 99, (x, y) => x + y);
col2 = col.zipLongest(col, 99, 99, "(x, y) => x + y");
col2 = col.zipLongest([], 99, 99);
col2 = col.zipLongest(null, 99, 99);

// prepend
col2 = col.prepend(1);
col2 = col.prepend(null);

// pad
col2 = col.pad(2, " ");
col2 = col.pad(2, null);

// padWith
col2 = col.padWith(2, function (x) { return x + 1; });
col2 = col.padWith(2, x => x + 1);
col2 = col.padWith(2, "x => x + 1");

// toJQuery
val = col.toJQuery();

// pipe
col2 = col.pipe(function (x) { console.log(x); });
col2 = col.pipe(x => console.log(x));
col2 = col.pipe("x => console.log(x)");

// singleOrFallback
val = col.singleOrFallback(function () { return 99; });
val = col.singleOrFallback(() => 99);
val = col.singleOrFallback("() => 99");

// indexOf
val = col.indexOf(function (x) { return x == 1; });
val = col.indexOf(x => x == 1);
val = col.indexOf("x => x == 1");

// indexOfElement
val = col.indexOfElement(3);
val = col.indexOfElement(3, function (x, y) { return x == y; });
val = col.indexOfElement(3, (x, y) => x == y);
val = col.indexOfElement(3, "(x, y) => x == y");

// lastIndexOf
val = col.lastIndexOf(function (x) { return x == 1; });
val = col.lastIndexOf(x => x == 1);
val = col.lastIndexOf("x => x == 1");

// lastIndexOfElement
val = col.lastIndexOfElement(3);
val = col.lastIndexOfElement(3, function (x, y) { return x == y; });
val = col.lastIndexOfElement(3, (x, y) => x == y);
val = col.lastIndexOfElement(3, "(x, y) => x == y");

// scan
col2 = col.scan(function (x, y) { return x + y; });
col2 = col.scan((x, y) => x + y);
col2 = col.scan("(x, y) => x + y");

// prescan
col2 = col.prescan(function (x, y) { return x + y; }, 0);
col2 = col.prescan((x, y) => x + y, 0);
col2 = col.prescan("(x, y) => x + y", 0);

// aggregate
val = col.aggregate(0, function (x, y) { return x + y; }, function (x) { return x + 1; });
val = col.aggregate(0, (x, y) => x + y, x => x + 1);
val = col.aggregate(0, "(x, y) => x + y", "x => x + 1");
val = col.aggregate(0, (x, y) => x + y);

// linq.identity
val = linq.indentity(1);

// linq.isString
val2 = linq.isString("test");

// linq.isBoolean
val2 = linq.isBoolean(true);

// linq.isNumber
val2 = linq.isNumber(2);

// linq.caseInsensitiveComparer
val = linq.caseInsensitiveComparer("test", "this");

// linq.caseSensitiveComparer
val = linq.caseSensitiveComparer("test", "this");

// linq.defaultStringComparer
val = linq.defaultStringComparer("test", "this");

// linq.strictComparer
val2 = linq.strictComparer(0, 1);
