/*
    $linq Version 2.0.0 (by Kurtis Jones @ https://github.com/battousai999/js-linq)
*/

class LinqHelper
{

}

export class Linq
{
    constructor(array, copyArray = true)
    {
        if (copyArray)
            this.array = (array == null ? [] : array.slice(0));
        else
            this.array = array;

        this.deferredSort = null;
    }
}
