import { QuestionStem } from '../types'

// Shared code/scenario blocks referenced by questions via stemId
const stems: Record<string, QuestionStem> = {
  'LL-BASE': {
    id: 'LL-BASE',
    title: 'Linked List Base',
    description: 'Assume a singly linked list with references as shown:',
    code: `front -> Java -> C -> C++ -> Python -> null`
  },
  'INHERIT-1': {
    id: 'INHERIT-1',
    title: 'Class hierarchy',
    description: 'Assume the following class declarations (method bodies omitted):',
    code: `public class C extends D {}
public class B extends D {}
public class D extends A {}`
  },
  'INSTANCEOF-CHAIN': {
    id: 'INSTANCEOF-CHAIN',
    title: 'Inheritance chain A <- B <- C <- D',
    description: 'Assume: ClassB extends ClassA; ClassC extends ClassB; ClassD extends ClassC.',
    code: `class ClassA {}
class ClassB extends ClassA {}
class ClassC extends ClassB {}
class ClassD extends ClassC {}`
  }
}

export default stems
