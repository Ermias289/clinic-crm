import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Shield, 
  Users, 
  Calendar, 
  CreditCard, 
  Wallet, 
  Settings, 
  ClipboardList,
  Stethoscope,
  Eye,
  Edit,
  Trash2,
  Plus,
  Check,
  X
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: React.ElementType;
  userCount: number;
  permissions: string[];
}

const allPermissions: Permission[] = [
  // Dashboard
  { id: 'dashboard.view', name: 'View Dashboard', description: 'Access to dashboard and analytics', category: 'Dashboard' },
  { id: 'dashboard.analytics', name: 'View Analytics', description: 'Access detailed reports and analytics', category: 'Dashboard' },
  
  // Appointments
  { id: 'appointments.view', name: 'View Appointments', description: 'View appointment list and details', category: 'Appointments' },
  { id: 'appointments.create', name: 'Create Appointments', description: 'Create new appointments', category: 'Appointments' },
  { id: 'appointments.update', name: 'Update Appointments', description: 'Modify existing appointments', category: 'Appointments' },
  { id: 'appointments.delete', name: 'Cancel Appointments', description: 'Cancel or delete appointments', category: 'Appointments' },
  { id: 'appointments.complete', name: 'Complete Appointments', description: 'Mark appointments as completed', category: 'Appointments' },
  
  // Patients
  { id: 'patients.view', name: 'View Patients', description: 'View patient list and profiles', category: 'Patients' },
  { id: 'patients.create', name: 'Add Patients', description: 'Register new patients', category: 'Patients' },
  { id: 'patients.update', name: 'Update Patients', description: 'Edit patient information', category: 'Patients' },
  { id: 'patients.delete', name: 'Delete Patients', description: 'Remove patient records', category: 'Patients' },
  
  // Cards
  { id: 'cards.view', name: 'View Cards', description: 'View patient cards', category: 'Cards' },
  { id: 'cards.create', name: 'Issue Cards', description: 'Create new patient cards', category: 'Cards' },
  { id: 'cards.update', name: 'Update Cards', description: 'Modify card details', category: 'Cards' },
  { id: 'cards.suspend', name: 'Suspend Cards', description: 'Suspend or reactivate cards', category: 'Cards' },
  
  // Payments
  { id: 'payments.view', name: 'View Payments', description: 'View payment requests', category: 'Payments' },
  { id: 'payments.approve', name: 'Approve Payments', description: 'Approve payment requests', category: 'Payments' },
  { id: 'payments.reject', name: 'Reject Payments', description: 'Reject payment requests', category: 'Payments' },
  
  // Doctors
  { id: 'doctors.view', name: 'View Doctors', description: 'View doctor list and profiles', category: 'Doctors' },
  { id: 'doctors.manage', name: 'Manage Doctors', description: 'Add, edit, or remove doctors', category: 'Doctors' },
  { id: 'doctors.schedule', name: 'Manage Schedules', description: 'Edit doctor schedules', category: 'Doctors' },
  
  // Services
  { id: 'services.view', name: 'View Services', description: 'View medical services', category: 'Services' },
  { id: 'services.manage', name: 'Manage Services', description: 'Add, edit, or remove services', category: 'Services' },
  
  // Settings
  { id: 'settings.view', name: 'View Settings', description: 'Access settings pages', category: 'Settings' },
  { id: 'settings.company', name: 'Company Settings', description: 'Modify company information', category: 'Settings' },
  { id: 'settings.branches', name: 'Branch Settings', description: 'Manage clinic branches', category: 'Settings' },
  { id: 'settings.cards', name: 'Card Settings', description: 'Configure card options', category: 'Settings' },
  { id: 'settings.users', name: 'User Management', description: 'Manage system users', category: 'Settings' },
  { id: 'settings.roles', name: 'Role Management', description: 'Manage user roles and permissions', category: 'Settings' },
];

const initialRoles: Role[] = [
  {
    id: 'admin',
    name: 'Admin',
    description: 'Full system access with all permissions',
    color: '#ef4444',
    icon: Shield,
    userCount: 1,
    permissions: allPermissions.map(p => p.id),
  },
  {
    id: 'doctor',
    name: 'Doctor',
    description: 'Medical professional with clinical access',
    color: '#14b8a6',
    icon: Stethoscope,
    userCount: 5,
    permissions: [
      'dashboard.view',
      'appointments.view', 'appointments.update', 'appointments.complete',
      'patients.view', 'patients.update',
      'cards.view',
      'doctors.view',
      'services.view',
    ],
  },
  {
    id: 'receptionist',
    name: 'Receptionist',
    description: 'Front desk operations and patient management',
    color: '#f59e0b',
    icon: Users,
    userCount: 3,
    permissions: [
      'dashboard.view',
      'appointments.view', 'appointments.create', 'appointments.update', 'appointments.delete',
      'patients.view', 'patients.create', 'patients.update',
      'cards.view', 'cards.create',
      'payments.view',
      'doctors.view',
      'services.view',
    ],
  },
  {
    id: 'patient',
    name: 'Patient',
    description: 'Registered patient with limited access',
    color: '#22c55e',
    icon: Users,
    userCount: 156,
    permissions: [
      'appointments.view',
      'cards.view',
      'payments.view',
      'services.view',
    ],
  },
];

const categoryIcons: Record<string, React.ElementType> = {
  Dashboard: Eye,
  Appointments: Calendar,
  Patients: Users,
  Cards: CreditCard,
  Payments: Wallet,
  Doctors: Stethoscope,
  Services: ClipboardList,
  Settings: Settings,
};

const UserRolesPage = () => {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const handlePermissionToggle = (roleId: string, permissionId: string) => {
    setRoles(prev => prev.map(role => {
      if (role.id !== roleId) return role;
      
      const hasPermission = role.permissions.includes(permissionId);
      return {
        ...role,
        permissions: hasPermission
          ? role.permissions.filter(p => p !== permissionId)
          : [...role.permissions, permissionId]
      };
    }));

    // Update selectedRole if it's the one being modified
    if (selectedRole?.id === roleId) {
      setSelectedRole(prev => {
        if (!prev) return null;
        const hasPermission = prev.permissions.includes(permissionId);
        return {
          ...prev,
          permissions: hasPermission
            ? prev.permissions.filter(p => p !== permissionId)
            : [...prev.permissions, permissionId]
        };
      });
    }
  };

  const handleSavePermissions = () => {
    toast({ 
      title: "Permissions saved", 
      description: `${selectedRole?.name} role permissions have been updated.` 
    });
    setSelectedRole(null);
  };

  // Group permissions by category
  const groupedPermissions = allPermissions.reduce((acc, perm) => {
    if (!acc[perm.category]) acc[perm.category] = [];
    acc[perm.category].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <DashboardLayout 
      title="User Roles" 
      subtitle="Configure role-based access and permissions"
    >
      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {roles.map((role) => {
          const Icon = role.icon;
          return (
            <Card 
              key={role.id} 
              className="cursor-pointer hover:shadow-dental transition-all hover:-translate-y-1"
              onClick={() => setSelectedRole(role)}
            >
              <div className="h-2" style={{ backgroundColor: role.color }} />
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${role.color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: role.color }} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{role.name}</h3>
                    <p className="text-xs text-muted-foreground">{role.userCount} users</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{role.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {role.permissions.length} / {allPermissions.length} permissions
                  </span>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Permissions Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Permissions Overview</CardTitle>
          <CardDescription>Quick view of permissions across all roles</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Permission</th>
                  {roles.map(role => (
                    <th key={role.id} className="text-center">
                      <span 
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: `${role.color}20`, color: role.color }}
                      >
                        {role.name}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(groupedPermissions).map(([category, permissions]) => (
                  <>
                    <tr key={category} className="bg-muted/50">
                      <td colSpan={roles.length + 1} className="font-semibold">
                        <div className="flex items-center gap-2">
                          {categoryIcons[category] && (() => {
                            const CategoryIcon = categoryIcons[category];
                            return <CategoryIcon className="w-4 h-4" />;
                          })()}
                          {category}
                        </div>
                      </td>
                    </tr>
                    {permissions.map(perm => (
                      <tr key={perm.id}>
                        <td>
                          <div>
                            <p className="font-medium">{perm.name}</p>
                            <p className="text-xs text-muted-foreground">{perm.description}</p>
                          </div>
                        </td>
                        {roles.map(role => (
                          <td key={role.id} className="text-center">
                            {role.permissions.includes(perm.id) ? (
                              <Check className="w-5 h-5 mx-auto text-success" />
                            ) : (
                              <X className="w-5 h-5 mx-auto text-muted-foreground/30" />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Role Permissions Dialog */}
      <Dialog open={!!selectedRole} onOpenChange={() => setSelectedRole(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedRole && (
                <>
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${selectedRole.color}20` }}
                  >
                    <selectedRole.icon className="w-5 h-5" style={{ color: selectedRole.color }} />
                  </div>
                  <div>
                    <span>{selectedRole.name} Permissions</span>
                    <p className="text-sm text-muted-foreground font-normal">{selectedRole.description}</p>
                  </div>
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              Toggle permissions on or off for this role
            </DialogDescription>
          </DialogHeader>
          
          {selectedRole && (
            <div className="flex-1 overflow-y-auto pr-2 space-y-6 py-4">
              {Object.entries(groupedPermissions).map(([category, permissions]) => {
                const CategoryIcon = categoryIcons[category];
                const enabledCount = permissions.filter(p => selectedRole.permissions.includes(p.id)).length;
                
                return (
                  <div key={category} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {CategoryIcon && <CategoryIcon className="w-5 h-5 text-primary" />}
                        <h4 className="font-semibold">{category}</h4>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {enabledCount} / {permissions.length} enabled
                      </span>
                    </div>
                    <div className="grid gap-2">
                      {permissions.map(perm => (
                        <div 
                          key={perm.id}
                          className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                            selectedRole.permissions.includes(perm.id) 
                              ? 'bg-success/5 border-success/30' 
                              : 'bg-muted/30'
                          }`}
                        >
                          <div>
                            <p className="font-medium text-sm">{perm.name}</p>
                            <p className="text-xs text-muted-foreground">{perm.description}</p>
                          </div>
                          <Switch
                            checked={selectedRole.permissions.includes(perm.id)}
                            onCheckedChange={() => handlePermissionToggle(selectedRole.id, perm.id)}
                            disabled={selectedRole.id === 'admin'}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <DialogFooter className="border-t pt-4">
            <Button variant="outline" onClick={() => setSelectedRole(null)}>Cancel</Button>
            <Button 
              variant="dental" 
              onClick={handleSavePermissions}
              disabled={selectedRole?.id === 'admin'}
            >
              Save Permissions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default UserRolesPage;
