import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Search, User, Mail, Shield, Edit, Trash2, Eye, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { usersService, User as ApiUser } from "@/lib/api/users";
import { userRolesService, UserRole } from "@/lib/api/userRoles";

interface SystemUser {
  id: number;
  username: string;
  fName: string;
  mName?: string;
  lName: string;
  email: string;
  roleName: string;
  phoneNumber?: string;
  userRoleId: number;
  status?: 'active' | 'inactive';
  createdAt?: string;
  lastLogin?: string;
}


const getRoleColor = (roleName: string): string => {
  const roleColorMap: Record<string, string> = {
    'Super Admin': 'bg-destructive/10 text-destructive',
    'Admin': 'bg-destructive/10 text-destructive',
    'Doctor': 'bg-primary/10 text-primary',
    'Receptionist': 'bg-warning/10 text-warning',
    'Patient': 'bg-success/10 text-success',
  };
  
  return roleColorMap[roleName] || 'bg-muted/10 text-muted-foreground';
};

const UsersPage = () => {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [createUserData, setCreateUserData] = useState({
    username: '',
    fName: '',
    mName: '',
    lName: '',
    email: '',
    phoneNumber: '',
    password: '',
    userRoleId: undefined as number | undefined
  });

  // Fetch users and roles from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch users first (this is the main requirement)
        const apiUsers = await usersService.getAll();
        
        // Try to fetch roles, but don't fail if unauthorized
        let roles: UserRole[] = [];
        try {
          roles = await userRolesService.getAll();
        } catch (roleError) {
          console.warn('Could not fetch user roles (may not have permission):', roleError);
          // Create basic roles from existing user data
          const uniqueRoles = [...new Set(apiUsers.map(user => user.roleName).filter(Boolean))];
          roles = uniqueRoles.map((roleName, index) => ({
            id: index + 1,
            name: roleName,
            description: roleName
          }));
        }
        
        // Transform API users to match our SystemUser interface
        const transformedUsers: SystemUser[] = apiUsers.map(user => ({
          id: user.id,
          username: user.username || 'N/A',
          fName: user.fName || 'Unknown',
          mName: user.mName,
          lName: user.lName || 'User',
          email: user.email || 'No email',
          roleName: user.roleName || 'Unknown Role',
          phoneNumber: user.phoneNumber,
          userRoleId: user.userRoleId || 0,
          status: 'active', // Default status since backend doesn't provide this
          createdAt: new Date().toISOString().split('T')[0], // Default date
          lastLogin: undefined // Backend doesn't provide this
        }));
        
        setUsers(transformedUsers);
        setUserRoles(roles);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        toast({
          title: "Error",
          description: "Failed to load users. Please check your permissions.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateUser = async () => {
    try {
      if (!createUserData.username || !createUserData.fName || !createUserData.lName || 
          !createUserData.email || !createUserData.password) {
        toast({
          title: "Error",
          description: "Please fill in all required fields.",
          variant: "destructive"
        });
        return;
      }

      // If we don't have userRoleId but have roles available, try to find the role ID
      if (!createUserData.userRoleId && userRoles.length > 0) {
        toast({
          title: "Error",
          description: "Please select a role.",
          variant: "destructive"
        });
        return;
      }

      await usersService.create(createUserData);
      
      // Refresh users list
      const apiUsers = await usersService.getAll();
      const transformedUsers: SystemUser[] = apiUsers.map(user => ({
        id: user.id,
        username: user.username,
        fName: user.fName,
        mName: user.mName,
        lName: user.lName,
        email: user.email,
        roleName: user.roleName,
        phoneNumber: user.phoneNumber,
        userRoleId: user.userRoleId,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: undefined
      }));
      setUsers(transformedUsers);
      
      setIsCreateOpen(false);
      setCreateUserData({
        username: '',
        fName: '',
        mName: '',
        lName: '',
        email: '',
        phoneNumber: '',
        password: '',
        userRoleId: undefined
      });
      
      toast({ 
        title: "User created", 
        description: "User has been created successfully." 
      });
    } catch (error) {
      console.error('Failed to create user:', error);
      toast({
        title: "Error",
        description: "Failed to create user. You may not have permission to create users.",
        variant: "destructive"
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const fullName = `${user.fName} ${user.lName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.roleName === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <DashboardLayout 
      title="Users" 
      subtitle="Manage system users and their access"
      actions={
        userRoles.length > 0 ? (
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button variant="dental"><Plus className="w-4 h-4" /> Add User</Button>
            </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>Add a new system user</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Username *</Label>
                <Input 
                  placeholder="johndoe" 
                  value={createUserData.username}
                  onChange={(e) => setCreateUserData(prev => ({ ...prev, username: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name *</Label>
                  <Input 
                    placeholder="John" 
                    value={createUserData.fName}
                    onChange={(e) => setCreateUserData(prev => ({ ...prev, fName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Last Name *</Label>
                  <Input 
                    placeholder="Doe" 
                    value={createUserData.lName}
                    onChange={(e) => setCreateUserData(prev => ({ ...prev, lName: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Middle Name</Label>
                <Input 
                  placeholder="Middle name (optional)" 
                  value={createUserData.mName}
                  onChange={(e) => setCreateUserData(prev => ({ ...prev, mName: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input 
                  type="email" 
                  placeholder="john@clinic.com" 
                  value={createUserData.email}
                  onChange={(e) => setCreateUserData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input 
                  placeholder="+1234567890" 
                  value={createUserData.phoneNumber}
                  onChange={(e) => setCreateUserData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Role *</Label>
                <Select 
                  value={createUserData.userRoleId?.toString() || ""} 
                  onValueChange={(value) => setCreateUserData(prev => ({ ...prev, userRoleId: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {userRoles.map((role) => (
                      <SelectItem key={role.id} value={role.id.toString()}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Temporary Password *</Label>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={createUserData.password}
                  onChange={(e) => setCreateUserData(prev => ({ ...prev, password: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
              <Button variant="dental" onClick={handleCreateUser}>Create User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        ) : undefined
      }
    >
      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {userRoles.map((role) => (
                  <SelectItem key={role.id} value={role.name}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span>Loading users...</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No users found</p>
              <p className="text-sm mt-2">
                {users.length === 0 ? 'No users available in the system' : 'No users match your search criteria'}
              </p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-medium">{user.fName} {user.lName}</span>
                      </div>
                    </td>
                    <td>
                      <span className="text-sm text-muted-foreground">{user.username}</span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        {user.email}
                      </div>
                    </td>
                    <td>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getRoleColor(user.roleName)}`}>
                        <Shield className="w-3 h-3" />
                        {user.roleName}
                      </span>
                    </td>
                    <td>
                      <span className="text-sm text-muted-foreground">
                        {user.phoneNumber || 'N/A'}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon-sm" onClick={() => setSelectedUser(user)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon-sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>View user information</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{selectedUser.fName} {selectedUser.lName}</h3>
                  <p className="text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg border">
                  <p className="text-sm text-muted-foreground">Username</p>
                  <p className="font-medium">{selectedUser.username}</p>
                </div>
                <div className="p-3 rounded-lg border">
                  <p className="text-sm text-muted-foreground">Role</p>
                  <p className="font-medium">{selectedUser.roleName}</p>
                </div>
                <div className="p-3 rounded-lg border">
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedUser.phoneNumber || 'N/A'}</p>
                </div>
                <div className="p-3 rounded-lg border">
                  <p className="text-sm text-muted-foreground">User ID</p>
                  <p className="font-medium">{selectedUser.id}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedUser(null)}>Close</Button>
            <Button variant="dental">Edit User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default UsersPage;
