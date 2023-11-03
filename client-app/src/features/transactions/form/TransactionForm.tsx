import { observer } from "mobx-react-lite";
import { Button, Table } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { ChangeEvent, useState } from "react";
import { Transaction } from "../../../app/models/transaction";
import DatePicker from 'react-datepicker';

interface Props{
  accountId: string | undefined
}

export default observer(function TransactionForm({accountId}: Props) {
  const { transactionStore } = useStore();

  const { createTransaction, loading } = transactionStore;

  const [transaction, setTransaction] = useState<Transaction>({
    id: "",
    accountId: accountId!,
    date: null,
    name: "",
    note: "",
    category: "",
    amount: 0,
    isDisabled: true,
  });

  function handleAdd() {
    createTransaction(transaction);
  }

  function handleInputChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;
    setTransaction({ ...transaction, [name]: value });
  }

  function handleDateChange(date: Date | null): void {
    setTransaction({ ...transaction, date: date });
  }

  return (
    <Table.Row>
      <Table.Cell>
        <DatePicker
          name="date"
          placeholderText="Date"
          selected={transaction.date}
          onChange={(date) => handleDateChange(date)}
        />
      </Table.Cell>
      <Table.Cell>
        <input
          name="name"
          placeholder="Name"
          required
          onChange={handleInputChange}
        />
      </Table.Cell>
      <Table.Cell>
        <input name="note" placeholder="Note" onChange={handleInputChange} />
      </Table.Cell>
      <Table.Cell>
        <input
          name="category"
          placeholder="Category"
          onChange={handleInputChange}
        />
      </Table.Cell>
      <Table.Cell>
        <input
          name="amount"
          placeholder="Amount"
          required
          onChange={handleInputChange}
        />
      </Table.Cell>
      <Table.Cell>
        <Button
          positive
          floated="right"
          content="Add"
          onClick={handleAdd}
          loading={loading && transaction.id !== ""}
        />
      </Table.Cell>
    </Table.Row>
  );
});
