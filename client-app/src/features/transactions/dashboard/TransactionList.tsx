import {
  Button,
  Checkbox,
  CheckboxProps,
  Segment,
  Table,
} from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { ChangeEvent, FormEvent, SyntheticEvent, useState } from "react";
import TransactionForm from "./form/TransactionForm";
import { Transaction } from "../../../app/models/transaction";

export default observer(function TransactionList() {
  const { transactionStore } = useStore();
  const { transactionsByDate, deleteTransaction, loading, updateTransaction } =
    transactionStore;

  const [deleteTarget, setDeleteTarget] = useState("");
  const [updateTarget, setUpdateTarget] = useState("")

  const initialState = {
    id: "",
    name: "",
    date: "",
    amount: 0,
    isDisabled: true,
  };

  const [transaction, setTransaction] = useState(initialState);

  function handleTransactionDelete(
    e: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) {
    setDeleteTarget(e.currentTarget.name);
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

  return (
    <Segment>
      <Table textAlign="left" verticalAlign="middle" striped color="purple">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Date</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Note</Table.HeaderCell>
            <Table.HeaderCell>Amount</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {transactionsByDate.map((transaction) => (
            <Table.Row key={transaction.id}>
              <Table.Cell>
                <input
                  name="date"
                  placeholder={transaction.date.split("T")[0]}
                  onChange={(e) => handleInputChange(e, transaction)}
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
                  placeholder=""
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
                <Button
                  name={transaction.id}
                  loading={loading && updateTarget === transaction.id}
                  color="grey"
                  content="Update"
                  onClick={(e) => handleClick(e)}
                />
                <Button
                  name={transaction.id}
                  loading={loading && deleteTarget === transaction.id}
                  negative
                  content="Delete"
                  onClick={(e) => handleTransactionDelete(e, transaction.id)}
                />
              </Table.Cell>
            </Table.Row>
          ))}
          <TransactionForm />
        </Table.Body>
      </Table>
    </Segment>
  );
});
