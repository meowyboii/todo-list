import "./styles.css";

const createTodoList = function () {
  const todoList = [];

  const createTodo = (title, description, dueDate, priority) => {
    const todo = { title, description, dueDate, priority, status: false };
    todoList.push(todo);
  };
  const updateTodoStatus = (index, status) => {
    todoList[index].status = status;
  };

  const getTodoList = () => todoList;
  return { createTodo, getTodoList, updateTodoStatus };
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

//Set active class for sidebar navigation for current project displayed
const activateLink = (index) => {
  const sidebarProjects = document.querySelectorAll("li");
  sidebarProjects.forEach((project) => {
    project.classList.remove("active");
  });
  sidebarProjects[index].classList.add("active");
};

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
  const displayProject = (project, index) => {
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
    activateLink(index);
  };
  const renderProjectList = () => {
    //Project options
    const selectElement = document.getElementById("project-select");
    selectElement.innerHTML = "";
    //Project list on sidebar
    const projectList = document.getElementById("my-projects");
    projectList.innerHTML = "";

    const projects = createProjectList.getProjectList();
    projects.forEach((project) => {
      const option = document.createElement("option");
      const listItem = document.createElement("li");

      option.value = project.name;
      option.textContent = project.name;
      listItem.textContent = project.name;
      selectElement.appendChild(option);
      projectList.appendChild(listItem);
    });
    initializeProjectList();
  };
  return { displayProject, showModal, closeModal, renderProjectList };
})();

const initializeAddTask = () => {
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

    const projectSelect = document.getElementById("project-select");
    const projectIndex = projectSelect.selectedIndex;

    const projects = createProjectList.getProjectList();
    const selectedProject = projects[projectIndex];
    selectedProject.todoList.createTodo(title, description, dueDate, priority);

    form.reset();
    displayController.renderProjectList();
    displayController.displayProject(selectedProject, projectIndex);
    initializeTodoList(selectedProject);
    displayController.closeModal("task-modal");
  });
};

//Event listeners for add a project
const initializeAddProject = () => {
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
    form.reset();
    displayController.renderProjectList();

    const projectIndex = createProjectList.getProjectList().length - 1;
    displayController.displayProject(project, projectIndex);

    displayController.closeModal("project-modal");
  });
};

//Add event listeners for project list on sidebar
const initializeProjectList = () => {
  const projects = createProjectList.getProjectList();
  const sidebarProjects = document.querySelectorAll("li");
  sidebarProjects.forEach((project, index) => {
    project.addEventListener("click", () => {
      displayController.displayProject(projects[index], index);
      initializeTodoList(projects[index]);
    });
  });
};

//Add event listeners for todo list
const initializeTodoList = (project) => {
  const todos = project.todoList;
  const todoList = document.querySelectorAll('input[type="checkbox"]');
  todoList.forEach((todo, index) => {
    todo.addEventListener("change", (event) => {
      const isChecked = event.target.checked;
      todos.updateTodoStatus(index, isChecked);
      console.log(todos.getTodoList());
    });
  });
};

document.addEventListener("DOMContentLoaded", () => {
  initializeAddProject();
  initializeAddTask();
  const project = createProject("Default Project");
  createProjectList.addProjectList(project);
  displayController.renderProjectList();
  displayController.displayProject(project, 0);
  initializeTodoList(project);
});
