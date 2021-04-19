import React from "react";
import { Link, HashRouter as Router, Route, Switch } from "react-router-dom";

import * as examples from "./examples";

import "./index.css";

type ExampleWrapperProps = {
  title: string;
  Component: React.ComponentType;
};

const ExampleWrapper: React.FC<ExampleWrapperProps> = ({ title, Component }: ExampleWrapperProps) => {
  return (
    <>
      <h2 style={{ margin: "20px 0 0 0" }}>{title}</h2>
      <Link style={{ margin: "0 0 20px 0" }} to={"/"}>{"Back"}</Link>
      <Component/>
    </>
  );
};

const App: React.FC = () => {

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ margin: 0 }}><span style={{ background: "#f07000", color: "#ffffff", padding: "10px" }}>{"A WebGL Framework"}</span></h1>
      <Router>
        <Switch>
          <Route exact path={"/"} render={(): React.ReactElement => {
            return (
              <>
                <h2 style={{ marginLeft: "10px" }}>{"Examples"}</h2>
                <div style={{ display: "flex", flexDirection: "column", marginLeft: "10px" }}>
                  <h3>{"WebGL2"}</h3>
                  <h4>{"2D"}</h4>
                  <Link to={"/webgl2/2d/colored-quad"}>{"Colored Quad"}</Link>
                  <h3>{"WebGPU"}</h3>
                  <h4>{"2D"}</h4>
                  <Link to={"/webgpu/2d/colored-quad"}>{"Colored Quad"}</Link>
                </div>
              </>
            );
          }}/>
          {/*** WebGL2 ***/}
          {/* Basic */}
          <Route exact path={"/webgl2/2d/colored-quad"} render={(): React.ReactElement => <ExampleWrapper title={"Colored Quad"} Component={examples.webgl2.ColoredQuad}/>}/>

          {/*** WebGL2 ***/}
          {/* Basic */}
          <Route exact path={"/webgpu/2d/colored-quad"} render={(): React.ReactElement => <ExampleWrapper title={"Colored Quad"} Component={examples.webgpu.ColoredQuad}/>}/>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
