// Icon mapping based on title keywords
export const getIconForTitle = (title) => {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('po') && lowerTitle.includes('approval')) return 'FileCheck';
  if (lowerTitle.includes('cash')) return 'Wallet';
  if (lowerTitle.includes('credit')) return 'CreditCard';
  if (lowerTitle.includes('price')) return 'Tag';
  if (lowerTitle.includes('goods')) return 'PackageCheck';
  if (lowerTitle.includes('inter-company')) return 'Building2';
  if (lowerTitle.includes('sales return')) return 'RotateCcw';
  if (lowerTitle.includes('gate pass')) return 'DoorOpen';
  if (lowerTitle.includes('product creation')) return 'Boxes';
  if (lowerTitle.includes('customer creation')) return 'UserPlus';
  if (lowerTitle.includes('wastage')) return 'Trash2';
  if (lowerTitle.includes('work order')) return 'ClipboardList';
  if (lowerTitle.includes('pfl')) return 'Factory';
  if (lowerTitle.includes('roll cutt')) return 'Scissors';
  if (lowerTitle.includes('expat travel')) return 'Plane';
  if (lowerTitle.includes('sales pi')) return 'ReceiptText';
  if (lowerTitle.includes('purchase pi')) return 'ShoppingCart';
  if (lowerTitle.includes('apparels')) return 'Shirt';
  if (lowerTitle.includes('approval head')) return 'ShieldCheck';
  if (lowerTitle.includes('overtime')) return 'Clock';
  if (lowerTitle.includes('encashment')) return 'HandCoins';
  if (lowerTitle.includes('bonce purchase')) return 'ShoppingCart';
  if (lowerTitle.includes('bond release')) return 'LockKeyhole';
  
  return 'LayoutDashboard'; // Default icon
};