import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Calendar, 
  CreditCard, 
  Users, 
  Stethoscope, 
  ClipboardList, 
  Wallet, 
  Settings,
  ChevronDown,
  Building2,
  CreditCard as CardIcon,
  UserCog,
  Clock,
  Building,
  Shield,
  UserCircle,
  LogOut
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Appointments", href: "/appointments", icon: Calendar },
  { title: "Cards", href: "/cards", icon: CreditCard },
  { title: "Medical Professionals", href: "/doctors", icon: Stethoscope },
  { title: "Medical Services", href: "/services", icon: ClipboardList },
  { title: "Patients", href: "/patients", icon: Users },
  { title: "Payments", href: "/payments", icon: Wallet },
  { 
    title: "Settings", 
    href: "/settings", 
    icon: Settings,
    children: [
      { title: "Company", href: "/settings/company", icon: Building },
      { title: "Branches", href: "/settings/branches", icon: Building2 },
      { title: "Card Settings", href: "/settings/cards", icon: CardIcon },
      { title: "Card Types", href: "/settings/card-types", icon: CreditCard },
      { title: "User Onboarding", href: "/settings/onboarding", icon: UserCog },
      { title: "Working Days", href: "/settings/working-days", icon: Clock },
      { title: "Users", href: "/settings/users", icon: UserCircle },
      { title: "User Roles", href: "/settings/roles", icon: Shield },
    ]
  },
];

// Tooth icon SVG component
const ToothIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 2C9.5 2 7.5 3.5 7 5.5C6.5 7.5 7 9 7.5 10.5C8 12 8.5 13.5 8 15.5C7.5 17.5 7 20 8.5 21.5C10 23 11.5 22 12 20C12.5 22 14 23 15.5 21.5C17 20 16.5 17.5 16 15.5C15.5 13.5 16 12 16.5 10.5C17 9 17.5 7.5 17 5.5C16.5 3.5 14.5 2 12 2Z" />
  </svg>
);

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState<string[]>(['/settings']);

  // Get user from localStorage
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : { name: "Admin User", email: "admin@brightsmile.com" };

  const toggleExpand = (href: string) => {
    setExpandedItems(prev => 
      prev.includes(href) 
        ? prev.filter(item => item !== href)
        : [...prev, href]
    );
  };

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

    // LOGOUT function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-sidebar-primary">
          <ToothIcon className="w-6 h-6 text-sidebar-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-sidebar-foreground">BrightSmile</h1>
          <p className="text-xs text-sidebar-foreground/60">Dental Clinic CRM</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleExpand(item.href)}
                    className={cn(
                      "nav-item w-full justify-between",
                      isActive(item.href) && "active"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </div>
                    <ChevronDown 
                      className={cn(
                        "w-4 h-4 transition-transform",
                        expandedItems.includes(item.href) && "rotate-180"
                      )} 
                    />
                  </button>
                  {expandedItems.includes(item.href) && (
                    <ul className="mt-1 ml-4 pl-4 border-l border-sidebar-border space-y-1">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <NavLink
                            to={child.href}
                            className={({ isActive }) => cn(
                              "nav-item text-sm py-2",
                              isActive && "active"
                            )}
                          >
                            <child.icon className="w-4 h-4" />
                            <span>{child.title}</span>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <NavLink
                  to={item.href}
                  end={item.href === '/'}
                  className={({ isActive }) => cn(
                    "nav-item",
                    isActive && "active"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-sidebar-accent">
          <div className="w-8 h-8 rounded-full bg-sidebar-primary flex items-center justify-center">
            <span className="text-sm font-medium text-sidebar-primary-foreground">AD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">Admin User</p>
            <p className="text-xs text-sidebar-foreground/60 truncate">{user.email}</p>
          </div>
        </div>
        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 mt-2 rounded-lg text-sm text-red-600 hover:bg-red-100"
        >
          <LogOut className="w-4 h-3" />
          Logout
        </button>
      </div>
    </aside>
  );
}
