import { html, render } from 'lit-html';
import { hello_backend } from 'declarations/hello_backend';
import logo from './logo2.svg';

class App {
  greeting = '';
  submittedNames = [];
  showNames = false;

  constructor() {
    this.#loadSubmittedNames();
    this.#render();
  }

  #loadSubmittedNames = async () => {
    this.submittedNames = await hello_backend.getSubmittedNames();
    this.#render();
  };

  #handleSubmit = async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    this.greeting = await hello_backend.greet(name);
    await this.#loadSubmittedNames();
    this.#render();
  };

  #toggleNames = () => {
    this.showNames = !this.showNames;
    this.#render();
  };

  #render() {
    let body = html`
      <main>
        <img src="${logo}" alt="DFINITY logo" />
        <br />
        <br />
        <form action="#">
          <label for="name">Enter your name: &nbsp;</label>
          <input id="name" alt="Name" type="text" />
          <button type="submit">Click Me!</button>
        </form>
        <section id="greeting">${this.greeting}</section>
        <button @click=${this.#toggleNames}>
          ${this.showNames ? 'Hide' : 'Show'} Submitted Names
        </button>
        ${this.showNames ? html`
          <section>
            <h3>Previously submitted names:</h3>
            <ul>
              ${this.submittedNames.map((name) => html`<li>${name}</li>`)}
            </ul>
          </section>
        ` : ''}
      </main>
    `;
    render(body, document.getElementById('root'));
    document
      .querySelector('form')
      .addEventListener('submit', this.#handleSubmit);
  }
}

export default App;
