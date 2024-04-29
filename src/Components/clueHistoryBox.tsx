import {
  Table,
  TableContainer,
  TableCell,
  TableBody,
  TableRow,
  TableHead,
  Box,
} from '@mui/material';
import { useGameContext } from '../contextProvider';

export function cluesHistory() {
  const { game } = useGameContext();
  return (
    <TableContainer className="turnstable">
      <Table stickyHeader aria-label="simple table">
        <colgroup>
          <col width="15%" />
          <col width="15%" />
          <col width="5%" />
          <col width="65%" />
        </colgroup>
        <TableHead>
          <TableRow>
            <TableCell align="left">
              {game.playerCount === 2 ? `Spy` : `Spymaster`}
            </TableCell>
            <TableCell align="left">Clue</TableCell>
            <TableCell align="left">To Find</TableCell>
            <TableCell align="left">Guesses Made</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {game.clues.length > 0
            ? game.clues
                .slice(0)
                .reverse()
                .map((oldclue, index) => (
                  <TableRow
                    key={`${oldclue}${index}`}
                    // sx={{
                    //   "&:last-child td, &:last-child th": { border: 0 },
                    // }}
                  >
                    <TableCell align="left">
                      {clueGiver(oldclue.clueGiverIndex)}
                    </TableCell>
                    <TableCell align="left">
                      <Box className="guess guess--last">
                        {oldclue.clueWord}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box className="cluecount">{oldclue.clueWordCount}</Box>
                    </TableCell>
                    <TableCell align="left">
                      {cluesHistoryBox(
                        oldclue.clueGiverIndex,
                        oldclue.clueGuesses
                      )}
                    </TableCell>
                  </TableRow>
                ))
            : null}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function cluesHistoryBox(clueGiverIndex: number, clueguesses: string[]) {
  return (
    <Box
      className="guesses"
      sx={{
        display: 'flex',
        alignContent: 'flex-start',
        flexWrap: 'wrap',
      }}
    >
      {clueguesses.map((i, index) => (
        <Box
          key={`oldclue-box-${index}`}
          className={`guess guess--${findCluesColor(clueGiverIndex, i)}`}
        >
          {i}
        </Box>
      ))}
    </Box>
  );
}

function findCluesColor(clueGiver: number, word: string) {
  const { game } = useGameContext();
  const i = game.words.indexOf(word);
  if (game.playerCount === 4) {
    return game.revealed[i];
  }
  if (game.playerCount === 2) {
    if (game.revealed[i] !== undefined) {
      return game.revealed[i][clueGiver === 0 ? 0 : 1];
    }
  }
}
function clueGiver(userPos: number) {
  const { game } = useGameContext();
  let color = 'green';
  if (game.playerCount === 4) {
    color = userPos === 0 ? 'red' : 'blue';
  }
  return (
    <Box className={`guess players-${color} playername`}>
      {game.nicknames[userPos]}
    </Box>
  );
}
