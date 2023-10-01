import { TriviaInfo } from "../types";

export default class Trivia {
  /** The question */
  private question: string;
  /** The answer */
  private answer: string;
  /** The array of options */
  private options: string[];

  constructor(info: TriviaInfo) {
    // Store the question
    this.question = info.question;
    this.question = this.question.replaceAll('&#039;', "'");
    this.question = this.question.replaceAll('&quot;', '"');
    // Store the answer
    this.answer = info.correct_answer;
    // Store the random options
    let list = info.incorrect_answers.concat(info.correct_answer);
    for (let i = list.length - 1; i > 0; i--) {
      list[i] = list[i].replaceAll('&#039;', "'");
      list[i] = list[i].replaceAll('&quot;', '"');
      let ran = Math.floor(Math.random() * (i + 1));
      let temp = list[ran];
      list[ran] = list[i];
      list[i] = temp;
    }
    this.options = list;
  }

  /** Get the question */
  getQuestion() { return this.question }
  /** Get the correct answer */
  getAnswer() { return this.answer }
  /** Get the options */
  getOptions() { return this.options }
}