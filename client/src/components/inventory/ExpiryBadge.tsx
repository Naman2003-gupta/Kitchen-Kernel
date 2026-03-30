interface ExpiryBadgeProps {
  expiryDate: string;
}

export default function ExpiryBadge({ expiryDate }: ExpiryBadgeProps) {
  // Compare dates only, ignore time
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  
  const diffDays = Math.round((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return (
    <span className="badge bg-kitchen-red/20 text-kitchen-red">Expired</span>
  );
  if (diffDays === 0) return (
    <span className="badge bg-kitchen-red/20 text-kitchen-red">Expires today</span>
  );
  if (diffDays === 1) return (
    <span className="badge bg-kitchen-red/20 text-kitchen-red">Expires tomorrow</span>
  );
  if (diffDays <= 3) return (
    <span className="badge bg-kitchen-yellow/30 text-yellow-700">Exp in {diffDays}d</span>
  );
  return (
    <span className="badge bg-kitchen-green/20 text-kitchen-green">Exp in {diffDays}d</span>
  );
}