import { Form, useLoaderData, useFetcher, useParams } from "react-router-dom";
import { getTask, updateTask } from "../tasks";
import { TodoInput } from "../component/TodoInput";
import { TodoList } from "../component/TodoList";
import { useState, useEffect } from "react";

const generateRandomId = () => {
  // Generate a random 10-digit number
  return Math.floor(1000000000 + Math.random() * 9000000000);
};

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
  const { taskId } = useParams();

  const STORAGE_KEY = `todos_${taskId}`;

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
    const newTodo = {
      id: `${taskId}_${generateRandomId()}`,
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

  useEffect(() => {
    setTodos(loadTodosFromLocalStorage());
    setFilteredTodos(loadTodosFromLocalStorage());
    setActiveFilter("all");
  }, [taskId]);
  return (
    <div id="task">
      <div id="taskInfo" className="flex justify-between px-5 py-2">
        <h1 className="font-sm font-bold">
          {task.name ? <>{task.name}</> : <i>No Name</i>}{" "}
        </h1>
        <div className="flex justify-between items-center w-24">
          <Favorite task={task} />
          <Form action="edit">
            <button type="submit" className="px-1 rounded hover:bg-gray-300">
              Edit
            </button>
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
            <button type="submit" className="px-1 rounded hover:bg-gray-300">
              Delete
            </button>
          </Form>
        </div>
      </div>
      <div
        id="taskImage"
        style={{
          backgroundImage: `url(${task.image || ""})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="h-52"
      ></div>
      <div
        id="tasksManager"
        className="text-gray-500 flex flex-col items-center justify-center px-5"
      >
        <div
          className="w-full h-24 flex items-center p-4 text-sm text-gray-800 rounded-lg bg-gray-50 mt-2"
          role="alert"
        >
          {task.notes && <p>{task.notes}</p>}
        </div>
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
        className="text-yellow-500"
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}
