import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  X,
  Loader2
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { userRolesService, UserRole } from "@/lib/api/userRoles";

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  field: keyof UserRole; // Maps to the actual API field
}

interface ExtendedUserRole extends UserRole {
  color: string;
  icon: React.ElementType;
  userCount: number;
  permissions: string[]; // Computed from boolean fields
}

const allPermissions: Permission[] = [
  // Company Settings
  { id: 'company.view', name: 'View Company Settings', description: 'Access company information and settings', category: 'Company Settings', field: 'canViewCompanySettings' },
  { id: 'company.edit', name: 'Edit Company Settings', description: 'Modify company information and settings', category: 'Company Settings', field: 'canEditCompanySettings' },
  
  // User Management
  { id: 'users.add', name: 'Add Users', description: 'Create new user accounts', category: 'User Management', field: 'canAddUser' },
  { id: 'users.view', name: 'View Users', description: 'View user list and profiles', category: 'User Management', field: 'canViewUser' },
  { id: 'users.edit', name: 'Edit Users', description: 'Modify user information', category: 'User Management', field: 'canEditUser' },
  
  // Role Management
  { id: 'roles.add', name: 'Add Roles', description: 'Create new user roles', category: 'Role Management', field: 'canAddRole' },
  { id: 'roles.view', name: 'View Roles', description: 'View role list and permissions', category: 'Role Management', field: 'canViewRole' },
  { id: 'roles.edit', name: 'Edit Roles', description: 'Modify role permissions', category: 'Role Management', field: 'canEditRole' },
  
  // User Onboarding
  { id: 'onboarding.add', name: 'Add Onboarding', description: 'Create onboarding settings', category: 'User Onboarding', field: 'canAddUserOnBoarding' },
  { id: 'onboarding.edit', name: 'Edit Onboarding', description: 'Modify onboarding settings', category: 'User Onboarding', field: 'canEditUserOnBoarding' },
  { id: 'onboarding.view', name: 'View Onboarding Settings', description: 'View onboarding configuration', category: 'User Onboarding', field: 'canViewUserOnBoardingSetting' },
  
  // Card Settings
  { id: 'card-settings.add', name: 'Add Card Settings', description: 'Create card configuration', category: 'Card Settings', field: 'canAddCardSetting' },
  { id: 'card-settings.view', name: 'View Card Settings', description: 'View card configuration', category: 'Card Settings', field: 'canViewCardSetting' },
  { id: 'card-settings.edit', name: 'Edit Card Settings', description: 'Modify card configuration', category: 'Card Settings', field: 'canEditCardSetting' },
  
  // Card Types
  { id: 'card-types.add', name: 'Add Card Types', description: 'Create new card types', category: 'Card Types', field: 'canAddCardType' },
  { id: 'card-types.edit', name: 'Edit Card Types', description: 'Modify card types', category: 'Card Types', field: 'canEditCardType' },
  { id: 'card-types.view', name: 'View Card Types', description: 'View available card types', category: 'Card Types', field: 'canViewCardType' },
  
  // Branch Settings
  { id: 'branches.add', name: 'Add Branch Settings', description: 'Create branch configuration', category: 'Branch Settings', field: 'canAddBranchSetting' },
  { id: 'branches.view', name: 'View Branch Settings', description: 'View branch configuration', category: 'Branch Settings', field: 'canViewBranchSetting' },
  { id: 'branches.edit', name: 'Edit Branch Settings', description: 'Modify branch configuration', category: 'Branch Settings', field: 'canEditBranchSetting' },
  
  // Patient Management
  { id: 'patients.add', name: 'Add Patients', description: 'Register new patients', category: 'Patient Management', field: 'canAddPatient' },
  { id: 'patients.edit', name: 'Edit Patients', description: 'Modify patient information', category: 'Patient Management', field: 'canEditPatient' },
  { id: 'patients.view', name: 'View Patients', description: 'View patient list and profiles', category: 'Patient Management', field: 'canViewPatient' },
  
  // Doctor Schedule
  { id: 'schedules.add', name: 'Add Doctor Schedules', description: 'Create doctor schedules', category: 'Doctor Schedule', field: 'canAddDoctorSchedule' },
  { id: 'schedules.edit', name: 'Edit Doctor Schedules', description: 'Modify doctor schedules', category: 'Doctor Schedule', field: 'canEditDoctorSchedule' },
  { id: 'schedules.view', name: 'View Doctor Schedules', description: 'View doctor availability', category: 'Doctor Schedule', field: 'canViewDoctorSchedule' },
  
  // Working Settings
  { id: 'working.add', name: 'Add Working Settings', description: 'Create working time settings', category: 'Working Settings', field: 'canAddWorkingSetting' },
  { id: 'working.edit', name: 'Edit Working Settings', description: 'Modify working time settings', category: 'Working Settings', field: 'canEditWorkingSetting' },
  
  // Card Operations
  { id: 'cards.request', name: 'Request Cards', description: 'Request new patient cards', category: 'Card Operations', field: 'canRequestCard' },
  { id: 'cards.view', name: 'View Cards', description: 'View patient cards', category: 'Card Operations', field: 'canViewCard' },
  { id: 'cards.edit', name: 'Edit Cards', description: 'Modify card details', category: 'Card Operations', field: 'canEditCard' },
  
  // Card Payments
  { id: 'payments.approve', name: 'Approve Card Payments', description: 'Approve payment requests', category: 'Card Payments', field: 'canApproveCardPayment' },
  { id: 'payments.check', name: 'Check Card Payments', description: 'Review payment status', category: 'Card Payments', field: 'canCheckCardPayment' },
  { id: 'payments.reject', name: 'Reject Card Payments', description: 'Reject payment requests', category: 'Card Payments', field: 'canRejectCardPayment' },
  { id: 'payments.view', name: 'View Card Payments', description: 'View payment history', category: 'Card Payments', field: 'canViewCardPayment' },
  { id: 'payments.delete', name: 'Delete Card Payments', description: 'Remove payment records', category: 'Card Payments', field: 'canDeleteCardPayment' },
  { id: 'payments.cancel', name: 'Cancel Card Payments', description: 'Cancel payment requests', category: 'Card Payments', field: 'canCancelCardPayment' },
  { id: 'payments.edit', name: 'Edit Card Payments', description: 'Modify payment details', category: 'Card Payments', field: 'canEditCardPayment' },
  { id: 'payments.request', name: 'Request Card Payments', description: 'Create payment requests', category: 'Card Payments', field: 'canRequestCardPayment' },
  
  // Appointments
  { id: 'appointments.make', name: 'Make Appointments', description: 'Schedule new appointments', category: 'Appointments', field: 'canMakeAppointment' },
  { id: 'appointments.cancel', name: 'Cancel Appointments', description: 'Cancel existing appointments', category: 'Appointments', field: 'canCancelAppointment' },
  { id: 'appointments.complete', name: 'Complete Appointments', description: 'Mark appointments as completed', category: 'Appointments', field: 'canCompleteAppointment' },
  { id: 'appointments.view', name: 'View Appointments', description: 'View appointment schedules', category: 'Appointments', field: 'canViewAppointment' },
  { id: 'appointments.edit', name: 'Edit Appointments', description: 'Modify appointment details', category: 'Appointments', field: 'canEditAppointment' },
  
  // Medical Professionals
  { id: 'doctors.add', name: 'Add Medical Professionals', description: 'Register new doctors', category: 'Medical Professionals', field: 'canAddMedicalProfessional' },
  { id: 'doctors.edit', name: 'Edit Medical Professionals', description: 'Modify doctor information', category: 'Medical Professionals', field: 'canEditMedicalProfessional' },
  { id: 'doctors.view', name: 'View Medical Professionals', description: 'View doctor profiles', category: 'Medical Professionals', field: 'canViewMedicalProfessional' },
  
  // Medical Services
  { id: 'services.add', name: 'Add Medical Services', description: 'Create new medical services', category: 'Medical Services', field: 'canAddMedicalService' },
  { id: 'services.update', name: 'Update Medical Services', description: 'Modify medical services', category: 'Medical Services', field: 'canUpdateMedicalService' },
  { id: 'services.view', name: 'View Medical Services', description: 'View available services', category: 'Medical Services', field: 'canViewMedicalService' },
  
  // Bank Management
  { id: 'banks.add', name: 'Add Banks', description: 'Register new banks', category: 'Bank Management', field: 'canAddBank' },
  { id: 'banks.edit', name: 'Edit Banks', description: 'Modify bank information', category: 'Bank Management', field: 'canEditBank' },
  { id: 'banks.view', name: 'View Banks', description: 'View bank list', category: 'Bank Management', field: 'canViewBank' },
  
  // Bank Accounts
  { id: 'bank-accounts.add', name: 'Add Bank Accounts', description: 'Create bank accounts', category: 'Bank Accounts', field: 'canAddBankAccount' },
  { id: 'bank-accounts.edit', name: 'Edit Bank Accounts', description: 'Modify bank accounts', category: 'Bank Accounts', field: 'canEditBankAccount' },
  { id: 'bank-accounts.view', name: 'View Bank Accounts', description: 'View bank accounts', category: 'Bank Accounts', field: 'canViewBankAccount' },
  
  // Notifications
  { id: 'notifications.read', name: 'Read Notifications', description: 'Mark notifications as read', category: 'Notifications', field: 'canReadNotification' },
  { id: 'notifications.view', name: 'View Notifications', description: 'View notification list', category: 'Notifications', field: 'canViewNotification' },
];

const getRoleDisplayInfo = (roleName: string): { color: string; icon: React.ElementType; userCount: number } => {
  const roleMap: Record<string, { color: string; icon: React.ElementType; userCount: number }> = {
    'Admin': { color: '#ef4444', icon: Shield, userCount: 1 },
    'Doctor': { color: '#14b8a6', icon: Stethoscope, userCount: 5 },
    'Receptionist': { color: '#f59e0b', icon: Users, userCount: 3 },
    'Patient': { color: '#22c55e', icon: Users, userCount: 156 },
  };
  
  return roleMap[roleName] || { color: '#6b7280', icon: Users, userCount: 0 };
};

// Default permissions for roles if API doesn't provide them
const getDefaultPermissions = (roleName: string): string[] => {
  const defaultPermissions: Record<string, string[]> = {
    'Admin': allPermissions.map(p => p.id),
    'Doctor': [
      'patients.view', 'patients.edit',
      'schedules.view', 'schedules.edit',
      'appointments.view', 'appointments.make', 'appointments.complete',
      'cards.view',
      'services.view',
      'notifications.view', 'notifications.read',
    ],
    'Receptionist': [
      'patients.add', 'patients.view', 'patients.edit',
      'appointments.make', 'appointments.view', 'appointments.edit', 'appointments.cancel',
      'cards.request', 'cards.view', 'cards.edit',
      'payments.view', 'payments.request',
      'schedules.view',
      'services.view',
      'notifications.view', 'notifications.read',
    ],
    'Patient': [
      'appointments.make', 'appointments.view', 'appointments.cancel',
      'cards.request', 'cards.view',
      'payments.view', 'payments.request', 'payments.cancel',
      'services.view',
      'notifications.view', 'notifications.read',
    ],
  };
  
  return defaultPermissions[roleName] || [];
};

// Convert UserRole boolean fields to permission array
const convertRoleToPermissions = (role: UserRole): string[] => {
  return allPermissions
    .filter(permission => {
      const fieldValue = role[permission.field];
      return fieldValue === true;
    })
    .map(permission => permission.id);
};

// Convert permission array back to UserRole boolean fields
const convertPermissionsToRole = (permissions: string[], baseRole: UserRole): Partial<UserRole> => {
  const updates: Partial<UserRole> = {};
  
  allPermissions.forEach(permission => {
    const hasPermission = permissions.includes(permission.id);
    (updates as any)[permission.field] = hasPermission;
  });
  
  return updates;
};

const UserRolesPage = () => {
  const [roles, setRoles] = useState<ExtendedUserRole[]>([]);
  const [selectedRole, setSelectedRole] = useState<ExtendedUserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<ExtendedUserRole | null>(null);
  const [newRole, setNewRole] = useState({ name: '', description: '', permissions: [] as string[] });

  // Category icons mapping
  const categoryIcons: Record<string, React.ElementType> = {
    'Company Settings': Settings,
    'User Management': Users,
    'Role Management': Shield,
    'User Onboarding': ClipboardList,
    'Card Settings': Settings,
    'Card Types': CreditCard,
    'Branch Settings': Settings,
    'Patient Management': Users,
    'Doctor Schedule': Calendar,
    'Working Settings': Calendar,
    'Card Operations': CreditCard,
    'Card Payments': Wallet,
    'Appointments': Calendar,
    'Medical Professionals': Stethoscope,
    'Medical Services': ClipboardList,
    'Bank Management': Wallet,
    'Bank Accounts': Wallet,
    'Notifications': Eye,
  };

  // Load roles from API
  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setIsLoading(true);
      const apiRoles = await userRolesService.getAll();
      
      const extendedRoles: ExtendedUserRole[] = apiRoles.map(role => {
        // Convert boolean fields to permissions array
        const permissions = convertRoleToPermissions(role);
        
        return {
          ...role,
          permissions,
          ...getRoleDisplayInfo(role.name)
        };
      });
      
      setRoles(extendedRoles);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load user roles",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRole = async () => {
    try {
      const permissionUpdates = convertPermissionsToRole(newRole.permissions, {} as UserRole);
      
      const roleData: Partial<UserRole> = {
        id: 0, // Will be assigned by backend
        name: newRole.name,
        description: newRole.description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...permissionUpdates
      };
      
      const createdRole = await userRolesService.create(roleData as UserRole);
      
      const extendedRole: ExtendedUserRole = {
        ...createdRole,
        permissions: convertRoleToPermissions(createdRole),
        ...getRoleDisplayInfo(createdRole.name)
      };
      
      setRoles(prev => [...prev, extendedRole]);
      setNewRole({ name: '', description: '', permissions: [] });
      setIsCreateDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Role created successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create role",
        variant: "destructive"
      });
    }
  };

  const handleUpdateRole = async () => {
    if (!selectedRole) return;
    
    try {
      const permissionUpdates = convertPermissionsToRole(selectedRole.permissions, selectedRole);
      
      const roleData: UserRole = {
        ...selectedRole,
        updatedAt: new Date().toISOString(),
        ...permissionUpdates
      };
      
      const updatedRole = await userRolesService.update(roleData);
      
      const extendedRole: ExtendedUserRole = {
        ...updatedRole,
        permissions: convertRoleToPermissions(updatedRole),
        ...getRoleDisplayInfo(updatedRole.name)
      };
      
      setRoles(prev => prev.map(role => 
        role.id === selectedRole.id ? extendedRole : role
      ));
      
      setSelectedRole(null);
      setIsEditDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Role updated successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update role",
        variant: "destructive"
      });
    }
  };

  const handleDeleteRole = async () => {
    if (!roleToDelete) return;
    
    try {
      await userRolesService.delete(roleToDelete.id);
      setRoles(prev => prev.filter(role => role.id !== roleToDelete.id));
      setRoleToDelete(null);
      setIsDeleteDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Role deleted successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete role",
        variant: "destructive"
      });
    }
  };

  const openDeleteDialog = (role: ExtendedUserRole) => {
    setRoleToDelete(role);
    setIsDeleteDialogOpen(true);
  };

  const handlePermissionToggle = (roleId: number, permissionId: string) => {
    setRoles(prev => prev.map(role => {
      if (role.id !== roleId) return role;
      
      const currentPermissions = role.permissions || [];
      const hasPermission = currentPermissions.includes(permissionId);
      
      const newPermissions = hasPermission
        ? currentPermissions.filter(p => p !== permissionId)
        : [...currentPermissions, permissionId];
      
      return {
        ...role,
        permissions: newPermissions
      };
    }));

    // Update selectedRole if it's the one being modified
    if (selectedRole?.id === roleId) {
      setSelectedRole(prev => {
        if (!prev) return null;
        
        const currentPermissions = prev.permissions || [];
        const hasPermission = currentPermissions.includes(permissionId);
        
        const newPermissions = hasPermission
          ? currentPermissions.filter(p => p !== permissionId)
          : [...currentPermissions, permissionId];
        
        return {
          ...prev,
          permissions: newPermissions
        };
      });
    }
  };

  const handleSavePermissions = async () => {
    if (!selectedRole) return;
    await handleUpdateRole();
  };

  // Group permissions by category
  const groupedPermissions = allPermissions.reduce((acc, perm) => {
    if (!acc[perm.category]) acc[perm.category] = [];
    acc[perm.category].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  if (isLoading) {
    return (
      <DashboardLayout 
        title="User Roles" 
        subtitle="Configure role-based access and permissions"
      >
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="User Roles" 
      subtitle="Configure role-based access and permissions"
    >
      {/* Header with Add Role Button */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">User Roles</h2>
          <p className="text-muted-foreground">Manage roles and permissions for your clinic</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Role
        </Button>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {roles.map((role) => {
          const Icon = role.icon;
          return (
            <Card 
              key={role.id} 
              className="cursor-pointer hover:shadow-dental transition-all hover:-translate-y-1"
              onClick={() => {
                setSelectedRole(role);
                setIsEditDialogOpen(true);
              }}
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
                    {(role.permissions || []).length} / {allPermissions.length} permissions
                  </span>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRole(role);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteDialog(role);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
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
                  <React.Fragment key={category}>
                    <tr className="bg-muted/50">
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
                            {(role.permissions || []).includes(perm.id) ? (
                              <Check className="w-5 h-5 mx-auto text-success" />
                            ) : (
                              <X className="w-5 h-5 mx-auto text-muted-foreground/30" />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create Role Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Role</DialogTitle>
            <DialogDescription>
              Add a new role with custom permissions
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="role-name">Role Name</Label>
              <Input
                id="role-name"
                value={newRole.name}
                onChange={(e) => setNewRole(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter role name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role-description">Description</Label>
              <Textarea
                id="role-description"
                value={newRole.description}
                onChange={(e) => setNewRole(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter role description"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateRole}
              disabled={!newRole.name.trim()}
            >
              Create Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Role Permissions Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={() => {
        setIsEditDialogOpen(false);
        setSelectedRole(null);
      }}>
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
                const enabledCount = permissions.filter(p => (selectedRole.permissions || []).includes(p.id)).length;
                
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
                            (selectedRole.permissions || []).includes(perm.id) 
                              ? 'bg-success/5 border-success/30' 
                              : 'bg-muted/30'
                          }`}
                        >
                          <div>
                            <p className="font-medium text-sm">{perm.name}</p>
                            <p className="text-xs text-muted-foreground">{perm.description}</p>
                          </div>
                          <Switch
                            checked={(selectedRole.permissions || []).includes(perm.id)}
                            onCheckedChange={() => handlePermissionToggle(selectedRole.id, perm.id)}
                            // disabled={selectedRole.name === 'Admin'}
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
            <Button variant="outline" onClick={() => {
              setIsEditDialogOpen(false);
              setSelectedRole(null);
            }}>
              Cancel
            </Button>
            <Button 
              variant="dental" 
              onClick={handleSavePermissions}
              // disabled={selectedRole?.name === 'Admin'}
            >
              Save Permissions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-destructive" />
              </div>
              <span>Delete Role</span>
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this role? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {roleToDelete && (
            <div className="py-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${roleToDelete.color}20` }}
                >
                  <roleToDelete.icon className="w-5 h-5" style={{ color: roleToDelete.color }} />
                </div>
                <div>
                  <p className="font-semibold">{roleToDelete.name}</p>
                  <p className="text-sm text-muted-foreground">{roleToDelete.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {roleToDelete.userCount} users • {roleToDelete.permissions.length} permissions
                  </p>
                </div>
              </div>
              
              {roleToDelete.userCount > 0 && (
                <div className="mt-3 p-3 rounded-lg bg-warning/10 border border-warning/20">
                  <p className="text-sm text-warning-foreground">
                    <strong>Warning:</strong> This role is currently assigned to {roleToDelete.userCount} user{roleToDelete.userCount !== 1 ? 's' : ''}. 
                    Deleting this role may affect their access permissions.
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setRoleToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteRole}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default UserRolesPage;
