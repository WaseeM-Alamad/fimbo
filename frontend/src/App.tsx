import { Button } from "./components/Button/Button";
import "./styles/App.scss";

function App() {
  return (
    <div style={{ margin: "1.5rem 2.5rem" }}>
      <div style={{ fontSize: "5rem", fontWeight: "900" }}>
        Five small rituals
        <br />
        <span style={{ color: "#d8411f" }}>before</span> nine a.m.
      </div>
      <Button variant="primary" size="lg">CONFIRM</Button>
    </div>
  );
}

export default App;
