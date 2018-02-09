import {Linq} from '../jslinq';

describe('repeat', () => 
{
    it('when called then returns a Linq object', () => 
    {
        let linq = Linq.repeat('testing', 10);

        expect(linq).not.toBeNull();
        expect(linq instanceof Linq).toBeTruthy();
    });

    it('when called with a \'repetitions\' value greater than or equal to zero then has a length equal to the \'repetitions\' value', () => 
    {
        let linq1 = Linq.repeat('something', 99);
        let linq2 = Linq.repeat('category', 1);
        let linq3 = Linq.repeat('notes', 0);

        expect(linq1.toArray().length).toEqual(99);
        expect(linq2.toArray().length).toEqual(1);
        expect(linq3.toArray().length).toEqual(0);
    });

    it('when called with a \'repetitions\' value less than zero then has a length of zero', () => 
    {
        let linq1 = Linq.repeat('tool', -1);
        let linq2 = Linq.repeat('lateralus', -100);

        expect(linq1.toArray().length).toEqual(0);
        expect(linq2.toArray().length).toEqual(0);
    });

    it('when called with no \'repetitions\' value then has a length of one ', () => 
    {
        let linq = Linq.repeat('gravity');

        expect(linq.toArray().length).toEqual(1);
    });

    it('when called with a \'repetitions\' value then all elements are equal to the \'item\'', () => 
    {
        let linq1 = Linq.repeat('parabola', 1);
        let linq2 = Linq.repeat('H', 25);

        let test = (arr, value) => arr.every(x => x === value);

        expect(test(linq1.toArray(), 'parabola')).toBeTruthy();
        expect(test(linq2.toArray(), 'H')).toBeTruthy();
    });

    it('when called with no \'repetitions\' value then the element is equal to \'item\'', () => 
    {
        let linq = Linq.repeat('vicarious');

        let test = (arr, value) => arr.every(x => x === value);

        expect(test(linq.toArray(), 'vicarious')).toBeTruthy();
    });
});