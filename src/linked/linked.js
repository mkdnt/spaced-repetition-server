class _Node {
    constructor(value, next){
        this.value = value;
        this.next = next;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
    }

    insertFirst(item) {
        this.head = new _Node(item, this.head)
    }

    insertLast(item) {
        if(this.head === null) {
            this.insertFirst(item)
        } else {
            let tempNode = this.head;
            while (tempNode.next !== null) {
                tempNode = tempNode.next
            }
            tempNode.next = new _Node(item, null)
        }
    }

    insertBefore(item, value) {
        if(this.head === null) {
            this.insertFirst(item)
        } else {
            let tempNode = this.head
            while (tempNode.next.value !== value) {
                tempNode = tempNode.next
            }
            let newNext = tempNode.next
            tempNode.next = new _Node(item, newNext)
        }
    }

    insertAfter(item, value) {
        if(this.head === null) {
            this.insertFirst(item)
        } else {
            let tempNode = this.head
            while(tempNode.value !== value) {
                if(!tempNode.next) {
                    this.insertLast(item)
                    return
                }
                tempNode = tempNode.next
            }
            let newNext = tempNode.next
            tempNode.next = new _Node(item, newNext)
        }
    }

    insertAt(item, index) {
        if(this.head === null || index === 0){
            this.insertFirst(item)
        } else {
            let counter = 0
            let tempNode = this.head
            while(counter !== index) {
                tempNode = tempNode.next
                counter++
            }
            this.insertBefore(item, tempNode.value)
        }
    }

    findItem(item) {
        let current = this.head
        if(!this.head) {
            return null
        }
        while(current.value !== item) {
            if(current.next === null) {
                return null
            } else {
                current = current.next
            }
        }
        return current
    }

    removeItem(item) {
        if(!this.head) {
            return null
        }
        if(this.head.value == item) {
            this.head = this.head.next
            return
        }
        let current = this.head
        let previous = this.head

        while(current !== null && current.value !== item) {
            previous = current
            current = current.next
        }
        if(current === null) {
            return
        }
        previous.next = current.next
    }

    printList() {
        let current = this.head
        let str = ''
        while(current) {
            str += current.value + ' '
            current = current.next
        }
    }

    listSize() {
        let current = this.head
        let counter = 0

        if(!this.head) {
            return counter
        } else {
            while(current) {
                counter++
                current = current.next
            }
        }
        return counter
    }

    isEmpty() {
        return !this.head
    }

    findPrevious(item) {
        if(!this.head || !this.head.next) {
            return null
        } else {
            let current = this.head
            while (current){
                if(current.next.value == item) {
                    return current
                } else {
                    current = current.next
                }
            }
        }
    }

    findLast() {
        if(!this.head) {
            return null
        }
        let current = this.head
        while(current) {
            if(current.next == null) {
                return current
            } else {
                current = current.next
            }
        }
    }
}

const array = (linked) => {
    let current = linked.head
    let results = []
    while(current.next !== null) {
        results.push(current.value)
        current = current.next
    }
    results.push(current.value)
    return results
}


module.exports = {
    LinkedList,
    _Node,
    array
}