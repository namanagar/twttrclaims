import React, { Component } from 'react';
import {
  ReactiveBase,
  DataSearch,
  SingleRange,
  ResultList,
  MultiList,
  DateRange
} from '@appbaseio/reactivesearch';
import './App.css';

class App extends Component {
  render() {
    return (
      <ReactiveBase
        url="http://localhost:9200/" app="social-media" type="twitter-claims"
        theme={{
          typography: {
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Noto Sans", "Ubuntu", "Droid Sans", "Helvetica Neue", sans-serif',
            fontSize: '16px',
          },
          colors: {
            textColor: '#14171A',
            backgroundColor: '#E1E8ED',
            primaryTextColor: '#fff',
            primaryColor: '#2196F3',
            titleColor: '#14171A',
            alertColor: '#d9534f',
            borderColor: '#666',
          }
        }}>
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
                { start: 0, end: 1, label: "Any" },
              ]}
            />
            <DateRange
              componentId="dateFilter"
              dataField="date"
              title="Date Tweeted"
            />
            <MultiList
              componentId="speakerFilter"
              dataField="prefname.keyword"
              title="Speakers"
              showCheckbox={true}
              showCount={true}
              placeholder = "Filter by tweet authors"
              sortBy="asc"
            />
          </div>
          <div className={"mainBar"}>
            <ResultList
              componentId="results"
              dataField="prefname"
              react={{
                "and": ["mainSearch", "ratingsFilter", "speakerFilter", "dateFilter"]
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