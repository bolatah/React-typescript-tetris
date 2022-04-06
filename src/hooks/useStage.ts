import React from "react";
import { createStage } from "../gameHelpers";

//types
import { PLAYER } from "./usePlayer";
import { STAGECELL, STAGE } from "../components/Stage/Stage";

export const useStage = (player: PLAYER, resetPlayer: () => void) => {
  const [stage, setStage] = React.useState(createStage());
  const [rowsCleared, setRowsCleared] = React.useState(0);

  const sweepRows = (newStage: STAGE): STAGE => {
    return newStage.reduce((ack, row) => {
      // if we don't find a 0 it means that the row is full and should be cleared
      if (row.findIndex((cell) => cell[0] === 0) === -1) {
        setRowsCleared((prev) => prev + 1);
        // create an empty row at the beginning of the array to push the tetrominos down
        // instead of returning the cleared row
        ack.unshift(
          new Array(newStage[0].length).fill([0, "clear"]) as STAGECELL[]
        );
        return ack;
      }
      ack.push(row);
      return ack;
    }, [] as STAGE);
  };

  React.useEffect(() => {
    if (!player.pos) return;
    setRowsCleared(0);
    const updateStage = (prevStage: STAGE): STAGE => {
      const newStage = prevStage.map(
        (row) =>
          row.map((cell) =>
            cell[1] === "clear" ? [0, "clear"] : cell
          ) as STAGECELL[]
      );
      // then draw the tetromino
      player.tetromino.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            newStage[y + player.pos.y][x + player.pos.x] = [
              value,
              `${player.collided ? "merged" : "clear"}`,
            ];
          }
        });
      });
      if (player.collided) {
        resetPlayer();
        return sweepRows(newStage);
      }
      return newStage;
    };
    setStage((prev) => updateStage(prev));
  }, [player.collided, player.pos?.x, player.pos?.y, player.tetromino]);

  return { stage, setStage, rowsCleared };
};
