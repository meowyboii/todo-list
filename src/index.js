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
  const editTodo = (title, description, dueDate, priority, index) => {
    todoList[index].title = title;
    todoList[index].description = description;
    todoList[index].dueDate = dueDate;
    todoList[index].priority = priority;
  };

  const getTodoList = () => todoList;
  return { createTodo, getTodoList, updateTodoStatus, editTodo };
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

      if (todo.status === true) {
        title.classList.add("active-check");
      }

      todoList.appendChild(label);
      const lineBreak = document.createElement("hr");
      todoList.appendChild(lineBreak);
    });
    //Highlight the project on the sidebar for the current project being displayed
    activateLink(index);
  };

  //Display the list of projects in the add task project list and sidebar
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

  const form = document.getElementById("add-task-form");

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
    initializeTodoList(selectedProject, projectIndex);
    displayController.closeModal("task-modal");
  });
};

//Event listeners for edit task
const initializeEditTask = (todo, todoIndex, project, projectIndex) => {
  const form = document.getElementById("edit-task-form");

  // Remove previous event listener
  form.replaceWith(form.cloneNode(true));
  const newForm = document.getElementById("edit-task-form");

  const closeButton = document.getElementById("close-edit-task");
  closeButton.addEventListener("click", () => {
    displayController.closeModal("edit-task-modal");
  });

  //Get DOM elements
  const editTitle = document.getElementById("edit-title");
  const editDescription = document.getElementById("edit-description");
  const editDueDate = document.getElementById("edit-due-date");
  const editPriority = document.getElementById("edit-priority");
  const editProjectSelect = document.getElementById("edit-project-select");

  //Initialize the input values
  editTitle.value = todo.title;
  editDescription.value = todo.description;
  editDueDate.value = todo.dueDate;
  editPriority.value = todo.priority;
  editProjectSelect.textContent = project.name;

  newForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // Get the input values
    const title = editTitle.value;
    const description = editDescription.value;
    const dueDate = editDueDate.value;
    const priority = editPriority.value;

    project.todoList.editTodo(title, description, dueDate, priority, todoIndex);

    newForm.reset();
    displayController.displayProject(project, projectIndex);
    initializeTodoList(project, projectIndex);
    displayController.closeModal("edit-task-modal");
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
      initializeTodoList(projects[index], index);
    });
  });
};

//Add event listeners for todo list
const initializeTodoList = (project, projectIndex) => {
  const todos = project.todoList;
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  const checkmarks = document.querySelectorAll("span.checkmark");

  checkmarks.forEach((checkmark, index) => {
    checkmark.addEventListener("click", (event) => {
      event.preventDefault();

      checkboxes[index].checked = !checkboxes[index].checked;
      const isChecked = checkboxes[index].checked;
      todos.updateTodoStatus(index, isChecked);
      checkmark.classList.toggle("active-check");
      console.log(todos.getTodoList());
    });
  });
  checkboxes.forEach((list, index) => {
    list.addEventListener("click", (event) => {
      event.preventDefault();
      const todoList = todos.getTodoList();
      displayController.showModal("edit-task-modal");
      initializeEditTask(todoList[index], index, project, projectIndex);
      console.log("TODOLIST", todoList);
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
