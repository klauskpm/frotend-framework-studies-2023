import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../../supabaseClient";
import { Database } from "../../../supabase";
import { Link } from "react-router-dom";
import * as Tabs from '@radix-ui/react-tabs';
import { useVirtualizer } from '@tanstack/react-virtual';

export type Food = Database["public"]["Tables"]["foods"]["Row"];

async function getFoods() {
  const countResponse = await supabase.from("foods").select('*', { count: 'exact', head: true });
  const paginatedFoodsResponse = await supabase.from("foods").select('*').range(0, 4);
  return {
    data: paginatedFoodsResponse.data,
    count: countResponse.count,
    error: paginatedFoodsResponse.error && countResponse.error,
  };
}

async function deleteFood(id: number) {
  const { data, error } = await supabase.from("foods").delete().eq("id", id);

  if (error) {
    throw error;
  } else {
    return data;
  }
}

const VirtualList = ({ items }: any) => {
  const parentRef = useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
  });

  return (
    <div
      ref={parentRef}
      style={{
        height: `400px`,
        overflow: 'auto', // Make it scroll!
      }}
    >
      <ul
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => (
          <li
            key={virtualRow.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <Link to={`/foods/${items[virtualRow.index].id}`} className="link-primary link">
              {items[virtualRow.index].title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function Foods() {
  const [count, setCount] = useState(0);
  const [foods, setFoods] = useState<Food[]>([]);
  const multipleFoods = useMemo(() => {
    if (!foods.length) return [];
    return Array.from({ length: 1000 }, (_, i) => foods[i%foods.length]);
  }, [foods]);

  const handleClickDelete = (id: number) => {
    deleteFood(id).then(() => {
      setFoods(foods.filter((food) => food.id !== id));
    });
  };

  useEffect(() => {
    getFoods().then(({ data, count }) => {
      if (!data || count === null) return;
      setFoods(data);
      setCount(count);
    });
  }, []);

  return (
    <div>
      <h1>Foods</h1>
      <Link to={"/foods/create"} className="link-primary link" role="button">
        Create new food
      </Link>

      <Tabs.Root
        className="flex flex-col w-3/5"
        defaultValue="table"
      >
        <Tabs.List className="tabs" aria-label="Manage your account">
          <Tabs.Trigger
            className="tab tab-bordered data-[state=active]:tab-active"
            value="table"
          >
            Table
          </Tabs.Trigger>
          <Tabs.Trigger
            className="tab tab-bordered data-[state=active]:tab-active"
            value="list"
          >
            List
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content
          className="grow p-5 rounded-b-md outline-none"
          value="table"
        >
          <div>Total: {count}</div>
          <div className="w-full">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Title</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {foods.map((food: any) => (
                  <tr key={food.id}>
                    <td>
                      <Link to={`/foods/${food.id}`} className="link-primary link">
                        {food.title}
                      </Link>
                    </td>
                    <td>
                      <button
                        className="btn-error btn-sm btn"
                        onClick={() => handleClickDelete(food.id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="h-6 w-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td>Title</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
            <Pagination />
          </div>
        </Tabs.Content>
        <Tabs.Content
          className="grow p-5 rounded-b-md outline-none"
          value="list"
        >
          <VirtualList items={multipleFoods} />
        </Tabs.Content>
      </Tabs.Root>
      
    </div>
  );
}
function Pagination() {
  return <div className="btn-group">
    <button className="btn">1</button>
    <button className="btn btn-active">2</button>
    <button className="btn">3</button>
    <button className="btn">4</button>
  </div>;
}

