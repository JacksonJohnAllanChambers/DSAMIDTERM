import { ShortAnswerQuestion } from '../types'

const sa: ShortAnswerQuestion[] = [
  {
    id: 'SA-1',
    topic: 'Complexity',
    prompt: 'What does it mean for an algorithm to have a complexity of O(1)?',
    rubric: `Define constant time: running time does not grow with input size n; examples acceptable (e.g., array index read)`,
    exampleAnswer: 'O(1) means constant time — the number of steps stays about the same regardless of input size. For example, reading A[i] from an array by index.'
  },
  {
    id: 'SA-2',
    topic: 'Complexity',
    prompt: 'Which has larger time complexity: O(1) or O(1/n)? Why?',
    rubric: `Compare asymptotically: O(1) >= O(1/n); explain that 1/n decreases with n, runtimes are not typically O(1/n) but asymptotically smaller than constant`,
    exampleAnswer: 'As n grows, 1/n shrinks to 0, so O(1) dominates O(1/n). In asymptotic terms O(1) is larger. (O(1/n) is unusual for runtime but is asymptotically smaller.)'
  },
  {
    id: 'SA-3',
    topic: 'Java Basics',
    prompt: 'What is the use of the instanceof operator in Java?',
    rubric: `Explains runtime type check; returns true if reference refers to an instance of given class/interface or its subclass; often used before casting`,
    exampleAnswer: 'instanceof checks at runtime whether a reference is an instance of a class/interface (or subclass). It returns true/false and is often used to guard casts.'
  },
  {
    id: 'SA-4',
    topic: 'OOP Basics',
    prompt: 'What is an abstract class in Java? Give an example.',
    rubric: `Defines class that cannot be instantiated; may contain abstract and concrete methods; used to share base behavior; example included`,
    exampleAnswer: 'An abstract class cannot be instantiated and may include abstract methods that subclasses implement. Example: abstract class Shape { abstract double area(); } class Circle extends Shape { double area(){ return Math.PI*r*r; } }'
  },
  {
    id: 'SA-5',
    topic: 'Complexity',
    prompt: 'Give an example of an algorithm that has each of the following complexities: O(n), O(n^2), O(n^3), O(log n), O(n log n).',
    rubric: `Lists one plausible example per class: O(n): sum array; O(n^2): nested loops; O(n^3): triple loops or naive matrix mult; O(log n): binary search; O(n log n): mergesort/quicksort average`,
    exampleAnswer: `O(n): summing an array; O(n^2): checking all pairs; O(n^3): naive matrix multiplication; O(log n): binary search; O(n log n): mergesort.`
  },
  // Complexity additions to reach 5
  {
    id: 'SA-6',
    topic: 'Complexity',
    prompt: 'Define Big-Ω (Omega) and Big-Θ (Theta). How do they differ from Big-O? Give a quick example for each.',
    rubric: `Ω is asymptotic lower bound; Θ is tight bound (both upper and lower); O is upper bound; include simple function comparisons e.g., n^2 is Ω(n^2), O(n^2), hence Θ(n^2)`,
    exampleAnswer: 'Big-Ω is a lower bound (f(n) ≥ c·g(n) for large n). Big-Θ is a tight bound (both O and Ω). Big-O is an upper bound (f(n) ≤ c·g(n)). Example: 3n^2+2n is Ω(n^2), O(n^2), so Θ(n^2).'
  },
  {
    id: 'SA-7',
    topic: 'Complexity',
    prompt: 'What is amortized analysis? Provide a classic example and its amortized complexity.',
    rubric: `Explain averaging cost over a sequence; example: dynamic array push with occasional resize; show that per-operation amortized cost is O(1)`,
    exampleAnswer: 'Amortized analysis averages the cost of operations over a sequence. E.g., ArrayList push: most pushes O(1), occasional O(n) resize; across many pushes the amortized cost per push is O(1).'
  },
  // Java Basics additions to reach 5
  {
    id: 'SA-8',
    topic: 'Java Basics',
    prompt: 'Explain Java’s pass-by-value semantics. How does this affect modifying objects in a method?',
    rubric: `State Java is pass-by-value for references; reassigning parameter doesn’t affect caller’s reference; mutating the object via the reference does affect shared object`,
    exampleAnswer: 'Java passes copies of references (pass-by-value). Reassigning the parameter doesn’t change the caller’s variable. But using that reference to mutate fields changes the same underlying object seen by the caller.'
  },
  {
    id: 'SA-9',
    topic: 'Java Basics',
    prompt: 'Compare String, StringBuilder, and StringBuffer. When should each be used?',
    rubric: `String is immutable; StringBuilder is mutable and not synchronized (faster); StringBuffer is synchronized (thread-safe) and slower; guidance on concatenation in loops`,
    exampleAnswer: 'String is immutable. StringBuilder is mutable and faster for building strings in a single-threaded context. StringBuffer is similar but synchronized for thread safety. Prefer StringBuilder for concatenation in loops.'
  },
  {
    id: 'SA-10',
    topic: 'Java Basics',
    prompt: 'What’s the difference between checked and unchecked exceptions in Java? Give one example of each.',
    rubric: `Checked must be declared/handled (IOException); unchecked (RuntimeException) need not be declared (NullPointerException); explain compile-time checking`,
    exampleAnswer: 'Checked exceptions (e.g., IOException) must be declared or caught; the compiler enforces this. Unchecked exceptions (RuntimeException like NullPointerException) don’t need to be declared or caught.'
  },
  {
    id: 'SA-11',
    topic: 'Java Basics',
    prompt: 'What is type erasure in Java generics, and what are two limitations it causes?',
    rubric: `Explain generics are erased at runtime; cannot use primitives as type params, cannot instantiate T or do new T[], cannot check type with instanceof List<Integer>`,
    exampleAnswer: 'Type erasure removes generic type info at runtime. You can’t do new T() or new T[], can’t use primitives as type params, and you can’t instanceof-check List<Integer> (only List).'
  },
  // OOP Basics additions to reach 5
  {
    id: 'SA-12',
    topic: 'OOP Basics',
    prompt: 'Define encapsulation and list two benefits. How is it enforced in Java?',
    rubric: `Encapsulation bundles data+methods; benefits: invariants, hiding implementation, safer refactoring; enforced via access modifiers and getters/setters/immutability`,
    exampleAnswer: 'Encapsulation bundles state with behavior and hides internals. Benefits: maintains invariants and allows refactoring behind a stable API. In Java, use private fields and public methods (or immutability) to control access.'
  },
  {
    id: 'SA-13',
    topic: 'OOP Basics',
    prompt: 'Explain the equals/hashCode contract in Java. Why is it important for hash-based collections?',
    rubric: `If equals is true, hashCode must be equal; consistent across lifetime; required for HashMap/HashSet to locate buckets correctly`,
    exampleAnswer: 'If a.equals(b) then a.hashCode()==b.hashCode(). Both should be consistent. Hash-based collections use hashCode to bucket entries; breaking the contract causes lookups to fail or duplicate entries.'
  },
  {
    id: 'SA-14',
    topic: 'OOP Basics',
    prompt: 'Contrast composition vs inheritance. When should you prefer composition?',
    rubric: `Composition has-a; inheritance is-a; prefer composition to avoid tight coupling and for flexible reuse when there’s no true is-a relationship`,
    exampleAnswer: 'Inheritance models an is-a relationship; composition is has-a. Prefer composition when reuse is desired without a strict is-a, to avoid fragile base class problems and to allow swapping components.'
  },
  {
    id: 'SA-15',
    topic: 'OOP Basics',
    prompt: 'Differentiate static vs instance members in Java. Provide one good use case for static.',
    rubric: `Static belongs to class; instance to object; static methods can’t use instance fields; use case: utility methods or shared counters/constants`,
    exampleAnswer: 'Static members belong to the class and exist once, while instance members belong to each object. Static methods can’t access instance fields. Use static for utility functions or constants (e.g., Math.max, PI).'
  },
  // Linked Lists: 5 questions
  {
    id: 'SA-16',
    topic: 'Linked Lists',
    prompt: 'State the typical time complexities for insertion and deletion in singly vs doubly linked lists at head, tail, and middle (given a node).',
    rubric: `Head insert/delete O(1) both; tail insert O(1) if tail pointer for singly only with tail known (but delete tail O(n) without prev); doubly supports O(1) delete given node; middle given node O(1)`,
    exampleAnswer: 'Head insert/delete: O(1) for both. Tail insert: O(1) if we track tail; deleting tail is O(n) in singly (no prev), O(1) in doubly. Deleting/inserting at a known middle node is O(1) in doubly; in singly, delete given only node requires prev (O(n) to find).'
  },
  {
    id: 'SA-17',
    topic: 'Linked Lists',
    prompt: 'How do you detect a cycle in a singly linked list? Describe the algorithm and its complexity.',
    rubric: `Floyd’s tortoise-hare two pointers; if they meet there is a cycle; time O(n), space O(1)`,
    exampleAnswer: 'Use Floyd’s cycle detection: a slow pointer moves 1 step, a fast pointer 2 steps. If they ever meet, there’s a cycle. If fast hits null, no cycle. Time O(n), space O(1).'
  },
  {
    id: 'SA-18',
    topic: 'Linked Lists',
    prompt: 'Outline an iterative algorithm to reverse a singly linked list.',
    rubric: `Maintain prev, curr, next; loop: next=curr.next; curr.next=prev; prev=curr; curr=next; at end prev is new head`,
    exampleAnswer: 'Iterate with three pointers: prev=null, curr=head. While curr!=null: save next, point curr.next to prev, advance prev=curr and curr=next. Return prev.'
  },
  {
    id: 'SA-19',
    topic: 'Linked Lists',
    prompt: 'How can you find the middle node of a singly linked list in one pass?',
    rubric: `Use slow/fast pointers; slow advances 1, fast advances 2; when fast reaches end, slow is at middle`,
    exampleAnswer: 'Use two pointers: slow moves by 1, fast by 2. When fast is null or its next is null, slow points to the middle.'
  },
  {
    id: 'SA-20',
    topic: 'Linked Lists',
    prompt: 'Describe how to merge two sorted singly linked lists into one sorted list. What is the complexity?',
    rubric: `Use dummy head, walk both lists choosing smaller node each step, append remainder; time O(n+m), space O(1) extra`,
    exampleAnswer: 'Use a dummy head and a tail pointer. Compare heads, attach the smaller to tail, advance that list. Continue until one ends, then attach the remainder. Time O(n+m), extra space O(1).'
  },
  // Inheritance & Polymorphism: 5 questions
  {
    id: 'SA-21',
    topic: 'Inheritance & Polymorphism',
    prompt: 'Differentiate method overriding and overloading in Java. List two rules for a valid override.',
    rubric: `Overload: same name different params; Override: same signature in subclass; rules: same name+params, covariant return allowed, not reduce visibility, exceptions compatible`,
    exampleAnswer: 'Overloading is same method name with different parameter lists in the same class. Overriding is redefining a superclass method in a subclass with the same signature; you can use a covariant return, you can’t reduce visibility, and thrown checked exceptions must be the same or narrower.'
  },
  {
    id: 'SA-22',
    topic: 'Inheritance & Polymorphism',
    prompt: 'Explain upcasting and downcasting. When is instanceof appropriate and what risks does downcasting have?',
    rubric: `Upcast: subclass ref to superclass type (safe); Downcast: superclass ref to subclass (may fail at runtime); instanceof to guard; ClassCastException risk`,
    exampleAnswer: 'Upcasting treats a Child as a Parent (always safe). Downcasting treats a Parent as a Child; it’s only safe if the object is actually a Child. Use instanceof to guard. Otherwise a ClassCastException can occur.'
  },
  {
    id: 'SA-23',
    topic: 'Inheritance & Polymorphism',
    prompt: 'Compare abstract classes and interfaces (Java 8+). When would you choose one over the other?',
    rubric: `Abstract class: state + common code, single inheritance; Interface: type contract, multiple inheritance of type, default/static methods; choose based on need for shared state/base behavior vs pure capability`,
    exampleAnswer: 'Abstract classes can hold state and common code but you can extend only one. Interfaces define capabilities; since Java 8 they can have default/static methods and you can implement many. Use abstract class for shared state/base behavior; interface for a role/capability.'
  },
  {
    id: 'SA-24',
    topic: 'Inheritance & Polymorphism',
    prompt: 'What is constructor chaining and the role of super()? Describe the order of initialization.',
    rubric: `super() calls parent constructor; order: static init (parent->child), then instance fields/initializers, then constructors (parent->child)`,
    exampleAnswer: 'Constructor chaining uses super() to run the parent constructor before the child. Initialization order: parent statics, child statics, then for an instance creation: parent fields/initializers, parent constructor, then child fields/initializers, child constructor.'
  },
  {
    id: 'SA-25',
    topic: 'Inheritance & Polymorphism',
    prompt: 'What is dynamic dispatch in Java? Given a superclass reference to a subclass object, which method implementation runs?',
    rubric: `Method calls are resolved at runtime based on actual object type; overridden method in subclass runs even if reference type is superclass`,
    exampleAnswer: 'Dynamic dispatch means the method implementation is chosen at runtime by the object’s actual class. If a Parent ref points to a Child object, calling an overridden method runs the Child’s implementation.'
  }
]

export default sa
