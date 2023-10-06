type GroceryItem = {
  $id?: string;
  title?: string;
  img?: string;
  unit?: string;
  container?: string;
  unitsPerContainer?: number;
  servingsPerContainer?: number;
  whereToBuy?: string[];
  avgPrice?: number;
  inputValue?: any;
};
export type { GroceryItem };
