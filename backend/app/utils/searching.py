def linear_search(data, keyword):
    keyword = keyword.lower()

    for item in data:
        if (
            keyword in item["nim"].lower()
            or keyword in item["nama"].lower()
            or keyword in item["jurusan"].lower()
        ):
            return item

    return None


def sequential_search(data, keyword):
    result = []
    keyword = keyword.lower()

    for item in data:
        if (
            keyword in item["nim"].lower()
            or keyword in item["nama"].lower()
            or keyword in item["email"].lower()
            or keyword in item["jurusan"].lower()
        ):
            result.append(item)

    return result


def binary_search_by_nim(data, target_nim):
    sorted_data = sorted(data, key=lambda item: item["nim"])

    left = 0
    right = len(sorted_data) - 1

    while left <= right:
        mid = (left + right) // 2

        if sorted_data[mid]["nim"] == target_nim:
            return sorted_data[mid]
        elif sorted_data[mid]["nim"] < target_nim:
            left = mid + 1
        else:
            right = mid - 1

    return None
