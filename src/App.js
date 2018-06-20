import React, { Component } from 'react';
import {
  ReactiveBase,
  DataSearch,
  RangeSlider,
  MultiList,
  DateRange,
  ReactiveList
} from '@appbaseio/reactivesearch';
import './App.css';
import { Card, CardColumns, CardText, CardBody, CardTitle, CardSubtitle, Button, Row, Col} from 'reactstrap';

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
            debounce={200}
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
              numberOfMonths={1}
              queryFormat = "date"
            />
            <MultiList
              style={{ marginTop: 1.5 + "em" }}
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
            <ReactiveList
              componentId="results"
              className = "results"
              innerClass = {{
                "pagination": "resultpages"
              }}
              dataField="prefname"
              react={{
                "and": ["mainSearch", "ratingsFilter", "speakerFilter", "dateFilter"]
              }}
              pagination={true}
              size={12}
              onAllData={(results) =>
                <div style={{ margin: 0.5 + "em" }}>
                  <CardColumns>
                    {results.map((res, index) =>
                      <div style={{ margin: 0.25 + "em" }} key={index}>
                        <Card>
                          <CardBody>
                            <CardTitle>{res.prefname} - @{res.account.toString().toLowerCase()}</CardTitle>
                            <CardSubtitle>{res.date.replace(/(\d{4})-(\d{1,2})-(\d{1,2})/, function (match, y, m, d) {
                              return m + '/' + d + '/' + y})}</CardSubtitle>
                            <CardText style={{ marginTop: 0.5 + "em" }}>{res.claim}</CardText>
                            <Row>
                              <Col sm="6" md="6">
                                <Button tag="a" outline color="primary" href={res.link}>Link</Button>
                              </Col>
                              <Col sm="6" md="6">
                                <CardText>Score: {Number(res.score.toFixed(2))}</CardText>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                      </div>
                    )}
                  </CardColumns>
                </div>
                }
              sortOptions={[
                { dataField: "_score", sortBy: "desc", label: "Best Match" },
                { dataField: "score", sortBy: "desc", label: "Claimbuster Score (High to low)" },
                { dataField: "score", sortBy: "asc", label: "Claimbuster Score (Low to High)" },
                { dataField: "prefname.raw", sortBy: "asc", label: "Speaker A->Z" },
                { dataField: "prefname.raw", sortBy: "desc", label: "Speaker Z->A" },
                { dataField: "date", sortBy: "desc", label: "Newest" },
                { dataField: "date", sortBy: "asc", label: "Oldest" }
              ]}
            />
          </div>
        </div>
      </ReactiveBase>
    );
  }
}

export default App;