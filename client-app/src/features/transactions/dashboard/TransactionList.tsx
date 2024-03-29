import { Button, Icon, Segment, Table } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { ChangeEvent, SyntheticEvent, useState } from "react";
import TransactionForm from "../form/TransactionForm";
import { Transaction } from "../../../app/models/transaction";
import DatePicker from "react-datepicker";

interface Props {
  transactions: Transaction[];
  accountId: string | undefined;
}

export default observer(function TransactionList({
  transactions,
  accountId,
}: Props) {
  const { transactionStore } = useStore();
  const { deleteTransaction, loading, updateTransaction } = transactionStore;

  const [deleteTarget, setDeleteTarget] = useState("");
  const [updateTarget, setUpdateTarget] = useState("");

  const [transaction, setTransaction] = useState<Transaction>({
    id: "",
    accountId: accountId!,
    date: new Date(),
    name: "",
    note: "",
    category: "",
    amount: 0,
    isDisabled: true,
  });

  function handleTransactionDelete(id: string) {
    setDeleteTarget(id);
    deleteTransaction(id);
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>, t: Transaction) {
    const { name, value } = e.currentTarget;
    setTransaction({ ...t, [name]: value });
  }

  function handleClick(e: SyntheticEvent<HTMLButtonElement>) {
    setUpdateTarget(e.currentTarget.name);
    updateTransaction(transaction);
  }

  function handleDateChange(
    date: Date | null,
    e: SyntheticEvent<any, Event> | undefined,
    t: Transaction
  ) {
    setTransaction({ ...transaction, date: date });
  }

  return (
    <Segment >
      <Table textAlign="left" verticalAlign="middle" striped color="purple">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Date</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Note</Table.HeaderCell>
            <Table.HeaderCell>Category</Table.HeaderCell>
            <Table.HeaderCell>Amount</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {transactions && transactions.map((transaction) => (
            <Table.Row key={transaction.id}>
              <Table.Cell>
                <DatePicker
                  name="date"
                  dateFormat="MM-dd-yyyy"
                  placeholderText="Date"
                  selected={new Date(transaction.date!)}
                  onChange={(date, e) => handleDateChange(date, e, transaction)}
                />
              </Table.Cell>
              <Table.Cell>
                <input
                  name="name"
                  placeholder={transaction.name}
                  onChange={(e) => handleInputChange(e, transaction)}
                />
              </Table.Cell>
              <Table.Cell>
                <input
                  name="note"
                  placeholder={transaction.note}
                  onChange={(e) => handleInputChange(e, transaction)}
                />
              </Table.Cell>
              <Table.Cell>
                <input
                  name="category"
                  placeholder={transaction.category}
                  onChange={(e) => handleInputChange(e, transaction)}
                />
              </Table.Cell>
              <Table.Cell>
                <input
                  name="amount"
                  placeholder={transaction.amount.toString()}
                  onChange={(e) => handleInputChange(e, transaction)}
                />
              </Table.Cell>
              <Table.Cell>
                <Icon
                  name="x"
                  className={transaction.id}
                  link
                  onClick={() => handleTransactionDelete(transaction.id)}
                  loading={loading && deleteTarget === transaction.id}
                />
              </Table.Cell>
            </Table.Row>
          ))}
          {accountId && <TransactionForm accountId={accountId} />}
        </Table.Body>
      </Table>
    </Segment>
  );
});
