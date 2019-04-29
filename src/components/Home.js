import React, { Component } from 'react'
import firebase from './firebase'
import Menus from './Menus'
import {
  Grid,
  Typography
} from '@material-ui/core'

export default class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      uid: ''
    }
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ uid: user.uid })
      } else {
        this.props.history.push('/')
      }
    })
  }

  render() {
    return (
      <Grid
        container>
        <Menus
          history={this.props.history}
          state={{ home: true }} />
        <Grid
          xs={10}
          container
          style={{ padding: 30 }}>
          <Typography
            variant='h4'>
            {`สวัสดี Admin~`}
          </Typography>
        </Grid>
      </Grid>
    )
  }
}