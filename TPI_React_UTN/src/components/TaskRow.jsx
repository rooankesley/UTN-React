export const TaskRow = ({ task, toggleTask }) => {
  return (
    <tr key={task.name}>
      <td>
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
