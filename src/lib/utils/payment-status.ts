export const paymentStatuses = {
  "Auto-Prepared": "auto-prepared",
  "Partially-Paid": "partially-paid",
  "Requested": "requested", 
  "Checked": "checked",
  "Approved": "approved",
  "Rejected": "rejected",
} as const;

export type PaymentStatus = keyof typeof paymentStatuses;

export const statusColors: Record<string, string> = {
  "Auto-Prepared": "bg-blue-100 text-blue-800 border-blue-200",
  "Partially-Paid": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Requested": "bg-purple-100 text-purple-800 border-purple-200",
  "Checked": "bg-orange-100 text-orange-800 border-orange-200",
  "Approved": "bg-green-100 text-green-800 border-green-200",
  "Rejected": "bg-red-100 text-red-800 border-red-200",
};

export const statusIcons = {
  "Auto-Prepared": "Clock",
  "Partially-Paid": "DollarSign",
  "Requested": "AlertCircle",
  "Checked": "CheckCircle",
  "Approved": "ShieldCheck",
  "Rejected": "ShieldX",
} as const;

export const getAvailableActions = (status: string): string[] => {
  switch (status) {
    case "Requested":
      return ["check", "cancel"];
    case "Checked":
      return ["approve", "reject"];
    case "Auto-Prepared":
    case "Partially-Paid":
      return ["cancel"];
    default:
      return [];
  }
};

export const formatDate = (dateString: string): string => {
  if (!dateString || dateString === "0001-01-01T00:00:00") return "N/A";
  return new Date(dateString).toLocaleString();
};