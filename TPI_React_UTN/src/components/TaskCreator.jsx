import { useState } from "react";

export const TaskCreator = ({ createNewTask }) => {
  const [newTaskName, setNewTaskName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    createNewTask(newTaskName);
    setNewTaskName("");
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="my-2 d-flex align-items-center justify-content-between"
    >
      <div className="col-10">
        <input
          type="text"
          placeholder="Agregar nueva tarea"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          className="form-control"
        />
      </div>
      <div>
        <button className="btn btn-primary btn-sm">
          <i class="bi bi-plus-square"></i>
        </button>
      </div>
    </form>
  );
};
