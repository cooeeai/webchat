import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import 'bootstrap/js/carousel';
import $ from 'jquery'

import 'styles/HeroCard.scss';

export default class HeroCard extends Component {
  static propTypes = {
    cards: PropTypes.array.isRequired,
    timestamp: PropTypes.number.isRequired,
    user: PropTypes.shape({
      name: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired
    }),
    submitAction: PropTypes.func.isRequired,
    postbackAction: PropTypes.func.isRequired
  }

  constructor(props, ctx) {
    super(props, ctx);
    this.postback = this.postback.bind(this);
  }

  componentDidUpdate() {
    $('.carousel').carousel();
  }

  postback(button) {
    const { postbackAction } = this.props;
    postbackAction(button.title, button.payload);
  }

  renderButton(button) {
    if (button.type == 'postback') {
      return (
        <a href="#" onClick={ () => {this.postback(button)} }>{ button.title }</a>
      );
    } else {
      return (
        <a href={ button.url }>{ button.title }</a>
      );
    }
  }

  render() {
    const { cards, timestamp, user } = this.props;
    const carouselId = getRandomInt(1, 100000);
    return (
      <div className="message-item">
        {
          user &&
            <span className="avatar">
              <img src={ user.avatar }/>
            </span>
        }
        {
          user &&
            <span className="name">{ user.name }</span>
        }
        <span className="info">{ `${moment(timestamp).format('MM/DD HH:mm')}` }</span>
        <div id={ `carousel${carouselId}` } className="carousel slide" data-ride="carousel" data-interval="false">
          <div className="carousel-inner" role="listbox">
            {
              cards.map((card, i) =>
                <div key={ `card${i}` } className={ 'item' + (i == 0 ? ' active' : '') }>
                  <div className="panel panel-default">
                    <div className="panel-body">
                      <img src={ card.imageURL }/>
                    </div>
                  </div>
                  <div className="panel panel-default">
                    <div className="panel-body">
                      <div className="card-title">{ card.title }</div>
                      <div className="card-subtitle">{ card.subtitle }</div>
                    </div>
                  </div>
                  {
                    card.buttons.map((button, j) =>
                      <div key={ `card${j}` } className="panel panel-default">
                        <div className="panel-body" role="button">
                          { this.renderButton(button) }
                        </div>
                      </div>
                    )
                  }
                </div>
              )
            }
          </div>
          <a className="left carousel-control" href={ `#carousel${carouselId}` } role="button" data-slide="prev">
            <span className="glyphicon glyphicon-chevron-left" aria-hidden="true"/>
            <span className="sr-only">Previous</span>
          </a>
          <a className="right carousel-control" href={ `#carousel${carouselId}` } role="button" data-slide="next">
            <span className="glyphicon glyphicon-chevron-right" aria-hidden="true"/>
            <span className="sr-only">Next</span>
          </a>
        </div>
      </div>
    );
  }
}

// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
