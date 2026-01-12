import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Plus, Building2, MapPin, Phone, Edit, Trash2, Loader2, AlertTriangle } from "lucide-react";
import { branchService, BranchSettingDTO, AddBranchSettingDTO, UpdateBranchSettingDTO } from "@/lib/api/branches";
import { toast } from "@/hooks/use-toast";

const BranchSettingsPage = () => {
  const [branches, setBranches] = useState<BranchSettingDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<BranchSettingDTO | null>(null);
  const [deletingBranch, setDeletingBranch] = useState<BranchSettingDTO | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phoneNumber: "",
    subCity: "",
    city: "",
    location: "",
  });

  useEffect(() => {
    loadBranches();
  }, []);

  const loadBranches = async () => {
    try {
      setLoading(true);
      const data = await branchService.getAll();
      setBranches(data);
    } catch (error) {
      console.error("Error loading branches:", error);
      toast({
        title: "Error",
        description: "Failed to load branches",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const dto: AddBranchSettingDTO = {
        name: formData.name,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        subCity: formData.subCity,
        city: formData.city,
        location: formData.location,
      };
      
      await branchService.create(dto);
      await loadBranches();
      setIsCreateOpen(false);
      resetForm();
      toast({ title: "Branch created successfully" });
    } catch (error) {
      console.error("Error creating branch:", error);
      toast({
        title: "Error",
        description: "Failed to create branch",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async () => {
    if (!editingBranch) return;
    
    try {
      const dto: UpdateBranchSettingDTO = {
        id: editingBranch.id,
        name: formData.name,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        subCity: formData.subCity,
        city: formData.city,
        location: formData.location,
      };
      
      await branchService.update(dto);
      await loadBranches();
      setEditingBranch(null);
      resetForm();
      toast({ title: "Branch updated successfully" });
    } catch (error) {
      console.error("Error updating branch:", error);
      toast({
        title: "Error",
        description: "Failed to update branch",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await branchService.delete(id);
      await loadBranches();
      setDeletingBranch(null);
      toast({ title: "Branch deleted", variant: "destructive" });
    } catch (error) {
      console.error("Error deleting branch:", error);
      toast({
        title: "Error",
        description: "Failed to delete branch",
        variant: "destructive",
      });
    }
  };

  const confirmDelete = (branch: BranchSettingDTO) => {
    setDeletingBranch(branch);
  };

  const openEditDialog = (branch: BranchSettingDTO) => {
    setEditingBranch(branch);
    setFormData({
      name: branch.name,
      address: branch.address,
      phoneNumber: branch.phoneNumber,
      subCity: branch.subCity,
      city: branch.city,
      location: branch.location,
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      phoneNumber: "",
      subCity: "",
      city: "",
      location: "",
    });
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <DashboardLayout title="Branch Settings" subtitle="Manage your clinic locations">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="Branch Settings" 
      subtitle="Manage your clinic locations"
      actions={
        <Dialog open={isCreateOpen} onOpenChange={(open) => {
          setIsCreateOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button variant="dental"><Plus className="w-4 h-4" /> Add Branch</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Branch</DialogTitle>
              <DialogDescription>Create a new clinic location</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Branch Name</Label>
                <Input 
                  placeholder="Downtown Branch" 
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input 
                  placeholder="123 Main Street" 
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input 
                    placeholder="+1 (555) 000-0000" 
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sub City</Label>
                  <Input 
                    placeholder="Downtown" 
                    value={formData.subCity}
                    onChange={(e) => handleInputChange("subCity", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input 
                    placeholder="New York" 
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input 
                    placeholder="Building A, Floor 2" 
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
              <Button variant="dental" onClick={handleCreate}>Create Branch</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches.map((branch) => (
          <Card key={branch.id} className="relative overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-primary to-dental-medium" />
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{branch.name}</CardTitle>
                    {branch.city && (
                      <p className="text-sm text-muted-foreground">{branch.city}</p>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{branch.address}</span>
              </div>
              {branch.phoneNumber && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{branch.phoneNumber}</span>
                </div>
              )}
              {branch.subCity && (
                <div className="text-sm text-muted-foreground">
                  <strong>Sub City:</strong> {branch.subCity}
                </div>
              )}
              {branch.location && (
                <div className="text-sm text-muted-foreground">
                  <strong>Location:</strong> {branch.location}
                </div>
              )}
              <div className="flex gap-2 pt-3 border-t">
                <Button variant="ghost" size="sm" className="flex-1" onClick={() => openEditDialog(branch)}>
                  <Edit className="w-4 h-4 mr-1" /> Edit
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-destructive hover:text-destructive"
                  onClick={() => confirmDelete(branch)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingBranch} onOpenChange={(open) => {
        if (!open) {
          setEditingBranch(null);
          resetForm();
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Branch</DialogTitle>
            <DialogDescription>Update branch information</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Branch Name</Label>
              <Input 
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input 
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input 
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Sub City</Label>
                <Input 
                  value={formData.subCity}
                  onChange={(e) => handleInputChange("subCity", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>City</Label>
                <Input 
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input 
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingBranch(null)}>Cancel</Button>
            <Button variant="dental" onClick={handleUpdate}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingBranch} onOpenChange={() => setDeletingBranch(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Delete Branch
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deletingBranch?.name}</strong>? 
              This action cannot be undone and will permanently remove this branch from your system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingBranch(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deletingBranch && handleDelete(deletingBranch.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Branch
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default BranchSettingsPage;