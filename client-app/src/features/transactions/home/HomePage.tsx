import { Link } from "react-router-dom";
import { Button, Container, Header, Image, Segment } from "semantic-ui-react";

export default function HomePage() {
  return (
    <Segment inverted textAlign="center" vertical className="masthead">
      <Container type="text">
        <Header as="h1" inverted>
          <Image
            size="massive"
            src="assets/logo.png"
            alt="logo"
            style={{ marginBottom: 12 }}
          />
          Finance Finder
        </Header>
        <Header as="h2" inverted content="Welcome to Finance Finder " />
        <Button as={Link} to="/transactions" size="huge" inverted>
          Take me to the Transactions!
        </Button>
      </Container>
    </Segment>
  );
}
