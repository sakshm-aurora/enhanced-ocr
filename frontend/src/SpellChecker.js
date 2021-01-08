import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { PureComponent } from "react";
import spelt from "spelt";
import axios from "axios";

import { dictionary } from "spelt-us-dict";
import IncorrectTerm from "./IncorrectTerm";

const check = spelt({
  dictionary: dictionary,
  distanceThreshold: 0.2,
});
export default class SpellChecker extends PureComponent {
  state = {
    correctText: [],
    matches: [],
  };
  setCorrectTextAtIndex = (text, index) => {
    const newText = [...this.state.correctText];
    newText[index] = text;
    newText[0] = newText[0][0].toUpperCase() + newText[0].slice(1);
    this.setState({ correctText: newText }, () =>
      this.getGrammar(newText.join(" "))
    );
  };
  render() {
    console.log(this.state);
    return (
      <div>
        <div className="p-grid p-text-center">
          <div className="p-col-4">
            <Card title="Extracted Text" style={{ height: "90vh" }}>
              <div style={{ overflow: "break" }}>{this.getData()}</div>
            </Card>
          </div>
          <div className="p-col-4">
            <Card title="Correct Text" style={{ height: "90vh" }}>
              <div>{this.state.correctText.join(" ")}</div>
            </Card>
          </div>
          <div className="p-col-4 p-text-left">
            <Card title="Grammatical Suggestions" style={{ height: "90vh" }}>
              <pre style={{ overflow: "scroll", height: "80vh" }}>
                {JSON.stringify(this.state.matches, null, 2)}
              </pre>
            </Card>
          </div>
        </div>
        <Button
          label="Go Back"
          onClick={() => this.props.setResponse(null)}
        ></Button>
      </div>
    );
  }

  getData = () => {
    return this.props.data.split(" ").map((d, i) => {
      const res = check(d.trim().toLowerCase());
      if (res.correct) {
        return <span className="p-mx-1 text-success">{d}</span>;
      } else {
        return (
          <IncorrectTerm
            text={d}
            suggestions={res.corrections}
            setCorrectText={this.setCorrectTextAtIndex}
            index={i}
          />
        );
      }
    });
  };

  getGrammar = (text) => {
    var headers = {
      "content-type": "application/x-www-form-urlencoded",
      "x-rapidapi-key": "428525cbbdmsh8b1afc706504d8bp18a80fjsn1fdef651d751",
      "x-rapidapi-host": "grammarbot.p.rapidapi.com",
    };

    var data = new FormData();
    data.append("text", text);
    data.append("language", "en-US");

    axios
      .post("https://grammarbot.p.rapidapi.com/check", data, {
        headers,
      })
      .then((res) => {
        this.setState({ matches: res.data.matches });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  componentDidMount() {
    const correctTextNew = [];
    this.props.data.split(" ").forEach((d, i) => {
      const res = check(d.trim().toLowerCase());
      if (res.correct || res.corrections.length === 0) {
        correctTextNew[i] = d;
      } else {
        correctTextNew[i] = res.corrections[0].correction;
      }
    });
    correctTextNew[0] =
      correctTextNew[0][0].toUpperCase() + correctTextNew[0].slice(1);
    this.setState(
      {
        correctText: correctTextNew,
      },
      () => this.getGrammar(correctTextNew.join(" "))
    );
  }
}
