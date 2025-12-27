import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Building2, MapPin, Phone, Mail, Edit, Trash2 } from "lucide-react";
import { mockBranches } from "@/data/mockData";
import { Branch } from "@/types/clinic";
import { toast } from "@/hooks/use-toast";

const BranchSettingsPage = () => {
  const [branches, setBranches] = useState<Branch[]>(mockBranches);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  const handleToggleStatus = (id: string) => {
    setBranches(prev => prev.map(b => 
      b.id === id ? { ...b, isActive: !b.isActive } : b
    ));
    toast({ title: "Branch status updated" });
  };

  const handleDelete = (id: string) => {
    setBranches(prev => prev.filter(b => b.id !== id));
    toast({ title: "Branch deleted", variant: "destructive" });
  };

  return (
    <DashboardLayout 
      title="Branch Settings" 
      subtitle="Manage your clinic locations"
      actions={
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
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
                <Input placeholder="Downtown Branch" />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input placeholder="123 Main Street" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input placeholder="+1 (555) 000-0000" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input placeholder="branch@clinic.com" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
              <Button variant="dental" onClick={() => {
                setIsCreateOpen(false);
                toast({ title: "Branch created successfully" });
              }}>Create Branch</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches.map((branch) => (
          <Card key={branch.id} className={`relative overflow-hidden ${!branch.isActive ? 'opacity-60' : ''}`}>
            <div className={`h-2 ${branch.isActive ? 'bg-gradient-to-r from-primary to-dental-medium' : 'bg-muted'}`} />
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{branch.name}</CardTitle>
                  </div>
                </div>
                <Switch 
                  checked={branch.isActive} 
                  onCheckedChange={() => handleToggleStatus(branch.id)}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{branch.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>{branch.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>{branch.email}</span>
              </div>
              <div className="flex gap-2 pt-3 border-t">
                <Button variant="ghost" size="sm" className="flex-1" onClick={() => setEditingBranch(branch)}>
                  <Edit className="w-4 h-4 mr-1" /> Edit
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDelete(branch.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingBranch} onOpenChange={() => setEditingBranch(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Branch</DialogTitle>
            <DialogDescription>Update branch information</DialogDescription>
          </DialogHeader>
          {editingBranch && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Branch Name</Label>
                <Input defaultValue={editingBranch.name} />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input defaultValue={editingBranch.address} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input defaultValue={editingBranch.phone} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input defaultValue={editingBranch.email} />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingBranch(null)}>Cancel</Button>
            <Button variant="dental" onClick={() => {
              setEditingBranch(null);
              toast({ title: "Branch updated successfully" });
            }}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default BranchSettingsPage;
