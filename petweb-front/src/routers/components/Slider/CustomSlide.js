import React, { Component } from "react";
import '../../../App.css'

export default class CustomSlide extends Component {
    
    render() {
      const { index, ...props } = this.props;
      return (
        <React.Fragment>
          {props.children}
        </React.Fragment>
      );
    }
  }