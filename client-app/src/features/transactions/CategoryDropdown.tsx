import { Dropdown, DropdownProps } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";


interface Props{
    categorySelection: string
    handleDropdown: any
}

export default function CategoryDropdown({categorySelection, handleDropdown}: Props) {
    const {transactionStore} = useStore();

  return (
    <Dropdown
      placeholder="Category"
      value={categorySelection}
      fluid
      options={transactionStore.transactionCategories}
      onChange={handleDropdown}
    />
  );
}
