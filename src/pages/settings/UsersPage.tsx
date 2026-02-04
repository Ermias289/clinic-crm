import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Search, User, Shield, Edit, Trash2, Eye, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { usersService } from "@/lib/api/users";
import { userRolesService, UserRole } from "@/lib/api/userRoles";

interface SystemUser {
  id: number;
  username: string;
  fName: string;
  mName?: string;
  lName: string;
  email: string;
  phoneNumber?: string;
  userRoleId: number;
  roleName?: string;
}

const UsersPage = () => {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  
  // Create user dialog
  const [isCreateOpen, setIsCreateOpen] = useState(false);
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
  const [isCreating, setIsCreating] = useState(false);
  
  // Email confirmation dialog
  const [isConfirmEmailOpen, setIsConfirmEmailOpen] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  
  // View details dialog
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  
  // Edit user dialog
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const [editUserData, setEditUserData] = useState({
    id: 0,
    username: '',
    fName: '',
    mName: '',
    lName: '',
    email: '',
    phoneNumber: '',
    userRoleId: 0
  });
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Delete dialog
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<SystemUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch users and roles from API
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch users
      const apiUsers = await usersService.getAll();
      
      // Fetch roles
      let roles: UserRole[] = [];
      try {
        roles = await userRolesService.getAll();
      } catch (roleError) {
        console.warn('Could not fetch user roles:', roleError);
      }
      
      // Map userRoleId to roleName using the roles array
      const usersWithRoleNames = apiUsers.map(user => {
        const userRole = roles.find(role => role.id === user.userRoleId);
        return {
          ...user,
          roleName: userRole?.name || `Role ${user.userRoleId}`
        };
      });
      
      setUsers(usersWithRoleNames);
      setUserRoles(roles);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast({
        title: "Error",
        description: "Failed to load users.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      // Validation
      if (!createUserData.username || !createUserData.fName || !createUserData.lName || 
          !createUserData.email || !createUserData.password || !createUserData.userRoleId) {
        toast({
          title: "Error",
          description: "Please fill in all required fields.",
          variant: "destructive"
        });
        return;
      }

      setIsCreating(true);
      await usersService.create(createUserData);
      
      // Set pending email for OTP confirmation
      setPendingEmail(createUserData.email);
      
      // Reset form
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
      
      // Close create dialog and open OTP dialog
      setIsCreateOpen(false);
      setIsConfirmEmailOpen(true);
      
      toast({ 
        title: "User created successfully", 
        description: "Please confirm the email with the OTP sent to the user's email." 
      });
      
      // Refresh users list
      await fetchData();
      
    } catch (error: any) {
      console.error('Failed to create user:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create user.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleConfirmEmail = async () => {
    try {
      if (!otp || !pendingEmail) {
        toast({
          title: "Error",
          description: "Please enter the OTP.",
          variant: "destructive"
        });
        return;
      }

      setIsConfirming(true);
      await usersService.confirmAccount(pendingEmail, otp);
      
      toast({
        title: "Success",
        description: "Email confirmed successfully!",
      });
      
      setIsConfirmEmailOpen(false);
      setOtp("");
      setPendingEmail("");
      
    } catch (error: any) {
      console.error('Failed to confirm email:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Invalid or expired OTP.",
        variant: "destructive"
      });
    } finally {
      setIsConfirming(false);
    }
  };

  const handleEditUser = (user: SystemUser) => {
    setEditingUser(user);
    setEditUserData({
      id: user.id,
      username: user.username,
      fName: user.fName,
      mName: user.mName || '',
      lName: user.lName,
      email: user.email,
      phoneNumber: user.phoneNumber || '',
      userRoleId: user.userRoleId
    });
    setIsEditOpen(true);
  };

  const handleUpdateUser = async () => {
    try {
      if (!editUserData.username || !editUserData.fName || !editUserData.lName || 
          !editUserData.email || !editUserData.userRoleId) {
        toast({
          title: "Error",
          description: "Please fill in all required fields.",
          variant: "destructive"
        });
        return;
      }

      setIsUpdating(true);
      
      // Prepare update data according to API schema
      const updateData = {
        id: editUserData.id,
        username: editUserData.username,
        fName: editUserData.fName,
        mName: editUserData.mName || undefined,
        lName: editUserData.lName,
        email: editUserData.email,
        phoneNumber: editUserData.phoneNumber || undefined,
        userRoleId: editUserData.userRoleId
      };

      await usersService.update(editUserData.id, updateData);
      
      toast({
        title: "Success",
        description: "User updated successfully!",
      });
      
      setIsEditOpen(false);
      setEditingUser(null);
      
      // Refresh users list
      await fetchData();
      
    } catch (error: any) {
      console.error('Failed to update user:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update user.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      if (!userToDelete) return;
      
      setIsDeleting(true);
      await usersService.delete(userToDelete.id);
      
      toast({
        title: "User deleted",
        description: "User has been deleted successfully.",
      });
      
      setIsDeleteOpen(false);
      setUserToDelete(null);
      
      // Refresh users list
      await fetchData();
      
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const fullName = `${user.fName} ${user.lName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.username.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (roleFilter === "all") return matchesSearch;
    
    const userRole = userRoles.find(role => role.id === user.userRoleId);
    return matchesSearch && userRole?.name === roleFilter;
  });

  return (
    <DashboardLayout 
      title="Users" 
      subtitle="Manage system users and their access"
      actions={
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button variant="dental"><Plus className="w-4 h-4" /> Add User</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>Add a new system user</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username *</Label>
                <Input 
                  id="username"
                  placeholder="johndoe" 
                  value={createUserData.username}
                  onChange={(e) => setCreateUserData(prev => ({ ...prev, username: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fName">First Name *</Label>
                  <Input 
                    id="fName"
                    placeholder="John" 
                    value={createUserData.fName}
                    onChange={(e) => setCreateUserData(prev => ({ ...prev, fName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lName">Last Name *</Label>
                  <Input 
                    id="lName"
                    placeholder="Doe" 
                    value={createUserData.lName}
                    onChange={(e) => setCreateUserData(prev => ({ ...prev, lName: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mName">Middle Name</Label>
                <Input 
                  id="mName"
                  placeholder="Middle name (optional)" 
                  value={createUserData.mName}
                  onChange={(e) => setCreateUserData(prev => ({ ...prev, mName: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input 
                  id="email"
                  type="email" 
                  placeholder="john@clinic.com" 
                  value={createUserData.email}
                  onChange={(e) => setCreateUserData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input 
                  id="phoneNumber"
                  placeholder="+1234567890" 
                  value={createUserData.phoneNumber}
                  onChange={(e) => setCreateUserData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
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
                <Label htmlFor="password">Temporary Password *</Label>
                <Input 
                  id="password"
                  type="password" 
                  placeholder="••••••••" 
                  value={createUserData.password}
                  onChange={(e) => setCreateUserData(prev => ({ ...prev, password: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)} disabled={isCreating}>
                Cancel
              </Button>
              <Button variant="dental" onClick={handleCreateUser} disabled={isCreating}>
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Creating...
                  </>
                ) : "Create User"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">User</th>
                    <th className="text-left p-4">Username</th>
                    <th className="text-left p-4">Contact Info</th>
                    <th className="text-left p-4">Role</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => {
                    const userRole = userRoles.find(role => role.id === user.userRoleId);
                    const roleName = userRole?.name || `Role ${user.userRoleId}`;
                    
                    return (
                      <tr key={user.id} className="border-b hover:bg-muted/50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium">{user.fName} {user.lName}</div>
                              {user.mName && (
                                <div className="text-xs text-muted-foreground">{user.mName}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-muted-foreground">{user.username}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col">
                            {/* Email - more prominent */}
                            <div className="font-medium text-foreground">
                              {user.email}
                            </div>
                            {/* Phone - less prominent, smaller text */}
                            {user.phoneNumber ? (
                              <div className="text-sm text-muted-foreground mt-1">
                                {user.phoneNumber}
                              </div>
                            ) : (
                              <div className="text-sm text-muted-foreground italic mt-1">
                                No phone number
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            <Shield className="w-3 h-3" />
                            {roleName}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon-sm" 
                              onClick={() => setSelectedUser(user)}
                              title="View details"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon-sm"
                              title="Edit user"
                              onClick={() => handleEditUser(user)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon-sm" 
                              className="text-destructive hover:text-destructive"
                              title="Delete user"
                              onClick={() => {
                                setUserToDelete(user);
                                setIsDeleteOpen(true);
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
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
                  <p className="font-medium">
                    {userRoles.find(r => r.id === selectedUser.userRoleId)?.name || `Role ${selectedUser.userRoleId}`}
                  </p>
                </div>
                <div className="p-3 rounded-lg border">
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedUser.phoneNumber || 'N/A'}</p>
                </div>
                <div className="p-3 rounded-lg border">
                  <p className="text-sm text-muted-foreground">First Name</p>
                  <p className="font-medium">{selectedUser.fName}</p>
                </div>
                {selectedUser.mName && (
                  <div className="p-3 rounded-lg border">
                    <p className="text-sm text-muted-foreground">Middle Name</p>
                    <p className="font-medium">{selectedUser.mName}</p>
                  </div>
                )}
                <div className="p-3 rounded-lg border">
                  <p className="text-sm text-muted-foreground">Last Name</p>
                  <p className="font-medium">{selectedUser.lName}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedUser(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information</DialogDescription>
          </DialogHeader>
          
          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto pr-2">
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-username">Username *</Label>
                <Input 
                  id="edit-username"
                  placeholder="johndoe" 
                  value={editUserData.username}
                  onChange={(e) => setEditUserData(prev => ({ ...prev, username: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-fName">First Name *</Label>
                  <Input 
                    id="edit-fName"
                    placeholder="John" 
                    value={editUserData.fName}
                    onChange={(e) => setEditUserData(prev => ({ ...prev, fName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-lName">Last Name *</Label>
                  <Input 
                    id="edit-lName"
                    placeholder="Doe" 
                    value={editUserData.lName}
                    onChange={(e) => setEditUserData(prev => ({ ...prev, lName: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-mName">Middle Name</Label>
                <Input 
                  id="edit-mName"
                  placeholder="Middle name" 
                  value={editUserData.mName}
                  onChange={(e) => setEditUserData(prev => ({ ...prev, mName: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email *</Label>
                <Input 
                  id="edit-email"
                  type="email" 
                  placeholder="john@clinic.com" 
                  value={editUserData.email}
                  onChange={(e) => setEditUserData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phoneNumber">Phone Number</Label>
                <Input 
                  id="edit-phoneNumber"
                  placeholder="+1234567890" 
                  value={editUserData.phoneNumber}
                  onChange={(e) => setEditUserData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role *</Label>
                <Select 
                  value={editUserData.userRoleId.toString()} 
                  onValueChange={(value) => setEditUserData(prev => ({ ...prev, userRoleId: parseInt(value) }))}
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
            </div>
          </div>
          
          <DialogFooter className="mt-4 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsEditOpen(false)} disabled={isUpdating}>
              Cancel
            </Button>
            <Button variant="dental" onClick={handleUpdateUser} disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Updating...
                </>
              ) : "Update User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Email Confirmation Dialog */}
      <Dialog open={isConfirmEmailOpen} onOpenChange={setIsConfirmEmailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Email Address</DialogTitle>
            <DialogDescription>
              An OTP has been sent to {pendingEmail}. Please enter it below to confirm the email address.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Enter OTP *</Label>
              <Input 
                id="otp"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmEmailOpen(false)} disabled={isConfirming}>
              Skip for now
            </Button>
            <Button variant="dental" onClick={handleConfirmEmail} disabled={isConfirming || !otp}>
              {isConfirming ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Verifying...
                </>
              ) : "Confirm Email"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {userToDelete?.fName} {userToDelete?.lName} ({userToDelete?.username}).
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteUser}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : "Delete User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default UsersPage;