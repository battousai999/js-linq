import {Linq} from '../jslinq';

describe('toIterable', () => 
{
    it('when called on a Linq object created from an iterable then returns an iterable', () => 
    {
        let linq = new Linq([1, 2, 3]);

        expect(Linq.isIterable(linq.toIterable())).toBeTruthy();
    });

    it('when called on a Linq object created from a generator then returns an iterable', () => 
    {
        function* gen()
        {
            yield 1;
            yield 2;
            yield 3;
            yield 4;
        }

        let linq = new Linq(gen);

        expect(Linq.isIterable(linq.toIterable())).toBeTruthy();
    });

    it('when called on a Linq object created from a generator then can be called (multple times) without "consuming" the generator', () => 
    {
        function* gen()
        {
            yield 5;
            yield 6;
            yield 7;
            yield 8;
        }

        let linq = new Linq(gen);

        // Attempt #1
        expect(Linq.isIterable(linq.toIterable())).toBeTruthy();

        // Attempt #2
        expect(Linq.isIterable(linq.toIterable())).toBeTruthy();
    });

    it('when called on a Linq object created from another Linq object then returns an iterable', () => 
    {
        let linq1 = new Linq([1, 2, 3]);
        let linq2 = new Linq(linq1);

        expect(Linq.isIterable(linq2.toIterable())).toBeTruthy();
    });

    it('when called on a Linq object created from a function then returns an iterable', () => 
    {
        let func1 = () => new Set([2, 3, 4, 5]);
        let linq = new Linq(func1);

        expect(Linq.isIterable(linq.toIterable())).toBeTruthy();
    });
});