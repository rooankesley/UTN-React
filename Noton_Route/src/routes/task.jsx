import { Form, useLoaderData, useFetcher } from "react-router-dom";
import { getTask, updateTask } from "../tasks";
import { TodoInput } from "../component/TodoInput";
import { TodoList } from "../component/TodoList";
import { useState, useEffect } from "react";

const STORAGE_KEY = "todos";

export async function loader({ params }) {
  const task = await getTask(params.taskId);
  if (!task) {
    throw new Response("", {
      status: 404,
      statusText: "Not Found",
    });
  }
  return { task };
}

export async function action({ request, params }) {
  let formData = await request.formData();
  return updateTask(params.taskId, {
    favorite: formData.get("favorite") === "true",
  });
}

export default function Task() {
  const { task } = useLoaderData();

  const loadTodosFromLocalStorage = () => {
    const storedTodos = localStorage.getItem(STORAGE_KEY);
    return storedTodos ? JSON.parse(storedTodos) : defaultTodos;
  };

  const defaultTodos = [
    {
      id: 1,
      title: "To-Do Task Example",
      completed: false,
    },
  ];

  const [todos, setTodos] = useState(loadTodosFromLocalStorage);
  const [activeFilter, setActiveFilter] = useState("all");
  const [filteredTodos, setFilteredTodos] = useState(todos);

  const updateLocalStorage = (newTodos) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTodos));
  };

  const addTodo = (title) => {
    const lastId = todos.length > 0 ? todos[todos.length - 1].id : 1;

    const newTodo = {
      id: lastId + 1,
      title,
      completed: false,
    };

    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    updateLocalStorage(updatedTodos);
  };

  const handleSetComplete = (id) => {
    const updatedList = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });

    setTodos(updatedList);
    updateLocalStorage(updatedList);
  };

  const handleDelete = (id) => {
    const updatedList = todos.filter((todo) => todo.id !== id);
    setTodos(updatedList);
    updateLocalStorage(updatedList);
  };

  const handleClearComplete = () => {
    const updatedList = todos.filter((todo) => !todo.completed);
    setTodos(updatedList);
    updateLocalStorage(updatedList);
  };

  const showAllTodos = () => {
    setActiveFilter("all");
  };

  const showActiveTodos = () => {
    setActiveFilter("active");
  };

  const showCompletedTodos = () => {
    setActiveFilter("completed");
  };

  useEffect(() => {
    if (activeFilter === "all") {
      setFilteredTodos(todos);
    } else if (activeFilter === "active") {
      const activeTodos = todos.filter((todo) => !todo.completed);
      setFilteredTodos(activeTodos);
    } else if (activeFilter === "completed") {
      const completedTodos = todos.filter((todo) => todo.completed);
      setFilteredTodos(completedTodos);
    }
  }, [activeFilter, todos]);

  return (
    <div id="task">
      <div id="taskImage">
        <img
          id="taskImageBackground"
          key={task.image}
          src={task.image || null}
        />
      </div>

      <div id="taskInfo">
        <h1>
          {task.name ? <>{task.name}</> : <i>No Name</i>}{" "}
          <Favorite task={task} />
        </h1>

        {task.notes && <p>{task.notes}</p>}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
              if (!confirm("Please confirm you want to delete this record.")) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
      <div
        id="tasksManager"
        className="bg-gray-800 text-gray-100 flex items-center justify-center px-5"
      >
        <div className="container flex flex-col max-w-xl">
          <TodoInput addTodo={addTodo} />
          <TodoList
            activeFilter={activeFilter}
            todos={filteredTodos}
            showAllTodos={showAllTodos}
            showActiveTodos={showActiveTodos}
            showCompletedTodos={showCompletedTodos}
            handleSetComplete={handleSetComplete}
            handleDelete={handleDelete}
            handleClearComplete={handleClearComplete}
          />
        </div>
      </div>
    </div>
  );
}

function Favorite({ task }) {
  const fetcher = useFetcher();
  let favorite = task.favorite;
  if (fetcher.formData) {
    favorite = fetcher.formData.get("favorite") === "true";
  }
  return (
    <fetcher.Form method="post">
      <button
        name="favorite"
        value={favorite ? "false" : "true"}
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}
