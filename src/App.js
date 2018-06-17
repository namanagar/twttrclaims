
import React, { Component } from 'react';
import {
  ReactiveBase,
  DataSearch,
  SingleRange,
  ResultList
} from '@appbaseio/reactivesearch';
import './App.css';

class App extends Component {
  render() {
    return (
      <ReactiveBase
        url="http://localhost:9200/" app="social-media" type="twitter-claims"
      >
        <div className="navbar">
          <div className="logo">
            twttr<strong>claims</strong>
          </div>
          <DataSearch
            componentId="mainSearch"
            dataField={["prefname", "speaker", "claim"]}
            queryFormat="or"
            placeholder="Search by speaker or claim"
            autosuggest={false}
            fuzziness={2}
            className="datasearch"
            innerClass={{
              "input": "searchbox",
              "list": "suggestionlist"
            }}
          />
        </div>
        <div className={"display"}>
          <div className={"leftSidebar"}>
            <SingleRange
              componentId="ratingsFilter"
              dataField="score"
              title="Claimbuster Score"
              data={[
                { start: .8, end: 1, label: "★★★★ & up" },
                { start: .6, end: 1, label: "★★★ & up" },
                { start: .4, end: 1, label: "★★ & up" },
                { start: .2, end: 1, label: "★ & up" },
              ]}
            />
          </div>
          <div className={"mainBar"}>
            <ResultList
              componentId="results"
              dataField="prefname"
              react={{
                "and": ["mainSearch", "ratingsFilter"]
              }}
              pagination={true}
              size={20}
              onData={(res) => (
                {
                  "image": res.image,
                  "title": res.prefname,
                  "description": res.claim
                }
              )}
              className="result-data"
              innerClass={{
                "image": "result-image",
                "resultStats": "result-stats"
              }}
            />
          </div>
        </div>
      </ReactiveBase>
    );
  }
}

export default App;