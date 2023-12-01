import Container from "@/component/Container";
import Header from "@/component/Header";
import MemberList from "@/component/member/MemberList";
import ErrorBoundary from "../ErrorBoundary";

const index = () => {
  return (
    <Container>
      {/* Heading */}
      <Header
        mainheading="Member List"
        tag1="memberlist"
        icon="bx-plus"
        btnname="Add Member"
        btnlink="/addmember"
      />
      {/* End Heading */}

      <ErrorBoundary>
        <MemberList />
      </ErrorBoundary>
    </Container>
  );
};

export default index;
