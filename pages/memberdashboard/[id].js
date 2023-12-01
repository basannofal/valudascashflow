import Container from "@/component/Container";
import Header from "@/component/Header";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Dashboard from "@/component/MemberDashboard/Dashboard";
import MemberContainer from "@/component/MemberContainer";

const Index = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <MemberContainer id={id}>
      {/* Heading */}
      {/* <Header
        mainheading="Member Dashboard"
        tag1="Dashboard"
        tag2={"Member Details"}
        // icon={"bx-cloud-download"}
        // btnname={"Download Member Slip"}
        // btnlink=""
      /> */}
      {/* End Heading */}

      <Dashboard memberId={id} />
    </MemberContainer>
  );
};

export default Index;
