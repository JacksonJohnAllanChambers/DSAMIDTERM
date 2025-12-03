import { Question } from '../types'

const questions: Question[] = [
  {
    id: '1',
    prompt: 'In a Java class file, get methods are also known as:',
    choices: ['accessor methods', 'constructors', 'void methods', 'mutator methods'],
    correctIndex: 0,
    explanation: 'Getter methods “access” private state without changing it, hence they are called accessor methods. Setters are mutators because they mutate state.',
    topic: 'OOP Basics',
    source: '#1'
  },
  {
    id: '2',
    prompt: 'If a class is named Student, what name can you use for a constructor for this class?',
    choices: ['Student', 'Student.java', 'void Student', 'any name can be used since the constructor can be overloaded'],
    correctIndex: 0,
    explanation: 'A constructor must have exactly the same name as the class and has no return type. File names are unrelated (except each public class must be in a file with the same name).',
    topic: 'Java Basics',
    source: '#2'
  },
  {
    id: '3',
    prompt: 'When defining a constructor, what do you specify for the type of value returned?',
    choices: ['Primitive type such as int', 'Class name such as Student', 'void', 'None – a constructor does not have an explicit return type'],
    correctIndex: 3,
    explanation: 'Constructors have no declared return type—not even void.',
    topic: 'Java Basics',
    source: '#3'
  },
  {
    id: '4',
    prompt: 'This is automatically provided for a class if you do not write one yourself:',
    choices: ['default accessor method', 'default mutator method', 'default constructor', 'default instance variable'],
    correctIndex: 2,
    explanation: 'If no constructors are defined, Java supplies a no-argument default constructor.',
    topic: 'Java Basics',
    source: '#4'
  },
  {
    id: '6',
    prompt: 'What is the signature of the method whose header is: public Rectangle modify(Rectangle r1, Point p1, int x)?',
    choices: ['modify(r1, p1, x)', 'Rectangle modify(r1, p1, x)', 'modify(Rectangle, Point, int)', 'Rectangle modify(Rectangle, Point, int)'],
    correctIndex: 2,
    explanation: 'The method signature in Java is the method name plus the parameter types: modify(Rectangle, Point, int). Return type is not part of the signature.',
    topic: 'Java Basics',
    source: '#6'
  },
  {
    id: '7',
    prompt: 'A non-static (instance) method:',
    choices: [
      'can change static variables in a class',
      'can be called without object instantiation',
      'has to be called from inside the class',
      'can be called by static methods'
    ],
    correctIndex: 0,
    explanation: 'Instance methods can read/write both instance and static members (with an instance). They cannot be invoked without an object. Static methods may call instance methods only via an instance reference—not directly.',
    topic: 'OOP Basics',
    source: '#7'
  },
  {
    id: '8',
    prompt: 'Given: private static int val; private int num1; private double num2; and two objects are instantiated. Which is correct?',
    choices: [
      'Each object gets a separate copy of val, num1 and num2.',
      'Each object gets a separate copy of val, but they both share one copy of num1 and num2.',
      'Each object gets a separate copy of num1 and num2, but they both share one copy of val.',
      'The declaration has a syntax error.'
    ],
    correctIndex: 2,
    explanation: 'Static fields are shared by all instances; instance fields (num1, num2) are per-object.',
    topic: 'OOP Basics',
    source: '#8'
  },
  {
    id: '9',
    prompt: 'In class Pokemon with private int hp, what header allows access to the hp of this Pokemon?',
    choices: [
      'public static int getHP()',
      'public int getHP()',
      'public static getHP(int hp)',
      'public int getHP(int hp)'
    ],
    correctIndex: 1,
    explanation: 'Accessing instance state requires an instance method and no parameters: public int getHP() { return this.hp; }',
    topic: 'OOP Basics',
    source: '#9'
  },
  {
    id: '10',
    prompt: 'In class Pokemon, a method compares this.hp with another Pokemon and returns true if this.hp is greater. Header?',
    choices: [
      'public boolean compareHP(this.hp)',
      'public void compareHP(other.getHP())',
      'public void compareHP(Pokemon other)',
      'public boolean compareHP(Pokemon other)'
    ],
    correctIndex: 3,
    explanation: 'It should return boolean and accept a Pokemon parameter: public boolean compareHP(Pokemon other).',
    topic: 'OOP Basics',
    source: '#10'
  },
  {
    id: '11',
    prompt: 'Static method in Pokemon to set static price to a given value. Header?',
    choices: [
      'public static double setPrice(static double p)',
      'public static void setPrice()',
      'public static double setPrice(double p)',
      'public static void setPrice(double p)'
    ],
    correctIndex: 3,
    explanation: 'A setter for a static field is typically static and returns void: public static void setPrice(double p) { price = p; }',
    topic: 'OOP Basics',
    source: '#11'
  },
  {
    id: '12',
    prompt: 'Which statement is correct about this hierarchy?',
    stemId: 'INHERIT-1',
    choices: [
      'D is the superclass of A; B and C are sub-classes of D',
      'A is the subclass of B and C; D is the superclass of B and C',
      'A is the superclass of D; B and C are subclasses of D',
      'A is the subclass of D; B and C are superclasses of D'
    ],
    correctIndex: 2,
    explanation: 'D extends A => A is D\'s superclass. B and C extend D => B and C are subclasses of D.',
    topic: 'Inheritance & Polymorphism',
    source: '#12'
  },
  {
    id: '13',
    prompt: 'Given Student.getInfo() returns this.getFood(); GradStudent overrides getFood() to return "Taco". What prints?',
    choices: ['Taco', 'Pizza', 'Won\'t compile: getInfo missing in GradStudent', 'Won\'t compile: s1 is not a Student'],
    correctIndex: 0,
    explanation: 'Dynamic dispatch uses the runtime type GradStudent, so this.getFood() calls GradStudent.getFood() => "Taco".',
    topic: 'Inheritance & Polymorphism',
    source: '#13'
  },
  {
    id: '14',
    prompt: 'With the following chain, which assignments are valid for ClassA ref; ?',
    stemId: 'INSTANCEOF-CHAIN',
    statements: [
      'ref = new ClassA();',
      'ref = new ClassB();',
      'ref = new ClassC();'
    ],
    choices: ['I only', 'I and II', 'I, II and III', 'None of the above'],
    correctIndex: 2,
    explanation: 'A reference of type ClassA can point to instances of ClassA, ClassB, or ClassC.',
    topic: 'Inheritance & Polymorphism',
    source: '#14'
  },
  {
    id: '15',
    prompt: 'If ClassB extends ClassA, and ClassC is a superclass of ClassA, with ClassA ref; which assignments are valid?',
    statements: [
      'ref = new ClassA();',
      'ref = new ClassB();',
      'ref = new ClassC();'
    ],
    choices: ['I only', 'I and II', 'I, II and III', 'None of the above'],
    correctIndex: 1,
    explanation: 'ref can reference ClassA or its subclasses (ClassB). It cannot reference a superclass (ClassC).',
    topic: 'Inheritance & Polymorphism',
    source: '#15'
  },
  {
    id: '16',
    prompt: 'Using the chain below and ClassB ref = new ClassC(); Which of the following are true?',
    stemId: 'INSTANCEOF-CHAIN',
    statements: [
      'ref instanceof ClassA',
      'ref instanceof ClassB',
      'ref instanceof ClassC',
      'ref instanceof ClassD'
    ],
    choices: ['I only', 'I and II', 'I, II and III', 'I, II, III and IV'],
    correctIndex: 2,
    explanation: 'An instance of ClassC is also an instance of its supertypes ClassB and ClassA. It is not an instance of its subclass ClassD.',
    topic: 'Inheritance & Polymorphism',
    source: '#16'
  },
  {
    id: '17',
    prompt: 'What is the Big O of 25n^4 + 45n + 256?',
    choices: ['O(n^4)', 'O(n^5)', 'O(n)', 'O(256)'],
    correctIndex: 0,
    explanation: 'The highest-degree term dominates: O(n^4). Constants and lower-order terms are ignored in Big-O.',
    topic: 'Complexity',
    source: '#17'
  },
  {
    id: '18',
    prompt: 'What is the Big O of n^2 + 3000n + 500 n^\u00b2 log n + 1000?',
    choices: ['O(n^2)', 'O(n^2 log n)', 'O(3000n)', 'O(n^4 log n)'],
    correctIndex: 1,
    explanation: '500 n^2 log n dominates all other terms: O(n^2 log n).',
    topic: 'Complexity',
    source: '#18'
  },
  {
    id: '19',
    prompt: 'What is the Big O of (3 log n + 5)(n^3 + 2)?',
    choices: ['O(n^2 log n)', 'O(n^3 log n)', 'O(n^3)', 'O(3n log n)'],
    correctIndex: 1,
    explanation: '(3 log n)(n^3) dominates => O(n^3 log n).',
    topic: 'Complexity',
    source: '#19'
  },
  {
    id: '20',
    prompt: 'What is the Big O of (n^3 + 2n^2 + 3)/n^2?',
    choices: ['O(n)', 'O(n^2)', 'O(n^3)', 'O(1/n)'],
    correctIndex: 0,
    explanation: 'Divide each term by n^2 to get n + 2 + 3/n^2, which is O(n).',
    topic: 'Complexity',
    source: '#20'
  },
  {
    id: '21',
    prompt: 'What is the Big O of (1+2+...+n)(1+2+...+n)?',
    choices: ['O(n^4)', 'O(n^3)', 'O(n^2)', 'O(n)'],
    correctIndex: 0,
    explanation: 'Sum 1..n = n(n+1)/2 = O(n^2). Squared gives O(n^4).',
    topic: 'Complexity',
    source: '#21'
  },
  {
    id: '22',
    prompt: 'What is the Big O of log n^3 + n log n^4 + n log n^2?',
    choices: ['O(n log n)', 'O(n^2 log n)', 'O(n^3 log n)', 'O(n^4 log n)'],
    correctIndex: 0,
    explanation: 'log n^3 = 3 log n; n log n^4 = 4n log n; n log n^2 = 2n log n. Combined: O(n log n).',
    topic: 'Complexity',
    source: '#22'
  },
  {
    id: '23',
    prompt: 'What is the Big O of sqrt(n) * sqrt(n) * log(n^n)?',
    choices: ['O(n log n)', 'O(n^2 log n)', 'O(n^3 log n)', 'O(n^n)'],
    correctIndex: 1,
    explanation: 'sqrt(n)*sqrt(n) = n. log(n^n) = n log n. Product => n^2 log n.',
    topic: 'Complexity',
    source: '#23'
  },
  {
    id: '24',
    prompt: 'What is the Big O of an algorithm that finds the average of an array of n items?',
    choices: ['O(n)', 'O(n^2)', 'O(1)', 'O(log n)'],
    correctIndex: 0,
    explanation: 'You must visit all n items to compute the sum first: O(n).',
    topic: 'Complexity',
    source: '#24'
  },
  {
    id: '25',
    prompt: 'Which of the following has the fastest run time (asymptotically)?',
    choices: ['O(n)', 'O(1)', 'O(1/n)', 'O(log n)'],
    correctIndex: 1,
    explanation: 'In algorithm analysis, O(1) is the best among these for large n. O(1/n) is atypical for runtime (it would imply work decreases with input size).',
    topic: 'Complexity',
    source: '#25'
  },
  {
    id: '26',
    prompt: 'An algorithm with complexity O(n^2) takes 5 ms to process 50 items. Estimated time for 100 items?',
    choices: ['25 ms', '10 ms', '20 ms', '2500 ms'],
    correctIndex: 2,
    explanation: 'Quadratic time scales with the square of the factor increase: (100/50)^2 = 4×. 5 ms × 4 = 20 ms.',
    topic: 'Complexity',
    source: '#26'
  },
  {
    id: '27',
    prompt: 'An algorithm with complexity O(n^2) takes 2 ms to process 50 items. Estimated number of items in 8 ms?',
    choices: ['250', '200', '500', '100'],
    correctIndex: 3,
    explanation: 'Time ∝ n^2. If time ×4 (2→8 ms), then n scales by √4 = 2. So 50×2 = 100.',
    topic: 'Complexity',
    source: '#27'
  },
  // Linked Lists set (adapted from provided bank)
  {
    id: 'LL-1',
    prompt: 'What does this loop print?',
    stemId: 'LL-BASE',
    code: `Node<T> curr = front;
while (curr != null) {
  System.out.print(curr.getData() + " -> ");
  curr = curr.getNext();
}`,
    choices: [
      'Java -> C -> C++ -> Python ->',
      'Java -> C -> C++ -> Python -> null',
      'front -> Java -> C -> C++ -> Python -> null',
      'C -> C++ -> Python ->'
    ],
    correctIndex: 0,
    explanation: 'The loop prints each data followed by an arrow and stops before visiting null; it never prints the literal word "null".',
    topic: 'Linked Lists',
    source: 'LL set #1'
  },
  {
    id: 'LL-2',
    prompt: 'With the same list, what does this loop print?',
    stemId: 'LL-BASE',
    code: `Node<T> curr = front;
while (curr.getNext() != null) {
  System.out.print(curr.getData() + " -> ");
  curr = curr.getNext();
}`,
    choices: [
      'Java -> C -> C++ -> Python ->',
      'Java -> C -> C++ ->',
      'C -> C++ -> Python ->',
      'Java -> C -> C++ -> Python -> null'
    ],
    correctIndex: 1,
    explanation: 'The condition stops when curr.next is null, i.e., when curr is at the last node (Python). So Python is not printed.',
    topic: 'Linked Lists',
    source: 'LL set #2'
  },
  {
    id: 'LL-3',
    prompt: 'What does this expression return?',
    stemId: 'LL-BASE',
    code: `Node<T> curr = front;
curr.getNext().getNext().getData();`,
    choices: ['Java', 'C', 'C++', 'Python'],
    correctIndex: 2,
    explanation: 'Two nexts from front land on C++; getData() returns "C++".',
    topic: 'Linked Lists',
    source: 'LL set #3'
  },
  {
    id: 'LL-4',
    prompt: 'After the loop, what does curr.getData() print?',
    stemId: 'LL-BASE',
    code: `Node<T> curr = front;
for (int i = 0; i < 2; i++) {
  curr = curr.getNext();
}
System.out.println(curr.getData());`,
    choices: ['Java', 'C', 'C++', 'Python'],
    correctIndex: 2,
    explanation: 'Two hops from front: Java -> C -> C++.',
    topic: 'Linked Lists',
    source: 'LL set #4'
  },
  {
    id: 'LL-5',
    prompt: 'What happens after this code runs?',
    stemId: 'LL-BASE',
    code: `Node<T> curr = front;
for (int i = 0; i <= 3; i++) {
  curr = curr.getNext();
}
System.out.println(curr.getData());`,
    choices: ['Java', 'C', 'C++', 'NullPointerException'],
    correctIndex: 3,
    explanation: 'Four hops from front overshoots past Python to null; dereferencing data throws NullPointerException.',
    topic: 'Linked Lists',
    source: 'LL set #5'
  },
  {
    id: 'LL-6',
    prompt: 'To insert a new node with data "Pascal" after "C++", which two statements correctly link it (assume prev points to C++ node)?',
    stemId: 'LL-BASE',
    choices: [
      'Node<T> newN = new Node<>("Pascal", prev.getNext()); prev.setNext(newN);',
      'prev.setNext(new Node<>("Pascal", prev));',
      'Node<T> newN = new Node<>("Pascal", null); prev.getNext().setNext(newN);',
      'prev.setNext(prev.getNext());'
    ],
    correctIndex: 0,
    explanation: 'Standard insertion after prev: newN.next = prev.next; prev.next = newN.',
    topic: 'Linked Lists',
    source: 'LL set #6 (simplified)'
  },
  {
    id: 'LL-7',
    prompt: 'Which statement deletes Pascal (assume prev points to C++)?',
    stemId: 'LL-BASE',
    code: `front -> Java -> C -> C++ -> Pascal -> Python -> null`,
    choices: [
      'prev.setNext(prev.getNext().getNext());',
      'prev.setNext(prev.getNext());',
      'prev.setNext(prev.getNext().getNext().getNext());',
      'prev = prev.getNext();'
    ],
    correctIndex: 0,
    explanation: 'Bypass Pascal by linking C++ directly to Python: prev.next = prev.next.next.',
    topic: 'Linked Lists',
    source: 'LL set #7'
  },
  {
    id: 'LL-8',
    prompt: 'What is the result of the following?',
    stemId: 'LL-BASE',
    code: `Node<T> curr = front;
curr = curr.getNext().getNext().getNext();
curr.setData("Pascal");`,
    choices: [
      'C changes to Pascal',
      'C++ changes to Pascal',
      'Python changes to Pascal',
      'Throws NullPointerException'
    ],
    correctIndex: 2,
    explanation: 'Three hops from front reach Python; setData changes Python to Pascal.',
    topic: 'Linked Lists',
    source: 'LL set #8'
  },
  {
    id: 'LL-9',
    prompt: 'Time complexity to add a node to the front of a singly linked list of n items is:',
    choices: ['O(n)', 'O(n^2)', 'O(1)', 'O(log n)'],
    correctIndex: 2,
    explanation: 'You just adjust two pointers in constant time; list length does not matter.',
    topic: 'Linked Lists',
    source: 'LL set #9'
  },
  {
    id: 'LL-10',
    prompt: 'Time complexity to remove all nodes with a given item in a singly linked list of n items is:',
    choices: ['O(n)', 'O(n^2)', 'O(1)', 'O(log n)'],
    correctIndex: 0,
    explanation: 'You must traverse the list once to examine each node: linear time.',
    topic: 'Linked Lists',
    source: 'LL set #10'
  },
  // More OOP & Java basics
  {
    id: 'OOP-1',
    prompt: 'Which statement about overriding vs overloading is true?',
    choices: [
      'Overriding changes parameter types; overloading changes behavior at runtime',
      'Overriding changes return type arbitrarily; overloading requires @Override',
      'Overriding replaces a superclass method with the same signature; overloading reuses the name with different parameter lists',
      'Overloading requires inheritance; overriding does not'
    ],
    correctIndex: 2,
    explanation: 'Overriding: same signature, different implementation (polymorphism). Overloading: same name, different parameters (compile-time).',
    topic: 'OOP Basics'
  },
  {
    id: 'OOP-2',
    prompt: 'Which is correct about interfaces and abstract classes in Java?',
    choices: [
      'A class extends an interface and implements an abstract class',
      'A class implements an interface and may extend an abstract class',
      'Interfaces can have instance fields',
      'Abstract classes cannot contain any implemented methods'
    ],
    correctIndex: 1,
    explanation: 'Classes implement interfaces and can extend an abstract class. Interfaces have constants (public static final) and default/static methods; abstract classes can include implemented methods.',
    topic: 'OOP Basics'
  },
  {
    id: 'OOP-3',
    prompt: 'Which call is legal inside a static method?',
    choices: [
      'Access instance field directly',
      'Call an instance method without an instance',
      'Access a static field of the same class',
      'Use this to refer to current object'
    ],
    correctIndex: 2,
    explanation: 'Static methods cannot use this/instance members without an instance, but can access static fields/methods.',
    topic: 'Java Basics'
  },
  {
    id: 'OOP-4',
    prompt: 'The toString method in Java is declared in which class?',
    choices: ['String', 'Object', 'System', 'Class'],
    correctIndex: 1,
    explanation: 'Every class inherits toString from java.lang.Object (it can be overridden).',
    topic: 'OOP Basics'
  },
  {
    id: 'GEN-1',
    prompt: 'Which is a correct declaration of a generic LinkedList of Integers?',
    choices: [
      'LinkedList<int> list = new LinkedList<int>();',
      'LinkedList<Integer> list = new LinkedList<>();',
      'LinkedList list = new LinkedList<Integer>();',
      'LinkedList<Integer> list = new LinkedList<int>();'
    ],
    correctIndex: 1,
    explanation: 'Java generics use wrapper types (Integer). Diamond operator <> infers the type on the right-hand side.',
    topic: 'Java Basics'
  },
  {
    id: 'POLY-1',
    prompt: 'Given Animal a = new Dog(); a.speak(); where Dog overrides speak(). Which method is invoked?',
    choices: [
      'Animal.speak() at compile time',
      'Dog.speak() at runtime due to dynamic dispatch',
      'Both methods are called',
      'Compilation error due to mismatched types'
    ],
    correctIndex: 1,
    explanation: 'Polymorphism calls the overriding method of the runtime type (Dog).',
    topic: 'Inheritance & Polymorphism'
  },
  // More complexity & order arithmetic
  {
    id: 'CMP-1',
    prompt: 'What is the Big O of n log n + 10 n + 100 log n?',
    choices: ['O(n)', 'O(log n)', 'O(n log n)', 'O(n^2)'],
    correctIndex: 2,
    explanation: 'n log n dominates linear and logarithmic terms.',
    topic: 'Complexity'
  },
  {
    id: 'CMP-2',
    prompt: 'Nested loops: for i=1..n { for j=1..i { work(1) } } complexity is:',
    choices: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(n^3)'],
    correctIndex: 2,
    explanation: 'Sum_{i=1..n} i = n(n+1)/2 = O(n^2).',
    topic: 'Complexity'
  },
  {
    id: 'CMP-3',
    prompt: 'Which describes best-, worst-, and average-case complexity?',
    choices: [
      'They are equal for any algorithm',
      'They are measured over different inputs of the same size n',
      'They depend only on constant factors',
      'Worst-case is always exponential'
    ],
    correctIndex: 1,
    explanation: 'Cases refer to input distributions and arrangements for fixed size n; they may differ widely.',
    topic: 'Complexity'
  }
]

export default questions
