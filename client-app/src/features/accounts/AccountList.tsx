import {  Menu } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import { Account } from "../../app/models/account";

export default function AccountList() {
  const { accountStore } = useStore();
  const { accountArr } = accountStore;

  return (
    <Menu inverted fixed="left" vertical>
      {accountArr.map((account: Account) => (
          <Menu.Item styles={{color: 'red'}}key={account.id}>{account.name}</Menu.Item>
      ))}
    </Menu>
  );
}
