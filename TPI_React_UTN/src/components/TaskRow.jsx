export const TaskRow = ({ task, toggleTask }) => {
  return (
    <tr key={task.name}>
      <td className="d-flex justify-content-between">
        <input
          type="checkbox"
          checked={task.done}
          onChange={() => toggleTask(task)}
        />
        {task.name}
      </td>
    </tr>
  );
};
