import React from "react";
import { Form, useLoaderData, redirect, useNavigate } from "react-router-dom";
import { updateTask } from "../tasks";

export async function action({ request, params }) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updateTask(params.taskId, updates);
  return redirect(`/tasks/${params.taskId}`);
}

export default function EditTask() {
  const { task } = useLoaderData();
  const navigate = useNavigate();

  return (
    <Form className="max-w-lg mx-auto mt-8" method="post" id="task-form">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Task Name
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Name"
          aria-label="Task name"
          type="text"
          name="name"
          defaultValue={task.name}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Task Image URL
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="https://example.com/image.jpg"
          aria-label="Image URL"
          type="text"
          name="image"
          defaultValue={task.image}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Task Notes
        </label>
        <textarea
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          name="notes"
          defaultValue={task.notes}
          rows={6}
        />
      </div>
      <div className="mb-6">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Save
        </button>
        <button
          className="ml-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={() => {
            navigate(-1);
          }}
        >
          Cancel
        </button>
      </div>
    </Form>
  );
}
