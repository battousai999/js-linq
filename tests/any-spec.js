import {Linq} from '../jslinq';

describe('any', () => 
{
    it('when called on an empty collection then returns false', () => 
    {
        let linq = Linq.empty();

        expect(linq.any()).toBeFalsy();
        expect(linq.any(x => x > 10)).toBeFalsy();
    });

    it('when called with an inclusive predicate then returns true', () => 
    {
        let linq = new Linq([1, 2, 3, 4, 5]);

        expect(linq.any(x => x > 0)).toBeTruthy();
    });

    it('when called with an all-exclusive predicate then returns false', () => 
    {
        let linq = Linq.range(1, 50);

        expect(linq.any(x => x < 0)).toBeFalsy();
    });

    it('when called without a predicate on a non-empty collection then returns true', () => 
    {
        let linq = new Linq([1, 2, 3]);

        expect(linq.any()).toBeTruthy();
    });

    it('when called without a predicate on an empty generator-based collection then returns false', () => 
    {
        function* gen() {}

        expect(Linq.from(gen).any()).toBeFalsy();
    });

    it('when called with an inclusive predicate on an infinite collection then eventually returns', () => 
    {
        function* gen()
        {
            let str = '';

            while (true)
            {
                str += '*';
                yield str;
            }
        }

        let predicate = x => x.length > 20;
        let linq = new Linq(gen);

        expect(linq.any(predicate)).toBeTruthy();
    },
    10000);

    it('when called with a non-function predicate then throws an exception', () => 
    {
        expect(() => { Linq.from([1, 2, 3]).any('not-a-function'); }).toThrow();
    });
});
