import { describe, it, expect, beforeEach } from 'vitest';
import {
  validateTitle,
  createTask,
  addTask,
  resetId,
  toggleTask,
  removeTask,
  filterTasks,
  countTasks,
  countCompleted,
  countPending,
  validatePriority,
  filterByPriority,
  isDuplicate,
} from '../src/taskManager.js';

// ============================================================
// 1. validateTitle
// ============================================================
describe('validateTitle', () => {
  it('deve retornar true para um título válido', () => {
    expect(validateTitle('Estudar Vitest')).toBe(true);
  });

  it('deve retornar true para título com exatamente 3 caracteres', () => {
    expect(validateTitle('abc')).toBe(true);
  });

  it('deve retornar false para string vazia', () => {
    expect(validateTitle('')).toBe(false);
  });

  it('deve retornar false para string com apenas espaços', () => {
    expect(validateTitle('   ')).toBe(false);
  });

  it('deve retornar false para título com menos de 3 caracteres', () => {
    expect(validateTitle('ab')).toBe(false);
  });

  it('deve retornar false para null', () => {
    expect(validateTitle(null)).toBe(false);
  });

  it('deve retornar false para undefined', () => {
    expect(validateTitle(undefined)).toBe(false);
  });

  it('deve retornar false para número', () => {
    expect(validateTitle(123)).toBe(false);
  });

  it('deve retornar false para booleano', () => {
    expect(validateTitle(true)).toBe(false);
  });

  it('deve retornar false para array', () => {
    expect(validateTitle(['tarefa'])).toBe(false);
  });

  it('deve considerar o título após trim', () => {
    expect(validateTitle('  abc  ')).toBe(true);
  });
});

// ============================================================
// 2. createTask
// ============================================================
describe('createTask', () => {
  beforeEach(() => {
    resetId();
  });

  it('deve criar uma tarefa com as propriedades corretas', () => {
    const task = createTask('Estudar TDD');

    expect(task).toHaveProperty('id');
    expect(task).toHaveProperty('title', 'Estudar TDD');
    expect(task).toHaveProperty('completed', false);
  });

  it('deve atribuir IDs incrementais', () => {
    const task1 = createTask('Tarefa 1');
    const task2 = createTask('Tarefa 2');

    expect(task2.id).toBe(task1.id + 1);
  });

  it('deve iniciar com completed = false', () => {
    const task = createTask('Nova tarefa');

    expect(task.completed).toBe(false);
  });

  it('deve fazer trim do título', () => {
    const task = createTask('  Título com espaços  ');

    expect(task.title).toBe('Título com espaços');
  });
});

// ============================================================
// 3. addTask
// ============================================================
describe('addTask', () => {
  beforeEach(() => {
    resetId();
  });

  it('deve adicionar uma tarefa a uma lista vazia', () => {
    const tasks = addTask([], 'Primeira tarefa');

    expect(tasks).toHaveLength(1);
    expect(tasks[0].title).toBe('Primeira tarefa');
  });

  it('deve adicionar uma tarefa a uma lista existente', () => {
    let tasks = addTask([], 'Tarefa 1');
    tasks = addTask(tasks, 'Tarefa 2');

    expect(tasks).toHaveLength(2);
    expect(tasks[1].title).toBe('Tarefa 2');
  });

  it('deve retornar um NOVO array (imutabilidade)', () => {
    const original = [];
    const updated = addTask(original, 'Nova tarefa');

    expect(updated).not.toBe(original);
    expect(original).toHaveLength(0);
  });

  it('deve lançar erro para título vazio', () => {
    expect(() => addTask([], '')).toThrow('Título inválido');
  });

  it('deve lançar erro para título null', () => {
    expect(() => addTask([], null)).toThrow('Título inválido');
  });

  it('deve lançar erro para título undefined', () => {
    expect(() => addTask([], undefined)).toThrow('Título inválido');
  });

  it('deve lançar erro para título com menos de 3 caracteres', () => {
    expect(() => addTask([], 'ab')).toThrow('Título inválido');
  });

  it('deve lançar erro para título numérico', () => {
    expect(() => addTask([], 42)).toThrow('Título inválido');
  });
});


// ============================================================
// 4. toggleTask
// ============================================================
describe('toggleTask', () => {
  beforeEach(() => {
    resetId();
  });

  it('deve marcar uma tarefa pendente como concluída', () => {
    const task = createTask('Tarefa pendente');
    const toggled = toggleTask(task);

    expect(toggled.completed).toBe(true);
  });

  it('deve desmarcar uma tarefa concluída', () => {
    const task = createTask('Tarefa pendente');
    const completed = toggleTask(task);
    const uncompleted = toggleTask(completed);

    expect(uncompleted.completed).toBe(false);
  });

  it('deve manter o id e o título inalterados', () => {
    const task = createTask('Minha tarefa');
    const toggled = toggleTask(task);

    expect(toggled.id).toBe(task.id);
    expect(toggled.title).toBe(task.title);
  });

  it('deve retornar um NOVO objeto (imutabilidade)', () => {
    const task = createTask('Tarefa original');
    const toggled = toggleTask(task);

    expect(toggled).not.toBe(task);
    expect(task.completed).toBe(false); // original inalterado
  });
});

// ============================================================
// 5. removeTask
// ============================================================
describe('removeTask', () => {
  let tasks;

  beforeEach(() => {
    resetId();
    tasks = addTask([], 'Tarefa 1');
    tasks = addTask(tasks, 'Tarefa 2');
    tasks = addTask(tasks, 'Tarefa 3');
  });

  it('deve remover uma tarefa pelo ID', () => {
    const updated = removeTask(tasks, 2);

    expect(updated).toHaveLength(2);
    expect(updated.find((t) => t.id === 2)).toBeUndefined();
  });

  it('deve manter as outras tarefas intactas', () => {
    const updated = removeTask(tasks, 2);

    expect(updated[0].title).toBe('Tarefa 1');
    expect(updated[1].title).toBe('Tarefa 3');
  });

  it('deve retornar um NOVO array (imutabilidade)', () => {
    const updated = removeTask(tasks, 1);

    expect(updated).not.toBe(tasks);
    expect(tasks).toHaveLength(3); // original inalterado
  });

  it('deve retornar a lista completa se o ID não existir', () => {
    const updated = removeTask(tasks, 999);

    expect(updated).toHaveLength(3);
  });

  it('deve retornar array vazio ao remover de lista vazia', () => {
    const updated = removeTask([], 1);

    expect(updated).toHaveLength(0);
  });
});


// ============================================================
// 6. filterTasks
// ============================================================
describe('filterTasks', () => {
  let tasks;

  beforeEach(() => {
    resetId();
    tasks = addTask([], 'Tarefa 1');
    tasks = addTask(tasks, 'Tarefa 2');
    tasks = addTask(tasks, 'Tarefa 3');
    // Marca a segunda tarefa como concluída
    tasks = tasks.map((t) => (t.id === 2 ? toggleTask(t) : t));
  });

  it('deve retornar todas as tarefas com filtro "all"', () => {
    const result = filterTasks(tasks, 'all');

    expect(result).toHaveLength(3);
  });

  it('deve retornar apenas pendentes com filtro "pending"', () => {
    const result = filterTasks(tasks, 'pending');

    expect(result).toHaveLength(2);
    result.forEach((t) => expect(t.completed).toBe(false));
  });

  it('deve retornar apenas concluídas com filtro "completed"', () => {
    const result = filterTasks(tasks, 'completed');

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Tarefa 2');
    expect(result[0].completed).toBe(true);
  });

  it('deve retornar todas as tarefas para filtro desconhecido (default)', () => {
    const result = filterTasks(tasks, 'invalido');

    expect(result).toHaveLength(3);
  });

  it('deve retornar array vazio para lista vazia', () => {
    expect(filterTasks([], 'all')).toHaveLength(0);
    expect(filterTasks([], 'pending')).toHaveLength(0);
    expect(filterTasks([], 'completed')).toHaveLength(0);
  });

  it('deve retornar um NOVO array (imutabilidade)', () => {
    const result = filterTasks(tasks, 'all');

    expect(result).not.toBe(tasks);
  });
});


// ============================================================
// 7. Contagens
// ============================================================
describe('countTasks', () => {
  it('deve retornar 0 para lista vazia', () => {
    expect(countTasks([])).toBe(0);
  });

  it('deve retornar o total de tarefas', () => {
    resetId();
    let tasks = addTask([], 'Tarefa 1');
    tasks = addTask(tasks, 'Tarefa 2');
    tasks = addTask(tasks, 'Tarefa 3');

    expect(countTasks(tasks)).toBe(3);
  });
});

describe('countCompleted', () => {
  let tasks;

  beforeEach(() => {
    resetId();
    tasks = addTask([], 'Tarefa 1');
    tasks = addTask(tasks, 'Tarefa 2');
    tasks = addTask(tasks, 'Tarefa 3');
    tasks = tasks.map((t) => (t.id <= 2 ? toggleTask(t) : t));
  });

  it('deve retornar 0 para lista vazia', () => {
    expect(countCompleted([])).toBe(0);
  });

  it('deve contar corretamente as tarefas concluídas', () => {
    expect(countCompleted(tasks)).toBe(2);
  });

  it('deve retornar 0 quando nenhuma tarefa está concluída', () => {
    resetId();
    let noCompleted = addTask([], 'Tarefa A');
    noCompleted = addTask(noCompleted, 'Tarefa B');

    expect(countCompleted(noCompleted)).toBe(0);
  });
});

describe('countPending', () => {
  let tasks;

  beforeEach(() => {
    resetId();
    tasks = addTask([], 'Tarefa 1');
    tasks = addTask(tasks, 'Tarefa 2');
    tasks = addTask(tasks, 'Tarefa 3');
    tasks = tasks.map((t) => (t.id === 1 ? toggleTask(t) : t));
  });

  it('deve retornar 0 para lista vazia', () => {
    expect(countPending([])).toBe(0);
  });

  it('deve contar corretamente as tarefas pendentes', () => {
    expect(countPending(tasks)).toBe(2);
  });

  it('deve retornar 0 quando todas as tarefas estão concluídas', () => {
    const allCompleted = tasks.map((t) => ({ ...t, completed: true }));

    expect(countPending(allCompleted)).toBe(0);
  });
});

// ============================================================
// 8. validatePriority
// ============================================================
describe('validatePriority', () => {
  it('deve retornar true para "low"', () => {
    expect(validatePriority('low')).toBe(true);
  });

  it('deve retornar true para "medium"', () => {
    expect(validatePriority('medium')).toBe(true);
  });

  it('deve retornar true para "high"', () => {
    expect(validatePriority('high')).toBe(true);
  });

  it('deve retornar false para valor inválido', () => {
    expect(validatePriority('urgente')).toBe(false);
  });

  it('deve retornar false para undefined', () => {
    expect(validatePriority(undefined)).toBe(false);
  });

  it('deve retornar false para null', () => {
    expect(validatePriority(null)).toBe(false);
  });
});

// ============================================================
// 9. createTask com prioridade
// ============================================================
describe('createTask com prioridade', () => {
  beforeEach(() => {
    resetId();
  });

  it('deve criar tarefa com priority "high" quando informado', () => {
    const task = createTask('Tarefa urgente', 'high');
    expect(task).toHaveProperty('priority', 'high');
  });

  it('deve criar tarefa com priority "medium" como padrão', () => {
    const task = createTask('Tarefa normal');
    expect(task).toHaveProperty('priority', 'medium');
  });

  it('deve criar tarefa com priority "low"', () => {
    const task = createTask('Tarefa baixa', 'low');
    expect(task).toHaveProperty('priority', 'low');
  });
});

// ============================================================
// 10. filterByPriority
// ============================================================
describe('filterByPriority', () => {
  let tasks;

  beforeEach(() => {
    resetId();
    tasks = addTask([], 'Tarefa baixa');
    tasks = addTask(tasks, 'Tarefa normal');
    tasks = addTask(tasks, 'Tarefa urgente');
    tasks[0] = { ...tasks[0], priority: 'low' };
    tasks[1] = { ...tasks[1], priority: 'medium' };
    tasks[2] = { ...tasks[2], priority: 'high' };
  });

  it('deve retornar apenas tarefas de alta prioridade', () => {
    const result = filterByPriority(tasks, 'high');
    expect(result).toHaveLength(1);
    expect(result[0].priority).toBe('high');
  });

  it('deve retornar apenas tarefas de baixa prioridade', () => {
    const result = filterByPriority(tasks, 'low');
    expect(result).toHaveLength(1);
    expect(result[0].priority).toBe('low');
  });

  it('deve retornar array vazio para prioridade sem correspondência', () => {
    const allLow = tasks.map((t) => ({ ...t, priority: 'low' }));
    const result = filterByPriority(allLow, 'high');
    expect(result).toHaveLength(0);
  });

  it('deve retornar um NOVO array (imutabilidade)', () => {
    const result = filterByPriority(tasks, 'medium');
    expect(result).not.toBe(tasks);
  });
});

// ============================================================
// 11. isDuplicate
// ============================================================
describe('isDuplicate', () => {
  let tasks;

  beforeEach(() => {
    resetId();
    tasks = addTask([], 'Estudar');
  });

  it('deve retornar true para título idêntico', () => {
    expect(isDuplicate(tasks, 'Estudar')).toBe(true);
  });

  it('deve retornar true para título com diferença de maiúsculas', () => {
    expect(isDuplicate(tasks, 'estudar')).toBe(true);
  });

  it('deve retornar true para título com espaços extras', () => {
    expect(isDuplicate(tasks, '  Estudar  ')).toBe(true);
  });

  it('deve retornar false para título diferente', () => {
    expect(isDuplicate(tasks, 'Trabalhar')).toBe(false);
  });

  it('deve retornar false para lista vazia', () => {
    expect(isDuplicate([], 'Estudar')).toBe(false);
  });
});

// ============================================================
// 12. addTask com verificação de duplicata
// ============================================================
describe('addTask com verificação de duplicata', () => {
  beforeEach(() => {
    resetId();
  });

  it('deve lançar erro ao adicionar tarefa duplicada', () => {
    const tasks = addTask([], 'Estudar');
    expect(() => addTask(tasks, 'Estudar')).toThrow('Tarefa duplicada');
  });

  it('deve lançar erro para duplicata com casing diferente', () => {
    const tasks = addTask([], 'Estudar');
    expect(() => addTask(tasks, 'ESTUDAR')).toThrow('Tarefa duplicada');
  });

  it('deve adicionar normalmente quando não há duplicata', () => {
    let tasks = addTask([], 'Estudar');
    tasks = addTask(tasks, 'Trabalhar');
    expect(tasks).toHaveLength(2);
  });
});