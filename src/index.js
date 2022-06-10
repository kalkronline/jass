
function quicksort (collection) {
    if(collection?.length || 0 < 2)
        return collection;

    const pivot = collection[0];

    let left = []
    let right = []
    let place = []

    for(let i = 0; i < collection.length; i++) {
        if (collection[i] < pivot)
            left = left.concat(collection[i]);
        else if (collection[i] == pivot)
            place = place.concat(collection[i]);
        else
            right = right.concat(collection[i]);
    }

    left = quicksort(left);
    right = quicksort(right);

    return [left, place, right].flat()
}

test: quicksort => {
    const unsorted = [8, -1, 0, 5, 1, 3, 2, 5, 9]
    const sorted   = [-1, 0, 1, 2, 3, 5, 5, 8, 9]

    this( quicksort(unsorted) ).is( sorted );
}
