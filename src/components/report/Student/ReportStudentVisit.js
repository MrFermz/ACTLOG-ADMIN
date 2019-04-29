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
import {
  MoreHoriz
} from '@material-ui/icons'

class ReportVisit extends Component {
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
    var suid = this.props.location.state.uid
    var vtuid = [], tuid = []

    firebase.database().ref('visit')
      .orderByChild('suid')
      .equalTo(suid)
      .once('value').then((snapshot) => {
        snapshot.forEach((child) => {
          var val = child.val()
          vtuid.push(val.tuid)
        })
        this.setState({ Vtuid: vtuid })
      })

    firebase.database().ref('users')
      .orderByChild('type')
      .equalTo('Teacher')
      .once('value').then((snapshot) => {
        snapshot.forEach((child) => {
          var val = child.val()
          tuid.push(val.uid)
        })
        this.setState({ tuid })
      }).then(() => {
        this.renerList(suid)
      })
  }

  renerList(suid) {
    const { Vtuid, tuid } = this.state
    var final = [], items = [], id = 0
    final = tuid.filter(val => Vtuid.includes(val))
    final.forEach((val) => {
      firebase.database().ref(`users/${val}`)
        .once('value').then((snapshot) => {
          var val1 = snapshot.val()

          firebase.database().ref('visit')
            .orderByChild('tuid')
            .equalTo(val)
            .once('value').then((snapshot) => {
              snapshot.forEach((child) => {
                var val2 = child.val()
                if (suid === val2.suid) {
                  id += 1
                  items.push({
                    id,
                    fname: val1.fname,
                    lname: val1.lname,
                    email: val1.email,
                    uid: val1.uid,
                    score1: val2.score1,
                    score2: val2.score2,
                    score3: val2.score3,
                    score4: val2.score4,
                    score5: val2.score5,
                    comment: val2.comment
                  })
                }
              })
              this.setState({ list: items })
            })
        })
    })
  }

  render() {
    const { list, sid, fname, lname, email } = this.state
    console.log(list)
    return (
      <Grid
        container>
        <Grid
          container
          direction='column'
          style={{ padding: 30 }}>
          <Typography>{sid}</Typography>
          <Typography>{fname} {lname}</Typography>
          <Typography>{email}</Typography>
          <Paper
            style={{ width: '100%' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ลำดับ</TableCell>
                  <TableCell>ชื่อ - สกุล</TableCell>
                  <TableCell>ความรับผิดชอบต่องานที่ได้รับมอบหมาย</TableCell>
                  <TableCell>มีความรอบคอบในการทำงาน</TableCell>
                  <TableCell>มีมนุษย์สัมพันธ์</TableCell>
                  <TableCell>การตรงต่อเวลา</TableCell>
                  <TableCell>ปฏิบัติตนถูกต้องตามระเบียบข้อบังคับของสถานที่ฝึกงาน</TableCell>
                  <TableCell>เพิ่มเติม</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {list.map((row, i) => (
                  <TableRow
                    key={i}
                    style={i % 2 === 0 ? { backgroundColor: '#EEEEEE' } : null}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.fname} {row.lname}</TableCell>
                    <TableCell>{row.score1}</TableCell>
                    <TableCell>{row.score2}</TableCell>
                    <TableCell>{row.score3}</TableCell>
                    <TableCell>{row.score4}</TableCell>
                    <TableCell>{row.score5}</TableCell>
                    <TableCell>
                      <Button
                        variant='contained'>
                        <MoreHoriz /></Button>
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

export default ReportVisit