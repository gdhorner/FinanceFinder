import { List, Segment } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import { Account } from "../../app/models/account";
import { NavLink } from "react-router-dom";

export default function AccountList() {
  const { accountStore } = useStore();
  const { accountArr } = accountStore;

  return (
    <>
      <List selection verticalAlign="middle">
        {accountArr.map((account: Account) => (
          <List.Item as={NavLink} to={`/transactions/${account.id}`} key={account.id}>
            <List.Content>
              <List.Header>{account.name}</List.Header>
            </List.Content>
          </List.Item>
        ))}
      </List>
    </>
  );
}
