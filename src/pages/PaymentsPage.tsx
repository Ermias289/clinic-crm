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
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  User,
  CreditCard,
  DollarSign,
  FileText,
  AlertCircle
} from "lucide-react";
import { mockPayments } from "@/data/mockData";
import { Payment } from "@/types/clinic";
import { toast } from "@/hooks/use-toast";

const PaymentsPage = () => {
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          payment.cardReference.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (paymentId: string) => {
    setPayments(prev => prev.map(p => 
      p.id === paymentId 
        ? { ...p, status: 'approved' as const, reviewedAt: new Date().toISOString(), reviewedBy: 'Admin', notes: reviewNotes }
        : p
    ));
    setSelectedPayment(null);
    setReviewNotes("");
    toast({
      title: "Payment Approved",
      description: "The payment has been successfully approved.",
    });
  };

  const handleReject = (paymentId: string) => {
    setPayments(prev => prev.map(p => 
      p.id === paymentId 
        ? { ...p, status: 'rejected' as const, reviewedAt: new Date().toISOString(), reviewedBy: 'Admin', notes: reviewNotes }
        : p
    ));
    setSelectedPayment(null);
    setReviewNotes("");
    toast({
      title: "Payment Rejected",
      description: "The payment has been rejected.",
      variant: "destructive",
    });
  };

  const pendingCount = payments.filter(p => p.status === 'pending').length;
  const underReviewCount = payments.filter(p => p.status === 'under-review').length;

  return (
    <DashboardLayout 
      title="Payments" 
      subtitle="Review and manage patient card payments"
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-warning/10 border-warning/30">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold">{pendingCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-primary/10 border-primary/30">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Under Review</p>
              <p className="text-2xl font-bold">{underReviewCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-success/10 border-success/30">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Approved</p>
              <p className="text-2xl font-bold">{payments.filter(p => p.status === 'approved').length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-destructive/10 border-destructive/30">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-destructive/20 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Rejected</p>
              <p className="text-2xl font-bold">{payments.filter(p => p.status === 'rejected').length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient or card reference..."
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under-review">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments List */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Requests ({filteredPayments.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Card Reference</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-medium">{payment.patientName}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-muted-foreground" />
                        <span className="font-mono text-sm">{payment.cardReference}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1 font-semibold text-foreground">
                        <DollarSign className="w-4 h-4" />
                        {payment.amount}
                      </div>
                    </td>
                    <td>{payment.paymentMethod}</td>
                    <td>
                      <span className="text-sm text-muted-foreground">
                        {new Date(payment.submittedAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={payment.status} />
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon-sm"
                          onClick={() => setSelectedPayment(payment)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {(payment.status === 'pending' || payment.status === 'under-review') && (
                          <>
                            <Button 
                              variant="ghost" 
                              size="icon-sm" 
                              className="text-success hover:text-success hover:bg-success/10"
                              onClick={() => handleApprove(payment.id)}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon-sm" 
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleReject(payment.id)}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Payment Details Dialog */}
      <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>
              Review payment information and approve or reject
            </DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <StatusBadge status={selectedPayment.status} className="mt-1" />
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="text-2xl font-bold text-primary">${selectedPayment.amount}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <User className="w-4 h-4" />
                    <span className="text-sm">Patient</span>
                  </div>
                  <p className="font-medium">{selectedPayment.patientName}</p>
                </div>
                <div className="p-4 rounded-lg border">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <CreditCard className="w-4 h-4" />
                    <span className="text-sm">Card Reference</span>
                  </div>
                  <p className="font-medium font-mono">{selectedPayment.cardReference}</p>
                </div>
                <div className="p-4 rounded-lg border">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm">Payment Method</span>
                  </div>
                  <p className="font-medium">{selectedPayment.paymentMethod}</p>
                </div>
                <div className="p-4 rounded-lg border">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Submitted</span>
                  </div>
                  <p className="font-medium">{new Date(selectedPayment.submittedAt).toLocaleString()}</p>
                </div>
              </div>

              {/* Payment Proof */}
              {selectedPayment.paymentProofUrl && (
                <div className="p-4 rounded-lg border">
                  <div className="flex items-center gap-2 text-muted-foreground mb-3">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm font-medium">Payment Proof</span>
                  </div>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed">
                    <div className="text-center">
                      <FileText className="w-12 h-12 mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mt-2">Payment proof document</p>
                      <Button variant="outline" size="sm" className="mt-3">
                        View Full Image
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Review Notes */}
              {(selectedPayment.status === 'pending' || selectedPayment.status === 'under-review') && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Review Notes (Optional)</label>
                  <Textarea
                    placeholder="Add notes about this payment review..."
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    rows={3}
                  />
                </div>
              )}

              {selectedPayment.notes && selectedPayment.status !== 'pending' && (
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">Review Notes</p>
                  <p className="text-sm">{selectedPayment.notes}</p>
                </div>
              )}

              {(selectedPayment.status === 'pending' || selectedPayment.status === 'under-review') && (
                <DialogFooter className="gap-2">
                  <Button variant="destructive" onClick={() => handleReject(selectedPayment.id)}>
                    <XCircle className="w-4 h-4 mr-1" />
                    Reject Payment
                  </Button>
                  <Button variant="success" onClick={() => handleApprove(selectedPayment.id)}>
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approve Payment
                  </Button>
                </DialogFooter>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default PaymentsPage;
