export const curriculumData = {
    python: {
        topics: [
            { id: 1, name: 'Variables and Data Types', locked: false, questions: [1, 2] },
            { id: 2, name: 'Control Flow', locked: false, questions: [3] },
            { id: 3, name: 'Functions', locked: false, questions: [] },
            { id: 4, name: 'Lists and Dictionaries', locked: true, questions: [] },
            { id: 5, name: 'Object-Oriented Programming', locked: true, questions: [] },
        ],
        questions: [
            { id: 1, title: 'Hello World', description: 'Write a program that prints "Hello, World!"', answer: 'print("Hello, World!")', points: 10 },
            { id: 2, title: 'Sum of Two Numbers', description: 'Create a function that returns the sum of two numbers', answer: 'def sum(a, b):\n    return a + b\n\nprint(sum(3, 4))', points: 15 },
            { id: 3, title: 'List Manipulation', description: 'Write a function to reverse a list', answer: 'def reverse_list(lst):\n    return lst[::-1]\n\nprint(reverse_list([1, 2, 3, 4, 5]))', points: 20 },
        ],
    },
    // Add more languages here as needed
};