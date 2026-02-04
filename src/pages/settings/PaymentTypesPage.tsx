// app/payment-types/page.tsx or components/payment-types/PaymentTypesPage.tsx
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Plus, CreditCard, Edit, Trash2, Loader2, DollarSign, Wallet, Banknote } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { paymentTypeService, AddPaymentTypeDTO, UpdatePaymentTypeDTO, PaymentType } from "@/lib/api/PaymentTypes";

const PaymentTypesPage = () => {
  const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingType, setEditingType] = useState<PaymentType | null>(null);
  const [deletingType, setDeletingType] = useState<PaymentType | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [createForm, setCreateForm] = useState<AddPaymentTypeDTO>({
    name: "",
    description: ""
  });

  const [editForm, setEditForm] = useState<UpdatePaymentTypeDTO>({
    id: 0,
    name: "",
    description: ""
  });

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await paymentTypeService.getAll();
      setPaymentTypes(data);
    } catch (error) {
      console.error("Failed to load payment types:", error);
      toast({
        title: "Error",
        description: "Failed to load payment types. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!createForm.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Payment type name is required.",
        variant: "destructive"
      });
      return;
    }

    // Check for duplicate names
    const duplicateName = paymentTypes.some(type =>
      type.name.toLowerCase() === createForm.name.toLowerCase()
    );
    if (duplicateName) {
      toast({
        title: "Validation Error",
        description: "A payment type with this name already exists. Please choose a different name.",
        variant: "destructive"
      });
      return;
    }

    try {
      setSubmitting(true);
      await paymentTypeService.create(createForm);

      toast({ title: "Success", description: "Payment type created successfully." });
      setIsCreateOpen(false);
      setCreateForm({ name: "", description: "" });
      loadData();
    } catch (error: any) {
      console.error("Failed to create payment type:", error);

      // Handle specific backend errors
      let errorMessage = "Failed to create payment type. Please try again.";
      if (error?.response?.data?.message?.includes("already exists")) {
        errorMessage = "A payment type with this name already exists. Please choose a different name.";
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!editForm.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Payment type name is required.",
        variant: "destructive"
      });
      return;
    }

    // Check for duplicate names (excluding current payment type)
    const duplicateName = paymentTypes.some(type =>
      type.id !== editForm.id &&
      type.name.toLowerCase() === editForm.name.toLowerCase()
    );
    if (duplicateName) {
      toast({
        title: "Validation Error",
        description: "A payment type with this name already exists. Please choose a different name.",
        variant: "destructive"
      });
      return;
    }

    try {
      setSubmitting(true);
      
      // This will now call PUT /api/PaymentType with the ID in the body
      await paymentTypeService.update(editForm);

      toast({ title: "Success", description: "Payment type updated successfully." });
      setEditingType(null);
      loadData();
    } catch (error: any) {
      console.error("Failed to update payment type:", error);

      // Handle specific error cases
      let errorMessage = "Failed to update payment type. Please try again.";
      if (error?.response?.data?.message?.includes("already exists")) {
        errorMessage = "A payment type with this name already exists. Please choose a different name.";
      } else if (error?.response?.status === 404) {
        errorMessage = "Payment type not found. It may have been deleted by another user.";
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingType) return;

    try {
      await paymentTypeService.delete(deletingType.id);
      toast({ title: "Success", description: "Payment type deleted successfully." });
      setDeletingType(null);
      loadData();
    } catch (error: any) {
      console.error("Failed to delete payment type:", error);
      
      let errorMessage = "Failed to delete payment type. Please try again.";
      if (error?.response?.status === 409) {
        errorMessage = "Cannot delete payment type because it is being used by existing payments.";
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const openEditDialog = (paymentType: PaymentType) => {
    setEditForm({
      id: paymentType.id,
      name: paymentType.name,
      description: paymentType.description || "",
    });
    setEditingType(paymentType);
  };

  const getPaymentTypeIcon = (paymentType: PaymentType) => {
    const name = paymentType.name.toLowerCase();
    if (name.includes('cash')) return <Banknote className="w-6 h-6 text-primary" />;
    if (name.includes('bank') || name.includes('transfer')) return <CreditCard className="w-6 h-6 text-primary" />;
    if (name.includes('insurance')) return <DollarSign className="w-6 h-6 text-primary" />;
    return <Wallet className="w-6 h-6 text-primary" />;
  };

  if (loading) {
    return (
      <DashboardLayout title="Payment Types" subtitle="Manage payment methods">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Payment Types"
      subtitle="Manage different payment methods (Cash, Bank Transfer, Insurance, etc.)"
      actions={
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button variant="dental"><Plus className="w-4 h-4 mr-2" /> Add Payment Type</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Payment Type</DialogTitle>
              <DialogDescription>Add a new payment method type</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Cash, Bank Transfer, Insurance"
                  value={createForm.name}
                  onChange={(e) => setCreateForm(prev => ({
                    ...prev,
                    name: e.target.value
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Optional description of the payment type"
                  rows={3}
                  value={createForm.description}
                  onChange={(e) => setCreateForm(prev => ({
                    ...prev,
                    description: e.target.value
                  }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateOpen(false);
                  setCreateForm({ name: "", description: "" });
                }}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                variant="dental"
                onClick={handleCreate}
                disabled={submitting}
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      {paymentTypes.length === 0 ? (
        <div className="text-center py-12">
          <Wallet className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No payment types found</h3>
          <p className="text-muted-foreground mb-4">Get started by creating your first payment type.</p>
          <Button variant="dental" onClick={() => setIsCreateOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add Payment Type
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paymentTypes.map((paymentType) => (
            <Card key={paymentType.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-2 bg-gradient-to-r from-primary to-primary/60" />
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      {getPaymentTypeIcon(paymentType)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{paymentType.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {paymentType.description || "No description"}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 pt-3 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1"
                    onClick={() => openEditDialog(paymentType)}
                  >
                    <Edit className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setDeletingType(paymentType)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingType} onOpenChange={() => setEditingType(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Payment Type</DialogTitle>
            <DialogDescription>Update payment type details</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({
                  ...prev,
                  name: e.target.value
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editForm.description}
                onChange={(e) => setEditForm(prev => ({
                  ...prev,
                  description: e.target.value
                }))}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingType(null)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              variant="dental"
              onClick={handleEdit}
              disabled={submitting}
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingType} onOpenChange={() => setDeletingType(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the payment type "{deletingType?.name}".
              {deletingType && (
                <>
                  <br />
                  <span className="text-destructive font-medium">
                    This action cannot be undone.
                  </span>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default PaymentTypesPage;