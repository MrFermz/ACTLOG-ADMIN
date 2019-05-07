import React, { Component } from 'react'
import firebase from '../../firebase'
import {
  Grid,
  Paper,
  Typography,
  GridList,
  GridListTile
} from '@material-ui/core'

export default class ReportStudentActDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      morning: '',
      afternoon: '',
      date: '',
      timeCome: '',
      timeBack: '',
      comment: ''
    }
  }

  componentDidMount() {
    document.title = 'รายละเอียดกิจกรรมนักศึกษา - ACTLOG ADMIN'
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
    var key = this.props.location.state.key
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    var items = []

    firebase.database().ref(`timeTable/${uid}/${key}`)
      .once('value').then((snapshot) => {
        var val = snapshot.val()
        this.setState({
          date: new Date(val.date).toLocaleDateString('th-TH', options),
          timeCome: val.timeCome,
          timeBack: val.timeBack,
          morning: val.morning,
          afternoon: val.afternoon,
          comment: val.comment
        })
      })

    firebase.database().ref(`timeTable/${uid}/${key}/photos`)
      .once('value').then((snapshot) => {
        snapshot.forEach((child) => {
          var val = child.val()
          items.push({
            photo: val.photo
          })
        })
        this.setState({ list: items })
      })
  }

  render() {
    const { date, timeCome, timeBack, morning, afternoon, list, comment } = this.state
    console.log(list)
    return (
      <Grid
        xs={12}
        container
        justify='center'
        alignItems='center'>
        <Grid
          container
          direction='column'
          style={{ padding: 30 }}>
          <Typography
            variant='h4'
            color='primary'
            align='center'
            gutterBottom>
            {date}</Typography>
          <Typography
            variant='h6'
            align='center'
            gutterBottom>
            {timeCome} - {timeBack}</Typography>
          <Paper
            style={{ marginTop: 20, padding: 20 }}>
            <Paper
              style={{ marginTop: 20, width: 700, padding: 20 }}>
              <Typography paragraph>{`${morning}`}</Typography>
            </Paper>
            <Paper
              style={{ marginTop: 20, width: 700, padding: 20 }}>
              <Typography paragraph>{`${afternoon}`}</Typography>
            </Paper>
            <Paper
              style={{ marginTop: 20, width: 700, padding: 20 }}>
              <Typography >ความเห็นผู้ดูแล :</Typography>
              <Typography paragraph>{`${comment}`}</Typography>
            </Paper>
            <Paper
              style={{ marginTop: 20, padding: 20 }}>
              <GridList
                cellHeight={250}
                cols={3}>
                {list.map((img, i) => (
                  <GridListTile
                    key={img.photo}>
                    <img
                      src={img.photo}
                      alt={img.photo}></img>
                  </GridListTile>
                ))}
              </GridList>
            </Paper>
          </Paper>
        </Grid>
      </Grid>
    )
  }
}