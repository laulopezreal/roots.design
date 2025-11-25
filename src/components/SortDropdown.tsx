import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import type { ProductSort } from '../hooks/useProducts';

interface SortDropdownProps {
  value: ProductSort | undefined;
  onChange: (sort: ProductSort | null) => void;
}

const sortOptions = [
  { value: 'default', label: 'Default' },
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
  { value: 'price-asc', label: 'Price (Low to High)' },
  { value: 'price-desc', label: 'Price (High to Low)' },
  { value: 'created_at-desc', label: 'Newest First' },
];

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  const currentValue = value
    ? `${value.field}-${value.order}`
    : 'default';

  const handleChange = (newValue: string) => {
    if (newValue === 'default') {
      onChange(null);
      return;
    }

    const [field, order] = newValue.split('-') as [ProductSort['field'], ProductSort['order']];
    onChange({ field, order });
  };

  return (
    <Select value={currentValue} onValueChange={handleChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        {sortOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
