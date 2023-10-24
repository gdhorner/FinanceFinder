import { ChangeEvent, SyntheticEvent, useRef, useState } from "react";
import { Button, Container, Menu } from "semantic-ui-react";
import { useStore } from "../stores/store";

export default function NavBar() {
  const { transactionStore } = useStore();
  const { importStatement } = transactionStore;
  const inputFile = useRef<HTMLInputElement | null>(null);

  function handleClick(e: SyntheticEvent<HTMLButtonElement>) {
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
            onClick={(e) => {
              handleClick(e);
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
      </Container>
    </Menu>
  );
}
