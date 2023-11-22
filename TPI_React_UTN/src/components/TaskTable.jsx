import { TaskRow } from "./TaskRow";

export const TaskTable = ({
  tasks,
  toggleTask,
  showCompleted = false,
  tableName,
}) => {
  const taskTableRows = (doneValue) => {
    return tasks
      .filter((task) => task.done === doneValue)
      .map((task) => (
        <TaskRow task={task} key={task.name} toggleTask={toggleTask} />
      ));
  };

  return (
    <table className="table table-striped table-bordered">
      <thead>
        <tr>
          <th className="table-primary">{tableName}</th>
        </tr>
      </thead>
      <tbody>{taskTableRows(showCompleted)}</tbody>
    </table>
  );
};
