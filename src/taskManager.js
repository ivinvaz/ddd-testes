// ============================================================
// taskManager.js — Regras de negócio do gerenciador de tarefas
// ============================================================
// Todas as funções são PURAS:
//   - mesma entrada → mesma saída
//   - sem efeitos colaterais
//   - sem dependência de DOM, banco de dados ou APIs externas
// ============================================================

let _nextId = 1;

/**
 * Reseta o contador de IDs (útil para testes determinísticos).
 */
export function resetId() {
  _nextId = 1;
}

// ============================================================
// taskManager.js — Regras de negócio do gerenciador de tarefas
// ============================================================

// ------------------------------------------------------------
// Validação
// ------------------------------------------------------------

export function validateTitle(title) {
  if (typeof title !== 'string') {
    return false;
  }

  const trimmed = title.trim();
  return trimmed.length >= 3;
}

// ------------------------------------------------------------
// Criação
// ------------------------------------------------------------

export function createTask(title, priority = 'medium') {
  return {
    id: _nextId++,
    title: title.trim(),
    completed: false,
    priority,
  };
}

// ------------------------------------------------------------
// Duplicatas
// ------------------------------------------------------------

export function isDuplicate(tasks, title) {
  const normalized = title.trim().toLowerCase();
  return tasks.some((task) => task.title.toLowerCase() === normalized);
}

// ------------------------------------------------------------
// Adição com validação
// ------------------------------------------------------------

export function addTask(tasks, title) {
  if (!validateTitle(title)) {
    throw new Error(
      'Título inválido: deve ser uma string com pelo menos 3 caracteres.'
    );
  }

  if (isDuplicate(tasks, title)) {
    throw new Error('Tarefa duplicada: já existe uma tarefa com esse título.');
  }

  const newTask = createTask(title);
  return [...tasks, newTask];
}

// ------------------------------------------------------------
// Alteração de estado
// ------------------------------------------------------------

export function toggleTask(task) {
  return {
    ...task,
    completed: !task.completed,
  };
}

// ------------------------------------------------------------
// Remoção
// ------------------------------------------------------------

export function removeTask(tasks, taskId) {
  return tasks.filter((task) => task.id !== taskId);
}

// ------------------------------------------------------------
// Filtros
// ------------------------------------------------------------

export function filterTasks(tasks, status) {
  switch (status) {
    case 'completed':
      return tasks.filter((task) => task.completed === true);
    case 'pending':
      return tasks.filter((task) => task.completed === false);
    case 'all':
    default:
      return [...tasks];
  }
}

// ------------------------------------------------------------
// Contagens
// ------------------------------------------------------------

export function countTasks(tasks) {
  return tasks.length;
}

export function countCompleted(tasks) {
  return tasks.filter((task) => task.completed === true).length;
}

export function countPending(tasks) {
  return tasks.filter((task) => task.completed === false).length;
}

// ------------------------------------------------------------
// Prioridade
// ------------------------------------------------------------

export function validatePriority(priority) {
  return priority === 'low' || priority === 'medium' || priority === 'high';
}

export function filterByPriority(tasks, priority) {
  return tasks.filter((task) => task.priority === priority);
}