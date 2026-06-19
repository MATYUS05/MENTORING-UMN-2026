import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useAuth } from "../../app/providers/AuthProvider";

export default function SuperAdminSidebar() {
  const { userData } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login-mentoring");
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <aside className="flex w-64 flex-col border-r border-slate-200 bg-white p-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Super Admin</h2>

        <p className="mt-1 text-sm text-slate-500">{userData?.username}</p>
      </div>

      <nav className="mt-8 flex flex-col gap-1">
        <NavLink
          to="/superadmin"
          end
          className={({ isActive }) =>
            `rounded-lg px-3 py-2 text-sm font-medium transition ${
              isActive
                ? "bg-violet-50 text-violet-700"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`
          }
        >
          Dashboard
        </NavLink>
      </nav>
      <button
        onClick={handleLogout}
        className="mt-auto flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
          />
        </svg>
        Log Out
      </button>
    </aside>
  );
}
