import { useState, useEffect } from "react"; 
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
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
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  Search,
  Filter,
  CreditCard,
  Edit,
  Eye,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  AlertCircle,
  Bell,
  BellOff,
  Check,
  CheckCheck,
  AlertTriangle,
} from "lucide-react";
import { format } from "date-fns";
import { formatDistanceToNow, parseISO } from "date-fns";

import { cardService, CardDTO, UpdateCardDTO } from "@/lib/api/cards";
import { cardTypeService, CardTypeDTO } from "@/lib/api/cardTypes";
import { patientsService, Patient } from "@/lib/api/patients";
import { notificationsService, Notification } from "@/lib/api/notifications";

/* ================= TYPES ================= */

type CardStatus = "active" | "pending" | "expired" | "suspended";

// Interface for the mapped card with additional fields
interface MappedCard extends CardDTO {
  patientName: string;
  patientDetails?: Patient;
  cardTypeName: string;
  cardTypeDetails?: CardTypeDTO;
  issueDate: string;
  expiryDate: string;
  referenceNumber: string;
  uiStatus: CardStatus;
}

/* ================= STATUS MAPPER ================= */

const mapCardStatus = (status: string): CardStatus => {
  switch (status.toLowerCase()) {
    case "active":
      return "active";
    case "expired":
      return "expired";
    case "suspended":
      return "suspended";
    default:
      return "pending";
  }
};

const mapUIToApiStatus = (uiStatus: CardStatus): "Active" | "Expired" | "Pending" | "Suspended" => {
  switch (uiStatus) {
    case "active":
      return "Active";
    case "expired":
      return "Expired";
    case "suspended":
      return "Suspended";
    default:
      return "Pending";
  }
};

/* ================= NOTIFICATION ICONS ================= */

const getNotificationIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "appointment":
      return <Calendar className="h-4 w-4 text-blue-500" />;
    case "payment":
      return <CreditCard className="h-4 w-4 text-green-500" />;
    case "alert":
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    default:
      return <Bell className="h-4 w-4 text-gray-500" />;
  }
};

/* ================= NOTIFICATIONS BUTTON COMPONENT ================= */

interface NotificationsButtonProps {
  userId: number;
}

const NotificationsButton = ({ userId }: NotificationsButtonProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (userId && open) {
      fetchNotifications();
    }
  }, [userId, open]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationsService.getByUserId(userId);
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await notificationsService.markAsRead(userId, notificationId);
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsService.markAllAsRead(userId);
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, isRead: true }))
      );
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-muted"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96 mr-4" align="end">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs"
              onClick={handleMarkAllAsRead}
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <ScrollArea className="h-80">
          <DropdownMenuGroup>
            {loading ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                <BellOff className="h-8 w-8 mx-auto mb-2 opacity-50" />
                No notifications yet
              </div>
            ) : (
              notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="flex flex-col items-start p-4 cursor-pointer hover:bg-muted/50"
                  onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                >
                  <div className="flex w-full items-start gap-3">
                    <div className="mt-0.5">
                      {getNotificationIcon(notification.notification.category)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium ${notification.isRead ? 'text-muted-foreground' : ''}`}>
                          {notification.notification.title}
                        </p>
                        {!notification.isRead && (
                          <Badge variant="outline" className="h-5 text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className={`text-sm ${notification.isRead ? 'text-muted-foreground' : ''}`}>
                        {notification.notification.message}
                      </p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(parseISO(notification.notification.createdAt), { 
                            addSuffix: true 
                          })}
                        </span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="h-5 text-xs capitalize">
                            {notification.notification.category}
                          </Badge>
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={(e) => handleMarkAsRead(notification.id, e)}
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuGroup>
        </ScrollArea>
        
        <DropdownMenuSeparator />
        <div className="p-2">
          <Button
            variant="ghost"
            className="w-full justify-center text-sm"
            onClick={() => {
              // You can navigate to a full notifications page here
              setOpen(false);
            }}
          >
            View all notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

/* ================= MAIN COMPONENT ================= */

const CardsPage = () => {
  const [cards, setCards] = useState<CardDTO[]>([]);
  const [cardTypes, setCardTypes] = useState<CardTypeDTO[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [cardTypeFilter, setCardTypeFilter] = useState("all");

  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  // Selected card for view/edit
  const [selectedCard, setSelectedCard] = useState<MappedCard | null>(null);
  const [selectedCardDetails, setSelectedCardDetails] = useState<MappedCard | null>(null);
  const [editStatus, setEditStatus] = useState<CardStatus>("pending");

  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [selectedCardTypeId, setSelectedCardTypeId] = useState<number | null>(null);
  const [requestRemark, setRequestRemark] = useState("");

  // User ID for notifications (replace with actual user from auth)
  const userId = 1; // Hardcoded for now, replace with actual user ID

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    const fetchData = async () => {
      const [cardsData, cardTypesData, patientsData] = await Promise.all([
        cardService.getAll(),
        cardTypeService.getAll(),
        patientsService.getAll(),
      ]);

      setCards(cardsData);
      setCardTypes(cardTypesData);
      setPatients(patientsData);
    };

    fetchData();
  }, []);

  /* ================= MAP CARD ================= */

  const mapCard = (card: CardDTO): MappedCard => {
    const patient = patients.find(p => p.id === card.patientId);
    const cardType = cardTypes.find(ct => ct.id === card.cardTypeId);

    return {
      ...card,
      patientName: patient ? `${patient.fName} ${patient.lName}` : "Unknown",
      patientDetails: patient,
      cardTypeName: cardType ? cardType.name : "Unknown",
      cardTypeDetails: cardType,
      issueDate: card.createdAt.split("T")[0],
      expiryDate:
        card.expiredAt === "0001-01-01T00:00:00"
          ? "N/A"
          : card.expiredAt?.split("T")[0],
      referenceNumber: card.cardNumber,
      uiStatus: mapCardStatus(card.status),
    };
  };

  /* ================= FILTER ================= */

  const filteredCards: MappedCard[] = cards
    .map(mapCard)
    .filter(card => {
      const matchesSearch =
        card.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || card.uiStatus === statusFilter;

      const matchesType =
        cardTypeFilter === "all" ||
        card.cardTypeId.toString() === cardTypeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });

  /* ================= VIEW CARD ================= */

  const handleViewCard = async (card: MappedCard) => {
    setSelectedCard(card);
    
    // Get detailed card data
    try {
      const detailedCard = await cardService.getById(card.id);
      const mappedCard = mapCard(detailedCard);
      setSelectedCardDetails(mappedCard);
      setIsViewOpen(true);
    } catch (error) {
      console.error("Error fetching card details:", error);
      setSelectedCardDetails(card);
      setIsViewOpen(true);
    }
  };

  /* ================= EDIT CARD ================= */

  const handleEditCard = (card: MappedCard) => {
    setSelectedCard(card);
    setSelectedCardDetails(card);
    setEditStatus(card.uiStatus);
    setIsEditOpen(true);
  };

  const handleUpdateCard = async () => {
    if (!selectedCard) return;

    const updateData: UpdateCardDTO = {
      id: selectedCard.id,
      status: mapUIToApiStatus(editStatus),
    };

    try {
      await cardService.update(updateData);
      setIsEditOpen(false);
      
      // Refresh cards list
      const updatedCards = await cardService.getAll();
      setCards(updatedCards);
      
      setSelectedCard(null);
      setSelectedCardDetails(null);
    } catch (error) {
      console.error("Error updating card:", error);
    }
  };

  /* ================= CREATE CARD ================= */

  const handleCreateCard = async () => {
    if (!selectedPatientId || !selectedCardTypeId) return;

    await cardService.create({
      patientId: selectedPatientId,
      cardTypeId: selectedCardTypeId,
      requestRemark,
    });

    setIsCreateOpen(false);
    setSelectedPatientId(null);
    setSelectedCardTypeId(null);
    setRequestRemark("");

    const updated = await cardService.getAll();
    setCards(updated);
  };

  /* ================= FORMAT DATE ================= */

  const formatDateTime = (dateString: string) => {
    if (!dateString || dateString === "0001-01-01T00:00:00") {
      return "N/A";
    }
    try {
      const date = new Date(dateString);
      return format(date, "PPP p");
    } catch {
      return dateString;
    }
  };

  return (
    <DashboardLayout
      title="Patient Cards"
      subtitle="Manage patient membership cards"
      actions={
        <div className="flex items-center gap-2">
          <NotificationsButton userId={userId} />
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
                  Assign a membership card to a patient
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Patient</Label>
                  <Select
                    value={selectedPatientId?.toString()}
                    onValueChange={(v) => setSelectedPatientId(Number(v))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map(p => (
                        <SelectItem key={p.id} value={p.id.toString()}>
                          {p.fName} {p.lName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Card Type</Label>
                  <Select
                    value={selectedCardTypeId?.toString()}
                    onValueChange={(v) => setSelectedCardTypeId(Number(v))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select card type" />
                    </SelectTrigger>
                    <SelectContent>
                      {cardTypes.map(ct => (
                        <SelectItem key={ct.id} value={ct.id.toString()}>
                          {ct.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Request Remark</Label>
                  <Input
                    placeholder="Optional remark"
                    value={requestRemark}
                    onChange={(e) => setRequestRemark(e.target.value)}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button variant="dental" onClick={handleCreateCard}>
                  Issue Card
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      }
    >
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {cardTypes.map(type => {
          const total = cards.filter(c => c.cardTypeId === type.id).length;
          const active = cards.filter(
            c => c.cardTypeId === type.id && c.status === "Active"
          ).length;

          return (
            <Card key={type.id} style={{ borderTopColor: type.color, borderTopWidth: 3 }}>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">{type.name}</p>
                <p className="text-2xl font-bold">{total}</p>
                <p className="text-xs text-muted-foreground">{active} active</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* FILTERS */}
      <Card className="mb-6">
        <CardContent className="p-4 flex gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by patient or reference"
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>

          <Select value={cardTypeFilter} onValueChange={setCardTypeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Card Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {cardTypes.map(type => (
                <SelectItem key={type.id} value={type.id.toString()}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>All Cards ({filteredCards.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
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
              {filteredCards.map(card => (
                <tr key={card.id}>
                  <td>{card.referenceNumber}</td>
                  <td>{card.patientName}</td>
                  <td>{card.cardTypeName}</td>
                  <td>{card.issueDate}</td>
                  <td>{card.expiryDate}</td>
                  <td>
                    <StatusBadge status={card.uiStatus} />
                  </td>
                  <td className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon-sm"
                      onClick={() => handleViewCard(card)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon-sm"
                      onClick={() => handleEditCard(card)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* VIEW CARD DIALOG */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Card Details
            </DialogTitle>
            <DialogDescription>
              Complete information for card: {selectedCardDetails?.referenceNumber}
            </DialogDescription>
          </DialogHeader>

          {selectedCardDetails && (
            <div className="space-y-6 py-4">
              {/* Card Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Card Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Reference Number</p>
                    <p className="font-mono">{selectedCardDetails.referenceNumber}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Card Type</p>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: selectedCardDetails.cardTypeDetails?.color }}
                      />
                      <p>{selectedCardDetails.cardTypeName}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <StatusBadge status={selectedCardDetails.uiStatus} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Expiry Date</p>
                    <p>{selectedCardDetails.expiryDate}</p>
                  </div>
                </div>
              </div>

              {/* Patient Information */}
              {selectedCardDetails.patientDetails && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Patient Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                      <p>{selectedCardDetails.patientName}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <p>{selectedCardDetails.patientDetails.email || "N/A"}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Phone</p>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <p>{selectedCardDetails.patientDetails.phoneNumber || "N/A"}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                      <p>{selectedCardDetails.patientDetails.dateOfBirth || "N/A"}</p>
                    </div>
                    <div className="space-y-1 col-span-2">
                      <p className="text-sm font-medium text-muted-foreground">Address</p>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <p>{selectedCardDetails.patientDetails.address || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Timestamps
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Created At</p>
                    <p>{formatDateTime(selectedCardDetails.createdAt)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Updated At</p>
                    <p>{formatDateTime(selectedCardDetails.updatedAt || "")}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Activated At</p>
                    <p>{formatDateTime(selectedCardDetails.activatedAt || "")}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Expired At</p>
                    <p>{formatDateTime(selectedCardDetails.expiredAt || "")}</p>
                  </div>
                </div>
              </div>

              {/* Remarks */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Remarks
                </h3>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Request Remark</p>
                    <p className="bg-muted p-3 rounded-md">
                      {selectedCardDetails.requestRemark || "No remark provided"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Activation Remark</p>
                    <p className="bg-muted p-3 rounded-md">
                      {selectedCardDetails.activationRemark || "No activation remark"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT CARD DIALOG */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Edit Card
            </DialogTitle>
            <DialogDescription>
              Update card details for: {selectedCardDetails?.referenceNumber}
            </DialogDescription>
          </DialogHeader>

          {selectedCardDetails && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Card Status</Label>
                <Select value={editStatus} onValueChange={(value: CardStatus) => setEditStatus(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Patient</Label>
                <Input 
                  value={selectedCardDetails.patientName} 
                  disabled 
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label>Card Type</Label>
                <Input 
                  value={selectedCardDetails.cardTypeName} 
                  disabled 
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label>Request Remark</Label>
                <Input 
                  value={selectedCardDetails.requestRemark || ""} 
                  onChange={(e) => setSelectedCardDetails({
                    ...selectedCardDetails,
                    requestRemark: e.target.value
                  })}
                  placeholder="Update request remark"
                />
              </div>

              <div className="space-y-2">
                <Label>Activation Remark</Label>
                <Input 
                  value={selectedCardDetails.activationRemark || ""} 
                  onChange={(e) => setSelectedCardDetails({
                    ...selectedCardDetails,
                    activationRemark: e.target.value
                  })}
                  placeholder="Update activation remark"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button variant="dental" onClick={handleUpdateCard}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default CardsPage;