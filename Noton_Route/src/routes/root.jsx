import {
  Outlet,
  NavLink,
  useLoaderData,
  Form,
  redirect,
  useNavigation,
  useSubmit,
} from "react-router-dom";
import { getTasks, createTask } from "../tasks";
import { useState, useEffect } from "react";

const divStyle = {
  width: `calc(100dvw -15rem)`,
};

export async function action() {
  const task = await createTask();
  return redirect(`/tasks/${task.id}/edit`);
}

export async function loader({ request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const tasks = await getTasks(q);
  return { tasks, q };
}

export default function Root() {
  const { tasks, q } = useLoaderData();
  const navigation = useNavigation();
  const submit = useSubmit();

  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");

  useEffect(() => {
    document.getElementById("q").value = q;
  }, [q]);

  return (
    <div className="flex h-screen">
      <nav
        className="flex flex-col items-center w-60 h-full overflow-hidden text-gray-700 bg-gray-100 rounded"
        id="sidebar"
      >
        <div
          className="flex items-center justify-center w-full px-3 mt-3"
          to="#"
        >
          <img src="/noton-logo.png" alt="Notón" className="w-8 h-8" />
          <span className="text-sm font-bold">Notón</span>
        </div>
        <div className="w-full px-2">
          <div className="flex flex-col items-center w-full mt-3 border-t border-gray-300">
            <div>
              <Form id="search-form" role="search">
                <input
                  id="q"
                  className={
                    searching
                      ? "loading bg-gray-100 outline-none my-1.5"
                      : "bg-gray-100 outline-none my-1.5"
                  }
                  aria-label="Search tasks"
                  placeholder="Search"
                  type="search"
                  name="q"
                  defaultValue={q}
                  onChange={(event) => {
                    const isFirstSearch = q == null;
                    submit(event.currentTarget.form, {
                      replace: !isFirstSearch,
                    });
                  }}
                />
                <div id="search-spinner" aria-hidden hidden={!searching} />
                <div className="sr-only" aria-live="polite"></div>
              </Form>
            </div>{" "}
            {tasks.length ? (
              <ul className="w-full">
                <li>
                  <NavLink
                    className="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-300"
                    to="/"
                  >
                    <svg
                      className="w-6 h-6 stroke-current"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    <span className="ml-2 text-sm font-medium">Dashboard</span>
                  </NavLink>
                </li>
                <p className="ml-3 text-m font-medium">Task Folders</p>
                {tasks.map((task) => (
                  <li key={task.id} className="flex items-center px-3">
                    <NavLink
                      to={`tasks/${task.id}`}
                      className={({ isActive, isPending }) =>
                        isActive
                          ? "active font-bold flex items-center justify-between w-full h-8 px-3 rounded hover:bg-gray-300"
                          : isPending
                          ? "pending flex items-center justify-between w-full h-8 px-3 rounded hover:bg-gray-300"
                          : "flex items-center justify-between w-full h-8 px-3 rounded hover:bg-gray-300"
                      }
                    >
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 stroke-current"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                          />
                        </svg>
                        {task.name ? <>{task.name}</> : <i>No Name</i>}{" "}
                      </div>
                      <div>{task.favorite && <span>★</span>}</div>
                    </NavLink>
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                <i>No tasks</i>
              </p>
            )}
            <Form
              method="post"
              className="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M19.5 21a3 3 0 003-3V9a3 3 0 00-3-3h-5.379a.75.75 0 01-.53-.22L11.47 3.66A2.25 2.25 0 009.879 3H4.5a3 3 0 00-3 3v12a3 3 0 003 3h15zm-6.75-10.5a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V10.5z"
                  clipRule="evenodd"
                />
              </svg>

              <button type="submit" className="w-full text-left pl-2">
                New Task Folder
              </button>
            </Form>
          </div>
        </div>
        <NavLink
          className="flex items-center justify-center w-full h-16 mt-auto bg-gray-20 hover:bg-gray-300"
          to="#"
        >
          <div
            className="w-8 h-8 rounded-full"
            style={{
              backgroundImage: `url('https://i.pravatar.cc/150?img=50')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
          <span className="ml-2 text-sm font-medium">Oliveira Rooan</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M11.47 4.72a.75.75 0 011.06 0l3.75 3.75a.75.75 0 01-1.06 1.06L12 6.31 8.78 9.53a.75.75 0 01-1.06-1.06l3.75-3.75zm-3.75 9.75a.75.75 0 011.06 0L12 17.69l3.22-3.22a.75.75 0 111.06 1.06l-3.75 3.75a.75.75 0 01-1.06 0l-3.75-3.75a.75.75 0 010-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </NavLink>
      </nav>
      <div
        id="detail"
        className={navigation.state === "loading" ? "loading w-full" : "w-full"}
      >
        <Outlet />
      </div>
    </div>
  );
}
