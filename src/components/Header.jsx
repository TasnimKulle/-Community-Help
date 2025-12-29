import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import ThemeToggle from "./ThemeToggle";


export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900 shadow">
      <div className="flex items-center gap-3">
        <img src={logo} className="w-10 h-10 rounded-full" />
        <h1 className="font-bold text-xl dark:text-white">
          Community Help
        </h1>
      </div>

      <nav className="flex gap-4 dark:text-white">
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/requests">Requests</Link>
        <ThemeToggle />
      </nav>
    </header>
  );
}
