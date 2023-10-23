import { Button, Segment, Table } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { SyntheticEvent, useState } from "react";
import TransactionForm from "./form/TransactionForm";

export default observer(function TransactionList() {
  const { transactionStore } = useStore();
  const { transactionsByDate, deleteTransaction, loading } = transactionStore;

  const [target, setTarget] = useState("");

  function handleTransactionDelete(
    e: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) {
    setTarget(e.currentTarget.name);
    deleteTransaction(id);
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
              <Table.Cell disabled>
                <input placeholder={transaction.date.split("T")[0]} />
              </Table.Cell>
              <Table.Cell disabled>
                <input placeholder={transaction.name} />
              </Table.Cell>
              <Table.Cell disabled>
                <input placeholder="" />
              </Table.Cell>
              <Table.Cell disabled>
                <input placeholder={transaction.amount.toString()} />
              </Table.Cell>
              <Table.Cell>
                <Button name={transaction.id} color="grey" content="Edit" />
                <Button
                  name={transaction.id}
                  loading={loading && target === transaction.id}
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
