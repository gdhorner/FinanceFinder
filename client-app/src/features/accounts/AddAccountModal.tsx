import { Button, Modal } from "semantic-ui-react";
import { ChangeEvent, useState } from "react";
import { useStore } from "../../app/stores/store";
import { Account } from "../../app/models/account";

export default function AddAccountModal() {
  const [open, setOpen] = useState(false);
  const { accountStore } = useStore();
  const { createAccount } = accountStore;

  const [account, setAccount] = useState<Account>({
    id: "",
    name: "",
    type: "",
  });

  function handleClick(): void {
    createAccount(account);
    setOpen(false);
  }

  function handleInputChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;
    setAccount({ ...account, [name]: value });
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>Add Account</Button>

      <Modal size="tiny" open={open} onClose={() => setOpen(false)}>
        <Modal.Header>Add Account</Modal.Header>
        <Modal.Content>
          <input
            className="ui form"
            name="name"
            placeholder="Name"
            required
            onChange={handleInputChange}
          ></input>
          <input
            className="ui form"
            name="type"
            placeholder="Type"
            required
            onChange={handleInputChange}
          ></input>
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={() => setOpen(false)}>
            No
          </Button>
          <Button positive onClick={handleClick}>
            Yes
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
}
