export const curriculumData = {
    python: {
        topics: [
            { id: 1, name: 'Python Refresher', locked: false, questions: [1, 2] },
            { id: 2, name: 'Basic Mathematics', locked: false, questions: [3, 4] },
            { id: 3, name: 'Arrays and Strings', locked: false, questions: [5, 6] },
            { id: 4, name: 'Searching and Sorting', locked: false, questions: [7, 8] },
            { id: 5, name: 'Recursion', locked: true, questions: [9, 10] },
            { id: 6, name: 'Binary Search', locked: true, questions: [11, 12] },
            { id: 7, name: 'Linked Lists', locked: true, questions: [13, 14] },
            { id: 8, name: 'Stacks and Queues', locked: true, questions: [15, 16] },
            { id: 9, name: 'Trees and Graphs', locked: true, questions: [17, 18] },
            { id: 10, name: 'Dynamic Programming', locked: true, questions: [19, 20] },
        ],
        questions: [
            { id: 1, title: 'Hello World', description: 'Write a program that prints "Hello, World!"', answer: 'print("Hello, World!")', points: 10 },
            { id: 2, title: 'Basic Data Types', description: 'Create variables of different data types and print them', answer: 'x = 5\ny = 3.14\nz = "Python"\nprint(f"{x} {y} {z}")', points: 15 },
            { id: 3, title: 'Simple Addition', description: 'Write a function to add two numbers', answer: 'def add(a, b):\n    return a + b\n\nprint(add(3, 4))', points: 20 },
            { id: 4, title: 'Factorial Calculation', description: 'Write a function to calculate the factorial of a number', answer: 'def factorial(n):\n    return 1 if n == 0 else n * factorial(n-1)\n\nprint(factorial(5))', points: 25 },
            { id: 5, title: 'Reverse String', description: 'Write a function to reverse a string', answer: 'def reverse_string(s):\n    return s[::-1]\n\nprint(reverse_string("hello"))', points: 20 },
            { id: 6, title: 'Array Sum', description: 'Write a function to calculate the sum of an array', answer: 'def array_sum(arr):\n    return sum(arr)\n\nprint(array_sum([1, 2, 3, 4, 5]))', points: 20 },
            { id: 7, title: 'Linear Search', description: 'Implement a linear search algorithm', answer: 'def linear_search(arr, target):\n    for i, num in enumerate(arr):\n        if num == target:\n            return i\n    return -1\n\nprint(linear_search([1, 3, 5, 7, 9], 5))', points: 25 },
            { id: 8, title: 'Bubble Sort', description: 'Implement the bubble sort algorithm', answer: 'def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n-i-1):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n    return arr\n\nprint(bubble_sort([64, 34, 25, 12, 22, 11, 90]))', points: 30 },
            { id: 9, title: 'Recursive Sum', description: 'Write a recursive function to calculate the sum of an array', answer: 'def recursive_sum(arr):\n    if not arr:\n        return 0\n    return arr[0] + recursive_sum(arr[1:])\n\nprint(recursive_sum([1, 2, 3, 4, 5]))', points: 30 },
            { id: 10, title: 'Fibonacci Sequence', description: 'Write a recursive function to generate the nth Fibonacci number', answer: 'def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)\n\nprint(fibonacci(10))', points: 35 },
            // More questions can be added for the remaining topics
        ],
    },
    // Add more languages here as needed
};