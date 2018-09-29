define(['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var LinqInternal = function () {
        function LinqInternal() {
            _classCallCheck(this, LinqInternal);
        }

        _createClass(LinqInternal, null, [{
            key: 'convertToString',
            value: function convertToString(value) {
                return value == null ? null : value.toString();
            }
        }, {
            key: 'convertToNumber',
            value: function convertToNumber(value) {
                return Linq.isNumber(value) ? value : NaN;
            }
        }, {
            key: 'isConstructorCompatibleSource',
            value: function isConstructorCompatibleSource(source) {
                return Linq.isIterable(source) || Linq.isGenerator(source) || Linq.isFunction(source) || Linq.isLinq(source);
            }
        }, {
            key: 'isStringNullOrEmpty',
            value: function isStringNullOrEmpty(str) {
                return str == null || str === '';
            }
        }, {
            key: 'isTypedArray',
            value: function isTypedArray(x) {
                return ArrayBuffer.isView(x) && !(x instanceof DataView);
            }
        }, {
            key: 'isIndexedCollection',
            value: function isIndexedCollection(x) {
                return Array.isArray(x) || Linq.isString(x) || LinqInternal.isTypedArray(x);
            }
        }, {
            key: 'isCollectionHavingLength',
            value: function isCollectionHavingLength(x) {
                return LinqInternal.isIndexedCollection(x);
            }
        }, {
            key: 'isCollectionHavingSize',
            value: function isCollectionHavingSize(x) {
                return x instanceof Set || x instanceof Map;
            }
        }, {
            key: 'isCollectionHavingExplicitCardinality',
            value: function isCollectionHavingExplicitCardinality(x) {
                return LinqInternal.isCollectionHavingLength(x) || LinqInternal.isCollectionHavingSize(x);
            }
        }, {
            key: 'getExplicitCardinality',
            value: function getExplicitCardinality(x) {
                if (LinqInternal.isCollectionHavingLength(x)) return x.length;

                if (LinqInternal.isCollectionHavingSize(x)) return x.size;

                return null;
            }
        }, {
            key: 'isEmptyIterable',
            value: function isEmptyIterable(iterable) {
                if (LinqInternal.isCollectionHavingExplicitCardinality(iterable)) return LinqInternal.getExplicitCardinality(iterable) === 0;

                var iterator = LinqInternal.getIterator(iterable);
                var state = iterator.next();

                return state.done;
            }
        }, {
            key: 'validateRequiredFunction',
            value: function validateRequiredFunction(func, message) {
                if (func == null || !Linq.isFunction(func)) throw new Error(message);
            }
        }, {
            key: 'validateOptionalFunction',
            value: function validateOptionalFunction(func, message) {
                if (func != null && !Linq.isFunction(func)) throw new Error(message);
            }
        }, {
            key: 'getIterator',
            value: function getIterator(iterable) {
                if (!Linq.isIterable(iterable)) return new Error('Value is not an iterable.');

                return iterable[Symbol.iterator]();
            }
        }, {
            key: 'firstBasedOperator',
            value: function firstBasedOperator(iterable, predicate, defaultValue, throwIfNotFound) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = iterable[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var item = _step.value;

                        if (predicate == null || predicate(item)) return item;
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                if (throwIfNotFound) throw new Error('No first element was found in the collection.');else return defaultValue;
            }
        }, {
            key: 'singleBasedOperator',
            value: function singleBasedOperator(iterable, predicate, defaultValueFunc, throwIfNotFound) {
                var isFound = false;
                var foundItem = void 0;

                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = iterable[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var item = _step2.value;

                        if (predicate == null || predicate(item)) {
                            if (isFound) {
                                if (predicate == null) throw new Error('There was more than one element in the collection.');else throw new Error('More than one element in the collection satisfied the predicate');
                            }

                            foundItem = item;
                            isFound = true;
                        }
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }

                if (isFound) return foundItem;

                if (throwIfNotFound) {
                    if (predicate == null) throw new Error('There were no elements in the collection.');else throw new Error('No single element in the collection satisfied the predicate.');
                }

                return defaultValueFunc();
            }
        }, {
            key: 'lastBasedOperator',
            value: function lastBasedOperator(iterable, predicate, defaultValue, throwIfNotFound) {
                if (LinqInternal.isIndexedCollection(iterable) && LinqInternal.isCollectionHavingExplicitCardinality(iterable)) {
                    var length = LinqInternal.getExplicitCardinality(iterable);

                    for (var i = length - 1; i >= 0; i--) {
                        var item = iterable[i];

                        if (predicate == null || predicate(item)) return item;
                    }
                } else {
                    var foundElement = void 0;
                    var isFound = false;

                    var _iteratorNormalCompletion3 = true;
                    var _didIteratorError3 = false;
                    var _iteratorError3 = undefined;

                    try {
                        for (var _iterator3 = iterable[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                            var _item = _step3.value;

                            if (predicate == null || predicate(_item)) {
                                foundElement = _item;
                                isFound = true;
                            }
                        }
                    } catch (err) {
                        _didIteratorError3 = true;
                        _iteratorError3 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                _iterator3.return();
                            }
                        } finally {
                            if (_didIteratorError3) {
                                throw _iteratorError3;
                            }
                        }
                    }

                    if (isFound) return foundElement;
                }

                if (throwIfNotFound) throw new Error('No last element was found in the collection.');else return defaultValue;
            }
        }, {
            key: 'elementAtBasedOperator',
            value: function elementAtBasedOperator(index, iterableFunc, outOfBoundsFunc) {
                if (!LinqInternal.isValidNumber(index, function (x) {
                    return x >= 0;
                })) return outOfBoundsFunc();

                var iterable = iterableFunc();

                if (LinqInternal.isCollectionHavingExplicitCardinality(iterable) && index >= LinqInternal.getExplicitCardinality(iterable)) return outOfBoundsFunc();

                if (LinqInternal.isIndexedCollection(iterable)) return iterable[index];

                var counter = 0;

                var _iteratorNormalCompletion4 = true;
                var _didIteratorError4 = false;
                var _iteratorError4 = undefined;

                try {
                    for (var _iterator4 = iterable[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                        var item = _step4.value;

                        if (counter === index) return item;

                        counter += 1;
                    }
                } catch (err) {
                    _didIteratorError4 = true;
                    _iteratorError4 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion4 && _iterator4.return) {
                            _iterator4.return();
                        }
                    } finally {
                        if (_didIteratorError4) {
                            throw _iteratorError4;
                        }
                    }
                }

                return outOfBoundsFunc();
            }
        }, {
            key: 'normalizeComparerOrDefault',
            value: function normalizeComparerOrDefault(comparer) {
                return comparer == null ? Linq.strictComparer : Linq.normalizeComparer(comparer);
            }
        }, {
            key: 'ensureLinq',
            value: function ensureLinq(collection) {
                return Linq.isLinq(collection) ? collection : new Linq(collection);
            }
        }, {
            key: 'createDeferredSort',
            value: function createDeferredSort(keySelector, comparer, isReverse) {
                var parent = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

                return {
                    keySelector: keySelector,
                    comparer: comparer,
                    isReverse: isReverse,
                    parent: parent
                };
            }
        }, {
            key: 'performDeferredSort',
            value: function performDeferredSort(buffer, deferredSort) {
                var sortChain = LinqInternal.buildSortChain(deferredSort);

                var compare = function compare(x, y, info) {
                    var value = void 0;

                    if (info.isReverse) value = info.comparer(info.keySelector(y), info.keySelector(x));else value = info.comparer(info.keySelector(x), info.keySelector(y));

                    if (value === 0) {
                        if (info.next == null) return 0;

                        return compare(x, y, info.next);
                    } else return value;
                };

                buffer.sort(function (x, y) {
                    return compare(x, y, sortChain);
                });
            }
        }, {
            key: 'buildSortChain',
            value: function buildSortChain(deferredSort) {
                var helper = function helper(ds, child) {
                    var chainItem = {
                        keySelector: ds.keySelector,
                        comparer: ds.comparer,
                        isReverse: ds.isReverse,
                        next: child
                    };

                    if (ds.parent == null) return chainItem;

                    return helper(ds.parent, chainItem);
                };

                return helper(deferredSort, null);
            }
        }, {
            key: 'orderByBasedOperator',
            value: function orderByBasedOperator(originalLinq, keySelector, comparer, isReverse) {
                LinqInternal.validateRequiredFunction(keySelector);
                LinqInternal.validateOptionalFunction(comparer);

                if (comparer == null) comparer = Linq.generalComparer;

                var linq = new Linq(originalLinq);

                linq[deferredSortSymbol] = LinqInternal.createDeferredSort(keySelector, comparer, isReverse);

                return linq;
            }
        }, {
            key: 'thenByBasedOperator',
            value: function thenByBasedOperator(originalLinq, keySelector, comparer, isReverse) {
                LinqInternal.validateRequiredFunction(keySelector);
                LinqInternal.validateOptionalFunction(comparer);

                var parentDeferredSort = originalLinq[deferredSortSymbol];

                if (parentDeferredSort == null) throw new Error((isReverse ? 'ThenByDescending' : 'ThenBy') + ' can only be called following OrderBy, OrderByDescending, ThenBy, or ThenByDescending.');

                if (comparer == null) comparer = Linq.generalComparer;

                var linq = new Linq(originalLinq);

                linq[deferredSortSymbol] = LinqInternal.createDeferredSort(keySelector, comparer, isReverse, parentDeferredSort);

                return linq;
            }
        }, {
            key: 'getExtremeValue',
            value: function getExtremeValue(linq, compareSelector, isMoreExtremeFunc, resultSelector) {
                var aggregationFunc = function aggregationFunc(extremeItem, x) {
                    var extremeValue = compareSelector(extremeItem);
                    var tempValue = compareSelector(x);

                    return isMoreExtremeFunc(tempValue, extremeValue) ? x : extremeItem;
                };

                return linq.aggregate(null, aggregationFunc, resultSelector);
            }
        }, {
            key: 'isValidNumber',
            value: function isValidNumber(value, furtherPredicate) {
                if (value == null || isNaN(value)) return false;

                if (furtherPredicate != null) return furtherPredicate(value);

                return true;
            }
        }, {
            key: 'minComparer',
            value: function minComparer(x, y) {
                return x < y;
            }
        }, {
            key: 'maxComparer',
            value: function maxComparer(x, y) {
                return x > y;
            }
        }]);

        return LinqInternal;
    }();

    var SimpleSet = exports.SimpleSet = function () {
        function SimpleSet(equalityComparer) {
            _classCallCheck(this, SimpleSet);

            this.set = new Set();
            this.comparer = equalityComparer;
            this.usesComparer = equalityComparer != null;
            this.containsOnlyPrimitives = true;
        }

        _createClass(SimpleSet, [{
            key: 'add',
            value: function add(item) {
                if (this.containsOnlyPrimitives && !Linq.isPrimitive(item)) this.containsOnlyPrimitives = false;

                if (this.usesComparer) {
                    if (!this.has(item)) this.set.add(item);
                } else if (this.containsOnlyPrimitives || !this.has(item)) this.set.add(item);
            }
        }, {
            key: 'remove',
            value: function remove(item) {
                if (!this.usesComparer && this.containsOnlyPrimitives) return this.set.delete(item);

                var normalizedComparer = this.usesComparer ? this.comparer : Linq.strictComparer;

                var _iteratorNormalCompletion5 = true;
                var _didIteratorError5 = false;
                var _iteratorError5 = undefined;

                try {
                    for (var _iterator5 = this.set.values()[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                        var value = _step5.value;

                        if (normalizedComparer(item, value)) {
                            this.set.delete(value);

                            return true;
                        }
                    }
                } catch (err) {
                    _didIteratorError5 = true;
                    _iteratorError5 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion5 && _iterator5.return) {
                            _iterator5.return();
                        }
                    } finally {
                        if (_didIteratorError5) {
                            throw _iteratorError5;
                        }
                    }
                }

                return false;
            }
        }, {
            key: 'has',
            value: function has(item) {
                if (!this.usesComparer && this.containsOnlyPrimitives) return this.set.has(item);

                var normalizedComparer = this.usesComparer ? this.comparer : Linq.strictComparer;

                var _iteratorNormalCompletion6 = true;
                var _didIteratorError6 = false;
                var _iteratorError6 = undefined;

                try {
                    for (var _iterator6 = this.set.values()[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                        var value = _step6.value;

                        if (normalizedComparer(item, value)) return true;
                    }
                } catch (err) {
                    _didIteratorError6 = true;
                    _iteratorError6 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion6 && _iterator6.return) {
                            _iterator6.return();
                        }
                    } finally {
                        if (_didIteratorError6) {
                            throw _iteratorError6;
                        }
                    }
                }

                return false;
            }
        }], [{
            key: 'initialize',
            value: function initialize(iterable, equalityComparer) {
                var set = new SimpleSet(equalityComparer);

                var _iteratorNormalCompletion7 = true;
                var _didIteratorError7 = false;
                var _iteratorError7 = undefined;

                try {
                    for (var _iterator7 = iterable[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                        var item = _step7.value;

                        set.add(item);
                    }
                } catch (err) {
                    _didIteratorError7 = true;
                    _iteratorError7 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion7 && _iterator7.return) {
                            _iterator7.return();
                        }
                    } finally {
                        if (_didIteratorError7) {
                            throw _iteratorError7;
                        }
                    }
                }

                return set;
            }
        }]);

        return SimpleSet;
    }();

    // Used in the Linq.isGenerator() function to test for being a generator.
    var GeneratorFunction = regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }).constructor;

    var deferredSortSymbol = Symbol('Provides private-like access for a deferredSort property.');

    var Grouping = exports.Grouping = function Grouping(key, values) {
        _classCallCheck(this, Grouping);

        this.key = key;
        this.values = values == null ? [] : Array.from(values);
    };

    var Linq = exports.Linq = function () {
        /**
         * A type that can be passed the the Linq constructor.
         * @typedef {iterable|generator|Linq|function} LinqCompatible
         */

        /**
         * A function that can act as a projection function (i.e., projects a value into some other value).
         * @callback projection
         * @param {*} value - The value to be projected
         * @returns {*} - The projected value.
         */

        /**
         * A function that can act as a projection function (i.e., projects a value into some other value),
         * but also passes in the positional, zero-based index of the element.
         * @callback indexedProjection
         * @param {*} value - The value to be projected
         * @param {number} [index] - The zero-based index of the value
         * @returns {*} - The projected value.
         */

        /**
         * A function that projects a value to a numeric value.
         * @callback numericProjection
         * @param {*} value - The value to be projected
         * @returns {number} - The projected numeric value.
         */

        /**
         * A function that projects two values into a third value.
         * @callback biSourceProjection
         * @param {*} firstValue - The first of the values to involve in the projection
         * @param {*} secondValue - The second of the values to involve in the projection
         * @returns {*} - The projected value.
         */

        /**
         * A function that projects a value into a LinqCompatible value
         * @callback collectionProjection
         * @param {*} value - The value to be projected
         * @returns {LinqCompatible} - The projected set of values
         */

        /**
         * A function that can act as a predicate function (i.e., projects a value to a boolean value).
         * @callback predicate
         * @param {*} value - The value to test
         * @returns {boolean}
         */

        /**
         * A function that acts upon a value.
         * @callback action
         * @param {*} value - The value upon which to act
         */

        /**
         * A comparer is a function that takes two values and returns 0 if they are considered the "same" (by
         * the comparer), -1 if they are considered "in order", and 1 if they are considered "out-of-order".
         * @callback comparer
         * @param {*} value1 - The first value to compare
         * @param {*} value2 - The second value to compare
         * @returns {number} - The value (-1/0/1) that represents the ordering of the two values.
         */

        /**
         * An equality comparer is a function that takes two values and returns a boolean value indicating 
         * whether the two values are considered the "same" (by the equality comparer).
         * @callback equalityComparer
         * @param {*} value1 - The first value to compare
         * @param {*} value2 - The second value to compare
         * @returns {boolean} - The value indicating whether the two values are the same.
         */

        /**
         * A function that aggregates two values into a single value.
         * @callback aggregator
         * @param {*} acc - The seed or previously-accumulated value
         * @param {*} value - The new value to aggregate
         * @returns {*} - The new, accumulated value.
         */

        /**
         * A function that returns a value given no input.  In function programming terms (i.e., if assuming a 
         * pure function), this could be called a "constant" function.
         * @callback constantFunction
         * @returns {*} - The returned value.
         */

        /**
         * Creates a new linq object.  If `source` is a function, then it is expected to return an iterable, a generator
         * or another function that returns either an iterable or a generator.
         * 
         * The iterables that can be passed in `source` are those defined by the "iterable protocol" (see
         * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#iterable).
         * 
         * @constructor
         * @param {LinqCompatible} source - The source from which this linq object enumerates values
         * @throws If `source` is not an iterable, a generator, or a function.
         */
        function Linq(source) {
            _classCallCheck(this, Linq);

            if (source == null) source = [];

            if (LinqInternal.isConstructorCompatibleSource(source)) this.source = source;else throw new Error('The \'source\' is neither an iterable, a generator, nor a function that returns such.');
        }

        // Helper functions


        _createClass(Linq, [{
            key: 'aggregate',


            // Linq operators

            /**
             * Returns the aggregate value of performing the `operation` function on each of the values of
             * 'this' collection, starting with a value equal to `seed` (or to the value of the first element
             * of 'this' collection, if `seed` is null).  The final value is either directly returned (if no
             * `resultSelector` function is given) or the final value is first passed to the `resultSelector`
             * function and the return value from that function is returned.
             * 
             * @param {*} seed - The initial value of the aggregation 
             * @param {aggregator} operation - The function to use to aggregate the values of 'this' collection
             * @param {projection} [resultSelector] - The function that projects the final value to the returned result
             * @returns {*} - The aggregate value.
             */
            value: function aggregate(seed, operation, resultSelector) {
                LinqInternal.validateRequiredFunction(operation, "Invalid operation.");
                LinqInternal.validateOptionalFunction(resultSelector, "Invalid result selector.");

                var iterator = LinqInternal.getIterator(this.toIterable());
                var currentValue = null;
                var result = null;

                var getNext = function getNext() {
                    var state = iterator.next();

                    currentValue = state.value;

                    return !state.done;
                };

                if (getNext()) result = seed == null ? currentValue : operation(seed, currentValue);else if (seed == null) throw new Error("Cannot evaluate aggregation of an empty collection with no seed.");else return resultSelector == null ? seed : resultSelector(seed);

                while (getNext()) {
                    result = operation(result, currentValue);
                }

                return resultSelector == null ? result : resultSelector(result);
            }

            /**
             * Returns a boolean value indicating whether all of the elements of the collection satisfy the 
             * predicate.  Returns 'true' if the collection is empty.
             * 
             * @param {predicate} predicate - The predicate applied to the collection
             * @returns {boolean} - A value indicating whether all of the elements satisfied the predicate.
             */

        }, {
            key: 'all',
            value: function all(predicate) {
                LinqInternal.validateRequiredFunction(predicate, 'Invalid predicate.');

                var iterable = this.toIterable();

                var _iteratorNormalCompletion8 = true;
                var _didIteratorError8 = false;
                var _iteratorError8 = undefined;

                try {
                    for (var _iterator8 = iterable[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                        var item = _step8.value;

                        if (!predicate(item)) return false;
                    }
                } catch (err) {
                    _didIteratorError8 = true;
                    _iteratorError8 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion8 && _iterator8.return) {
                            _iterator8.return();
                        }
                    } finally {
                        if (_didIteratorError8) {
                            throw _iteratorError8;
                        }
                    }
                }

                return true;
            }

            /**
             * Returns a boolean value indicating whether any of the elements of the collection satisfy the 
             * predicate.  Returns 'false' if the collection is empty.
             * 
             * @param {predicate} [predicate] - The predicate applied to the collection
             * @returns {boolean} - A value indicating whether any of the elements satisfied the predicate. 
             */

        }, {
            key: 'any',
            value: function any(predicate) {
                LinqInternal.validateOptionalFunction(predicate, 'Invalid predicate.');

                var iterable = this.toIterable();

                if (predicate == null) return !LinqInternal.isEmptyIterable(iterable);

                var _iteratorNormalCompletion9 = true;
                var _didIteratorError9 = false;
                var _iteratorError9 = undefined;

                try {
                    for (var _iterator9 = iterable[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                        var item = _step9.value;

                        if (predicate(item)) return true;
                    }
                } catch (err) {
                    _didIteratorError9 = true;
                    _iteratorError9 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion9 && _iterator9.return) {
                            _iterator9.return();
                        }
                    } finally {
                        if (_didIteratorError9) {
                            throw _iteratorError9;
                        }
                    }
                }

                return false;
            }

            /**
             * Returns a collection containing the same elements as the 'this' collection but also including
             * the `value` element appended to the end.
             * 
             * @param {*} value - The value to append to the 'this' collection
             * @returs {Linq}
             */

        }, {
            key: 'append',
            value: function append(value) {
                var _marked = /*#__PURE__*/regeneratorRuntime.mark(appendGenerator);

                var iterable = this.toIterable();

                function appendGenerator() {
                    var _iteratorNormalCompletion10, _didIteratorError10, _iteratorError10, _iterator10, _step10, item;

                    return regeneratorRuntime.wrap(function appendGenerator$(_context2) {
                        while (1) {
                            switch (_context2.prev = _context2.next) {
                                case 0:
                                    _iteratorNormalCompletion10 = true;
                                    _didIteratorError10 = false;
                                    _iteratorError10 = undefined;
                                    _context2.prev = 3;
                                    _iterator10 = iterable[Symbol.iterator]();

                                case 5:
                                    if (_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done) {
                                        _context2.next = 12;
                                        break;
                                    }

                                    item = _step10.value;
                                    _context2.next = 9;
                                    return item;

                                case 9:
                                    _iteratorNormalCompletion10 = true;
                                    _context2.next = 5;
                                    break;

                                case 12:
                                    _context2.next = 18;
                                    break;

                                case 14:
                                    _context2.prev = 14;
                                    _context2.t0 = _context2['catch'](3);
                                    _didIteratorError10 = true;
                                    _iteratorError10 = _context2.t0;

                                case 18:
                                    _context2.prev = 18;
                                    _context2.prev = 19;

                                    if (!_iteratorNormalCompletion10 && _iterator10.return) {
                                        _iterator10.return();
                                    }

                                case 21:
                                    _context2.prev = 21;

                                    if (!_didIteratorError10) {
                                        _context2.next = 24;
                                        break;
                                    }

                                    throw _iteratorError10;

                                case 24:
                                    return _context2.finish(21);

                                case 25:
                                    return _context2.finish(18);

                                case 26:
                                    _context2.next = 28;
                                    return value;

                                case 28:
                                case 'end':
                                    return _context2.stop();
                            }
                        }
                    }, _marked, this, [[3, 14, 18, 26], [19,, 21, 25]]);
                }

                return new Linq(appendGenerator);
            }

            /**
             * Returns the average value of all of the elements (or projection of the elements, if there is
             * a selector), excluding null values.  If any of the elements (or projection of the elements) are
             * NaN (i.e., not a number), then an exception will be thrown.
             * 
             * @param {projection} [selector] - A projection function that returns the value to be averaged
             * @returns {number} - The average value calculated from the collection.
             */

        }, {
            key: 'average',
            value: function average(selector) {
                LinqInternal.validateOptionalFunction(selector, 'Invalid selector.');

                var iterable = this.toIterable();
                var result = 0;
                var counter = 1;

                var _iteratorNormalCompletion11 = true;
                var _didIteratorError11 = false;
                var _iteratorError11 = undefined;

                try {
                    for (var _iterator11 = iterable[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                        var item = _step11.value;

                        var value = selector == null ? item : selector(item);

                        if (value == null) continue;

                        if (isNaN(value)) throw new Error('Encountered an element that is not a number.');

                        result += (value - result) / counter;
                        counter += 1;
                    }
                } catch (err) {
                    _didIteratorError11 = true;
                    _iteratorError11 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion11 && _iterator11.return) {
                            _iterator11.return();
                        }
                    } finally {
                        if (_didIteratorError11) {
                            throw _iteratorError11;
                        }
                    }
                }

                return result;
            }

            /**
             * Returns an collection with the elements of 'this' collection grouped into separate 
             * arrays (i.e., "buckets") of the 'size' given.  If the 'result selector' is given
             * the the buckets will contain the values projected from the elements by the result
             * selector.  The given 'size' must be greater than zero.
             * 
             * @param {number} size - The size of buckets into which to group the elements
             * @param {projection} [resultSelector] - The projection function to use to project the result values
             * @returns {Linq}
             */

        }, {
            key: 'batch',
            value: function batch(size, resultSelector) {
                var _marked2 = /*#__PURE__*/regeneratorRuntime.mark(batchGenerator);

                LinqInternal.validateOptionalFunction(resultSelector, 'Invalid result selector.');

                if (!LinqInternal.isValidNumber(size, function (x) {
                    return x > 0;
                })) throw new Error('Invalid size.');

                var iterable = this.toIterable();

                function batchGenerator() {
                    var bucket, index, _iteratorNormalCompletion12, _didIteratorError12, _iteratorError12, _iterator12, _step12, item;

                    return regeneratorRuntime.wrap(function batchGenerator$(_context3) {
                        while (1) {
                            switch (_context3.prev = _context3.next) {
                                case 0:
                                    bucket = null;
                                    index = 0;
                                    _iteratorNormalCompletion12 = true;
                                    _didIteratorError12 = false;
                                    _iteratorError12 = undefined;
                                    _context3.prev = 5;
                                    _iterator12 = iterable[Symbol.iterator]();

                                case 7:
                                    if (_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done) {
                                        _context3.next = 20;
                                        break;
                                    }

                                    item = _step12.value;

                                    if (bucket == null) bucket = [];

                                    bucket[index] = resultSelector == null ? item : resultSelector(item);
                                    index += 1;

                                    if (!(index == size)) {
                                        _context3.next = 17;
                                        break;
                                    }

                                    _context3.next = 15;
                                    return bucket;

                                case 15:

                                    bucket = null;
                                    index = 0;

                                case 17:
                                    _iteratorNormalCompletion12 = true;
                                    _context3.next = 7;
                                    break;

                                case 20:
                                    _context3.next = 26;
                                    break;

                                case 22:
                                    _context3.prev = 22;
                                    _context3.t0 = _context3['catch'](5);
                                    _didIteratorError12 = true;
                                    _iteratorError12 = _context3.t0;

                                case 26:
                                    _context3.prev = 26;
                                    _context3.prev = 27;

                                    if (!_iteratorNormalCompletion12 && _iterator12.return) {
                                        _iterator12.return();
                                    }

                                case 29:
                                    _context3.prev = 29;

                                    if (!_didIteratorError12) {
                                        _context3.next = 32;
                                        break;
                                    }

                                    throw _iteratorError12;

                                case 32:
                                    return _context3.finish(29);

                                case 33:
                                    return _context3.finish(26);

                                case 34:
                                    if (!(bucket != null && index > 0)) {
                                        _context3.next = 37;
                                        break;
                                    }

                                    _context3.next = 37;
                                    return bucket;

                                case 37:
                                case 'end':
                                    return _context3.stop();
                            }
                        }
                    }, _marked2, this, [[5, 22, 26, 34], [27,, 29, 33]]);
                }

                return new Linq(batchGenerator);
            }

            /**
             * Returns a collection containing all of the elements of 'this' collection followed by 
             * all of the elements of the 'second' collection.
             * 
             * @param {LinqCompatible} [second] - The collection of items to append to 'this' collection
             * @returns {Linq} - The concatenation of the collection with a second collection.
             */

        }, {
            key: 'concat',
            value: function concat(second) {
                var _marked3 = /*#__PURE__*/regeneratorRuntime.mark(concatGenerator);

                if (second == null) return new Linq(this);

                var secondLinq = LinqInternal.ensureLinq(second);

                var firstIterable = this.toIterable();
                var secondIterable = secondLinq.toIterable();

                function concatGenerator() {
                    var _iteratorNormalCompletion13, _didIteratorError13, _iteratorError13, _iterator13, _step13, item, _iteratorNormalCompletion14, _didIteratorError14, _iteratorError14, _iterator14, _step14, _item2;

                    return regeneratorRuntime.wrap(function concatGenerator$(_context4) {
                        while (1) {
                            switch (_context4.prev = _context4.next) {
                                case 0:
                                    _iteratorNormalCompletion13 = true;
                                    _didIteratorError13 = false;
                                    _iteratorError13 = undefined;
                                    _context4.prev = 3;
                                    _iterator13 = firstIterable[Symbol.iterator]();

                                case 5:
                                    if (_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done) {
                                        _context4.next = 12;
                                        break;
                                    }

                                    item = _step13.value;
                                    _context4.next = 9;
                                    return item;

                                case 9:
                                    _iteratorNormalCompletion13 = true;
                                    _context4.next = 5;
                                    break;

                                case 12:
                                    _context4.next = 18;
                                    break;

                                case 14:
                                    _context4.prev = 14;
                                    _context4.t0 = _context4['catch'](3);
                                    _didIteratorError13 = true;
                                    _iteratorError13 = _context4.t0;

                                case 18:
                                    _context4.prev = 18;
                                    _context4.prev = 19;

                                    if (!_iteratorNormalCompletion13 && _iterator13.return) {
                                        _iterator13.return();
                                    }

                                case 21:
                                    _context4.prev = 21;

                                    if (!_didIteratorError13) {
                                        _context4.next = 24;
                                        break;
                                    }

                                    throw _iteratorError13;

                                case 24:
                                    return _context4.finish(21);

                                case 25:
                                    return _context4.finish(18);

                                case 26:
                                    _iteratorNormalCompletion14 = true;
                                    _didIteratorError14 = false;
                                    _iteratorError14 = undefined;
                                    _context4.prev = 29;
                                    _iterator14 = secondIterable[Symbol.iterator]();

                                case 31:
                                    if (_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done) {
                                        _context4.next = 38;
                                        break;
                                    }

                                    _item2 = _step14.value;
                                    _context4.next = 35;
                                    return _item2;

                                case 35:
                                    _iteratorNormalCompletion14 = true;
                                    _context4.next = 31;
                                    break;

                                case 38:
                                    _context4.next = 44;
                                    break;

                                case 40:
                                    _context4.prev = 40;
                                    _context4.t1 = _context4['catch'](29);
                                    _didIteratorError14 = true;
                                    _iteratorError14 = _context4.t1;

                                case 44:
                                    _context4.prev = 44;
                                    _context4.prev = 45;

                                    if (!_iteratorNormalCompletion14 && _iterator14.return) {
                                        _iterator14.return();
                                    }

                                case 47:
                                    _context4.prev = 47;

                                    if (!_didIteratorError14) {
                                        _context4.next = 50;
                                        break;
                                    }

                                    throw _iteratorError14;

                                case 50:
                                    return _context4.finish(47);

                                case 51:
                                    return _context4.finish(44);

                                case 52:
                                case 'end':
                                    return _context4.stop();
                            }
                        }
                    }, _marked3, this, [[3, 14, 18, 26], [19,, 21, 25], [29, 40, 44, 52], [45,, 47, 51]]);
                }

                return new Linq(concatGenerator);
            }

            /**
             * Returns a boolean value indicating whether 'this' collection contains the given `item`.  The
             * `comparer` function can be used to specify how the `item` is compared to the elements of 'this' 
             * collection.  If `comparer` is not given, the "===" operator is used to compare elements.
             * 
             * @param {*} item - The item to search for in 'this' collection
             * @param {comparer|equalityComparer} [comparer] - The function to use to compare elements
             * @returns {boolean}
             */

        }, {
            key: 'contains',
            value: function contains(item, comparer) {
                LinqInternal.validateOptionalFunction(comparer, 'Invalid comparer.');

                var normalizedComparer = LinqInternal.normalizeComparerOrDefault(comparer);
                var iterable = this.toIterable();

                var _iteratorNormalCompletion15 = true;
                var _didIteratorError15 = false;
                var _iteratorError15 = undefined;

                try {
                    for (var _iterator15 = iterable[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
                        var iItem = _step15.value;

                        if (normalizedComparer(item, iItem)) return true;
                    }
                } catch (err) {
                    _didIteratorError15 = true;
                    _iteratorError15 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion15 && _iterator15.return) {
                            _iterator15.return();
                        }
                    } finally {
                        if (_didIteratorError15) {
                            throw _iteratorError15;
                        }
                    }
                }

                return false;
            }

            /**
             * Returns the number of items in 'this' collection (if no `predicate` is given) or the number of
             * items in 'this' collection that satisfy the `predicate`.
             * 
             * @param {predicate} [predicate] - The predicate used to count elements
             * @returns {number}
             */

        }, {
            key: 'count',
            value: function count(predicate) {
                LinqInternal.validateOptionalFunction(predicate, 'Invalid predicate.');

                var iterable = this.toIterable();

                if (predicate == null && LinqInternal.isCollectionHavingExplicitCardinality(iterable)) return LinqInternal.getExplicitCardinality(iterable);

                var counter = 0;

                var _iteratorNormalCompletion16 = true;
                var _didIteratorError16 = false;
                var _iteratorError16 = undefined;

                try {
                    for (var _iterator16 = iterable[Symbol.iterator](), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
                        var item = _step16.value;

                        if (predicate == null || predicate(item)) counter += 1;
                    }
                } catch (err) {
                    _didIteratorError16 = true;
                    _iteratorError16 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion16 && _iterator16.return) {
                            _iterator16.return();
                        }
                    } finally {
                        if (_didIteratorError16) {
                            throw _iteratorError16;
                        }
                    }
                }

                return counter;
            }

            /**
             * Returns either 'this' collection, if 'this' collection is empty, or a collection containing
             * only the `defaultValue` as an element.  In other words, this function always returns a collection 
             * containing at least one element.
             * 
             * @param {*} defaultValue 
             * @returns {Linq}
             */

        }, {
            key: 'defaultIfEmpty',
            value: function defaultIfEmpty(defaultValue) {
                var iterable = this.toIterable();

                if (LinqInternal.isEmptyIterable(iterable)) return new Linq([defaultValue]);else return new Linq(this);
            }

            /**
             * Returns a collection of all of the distinct elements of 'this' collection, using `comparer` (if it
             * is given) to determine whether two elements are equal.  If `comparer` is not given, the "===" operator
             * is used to compare elements.
             * 
             * @param {comparer|equalityComparer} [comparer] - The function used to compare elements
             * @returns {Linq} 
             */

        }, {
            key: 'distinct',
            value: function distinct(comparer) {
                return this.distinctBy(Linq.identity, comparer);
            }

            /**
             * Returns a collection of all of the elements that are considered distinct relative to the key value returned
             * by the `keySelector` projection, using `comparer` (if it is given) to determine whether to keys are equal.
             * If `comparer` is not given, the "===" operator is used to compare keys.
             * 
             * @param {projection} keySelector - The projection function used to return keys for the elements
             * @param {comparer|equalityComparer} [comparer] - The function used to compare keys
             * @returns {Linq} 
             */

        }, {
            key: 'distinctBy',
            value: function distinctBy(keySelector, comparer) {
                LinqInternal.validateRequiredFunction(keySelector, 'Invalid key selector.');
                LinqInternal.validateOptionalFunction(comparer, 'Invalid comparer.');

                // So sad--ES6's Set class does not allow for custom equality comparison, so have to use
                // groupBy instead of Set, which would perform more quickly.
                return this.groupBy(keySelector, null, comparer).select(function (x) {
                    return x.values[0];
                });
            }

            /**
             * Returns the element of 'this' collection located at the ordinal position given by `index` (a zero-based 
             * index).  If that position is either less than zero or greater than or equal to the size of 'this' 
             * collection, then an error will be thrown.
             * 
             * @param {number} index - The zero-based index of the element to return
             * @returns {*}
             */

        }, {
            key: 'elementAt',
            value: function elementAt(index) {
                var _this = this;

                return LinqInternal.elementAtBasedOperator(index, function () {
                    return _this.toIterable();
                }, function () {
                    throw new Error('Invalid index.');
                });
            }

            /**
             * Returns either the element of 'this' collection located at the ordinal position given by `index` (a
             * zero-based index), if the `index` is contained within the bounds of 'this' collection, or the `defaultValue`,
             * if the `index` is not contained within the bounds of 'this' collection.
             * 
             * @param {number} index - The zero-based index of the element to return
             * @param {*} defaultValue - The value to return if the `index` is outside the bounds of 'this' collection
             * @returns {*}
             */

        }, {
            key: 'elementAtOrDefault',
            value: function elementAtOrDefault(index, defaultValue) {
                var _this2 = this;

                return LinqInternal.elementAtBasedOperator(index, function () {
                    return _this2.toIterable();
                }, function () {
                    return defaultValue;
                });
            }

            /**
             * Returns 'this' collection "zipped-up" with the `second` collection such that each value of the
             * returned collection is the value projected from the corresponding element from each of 'this'
             * collection and the `second` collection.  If the size of 'this' collection and the `second` 
             * collection are not equal, then an exception will be thrown.
             * 
             * @param {LinqCompatible} second - The collection to zip with 'this' collection 
             * @param {projection} [resultSelector] - The function to use to project the result values
             * @returns {Linq}
             */

        }, {
            key: 'equiZip',
            value: function equiZip(second, resultSelector) {
                var _marked4 = /*#__PURE__*/regeneratorRuntime.mark(equizipGenerator);

                LinqInternal.validateOptionalFunction(resultSelector, 'Invalid result selector.');

                if (resultSelector == null) resultSelector = Linq.tuple;

                var secondLinq = LinqInternal.ensureLinq(second);
                var firstIterable = this.toIterable();
                var secondIterable = secondLinq.toIterable();

                if (LinqInternal.isCollectionHavingExplicitCardinality(firstIterable) && LinqInternal.isCollectionHavingExplicitCardinality(secondIterable) && LinqInternal.getExplicitCardinality(firstIterable) !== LinqInternal.getExplicitCardinality(secondIterable)) {
                    throw new Error('The two collections being equi-zipped are not of equal lengths.');
                }

                function equizipGenerator() {
                    var firstIterator, secondIterator, firstState, secondState;
                    return regeneratorRuntime.wrap(function equizipGenerator$(_context5) {
                        while (1) {
                            switch (_context5.prev = _context5.next) {
                                case 0:
                                    firstIterator = LinqInternal.getIterator(firstIterable);
                                    secondIterator = LinqInternal.getIterator(secondIterable);
                                    firstState = firstIterator.next();
                                    secondState = secondIterator.next();

                                case 4:
                                    if (firstState.done) {
                                        _context5.next = 13;
                                        break;
                                    }

                                    if (!secondState.done) {
                                        _context5.next = 7;
                                        break;
                                    }

                                    throw new Error('Second collection is too short.');

                                case 7:
                                    _context5.next = 9;
                                    return resultSelector(firstState.value, secondState.value);

                                case 9:

                                    firstState = firstIterator.next();
                                    secondState = secondIterator.next();
                                    _context5.next = 4;
                                    break;

                                case 13:
                                    if (secondState.done) {
                                        _context5.next = 15;
                                        break;
                                    }

                                    throw new Error('First collection is too short.');

                                case 15:
                                case 'end':
                                    return _context5.stop();
                            }
                        }
                    }, _marked4, this);
                }

                return new Linq(equizipGenerator);
            }

            /**
             * Returns elements in 'this' collection that do not also exist in the `second` collection, using `comparer`
             * (if it is given) to determine whether two items are equal.  Also, the returned elements will not include
             * duplicates from 'this' collection. If `comparer` is not given, the "===" operator is used to compare elements.
             * 
             * @param {LinqCompatible} second - The collection to use to exlude elements
             * @param {comparer|equalityComparer} [comparer] - The function used to compare elements 
             */

        }, {
            key: 'except',
            value: function except(second, comparer) {
                var _marked5 = /*#__PURE__*/regeneratorRuntime.mark(exceptGenerator);

                LinqInternal.validateOptionalFunction(comparer, 'Invalid comparer.');

                var normalizedComparer = comparer == null ? null : Linq.normalizeComparer(comparer);
                var secondLinq = LinqInternal.ensureLinq(second);

                var firstIterable = this.toIterable();
                var secondIterable = secondLinq.toIterable();

                var disqualifiedSet = SimpleSet.initialize(secondIterable, normalizedComparer);

                function exceptGenerator() {
                    var _iteratorNormalCompletion17, _didIteratorError17, _iteratorError17, _iterator17, _step17, item, isDisqualified;

                    return regeneratorRuntime.wrap(function exceptGenerator$(_context6) {
                        while (1) {
                            switch (_context6.prev = _context6.next) {
                                case 0:
                                    _iteratorNormalCompletion17 = true;
                                    _didIteratorError17 = false;
                                    _iteratorError17 = undefined;
                                    _context6.prev = 3;
                                    _iterator17 = firstIterable[Symbol.iterator]();

                                case 5:
                                    if (_iteratorNormalCompletion17 = (_step17 = _iterator17.next()).done) {
                                        _context6.next = 15;
                                        break;
                                    }

                                    item = _step17.value;
                                    isDisqualified = disqualifiedSet.has(item);

                                    if (isDisqualified) {
                                        _context6.next = 12;
                                        break;
                                    }

                                    disqualifiedSet.add(item);
                                    _context6.next = 12;
                                    return item;

                                case 12:
                                    _iteratorNormalCompletion17 = true;
                                    _context6.next = 5;
                                    break;

                                case 15:
                                    _context6.next = 21;
                                    break;

                                case 17:
                                    _context6.prev = 17;
                                    _context6.t0 = _context6['catch'](3);
                                    _didIteratorError17 = true;
                                    _iteratorError17 = _context6.t0;

                                case 21:
                                    _context6.prev = 21;
                                    _context6.prev = 22;

                                    if (!_iteratorNormalCompletion17 && _iterator17.return) {
                                        _iterator17.return();
                                    }

                                case 24:
                                    _context6.prev = 24;

                                    if (!_didIteratorError17) {
                                        _context6.next = 27;
                                        break;
                                    }

                                    throw _iteratorError17;

                                case 27:
                                    return _context6.finish(24);

                                case 28:
                                    return _context6.finish(21);

                                case 29:
                                case 'end':
                                    return _context6.stop();
                            }
                        }
                    }, _marked5, this, [[3, 17, 21, 29], [22,, 24, 28]]);
                }

                return new Linq(exceptGenerator);
            }

            /**
             * Returns either the first element of 'this' collection (if 'predicate' is not given) or the 
             * first element of 'this' collection that satisfies the 'predicate' (if 'predicate' is given).
             * If there is no "first" element to return (either because 'this' collection is empty or no element 
             * satisfies the 'predicate'), an error is thrown.
             * 
             * @param {predicate} [predicate] - The predicate function used to determine the element to return
             * @returns {*}
             */

        }, {
            key: 'first',
            value: function first(predicate) {
                LinqInternal.validateOptionalFunction(predicate, 'Invalid predicate.');

                var iterable = this.toIterable();

                return LinqInternal.firstBasedOperator(iterable, predicate, null, true);
            }

            /**
             * Returns either the first element of 'this' collection (if `predicate` is not given) or the
             * first element of 'this' collection that satisfies the `predicate` (if `predicate` is given).
             * If there is no "first" element to return (either because 'this' collection is empty or no element
             * satisfies the `predicate`), the `defaultValue` is returned.
             * 
             * @param {predicate} [predicate] - The predicate function used to determine the element to return 
             * @param {*} [defaultValue] - The value to return if no "first" element is found
             * @returns {*}
             */

        }, {
            key: 'firstOrDefault',
            value: function firstOrDefault(predicate, defaultValue) {
                LinqInternal.validateOptionalFunction(predicate, 'Invalid predicate.');

                var iterable = this.toIterable();

                return LinqInternal.firstBasedOperator(iterable, predicate, defaultValue, false);
            }

            /**
             * Executes the given `action` on each element of 'this' collection.
             * @param {action} action - The function that is executed for each element 
             */

        }, {
            key: 'foreach',
            value: function foreach(action) {
                LinqInternal.validateRequiredFunction(action, 'Invalid action.');

                var iterable = this.toIterable();
                var counter = 0;

                var _iteratorNormalCompletion18 = true;
                var _didIteratorError18 = false;
                var _iteratorError18 = undefined;

                try {
                    for (var _iterator18 = iterable[Symbol.iterator](), _step18; !(_iteratorNormalCompletion18 = (_step18 = _iterator18.next()).done); _iteratorNormalCompletion18 = true) {
                        var item = _step18.value;

                        action(item, counter);

                        counter += 1;
                    }
                } catch (err) {
                    _didIteratorError18 = true;
                    _iteratorError18 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion18 && _iterator18.return) {
                            _iterator18.return();
                        }
                    } finally {
                        if (_didIteratorError18) {
                            throw _iteratorError18;
                        }
                    }
                }
            }

            /**
             * Return a collection of groupings (i.e., objects with a property called 'key' that
             * contains the grouping key and a property called 'values' that contains an array
             * of elements that are grouped under the grouping key).  The array of elements grouped
             * under the grouping key will be elements of 'this' collection (if no `elementSelector` 
             * is given) or projected elements given by `elementSelector`.  The grouping key for 
             * each element in 'this' collection is given by the `keySelector` function.  If a
             * `keyComparer` function is given, it will be used to determine equality among the
             * grouping keys (if `comparer` is not given, it the "===" operator will be used).
             * 
             * @param {projection} keySelector - The function that returns the grouping key for an element 
             * @param {projection} [elementSelector] - The function that projects elements to be returned 
             * @param {comparer|equalityComparer} [keyComparer] - The function used to compare grouping keys
             * @returns {Linq} - A Linq object representing a collection of `Grouping` objects.
             */

        }, {
            key: 'groupBy',
            value: function groupBy(keySelector, elementSelector, keyComparer) {
                LinqInternal.validateRequiredFunction(keySelector, 'Invalid key selector.');
                LinqInternal.validateOptionalFunction(elementSelector, 'Invalid element selector.');
                LinqInternal.validateOptionalFunction(keyComparer, 'Invalid key comparer.');

                var normalizedKeyComparer = LinqInternal.normalizeComparerOrDefault(keyComparer);

                var iterable = this.toIterable();
                var groupings = [];
                var groupingsLinq = new Linq(groupings);

                var _iteratorNormalCompletion19 = true;
                var _didIteratorError19 = false;
                var _iteratorError19 = undefined;

                try {
                    var _loop = function _loop() {
                        var item = _step19.value;

                        var key = keySelector(item);
                        var element = elementSelector == null ? item : elementSelector(item);

                        var foundGroup = groupingsLinq.firstOrDefault(function (x) {
                            return normalizedKeyComparer(x.key, key);
                        }, null);

                        if (foundGroup == null) groupings.push(new Grouping(key, [element]));else foundGroup.values.push(element);
                    };

                    for (var _iterator19 = iterable[Symbol.iterator](), _step19; !(_iteratorNormalCompletion19 = (_step19 = _iterator19.next()).done); _iteratorNormalCompletion19 = true) {
                        _loop();
                    }
                } catch (err) {
                    _didIteratorError19 = true;
                    _iteratorError19 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion19 && _iterator19.return) {
                            _iterator19.return();
                        }
                    } finally {
                        if (_didIteratorError19) {
                            throw _iteratorError19;
                        }
                    }
                }

                return groupingsLinq;
            }

            /**
             * Returns a "left outer" join of 'this' collection (the "outer" collection) and the `inner`
             * collection, using the `outerKeySelector` and `innerKeySelector` to project the keys from 
             * each collection, and using the `keyComparer` function (if it is given) to compare the
             * projected keys.  If the `keyComparer` is not given, the "===" operator will be used to 
             * compare the projected keys.  The `resultSelector` function is used to convert the joined 
             * results into the results that are returned by the groupJoin function.  The `resultSelector` 
             * takes as parameters the outer object (of the join) and an array of the joined inner objects 
             * (this array will be an empty array if there were no inner elements associated with the outer
             * element).
             * 
             * @param {LinqCompatible} inner - The collection that is "left-outer" joined with 'this' collection
             * @param {projection} outerKeySelector - The function that projects the key for the outer elements (in 'this' collection)
             * @param {projection} innerKeySelector - The function that projects the key for the inner elements
             * @param {biSourceProjection} resultSelector - The function that converts the joined results into the results returned
             * @param {comparer|equalityComparer} [keyComparer] - The function used to compare the projected keys
             * @returns {Linq}
             */

        }, {
            key: 'groupJoin',
            value: function groupJoin(inner, outerKeySelector, innerKeySelector, resultSelector, keyComparer) {
                if (inner == null) throw new Error('Invalid inner collection.');

                LinqInternal.validateRequiredFunction(outerKeySelector, 'Invalid outer key selector.');
                LinqInternal.validateRequiredFunction(innerKeySelector, 'Invalid inner key selector.');
                LinqInternal.validateRequiredFunction(resultSelector, 'Invalid result selector.');
                LinqInternal.validateOptionalFunction(keyComparer, 'Invalid key comparer.');

                var normalizedKeyComparer = LinqInternal.normalizeComparerOrDefault(keyComparer);
                var innerLinq = LinqInternal.ensureLinq(inner);
                var iterable = this.toIterable();
                var groupings = innerLinq.groupBy(innerKeySelector, null, keyComparer);
                var results = [];

                var _iteratorNormalCompletion20 = true;
                var _didIteratorError20 = false;
                var _iteratorError20 = undefined;

                try {
                    var _loop2 = function _loop2() {
                        var item = _step20.value;

                        var outerKey = outerKeySelector(item);

                        var groupValues = groupings.firstOrDefault(function (x) {
                            return normalizedKeyComparer(x.key, outerKey);
                        });

                        results.push(resultSelector(item, groupValues == null ? [] : groupValues.values));
                    };

                    for (var _iterator20 = iterable[Symbol.iterator](), _step20; !(_iteratorNormalCompletion20 = (_step20 = _iterator20.next()).done); _iteratorNormalCompletion20 = true) {
                        _loop2();
                    }
                } catch (err) {
                    _didIteratorError20 = true;
                    _iteratorError20 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion20 && _iterator20.return) {
                            _iterator20.return();
                        }
                    } finally {
                        if (_didIteratorError20) {
                            throw _iteratorError20;
                        }
                    }
                }

                return new Linq(results);
            }

            /**
             * Returns a collection of objects with the "key" property of each object equal to either the zero-based
             * index of the element in 'this' collection (if `startIndex` is not given) or the index, starting at
             * `startIndex`, of the element in 'this' collection, and with the "value" property of the object equal to
             * the element in 'this' collection.
             * 
             * @param {number} [startIndex] - The starting index for the results (defaults to `0`)
             */

        }, {
            key: 'index',
            value: function index(startIndex) {
                if (startIndex == null) startIndex = 0;

                if (isNaN(startIndex)) throw new Error('Invalid startIndex.');

                return this.select(function (x, i) {
                    return { key: startIndex + i, value: x };
                });
            }

            /**
             * Returns the index of the first element that satisfies the `predicate`.  Returns the value "-1" if
             * none of the elements satisfy the `predicate`.
             * 
             * @param {predicate} predicate - The function used to determine which index to return
             * @returns {number}
             */

        }, {
            key: 'indexOf',
            value: function indexOf(predicate) {
                LinqInternal.validateRequiredFunction(predicate, 'Invalid predicate.');

                var iterable = this.toIterable();
                var counter = 0;

                var _iteratorNormalCompletion21 = true;
                var _didIteratorError21 = false;
                var _iteratorError21 = undefined;

                try {
                    for (var _iterator21 = iterable[Symbol.iterator](), _step21; !(_iteratorNormalCompletion21 = (_step21 = _iterator21.next()).done); _iteratorNormalCompletion21 = true) {
                        var item = _step21.value;

                        if (predicate(item)) return counter;

                        counter += 1;
                    }
                } catch (err) {
                    _didIteratorError21 = true;
                    _iteratorError21 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion21 && _iterator21.return) {
                            _iterator21.return();
                        }
                    } finally {
                        if (_didIteratorError21) {
                            throw _iteratorError21;
                        }
                    }
                }

                return -1;
            }

            /**
             * Returns the index of the first element to be equal to the given `element`.  If the optional `comparer` 
             * function is given, then the `comparer` function is used to determine equality between the elements 
             * of 'this' collection and the given `element`.
             * 
             * @param {*} element - The element to find within the collection
             * @param {comparer|equalityComparer} [comparer] = The function used to compare the elements of the collection
             * @returns {number}
             */

        }, {
            key: 'indexOfElement',
            value: function indexOfElement(element, comparer) {
                LinqInternal.validateOptionalFunction(comparer, 'Invalid comparer.');

                var normalizedComparer = LinqInternal.normalizeComparerOrDefault(comparer);
                var iterable = this.toIterable();
                var counter = 0;

                var _iteratorNormalCompletion22 = true;
                var _didIteratorError22 = false;
                var _iteratorError22 = undefined;

                try {
                    for (var _iterator22 = iterable[Symbol.iterator](), _step22; !(_iteratorNormalCompletion22 = (_step22 = _iterator22.next()).done); _iteratorNormalCompletion22 = true) {
                        var item = _step22.value;

                        if (normalizedComparer(element, item)) return counter;

                        counter += 1;
                    }
                } catch (err) {
                    _didIteratorError22 = true;
                    _iteratorError22 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion22 && _iterator22.return) {
                            _iterator22.return();
                        }
                    } finally {
                        if (_didIteratorError22) {
                            throw _iteratorError22;
                        }
                    }
                }

                return -1;
            }

            /**
             * Returns the intersection of elements in 'this' collection and the `second` collection, using the
             * `comparer` function to determine whether two different elements are equal.  If the `comparer` 
             * function is not given, then the "===" operator will be used to compare elements.
             * 
             * @param {LinqCompatible} second - The collection of elements to test for intersection
             * @param {comparer|equalityComparer} [comparer] - The function used to compare elements
             * @returns {Linq}
             */

        }, {
            key: 'intersect',
            value: function intersect(second, comparer) {
                var _marked6 = /*#__PURE__*/regeneratorRuntime.mark(intersectGenerator);

                LinqInternal.validateOptionalFunction(comparer, 'Invalid comparer.');

                var secondLinq = LinqInternal.ensureLinq(second);
                var normalizedComparer = comparer == null ? null : Linq.normalizeComparer(comparer);

                var firstIterable = this.toIterable();
                var secondIterable = secondLinq.toIterable();

                var includedSet = SimpleSet.initialize(secondIterable, normalizedComparer);

                function intersectGenerator() {
                    var _iteratorNormalCompletion23, _didIteratorError23, _iteratorError23, _iterator23, _step23, item, wasRemoved;

                    return regeneratorRuntime.wrap(function intersectGenerator$(_context7) {
                        while (1) {
                            switch (_context7.prev = _context7.next) {
                                case 0:
                                    _iteratorNormalCompletion23 = true;
                                    _didIteratorError23 = false;
                                    _iteratorError23 = undefined;
                                    _context7.prev = 3;
                                    _iterator23 = firstIterable[Symbol.iterator]();

                                case 5:
                                    if (_iteratorNormalCompletion23 = (_step23 = _iterator23.next()).done) {
                                        _context7.next = 14;
                                        break;
                                    }

                                    item = _step23.value;
                                    wasRemoved = includedSet.remove(item);

                                    if (!wasRemoved) {
                                        _context7.next = 11;
                                        break;
                                    }

                                    _context7.next = 11;
                                    return item;

                                case 11:
                                    _iteratorNormalCompletion23 = true;
                                    _context7.next = 5;
                                    break;

                                case 14:
                                    _context7.next = 20;
                                    break;

                                case 16:
                                    _context7.prev = 16;
                                    _context7.t0 = _context7['catch'](3);
                                    _didIteratorError23 = true;
                                    _iteratorError23 = _context7.t0;

                                case 20:
                                    _context7.prev = 20;
                                    _context7.prev = 21;

                                    if (!_iteratorNormalCompletion23 && _iterator23.return) {
                                        _iterator23.return();
                                    }

                                case 23:
                                    _context7.prev = 23;

                                    if (!_didIteratorError23) {
                                        _context7.next = 26;
                                        break;
                                    }

                                    throw _iteratorError23;

                                case 26:
                                    return _context7.finish(23);

                                case 27:
                                    return _context7.finish(20);

                                case 28:
                                case 'end':
                                    return _context7.stop();
                            }
                        }
                    }, _marked6, this, [[3, 16, 20, 28], [21,, 23, 27]]);
                }

                return new Linq(intersectGenerator);
            }

            /**
             * Returns an "inner" join of 'this' collection (the "outer" collection) and the `inner`
             * collection, using the `outerKeySelector` and `innerKeySelector` functions to project the
             * keys from each collection, and using the `keyComparer` function (if it is given) to compare
             * the projected keys.  If the `keyComparer` is not given, the "===" operator will be used to 
             * compare the projected keys.  The `resultSelector` function is used to convert the joined
             * results into the results that are returned by the join function.  The `resultSelector` 
             * function takes as parameters the outer object and the inner object of the join.
             * 
             * @param {LinqCompatible} inner - The collection that is "inner" joined with 'this' collection
             * @param {projection} outerKeySelector - The function that projects the key for the outer elements (in 'this' collection)
             * @param {projection} innerKeySelector - The function that projects the key for the inner elements
             * @param {biSourceProjection} resultSelector - The function that converts the joined results into results returned
             * @param {comparer|equalityComparer} [keyComparer] - The function used to compare the projected keys
             */

        }, {
            key: 'join',
            value: function join(inner, outerKeySelector, innerKeySelector, resultSelector, keyComparer) {
                var _marked7 = /*#__PURE__*/regeneratorRuntime.mark(joinGenerator);

                if (inner == null) throw new Error('Invalid inner collection.');

                LinqInternal.validateRequiredFunction(outerKeySelector, 'Invalid outer key selector.');
                LinqInternal.validateRequiredFunction(innerKeySelector, 'Invalid inner key selector.');
                LinqInternal.validateRequiredFunction(resultSelector, 'Invalid result selector.');
                LinqInternal.validateOptionalFunction(keyComparer, 'Invalid key comparer.');

                var innerLinq = LinqInternal.ensureLinq(inner);
                var normalizedComparer = LinqInternal.normalizeComparerOrDefault(keyComparer);
                var innerGroupings = innerLinq.groupBy(innerKeySelector, null, normalizedComparer);
                var outerIterable = this.toIterable();

                function joinGenerator() {
                    var _this3 = this;

                    var _iteratorNormalCompletion24, _didIteratorError24, _iteratorError24, _loop3, _iterator24, _step24;

                    return regeneratorRuntime.wrap(function joinGenerator$(_context9) {
                        while (1) {
                            switch (_context9.prev = _context9.next) {
                                case 0:
                                    _iteratorNormalCompletion24 = true;
                                    _didIteratorError24 = false;
                                    _iteratorError24 = undefined;
                                    _context9.prev = 3;
                                    _loop3 = /*#__PURE__*/regeneratorRuntime.mark(function _loop3() {
                                        var item, outerKey, groupValues, _iteratorNormalCompletion25, _didIteratorError25, _iteratorError25, _iterator25, _step25, groupItem;

                                        return regeneratorRuntime.wrap(function _loop3$(_context8) {
                                            while (1) {
                                                switch (_context8.prev = _context8.next) {
                                                    case 0:
                                                        item = _step24.value;
                                                        outerKey = outerKeySelector(item);
                                                        groupValues = innerGroupings.firstOrDefault(function (x) {
                                                            return normalizedComparer(x.key, outerKey);
                                                        });

                                                        if (!(groupValues != null && groupValues.values.length > 0)) {
                                                            _context8.next = 30;
                                                            break;
                                                        }

                                                        _iteratorNormalCompletion25 = true;
                                                        _didIteratorError25 = false;
                                                        _iteratorError25 = undefined;
                                                        _context8.prev = 7;
                                                        _iterator25 = groupValues.values[Symbol.iterator]();

                                                    case 9:
                                                        if (_iteratorNormalCompletion25 = (_step25 = _iterator25.next()).done) {
                                                            _context8.next = 16;
                                                            break;
                                                        }

                                                        groupItem = _step25.value;
                                                        _context8.next = 13;
                                                        return resultSelector(item, groupItem);

                                                    case 13:
                                                        _iteratorNormalCompletion25 = true;
                                                        _context8.next = 9;
                                                        break;

                                                    case 16:
                                                        _context8.next = 22;
                                                        break;

                                                    case 18:
                                                        _context8.prev = 18;
                                                        _context8.t0 = _context8['catch'](7);
                                                        _didIteratorError25 = true;
                                                        _iteratorError25 = _context8.t0;

                                                    case 22:
                                                        _context8.prev = 22;
                                                        _context8.prev = 23;

                                                        if (!_iteratorNormalCompletion25 && _iterator25.return) {
                                                            _iterator25.return();
                                                        }

                                                    case 25:
                                                        _context8.prev = 25;

                                                        if (!_didIteratorError25) {
                                                            _context8.next = 28;
                                                            break;
                                                        }

                                                        throw _iteratorError25;

                                                    case 28:
                                                        return _context8.finish(25);

                                                    case 29:
                                                        return _context8.finish(22);

                                                    case 30:
                                                    case 'end':
                                                        return _context8.stop();
                                                }
                                            }
                                        }, _loop3, _this3, [[7, 18, 22, 30], [23,, 25, 29]]);
                                    });
                                    _iterator24 = outerIterable[Symbol.iterator]();

                                case 6:
                                    if (_iteratorNormalCompletion24 = (_step24 = _iterator24.next()).done) {
                                        _context9.next = 11;
                                        break;
                                    }

                                    return _context9.delegateYield(_loop3(), 't0', 8);

                                case 8:
                                    _iteratorNormalCompletion24 = true;
                                    _context9.next = 6;
                                    break;

                                case 11:
                                    _context9.next = 17;
                                    break;

                                case 13:
                                    _context9.prev = 13;
                                    _context9.t1 = _context9['catch'](3);
                                    _didIteratorError24 = true;
                                    _iteratorError24 = _context9.t1;

                                case 17:
                                    _context9.prev = 17;
                                    _context9.prev = 18;

                                    if (!_iteratorNormalCompletion24 && _iterator24.return) {
                                        _iterator24.return();
                                    }

                                case 20:
                                    _context9.prev = 20;

                                    if (!_didIteratorError24) {
                                        _context9.next = 23;
                                        break;
                                    }

                                    throw _iteratorError24;

                                case 23:
                                    return _context9.finish(20);

                                case 24:
                                    return _context9.finish(17);

                                case 25:
                                case 'end':
                                    return _context9.stop();
                            }
                        }
                    }, _marked7, this, [[3, 13, 17, 25], [18,, 20, 24]]);
                }

                return new Linq(joinGenerator);
            }

            /**
             * Returns either the last element of 'this' collection (if `predicate` is not given) or the
             * last element of 'this' collection that satisfies the `predicate` (if `predicate` is given).
             * If there is no "last" element to return (either because 'this' collection is empty or no element
             * satisfies the `predicate`), an error is thrown.
             * 
             * @param {predicate} [predicate] - The function used to determine the element to return
             * @returns {*}
             */

        }, {
            key: 'last',
            value: function last(predicate) {
                LinqInternal.validateOptionalFunction(predicate, 'Invalid predicate.');

                var iterable = this.toIterable();

                return LinqInternal.lastBasedOperator(iterable, predicate, null, true);
            }

            /**
             * Returns the index of the last element that satisfies the `predicate`.  Returns the value "-1" if
             * none of the elements satisfy the `predicate`.
             * 
             * @param {predicate} predicate - The function used to determine which index to return
             * @returns {number}
             */

        }, {
            key: 'lastIndexOf',
            value: function lastIndexOf(predicate) {
                LinqInternal.validateRequiredFunction(predicate, 'Invalid predicate.');

                var element = this.index().where(function (x) {
                    return predicate(x.value);
                }).reverse().firstOrDefault();

                return element == null ? -1 : element.key;
            }

            /**
             * Returns the index of the last element to be equal to the given `item`.  If the optional `comparer` 
             * function is given, then the `comparer` function is used to determine equality between the elements 
             * of 'this' collection and the given 'item'.
             * 
             * @param {*} item - The item to find within 'this' collection
             * @param {comparer|equalityComparer} [comparer] - The function used to compare the elements of 'this' collection with the given `item`
             * @returns {*} 
             */

        }, {
            key: 'lastIndexOfElement',
            value: function lastIndexOfElement(item, comparer) {
                LinqInternal.validateOptionalFunction(comparer, 'Invalid comparer.');

                var normalizedComparer = LinqInternal.normalizeComparerOrDefault(comparer);

                return this.lastIndexOf(function (x) {
                    return normalizedComparer(x, item);
                });
            }

            /**
             * Returns either the last element of 'this' collection (if 'predicate' is not given) or the
             * last element of 'this' collection that satisfies the 'predicate' (if 'predicate is given).
             * If there is no "last" element to return (either because 'this' collection is empty or no element
             * satisfies the 'predicate'), the 'defaultValue' is returned.
             * 
             * @param {predicate} [predicate] - The predicate function used to determine the element to return 
             * @param {*} [defaultValue] - The value to return if no "last" element is found
             * @returns {*} 
             */

        }, {
            key: 'lastOrDefault',
            value: function lastOrDefault(predicate, defaultValue) {
                LinqInternal.validateOptionalFunction(predicate, 'Invalid predicate.');

                var iterable = this.toIterable();

                return LinqInternal.lastBasedOperator(iterable, predicate, defaultValue, false);
            }

            /**
             * Returns either the minimum element (if `selector` is not given) or the minimum element projected by 
             * the `selector` function in 'this' collection.  If 'this' collection is empty, an error is thrown.
             * 
             * @param {projection} [selector] - The function that projects the value to use to determine a minimum
             * @returns {*} 
             */

        }, {
            key: 'min',
            value: function min(selector) {
                LinqInternal.validateOptionalFunction(selector, 'Invalid selector.');

                var iterable = this.toIterable();

                if (LinqInternal.isEmptyIterable(iterable)) throw new Error('No minimum element.');

                if (selector == null) selector = Linq.identity;

                return LinqInternal.getExtremeValue(this, selector, LinqInternal.minComparer, selector);
            }

            /**
             * Returns the "minimum" element of 'this' collection, determined by the value projected by 
             * the `selector` function.  If 'this' collection is empty, an error is thrown.
             * 
             * @param {projection} selector - The function that projects the value to use to determine a minimum
             * @returns {*}
             */

        }, {
            key: 'minBy',
            value: function minBy(selector) {
                LinqInternal.validateRequiredFunction(selector, 'Invalid selector.');

                var iterable = this.toIterable();

                if (LinqInternal.isEmptyIterable(iterable)) throw new Error('No minimum element.');

                return LinqInternal.getExtremeValue(this, selector, LinqInternal.minComparer, Linq.identity);
            }

            /**
             * Returns either the maximum element (if `selector` is not given) or the maximum element projected by 
             * the `selector` function in 'this' collection.  If 'this' collection is empty, an error is thrown.
             * 
             * @param {projection} [selector] - The function that projects the value to use to determine the maximum
             * @returns {*} 
             */

        }, {
            key: 'max',
            value: function max(selector) {
                LinqInternal.validateOptionalFunction(selector, 'Invalid selector.');

                var iterable = this.toIterable();

                if (LinqInternal.isEmptyIterable(iterable)) throw new Error('No maximum element.');

                if (selector == null) selector = Linq.identity;

                return LinqInternal.getExtremeValue(this, selector, LinqInternal.maxComparer, selector);
            }

            /**
             * Returns the "maximum" element of 'this' collection, determined by the value projected by 
             * the `selector` function.  If 'this' collection is empty, an error is thrown.
             * 
             * @param {projection} selector - The function that projects the value to use to determine the maximum
             * @returns {*} 
             */

        }, {
            key: 'maxBy',
            value: function maxBy(selector) {
                LinqInternal.validateRequiredFunction(selector, 'Invalid selector.');

                var iterable = this.toIterable();

                if (LinqInternal.isEmptyIterable(iterable)) throw new Error('No maximum element.');

                return LinqInternal.getExtremeValue(this, selector, LinqInternal.maxComparer, Linq.identity);
            }

            /**
             * Returns the elements of 'this' collection sorted in ascending order of the projected value
             * given by the `keySelector` function, using the `comparer` function to compare the projected
             * values.  If the `comparer` function is not given, a comparer that uses the natural ordering 
             * of the values will be used to compare the projected values.  Note that subsequent, immediate 
             * calls to either thenBy or thenByDescending will provide subsequent "levels" of sorting (that 
             * is, sorting when two elements are determined to be equal by this orderBy call).
             * 
             * @param {projection} keySelector - The function that projects the value used to sort the elements
             * @param {comparer} [comparer] - The function that compares the projected values
             * @returns {Linq}
             */

        }, {
            key: 'orderBy',
            value: function orderBy(keySelector, comparer) {
                return LinqInternal.orderByBasedOperator(this, keySelector, comparer, false);
            }

            /**
             * Returns the elements of 'this' collection sorted in descending order of the projected value
             * given by the `keySelector` function, using the `comparer` function to compare the projected
             * values.  If the `comparer` function is not given, a comparer that uses the natural ordering 
             * of the values will be used to compare the projected values.  Note that subsequent, immediate 
             * calls to either thenBy or thenByDescending will provide subsequent "levels" of sorting (that 
             * is, sorting when two elements are determined to be equal by this orderBy call).
             * 
             * @param {projection} keySelector - The function that projects the value used to sort the elements
             * @param {comparer} [comparer] - The function that compares the projected values
             * @returns {Linq}
             */

        }, {
            key: 'orderByDescending',
            value: function orderByDescending(keySelector, comparer) {
                return LinqInternal.orderByBasedOperator(this, keySelector, comparer, true);
            }

            /**
             * Returns a collection the same elements as 'this' collection but with extra elements added 
             * to the end so that the results collection has a length of at least `width`.  The extra
             * elements that are added are equal to the `padding` value.
             * 
             * @param {number} width - The length that the results collection will be at least equal to
             * @param {*} padding - The value that is added to the results collection to fill it out
             * @returns {Linq}
             */

        }, {
            key: 'pad',
            value: function pad(width, padding) {
                return this.padWith(width, function () {
                    return padding;
                });
            }

            /**
             * Returns a collection the same elements as 'this' collection but with extra elements added 
             * to the end so that the results collection has a length of at least `width`.  The extra
             * elements that are added are determined by the `paddingSelector` function—a function that 
             * takes an integer as a parameter (i.e., the position/index that the element returned by the 
             * `paddingSelector` function will have in the results collection .  
             * 
             * @param {number} width - The length that the results collection will be at least equal to
             * @param {projection} paddingSelector - The function that indicates the value to add to the results collection
             * @returns {Linq}
             */

        }, {
            key: 'padWith',
            value: function padWith(width, paddingSelector) {
                var _marked8 = /*#__PURE__*/regeneratorRuntime.mark(padWithGenerator);

                if (!LinqInternal.isValidNumber(width)) throw new Error('Invalid width.');

                LinqInternal.validateRequiredFunction(paddingSelector, 'Invalid padding selector.');

                var iterable = this.toIterable();

                function padWithGenerator() {
                    var counter, _iteratorNormalCompletion26, _didIteratorError26, _iteratorError26, _iterator26, _step26, _item3;

                    return regeneratorRuntime.wrap(function padWithGenerator$(_context10) {
                        while (1) {
                            switch (_context10.prev = _context10.next) {
                                case 0:
                                    counter = 0;
                                    _iteratorNormalCompletion26 = true;
                                    _didIteratorError26 = false;
                                    _iteratorError26 = undefined;
                                    _context10.prev = 4;
                                    _iterator26 = iterable[Symbol.iterator]();

                                case 6:
                                    if (_iteratorNormalCompletion26 = (_step26 = _iterator26.next()).done) {
                                        _context10.next = 14;
                                        break;
                                    }

                                    _item3 = _step26.value;
                                    _context10.next = 10;
                                    return _item3;

                                case 10:
                                    counter += 1;

                                case 11:
                                    _iteratorNormalCompletion26 = true;
                                    _context10.next = 6;
                                    break;

                                case 14:
                                    _context10.next = 20;
                                    break;

                                case 16:
                                    _context10.prev = 16;
                                    _context10.t0 = _context10['catch'](4);
                                    _didIteratorError26 = true;
                                    _iteratorError26 = _context10.t0;

                                case 20:
                                    _context10.prev = 20;
                                    _context10.prev = 21;

                                    if (!_iteratorNormalCompletion26 && _iterator26.return) {
                                        _iterator26.return();
                                    }

                                case 23:
                                    _context10.prev = 23;

                                    if (!_didIteratorError26) {
                                        _context10.next = 26;
                                        break;
                                    }

                                    throw _iteratorError26;

                                case 26:
                                    return _context10.finish(23);

                                case 27:
                                    return _context10.finish(20);

                                case 28:
                                    if (!(counter < width)) {
                                        _context10.next = 34;
                                        break;
                                    }

                                    _context10.next = 31;
                                    return paddingSelector(counter);

                                case 31:
                                    counter += 1;
                                    _context10.next = 28;
                                    break;

                                case 34:
                                case 'end':
                                    return _context10.stop();
                            }
                        }
                    }, _marked8, this, [[4, 16, 20, 28], [21,, 23, 27]]);
                }

                return new Linq(padWithGenerator);
            }

            /**
             * Returns the same elements as 'this' collection, but first executes an `action` on
             * each element of 'this' collection.
             * 
             * @param {action} action - The function to execute on each element of 'this' collection
             * @returns {Linq}
             */

        }, {
            key: 'pipe',
            value: function pipe(action) {
                LinqInternal.validateRequiredFunction(action, 'Invalid action.');

                var iterable = this.toIterable();
                var counter = 0;

                var _iteratorNormalCompletion27 = true;
                var _didIteratorError27 = false;
                var _iteratorError27 = undefined;

                try {
                    for (var _iterator27 = iterable[Symbol.iterator](), _step27; !(_iteratorNormalCompletion27 = (_step27 = _iterator27.next()).done); _iteratorNormalCompletion27 = true) {
                        var _item4 = _step27.value;

                        action(_item4, counter);

                        counter += 1;
                    }
                } catch (err) {
                    _didIteratorError27 = true;
                    _iteratorError27 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion27 && _iterator27.return) {
                            _iterator27.return();
                        }
                    } finally {
                        if (_didIteratorError27) {
                            throw _iteratorError27;
                        }
                    }
                }

                return new Linq(this.source);
            }

            /**
             * Returns 'this' collection with the `value` prepended (i.e, added to the front).
             * 
             * @param {*} value - The value to be prepended to 'this' collection
             * @returns {Linq}
             */

        }, {
            key: 'prepend',
            value: function prepend(value) {
                var _marked9 = /*#__PURE__*/regeneratorRuntime.mark(prependGenerator);

                var iterable = this.toIterable();

                function prependGenerator() {
                    var _iteratorNormalCompletion28, _didIteratorError28, _iteratorError28, _iterator28, _step28, _item5;

                    return regeneratorRuntime.wrap(function prependGenerator$(_context11) {
                        while (1) {
                            switch (_context11.prev = _context11.next) {
                                case 0:
                                    _context11.next = 2;
                                    return value;

                                case 2:
                                    _iteratorNormalCompletion28 = true;
                                    _didIteratorError28 = false;
                                    _iteratorError28 = undefined;
                                    _context11.prev = 5;
                                    _iterator28 = iterable[Symbol.iterator]();

                                case 7:
                                    if (_iteratorNormalCompletion28 = (_step28 = _iterator28.next()).done) {
                                        _context11.next = 14;
                                        break;
                                    }

                                    _item5 = _step28.value;
                                    _context11.next = 11;
                                    return _item5;

                                case 11:
                                    _iteratorNormalCompletion28 = true;
                                    _context11.next = 7;
                                    break;

                                case 14:
                                    _context11.next = 20;
                                    break;

                                case 16:
                                    _context11.prev = 16;
                                    _context11.t0 = _context11['catch'](5);
                                    _didIteratorError28 = true;
                                    _iteratorError28 = _context11.t0;

                                case 20:
                                    _context11.prev = 20;
                                    _context11.prev = 21;

                                    if (!_iteratorNormalCompletion28 && _iterator28.return) {
                                        _iterator28.return();
                                    }

                                case 23:
                                    _context11.prev = 23;

                                    if (!_didIteratorError28) {
                                        _context11.next = 26;
                                        break;
                                    }

                                    throw _iteratorError28;

                                case 26:
                                    return _context11.finish(23);

                                case 27:
                                    return _context11.finish(20);

                                case 28:
                                case 'end':
                                    return _context11.stop();
                            }
                        }
                    }, _marked9, this, [[5, 16, 20, 28], [21,, 23, 27]]);
                }

                return new Linq(prependGenerator);
            }

            /**
             * Returns an equal-length collection where the N-th element is the aggregate of the
             * `operation` function performed on the first N-1 elements of 'this' collection (the
             * first element of the results is set to the `identity` value).  The `operation` 
             * function should be a commutative, binary operation (e.g., sum, multiplication, etc.)
             * Also, the `identity` parameter should be passed the value that is the "identity" for
             * the `operation`—that is, when the `operator` is applied to the `identity` value and 
             * any other value, the results is that same value (e.g., for addition, 0 + n = n; for
             * multiplication, 1 * n = n; for string concatenation, "" + str = str; etc.)
             * 
             * @param {aggregator} operation - The function that aggregates the values of 'this' collection 
             * @param {*} identity - The identity value of the operation
             * @returns {Linq}
             */

        }, {
            key: 'prescan',
            value: function prescan(operation, identity) {
                var _marked10 = /*#__PURE__*/regeneratorRuntime.mark(prescanGenerator);

                LinqInternal.validateRequiredFunction(operation, 'Invalid operation.');

                var iterable = this.toIterable();
                var iterator = LinqInternal.getIterator(iterable);

                function prescanGenerator() {
                    var acc, state, _state, value;

                    return regeneratorRuntime.wrap(function prescanGenerator$(_context12) {
                        while (1) {
                            switch (_context12.prev = _context12.next) {
                                case 0:
                                    acc = identity;
                                    state = iterator.next();

                                case 2:
                                    if (state.done) {
                                        _context12.next = 10;
                                        break;
                                    }

                                    _context12.next = 5;
                                    return acc;

                                case 5:
                                    _state = state, value = _state.value;


                                    state = iterator.next();

                                    if (!state.done) acc = operation(acc, value);
                                    _context12.next = 2;
                                    break;

                                case 10:
                                case 'end':
                                    return _context12.stop();
                            }
                        }
                    }, _marked10, this);
                }

                return new Linq(prescanGenerator);
            }

            /**
             * Returns the elements of 'this' collection in reverse order.
             * 
             * @returns {Linq}
             */

        }, {
            key: 'reverse',
            value: function reverse() {
                var _marked11 = /*#__PURE__*/regeneratorRuntime.mark(gen);

                var iterable = this.toIterable();

                function gen() {
                    var i;
                    return regeneratorRuntime.wrap(function gen$(_context13) {
                        while (1) {
                            switch (_context13.prev = _context13.next) {
                                case 0:
                                    i = iterable.length - 1;

                                case 1:
                                    if (!(i >= 0)) {
                                        _context13.next = 7;
                                        break;
                                    }

                                    _context13.next = 4;
                                    return iterable[i];

                                case 4:
                                    i--;
                                    _context13.next = 1;
                                    break;

                                case 7:
                                case 'end':
                                    return _context13.stop();
                            }
                        }
                    }, _marked11, this);
                }

                if (!LinqInternal.isIndexedCollection(iterable) || !LinqInternal.isCollectionHavingLength(iterable)) iterable = Array.from(iterable);

                return new Linq(gen);
            }

            /**
             * If the `seed` is not given, returns an equal-length collection where the N-th element
             * is the aggregate of the `operation` function performed on the first N elements of
             * 'this' collection.  
             * 
             * If the `seed` is given, then the same as the if the `seed` where not given but on 
             * 'this' collection with the `seed` prepended to it.  Note, that with the `seed` given,
             * this function returns the result of calling `aggregate` (with the same `operation` and
             * `seed`) but with the intermediate aggregation results included with the final aggregation
             * result.
             *   
             * The `operation` function should be a commutative, binary operation (e.g., sum, 
             * multiplication, etc.).
             * 
             * @param {aggregator} operation - The function that aggregates the values of 'this' collection
             * @param {*} [seed] - An initial, seed value that causes scan to generate intermediate values of aggregate function
             * @returns {Linq}
             */

        }, {
            key: 'scan',
            value: function scan(operation, seed) {
                var _marked12 = /*#__PURE__*/regeneratorRuntime.mark(scanGenerator);

                LinqInternal.validateRequiredFunction(operation, 'Invalid operation.');

                var col = seed === undefined ? this : this.prepend(seed);

                function scanGenerator() {
                    var iterable, iterator, state, acc;
                    return regeneratorRuntime.wrap(function scanGenerator$(_context14) {
                        while (1) {
                            switch (_context14.prev = _context14.next) {
                                case 0:
                                    iterable = col.toIterable();
                                    iterator = LinqInternal.getIterator(iterable);
                                    state = iterator.next();

                                    if (!state.done) {
                                        _context14.next = 5;
                                        break;
                                    }

                                    return _context14.abrupt('return');

                                case 5:
                                    acc = state.value;
                                    _context14.next = 8;
                                    return acc;

                                case 8:

                                    state = iterator.next();

                                case 9:
                                    if (state.done) {
                                        _context14.next = 16;
                                        break;
                                    }

                                    acc = operation(acc, state.value);
                                    _context14.next = 13;
                                    return acc;

                                case 13:

                                    state = iterator.next();
                                    _context14.next = 9;
                                    break;

                                case 16:
                                case 'end':
                                    return _context14.stop();
                            }
                        }
                    }, _marked12, this);
                }

                return new Linq(scanGenerator);
            }

            /**
             * Returns a collection of values projected from the elements of 'this' collection.
             * 
             * @param {indexedProjection} selector - The function that projects the values from the elements
             * @returns {Linq}
             */

        }, {
            key: 'select',
            value: function select(selector) {
                var _marked13 = /*#__PURE__*/regeneratorRuntime.mark(selectGenerator);

                LinqInternal.validateRequiredFunction(selector, 'Invalid selector.');

                var iterable = this.toIterable();
                var i = 0;

                function selectGenerator() {
                    var _iteratorNormalCompletion29, _didIteratorError29, _iteratorError29, _iterator29, _step29, _item6;

                    return regeneratorRuntime.wrap(function selectGenerator$(_context15) {
                        while (1) {
                            switch (_context15.prev = _context15.next) {
                                case 0:
                                    _iteratorNormalCompletion29 = true;
                                    _didIteratorError29 = false;
                                    _iteratorError29 = undefined;
                                    _context15.prev = 3;
                                    _iterator29 = iterable[Symbol.iterator]();

                                case 5:
                                    if (_iteratorNormalCompletion29 = (_step29 = _iterator29.next()).done) {
                                        _context15.next = 13;
                                        break;
                                    }

                                    _item6 = _step29.value;
                                    _context15.next = 9;
                                    return selector(_item6, i);

                                case 9:

                                    i += 1;

                                case 10:
                                    _iteratorNormalCompletion29 = true;
                                    _context15.next = 5;
                                    break;

                                case 13:
                                    _context15.next = 19;
                                    break;

                                case 15:
                                    _context15.prev = 15;
                                    _context15.t0 = _context15['catch'](3);
                                    _didIteratorError29 = true;
                                    _iteratorError29 = _context15.t0;

                                case 19:
                                    _context15.prev = 19;
                                    _context15.prev = 20;

                                    if (!_iteratorNormalCompletion29 && _iterator29.return) {
                                        _iterator29.return();
                                    }

                                case 22:
                                    _context15.prev = 22;

                                    if (!_didIteratorError29) {
                                        _context15.next = 25;
                                        break;
                                    }

                                    throw _iteratorError29;

                                case 25:
                                    return _context15.finish(22);

                                case 26:
                                    return _context15.finish(19);

                                case 27:
                                case 'end':
                                    return _context15.stop();
                            }
                        }
                    }, _marked13, this, [[3, 15, 19, 27], [20,, 22, 26]]);
                }

                return new Linq(selectGenerator);
            }

            /**
             * Returns the concatenation of values projected from the elements of 'this' collection by the
             * `collectionSelector` function.  If the `resultSelector` function is given, then the results
             * returned by this function will be projected from an element in the concatenation and the 
             * element that originated the part of the concatenation.  Otherwise, the results returned by
             * this function will be the element of the concatenation.
             * 
             * @param {collectionProjection} collectionSelector - The function that projects a collection of values from an element
             * @param {projection} [resultSelector] - The function that projects the results from the concatenated results
             * @returns {Linq}
             */

        }, {
            key: 'selectMany',
            value: function selectMany(collectionSelector, resultSelector) {
                var _marked14 = /*#__PURE__*/regeneratorRuntime.mark(selectManyGenerator);

                LinqInternal.validateRequiredFunction(collectionSelector, 'Invalid collection selector.');
                LinqInternal.validateOptionalFunction(resultSelector, 'Invalid result selector.');

                var iterable = this.toIterable();

                function selectManyGenerator() {
                    var i, _iteratorNormalCompletion30, _didIteratorError30, _iteratorError30, _iterator30, _step30, outerItem, projectedItems, innerIterable, _iteratorNormalCompletion31, _didIteratorError31, _iteratorError31, _iterator31, _step31, innerItem;

                    return regeneratorRuntime.wrap(function selectManyGenerator$(_context16) {
                        while (1) {
                            switch (_context16.prev = _context16.next) {
                                case 0:
                                    i = 0;
                                    _iteratorNormalCompletion30 = true;
                                    _didIteratorError30 = false;
                                    _iteratorError30 = undefined;
                                    _context16.prev = 4;
                                    _iterator30 = iterable[Symbol.iterator]();

                                case 6:
                                    if (_iteratorNormalCompletion30 = (_step30 = _iterator30.next()).done) {
                                        _context16.next = 42;
                                        break;
                                    }

                                    outerItem = _step30.value;
                                    projectedItems = collectionSelector(outerItem, i);


                                    i += 1;

                                    if (!(projectedItems == null)) {
                                        _context16.next = 12;
                                        break;
                                    }

                                    return _context16.abrupt('continue', 39);

                                case 12:
                                    innerIterable = LinqInternal.ensureLinq(projectedItems).toIterable();
                                    _iteratorNormalCompletion31 = true;
                                    _didIteratorError31 = false;
                                    _iteratorError31 = undefined;
                                    _context16.prev = 16;
                                    _iterator31 = innerIterable[Symbol.iterator]();

                                case 18:
                                    if (_iteratorNormalCompletion31 = (_step31 = _iterator31.next()).done) {
                                        _context16.next = 25;
                                        break;
                                    }

                                    innerItem = _step31.value;
                                    _context16.next = 22;
                                    return resultSelector == null ? innerItem : resultSelector(innerItem, outerItem);

                                case 22:
                                    _iteratorNormalCompletion31 = true;
                                    _context16.next = 18;
                                    break;

                                case 25:
                                    _context16.next = 31;
                                    break;

                                case 27:
                                    _context16.prev = 27;
                                    _context16.t0 = _context16['catch'](16);
                                    _didIteratorError31 = true;
                                    _iteratorError31 = _context16.t0;

                                case 31:
                                    _context16.prev = 31;
                                    _context16.prev = 32;

                                    if (!_iteratorNormalCompletion31 && _iterator31.return) {
                                        _iterator31.return();
                                    }

                                case 34:
                                    _context16.prev = 34;

                                    if (!_didIteratorError31) {
                                        _context16.next = 37;
                                        break;
                                    }

                                    throw _iteratorError31;

                                case 37:
                                    return _context16.finish(34);

                                case 38:
                                    return _context16.finish(31);

                                case 39:
                                    _iteratorNormalCompletion30 = true;
                                    _context16.next = 6;
                                    break;

                                case 42:
                                    _context16.next = 48;
                                    break;

                                case 44:
                                    _context16.prev = 44;
                                    _context16.t1 = _context16['catch'](4);
                                    _didIteratorError30 = true;
                                    _iteratorError30 = _context16.t1;

                                case 48:
                                    _context16.prev = 48;
                                    _context16.prev = 49;

                                    if (!_iteratorNormalCompletion30 && _iterator30.return) {
                                        _iterator30.return();
                                    }

                                case 51:
                                    _context16.prev = 51;

                                    if (!_didIteratorError30) {
                                        _context16.next = 54;
                                        break;
                                    }

                                    throw _iteratorError30;

                                case 54:
                                    return _context16.finish(51);

                                case 55:
                                    return _context16.finish(48);

                                case 56:
                                case 'end':
                                    return _context16.stop();
                            }
                        }
                    }, _marked14, this, [[4, 44, 48, 56], [16, 27, 31, 39], [32,, 34, 38], [49,, 51, 55]]);
                }

                return new Linq(selectManyGenerator);
            }

            /**
             * Returns whether 'this' collection is equal to the `second` collection (that is, has the same elements in the
             * same order).  If the `comparer` function is given, it is used to determine whether elements from each of the
             * two collections are equal.  Otherwise, the "===" operator is used to determine equality.
             * 
             * @param {LinqCompatible} second - The collection to which 'this' collection is compared
             * @param {comparer|equalityComparer} [comparer] - The function used to compare elements of the two collections
             * @returns {boolean}
             */

        }, {
            key: 'sequenceEqual',
            value: function sequenceEqual(second, comparer) {
                LinqInternal.validateOptionalFunction(comparer, 'Invalid comparer.');

                if (second == null) return false;

                var normalizedComparer = LinqInternal.normalizeComparerOrDefault(comparer);

                var firstIterable = this.toIterable();
                var secondIterable = LinqInternal.ensureLinq(second).toIterable();
                var firstLength = LinqInternal.getExplicitCardinality(firstIterable);
                var secondLength = LinqInternal.getExplicitCardinality(secondIterable);

                if (firstLength != null && secondLength != null && firstLength !== secondLength) return false;

                var firstIterator = LinqInternal.getIterator(firstIterable);
                var secondIterator = LinqInternal.getIterator(secondIterable);
                var firstState = firstIterator.next();
                var secondState = secondIterator.next();

                while (!firstState.done && !secondState.done) {
                    if (!normalizedComparer(firstState.value, secondState.value)) return false;

                    firstState = firstIterator.next();
                    secondState = secondIterator.next();
                }

                if (!firstState.done || !secondState.done) return false;

                return true;
            }

            /**
             * Returns whether 'this' collection is equivalent to the `second` collection (that is, has the 
             * same elements regardless of order).  If the `comparer` function is given, it is used to determine
             * whether elements from each of the two collections are equal.  Otherwise, the "===" operator is
             * used to determine equality.
             * 
             * @param {LinqCompatible} second - The collection to which 'this' collection is compared
             * @param {comparer|equalityComparer} [comparer] - The function used to compare elements of the two collections
             * @returns {boolean} 
             */

        }, {
            key: 'sequenceEquivalent',
            value: function sequenceEquivalent(second, comparer) {
                LinqInternal.validateOptionalFunction(comparer, 'Invalid comparer.');

                if (second == null) return false;

                var normalizedComparer = LinqInternal.normalizeComparerOrDefault(comparer);
                var secondLinq = LinqInternal.ensureLinq(second);

                var firstIterable = this.toIterable();
                var secondIterable = secondLinq.toIterable();
                var firstLength = LinqInternal.getExplicitCardinality(firstIterable);
                var secondLength = LinqInternal.getExplicitCardinality(secondIterable);

                if (firstLength != null && secondLength != null && firstLength !== secondLength) return false;

                var firstLookup = this.toLookup(Linq.identity, comparer);
                var secondLookup = secondLinq.toLookup(Linq.identity, comparer);

                var haveSameCount = firstLookup.count() === secondLookup.count();

                var predicate = function predicate(x) {
                    var lookupNode = secondLookup.firstOrDefault(function (y) {
                        return normalizedComparer(y.key, x.key);
                    });

                    if (lookupNode == null) return false;

                    return x.values.length === lookupNode.values.length;
                };

                return haveSameCount && firstLookup.all(predicate);
            }

            /**
             * Returns either the only element of 'this' collection (if `predicate` is not given) or the
             * first (and only) element of 'this' collection that satisfies the `predicate` (if 'predicate' is 
             * given).  If there are either multiple elements in 'this' collection (if `predicate` is not given)
             * or there are multiple elements that satisfy the 'predicate' (if `predicate` is given), then an
             * error is thrown.  If there is no "single" element (either because 'this' collection is empty or
             * no element satisfies the `predicate`), an error is thrown.
             * 
             * @param {predicate} [predicate] - The function used to determine the element to return
             * @returns {*} 
             */

        }, {
            key: 'single',
            value: function single(predicate) {
                LinqInternal.validateOptionalFunction(predicate, 'Invalid predicate.');

                var iterable = this.toIterable();

                return LinqInternal.singleBasedOperator(iterable, predicate, null, true);
            }

            /**
             * Returns either the only element of 'this' collection (if `predicate` is not given) or the
             * first (and only) element of 'this' collection that satisfies the `predicate` (if 'predicate' is 
             * given).  If there are either multiple elements in 'this' collection (if `predicate` is not given)
             * or there are multiple elements that satisfy the `predicate` (if `predicate` is given), then an
             * error is thrown.  If there is no "single" element (either because 'this' collection is empty or
             * no element satisfies the `predicate`), the `defaultValue` is returned (or `undefined` if `defaultValue`
             * is not given).
             * 
             * @param {predicate} [predicate] - The function used to determine the element to return 
             * @param {*} [defaultValue] - The default value that is returned if no single element is found
             * @returns {*} 
             */

        }, {
            key: 'singleOrDefault',
            value: function singleOrDefault(predicate, defaultValue) {
                LinqInternal.validateOptionalFunction(predicate, 'Invalid predicate.');

                var iterable = this.toIterable();

                return LinqInternal.singleBasedOperator(iterable, predicate, function () {
                    return defaultValue;
                }, false);
            }

            /**
             * Returns either the only element of 'this' collection or the value returned by the `fallback`
             * function if 'this' collection is empty.  If there are more than one element in 'this' collection,
             * then an exception will be thrown.
             * 
             * @param {constantFunction} fallback 
             */

        }, {
            key: 'singleOrFallback',
            value: function singleOrFallback(fallback) {
                LinqInternal.validateRequiredFunction(fallback, 'Invalid fallback function.');

                var iterable = this.toIterable();

                return LinqInternal.singleBasedOperator(iterable, null, fallback, false);
            }

            /**
             * Returns the elements of 'this' collection with the first `count` number of elements skipped.
             * 
             * @param {number} count - The number of elements to skip from 'this' collection
             * @returns {Linq}
             */

        }, {
            key: 'skip',
            value: function skip(count) {
                var _marked15 = /*#__PURE__*/regeneratorRuntime.mark(skipGenerator);

                if (!LinqInternal.isValidNumber(count)) throw new Error('Invalid count.');

                var iterable = this.toIterable();

                function skipGenerator() {
                    var counter, _iteratorNormalCompletion32, _didIteratorError32, _iteratorError32, _iterator32, _step32, _item7;

                    return regeneratorRuntime.wrap(function skipGenerator$(_context17) {
                        while (1) {
                            switch (_context17.prev = _context17.next) {
                                case 0:
                                    counter = 1;
                                    _iteratorNormalCompletion32 = true;
                                    _didIteratorError32 = false;
                                    _iteratorError32 = undefined;
                                    _context17.prev = 4;
                                    _iterator32 = iterable[Symbol.iterator]();

                                case 6:
                                    if (_iteratorNormalCompletion32 = (_step32 = _iterator32.next()).done) {
                                        _context17.next = 15;
                                        break;
                                    }

                                    _item7 = _step32.value;

                                    if (!(counter > count)) {
                                        _context17.next = 11;
                                        break;
                                    }

                                    _context17.next = 11;
                                    return _item7;

                                case 11:

                                    counter += 1;

                                case 12:
                                    _iteratorNormalCompletion32 = true;
                                    _context17.next = 6;
                                    break;

                                case 15:
                                    _context17.next = 21;
                                    break;

                                case 17:
                                    _context17.prev = 17;
                                    _context17.t0 = _context17['catch'](4);
                                    _didIteratorError32 = true;
                                    _iteratorError32 = _context17.t0;

                                case 21:
                                    _context17.prev = 21;
                                    _context17.prev = 22;

                                    if (!_iteratorNormalCompletion32 && _iterator32.return) {
                                        _iterator32.return();
                                    }

                                case 24:
                                    _context17.prev = 24;

                                    if (!_didIteratorError32) {
                                        _context17.next = 27;
                                        break;
                                    }

                                    throw _iteratorError32;

                                case 27:
                                    return _context17.finish(24);

                                case 28:
                                    return _context17.finish(21);

                                case 29:
                                case 'end':
                                    return _context17.stop();
                            }
                        }
                    }, _marked15, this, [[4, 17, 21, 29], [22,, 24, 28]]);
                }

                return new Linq(skipGenerator);
            }

            /**
             * Returns the elements of 'this' collection, skipping initial elements until an element satisfies
             * the `predicate` function (that first element that satisfies the `predicate` function is 
             * included in the results).
             * 
             * @param {predicate} predicate - The function that indicates when to stop skipping elements
             * @returns {Linq}
             */

        }, {
            key: 'skipUntil',
            value: function skipUntil(predicate) {
                LinqInternal.validateRequiredFunction(predicate, 'Invalid predicate.');

                return this.skipWhile(function (x) {
                    return !predicate(x);
                });
            }

            /**
             * Returns the elements of 'this' collection skipping initial elements until an element does not
             * satisfy the `predicate` function (that first element that fails to satisfy the `predicate` function
             * is included in the results).
             * 
             * @param {predicate} predicate = The function that indicates which of the initial elements to skip
             * @returns {Linq} 
             */

        }, {
            key: 'skipWhile',
            value: function skipWhile(predicate) {
                var _marked16 = /*#__PURE__*/regeneratorRuntime.mark(skipWhileGenerator);

                LinqInternal.validateRequiredFunction(predicate, 'Invalid predicate.');

                var iterable = this.toIterable();

                function skipWhileGenerator() {
                    var isSkipping, _iteratorNormalCompletion33, _didIteratorError33, _iteratorError33, _iterator33, _step33, _item8;

                    return regeneratorRuntime.wrap(function skipWhileGenerator$(_context18) {
                        while (1) {
                            switch (_context18.prev = _context18.next) {
                                case 0:
                                    isSkipping = true;
                                    _iteratorNormalCompletion33 = true;
                                    _didIteratorError33 = false;
                                    _iteratorError33 = undefined;
                                    _context18.prev = 4;
                                    _iterator33 = iterable[Symbol.iterator]();

                                case 6:
                                    if (_iteratorNormalCompletion33 = (_step33 = _iterator33.next()).done) {
                                        _context18.next = 20;
                                        break;
                                    }

                                    _item8 = _step33.value;

                                    if (isSkipping) {
                                        _context18.next = 13;
                                        break;
                                    }

                                    _context18.next = 11;
                                    return _item8;

                                case 11:
                                    _context18.next = 17;
                                    break;

                                case 13:
                                    if (predicate(_item8)) {
                                        _context18.next = 17;
                                        break;
                                    }

                                    isSkipping = false;
                                    _context18.next = 17;
                                    return _item8;

                                case 17:
                                    _iteratorNormalCompletion33 = true;
                                    _context18.next = 6;
                                    break;

                                case 20:
                                    _context18.next = 26;
                                    break;

                                case 22:
                                    _context18.prev = 22;
                                    _context18.t0 = _context18['catch'](4);
                                    _didIteratorError33 = true;
                                    _iteratorError33 = _context18.t0;

                                case 26:
                                    _context18.prev = 26;
                                    _context18.prev = 27;

                                    if (!_iteratorNormalCompletion33 && _iterator33.return) {
                                        _iterator33.return();
                                    }

                                case 29:
                                    _context18.prev = 29;

                                    if (!_didIteratorError33) {
                                        _context18.next = 32;
                                        break;
                                    }

                                    throw _iteratorError33;

                                case 32:
                                    return _context18.finish(29);

                                case 33:
                                    return _context18.finish(26);

                                case 34:
                                case 'end':
                                    return _context18.stop();
                            }
                        }
                    }, _marked16, this, [[4, 22, 26, 34], [27,, 29, 33]]);
                }

                return new Linq(skipWhileGenerator);
            }

            /**
             * Returns either the sum of the elements of 'this' collection (if `selector` is not given) or the
             * sum of the projected value of each element of 'this' collection (if `selector` is given).
             * 
             * @param {numericProjection} [selector] - The function that projects the values to be summed
             * @returns {number}
             */

        }, {
            key: 'sum',
            value: function sum(selector) {
                LinqInternal.validateOptionalFunction(selector, 'Invalid selector.');

                var normalizingSelector = function normalizingSelector(x) {
                    var value = selector == null ? x : selector(x);

                    if (value == null) value = 0;else if (isNaN(value)) throw new Error('Encountered an element that is not a number.');

                    return value;
                };

                return this.aggregate(0, function (acc, x) {
                    return acc + normalizingSelector(x);
                });
            }

            /**
             * Returns the elements of 'this' collection taking only the first `count` number of elements.
             * 
             * @param {number} count - The number of elements to take from the beginning of the collection
             * @returns {Linq} 
             */

        }, {
            key: 'take',
            value: function take(count) {
                var _marked17 = /*#__PURE__*/regeneratorRuntime.mark(takeGenerator);

                if (!LinqInternal.isValidNumber(count)) throw new Error('Invalid count.');

                var iterable = this.toIterable();

                function takeGenerator() {
                    var counter, _iteratorNormalCompletion34, _didIteratorError34, _iteratorError34, _iterator34, _step34, _item9;

                    return regeneratorRuntime.wrap(function takeGenerator$(_context19) {
                        while (1) {
                            switch (_context19.prev = _context19.next) {
                                case 0:
                                    counter = 0;
                                    _iteratorNormalCompletion34 = true;
                                    _didIteratorError34 = false;
                                    _iteratorError34 = undefined;
                                    _context19.prev = 4;
                                    _iterator34 = iterable[Symbol.iterator]();

                                case 6:
                                    if (_iteratorNormalCompletion34 = (_step34 = _iterator34.next()).done) {
                                        _context19.next = 16;
                                        break;
                                    }

                                    _item9 = _step34.value;

                                    if (!(counter >= count)) {
                                        _context19.next = 10;
                                        break;
                                    }

                                    return _context19.abrupt('return');

                                case 10:
                                    _context19.next = 12;
                                    return _item9;

                                case 12:
                                    counter += 1;

                                case 13:
                                    _iteratorNormalCompletion34 = true;
                                    _context19.next = 6;
                                    break;

                                case 16:
                                    _context19.next = 22;
                                    break;

                                case 18:
                                    _context19.prev = 18;
                                    _context19.t0 = _context19['catch'](4);
                                    _didIteratorError34 = true;
                                    _iteratorError34 = _context19.t0;

                                case 22:
                                    _context19.prev = 22;
                                    _context19.prev = 23;

                                    if (!_iteratorNormalCompletion34 && _iterator34.return) {
                                        _iterator34.return();
                                    }

                                case 25:
                                    _context19.prev = 25;

                                    if (!_didIteratorError34) {
                                        _context19.next = 28;
                                        break;
                                    }

                                    throw _iteratorError34;

                                case 28:
                                    return _context19.finish(25);

                                case 29:
                                    return _context19.finish(22);

                                case 30:
                                case 'end':
                                    return _context19.stop();
                            }
                        }
                    }, _marked17, this, [[4, 18, 22, 30], [23,, 25, 29]]);
                }

                return new Linq(takeGenerator);
            }

            /**
             * Returns every n-th (n = step) element of 'this' collection.
             * 
             * @param {number} step - The number of elements to bypass before returning the next element
             * @returns {Linq}
             */

        }, {
            key: 'takeEvery',
            value: function takeEvery(step) {
                if (!LinqInternal.isValidNumber(step, function (x) {
                    return x > 0;
                })) throw new Error('Invalid step.');

                return this.where(function (x, i) {
                    return i % step === 0;
                });
            }

            /**
             * Returns the elements of 'this' collection, taking only the last 'count' number of elements.
             * 
             * @param {number} count - The number of elements to take from the end of the collection
             * @returns {Linq}
             */

        }, {
            key: 'takeLast',
            value: function takeLast(count) {
                if (!LinqInternal.isValidNumber(count, function (x) {
                    return x >= 0;
                })) throw new Error('Invalid count');

                if (count === 0) return Linq.empty();

                var iterable = this.toIterable();

                if (LinqInternal.isCollectionHavingExplicitCardinality(iterable)) {
                    var length = LinqInternal.getExplicitCardinality(iterable);

                    if (length != null) return this.skip(length - count);
                }

                var aggregationFunc = function aggregationFunc(acc, x) {
                    if (acc.length === count) acc.shift();

                    acc.push(x);

                    return acc;
                };

                return new Linq(this.aggregate([], aggregationFunc));
            }

            /**
             * Returns the elements of 'this' collection taking element until an element satisfies the
             * `predicate` function (that first element that satisfies the `predicate` function is not
             * included in the results).
             * 
             * @param {predicate} predicate - The function that indicates when to stop including elements in the results
             * @returns {Linq}
             */

        }, {
            key: 'takeUntil',
            value: function takeUntil(predicate) {
                LinqInternal.validateRequiredFunction(predicate, 'Invalid predicate.');

                return this.takeWhile(function (x) {
                    return !predicate(x);
                });
            }

            /**
             * Returns the elements of 'this' collection taking elements until an element does not satisfy
             * the `predicate` function (that first element that fails to satisfy the `predicate` function
             * is not included in the results).
             * 
             * @param {predicate} predicate - The function that indicates which of the initial elements to include in the results
             * @returns {Linq}
             */

        }, {
            key: 'takeWhile',
            value: function takeWhile(predicate) {
                var _marked18 = /*#__PURE__*/regeneratorRuntime.mark(takeWhileGenerator);

                LinqInternal.validateRequiredFunction(predicate, 'Invalid predicate.');

                var iterable = this.toIterable();

                function takeWhileGenerator() {
                    var _iteratorNormalCompletion35, _didIteratorError35, _iteratorError35, _iterator35, _step35, _item10;

                    return regeneratorRuntime.wrap(function takeWhileGenerator$(_context20) {
                        while (1) {
                            switch (_context20.prev = _context20.next) {
                                case 0:
                                    _iteratorNormalCompletion35 = true;
                                    _didIteratorError35 = false;
                                    _iteratorError35 = undefined;
                                    _context20.prev = 3;
                                    _iterator35 = iterable[Symbol.iterator]();

                                case 5:
                                    if (_iteratorNormalCompletion35 = (_step35 = _iterator35.next()).done) {
                                        _context20.next = 14;
                                        break;
                                    }

                                    _item10 = _step35.value;

                                    if (predicate(_item10)) {
                                        _context20.next = 9;
                                        break;
                                    }

                                    return _context20.abrupt('return');

                                case 9:
                                    _context20.next = 11;
                                    return _item10;

                                case 11:
                                    _iteratorNormalCompletion35 = true;
                                    _context20.next = 5;
                                    break;

                                case 14:
                                    _context20.next = 20;
                                    break;

                                case 16:
                                    _context20.prev = 16;
                                    _context20.t0 = _context20['catch'](3);
                                    _didIteratorError35 = true;
                                    _iteratorError35 = _context20.t0;

                                case 20:
                                    _context20.prev = 20;
                                    _context20.prev = 21;

                                    if (!_iteratorNormalCompletion35 && _iterator35.return) {
                                        _iterator35.return();
                                    }

                                case 23:
                                    _context20.prev = 23;

                                    if (!_didIteratorError35) {
                                        _context20.next = 26;
                                        break;
                                    }

                                    throw _iteratorError35;

                                case 26:
                                    return _context20.finish(23);

                                case 27:
                                    return _context20.finish(20);

                                case 28:
                                case 'end':
                                    return _context20.stop();
                            }
                        }
                    }, _marked18, this, [[3, 16, 20, 28], [21,, 23, 27]]);
                }

                return new Linq(takeWhileGenerator);
            }

            /**
             * Returns the elements of 'this' collection further sorted (from an immediately preceeding orderBy 
             * call) in ascending order of the projected value given by the `keySelector` function, using the
             * `comparer` function to compare the projected values.  If the `comparer` function is not given,
             * a comparer that uses the natural ordering of the values will be used to compare the projected values.  
             * Note that this thenBy call must be immediately preceeded by either an orderBy, orderByDescending, 
             * thenBy, or thenByDescending call.
             * 
             * @param {projection} keySelector - The function that projects the value used to sort the elements
             * @param {comparer} [comparer] - The function that compares the projected values
             * @returns {Linq}
             */

        }, {
            key: 'thenBy',
            value: function thenBy(keySelector, comparer) {
                return LinqInternal.thenByBasedOperator(this, keySelector, comparer, false);
            }

            /**
             * Returns the elements of 'this' collection further sorted (from an immediately preceeding orderBy 
             * call) in descending order of the projected value given by the `keySelector` function, using the
             * `comparer` function to compare the projected values.  If the `comparer` function is not given,
             * a comparer that uses the natural ordering of the values will be used to compare the projected values.  
             * Note that this thenBy call must be immediately preceeded by either an orderBy, orderByDescending, 
             * thenBy, or thenByDescending call.
             * 
             * @param {projection} keySelector - The function that projects the value used to sort the elements
             * @param {comparer} [comparer] - The function that compares the projected values
             * @returns {Linq}
             */

        }, {
            key: 'thenByDescending',
            value: function thenByDescending(keySelector, comparer) {
                return LinqInternal.thenByBasedOperator(this, keySelector, comparer, true);
            }

            /**
             * Returns an array that represents the contents of the Linq object.
             */

        }, {
            key: 'toArray',
            value: function toArray() {
                return Array.from(this.toIterable());
            }

            /**
             * Returns a string consisting of all of the elements of 'this' collection delimited by the given
             * 'delimiter' value.  If a `delimiter` value is not given, then the delimiter "," is used.
             * 
             * @param {string} [delimiter] - The delimiter separating the elements in the results
             * @returns {string} 
             */

        }, {
            key: 'toDelimitedString',
            value: function toDelimitedString(delimiter) {
                if (LinqInternal.isEmptyIterable(this.toIterable())) return '';

                if (delimiter == null) delimiter = ',';

                return this.aggregate(null, function (acc, x) {
                    return '' + acc + delimiter + x;
                });
            }

            /**
             * Returns an object that represents a "dictionary" of the elements of 'this' collection.  The
             * `keySelector` function is used to project the "key" value for each element of 'this' collection.
             * If the `elementSelector` function is given, the "value" associated with each "key" value is the
             * value projected by the `elementSelector` function.  If the `elementSelector` function is not 
             * given, the "value" associated with each "key" value is the element, itself.
             * 
             * @param {projection} keySelector - The function that projects the key for each element
             * @param {projection} [elementSelector] - The function that projects the value for each key
             * @returns {Linq}
             */

        }, {
            key: 'toDictionary',
            value: function toDictionary(keySelector, elementSelector) {
                LinqInternal.validateRequiredFunction(keySelector, 'Invalid key selector.');
                LinqInternal.validateOptionalFunction(elementSelector, 'Invalid element selector.');

                var normalizedElementSelector = elementSelector == null ? Linq.identity : elementSelector;
                var iterable = this.toIterable();
                var results = {};

                var _iteratorNormalCompletion36 = true;
                var _didIteratorError36 = false;
                var _iteratorError36 = undefined;

                try {
                    for (var _iterator36 = iterable[Symbol.iterator](), _step36; !(_iteratorNormalCompletion36 = (_step36 = _iterator36.next()).done); _iteratorNormalCompletion36 = true) {
                        var _item11 = _step36.value;

                        var _key = keySelector(_item11);

                        if (_key in results) throw new Error('Duplicate key in collection.');

                        results[_key] = normalizedElementSelector(_item11);
                    }
                } catch (err) {
                    _didIteratorError36 = true;
                    _iteratorError36 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion36 && _iterator36.return) {
                            _iterator36.return();
                        }
                    } finally {
                        if (_didIteratorError36) {
                            throw _iteratorError36;
                        }
                    }
                }

                return results;
            }

            /**
             * Returns an iterable (as defined by the "iterable protocol"--see
             * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#iterable) that 
             * represents the contents of the Linq object.
             */

        }, {
            key: 'toIterable',
            value: function toIterable() {
                var _marked19 = /*#__PURE__*/regeneratorRuntime.mark(deferredSortGenerator);

                var helper = function helper(source) {
                    if (Linq.isLinq(source)) return helper(source.source);else if (Linq.isIterable(source)) return source;else if (Linq.isGenerator(source)) return source();else if (Linq.isFunction(source)) return helper(source());else throw new Error('Could not return an iterable because the \'source\' was not valid.');
                };

                var iterable = helper(this.source);
                var deferredSort = this[deferredSortSymbol];

                if (deferredSort == null) return iterable;

                function deferredSortGenerator() {
                    var buffer, _iteratorNormalCompletion37, _didIteratorError37, _iteratorError37, _iterator37, _step37, _item12;

                    return regeneratorRuntime.wrap(function deferredSortGenerator$(_context21) {
                        while (1) {
                            switch (_context21.prev = _context21.next) {
                                case 0:
                                    buffer = Array.from(iterable);


                                    LinqInternal.performDeferredSort(buffer, deferredSort);

                                    _iteratorNormalCompletion37 = true;
                                    _didIteratorError37 = false;
                                    _iteratorError37 = undefined;
                                    _context21.prev = 5;
                                    _iterator37 = buffer[Symbol.iterator]();

                                case 7:
                                    if (_iteratorNormalCompletion37 = (_step37 = _iterator37.next()).done) {
                                        _context21.next = 14;
                                        break;
                                    }

                                    _item12 = _step37.value;
                                    _context21.next = 11;
                                    return _item12;

                                case 11:
                                    _iteratorNormalCompletion37 = true;
                                    _context21.next = 7;
                                    break;

                                case 14:
                                    _context21.next = 20;
                                    break;

                                case 16:
                                    _context21.prev = 16;
                                    _context21.t0 = _context21['catch'](5);
                                    _didIteratorError37 = true;
                                    _iteratorError37 = _context21.t0;

                                case 20:
                                    _context21.prev = 20;
                                    _context21.prev = 21;

                                    if (!_iteratorNormalCompletion37 && _iterator37.return) {
                                        _iterator37.return();
                                    }

                                case 23:
                                    _context21.prev = 23;

                                    if (!_didIteratorError37) {
                                        _context21.next = 26;
                                        break;
                                    }

                                    throw _iteratorError37;

                                case 26:
                                    return _context21.finish(23);

                                case 27:
                                    return _context21.finish(20);

                                case 28:
                                case 'end':
                                    return _context21.stop();
                            }
                        }
                    }, _marked19, this, [[5, 16, 20, 28], [21,, 23, 27]]);
                }

                return deferredSortGenerator();
            }

            /**
             * Returns a lookup-collection with the elements of 'this' collection grouped by a key
             * projected by the `keySelector` function.  If the optional `comparer` is provided, then
             * the comparer will be used to determine equality between keys.  If the `comparer` is not
             * provided, the '===' operator will be used to determine equality between keys.
             * 
             * @param {projection} keySelector - The function used to project keys from the elements of 'this' collection 
             * @param {comparer|equalityComparer} [keyComparer] - The function used to compare keys 
             * @returns {Linq}
             */

        }, {
            key: 'toLookup',
            value: function toLookup(keySelector, keyComparer) {
                LinqInternal.validateRequiredFunction(keySelector, 'Invalid key selector.');
                LinqInternal.validateOptionalFunction(keyComparer, 'Invalid key comparer.');

                var normalizedComparer = LinqInternal.normalizeComparerOrDefault(keyComparer);

                var iterable = this.toIterable();
                var resultsArray = [];
                var results = new Linq(resultsArray);

                var _iteratorNormalCompletion38 = true;
                var _didIteratorError38 = false;
                var _iteratorError38 = undefined;

                try {
                    var _loop4 = function _loop4() {
                        var item = _step38.value;

                        var key = keySelector(item);
                        var lookupNode = results.firstOrDefault(function (x) {
                            return normalizedComparer(x.key, key);
                        });

                        if (lookupNode == null) {
                            lookupNode = { key: key, values: [] };
                            resultsArray.push(lookupNode);
                        }

                        lookupNode.values.push(item);
                    };

                    for (var _iterator38 = iterable[Symbol.iterator](), _step38; !(_iteratorNormalCompletion38 = (_step38 = _iterator38.next()).done); _iteratorNormalCompletion38 = true) {
                        _loop4();
                    }
                } catch (err) {
                    _didIteratorError38 = true;
                    _iteratorError38 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion38 && _iterator38.return) {
                            _iterator38.return();
                        }
                    } finally {
                        if (_didIteratorError38) {
                            throw _iteratorError38;
                        }
                    }
                }

                return results;
            }

            /**
             * Returns the union of elements in 'this' collection and the `second` collection, using the
             * `comparer` function to determine whether two different elements are equal.  If the `comparer`
             * function is not given, then the "===" operator will be used to compare elements.
             * 
             * @param {LinqCompatible} second - The collection of elements to union
             * @param {comparer|equalityComparer} [comparer] - The function used to compare elements
             * @returns {Linq} 
             */

        }, {
            key: 'union',
            value: function union(second, comparer) {
                var _marked20 = /*#__PURE__*/regeneratorRuntime.mark(unionGenerator);

                LinqInternal.validateOptionalFunction(comparer, 'Invalid comparer.');

                var normalizedComparer = comparer == null ? null : Linq.normalizeComparer(comparer);
                var secondLinq = LinqInternal.ensureLinq(second);

                var firstIterable = this.toIterable();
                var secondIterable = secondLinq.toIterable();

                var disqualifiedSet = new SimpleSet(normalizedComparer);

                function unionGenerator() {
                    var _iteratorNormalCompletion39, _didIteratorError39, _iteratorError39, _iterator39, _step39, _item13, isDisqualified, _iteratorNormalCompletion40, _didIteratorError40, _iteratorError40, _iterator40, _step40, _item14, _isDisqualified;

                    return regeneratorRuntime.wrap(function unionGenerator$(_context22) {
                        while (1) {
                            switch (_context22.prev = _context22.next) {
                                case 0:
                                    _iteratorNormalCompletion39 = true;
                                    _didIteratorError39 = false;
                                    _iteratorError39 = undefined;
                                    _context22.prev = 3;
                                    _iterator39 = firstIterable[Symbol.iterator]();

                                case 5:
                                    if (_iteratorNormalCompletion39 = (_step39 = _iterator39.next()).done) {
                                        _context22.next = 15;
                                        break;
                                    }

                                    _item13 = _step39.value;
                                    isDisqualified = disqualifiedSet.has(_item13);

                                    if (isDisqualified) {
                                        _context22.next = 12;
                                        break;
                                    }

                                    disqualifiedSet.add(_item13);
                                    _context22.next = 12;
                                    return _item13;

                                case 12:
                                    _iteratorNormalCompletion39 = true;
                                    _context22.next = 5;
                                    break;

                                case 15:
                                    _context22.next = 21;
                                    break;

                                case 17:
                                    _context22.prev = 17;
                                    _context22.t0 = _context22['catch'](3);
                                    _didIteratorError39 = true;
                                    _iteratorError39 = _context22.t0;

                                case 21:
                                    _context22.prev = 21;
                                    _context22.prev = 22;

                                    if (!_iteratorNormalCompletion39 && _iterator39.return) {
                                        _iterator39.return();
                                    }

                                case 24:
                                    _context22.prev = 24;

                                    if (!_didIteratorError39) {
                                        _context22.next = 27;
                                        break;
                                    }

                                    throw _iteratorError39;

                                case 27:
                                    return _context22.finish(24);

                                case 28:
                                    return _context22.finish(21);

                                case 29:
                                    _iteratorNormalCompletion40 = true;
                                    _didIteratorError40 = false;
                                    _iteratorError40 = undefined;
                                    _context22.prev = 32;
                                    _iterator40 = secondIterable[Symbol.iterator]();

                                case 34:
                                    if (_iteratorNormalCompletion40 = (_step40 = _iterator40.next()).done) {
                                        _context22.next = 44;
                                        break;
                                    }

                                    _item14 = _step40.value;
                                    _isDisqualified = disqualifiedSet.has(_item14);

                                    if (_isDisqualified) {
                                        _context22.next = 41;
                                        break;
                                    }

                                    disqualifiedSet.add(_item14);
                                    _context22.next = 41;
                                    return _item14;

                                case 41:
                                    _iteratorNormalCompletion40 = true;
                                    _context22.next = 34;
                                    break;

                                case 44:
                                    _context22.next = 50;
                                    break;

                                case 46:
                                    _context22.prev = 46;
                                    _context22.t1 = _context22['catch'](32);
                                    _didIteratorError40 = true;
                                    _iteratorError40 = _context22.t1;

                                case 50:
                                    _context22.prev = 50;
                                    _context22.prev = 51;

                                    if (!_iteratorNormalCompletion40 && _iterator40.return) {
                                        _iterator40.return();
                                    }

                                case 53:
                                    _context22.prev = 53;

                                    if (!_didIteratorError40) {
                                        _context22.next = 56;
                                        break;
                                    }

                                    throw _iteratorError40;

                                case 56:
                                    return _context22.finish(53);

                                case 57:
                                    return _context22.finish(50);

                                case 58:
                                case 'end':
                                    return _context22.stop();
                            }
                        }
                    }, _marked20, this, [[3, 17, 21, 29], [22,, 24, 28], [32, 46, 50, 58], [51,, 53, 57]]);
                }

                return new Linq(unionGenerator);
            }

            /**
             * Returns the elements of 'this' collection that satisfy the `predicate` function.
             * 
             * @param {indexedProjection} predicate - The function that determines which elements to return
             * @returns {Linq}
             */

        }, {
            key: 'where',
            value: function where(predicate) {
                var _marked21 = /*#__PURE__*/regeneratorRuntime.mark(whereGenerator);

                LinqInternal.validateRequiredFunction(predicate, 'Invalid predicate.');

                var iterable = this.toIterable();

                function whereGenerator() {
                    var i, _iteratorNormalCompletion41, _didIteratorError41, _iteratorError41, _iterator41, _step41, _item15;

                    return regeneratorRuntime.wrap(function whereGenerator$(_context23) {
                        while (1) {
                            switch (_context23.prev = _context23.next) {
                                case 0:
                                    i = 0;
                                    _iteratorNormalCompletion41 = true;
                                    _didIteratorError41 = false;
                                    _iteratorError41 = undefined;
                                    _context23.prev = 4;
                                    _iterator41 = iterable[Symbol.iterator]();

                                case 6:
                                    if (_iteratorNormalCompletion41 = (_step41 = _iterator41.next()).done) {
                                        _context23.next = 15;
                                        break;
                                    }

                                    _item15 = _step41.value;

                                    if (!predicate(_item15, i)) {
                                        _context23.next = 11;
                                        break;
                                    }

                                    _context23.next = 11;
                                    return _item15;

                                case 11:

                                    i += 1;

                                case 12:
                                    _iteratorNormalCompletion41 = true;
                                    _context23.next = 6;
                                    break;

                                case 15:
                                    _context23.next = 21;
                                    break;

                                case 17:
                                    _context23.prev = 17;
                                    _context23.t0 = _context23['catch'](4);
                                    _didIteratorError41 = true;
                                    _iteratorError41 = _context23.t0;

                                case 21:
                                    _context23.prev = 21;
                                    _context23.prev = 22;

                                    if (!_iteratorNormalCompletion41 && _iterator41.return) {
                                        _iterator41.return();
                                    }

                                case 24:
                                    _context23.prev = 24;

                                    if (!_didIteratorError41) {
                                        _context23.next = 27;
                                        break;
                                    }

                                    throw _iteratorError41;

                                case 27:
                                    return _context23.finish(24);

                                case 28:
                                    return _context23.finish(21);

                                case 29:
                                case 'end':
                                    return _context23.stop();
                            }
                        }
                    }, _marked21, this, [[4, 17, 21, 29], [22,, 24, 28]]);
                }

                return new Linq(whereGenerator);
            }

            /**
             * Returns 'this' collection "zipped-up" with the `second` collection such that each value of the
             * returned collection is the value projected from the corresponding element from each of 'this'
             * collection and the `second` collection.  If the size of 'this' collection and the `second` 
             * collection are not equal, the size of the returned collection will equal the minimum of the
             * sizes of 'this' collection and the `second` collection.
             * 
             * @param {LinqCompatible} second - The collection to zip with 'this' collection
             * @param {biSourceProjection} [resultSelector] - The function to use to project the result values
             * @returns {Linq}
             */

        }, {
            key: 'zip',
            value: function zip(second, resultSelector) {
                var _marked22 = /*#__PURE__*/regeneratorRuntime.mark(zipGenerator);

                LinqInternal.validateOptionalFunction(resultSelector, 'Invalid result selector.');

                if (resultSelector == null) resultSelector = Linq.tuple;

                var secondLinq = LinqInternal.ensureLinq(second);
                var firstIterator = LinqInternal.getIterator(this.toIterable());
                var secondIterator = LinqInternal.getIterator(secondLinq.toIterable());

                function zipGenerator() {
                    var firstState, secondState;
                    return regeneratorRuntime.wrap(function zipGenerator$(_context24) {
                        while (1) {
                            switch (_context24.prev = _context24.next) {
                                case 0:
                                    firstState = firstIterator.next();
                                    secondState = secondIterator.next();

                                case 2:
                                    if (!(!firstState.done && !secondState.done)) {
                                        _context24.next = 9;
                                        break;
                                    }

                                    _context24.next = 5;
                                    return resultSelector(firstState.value, secondState.value);

                                case 5:

                                    firstState = firstIterator.next();
                                    secondState = secondIterator.next();
                                    _context24.next = 2;
                                    break;

                                case 9:
                                case 'end':
                                    return _context24.stop();
                            }
                        }
                    }, _marked22, this);
                }

                return new Linq(zipGenerator);
            }

            /**
             * Returns 'this' collection "zipped-up" with the `second` collection such that each value of the
             * returned collection is the value projected from the corresponding element from each of 'this'
             * collection and the `second` collection.  If the size of 'this' collection and the `second` 
             * collection are not equal, the size of the returned collection will equal the maximum of the
             * sizes of 'this' collection and the `second` collection, and the shorter collection with use
             * values given by the `defaultForFirst` and `defaultForSecond` parameters (corresponding with
             * which corresponding list is shorter).
             * 
             * @param {LinqCompatible} second - The collection to zip with 'this' collection
             * @param {*} defaultForFirst - The value used for 'this' collection when shorter
             * @param {*} defaultForSecond - The value used for the 'second' collecction when shorter
             * @param {biSourceProjection} [resultSelector] - The function to use to project the result values
             * @returns {Linq}
             */

        }, {
            key: 'zipLongest',
            value: function zipLongest(second, defaultForFirst, defaultForSecond, resultSelector) {
                var _marked23 = /*#__PURE__*/regeneratorRuntime.mark(zipGenerator);

                LinqInternal.validateOptionalFunction(resultSelector, 'Invalid result selector.');

                if (resultSelector == null) resultSelector = Linq.tuple;

                var secondLinq = LinqInternal.ensureLinq(second);
                var firstIterator = LinqInternal.getIterator(this.toIterable());
                var secondIterator = LinqInternal.getIterator(secondLinq.toIterable());

                function zipGenerator() {
                    var firstState, secondState, firstValue, secondValue;
                    return regeneratorRuntime.wrap(function zipGenerator$(_context25) {
                        while (1) {
                            switch (_context25.prev = _context25.next) {
                                case 0:
                                    firstState = firstIterator.next();
                                    secondState = secondIterator.next();

                                case 2:
                                    if (!(!firstState.done || !secondState.done)) {
                                        _context25.next = 11;
                                        break;
                                    }

                                    firstValue = firstState.done ? defaultForFirst : firstState.value;
                                    secondValue = secondState.done ? defaultForSecond : secondState.value;
                                    _context25.next = 7;
                                    return resultSelector(firstValue, secondValue);

                                case 7:

                                    if (!firstState.done) firstState = firstIterator.next();

                                    if (!secondState.done) secondState = secondIterator.next();
                                    _context25.next = 2;
                                    break;

                                case 11:
                                case 'end':
                                    return _context25.stop();
                            }
                        }
                    }, _marked23, this);
                }

                return new Linq(zipGenerator);
            }
        }], [{
            key: 'isFunction',
            value: function isFunction(func) {
                return typeof func == "function";
            }
        }, {
            key: 'isArray',
            value: function isArray(obj) {
                return Array.isArray(obj);
            } // Kept for backwards-compatibility reasons

        }, {
            key: 'isString',
            value: function isString(obj) {
                return typeof obj === 'string' || obj instanceof String;
            }
        }, {
            key: 'isBoolean',
            value: function isBoolean(obj) {
                return typeof obj === 'boolean' || obj instanceof Boolean;
            }
        }, {
            key: 'isNumber',
            value: function isNumber(obj) {
                return typeof obj === 'number' || obj instanceof Number;
            }
        }, {
            key: 'isSymbol',
            value: function isSymbol(obj) {
                return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'symbol';
            }
        }, {
            key: 'isIterable',
            value: function isIterable(obj) {
                return obj != null && typeof obj[Symbol.iterator] === 'function';
            }
        }, {
            key: 'isGenerator',
            value: function isGenerator(obj) {
                return obj instanceof GeneratorFunction;
            }
        }, {
            key: 'isLinq',
            value: function isLinq(obj) {
                return obj instanceof Linq;
            }
        }, {
            key: 'isPrimitive',
            value: function isPrimitive(obj) {
                return Linq.isString(obj) || Linq.isNumber(obj) || Linq.isBoolean(obj) || Linq.isSymbol(obj) || obj === null || obj === undefined;
            }
        }, {
            key: 'identity',
            value: function identity(x) {
                return x;
            }
        }, {
            key: 'tuple',
            value: function tuple(x, y) {
                return [x, y];
            }

            // Comparer functions

        }, {
            key: 'strictComparer',
            value: function strictComparer(x, y) {
                return x === y;
            }
        }, {
            key: 'defaultStringComparer',
            value: function defaultStringComparer(x, y) {
                return Linq.caseSensitiveStringComparer(x, y);
            }
        }, {
            key: 'caseSensitiveStringComparer',
            value: function caseSensitiveStringComparer(x, y) {
                var normalize = function normalize(value) {
                    return value == null ? null : LinqInternal.convertToString(value);
                };

                return Linq.generalComparer(normalize(x), normalize(y));
            }
        }, {
            key: 'caseInsensitiveStringComparer',
            value: function caseInsensitiveStringComparer(x, y) {
                var normalize = function normalize(value) {
                    return Linq.isString(value) ? value.toLowerCase() : value;
                };

                return Linq.caseSensitiveStringComparer(normalize(x), normalize(y));
            }
        }, {
            key: 'defaultStringEqualityComparer',
            value: function defaultStringEqualityComparer(x, y) {
                return Linq.caseSensitiveStringEqualityComparer(x, y);
            }
        }, {
            key: 'caseSensitiveStringEqualityComparer',
            value: function caseSensitiveStringEqualityComparer(x, y) {
                return Linq.caseSensitiveStringComparer(x, y) === 0;
            }
        }, {
            key: 'caseInsensitiveStringEqualityComparer',
            value: function caseInsensitiveStringEqualityComparer(x, y) {
                return Linq.caseInsensitiveStringComparer(x, y) === 0;
            }
        }, {
            key: 'generalComparer',
            value: function generalComparer(x, y) {
                if (x == null && y == null) return 0;

                if (x == null) return -1;

                if (y == null) return 1;

                return x < y ? -1 : x > y ? 1 : 0;
            }

            /**
             * This function converts a "comparer" into an "equality comparer".  If the function is already an equality
             * comparer, then the resultant function will remain an equality comparer.
             * 
             * @param {comparer} comparer - The function to convert into an equality comparer
             * @returns {equalityComparer}
             */

        }, {
            key: 'normalizeComparer',
            value: function normalizeComparer(comparer) {
                return function (x, y) {
                    var value = comparer(x, y);

                    if (Linq.isBoolean(value)) return value;else return value == 0;
                };
            }

            /**
             * This function creates a new comparer based upon the `projection` of values passed to the new comparer.  This
             * function can also be passed a `comparer` that is used in the new comparer to compare the projected values.
             * 
             * @param {projection} projection - The projection from which compare projected values
             * @param {comparer} [comparer] - A comparer with which to compare projected values
             * @returns {comparer}
             */

        }, {
            key: 'createProjectionComparer',
            value: function createProjectionComparer(projection) {
                var comparer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

                if (projection == null) throw new Error('Invalid projection.');

                if (comparer == null) comparer = function comparer(x, y) {
                    return Linq.generalComparer(x, y);
                };

                return function (x, y) {
                    var results = comparer(projection(x), projection(y));

                    if (Linq.isBoolean(results)) throw new Error('The given \'comparer\' was an equality comparer instead of a comparer.');

                    return results;
                };
            }

            /**
             * This function create a new equality comparer based upon the `projection` of the values passed to the new equality
             * comparer.  This function can also be passed a `comparer` that is used in the new equality comparer to compare the
             * projected values.
             * 
             * @param {projection} projection - The projection from which to compare projected values
             * @param {comparer|equalityComparer} [comparer] - The comparer with which to compare projected values
             * @returns {equalityComparer}
             */

        }, {
            key: 'createProjectionEqualityComparer',
            value: function createProjectionEqualityComparer(projection) {
                var comparer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

                if (projection == null) throw new Error('Invalid projection.');

                var normalizedComparer = LinqInternal.normalizeComparerOrDefault(comparer);

                return function (x, y) {
                    return normalizedComparer(projection(x), projection(y));
                };
            }

            // Constructor functions

            /**
             * Creates a new Linq object, acting very similarly as the Linq constructor, but also accepts:
             * 
             * (1) jQuery objects, and 
             * (2) objects that would cause the constructor to throw an exception (resulting in a Linq object 
             *     that represents a single-item list containing the object).
             * 
             * @param {*} source - A source of items
             * @returns {Linq} 
             */

        }, {
            key: 'from',
            value: function from(source) {
                if (source == null || LinqInternal.isConstructorCompatibleSource(source)) return new Linq(source);else if (typeof jQuery !== 'undefined' && source instanceof jQuery) return new Linq(source.get());else return new Linq([source]);
            }

            /**
             * Create a new Linq object that contains a range of integers.
             * 
             * @param {num} from - The starting value of the range
             * @param {num} to - The ending value of the range
             * @param {num} [step=1] - The amount by which to increment each iteration
             * @returns {Linq} 
             */

        }, {
            key: 'range',
            value: function range(from, to, step) {
                var _marked24 = /*#__PURE__*/regeneratorRuntime.mark(rangeGenerator);

                if (!LinqInternal.isValidNumber(from)) throw new Error("Invalid 'from' value.");

                if (!LinqInternal.isValidNumber(to)) throw new Error("Invalid 'to' value.");

                if (!LinqInternal.isValidNumber(step)) step = 1;

                if (step == 0) throw new Error("Invalid 'step' value--cannot be zero.");

                var compare = void 0;

                if (step > 0) compare = function compare(x, y) {
                    return x <= y;
                };else compare = function compare(x, y) {
                    return x >= y;
                };

                function rangeGenerator() {
                    var i;
                    return regeneratorRuntime.wrap(function rangeGenerator$(_context26) {
                        while (1) {
                            switch (_context26.prev = _context26.next) {
                                case 0:
                                    i = from;

                                case 1:
                                    if (!compare(i, to)) {
                                        _context26.next = 7;
                                        break;
                                    }

                                    _context26.next = 4;
                                    return i;

                                case 4:
                                    i += step;
                                    _context26.next = 1;
                                    break;

                                case 7:
                                case 'end':
                                    return _context26.stop();
                            }
                        }
                    }, _marked24, this);
                }

                return new Linq(rangeGenerator);
            }

            /**
             * Create a new Linq object that contains a given number of repetitions of an object.
             * 
             * @param {*} item - The item to repeat
             * @param {num} [repetitions=1] - The number of times to repeat the object
             * @returns {Linq}
             */

        }, {
            key: 'repeat',
            value: function repeat(item, repetitions) {
                var _marked25 = /*#__PURE__*/regeneratorRuntime.mark(repeatGenerator);

                if (!LinqInternal.isValidNumber(repetitions)) repetitions = 1;

                function repeatGenerator() {
                    var i;
                    return regeneratorRuntime.wrap(function repeatGenerator$(_context27) {
                        while (1) {
                            switch (_context27.prev = _context27.next) {
                                case 0:
                                    i = 0;

                                case 1:
                                    if (!(i < repetitions)) {
                                        _context27.next = 7;
                                        break;
                                    }

                                    _context27.next = 4;
                                    return item;

                                case 4:
                                    i++;
                                    _context27.next = 1;
                                    break;

                                case 7:
                                case 'end':
                                    return _context27.stop();
                            }
                        }
                    }, _marked25, this);
                }

                return new Linq(repeatGenerator);
            }

            /**
             * Create a new linq object that contains all of the matches for a regex pattern.  Note that 'g' does not need to be added 
             * to the `flags` parameter (it will be automatically added).
             * 
             * @param {string} text 
             * @param {string|RegExp} pattern 
             * @param {string} [flags] 
             * @returns {Linq}
             */

        }, {
            key: 'matches',
            value: function matches(text, pattern, flags) {
                if (pattern == null) throw new Error('Invalid \'pattern\' value.');

                if (text == null) return new Linq();

                if (!Linq.isString(text)) throw new Error('Parameter \'text\' is not a string.');

                if (flags == null) flags = '';

                if (!flags.includes('g')) flags += 'g';

                var internalPattern = void 0;

                if (pattern instanceof RegExp) {
                    if (!flags.includes('i') && pattern.ignoreCase) flags += 'i';

                    if (!flags.includes('m') && pattern.multiline) flags += 'm';

                    internalPattern = pattern.source;
                } else internalPattern = pattern;

                var regex = new RegExp(internalPattern, flags);
                var matches = text.match(regex);

                return new Linq(matches == null ? [] : matches);
            }

            /**
             * Create a new linq object that contains an element for each property of the 'object' passed
             * to the method.  Each element will have a property named by the `keyPropertyName` parameter
             * whose value will equal the name of the property and a property named by the `valuePropertyName`
             * parameter whose value will equal the value of the property.  If the `keyPropertyName`
             * parameter is not given, then it will default to "key"; if the `valuePropertyName` parameter 
             * is not given, then it will default to "value".
             * 
             * @param {*} obj - The object from which to enumerate properties
             * @param {string} [keyPropertyName=key] - The name of the property in the resultant elements containing
             *      the property's key
             * @param {string} [valuePropertyName=value] - The name of the property in the resultant elements containing
             *      the property's value
             * @returns {Linq}
             */

        }, {
            key: 'properties',
            value: function properties(obj, keyPropertyName, valuePropertyName) {
                if (obj == null) return new Linq();

                if (LinqInternal.isStringNullOrEmpty(keyPropertyName)) keyPropertyName = 'key';

                if (LinqInternal.isStringNullOrEmpty(valuePropertyName)) valuePropertyName = 'value';

                var projection = function projection(key) {
                    var result = {};

                    result[keyPropertyName] = key;
                    result[valuePropertyName] = obj[key];

                    return result;
                };

                return new Linq(Object.keys(obj).map(projection));
            }

            /**
             * Returns a new empty Linq object.
             * 
             * @returns {Linq}
             */

        }, {
            key: 'empty',
            value: function empty() {
                return new Linq([]);
            }
        }]);

        return Linq;
    }();
});
