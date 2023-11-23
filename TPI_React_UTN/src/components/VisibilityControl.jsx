export const VisibilityControl = ({
  isChecked,
  setShowCompleted,
  cleanTasks,
}) => {
  const handleDelete = () => {
    if (
      window.confirm("Estas seguro que deseas limpiar las Tareas Completadas?")
    ) {
      cleanTasks();
    }
  };
  return (
    <div className="d-flex justify-content-between my-2 align-items-center bg-secondary p-2">
      <div className="form-check form-switch">
        <input
          className="form-check-input"
          type="checkbox"
          role="switch"
          checked={isChecked}
          onChange={(e) => setShowCompleted(e.target.checked)}
        />{" "}
        <label>Mostrar Completadas</label>
      </div>
      <button onClick={(e) => handleDelete()} className="btn btn-danger btn-sm">
        <i class="bi bi-trash3-fill"></i>
      </button>
    </div>
  );
};
