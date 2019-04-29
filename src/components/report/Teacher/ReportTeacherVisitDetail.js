import React, { Component } from 'react'
import firebase from '../../firebase'
import {
  Button,
  Paper,
  Grid,
  TextField,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@material-ui/core'

class ReportVisitDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      fname: this.props.location.state.fname,
      lname: this.props.location.state.lname,
      email: this.props.location.state.email
    }
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.getData()
      } else {
        this.props.history.push('/')
      }
    })
  }

  getData() {
    var uid = this.props.location.state.uid
    var tuid = this.props.location.state.tuid
    var items = []

    firebase.database().ref('visit')
      .orderByChild('suid')
      .equalTo(uid)
      .once('value').then((snapshot) => {
        snapshot.forEach((child) => {
          var val = child.val()
          var teacher = val.tuid
          var suid = val.suid
          if (tuid === teacher) {
            firebase.database().ref(`users/${suid}`)
              .once('value').then((snapshot) => {
                var val1 = snapshot.val()
                items.push({
                  fname: val1.fname,
                  lname: val1.lname,
                  score1: val.score1,
                  score2: val.score2,
                  score3: val.score3,
                  score4: val.score4,
                  score5: val.score5,
                  comment: val.comment
                })
                this.setState({ list: items })
              })
          }
        })
      })
  }

  render() {
    const { list, fname, lname, email } = this.state
    console.log(list)
    return (
      <Grid
        container>
        <Grid
          container
          direction='column'
          style={{ padding: 30 }}>
          <Typography>{fname} {lname}</Typography>
          <Typography>{email}</Typography>
          <Paper
            style={{ width: '100%' }}>
            {list.map((row, i) => (
              <Grid>
                <Typography>{row.fname} {row.lname}</Typography>
              </Grid>
            ))}
          </Paper>
        </Grid>
      </Grid>
    )
  }
}

export default ReportVisitDetail