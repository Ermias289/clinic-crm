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
  Building,
  Shield,
  UserCircle,
  LogOut,
  Loader2
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { authService } from '@/lib/api/auth';
import { companySettingService, CompanySettingDTO } from '@/lib/api/companySettings';
import { fileUploadService } from '@/lib/api/fileUpload';
import avatar from '../../assets/avatar.png';
import { NotificationsButton } from "@/components/NotificationsButton";

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
  { title: "Dental professionals", href: "/doctors", icon: Stethoscope },
  { title: "Dental Services", href: "/services", icon: ClipboardList },
  { title: "Patients", href: "/patients", icon: Users },
  { title: "Payments", href: "/payments", icon: Wallet },
  { 
    title: "Settings", 
    href: "/settings", 
    icon: Settings,
    children: [
      { title: "Company", href: "/settings/company", icon: Building },
      { title: "Branches", href: "/settings/branches", icon: Building2 },
      { title: "Card Types", href: "/settings/card-types", icon: CreditCard },
      { title: "Payment Types", href: "/settings/payment-types", icon: CreditCard },
      { title: "Bank Account", href: "/settings/bank-account", icon: CreditCard },
      { title: "Banner", href: "/settings/onboarding", icon: UserCog },
      { title: "Users", href: "/settings/users", icon: UserCircle },
      { title: "User Roles", href: "/settings/roles", icon: Shield },
    ]
  },
];

// Tooth icon SVG component (fallback)
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
  const [companyData, setCompanyData] = useState<CompanySettingDTO | null>(() => {
    // Try to load from cache on initial render
    const cached = localStorage.getItem('companyData');
    return cached ? JSON.parse(cached) : null;
  });
  const [loading, setLoading] = useState(!companyData); // Only load if no cache
  const [logoError, setLogoError] = useState(false);

  const user = authService.getCurrentUser();

  // Fetch company data only if not cached or cache is old
  useEffect(() => {
    const fetchIfNeeded = async () => {
      const cacheTimestamp = localStorage.getItem('companyDataTimestamp');
      const now = Date.now();
      const oneHour = 60 * 60 * 1000;
      
      // If we have no cache or cache is older than 1 hour, fetch fresh data
      if (!companyData || !cacheTimestamp || (now - parseInt(cacheTimestamp)) > oneHour) {
        try {
          setLoading(true);
          const data = await companySettingService.get();
          setCompanyData(data);
          setLogoError(false);
          
          // Cache the data
          localStorage.setItem('companyData', JSON.stringify(data));
          localStorage.setItem('companyDataTimestamp', now.toString());
        } catch (error) {
          setLogoError(true);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchIfNeeded();
  }, []); // Empty dependency array - only run once on mount

  // Memoize the logo URL to prevent unnecessary re-renders
  const logoUrl = useMemo(() => {
    if (!companyData?.logo) return '';
    const url = fileUploadService.getFileUrl(companyData.logo);
    return url;
  }, [companyData?.logo]);

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
    localStorage.removeItem("companyData"); // Clear cache on logout
    localStorage.removeItem("companyDataTimestamp");
    navigate("/login");
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo and Notifications */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-sidebar-border">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-sidebar-primary overflow-hidden mt-0.5">
            {loading ? (
              <Loader2 className="w-6 h-6 text-sidebar-primary-foreground animate-spin" />
            ) : companyData?.logo && !logoError ? (
              <img
                src={logoUrl}
                alt={`${companyData.name || 'Company'} Logo`}
                className="w-full h-full object-cover"
                onError={() => setLogoError(true)}
                key={`logo-${companyData.logo}`} // Key helps React identify image changes
              />
            ) : (
              <ToothIcon className="w-6 h-6 text-sidebar-primary-foreground" />
            )}
            {logoError && companyData?.logo && (
              <div className="absolute inset-0 flex items-center justify-center bg-sidebar-primary">
                <ToothIcon className="w-6 h-6 text-sidebar-primary-foreground" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-sidebar-foreground break-words leading-tight">
              {loading ? 'Loading...' : companyData?.name || 'Lucid'}
            </h1>
            <p className="text-xs text-sidebar-foreground/60 mt-1">
              {companyData?.prefix ? `${companyData.prefix} Clinic` : 'Dental Clinic CRM'}
            </p>
          </div>
        </div>
        {/* Notifications Button */}
        {user?.id ? (
          <div className="flex items-center">
            <NotificationsButton userId={user.id} />
          </div>
        ) : (
          <div className="text-xs text-muted-foreground">No user</div>
        )}
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
          <img 
            src={avatar} 
            alt={`${user?.fName || 'User'} avatar`} 
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user?.fName} {user?.lName}
            </p>
            <p className="text-xs text-sidebar-foreground/60 truncate">
              {user?.email}
            </p>
          </div>
        </div>
        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 mt-2 w-full rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}