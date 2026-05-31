from app.core.exceptions import ValidationException


def bubble_sort(data, key="nama"):
    arr = data.copy()
    n = len(arr)

    for i in range(n):
        for j in range(0, n - i - 1):
            if str(arr[j][key]).lower() > str(arr[j + 1][key]).lower():
                arr[j], arr[j + 1] = arr[j + 1], arr[j]

    return arr


def insertion_sort(data, key="nama"):
    arr = data.copy()

    for i in range(1, len(arr)):
        current = arr[i]
        j = i - 1

        while j >= 0 and str(arr[j][key]).lower() > str(current[key]).lower():
            arr[j + 1] = arr[j]
            j -= 1

        arr[j + 1] = current

    return arr


def selection_sort(data, key="nama"):
    arr = data.copy()

    for i in range(len(arr)):
        min_index = i

        for j in range(i + 1, len(arr)):
            if str(arr[j][key]).lower() < str(arr[min_index][key]).lower():
                min_index = j

        arr[i], arr[min_index] = arr[min_index], arr[i]

    return arr


def merge_sort(data, key="nama"):
    if len(data) <= 1:
        return data

    mid = len(data) // 2
    left = merge_sort(data[:mid], key)
    right = merge_sort(data[mid:], key)

    return merge(left, right, key)


def merge(left, right, key):
    result = []
    i = 0
    j = 0

    while i < len(left) and j < len(right):
        if str(left[i][key]).lower() <= str(right[j][key]).lower():
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1

    result.extend(left[i:])
    result.extend(right[j:])

    return result


def shell_sort(data, key="nama"):
    arr = data.copy()
    gap = len(arr) // 2

    while gap > 0:
        for i in range(gap, len(arr)):
            temp = arr[i]
            j = i

            while j >= gap and str(arr[j - gap][key]).lower() > str(temp[key]).lower():
                arr[j] = arr[j - gap]
                j -= gap

            arr[j] = temp

        gap //= 2

    return arr


def sort_data(data, algorithm, key):
    if algorithm == "bubble":
        return bubble_sort(data, key)
    if algorithm == "insertion":
        return insertion_sort(data, key)
    if algorithm == "selection":
        return selection_sort(data, key)
    if algorithm == "merge":
        return merge_sort(data, key)
    if algorithm == "shell":
        return shell_sort(data, key)

    raise ValidationException("Algoritma sort tidak valid.")
