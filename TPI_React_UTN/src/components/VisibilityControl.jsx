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
    <div className="d-flex justify-content-between my-2 align-items-center">
      <div>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={(e) => setShowCompleted(e.target.checked)}
        />{" "}
        <label>Mostrar Completadas</label>
      </div>
      <button
        onClick={(e) => handleDelete()}
        className="btn btn-primary btn-sm"
      >
        <i class="bi bi-trash3-fill"></i>
      </button>
    </div>
  );
};
