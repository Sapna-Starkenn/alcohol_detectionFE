import React from "react";

import Home from "./components/home/Home";
import "./App.css";

const App = () => {
  return (
    <>
      <Home />
      {/* <div>
        <h1>Data from Server:</h1>
        {dataFromServer.length !== 0 ? (
          <div>
            {dataFromServer.map((ele) => (
              <div>
                <p>{ele.acceleration}</p>
              </div>
            ))}
          </div>
        ) : (
          <></>
        )}
      </div> */}
    </>
  );
};

export default App;
