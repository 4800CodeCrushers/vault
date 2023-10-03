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
    this.question = this.question.replaceAll('&rsquo;', "'");
    this.question = this.question.replaceAll('&amp;', '&');
    this.question = this.question.replaceAll('&eacute;', 'é');
    // Store the answer
    this.answer = info.correct_answer;

    // Store the random options
    let list: string[] = [];
    if (info.type === 'multiple') {
      list = info.incorrect_answers.concat(info.correct_answer);
      for (let i = list.length - 1; i > 0; i--) {
        // replace with correct characters
        list[i] = list[i].replaceAll('&#039;', "'");
        list[i] = list[i].replaceAll('&rsquo;', "'");
        list[i] = list[i].replaceAll('&quot;', '"');
        list[i] = list[i].replaceAll('&amp;', '&');
        list[i] = list[i].replaceAll('&eacute;', 'é');
        // shift options around randomly
        let ran = Math.floor(Math.random() * (i + 1));
        let temp = list[ran];
        list[ran] = list[i];
        list[i] = temp;
      }
    }
    else {
      list.push('True');
      list.push('False');
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