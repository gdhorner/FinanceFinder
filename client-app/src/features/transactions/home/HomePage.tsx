import { Link } from "react-router-dom";
import { Button, Container, Header, Segment } from "semantic-ui-react";

export default function HomePage() {
  return (
    <Segment inverted textAlign="center" vertical className="masthead">
      <Container type="text">
        <Header as="h1" inverted>
          Finance Finder
        </Header>
        <Header as="h2" inverted content="Welcome to Finance Finder " />
        <Button as={Link} to="/transactions/allaccounts" size="huge" inverted>
          Take me to the Transactions!
        </Button>
      </Container>
    </Segment>
  );
}
