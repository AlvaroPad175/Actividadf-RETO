// normalizeString: lowercase, remove accents, trim extra spaces
export function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .replace(/\s+/g, ' ')
}

// checkAnswer: returns true if guess matches any alias of a player name
export function checkAnswer(guess: string, correctName: string): boolean {
  return normalizeString(guess) === normalizeString(correctName)
}
