import React, { Component } from 'react';
import {
  ReactiveBase,
  DataSearch,
  RangeSlider,
  ResultList,
  MultiList,
  DateRange
} from '@appbaseio/reactivesearch';
import './App.css';

class App extends Component {
  render() {
    return (
      //credentials shown here are read only so no security issues
      <ReactiveBase
        app="social-media"
        credentials= "wwmU5hu0p:8ef8c078-746d-4435-82a2-529726c17327"
        // for non-appbaseIO hosted instancesurl= "https://wwmU5hu0p:8ef8c078-746d-4435-82a2-529726c17327@scalr.api.appbase.io"
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
            queryFormat="and"
            placeholder="Search by speaker and/or claim keywords"
            autosuggest={false}
            fuzziness={"AUTO"}
            debounce={500}
            className="datasearch"
            innerClass={{
              "input": "searchbox",
              "list": "suggestionlist"
            }}
            customQuery={
              function (value, props) {
                return {
                  "multi_match": {
                    "query": value,
                    "type": "best_fields",
                    "fields": ["prefname^3", "speaker", "claim^2"],
                    "fuzziness": "AUTO",
                    "zero_terms_query": "all",
                    "tie_breaker": 0.35
                  }
                }
              }
            }
          />
        </div>
        <div className={"display"}>
          <div className={"leftSidebar"}>
            <RangeSlider
              componentId="ratingsFilter"
              dataField="score"
              title="Claimbuster Score"
              range={{
                "start": 0,
                "end": 100
              }}
              defaultSelected={{
                "start": 50,
                "end": 100
              }}
              showHistogram={true}
              stepValue={1}
              interval={5}
            />
            <DateRange
              componentId="dateFilter"
              dataField="date"
              title="Date Tweeted"
            />
            <MultiList
              componentId="speakerFilter"
              dataField="prefname.raw"
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
                  "title": res.prefname + " - @" + res.account.toString().toLowerCase(),
                  "description": res.claim,
                  "url": res.link
                }
              )}
              className="result-data"
              innerClass={{
                "image": "result-image",
                "resultStats": "result-stats"
              }}
              sortOptions={[
                { dataField: "_score", sortBy: "desc", label: "Best Match" },
                { dataField: "score", sortBy: "desc", label: "Claimbuster Score (High to low)" },
                { dataField: "score", sortBy: "asc", label: "Claimbuster Score (Low to High)" },
                { dataField: "prefname.raw", sortBy: "asc", label: "Speaker A->Z" },
                { dataField: "prefname.raw", sortBy: "desc", label: "Speaker Z->A" },
              ]}
            />
          </div>
        </div>
      </ReactiveBase>
    );
  }
}

export default App;