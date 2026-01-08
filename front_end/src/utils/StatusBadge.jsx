import { CheckCircle, Clock, XCircle } from "lucide-react";

/**
 * StatusBadge component to display finalStatus with appropriate color.
 */
const StatusBadge = ({ status, className = '' }) => {
  let color = 'bg-gray-200 text-gray-800';
  let icon = <Clock className="w-3 h-3" />;

  switch (status.toUpperCase()) {
    case 'APPROVED':
      color = 'bg-green-100 text-green-700 border border-green-200';
      icon = <CheckCircle className="w-3 h-3 fill-green-500 text-green-500" />;
      break;
    case 'HOLD':
      color = 'bg-yellow-100 text-yellow-700 border border-yellow-200';
      icon = <Clock className="w-3 h-3 fill-yellow-500 text-yellow-500" />;
      break;
    case 'REJECTED':
      color = 'bg-red-100 text-red-700 border border-red-200';
      icon = <XCircle className="w-3 h-3 fill-red-500 text-red-500" />;
      break;
    case 'PENDING':
    default:
      color = 'bg-blue-100 text-blue-700 border border-blue-200';
      icon = <Clock className="w-3 h-3 fill-blue-500 text-blue-500" />;
  }

  return (
    <div className={`inline-flex items-center space-x-1 px-3 py-1 text-xs font-medium rounded-full ${color} ${className}`}>
      {icon}
      <span>{status}</span>
    </div>
  );
};


export default StatusBadge;