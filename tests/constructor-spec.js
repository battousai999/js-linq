import {Linq} from '../jslinq';
import {Utils} from './utils';

describe('constructor', () =>
{
    it('when called with array then has elements in array', () => 
    {
        let arr = [1, 2, 3, 4, 5];
        let linq = new Linq(arr);

        expect(Utils.isEqualIgnoringOrder(arr, linq.array)).toBeTruthy();
    });

    it('when called with array-copying then arrays are distinct', () => 
    {
        let arr = [1, 2, 3, 4];
        let linq = new Linq(arr, true);

        arr.push(99);

        expect(Utils.isEqualIgnoringOrder(arr, [1, 2, 3, 4, 99])).toBeTruthy();
        expect(Utils.isEqualIgnoringOrder(linq.array, [1, 2, 3, 4])).toBeTruthy();
    });

    it('when called with no array-copying then arrays are not distinct', () => 
    {
        let arr = [1, 2, 3, 4];
        let linq = new Linq(arr, false);

        arr.push(99);

        expect(Utils.isEqualIgnoringOrder(arr, [1, 2, 3, 4, 99])).toBeTruthy();
        expect(Utils.isEqualIgnoringOrder(arr, linq.array)).toBeTruthy();
    });

    it('when called with null then returns empty linq object', () => 
    {
        let linq = new Linq(null);

        expect(Utils.isEqualIgnoringOrder(linq.array, [])).toBeTruthy();
    });
});