class Node:
    def __init__(self, mahasiswa):
        self.mahasiswa = mahasiswa
        self.next = None


class MahasiswaLinkedList:
    def __init__(self):
        self.head = None

    def insert(self, mahasiswa):
        new_node = Node(mahasiswa)

        if self.head is None:
            self.head = new_node
            return

        current = self.head

        while current.next is not None:
            current = current.next

        current.next = new_node

    def to_array(self):
        result = []
        current = self.head

        while current is not None:
            result.append(current.mahasiswa.to_dict())
            current = current.next

        return result
