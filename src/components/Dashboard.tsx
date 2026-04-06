import { useState } from "react";
import SalesStackedBar from "./SalesStackedBar";

function Dashboard() {
  const [currentGroup, setCurrentGroup] = useState<string>("genre");

  return (
    <div className="dashboard">
      <header>
        <h1>Game Sales Analytics</h1>
        <select
          value={currentGroup}
          onChange={(e) => setCurrentGroup(e.target.value)}
        >
          <option value="genre">By Genre</option>
          <option value="platform">By Platform</option>
          <option value="publisher">By Publisher</option>
        </select>
      </header>

      <SalesStackedBar group={currentGroup} />
    </div>
  );
}

export default Dashboard;
