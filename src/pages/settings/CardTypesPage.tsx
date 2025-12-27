import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { Plus, CreditCard, Gift, Edit, Trash2, DollarSign, Calendar } from "lucide-react";
import { mockCardTypes } from "@/data/mockData";
import { CardType } from "@/types/clinic";
import { toast } from "@/hooks/use-toast";

const CardTypesPage = () => {
  const [cardTypes, setCardTypes] = useState<CardType[]>(mockCardTypes);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingType, setEditingType] = useState<CardType | null>(null);

  const handleToggleStatus = (id: string) => {
    setCardTypes(prev => prev.map(t => 
      t.id === id ? { ...t, isActive: !t.isActive } : t
    ));
    toast({ title: "Card type status updated" });
  };

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
              <DialogDescription>Define a new membership tier</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input placeholder="Gold Plan" />
                </div>
                <div className="space-y-2">
                  <Label>Color</Label>
                  <Input type="color" defaultValue="#14b8a6" className="h-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea placeholder="Plan description..." rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price ($)</Label>
                  <Input type="number" placeholder="199" />
                </div>
                <div className="space-y-2">
                  <Label>Duration (months)</Label>
                  <Input type="number" placeholder="12" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Benefits (one per line)</Label>
                <Textarea placeholder="Free checkups&#10;10% off treatments&#10;Priority booking" rows={4} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
              <Button variant="dental" onClick={() => {
                setIsCreateOpen(false);
                toast({ title: "Card type created" });
              }}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cardTypes.map((cardType) => (
          <Card key={cardType.id} className={`relative overflow-hidden ${!cardType.isActive ? 'opacity-60' : ''}`}>
            <div className="h-2" style={{ backgroundColor: cardType.color }} />
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${cardType.color}20` }}
                  >
                    <CreditCard className="w-6 h-6" style={{ color: cardType.color }} />
                  </div>
                  <div>
                    <CardTitle>{cardType.name}</CardTitle>
                    <CardDescription>{cardType.description}</CardDescription>
                  </div>
                </div>
                <Switch 
                  checked={cardType.isActive} 
                  onCheckedChange={() => handleToggleStatus(cardType.id)}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Price</span>
                </div>
                <span className="text-xl font-bold">${cardType.price}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Duration</span>
                </div>
                <span className="font-medium">{cardType.duration} months</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Gift className="w-4 h-4 text-primary" />
                  Benefits
                </div>
                <ul className="space-y-1">
                  {cardType.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-success shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2 pt-3 border-t">
                <Button variant="ghost" size="sm" className="flex-1" onClick={() => setEditingType(cardType)}>
                  <Edit className="w-4 h-4 mr-1" /> Edit
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingType} onOpenChange={() => setEditingType(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Card Type</DialogTitle>
            <DialogDescription>Update card type details</DialogDescription>
          </DialogHeader>
          {editingType && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input defaultValue={editingType.name} />
                </div>
                <div className="space-y-2">
                  <Label>Color</Label>
                  <Input type="color" defaultValue={editingType.color} className="h-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea defaultValue={editingType.description} rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price ($)</Label>
                  <Input type="number" defaultValue={editingType.price} />
                </div>
                <div className="space-y-2">
                  <Label>Duration (months)</Label>
                  <Input type="number" defaultValue={editingType.duration} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Benefits (one per line)</Label>
                <Textarea defaultValue={editingType.benefits.join('\n')} rows={4} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingType(null)}>Cancel</Button>
            <Button variant="dental" onClick={() => {
              setEditingType(null);
              toast({ title: "Card type updated" });
            }}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default CardTypesPage;
