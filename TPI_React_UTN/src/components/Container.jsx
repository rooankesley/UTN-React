export const Container = ({ children }) => {
  return (
    <div className="container p-4">
      <div className="col-md-8 offset-md-2">{children}</div>
    </div>
  );
};
