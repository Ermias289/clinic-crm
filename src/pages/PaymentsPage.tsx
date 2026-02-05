import { useEffect, useState, useRef } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Search,
  Eye,
  CheckCircle,
  XCircle,
  DollarSign,
  User,
  FileText,
  ShieldCheck,
  ShieldX,
  Check,
  X,
  CreditCard,
  AlertCircle,
  CalendarDays,
  RefreshCw,
  FileCheck,
  Ban,
  Image as ImageIcon,
} from "lucide-react";

import { 
  paymentsService, 
  Payment, 
  PaymentType,
  PAYMENT_TYPE_NAMES 
} from "@/lib/api/payments";
import { fileUploadService } from "@/lib/api/fileUpload";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { 
  statusColors, 
  formatDate, 
  getAvailableActions 
} from "@/lib/utils/payment-status";

const PaymentsPage = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentTypeFilter, setPaymentTypeFilter] = useState<string>("all"); // New: Payment Type filter
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Modal states
  const [showCheckModal, setShowCheckModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  
  // Form states
  const [checkedAmount, setCheckedAmount] = useState<number>(0);
  const [checkRemark, setCheckRemark] = useState("");
  const [approvedAmount, setApprovedAmount] = useState<number>(0);
  const [approvalRemark, setApprovalRemark] = useState("");
  const [rejectionRemark, setRejectionRemark] = useState("");
  const [cancelRemark, setCancelRemark] = useState("");

  // Request payment states
  const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([]);
  const [selectedPaymentType, setSelectedPaymentType] = useState<number>(1); // Default to Cash
  const [selectedPaymentTypeName, setSelectedPaymentTypeName] = useState<string>("Cash"); // Default to Cash
  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch payments
  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const data = await paymentsService.getAll();
      setPayments(data);
      applyFilters(data, searchQuery, statusFilter, paymentTypeFilter);
    } catch (err) {
      console.error("Failed to fetch payments", err);
      toast({
        title: "Error",
        description: "Failed to load payments",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch payment types
  const fetchPaymentTypes = async () => {
    try {
      const types = await paymentsService.getPaymentTypes();
      setPaymentTypes(types);
      
      // Set default payment type (Cash if exists, otherwise first type)
      if (types.length > 0) {
        const cashType = types.find(t => t.name === PAYMENT_TYPE_NAMES.CASH);
        if (cashType) {
          setSelectedPaymentType(cashType.id);
          setSelectedPaymentTypeName(cashType.name);
        } else {
          setSelectedPaymentType(types[0].id);
          setSelectedPaymentTypeName(types[0].name);
        }
      }
    } catch (err) {
      console.error("Failed to fetch payment types", err);
      toast({
        title: "Warning",
        description: "Failed to load payment types",
        variant: "destructive",
      });
    }
  };

  // Apply filters
  const applyFilters = (data: Payment[], query: string, status: string, paymentType: string) => {
    let filtered = [...data];

    // Apply search filter
    if (query) {
      filtered = filtered.filter((payment) => {
        const patientName = payment.requestedBy
          ? `${payment.requestedBy.fName} ${payment.requestedBy.lName}`.toLowerCase()
          : "";
        const cardRef = payment.card?.cardNumber?.toLowerCase() ?? "";
        const reference = payment.reference?.toLowerCase() ?? "";
        
        return (
          patientName.includes(query.toLowerCase()) ||
          cardRef.includes(query.toLowerCase()) ||
          reference.includes(query.toLowerCase())
        );
      });
    }

    // Apply status filter
    if (status !== "all") {
      filtered = filtered.filter(
        (payment) => payment.status.toLowerCase() === status.toLowerCase()
      );
    }

    // Apply payment type filter
    if (paymentType !== "all") {
      filtered = filtered.filter((payment) => {
        // First check if payment has paymentType object
        if (payment.paymentType) {
          return payment.paymentType.name === paymentType;
        }
        // If not, check if it has paymentTypeId and find the corresponding type
        if (payment.paymentTypeId) {
          const type = paymentTypes.find(t => t.id === payment.paymentTypeId);
          return type?.name === paymentType;
        }
        // If no payment type info, only include if filter is "no-type"
        return paymentType === "no-type";
      });
    }

    setFilteredPayments(filtered);
  };

  useEffect(() => {
    fetchPayments();
    fetchPaymentTypes();
  }, []);

  useEffect(() => {
    applyFilters(payments, searchQuery, statusFilter, paymentTypeFilter);
  }, [searchQuery, statusFilter, paymentTypeFilter, payments, paymentTypes]);

  // Reset payment proof when payment type changes
 // Reset payment proof only if selected type does NOT require proof
  useEffect(() => {
    const requiresProof =
      selectedPaymentTypeName === PAYMENT_TYPE_NAMES.BANK_TRANSFER ||
      selectedPaymentTypeName === PAYMENT_TYPE_NAMES.INSURANCE;

    if (!requiresProof) {
      setPaymentProofFile(null);
      setPaymentProofPreview(null);
    }
  }, [selectedPaymentTypeName]);

  // Get image URL for payment proof using fileUploadService
  const getPaymentProofUrl = (filename?: string): string | null => {
    if (!filename) return null;
    return fileUploadService.getFileUrl(filename);
  };

  // Get payment type display name
  const getPaymentTypeDisplay = (payment: Payment): string => {
    if (payment.paymentType) {
      return payment.paymentType.name;
    } else if (payment.paymentTypeId) {
      const type = paymentTypes.find(t => t.id === payment.paymentTypeId);
      return type?.name || "Unknown";
    }
    return "Not specified";
  };

  // Reset form states when payment is selected
  const resetFormStates = () => {
    setCheckedAmount(0);
    setCheckRemark("");
    setApprovedAmount(0);
    setApprovalRemark("");
    setRejectionRemark("");
    setCancelRemark("");
    
    // Reset to default payment type (Cash)
    const cashType = paymentTypes.find(t => t.name === PAYMENT_TYPE_NAMES.CASH);
    if (cashType) {
      setSelectedPaymentType(cashType.id);
      setSelectedPaymentTypeName(cashType.name);
    } else if (paymentTypes.length > 0) {
      setSelectedPaymentType(paymentTypes[0].id);
      setSelectedPaymentTypeName(paymentTypes[0].name);
    }
    
    setPaymentProofFile(null);
    setPaymentProofPreview(null);
  };

  // Open details dialog
  const handleOpenDetails = (payment: Payment) => {
    setSelectedPayment(payment);
    resetFormStates();
    if (payment.status === "Requested") {
      setCheckedAmount(payment.requestedAmount);
    }
    if (payment.status === "Checked") {
      setApprovedAmount(payment.requestedAmount);
    }
  };

  // Close all modals
  const closeAllModals = () => {
    setShowCheckModal(false);
    setShowApproveModal(false);
    setShowRejectModal(false);
    setShowCancelModal(false);
    setShowRequestModal(false);
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type (allow images)
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPG, PNG, GIF)",
        variant: "destructive",
      });
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setPaymentProofFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPaymentProofPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle request payment using fileUploadService

  const handleRequestPayment = async () => {
    if (!selectedPayment) return;

    // Proof required for Bank Transfer OR Insurance
    const requiresProof =
      selectedPaymentTypeName === PAYMENT_TYPE_NAMES.BANK_TRANSFER ||
      selectedPaymentTypeName === PAYMENT_TYPE_NAMES.INSURANCE;

    if (requiresProof && !paymentProofFile) {
      toast({
        title: "Validation Error",
        description: "Payment proof is required for Bank-Transfer or Insurance payments",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      let uploadedFileName = "";

      // Upload file if proof is provided
      if (paymentProofFile) {
        try {
          console.log("Uploading payment proof file...");
          uploadedFileName = await fileUploadService.upload(paymentProofFile);
          console.log("File uploaded successfully:", uploadedFileName);

          toast({
            title: "Payment proof uploaded",
            description: "Image successfully uploaded to server",
          });
        } catch (uploadError: any) {
          console.error("Upload failed:", uploadError);
          toast({
            title: "Upload Failed",
            description: "Could not upload payment proof. Please try again.",
            variant: "destructive",
          });
          setIsUploading(false);
          return;
        }
      }

      // Submit request
      console.log("Submitting payment request with:", {
        id: selectedPayment.id,
        requestedAmount: selectedPayment.requestedAmount,
        paymentTypeId: selectedPaymentType,
        paymentProof: uploadedFileName || undefined,
        isInsuranceCovered: selectedPayment.isInsuranceCovered || false,
      });

      await paymentsService.requestPayment({
        id: selectedPayment.id,
        requestedAmount: selectedPayment.requestedAmount,
        paymentProof: uploadedFileName || undefined,
        isInsuranceCovered: selectedPayment.isInsuranceCovered || false,
        paymentTypeId: selectedPaymentType,
      });

      toast({
        title: "Success",
        description: "Payment request has been submitted",
      });

      // Reset states
      setShowRequestModal(false);
      setSelectedPayment(null);
      setPaymentProofFile(null);
      setPaymentProofPreview(null);

      // Reset to default payment type
      const cashType = paymentTypes.find(t => t.name === PAYMENT_TYPE_NAMES.CASH);
      if (cashType) {
        setSelectedPaymentType(cashType.id);
        setSelectedPaymentTypeName(cashType.name);
      }

      fetchPayments();
    } catch (error: any) {
      console.error("Failed to request payment:", error);
      toast({
        title: "Failed to request payment",
        description: error.response?.data?.message || error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Action handlers (unchanged from before)
  const handleCheckPayment = async () => {
    if (!selectedPayment) return;
    
    if (!checkedAmount || checkedAmount <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid checked amount",
        variant: "destructive",
      });
      return;
    }

    if (!checkRemark.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide a check remark",
        variant: "destructive",
      });
      return;
    }

    try {
      await paymentsService.checkPayment({
        id: selectedPayment.id,
        chekedAmount: checkedAmount,
        checkRemark: checkRemark,
        paymentProof: selectedPayment.paymentProof || "",
      });
      toast({
        title: "Success",
        description: "Payment has been checked successfully",
      });
      closeAllModals();
      setSelectedPayment(null);
      fetchPayments();
    } catch (error) {
      toast({
        title: "Failed to check payment",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleApprovePayment = async () => {
    if (!selectedPayment) return;
    
    if (!approvedAmount || approvedAmount <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid approved amount",
        variant: "destructive",
      });
      return;
    }

    if (!approvalRemark.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide an approval remark",
        variant: "destructive",
      });
      return;
    }

    try {
      await paymentsService.approvePayment({
        id: selectedPayment.id,
        approvedAmount: approvedAmount,
        approvalRemark: approvalRemark,
      });
      toast({
        title: "Success",
        description: "Payment has been approved successfully",
      });
      closeAllModals();
      setSelectedPayment(null);
      fetchPayments();
    } catch (error) {
      toast({
        title: "Failed to approve payment",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleRejectPayment = async () => {
    if (!selectedPayment) return;
    
    if (!rejectionRemark.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide a rejection reason",
        variant: "destructive",
      });
      return;
    }

    try {
      await paymentsService.rejectPayment({
        id: selectedPayment.id,
        rejectionRemark: rejectionRemark,
      });
      toast({
        title: "Payment Rejected",
        description: "The payment has been rejected",
        variant: "destructive",
      });
      closeAllModals();
      setSelectedPayment(null);
      fetchPayments();
    } catch (error) {
      toast({
        title: "Failed to reject payment",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleCancelPayment = async () => {
    if (!selectedPayment) return;
    
    if (!cancelRemark.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide a cancellation reason",
        variant: "destructive",
      });
      return;
    }

    try {
      await paymentsService.cancelPayment({
        id: selectedPayment.id,
        canceledRemark: cancelRemark,
      });
      toast({
        title: "Payment Canceled",
        description: "The payment has been canceled",
        variant: "destructive",
      });
      closeAllModals();
      setSelectedPayment(null);
      fetchPayments();
    } catch (error) {
      toast({
        title: "Failed to cancel payment",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  // Handle payment type selection change
  const handlePaymentTypeChange = (value: string) => {
    const typeId = parseInt(value);
    const selectedType = paymentTypes.find(type => type.id === typeId);
    
    if (selectedType) {
      setSelectedPaymentType(typeId);
      setSelectedPaymentTypeName(selectedType.name);
    }
  };

  // NEW — proof required for Bank Transfer OR Insurance
  const isProofRequired = () => {
    return (
      selectedPaymentTypeName === PAYMENT_TYPE_NAMES.BANK_TRANSFER ||
      selectedPaymentTypeName === PAYMENT_TYPE_NAMES.INSURANCE
    );
  };


  // Render status badge
  const renderStatusBadge = (status: string) => {
    return (
      <Badge variant="outline" className={cn("capitalize", statusColors[status])}>
        {status}
      </Badge>
    );
  };

  return (
    <DashboardLayout title="Payments" subtitle="Review and manage patient card payments">
      {/* FILTERS */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search" className="sr-only">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by patient name, card number, or reference..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="w-full md:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Auto-Prepared">Auto-Prepared</SelectItem>
                  <SelectItem value="Partially-Paid">Partially-Paid</SelectItem>
                  <SelectItem value="Requested">Requested</SelectItem>
                  <SelectItem value="Checked">Checked</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Payment Type Filter - ADDED */}
            <div className="w-full md:w-auto">
              <Select value={paymentTypeFilter} onValueChange={setPaymentTypeFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="All Payment Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payment Types</SelectItem>
                  <SelectItem value="no-type">No Payment Type</SelectItem>
                  {paymentTypes.map((type) => (
                    <SelectItem key={type.id} value={type.name}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              onClick={fetchPayments}
              className="mt-auto"
              disabled={isLoading}
            >
              <RefreshCw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* PAYMENTS TABLE */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>Payment Requests ({filteredPayments.length})</CardTitle>
            <div className="text-sm text-muted-foreground">
              Showing {filteredPayments.length} of {payments.length} payments
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <RefreshCw className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No payments found</h3>
              <p className="text-muted-foreground mt-2">
                {searchQuery || statusFilter !== "all" || paymentTypeFilter !== "all"
                  ? "Try adjusting your filters" 
                  : "No payment requests available"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-4 font-medium">Reference</th>
                    <th className="text-left p-4 font-medium">Patient</th>
                    <th className="text-left p-4 font-medium">Card</th>
                    <th className="text-left p-4 font-medium">Amount</th>
                    <th className="text-left p-4 font-medium">Payment Type</th> {/* NEW: Payment Type column */}
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <div className="font-mono text-sm">{payment.reference}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span>
                            {payment.requestedBy
                              ? `${payment.requestedBy.fName} ${payment.requestedBy.lName}`
                              : "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-muted-foreground" />
                          <span className="font-mono text-sm">
                            {payment.card?.cardNumber ?? "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 font-medium">
                          <DollarSign className="w-4 h-4" />
                          {payment.requestedAmount.toLocaleString()}
                        </div>
                      </td>
                      <td className="p-4">
                        {/* Payment Type Column - SIMPLE: just show the type */}
                        <div>
                          <span className="text-sm">
                            {getPaymentTypeDisplay(payment)}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        {/* Status Column - SIMPLE: just show the badge */}
                        {renderStatusBadge(payment.status)}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDetails(payment)}
                          >
                            <Eye className="w-4 h-4" />
                            <span className="sr-only">View</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* PAYMENT DETAILS DIALOG */}
      <Dialog open={!!selectedPayment} onOpenChange={(open) => !open && setSelectedPayment(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedPayment && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl flex items-center gap-3">
                  <FileCheck className="w-6 h-6 text-primary" />
                  Payment Details
                </DialogTitle>
                <DialogDescription>
                  {selectedPayment.reference}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Basic Information */}
                <div className="space-y-6">
                  {/* Payment Summary */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <DollarSign className="w-5 h-5" />
                        Payment Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Reference</p>
                          <p className="font-mono text-sm">{selectedPayment.reference}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Status</p>
                          <div className="mt-1">
                            {renderStatusBadge(selectedPayment.status)}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Requested Amount</p>
                          <p className="font-semibold">${selectedPayment.requestedAmount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Paid Amount</p>
                          <p className="font-semibold">${selectedPayment.paidAmount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Unpaid Amount</p>
                          <p className="font-semibold">${selectedPayment.unPaidAmount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Payment Type</p>
                          <div className="mt-1">
                            {(selectedPayment.status === "Requested" || 
                              selectedPayment.status === "Checked" || 
                              selectedPayment.status === "Approved" || 
                              selectedPayment.status === "Rejected") && (
                              <div>
                                <div className="mt-1">
                                  {selectedPayment.paymentType ? (
                                    <Badge variant="secondary">{selectedPayment.paymentType.name}</Badge>
                                  ) : selectedPayment.paymentTypeId ? (
                                    <Badge variant="secondary">
                                      {paymentTypes.find(t => t.id === selectedPayment.paymentTypeId)?.name || "Unknown"}
                                    </Badge>
                                  ) : (
                                    <span className="text-sm text-muted-foreground">Not specified</span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Insurance</p>
                          <Badge variant={selectedPayment.isInsuranceCovered ? "default" : "secondary"}>
                            {selectedPayment.isInsuranceCovered ? "Covered" : "Not Covered"}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Payment Proof Image */}
                  {selectedPayment.paymentProof && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <ImageIcon className="w-5 h-5" />
                          Payment Proof
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="border rounded-lg p-4 bg-muted/30">
                          <div className="flex justify-center">
                            <img 
                              src={getPaymentProofUrl(selectedPayment.paymentProof) || ""}
                              alt="Payment proof"
                              className="max-w-full h-auto max-h-96 object-contain rounded"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = `
                                    <div class="flex flex-col items-center justify-center p-8 text-center">
                                      <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
                                      <p class="text-muted-foreground">Unable to load payment proof image</p>
                                      <p class="text-sm text-muted-foreground mt-2">Filename: ${selectedPayment.paymentProof}</p>
                                    </div>
                                  `;
                                }
                              }}
                            />
                          </div>
                          <div className="mt-4 text-center">
                            <p className="text-sm text-muted-foreground break-all">
                              {selectedPayment.paymentProof}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Card Information */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        Card Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Card Number</p>
                        <p className="font-mono">{selectedPayment.card?.cardNumber}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Card Status</p>
                          <Badge variant="outline">{selectedPayment.card?.status}</Badge>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Expires</p>
                          <p className="text-sm">{formatDate(selectedPayment.card?.expiredAt || "")}</p>
                        </div>
                      </div>
                      {selectedPayment.card?.requestRemark && (
                        <div>
                          <p className="text-sm text-muted-foreground">Request Remark</p>
                          <p className="text-sm">{selectedPayment.card.requestRemark}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column - Timeline & Actions */}
                <div className="space-y-6">
                  {/* Request Information */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Request Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Requested By</p>
                        <p>
                          {selectedPayment.requestedBy?.fName} {selectedPayment.requestedBy?.lName}
                        </p>
                        {selectedPayment.requestedBy?.email && (
                          <p className="text-sm text-muted-foreground">{selectedPayment.requestedBy.email}</p>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Requested At</p>
                        <p className="text-sm">{formatDate(selectedPayment.requestedAt)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Created At</p>
                        <p className="text-sm">{formatDate(selectedPayment.createdAt)}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Status Timeline */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <CalendarDays className="w-5 h-5" />
                        Status History
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {selectedPayment.checkedAt && selectedPayment.checkedAt !== "0001-01-01T00:00:00" && (
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                          <div className="flex-1">
                            <p className="font-medium">Checked</p>
                            <p className="text-sm text-muted-foreground">
                              By {selectedPayment.checkedBy?.fName} {selectedPayment.checkedBy?.lName}
                            </p>
                            <p className="text-xs text-muted-foreground">{formatDate(selectedPayment.checkedAt)}</p>
                            {selectedPayment.checkRemark && (
                              <p className="text-sm mt-2 p-2 bg-muted rounded">{selectedPayment.checkRemark}</p>
                            )}
                          </div>
                        </div>
                      )}

                      {selectedPayment.approvedAt && selectedPayment.approvedAt !== "0001-01-01T00:00:00" && (
                        <div className="flex items-start gap-3">
                          <ShieldCheck className="w-5 h-5 text-green-500 mt-0.5" />
                          <div className="flex-1">
                            <p className="font-medium">Approved</p>
                            <p className="text-sm text-muted-foreground">
                              By {selectedPayment.approvedBy?.fName} {selectedPayment.approvedBy?.lName}
                            </p>
                            <p className="text-xs text-muted-foreground">{formatDate(selectedPayment.approvedAt)}</p>
                            {selectedPayment.approvalRemark && (
                              <p className="text-sm mt-2 p-2 bg-muted rounded">{selectedPayment.approvalRemark}</p>
                            )}
                          </div>
                        </div>
                      )}

                      {selectedPayment.rejectedAt && selectedPayment.rejectedAt !== "0001-01-01T00:00:00" && (
                        <div className="flex items-start gap-3">
                          <ShieldX className="w-5 h-5 text-red-500 mt-0.5" />
                          <div className="flex-1">
                            <p className="font-medium">Rejected</p>
                            <p className="text-xs text-muted-foreground">{formatDate(selectedPayment.rejectedAt)}</p>
                            {selectedPayment.rejectionRemark && (
                              <p className="text-sm mt-2 p-2 bg-muted rounded">{selectedPayment.rejectionRemark}</p>
                            )}
                          </div>
                        </div>
                      )}

                      {selectedPayment.canceledAt && selectedPayment.canceledAt !== "0001-01-01T00:00:00" && (
                        <div className="flex items-start gap-3">
                          <Ban className="w-5 h-5 text-red-500 mt-0.5" />
                          <div className="flex-1">
                            <p className="font-medium">Canceled</p>
                            <p className="text-xs text-muted-foreground">{formatDate(selectedPayment.canceledAt)}</p>
                            {selectedPayment.canceledRemark && (
                              <p className="text-sm mt-2 p-2 bg-muted rounded">{selectedPayment.canceledRemark}</p>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Action Buttons */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {getAvailableActions(selectedPayment.status).map((action) => (
                          <Button
                            key={action}
                            variant={
                              action === "cancel" || action === "reject" 
                                ? "destructive" 
                                : action === "request"
                                ? "secondary"
                                : "default"
                            }
                            size="sm"
                            onClick={() => {
                              if (action === "check") setShowCheckModal(true);
                              if (action === "approve") setShowApproveModal(true);
                              if (action === "reject") setShowRejectModal(true);
                              if (action === "cancel") setShowCancelModal(true);
                              if (action === "request") setShowRequestModal(true);
                            }}
                            className="capitalize"
                          >
                            {action === "check" && <CheckCircle className="w-4 h-4 mr-2" />}
                            {action === "approve" && <ShieldCheck className="w-4 h-4 mr-2" />}
                            {action === "reject" && <ShieldX className="w-4 h-4 mr-2" />}
                            {action === "cancel" && <Ban className="w-4 h-4 mr-2" />}
                            {action === "request" && <DollarSign className="w-4 h-4 mr-2" />}
                            {action}
                          </Button>
                        ))}
                        
                        {getAvailableActions(selectedPayment.status).length === 0 && (
                          <p className="text-sm text-muted-foreground italic">
                            No actions available for this status
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={() => setSelectedPayment(null)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* CHECK PAYMENT MODAL */}
      <Dialog open={showCheckModal} onOpenChange={setShowCheckModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Check Payment
            </DialogTitle>
            <DialogDescription>
              Verify the payment details for {selectedPayment?.reference}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="checkedAmount">Checked Amount *</Label>
              <Input
                id="checkedAmount"
                type="number"
                value={checkedAmount}
                onChange={(e) => setCheckedAmount(Number(e.target.value))}
                min="0"
              />
              <p className="text-sm text-muted-foreground">
                Original requested: ${selectedPayment?.requestedAmount.toLocaleString()}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="checkRemark">Check Remark *</Label>
              <Textarea
                id="checkRemark"
                placeholder="Enter verification notes..."
                value={checkRemark}
                onChange={(e) => setCheckRemark(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCheckModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCheckPayment}>
              <Check className="w-4 h-4 mr-2" />
              Check Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* APPROVE PAYMENT MODAL */}
      <Dialog open={showApproveModal} onOpenChange={setShowApproveModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              Approve Payment
            </DialogTitle>
            <DialogDescription>
              Approve the payment for {selectedPayment?.reference}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="approvedAmount">Approved Amount *</Label>
              <Input
                id="approvedAmount"
                type="number"
                value={approvedAmount}
                onChange={(e) => setApprovedAmount(Number(e.target.value))}
                min="0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="approvalRemark">Approval Remark *</Label>
              <Textarea
                id="approvalRemark"
                placeholder="Enter approval notes..."
                value={approvalRemark}
                onChange={(e) => setApprovalRemark(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleApprovePayment} className="bg-green-600 hover:bg-green-700">
              <ShieldCheck className="w-4 h-4 mr-2" />
              Approve Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* REJECT PAYMENT MODAL */}
      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldX className="w-5 h-5" />
              Reject Payment
            </DialogTitle>
            <DialogDescription>
              Reject the payment for {selectedPayment?.reference}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rejectionRemark">Rejection Reason *</Label>
              <Textarea
                id="rejectionRemark"
                placeholder="Enter reason for rejection..."
                value={rejectionRemark}
                onChange={(e) => setRejectionRemark(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleRejectPayment} variant="destructive">
              <X className="w-4 h-4 mr-2" />
              Reject Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CANCEL PAYMENT MODAL */}
      <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Ban className="w-5 h-5" />
              Cancel Payment
            </DialogTitle>
            <DialogDescription>
              Cancel the payment for {selectedPayment?.reference}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cancelRemark">Cancellation Reason *</Label>
              <Textarea
                id="cancelRemark"
                placeholder="Enter reason for cancellation..."
                value={cancelRemark}
                onChange={(e) => setCancelRemark(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCancelPayment} variant="destructive">
              <X className="w-4 h-4 mr-2" />
              Cancel Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* REQUEST PAYMENT MODAL */}
      <Dialog open={showRequestModal} onOpenChange={setShowRequestModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Request Payment
            </DialogTitle>
            <DialogDescription>
              Request payment for {selectedPayment?.reference}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="paymentType">Payment Type *</Label>
              <Select 
                value={selectedPaymentType.toString()} 
                onValueChange={handlePaymentTypeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment type" />
                </SelectTrigger>
                <SelectContent>
                  {paymentTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Show file upload only for Bank-Transfer */}
            {isProofRequired() && (
              <div className="space-y-2">
                <Label htmlFor="paymentProof">
                  Payment Proof (Screenshot/Receipt) *
                  <span className="text-muted-foreground text-sm ml-2">
                    Required for Bank-Transfer or Insurance payments
                  </span>
                </Label>
                
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    id="paymentProof"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  {paymentProofPreview ? (
                    <div className="space-y-4">
                      <div className="relative mx-auto max-w-xs">
                        <img
                          src={paymentProofPreview}
                          alt="Payment proof preview"
                          className="max-h-48 w-auto mx-auto rounded-md"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 p-0"
                          onClick={() => {
                            setPaymentProofFile(null);
                            setPaymentProofPreview(null);
                            if (fileInputRef.current) {
                              fileInputRef.current.value = '';
                            }
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {paymentProofFile?.name}
                      </p>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Upload bank transfer proof (screenshot or receipt)
                      </p>
                    </>
                  )}
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2"
                  >
                    {paymentProofPreview ? 'Change Image' : 'Select Image'}
                  </Button>
                  
                  <p className="text-xs text-muted-foreground mt-2">
                    Supported formats: JPG, PNG, GIF. Max size: 5MB
                  </p>
                </div>
                
                {isProofRequired() && !paymentProofFile && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    Payment proof is required for Bank-Transfer or Insurance payments
                  </p>
                )}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowRequestModal(false);
                setPaymentProofFile(null);
                setPaymentProofPreview(null);
                // Reset to default payment type
                const cashType = paymentTypes.find(t => t.name === PAYMENT_TYPE_NAMES.CASH);
                if (cashType) {
                  setSelectedPaymentType(cashType.id);
                  setSelectedPaymentTypeName(cashType.name);
                }
              }}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleRequestPayment}
              disabled={isUploading || (isProofRequired() && !paymentProofFile)}
            >
              {isUploading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <DollarSign className="w-4 h-4 mr-2" />
                  Request Payment
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default PaymentsPage;