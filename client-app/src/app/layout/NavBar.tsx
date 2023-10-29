import { ChangeEvent, useRef } from "react";
import { Button, Container, Menu } from "semantic-ui-react";
import { useStore } from "../stores/store";
import { NavLink } from "react-router-dom";
import AccountList from "../../features/accounts/AccountList";
import { Account } from "../models/account";

export default function NavBar() {
  const { transactionStore, accountStore } = useStore();
  const { importStatement } = transactionStore;
  const inputFile = useRef<HTMLInputElement | null>(null);
  const { accountArr } = accountStore;
  function handleClick() {
    inputFile.current?.click();
  }

  async function handleOnChange(
    event: ChangeEvent<HTMLInputElement>
  ): Promise<void> {
    if (!event.target.files) return;
    let file = event.target.files[0];
    importStatement(file);
  }

  return (
    <Menu inverted fixed="left" vertical>
      <Container>
        <Menu.Item header>Finance Finder</Menu.Item>
        <Menu.Item name="Transactions" />
        <Menu.Item>
          <Button
            positive
            content="Import Statement"
            onClick={() => {
              handleClick();
            }}
          />
          <input
            type="file"
            id="file"
            ref={inputFile}
            style={{ display: "none" }}
            onChange={handleOnChange}
          />
        </Menu.Item>
        <Menu.Item as={NavLink} to="/errors" name='Errors'/>
        {accountArr.map((account: Account) => (
          <Menu.Item styles={{color: 'red'}}key={account.id}>{account.name}</Menu.Item>
      ))}
      </Container>
    </Menu>
  );
}
