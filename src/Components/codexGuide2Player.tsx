import { Box } from '@mui/material';

export function codexClueBox() {
  return (
    <div className="codex-guide">
      <div className="codex-guide__row">
        <Box
          key={`codex-guide-upper-cell-start`}
          className={`codex-guide__cell-start`}
        >
          Colours as your partner sees them:
        </Box>
        {[
          'black',
          'cream',
          'cream',
          'cream',
          'cream',
          'cream',
          'green',
          'green',
          'green',
          'green',
          'green',
          'green',
          'green',
          'green',
          'green',
          'cream',
          'black',
          'cream',
          'cream',
          'cream',
          'cream',
          'cream',
          'cream',
          'cream',
          'black',
        ].map((i, index) => (
          <Box
            key={`codex-guide-upper-cellbox-${index}`}
            className={`codex-guide__cell codex-guide__cell--${i}`}
          />
        ))}
      </div>
      <div className="codex-guide__row codex-guide__row--middle">
        <Box
          key={`codex-guide-middle-cell-start`}
          className={`codex-guide__cell-start`}
        >
          {' '}
        </Box>
        {Array(25)
          .fill('')
          .map((x, index) => (
            <Box
              key={`codex-guide-middle-cellbox-${index}`}
              className={`codex-guide__cell codex-guide__cell--middle ${x}`}
            >
              &#x2195;
            </Box>
          ))}
      </div>
      <div className="codex-guide__row">
        <Box
          key={`codex-guide-lower-cell-start`}
          className={`codex-guide__cell-start`}
        >
          Colours as you see them:
        </Box>
        {[
          'green',
          'green',
          'green',
          'green',
          'green',
          'green',
          'green',
          'green',
          'green',
          'cream',
          'cream',
          'cream',
          'cream',
          'cream',
          'black',
          'black',
          'black',
          'cream',
          'cream',
          'cream',
          'cream',
          'cream',
          'cream',
          'cream',
          'cream',
        ].map((i, index) => (
          <Box
            key={`codex-guide-lower-cellbox-${index}`}
            className={`codex-guide__cell codex-guide__cell--${i}`}
          />
        ))}
      </div>
    </div>
  );
}
