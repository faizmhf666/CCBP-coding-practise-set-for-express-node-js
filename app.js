const express = require("express");
const app = express();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is running");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

const convertSnakeToCamel = (dbObject) => {
  return {
    playerId: dbObject["player_id"],
    playerName: dbObject["player_name"],
    jerseyNumber: dbObject["jersey_number"],
    role: dbObject["role"],
  };
};

app.get("/players/", async (request, response) => {
  const getPlayerQuery = `
    SELECT 
    *
    FROM 
    cricket_team 
    ORDER BY 
    player_id;`;
  const playerList = await db.all(getPlayerQuery);
  response.send(
    playerList.map((eachPlayer) => convertSnakeToCamel(eachPlayer))
  );
});

app.get("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `
    SELECT
         *
    FROM
         cricket_team 
    WHERE
         player_id= ${playerId};`;
  const playerList = await db.get(getPlayerQuery);
  response.send(
    playerList.map((eachPlayer) => convertSnakeToCamel(eachPlayer))
  );
});

module.exports = app;
