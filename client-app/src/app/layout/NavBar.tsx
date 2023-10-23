import { Button, Container, Menu } from 'semantic-ui-react';

export default function NavBar() {
    return (
        <Menu inverted fixed='left' vertical>
            <Container>
                <Menu.Item header>
                    Finance Finder
                </Menu.Item>
                <Menu.Item name="Transactions" />
                <Menu.Item>
                    <Button positive content='Create Account'/>
                </Menu.Item>
            </Container>
        </Menu>
    )
}