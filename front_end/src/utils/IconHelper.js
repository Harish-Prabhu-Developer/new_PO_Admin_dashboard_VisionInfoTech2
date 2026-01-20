// Icon mapping based on title keywords
export const getIconForTitle = (title) => {
  const lowerTitle = title.toLowerCase();

  // Procurement & Orders
  if (lowerTitle.includes('po') && lowerTitle.includes('approval')) return 'FileCheck';
  if (lowerTitle.includes('purchase order')) return 'FileSignature';
  if (lowerTitle.includes('sales pi')) return 'ReceiptText';
  if (lowerTitle.includes('purchase pi')) return 'ShoppingCart';
  if (lowerTitle.includes('work order')) return 'ClipboardList';

  // Finance & Accounting
  if (lowerTitle.includes('cash')) return 'Wallet';
  if (lowerTitle.includes('credit')) return 'CreditCard';
  if (lowerTitle.includes('price')) return 'Tag';
  if (lowerTitle.includes('encashment')) return 'HandCoins';
  if (lowerTitle.includes('invoice')) return 'Receipt';
  if (lowerTitle.includes('budget')) return 'PiggyBank';
  if (lowerTitle.includes('tax')) return 'Landmark';

  // Inventory & Products
  if (lowerTitle.includes('goods')) return 'PackageCheck';
  if (lowerTitle.includes('product creation')) return 'Boxes';
  if (lowerTitle.includes('wastage')) return 'Trash2';
  if (lowerTitle.includes('inventory')) return 'Warehouse';
  if (lowerTitle.includes('stock')) return 'Container';
  if (lowerTitle.includes('apparels')) return 'Shirt';
  if (lowerTitle.includes('roll cutt')) return 'Scissors';

  // Operations & Manufacturing
  if (lowerTitle.includes('pfl')) return 'Factory';
  if (lowerTitle.includes('production')) return 'Hammer';
  if (lowerTitle.includes('maintenance')) return 'Wrench';
  if (lowerTitle.includes('quality')) return 'Microscope';

  // Logistics & Travel
  if (lowerTitle.includes('sales return')) return 'RotateCcw';
  if (lowerTitle.includes('gate pass')) return 'DoorOpen';
  if (lowerTitle.includes('expat travel')) return 'Plane';
  if (lowerTitle.includes('logistics')) return 'Truck';
  if (lowerTitle.includes('shipping')) return 'Ship';

  // HR & Administration
  if (lowerTitle.includes('customer creation')) return 'UserPlus';
  if (lowerTitle.includes('inter-company')) return 'Building2';
  if (lowerTitle.includes('approval head')) return 'ShieldCheck';
  if (lowerTitle.includes('overtime')) return 'Clock';
  if (lowerTitle.includes('bond release')) return 'LockKeyhole';
  if (lowerTitle.includes('employee')) return 'Users';
  if (lowerTitle.includes('meeting')) return 'Presentation';

  // General
  if (lowerTitle.includes('report')) return 'FileBarChart';
  if (lowerTitle.includes('chart')) return 'PieChart';
  if (lowerTitle.includes('notification')) return 'Bell';
  if (lowerTitle.includes('setting')) return 'Settings';

  return 'LayoutDashboard'; // Default icon
};