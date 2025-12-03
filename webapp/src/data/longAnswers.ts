import { LongAnswerQuestion } from '../types'

const la: LongAnswerQuestion[] = [
  {
    id: 'LA-3-1',
    topic: 'Java Basics',
    prompt: 'Write a generic class Point<T> with attributes xpos and ypos, a constructor that sets xpos and ypos, setters/getters for both, and a toString that returns the values.',
    rubric: `
- Class is generic: class Point<T>
- Private fields xpos, ypos of type T
- Constructor Point(T x, T y) assigns fields
- Getters: getXpos(): T, getYpos(): T
- Setters: setXpos(T), setYpos(T)
- toString returns both values, readable
    `,
    exampleAnswer: `
public class Point<T> {
  private T xpos;
  private T ypos;
  public Point(T xpos, T ypos) { this.xpos = xpos; this.ypos = ypos; }
  public T getXpos() { return xpos; }
  public T getYpos() { return ypos; }
  public void setXpos(T x) { this.xpos = x; }
  public void setYpos(T y) { this.ypos = y; }
  public String toString() { return "(" + xpos + ", " + ypos + ")"; }
}
    `
  },
  {
    id: 'LA-3-2',
    topic: 'Complexity',
    prompt: 'Analyze the following method line-by-line (for line numbers given) and determine the total run time in terms of n, assuming one basic operation costs t.',
    rubric: `
- Identify per-line costs (1 through 6)
- While loop runs n times
- Total time T(n) = (constants)*t + n*(constant)*t
- Big-O: O(n)
    `,
    code: `
public static int findSum(int[] arr){
1.  int sum = 0;
2.  int index = 0;
3.  while (index < arr.length){
4.    sum = sum + arr[index];
5.    index++;
    }
6.  return sum;
}
    `,
    exampleAnswer: `
Lines 1,2,6 are O(1) each. The while loop (3-5) executes n times (n = arr.length). Inside the loop there are two O(1) operations (line 4 add, line 5 increment). Total time: (3 constants)*t + n*(2*t) = O(n).
    `
  },
  {
    id: 'LA-4A',
    topic: 'Complexity',
    prompt: 'An algorithm takes 30 ms to process 256 items. Estimate time for 1024 items for complexities: (a) O(n), (b) O(√n), (c) O(n log2 n). Show steps.',
    rubric: `
- Correct scaling factors for each complexity
- Show steps for 256->1024 (factor 4)
- Provide numeric estimates in ms
    `
  },
  {
    id: 'LA-5',
    topic: 'Complexity',
    prompt: 'Derive the Big-O of each code segment separately and the total if segments are written one below the other.',
    rubric: `
- Segment 1: O(n)
- Segment 2: O(n^2)
- Segment 3: if O(n) else O(n^3) => O(n^3)
- Segment 4: O(log n)
- Segment 5: inside loop either O(n) or O(n^2) => O(n^3)
- Segment 6: O(n * log n * log n) = O(n (log n)^2)
- Total (sequential): sum => dominated by the largest term O(n^3)
    `
  },
  {
    id: 'LA-6-enumerate',
    topic: 'Linked Lists',
    prompt: 'Add enumerate() to LinkedList<T> that scans and prints all items in the list.',
    rubric: `
- Iterate from front until null
- Print data in order
- No modifications to structure
    `,
    code: `
public class Node<T>{
  private T data; private Node<T> next;
  public Node (T data, Node<T> next){ this.data = data; this.next = next; }
  public T getData(){ return data; }
  public Node<T> getNext(){ return this.next; }
  public void setData(T data){ this.data = data; }
  public void setNext(Node<T> next){ this.next = next; }
}
public class LinkedList<T>{
  private Node<T> front; private int count;
  public LinkedList(){ front = null; count=0; }
  // add enumerate() here
}
    `
  },
  {
    id: 'LA-6-odd',
    topic: 'Linked Lists',
    prompt: 'Add displayOdd() to LinkedList<T> that prints items at odd indices (1,3,5,...)',
    rubric: `
- Traverse with index
- Print when i%2==1
    `
  },
  {
    id: 'LA-6-after-front',
    topic: 'Linked Lists',
    prompt: 'Implement addAfterFront(T item). If list is empty, return; otherwise insert after the first node.',
    rubric: `
- Handle empty list
- new Node(item, front.getNext()); front.setNext(newNode)
- Maintain count if used
    `
  },
  {
    id: 'LA-6-remove-second-last',
    topic: 'Linked Lists',
    prompt: 'Implement removeSecondLast(). If the list has 0 or 1 node, return; otherwise remove the node before the last.',
    rubric: `
- Handle length < 2
- Track prev and curr (or two pointers) to stop at last-1
- Relink prev.next = null (or prev.next = prev.next.next)
    `
  },
  {
    id: 'LA-7-1-union',
    topic: 'Linked Lists',
    prompt: 'Given Unordered List API, implement union(list1, list2) returning items in list1 or list2 (no duplicates).',
    rubric: `
- Iterate list1 add all
- Iterate list2 add if not in result
- Uses contains/add
    `
  },
  {
    id: 'LA-7-2-difference',
    topic: 'Linked Lists',
    prompt: 'Using Unordered List API, implement difference(list1, list2) returning elements in list2 but not in list1.',
    rubric: `
- Iterate list2
- If not in list1 then add to result
- Use contains/add
    `
  }
]

export default la
