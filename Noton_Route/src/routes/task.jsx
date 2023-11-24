import { Form, useLoaderData, useFetcher } from "react-router-dom";
import { getTask, updateTask } from "../tasks";

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

  return (
    <div id="task">
      <div id="taskImage">
        <img key={task.image} src={task.image || null} />
      </div>

      <div id="taskInfo">
        <h1>
          {task.name ? <>{task.name}</> : <i>No Name</i>}{" "}
          <Favorite task={task} />
        </h1>

        {task.twitter && (
          <p>
            <a target="_blank" href={`https://twitter.com/${task.twitter}`}>
              {task.twitter}
            </a>
          </p>
        )}

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
