import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  XCircle, 
  DollarSign,
  ShieldCheck,
  ShieldX 
} from "lucide-react";

interface StatusIndicatorProps {
  status: string;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  showLabel?: boolean;
}

export const StatusIndicator = ({ 
  status, 
  size = "md", 
  showIcon = true, 
  showLabel = true 
}: StatusIndicatorProps) => {
  const statusConfig = {
    "Auto-Prepared": {
      icon: Clock,
      label: "Auto-Prepared",
      color: "bg-blue-100 text-blue-800 border-blue-200",
      iconColor: "text-blue-600",
    },
    "Partially-Paid": {
      icon: DollarSign,
      label: "Partially Paid",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      iconColor: "text-yellow-600",
    },
    "Requested": {
      icon: AlertCircle,
      label: "Requested",
      color: "bg-purple-100 text-purple-800 border-purple-200",
      iconColor: "text-purple-600",
    },
    "Checked": {
      icon: CheckCircle,
      label: "Checked",
      color: "bg-orange-100 text-orange-800 border-orange-200",
      iconColor: "text-orange-600",
    },
    "Approved": {
      icon: ShieldCheck,
      label: "Approved",
      color: "bg-green-100 text-green-800 border-green-200",
      iconColor: "text-green-600",
    },
    "Rejected": {
      icon: ShieldX,
      label: "Rejected",
      color: "bg-red-100 text-red-800 border-red-200",
      iconColor: "text-red-600",
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || {
    icon: AlertCircle,
    label: status,
    color: "bg-gray-100 text-gray-800 border-gray-200",
    iconColor: "text-gray-600",
  };

  const Icon = config.icon;
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <Badge 
      variant="outline" 
      className={cn(
        "inline-flex items-center gap-1.5",
        config.color,
        sizeClasses[size]
      )}
    >
      {showIcon && <Icon className={cn("w-3.5 h-3.5", config.iconColor)} />}
      {showLabel && config.label}
    </Badge>
  );
};