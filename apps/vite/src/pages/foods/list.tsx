import { useEffect, useMemo, useState } from "react";
import { Food, getFoods } from "../../features/foods/data/database";
import { VirtualList } from "@shared/react-ui";

export default function FoodList() {
  const [foods, setFoods] = useState<Food[]>([]);

  const multipleFoods = useMemo(() => {
    if (!foods.length) return [];
    return Array.from({ length: 1000 }, (_, i) => foods[i % foods.length]);
  }, [foods]);

  useEffect(() => {
    getFoods().then(({ data }) => {
      if (!data) return;
      setFoods(data);
    });
  }, []);

  return (
    <div className="px-4 py-2">
      <VirtualList items={multipleFoods} />
    </div>
  );
}
