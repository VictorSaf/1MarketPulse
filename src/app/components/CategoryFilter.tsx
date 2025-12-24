import { Badge } from './ui/badge';

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({ categories, activeCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 px-4 hide-scrollbar">
      {categories.map((category) => (
        <Badge
          key={category}
          variant={activeCategory === category ? 'default' : 'outline'}
          className={`cursor-pointer whitespace-nowrap px-4 py-2 ${
            activeCategory === category
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
          }`}
          onClick={() => onCategoryChange(category)}
        >
          {category}
        </Badge>
      ))}
    </div>
  );
}
