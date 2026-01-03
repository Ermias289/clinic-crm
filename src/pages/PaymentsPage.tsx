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
import { Search, Eye, CheckCircle, XCircle, DollarSign, User } from "lucide-react";

import { paymentsService, Payment } from "@/lib/api/payments";
import { toast } from "@/hooks/use-toast";

const statusMap: Record<string, "auto-prepared" | "partially-paid" | "requested" | "checked" | "approved" | "rejected" > = {
  "Auto-Prepared": "auto-prepared",
  "Partially-Paid": "partially-paid",
  Requested: "requested",
  Checked: "checked",
  Approved: "approved",
  Rejected: "rejected",
};

const PaymentsPage = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  // Remarks / inputs for actions
  const [remark, setRemark] = useState("");
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [paymentProof, setPaymentProof] = useState("");

  // Fetch payments
  const fetchPayments = async () => {
    try {
      const data = await paymentsService.getAll();
      setPayments(data);
    } catch (err) {
      console.error("Failed to fetch payments", err);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // Filter payments
  const filteredPayments = payments.filter((payment) => {
    const patientName = payment.requestedBy
      ? `${payment.requestedBy.fName} ${payment.requestedBy.lName}`
      : "";
    const cardRef = payment.card?.cardNumber ?? "";
    const matchesSearch =
      patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cardRef.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || payment.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Action handlers
  const handleCheck = async () => {
    if (!selectedPayment) return;
    try {
      await paymentsService.checkPayment({
        id: selectedPayment.id,
        chekedAmount: amount || selectedPayment.requestedAmount,
        checkRemark: remark,
        paymentProof,
      });
      toast({ title: "Payment checked" });
      setSelectedPayment(null);
      fetchPayments();
    } catch {
      toast({ title: "Failed to check payment", variant: "destructive" });
    }
  };

  const handleApprove = async () => {
    if (!selectedPayment) return;
    try {
      await paymentsService.approvePayment({
        id: selectedPayment.id,
        approvedAmount: amount || selectedPayment.requestedAmount,
        approvalRemark: remark,
      });
      toast({ title: "Payment approved" });
      setSelectedPayment(null);
      fetchPayments();
    } catch {
      toast({ title: "Failed to approve payment", variant: "destructive" });
    }
  };

  const handleReject = async () => {
    if (!selectedPayment) return;
    try {
      await paymentsService.rejectPayment({
        id: selectedPayment.id,
        rejectionRemark: remark,
      });
      toast({ title: "Payment rejected", variant: "destructive" });
      setSelectedPayment(null);
      fetchPayments();
    } catch {
      toast({ title: "Failed to reject payment", variant: "destructive" });
    }
  };

  const handleCancel = async () => {
    if (!selectedPayment) return;
    try {
      await paymentsService.cancelPayment({
        id: selectedPayment.id,
        canceledRemark: remark,
      });
      toast({ title: "Payment canceled", variant: "destructive" });
      setSelectedPayment(null);
      fetchPayments();
    } catch {
      toast({ title: "Failed to cancel payment", variant: "destructive" });
    }
  };

  return (
    <DashboardLayout title="Payments" subtitle="Review and manage patient card payments">
      {/* FILTERS */}
      <Card className="mb-6">
        <CardContent className="p-4 flex gap-4 flex-wrap">
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
              <SelectItem value="Auto-Prepared">Auto-Prepared</SelectItem>
              <SelectItem value="Requested">Requested</SelectItem>
              <SelectItem value="Checked">Checked</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
              <SelectItem value="Partially-Paid">Partially-Paid</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* PAYMENTS TABLE */}
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
                    <td className="font-mono">{payment.card?.cardNumber ?? "N/A"}</td>
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
                          onClick={() => {
                            setSelectedPayment(payment);
                            setRemark("");
                            setAmount(undefined);
                            setPaymentProof("");
                          }}
                        >
                          <Eye className="w-4 h-4" />
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

      {/* DETAILS DIALOG */}
      <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
        <DialogContent className="max-w-4xl w-full">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>All payment information in one view</DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">
                {/* Left Column */}
                <div className="space-y-2">
                  <p><b>Reference:</b> {selectedPayment.reference}</p>
                  <p><b>Card:</b> {selectedPayment.card?.cardNumber ?? "N/A"}</p>
                  <p><b>Card Status:</b> {selectedPayment.card?.status ?? "N/A"}</p>
                  <p><b>Requested Amount:</b> {selectedPayment.requestedAmount}</p>
                  <p><b>Paid Amount:</b> {selectedPayment.paidAmount}</p>
                  <p><b>Unpaid Amount:</b> {selectedPayment.unPaidAmount}</p>
                  <p><b>Insurance Covered:</b> {selectedPayment.isInsuranceCovered ? "Yes" : "No"}</p>
                  <p><b>Requested By:</b> {selectedPayment.requestedBy?.fName} {selectedPayment.requestedBy?.lName}</p>
                  <p><b>Requested At:</b> {selectedPayment.requestedAt ? new Date(selectedPayment.requestedAt).toLocaleString() : "N/A"}</p>
                  <p><b>Request Remark:</b> {selectedPayment.card?.requestRemark ?? "N/A"}</p>
                </div>

                {/* Right Column */}
                <div className="space-y-2">
                  {selectedPayment.checkedBy && (
                    <>
                      <p><b>Checked By:</b> {selectedPayment.checkedBy?.fName} {selectedPayment.checkedBy?.lName}</p>
                      <p><b>Checked At:</b> {selectedPayment.checkedAt ? new Date(selectedPayment.checkedAt).toLocaleString() : "N/A"}</p>
                      <p><b>Check Remark:</b> {selectedPayment.checkRemark ?? "N/A"}</p>
                    </>
                  )}
                  {selectedPayment.approvedBy && (
                    <>
                      <p><b>Approved By:</b> {selectedPayment.approvedBy?.fName} {selectedPayment.approvedBy?.lName}</p>
                      <p><b>Approved At:</b> {selectedPayment.approvedAt ? new Date(selectedPayment.approvedAt).toLocaleString() : "N/A"}</p>
                      <p><b>Approval Remark:</b> {selectedPayment.approvalRemark ?? "N/A"}</p>
                    </>
                  )}
                  {selectedPayment.rejectedAt && selectedPayment.rejectedAt !== "0001-01-01T00:00:00" && (
                    <>
                      <p><b>Rejected At:</b> {new Date(selectedPayment.rejectedAt).toLocaleString()}</p>
                      <p><b>Rejection Remark:</b> {selectedPayment.rejectionRemark ?? "N/A"}</p>
                    </>
                  )}
                  <p><b>Status:</b> <StatusBadge status={statusMap[selectedPayment.status]} /></p>
                </div>
              </div>

              {/* Action Inputs */}
              {(selectedPayment.status === "Requested" || selectedPayment.status === "Checked") && (
                <div className="mt-4 space-y-2">
                  {(selectedPayment.status === "Requested") && (
                    <>
                      <Input
                        placeholder="Check Remark"
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                      />
                      <Input
                        type="number"
                        placeholder="Checked Amount"
                        value={amount || ""}
                        onChange={(e) => setAmount(Number(e.target.value))}
                      />
                      <Input
                        placeholder="Payment Proof URL"
                        value={paymentProof}
                        onChange={(e) => setPaymentProof(e.target.value)}
                      />
                    </>
                  )}
                  {(selectedPayment.status === "Checked") && (
                    <>
                      <Input
                        placeholder="Approval Remark"
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                      />
                      <Input
                        type="number"
                        placeholder="Approved Amount"
                        value={amount || ""}
                        onChange={(e) => setAmount(Number(e.target.value))}
                      />
                    </>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-4 flex gap-2">
                {selectedPayment.status === "Requested" && (
                  <>
                    <Button variant="success" onClick={handleCheck}>Check</Button>
                    <Button variant="destructive" onClick={handleReject}>Reject</Button>
                  </>
                )}
                {selectedPayment.status === "Checked" && (
                  <>
                    <Button variant="success" onClick={handleApprove}>Approve</Button>
                    <Button variant="destructive" onClick={handleReject}>Reject</Button>
                  </>
                )}
                {/* Optional cancel button if needed */}
                {selectedPayment.status !== "Approved" && selectedPayment.status !== "Rejected" && (
                  <Button variant="destructive" onClick={handleCancel}>Cancel</Button>
                )}
              </div>
            </>
          )}

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setSelectedPayment(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default PaymentsPage;
