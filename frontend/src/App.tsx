import { Button } from "./components/common/Button/Button";
import Navbar from "./components/Navbar/Navbar";
import "./styles/App.scss";

function App() {
  return (
    <>
      <Navbar />
      <div style={{ margin: "1.5rem 2.5rem" }}>
        <div style={{ fontSize: "5rem", fontWeight: "900" }}>
          Five small rituals
          <br />
          <span style={{ color: "#d8411f" }}>before</span> nine a.m.
        </div>
        <Button
          variant="outline"
          size="md"
          style={{ marginInlineEnd: ".5rem" }}
        >
          REMOVE
        </Button>
        <Button
          variant="primary"
          size="md"
          data-tooltip="Testing tooltip :)"
          data-tooltip-follow
          data-tp-pos="bottom"
        >
          MESSAGE
        </Button>
      </div>
    </>
  );
}

export default App;
