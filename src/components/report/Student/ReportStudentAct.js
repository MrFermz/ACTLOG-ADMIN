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
import {
  MoreHoriz
} from '@material-ui/icons'

export default class ReportStudentAct extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      open: false,
      sid: this.props.location.state.sid,
      fname: this.props.location.state.fname,
      lname: this.props.location.state.lname,
      email: this.props.location.state.email,
      stat0: 0,
      stat1: 0,
      stat2: 0,
      stat3: 0,
      stat4: 0,
      stat5: 0,
    }
  }

  componentDidMount() {
    document.title = 'รายงานกิจกรรมนักศึกษา - ACTLOG ADMIN'
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

          var stat = val.stat
          if (stat === 0) {
            this.setState({ stat0: this.state.stat0 + 1 })
          } else if (stat === 1) {
            this.setState({ stat1: this.state.stat1 + 1 })
          } else if (stat === 2) {
            this.setState({ stat2: this.state.stat2 + 1 })
          } else if (stat === 3) {
            this.setState({ stat3: this.state.stat3 + 1 })
          } else if (stat === 4) {
            this.setState({ stat4: this.state.stat4 + 1 })
          } else {
            this.setState({ stat5: this.state.stat5 + 1 })
          }
        })
        this.setState({ list: items })
      })
  }

  renderCheck(stat) {
    if (stat === 0) {
      return (
        <Typography>ตรวจแล้ว</Typography>
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
    const { list, sid, fname, lname, email, stat0, stat1, stat2, stat3, stat4, stat5 } = this.state
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
                  <TableCell align='center'>ลำดับ</TableCell>
                  <TableCell>วันที่</TableCell>
                  <TableCell>เวลามา</TableCell>
                  <TableCell>เวลากลับ</TableCell>
                  <TableCell align='center'>สถานะ</TableCell>
                  <TableCell align='center'></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {list.map((row, i) => (
                  <TableRow
                    key={i}
                    style={i % 2 === 0 ? { backgroundColor: '#EEEEEE' } : null}>
                    <TableCell align='center'>{row.id}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.timeCome}</TableCell>
                    <TableCell>{row.timeBack}</TableCell>
                    <TableCell align='center'>{this.renderCheck(row.stat)}</TableCell>
                    <TableCell align='center'>
                      <Button
                        variant='text'
                        onClick={() => {
                          this.props.history.push({
                            pathname: '/ReportStudentActDetail',
                            state: ({
                              key: row.key,
                              uid: row.uid
                            })
                          })
                        }}><MoreHoriz /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Typography
              variant='h4'
              color='primary'
              align='center'
              gutterBottom>
              รวม</Typography>
            <Grid container direction='column' alignItems='center'>
              <Grid>
                <Button
                  variant='flat'
                  style={{ backgroundColor: '#82E0AA', margin: 10 }}>
                  {`ตรวจแล้ว = ${stat0}`}</Button>
                <Button
                  variant='flat'
                  style={{ backgroundColor: '#EEEEEE', margin: 10 }}>
                  {`รอตรวจ = ${stat5}`}</Button>
                <Button
                  variant='flat'
                  style={{ backgroundColor: '#F1948A', margin: 10 }}>
                  {`ขาด = ${stat1}`}</Button>
                <Button
                  variant='flat'
                  style={{ backgroundColor: '#F8C471', margin: 10 }}>
                  {`สาย = ${stat2}`}</Button>
                <Button
                  variant='flat'
                  style={{ backgroundColor: '#BB8FCE', margin: 10 }}>
                  {`ป่วย = ${stat3}`}</Button>
                <Button
                  variant='flat'
                  style={{ backgroundColor: '#85C1E9', margin: 10 }}>
                  {`ลา = ${stat4}`}</Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    )
  }
}