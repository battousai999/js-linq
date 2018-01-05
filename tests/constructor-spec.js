import {Linq} from '../jslinq';
import {Utils} from './utils';

describe('constructor', () =>
{
    it('when called with array then has elements in array', () => 
    {
        var arr = [1, 2, 3, 4, 5];
        var linq = new Linq(arr);

        expect(Utils.isEqualIgnoringOrder(arr, linq.array)).toBeTruthy();
    });

    it('when called with array-copying then arrays are distinct', () => 
    {
        var arr = [1, 2, 3, 4];
        var linq = new Linq(arr, true);

        arr.push(99);

        expect(Utils.isEqualIgnoringOrder(arr, [1, 2, 3, 4, 99])).toBeTruthy();
        expect(Utils.isEqualIgnoringOrder(linq.array, [1, 2, 3, 4])).toBeTruthy();
    });

    it('when called with no array-copying then arrays are not distinct', () => 
    {
        var arr = [1, 2, 3, 4];
        var linq = new Linq(arr, false);

        arr.push(99);

        expect(Utils.isEqualIgnoringOrder(arr, [1, 2, 3, 4, 99])).toBeTruthy();
        expect(Utils.isEqualIgnoringOrder(arr, linq.array)).toBeTruthy();
    });
});