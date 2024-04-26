export default class Clue {
  clueGiverIndex: number;
  clueWord: string;
  clueWordCount: number;
  clueGuesses: string[];

  constructor(
    clueGiverIndex: number,
    clueWord: string,
    clueWordCount: number,
    clueGuesses: string[]
  ) {
    this.clueGiverIndex = clueGiverIndex;
    this.clueWord = clueWord;
    this.clueWordCount = clueWordCount;
    this.clueGuesses = clueGuesses;
  }
}
