export class Utils
{
    static isEqualIgnoringOrder(actual, expected)
    {
        if (expected == null || actual == null || expected.length != actual.length)
            return false;
        
        let len = expected.length;
        
        for (let i = 0; i < len; i++)
        {
            let found = false;
            
            for (let j = 0; j < len; j++)
            {
                if (expected[i] == actual[j])
                    found = true;
            }
            
            if (!found)
                return false;
        }
        
        return true;
    }
}

