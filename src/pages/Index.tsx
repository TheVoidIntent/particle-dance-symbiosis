
import React from "react";
import { Helmet } from "react-helmet";
import HomePage from "./HomePage";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>IntentSim | Universe Simulation</title>
        <meta name="description" content="Explore the universe simulation with emergent complexity" />
      </Helmet>
      <HomePage />
    </>
  );
};

export default Index;
