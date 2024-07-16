import "./styles.css";

const createTodo = function (title, description, dueDate, priority) {
  const todo = { title, description, dueDate, priority, status: false };

  const updateTodoStatus = (status) => {
    todo.status = status;
  };
  const getTodo = () => todo;
  return { getTodo, updateTodoStatus };
};

const createTodoList = function () {
  const todoList = [];
  const addTodoList = (todo) => {
    todoList.push(todo);
  };
  const getTodoList = () => todoList;
  return { addTodoList, getTodoList };
};

const createProject = function (name) {
  const todoList = createTodoList();
  return { name, todoList };
};

const createProjectList = (function () {
  const projectList = [];
  const addProjectList = (project) => {
    projectList.push(project);
  };
  const getProjectList = () => projectList;

  return { addProjectList, getProjectList };
})();

const displayController = (function () {
  const showModal = (modalId) => {
    let modal = document.getElementById(modalId);
    modal.style.display = "block";

    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };
  };
  const closeModal = (modalId) => {
    let modal = document.getElementById(modalId);
    modal.style.display = "none";
  };
  const displayProject = (project) => {
    const projectTitle = document.getElementById("project-title");
    projectTitle.textContent = project.name;
    const todoList = document.getElementById("todo-list");
    todoList.innerHTML = "";
    const todos = project.todoList.getTodoList();
    todos.forEach((todo) => {
      const label = document.createElement("label");
      label.textContent = todo.title;
      label.classList.add("list-container");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      const title = document.createElement("span");
      title.classList.add("checkmark");
      label.appendChild(checkbox);
      label.appendChild(title);

      todoList.appendChild(label);
      const lineBreak = document.createElement("hr");
      todoList.appendChild(lineBreak);
    });
  };
  const renderProjectList = () => {
    //Project options
    const selectElement = document.getElementById("project-select");
    selectElement.innerHTML = "";
    //Project list on sidebar
    const projectList = document.getElementById("my-projects");
    projectList.innerHTML = "";

    const projects = createProjectList.getProjectList();
    console.log(projects);
    projects.forEach((project) => {
      const option = document.createElement("option");
      const listItem = document.createElement("li");

      option.value = project.name;
      option.textContent = project.name;
      listItem.textContent = project.name;
      selectElement.appendChild(option);
      projectList.appendChild(listItem);
    });
  };
  return { displayProject, showModal, closeModal, renderProjectList };
})();

//Event listeners for add a task
(function () {
  const showButton = document.getElementById("add-task-btn");
  showButton.addEventListener("click", () => {
    displayController.showModal("task-modal");
  });
  const closeButton = document.getElementById("close-task");
  closeButton.addEventListener("click", () => {
    displayController.closeModal("task-modal");
  });

  const form = document.getElementById("task-form");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    // Get the input values
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const dueDate = document.getElementById("due-date").value;
    const priority = document.getElementById("priority").value;

    const todo = createTodo(title, description, dueDate, priority);
    const projectSelect = document.getElementById("project-select");
    const projectIndex = projectSelect.selectedIndex;

    const projects = createProjectList.getProjectList();
    const selectedProject = projects[projectIndex];
    selectedProject.todoList.addTodoList(todo.getTodo());

    form.reset();
    displayController.renderProjectList();
    displayController.displayProject(selectedProject);
    displayController.closeModal("task-modal");
  });
})();

//Event listeners for add a project
(function () {
  const showButton = document.getElementById("add-project-btn");
  showButton.addEventListener("click", () => {
    displayController.showModal("project-modal");
  });
  const closeButton = document.getElementById("close-project");
  closeButton.addEventListener("click", () => {
    displayController.closeModal("project-modal");
  });

  const form = document.getElementById("project-form");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    // Get the input values
    const name = document.getElementById("project-name").value;
    const project = createProject(name);
    createProjectList.addProjectList(project);
    console.log(createProjectList.getProjectList());
    form.reset();
    displayController.renderProjectList();
    displayController.closeModal("project-modal");
  });
})();

document.addEventListener("DOMContentLoaded", () => {
  const project = createProject("Default Project");
  createProjectList.addProjectList(project);

  displayController.displayProject(project);
  displayController.renderProjectList();
});
