import {Linq, SimpleSet} from '../jslinq';

// The SimpleSet class needs to be exported in order for these tests to be run.
xdescribe('SimpleSet', () =>
{
    let comparer = Linq.normalizeComparer(Linq.caseInsensitiveStringComparer);

    describe('initialize', () =>
    {
        it('when called with a non-empty iterable then has all elements of the iterable', () =>
        {
            let arr = [1, 2, 3, 4, 5, 6];
            let set = SimpleSet.initialize(arr);

            for (let item of arr)
            {
                expect(set.has(item)).toBeTruthy();
            }
        });

        it('when called with an equality comparer then has elements from perspective of comparer', () =>
        {
            let arr = ['a', 'B', 'C', 'd', 'e'];
            let set = SimpleSet.initialize(arr, comparer);

            let upperArr = arr.map(x => x.toUpperCase());

            for (let item of upperArr)
            {
                expect(set.has(item)).toBeTruthy();
            }
        });
    });

    describe('add', () =>
    {
        let arr1 = [2, 4, 6, 8, 10];
        let arr2 = ['a', 'B', 'C', 'd', 'e'];

        it('when only primitives added then ends with containsOnlyPrimitives equal to true', () =>
        {            
            let set1 = SimpleSet.initialize(arr1);
            let set2 = SimpleSet.initialize(arr1, comparer);

            expect(set1.containsOnlyPrimitives).toBeTruthy();
            expect(set2.containsOnlyPrimitives).toBeTruthy();
        });

        it('when not using a comparer and adding already existing element then contains the same elements', () => 
        {
            let set = SimpleSet.initialize(arr1);
            let expected = Array.from(set.set);

            set.add(4);

            let results = Array.from(set.set);

            expect(results).toEqual(expected);
        });

        it('when not using a comparer and adding non-existing element then element is added', () => 
        {
            let set = SimpleSet.initialize(arr1);

            set.add(1);

            let results = set.set.has(1);

            expect(results).toBeTruthy();
        });

        it('when using a comparer and adding already existing element then does not contain the duplicated element', () =>
        {
            let set = SimpleSet.initialize(arr2, comparer);

            set.add('D');

            let results = set.set.has('D');

            expect(results).toBeFalsy();
        });

        it('when using a comparer and addong non-existing element then element is added', () =>
        {
            let set = SimpleSet.initialize(arr2, comparer);

            set.add('f');

            let results = set.set.has('f');

            expect(results).toBeTruthy();
        });
    });

    describe('remove', () =>
    {
        let arr1 = [2, 4, 6, 8, 10];
        let arr2 = ['a', 'B', 'C', 'd', 'e'];
        let obj = { value: 'a' };

        it('when not using a comparer, only containing primitives, and removing an existing element then returns true and element no longer in set', () =>
        {
            let set = SimpleSet.initialize(arr1);

            let results1 = set.remove(6);
            let results2 = set.set.has(6);

            expect(results1).toBeTruthy();
            expect(results2).toBeFalsy();
        });

        it('when not using a comparer, only containing primitives, and removing a non-existing element then returns false and element not in set', () => 
        {
            let set = SimpleSet.initialize(arr1);

            let results1 = set.remove('99');
            let results2 = set.set.has('99');

            expect(results1).toBeFalsy();
            expect(results2).toBeFalsy();
        });

        it('when not using a comparer and removing an existing element then returns true and element no longer in set', () =>
        {
            let arr = arr1.concat(obj);
            let set = SimpleSet.initialize(arr);

            let results1 = set.remove(obj);
            let results2 = set.set.has(obj);

            expect(results1).toBeTruthy();
            expect(results2).toBeFalsy();
        });

        it('when not using a comparer and removing a non-existing element then returns false and element not in set', () =>
        {
            let set = SimpleSet.initialize(arr1);

            let results1 = set.remove(obj);
            let results2 = set.set.has(obj);

            expect(results1).toBeFalsy();
            expect(results2).toBeFalsy();
        });

        it('when using a comparer and removing an existing element then returns true and element no longer in set', () =>
        {
            let set = SimpleSet.initialize(arr2, comparer);

            let results1 = set.remove('a');
            let results2 = set.set.has('a');

            expect(results1).toBeTruthy();
            expect(results2).toBeFalsy();
        });

        it('when using a comparer and removing a non-existing element (but existing according to comparer) then returns true and comparer-related-existing element no longer in set', () =>
        {
            let set = SimpleSet.initialize(arr2, comparer);

            let results1 = set.remove('E');
            let results2 = set.set.has('e');

            expect(results1).toBeTruthy();
            expect(results2).toBeFalsy();
        });

        it('when using a comparer and removing a non-existing element (according to comparer, too) then returns false and element not in set', () =>
        {
            let set = SimpleSet.initialize(arr2, comparer);

            let results1 = set.remove('G');
            let results2 = set.set.has('G');

            expect(results1).toBeFalsy();
            expect(results2).toBeFalsy();
        });
    });

    describe('has', () => 
    {
        let arr1 = [1, 2, 3, 4, 5];
        let arr2 = ['A', 'B', 'c', 'D', 'e', 'f'];
        let obj = { value: 99 };

        it('when not using a comparer, only containing primitives, and checking for an existing element then returns true', () => 
        {
            let set = SimpleSet.initialize(arr1);

            expect(set.has(3)).toBeTruthy();
        });

        it('when not using a comparer, only containing primitives, and checking for a non-existing element then returns false', () => 
        {
            let set = SimpleSet.initialize(arr1);

            expect(set.has(99)).toBeFalsy();
        });

        it('when not using a comparer and checking for an existing element then returns true', () =>
        {
            let arr = arr1.concat(obj);
            let set = SimpleSet.initialize(arr);

            expect(set.has(obj)).toBeTruthy();
        });

        it('when not using a comparer and checking for a non-existing element then returns false', () =>
        {
            let arr = arr1.concat({ value: 'b' });
            let set = SimpleSet.initialize(arr);

            expect(set.has(obj)).toBeFalsy();
        });

        it('when using a comparer and checking for an existing element then returns true', () =>
        {
            let set = SimpleSet.initialize(arr2, comparer);

            expect(set.has('c')).toBeTruthy();
        });

        it('when using a comparer and checking for a non-existing element (but existing according to comparer) then returns true', () =>
        {
            let set = SimpleSet.initialize(arr2, comparer);

            expect(set.has('C')).toBeTruthy();
        });

        it('when using a comaprer and checking for a non-existing element (according to comparer, too) then returns false', () =>
        {
            let set = SimpleSet.initialize(arr2, comparer);

            expect(set.has('z')).toBeFalsy();
        });
    });
});
