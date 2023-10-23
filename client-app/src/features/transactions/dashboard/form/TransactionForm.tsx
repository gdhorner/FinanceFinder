import { observer } from "mobx-react-lite";
import { Button, Table } from "semantic-ui-react";
import { useStore } from "../../../../app/stores/store";
import { ChangeEvent, useState } from "react";

export default observer(function TransactionForm() {
  const { transactionStore } = useStore();

  const { createTransaction, updateTransaction, loading } = transactionStore;
  const initialState = {
    id: "",
    name: "",
    date: "",
    amount: 0,
  };

  const [transaction, setTransaction] = useState(initialState);

  function handleAdd() {
    createTransaction(transaction);
    console.log(transaction)
  }

  function handleInputChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;
    setTransaction({ ...transaction, [name]: value });
  }

  return (
    <Table.Row>
      <Table.Cell>
        <input name="date" placeholder="Date" required onChange={handleInputChange}/>
      </Table.Cell>
      <Table.Cell>
        <input name="name" placeholder="Name" required onChange={handleInputChange}/>
      </Table.Cell>
      <Table.Cell>
        <input name="note" placeholder="Note" onChange={handleInputChange}/>
      </Table.Cell>
      <Table.Cell>
        <input name="amount" placeholder="Amount" required onChange={handleInputChange}/>
      </Table.Cell>
      <Table.Cell>
        <Button positive floated="right" content="Add" onClick={handleAdd} loading={loading}/>
      </Table.Cell>
    </Table.Row>
  );
});
