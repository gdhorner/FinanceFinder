import { observer } from "mobx-react-lite";
import { Button, Dropdown, DropdownProps, Table } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import { Transaction } from "../../../app/models/transaction";
import DatePicker from "react-datepicker";
import { Account } from "../../../app/models/account";
import CategoryDropdown from "../CategoryDropdown";

interface Props {
  accountId: string | undefined;
}

export default observer(function TransactionForm({ accountId }: Props) {
  const { accountStore, transactionStore } = useStore();

  const { createTransaction, loading } = transactionStore;

  const initialTransaction = {
    id: "",
    accountId: accountId!,
    date: null,
    name: "",
    note: "",
    category: "",
    amount: 0,
    isDisabled: true,
  };

  const [transaction, setTransaction] =
    useState<Transaction>(initialTransaction);
  const [account, setAccount] = useState<Account>();

  useEffect(() => {
    let account = accountStore.accountRegistry.get(accountId!);
    setAccount(account);
  }, []);

  function handleAdd() {
    createTransaction(transaction).then(() => {
      let transactionAmount = transaction.amount;
      let acc = account;
      acc!.balance += transactionAmount;
      setAccount(acc);
      setTransaction(initialTransaction);
    });
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

  function handleDropdown(
    event: SyntheticEvent<HTMLElement, Event>,
    data: DropdownProps
  ): void {
    let category = data.value?.toString();
    if (category) {
      setTransaction({ ...transaction, category: category });
    }
    console.log(data.value);
  }

  return (
    <Table.Row>
      <Table.Cell>
        <DatePicker
          name="date"
          placeholderText="Date"
          selected={transaction.date}
          onChange={(date) => handleDateChange(date)}
          dateFormat="MM-dd-yyyy"
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
        <CategoryDropdown
          categorySelection={transaction.category}
          handleDropdown={handleDropdown}
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
