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
import { Card, CardColumns, CardText, CardBody, CardTitle, CardSubtitle, Button, Row, Col, Modal, ModalHeader, ModalBody} from 'reactstrap';
import MediaQuery from 'react-responsive';  

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };
    this.toggle = this.toggle.bind(this);
  }
  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }
  dateFormat(date) {
    return date.replace(/(\d{4})-(\d{1,2})-(\d{1,2})/, function (match, y, m, d) {
      return m + '/' + d + '/' + y
    })
  }
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
            primaryColor: '#004c93',
            titleColor: '#14171A',
            alertColor: '#d9534f',
            borderColor: '#666',
          }
        }}>
        <div className="searchBar">
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
            debounce={250}
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
                    "type": "most_fields",
                    "fields": ["prefname^3", "speaker", "claim^2"],
                    "fuzziness": "AUTO",
                    "zero_terms_query": "all",
                    "tie_breaker": 0.6
                  }
                }
              }
            }
          />
          <div className="about">
            <Button color="info" size="sm" onClick={this.toggle}>about this app</Button>
            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
              <ModalHeader toggle={this.toggle}>About twttr<strong>claims</strong></ModalHeader>
              <ModalBody>
                <p>Tech & Check Alerts is an automated service that helps fact-checkers find claims to check. Using the ClaimBuster tool — an algorithm that scores sentences based on how checkable they are — we've collected several politicians' tweets and scored and saved them here. This database of claims from Twitter includes all claims previously sent through our email alert program and more.</p>
                <p>For more information about Tech & Check or the Duke Reporters' Lab, click <a href="https://reporterslab.org/">here</a> to find out more.</p>
              </ModalBody>
            </Modal>
          </div>
        </div>
        <div className={"display"}>
          <MediaQuery minWidth={801} >
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
                queryFormat="date"
              />
              <MultiList
                style={{ marginTop: 1.5 + "em" }}
                componentId="speakerFilter"
                dataField="prefname.raw"
                title="Speakers"
                showCheckbox={true}
                showCount={true}
                placeholder="Filter by tweet authors"
                sortBy="asc"
              />
            </div>
          </MediaQuery>
          <MediaQuery minWidth={801}>
            <div className={"mainBar"}>
              <ReactiveList
                componentId="results"
                className="results"
                innerClass={{
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
                              <CardSubtitle>{this.dateFormat(res.date)}</CardSubtitle>
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
          </MediaQuery>
          <MediaQuery maxWidth={800}>
            <div className={"mainBar"}>
              <ReactiveList
                componentId="results"
                className="results"
                innerClass={{
                  "pagination": "resultpages"
                }}  
                dataField="prefname"
                react={{
                  "and": ["mainSearch", "ratingsFilter", "speakerFilter", "dateFilter"]
                }}
                pagination={true}
                size={5}
                onAllData={(results) =>
                  <div style={{ margin: 0.5 + "em" }}>
                    <CardColumns>
                      {results.map((res, index) =>
                        <div style={{ margin: 0.25 + "em" }} key={index}>
                          <Card>
                            <CardBody>
                              <CardTitle>{res.prefname} - @{res.account.toString().toLowerCase()}</CardTitle>
                              <CardSubtitle>{this.dateFormat(res.date)}</CardSubtitle>
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
              <p>This app is best viewed on larger devices like a computer or a horizontally held tablet!</p>
            </div>
          </MediaQuery>
          <MediaQuery maxWidth={482}>
            <div className={"mainBar"}>
              <ReactiveList
                componentId="results"
                className="results"
                innerClass={{
                  "pagination": "resultpages"
                }}
                dataField="prefname"
                react={{
                  "and": ["mainSearch", "ratingsFilter", "speakerFilter", "dateFilter"]
                }}
                pagination={true}
                paginationAt="top"
                size={2}
                onAllData={(results) =>
                  <div style={{ margin: 0.5 + "em" }}>
                    <CardColumns>
                      {results.map((res, index) =>
                        <div style={{ margin: 0.25 + "em" }} key={index}>
                          <Card className="card">
                            <CardBody>
                              <CardTitle>{res.prefname} - @{res.account.toString().toLowerCase()}</CardTitle>
                              <CardSubtitle>{this.dateFormat(res.date)}</CardSubtitle>
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
              <p>This app is best viewed on larger devices like a computer or a horizontally held tablet!</p>
            </div>
          </MediaQuery>
        </div>
      </ReactiveBase>
    );
  }
}

export default App;