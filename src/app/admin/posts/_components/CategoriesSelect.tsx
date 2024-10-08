import * as React from 'react';
import {
  Box,
  OutlinedInput,
  MenuItem,
  FormControl,
  Select,
  Chip,
  CircularProgress,
} from '@mui/material';
import { Category } from '@/types/Category';
import { useEffect } from 'react';

interface Props {
  selectedCategories: Category[];
  setSelectedCategories: (categories: Category[]) => void;
}

export const CategoriesSelect: React.FC<Props> = ({
  selectedCategories,
  setSelectedCategories,
}) => {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(true);

  const handleChange = (value: number[]) => {
    value.forEach((v: number) => {
      const isSelect = selectedCategories.some((c) => c.id === v)
      if (isSelect) {
        setSelectedCategories(selectedCategories.filter((c) => c.id !== v))
        return
      }

      const category = categories.find((c) => c.id === v)
      if (!category) return
      setSelectedCategories([...selectedCategories, category])
    })
  }

  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch('/api/admin/categories')
      const { categories } = await res.json()
      setCategories(categories)
      console.log(categories);
    }
    fetcher()
  }, [])

  return (
    <FormControl className="w-full">
      <Select
        multiple
        value={selectedCategories.map((c) => c.id)}
        onChange={(e) => handleChange(e.target.value as unknown as number[])}
        input={<OutlinedInput />}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selectedCategories.map((value: Category) => (
              <Chip key={value.id} label={value.name} />
            ))}
          </Box>
        )}
      >
        {categories?.map((category) => (
          <MenuItem key={category.id} value={category.id}>
            {category.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
