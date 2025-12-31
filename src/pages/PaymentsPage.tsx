import { useEffect, useState } from "react";
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
  AlertCircle,
} from "lucide-react";

import { paymentsService, Payment } from "@/lib/api/payments";
import { toast } from "@/hooks/use-toast";

const statusMap: Record<string, "pending" | "approved" | "rejected" | "under-review"> = {
  Pending: "pending",
  Approved: "approved",
  Rejected: "rejected",
  UnderReview: "under-review",
};

const PaymentsPage = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");

  // ✅ FETCH FROM BACKEND
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await paymentsService.getAll();
        setPayments(data);
      } catch (err) {
        console.error("Failed to fetch payments", err);
      }
    };
    fetchPayments();
  }, []);

 
  const filteredPayments = payments.filter((payment) => {
    const patientName = payment.requestedBy
      ? `${payment.requestedBy.fName} ${payment.requestedBy.lName}`
      : "";

    const cardRef = payment.card?.cardNumber ?? "";

    const matchesSearch =
      patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cardRef.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || payment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleApprove = async (id: number) => {
    try {
      await paymentsService.approvePayment(id);
      toast({ title: "Payment approved" });
    } catch {
      toast({ title: "Failed to approve payment", variant: "destructive" });
    }
  };

  const handleReject = async (id: number) => {
    try {
      await paymentsService.rejectPayment(id);
      toast({ title: "Payment rejected", variant: "destructive" });
    } catch {
      toast({ title: "Failed to reject payment", variant: "destructive" });
    }
  };

  return (
    <DashboardLayout
      title="Payments"
      subtitle="Review and manage patient card payments"
    >
      {/* FILTERS */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient or card reference..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                <SelectItem value="UnderReview">Under Review</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>Payments ({filteredPayments.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Card</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        {payment.requestedBy
                          ? `${payment.requestedBy.fName} ${payment.requestedBy.lName}`
                          : "N/A"}
                      </div>
                    </td>

                    <td className="font-mono">
                      {payment.card?.cardNumber ?? "N/A"}
                    </td>

                    <td>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {payment.requestedAmount}
                      </div>
                    </td>

                    <td>
                      <StatusBadge status={statusMap[payment.status]} />
                    </td>

                    <td>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setSelectedPayment(payment)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>

                        {payment.status === "Pending" && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="text-success"
                              onClick={() => handleApprove(payment.id)}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="text-destructive"
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

      {/* DETAILS DIALOG */}
      <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>
              Review payment information
            </DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <div className="space-y-3">
              <p><b>Reference:</b> {selectedPayment.reference}</p>
              <p><b>Card:</b> {selectedPayment.card?.cardNumber ?? "N/A"}</p>
              <p><b>Amount:</b> {selectedPayment.requestedAmount}</p>
              <StatusBadge status={statusMap[selectedPayment.status]} />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedPayment(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default PaymentsPage;
