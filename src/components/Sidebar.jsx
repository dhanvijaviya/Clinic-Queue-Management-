import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const navItems = {
  admin: [
    { section: "Management" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/admin/clinic",  label: "Clinic Info" },
    { to: "/admin/users", label: "Users" },
  ],
  patient: [
    { section: "Appointments" },
    { to: "/dashboard",  label: "Dashboard" },
    { to: "/appointments", label: "My Appointments" },
    { to: "/appointments/book",  label: "Book Appointment" },
    { section: "Records" },
    { to: "/prescriptions", label: "My Prescriptions" },
    { to: "/reports",  label: "My Reports" },
  ],
  receptionist: [
    { section: "Queue" },
    { to: "/dashboard",  label: "Dashboard" },
    { to: "/queue", label: "Daily Queue" },
  ],
  doctor: [
    { section: "Clinical" },
    { to: "/dashboard",  label: "Dashboard" },
    { to: "/doctor/queue", label: "My Queue" },
  ],
};

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const role = user?.role?.toLowerCase() || "patient";
  const items = navItems[role] || navItems.patient;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <>
      <div className="sidebar-brand">
        <h2> CMS</h2>
        <span className="clinic-sub">{user?.clinicName || "Clinic"}</span>
      </div>

      <nav className="sidebar-nav">
        {items.map((item, i) =>
          item.section ? (
            <div key={i} className="nav-section-label">
              {item.section}
            </div>
          ) : (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `nav-link${isActive ? " active" : ""}`
              }
              end={item.to === "/dashboard"}
            >
              {item.label}
            </NavLink>
          )
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">{initials}</div>
          <div className="user-info">
            <div className="user-name">{user?.name || "User"}</div>
            <div className="user-role">{role}</div>
          </div>
        </div>
        <button className="btn-logout" onClick={handleLogout}>
           Sign Out
        </button>
      </div>
    </>
  );
};

export default Sidebar;
