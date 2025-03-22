document.getElementById('sortButton').addEventListener('click', function() {
    const numbers = document.getElementById('numbers').value.split(',').map(Number);
    const algorithm = document.getElementById('algorithm').value;
    let sortedNumbers;

    switch (algorithm) {
        case 'quickSort':
            sortedNumbers = quickSort(numbers);
            break;
        case 'bubbleSort':
            sortedNumbers = bubbleSort(numbers);
            break;
        case 'mergeSort':
            sortedNumbers = mergeSort(numbers);
            break;
        default:
            sortedNumbers = numbers;
    }

    document.getElementById('resultLabel').innerText = sortedNumbers.join(', ');
});

function quickSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }
    const pivot = arr[arr.length - 1];
    const left = [];
    const right = [];
    for (const el of arr.slice(0, arr.length - 1)) {
        el < pivot ? left.push(el) : right.push(el);
    }
    return [...quickSort(left), pivot, ...quickSort(right)];
}

function bubbleSort(arr) {
    let swapped;
    do {
        swapped = false;
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i] > arr[i + 1]) {
                [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                swapped = true;
            }
        }
    } while (swapped);
    return arr;
}

function mergeSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }
    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));
    return merge(left, right);
}

function merge(left, right) {
    const result = [];
    while (left.length && right.length) {
        if (left[0] < right[0]) {
            result.push(left.shift());
        } else {
            result.push(right.shift());
        }
    }
    return [...result, ...left, ...right];
}