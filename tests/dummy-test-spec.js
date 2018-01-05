import {Linq} from '../jslinq';

describe('dummy initial test', () =>
{
    it('should just work', () =>
    {
       let linq = new Linq();       
       let testValue = linq.test('something');

       expect(testValue).toBe('something-something');
    });
});
