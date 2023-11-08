import { Dropdown, DropdownProps, Input } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";


interface Props{
    categorySelection: string
    handleDropdown: any
}

export default function CategoryDropdown({categorySelection, handleDropdown}: Props) {
    const {transactionStore} = useStore();
    const {transactionCategories} = transactionStore;

  return (
    <Dropdown
      placeholder="Category"
      value={categorySelection}
      fluid
      options={transactionStore.transactionCategories}
      onChange={handleDropdown}
    >
    <Dropdown.Menu>
      <Input name='category'/>
      {transactionCategories.map((category) => (
        <Dropdown.Item text={category.text}/>
      ))}
      
    </Dropdown.Menu>
    </Dropdown>
  );
}
