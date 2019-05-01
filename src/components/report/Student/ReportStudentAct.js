import React, { Component } from 'react'
import firebase from '../../firebase'
import {
  Button,
  Paper,
  Grid,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@material-ui/core'

export default class ReportStudentAct extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      open: false,
      sid: this.props.location.state.sid,
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
    var items = [], id = 0
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit' }

    firebase.database().ref(`timeTable/${uid}`)
      .once('value').then((snapshot) => {
        snapshot.forEach((child) => {
          var val = child.val()
          id += 1
          items.push({
            uid: snapshot.key,
            key: child.key,
            id: id,
            date: new Date(val.date).toLocaleDateString('th-TH', options),
            timeCome: val.timeCome,
            timeBack: val.timeBack,
            stat: val.stat
          })
        })
        this.setState({ list: items })
      })
  }

  renderCheck(stat) {
    if (stat === 0) {
      return (
        <Typography>ปกติ</Typography>
      )
    } else if (stat === 1) {
      return (
        <Typography>ขาด</Typography>
      )
    } else if (stat === 2) {
      return (
        <Typography>สาย</Typography>
      )
    } else if (stat === 3) {
      return (
        <Typography>ป่วย</Typography>
      )
    } else if (stat === 4) {
      return (
        <Typography>ลา</Typography>
      )
    } else {
      return (
        <Typography>รอตรวจ</Typography>
      )
    }
  }

  render() {
    const { list, sid, fname, lname, email } = this.state
    return (
      <Grid
        container>
        <Grid
          container
          direction='column'
          style={{ padding: 30, alignItems: 'center' }}>
          <Typography
            variant='h4'
            color='primary'
            align='center'
            gutterBottom>
            {sid}</Typography>
          <Typography
            variant='h6'
            align='center'
            gutterBottom>
            {fname} {lname}</Typography>
          <Typography
            variant='h6'
            align='center'
            gutterBottom>
            {email}</Typography>
          <Paper
            style={{ width: '100%' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ลำดับ</TableCell>
                  <TableCell>วันที่</TableCell>
                  <TableCell>เวลามา</TableCell>
                  <TableCell>เวลากลับ</TableCell>
                  <TableCell>ผู้ดูแล</TableCell>
                  <TableCell>เพิ่มเติม</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {list.map((row, i) => (
                  <TableRow
                    key={i}
                    style={i % 2 === 0 ? { backgroundColor: '#EEEEEE' } : null}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.timeCome}</TableCell>
                    <TableCell>{row.timeBack}</TableCell>
                    <TableCell>{this.renderCheck(row.stat)}</TableCell>
                    <TableCell>
                      <Button
                        variant='contained'
                        color='primary'
                        onClick={() => {
                          this.props.history.push({
                            pathname: '/ReportStudentActDetail',
                            state: ({ key: row.key, uid: row.uid })
                          })
                        }}>เพิ่มเติม</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    )
  }
}