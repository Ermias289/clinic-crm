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
import { Plus, CreditCard, Edit, Trash2, Loader2, DollarSign, Calendar } from "lucide-react";
import { CardType } from "@/types/clinic";
import { toast } from "@/hooks/use-toast";
import { cardTypeService, AddCardTypeDTO, UpdateCardTypeDTO } from "@/lib/api/cardTypes";
import { cardSettingService, AddCardSettingDTO, UpdateCardSettingDTO, CardSettingDTO } from "@/lib/api/cardSettings";

interface CardTypeWithSetting extends CardType {
  setting?: CardSettingDTO;
}

const CardTypesPage = () => {
  const [cardTypes, setCardTypes] = useState<CardTypeWithSetting[]>([]);
  const [cardSettings, setCardSettings] = useState<CardSettingDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingType, setEditingType] = useState<CardTypeWithSetting | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [createForm, setCreateForm] = useState<{
    cardType: AddCardTypeDTO;
    cardSetting: Omit<AddCardSettingDTO, 'cardTypeId'>;
  }>({
    cardType: { name: "", description: "" },
    cardSetting: { price: 0, expirationDuration: 365 }
  });

  const [editForm, setEditForm] = useState<{
    cardType: UpdateCardTypeDTO;
    cardSetting: Omit<UpdateCardSettingDTO, 'cardTypeId'> & { id?: number };
  }>({
    cardType: { id: 0, name: "", description: "" },
    cardSetting: { id: 0, price: 0, expirationDuration: 365 }
  });

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [typesData, settingsData] = await Promise.all([
        cardTypeService.getAll(),
        cardSettingService.getAll()
      ]);
      
      setCardSettings(settingsData);
      
      // Merge card types with their settings
      const typesWithSettings: CardTypeWithSetting[] = typesData.map(type => ({
        ...type,
        setting: settingsData.find(setting => setting.cardTypeId === type.id)
      }));
      
      setCardTypes(typesWithSettings);
    } catch (error) {
      console.error("Failed to load data:", error);
      toast({ 
        title: "Error", 
        description: "Failed to load card types. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!createForm.cardType.name.trim()) {
      toast({ 
        title: "Validation Error", 
        description: "Card type name is required.",
        variant: "destructive"
      });
      return;
    }

    if (createForm.cardSetting.price <= 0) {
      toast({ 
        title: "Validation Error", 
        description: "Price must be greater than 0.",
        variant: "destructive"
      });
      return;
    }

    // Check for duplicate names
    const duplicateName = cardTypes.some(type => 
      type.name.toLowerCase() === createForm.cardType.name.toLowerCase()
    );
    if (duplicateName) {
      toast({ 
        title: "Validation Error", 
        description: "A card type with this name already exists. Please choose a different name.",
        variant: "destructive"
      });
      return;
    }

    try {
      setSubmitting(true);
      
      // First create the card type
      const newCardType = await cardTypeService.create(createForm.cardType);
      
      // Then create the card setting
      const cardSettingData: AddCardSettingDTO = {
        ...createForm.cardSetting,
        cardTypeId: newCardType.id
      };
      await cardSettingService.create(cardSettingData);
      
      toast({ title: "Success", description: "Card type created successfully." });
      setIsCreateOpen(false);
      setCreateForm({
        cardType: { name: "", description: "" },
        cardSetting: { price: 0, expirationDuration: 365 }
      });
      loadData();
    } catch (error: any) {
      console.error("Failed to create card type:", error);
      
      // Handle specific backend errors
      let errorMessage = "Failed to create card type. Please try again.";
      if (error?.response?.data?.message === "Type Already Exists.") {
        errorMessage = "A card type with this name already exists. Please choose a different name.";
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
    if (!editForm.cardType.name.trim()) {
      toast({ 
        title: "Validation Error", 
        description: "Card type name is required.",
        variant: "destructive"
      });
      return;
    }

    if (editForm.cardSetting.price <= 0) {
      toast({ 
        title: "Validation Error", 
        description: "Price must be greater than 0.",
        variant: "destructive"
      });
      return;
    }

    // Check for duplicate names (excluding current card type)
    const duplicateName = cardTypes.some(type => 
      type.id !== editForm.cardType.id && 
      type.name.toLowerCase() === editForm.cardType.name.toLowerCase()
    );
    if (duplicateName) {
      toast({ 
        title: "Validation Error", 
        description: "A card type with this name already exists. Please choose a different name.",
        variant: "destructive"
      });
      return;
    }

    try {
      setSubmitting(true);
      
      // Check if the card type name or description has changed
      const originalCardType = editingType;
      const hasCardTypeChanged = originalCardType && (
        originalCardType.name !== editForm.cardType.name ||
        originalCardType.description !== editForm.cardType.description
      );
      
      // Only update the card type if something has changed
      if (hasCardTypeChanged) {
        await cardTypeService.update(editForm.cardType);
      }
      
      // Update or create the card setting
      if (editForm.cardSetting.id) {
        const updateData: UpdateCardSettingDTO = {
          id: editForm.cardSetting.id,
          price: editForm.cardSetting.price,
          expirationDuration: editForm.cardSetting.expirationDuration,
          cardTypeId: editForm.cardType.id
        };
        await cardSettingService.update(updateData);
      } else {
        const createData: AddCardSettingDTO = {
          price: editForm.cardSetting.price,
          expirationDuration: editForm.cardSetting.expirationDuration,
          cardTypeId: editForm.cardType.id
        };
        await cardSettingService.create(createData);
      }
      
      toast({ title: "Success", description: "Card type updated successfully." });
      setEditingType(null);
      loadData();
    } catch (error: any) {
      console.error("Failed to update card type:", error);
      
      // Handle specific error cases
      let errorMessage = "Failed to update card type. Please try again.";
      if (error?.response?.data?.message === "Type Already Exists.") {
        errorMessage = "A card type with this name already exists. Please choose a different name.";
      } else if (error?.response?.status === 404) {
        errorMessage = "Card type not found. It may have been deleted by another user.";
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

  const handleDelete = async (cardType: CardTypeWithSetting) => {
    if (!confirm(`Are you sure you want to delete "${cardType.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      // Delete card setting first if it exists
      if (cardType.setting) {
        await cardSettingService.delete(cardType.setting.id);
      }
      
      // Then delete the card type
      await cardTypeService.delete(cardType.id);
      
      toast({ title: "Success", description: "Card type deleted successfully." });
      loadData();
    } catch (error) {
      console.error("Failed to delete card type:", error);
      toast({ 
        title: "Error", 
        description: "Failed to delete card type. Please try again.",
        variant: "destructive"
      });
    }
  };

  const openEditDialog = (cardType: CardTypeWithSetting) => {
    setEditForm({
      cardType: {
        id: cardType.id,
        name: cardType.name,
        description: cardType.description,
      },
      cardSetting: {
        id: cardType.setting?.id,
        price: cardType.setting?.price || 0,
        expirationDuration: cardType.setting?.expirationDuration || 365,
      }
    });
    setEditingType(cardType);
  };

  if (loading) {
    return (
      <DashboardLayout title="Card Types" subtitle="Configure membership tiers and benefits">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="Card Types" 
      subtitle="Configure membership tiers and benefits"
      actions={
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button variant="dental"><Plus className="w-4 h-4" /> Add Card Type</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Card Type</DialogTitle>
              <DialogDescription>Define a new membership tier with pricing</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input 
                  placeholder="Gold Plan" 
                  value={createForm.cardType.name}
                  onChange={(e) => setCreateForm(prev => ({ 
                    ...prev, 
                    cardType: { ...prev.cardType, name: e.target.value }
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  placeholder="Plan description..." 
                  rows={3}
                  value={createForm.cardType.description}
                  onChange={(e) => setCreateForm(prev => ({ 
                    ...prev, 
                    cardType: { ...prev.cardType, description: e.target.value }
                  }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price ($) *</Label>
                  <Input 
                    type="number" 
                    placeholder="199" 
                    min="0"
                    step="0.01"
                    value={createForm.cardSetting.price}
                    onChange={(e) => setCreateForm(prev => ({ 
                      ...prev, 
                      cardSetting: { ...prev.cardSetting, price: parseFloat(e.target.value) || 0 }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Duration (days)</Label>
                  <Input 
                    type="number" 
                    placeholder="365" 
                    min="1"
                    value={createForm.cardSetting.expirationDuration}
                    onChange={(e) => setCreateForm(prev => ({ 
                      ...prev, 
                      cardSetting: { ...prev.cardSetting, expirationDuration: parseInt(e.target.value) || 365 }
                    }))}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsCreateOpen(false);
                  setCreateForm({
                    cardType: { name: "", description: "" },
                    cardSetting: { price: 0, expirationDuration: 365 }
                  });
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
      {cardTypes.length === 0 ? (
        <div className="text-center py-12">
          <CreditCard className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No card types found</h3>
          <p className="text-muted-foreground mb-4">Get started by creating your first card type.</p>
          <Button variant="dental" onClick={() => setIsCreateOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add Card Type
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cardTypes.map((cardType) => (
            <Card key={cardType.id} className="relative overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-primary to-primary/60" />
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>{cardType.name}</CardTitle>
                      <CardDescription>{cardType.description || "No description provided"}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {cardType.setting && (
                  <>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Price</span>
                      </div>
                      <span className="text-xl font-bold">${cardType.setting.price}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Duration</span>
                      </div>
                      <span className="font-medium">{cardType.setting.expirationDuration} days</span>
                    </div>
                  </>
                )}
                
                {!cardType.setting && (
                  <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                    <p className="text-sm text-yellow-800">No pricing configured</p>
                  </div>
                )}

                <div className="flex gap-2 pt-3 border-t">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex-1" 
                    onClick={() => openEditDialog(cardType)}
                  >
                    <Edit className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(cardType)}
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Card Type</DialogTitle>
            <DialogDescription>Update card type details and pricing</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input 
                value={editForm.cardType.name}
                onChange={(e) => setEditForm(prev => ({ 
                  ...prev, 
                  cardType: { ...prev.cardType, name: e.target.value }
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea 
                value={editForm.cardType.description}
                onChange={(e) => setEditForm(prev => ({ 
                  ...prev, 
                  cardType: { ...prev.cardType, description: e.target.value }
                }))}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price ($) *</Label>
                <Input 
                  type="number" 
                  min="0"
                  step="0.01"
                  value={editForm.cardSetting.price}
                  onChange={(e) => setEditForm(prev => ({ 
                    ...prev, 
                    cardSetting: { ...prev.cardSetting, price: parseFloat(e.target.value) || 0 }
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Duration (days)</Label>
                <Input 
                  type="number" 
                  min="1"
                  value={editForm.cardSetting.expirationDuration}
                  onChange={(e) => setEditForm(prev => ({ 
                    ...prev, 
                    cardSetting: { ...prev.cardSetting, expirationDuration: parseInt(e.target.value) || 365 }
                  }))}
                />
              </div>
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
    </DashboardLayout>
  );
};

export default CardTypesPage;
