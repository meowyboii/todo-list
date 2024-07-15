import "./styles.css";

const createTodo = function (title, description, dueDate, priority) {
  const todo = { title, description, dueDate, priority, status: false };

  const updateTodoStatus = (status) => {
    todo.status = status;
  };
  return { todo, updateTodoStatus };
};

const createTodoList = function () {
  const todoList = [];
  const createTodoList = (todo) => {
    todoList.push(todo);
  };
  const getTodoList = () => todoList;
  return { createTodoList, getTodoList };
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
    console.log(project);
    const projectDiv = document.createElement("div");
    projectDiv.textContent = project.name;
    document.body.appendChild(projectDiv);
  };
  const renderProjectList = () => {
    const selectElement = document.getElementById("project-select");
    selectElement.innerHTML = "";
    const projects = createProjectList.getProjectList();
    console.log(projects);
    projects.forEach((project) => {
      const option = document.createElement("option");
      option.value = project.name;
      option.textContent = project.name;
      selectElement.appendChild(option);
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
    console.log("shit");
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
