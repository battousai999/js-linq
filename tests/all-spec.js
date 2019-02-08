import {Linq} from '../jslinq';

describe('all', () => 
{
    it('when called with an exclusive predicate then returns false', () => 
    {
        let predicate = x => x < 5;
        let linq = Linq.range(1, 10);

        expect(linq.all(predicate)).toBeFalsy();
    });

    it('when called with an all-inclusive predicate then returns true', () => 
    {
        let predicate = x => x > 0;
        let linq = Linq.range(1, 20);

        expect(linq.all(predicate)).toBeTruthy();
    });

    it('when called with an exclusive predicate on an infinite iterable then eventually returns', () => 
    {
        let predicate = x => x.length < 100;

        function* gen()
        {
            let str = '';

            while (true)
            {
                str += '*';
                yield str;
            }
        }

        let linq = new Linq(gen);

        expect(linq.all(predicate)).toBeFalsy();
    },
    10000);

    it('when called on an empty collection then returns true', () => 
    {
        let predicate = x => x > 100;

        expect(Linq.empty().all(predicate)).toBeTruthy();
    });

    it('when called without a predicate then throws an exception', () => 
    {
        expect(() => { Linq.from([1, 2, 3]).all(); }).toThrow();
    });

    it('when called with a non-function predicate then throws an exception', () => 
    {
        expect(() => { Linq.from([1, 2, 3]).all('not-a-function'); }).toThrow();
    });
});
