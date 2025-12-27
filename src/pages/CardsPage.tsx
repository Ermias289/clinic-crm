import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  Search, 
  Filter,
  CreditCard,
  User,
  Calendar,
  Gift,
  Edit,
  Eye
} from "lucide-react";
import { mockCards, mockCardTypes, mockPatients } from "@/data/mockData";
import { PatientCard } from "@/types/clinic";

const CardsPage = () => {
  const [cards] = useState<PatientCard[]>(mockCards);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [cardTypeFilter, setCardTypeFilter] = useState<string>("all");
  const [selectedCard, setSelectedCard] = useState<PatientCard | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filteredCards = cards.filter(card => {
    const matchesSearch = card.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          card.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || card.status === statusFilter;
    const matchesType = cardTypeFilter === "all" || card.cardTypeId === cardTypeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <DashboardLayout 
      title="Patient Cards" 
      subtitle="Manage patient membership cards and subscriptions"
      actions={
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button variant="dental">
              <Plus className="w-4 h-4" />
              Add Card
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Issue New Card</DialogTitle>
              <DialogDescription>
                Create a new patient membership card
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="patient">Patient</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockPatients.map(patient => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.firstName} {patient.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cardType">Card Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select card type" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCardTypes.map(type => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name} - ${type.price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="issueDate">Issue Date</Label>
                <Input type="date" id="issueDate" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
              <Button variant="dental" onClick={() => setIsCreateOpen(false)}>Issue Card</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {mockCardTypes.map(type => (
          <Card key={type.id} style={{ borderTopColor: type.color, borderTopWidth: '3px' }}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{type.name}</p>
                  <p className="text-2xl font-bold">
                    {cards.filter(c => c.cardTypeId === type.id && c.status === 'active').length}
                  </p>
                  <p className="text-xs text-muted-foreground">active cards</p>
                </div>
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${type.color}20` }}
                >
                  <CreditCard className="w-6 h-6" style={{ color: type.color }} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by reference or patient name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Select value={cardTypeFilter} onValueChange={setCardTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Card Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {mockCardTypes.map(type => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards List */}
      <Card>
        <CardHeader>
          <CardTitle>All Cards ({filteredCards.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Patient</th>
                  <th>Card Type</th>
                  <th>Issue Date</th>
                  <th>Expiry Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCards.map((card) => (
                  <tr key={card.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                          <CreditCard className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-mono font-medium">{card.referenceNumber}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        {card.patientName}
                      </div>
                    </td>
                    <td>
                      <span 
                        className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{ 
                          backgroundColor: `${mockCardTypes.find(t => t.id === card.cardTypeId)?.color}20`,
                          color: mockCardTypes.find(t => t.id === card.cardTypeId)?.color
                        }}
                      >
                        {card.cardTypeName}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        {card.issueDate}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        {card.expiryDate}
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={card.status} />
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon-sm"
                          onClick={() => setSelectedCard(card)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon-sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Card Details Dialog */}
      <Dialog open={!!selectedCard} onOpenChange={() => setSelectedCard(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Card Details</DialogTitle>
            <DialogDescription>
              View and manage card information
            </DialogDescription>
          </DialogHeader>
          {selectedCard && (
            <div className="space-y-4">
              <div 
                className="p-6 rounded-xl text-center"
                style={{ 
                  background: `linear-gradient(135deg, ${mockCardTypes.find(t => t.id === selectedCard.cardTypeId)?.color} 0%, ${mockCardTypes.find(t => t.id === selectedCard.cardTypeId)?.color}99 100%)` 
                }}
              >
                <CreditCard className="w-12 h-12 mx-auto text-white mb-2" />
                <p className="text-white/80 text-sm">Reference Number</p>
                <p className="text-white text-xl font-bold font-mono">{selectedCard.referenceNumber}</p>
                <p className="text-white mt-2 font-medium">{selectedCard.cardTypeName}</p>
              </div>

              <div className="grid gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg border">
                  <User className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Patient</p>
                    <p className="font-medium">{selectedCard.patientName}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg border">
                    <p className="text-sm text-muted-foreground">Issue Date</p>
                    <p className="font-medium">{selectedCard.issueDate}</p>
                  </div>
                  <div className="p-3 rounded-lg border">
                    <p className="text-sm text-muted-foreground">Expiry Date</p>
                    <p className="font-medium">{selectedCard.expiryDate}</p>
                  </div>
                </div>
                
                <div className="p-3 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Gift className="w-4 h-4 text-primary" />
                    <p className="text-sm font-medium">Benefits</p>
                  </div>
                  <ul className="space-y-1">
                    {selectedCard.benefits.map((benefit, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-success" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedCard(null)}>Close</Button>
                <Button variant="dental">Edit Card</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default CardsPage;
