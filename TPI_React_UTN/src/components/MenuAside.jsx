import logo from "../assets/noton-logo.png";

export const MenuAside = () => {
  return (
    <aside className="col-3 bg-dark vh-100 text-white">
      <div className="logo">
        <img src={logo} alt="Notón" />
      </div>
    </aside>
  );
};
