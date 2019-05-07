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
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@material-ui/core'
import {
  MoreHoriz
} from '@material-ui/icons'

export default class ReportCompanyStudent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      open: false,
      name: this.props.location.state.name,
      ctel: this.props.location.state.tel,
      address: this.props.location.state.address,
    }
  }

  componentDidMount() {
    document.title = 'รายชื่อนักศึกษา - ACTLOG ADMIN'
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.getData()
      } else {
        this.props.history.push('/')
      }
    })
  }

  getData() {
    var key = this.props.location.state.key
    var items = [], id = 0
    firebase.database().ref('users')
      .orderByChild('company')
      .equalTo(key)
      .once('value').then((snapshot) => {
        snapshot.forEach((child) => {
          var val = child.val()
          var cuid = val.uid

          firebase.database().ref('comment')
            .orderByChild('cuid')
            .equalTo(cuid)
            .once('value').then((snapshot) => {
              snapshot.forEach((child) => {
                var val2 = child.val()
                var suid = val2.suid

                firebase.database().ref(`users/${suid}`)
                  .once('value').then((snapshot) => {
                    var val3 = snapshot.val()
                    id += 1
                    items.push({
                      id,
                      uid: val3.uid,
                      sid: val3.sid,
                      fname: val3.fname,
                      lname: val3.lname,
                      email: val3.email,
                      tel: val3.telNum
                    })
                    this.setState({ list: items })
                  })
              })
            })
        })
      })
  }

  handleAlert() {
    this.setState({ open: !this.state.open })
  }

  Alert() {
    const { open, uid, sid, fname, lname, email, tel } = this.state
    return (
      <Dialog
        open={open}
        onClose={this.handleAlert.bind(this)}>
        <DialogTitle>{`เลือกเมนูที่จะดูรายงาน`}</DialogTitle>
        <DialogContent>
          <Grid>
            <Button
              fullWidth
              onClick={() => {
                this.props.history.push({
                  pathname: '/stdDetail',
                  state: { uid }
                })
              }}>ข้อมูลผู้ใช้</Button>
          </Grid>
          <Grid>
            <Button
              fullWidth
              onClick={() => {
                this.props.history.push({
                  pathname: '/ReportStudentAct',
                  state: {
                    uid: uid,
                    fname,
                    lname,
                    email,
                    sid
                  }
                })
              }}>ดูบันทึกกิจกรรม</Button>
            <Button
              fullWidth
              onClick={() => {
                this.props.history.push({
                  pathname: '/ReportStudentVisit',
                  state: {
                    uid: uid,
                    fname,
                    lname,
                    email,
                    sid
                  }
                })
              }}>ดูผลนิเทศ</Button>
            <Button
              fullWidth
              onClick={() => {
                this.props.history.push({
                  pathname: '/ReportStudentComment',
                  state: {
                    uid: uid,
                    fname,
                    lname,
                    email,
                    sid,
                    tel
                  }
                })
              }}>ความคิดเห็นผู้ดูแล</Button>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            color='secondary'
            onClick={this.handleAlert.bind(this)}>
            ปิด</Button>
        </DialogActions>
      </Dialog>
    )
  }

  render() {
    const { list, name, ctel, address } = this.state
    console.log(list)
    return (
      <Grid
        container>
        {this.Alert()}
        <Grid
          container
          direction='column'
          style={{ padding: 30, alignItems: 'center' }}>
          <Typography
            variant='h4'
            color='primary'
            align='center'
            gutterBottom>
            {name}</Typography>
          <Typography
            variant='h6'
            align='center'
            gutterBottom>
            {ctel}</Typography>
          <Typography
            variant='h6'
            align='center'
            gutterBottom>
            {address}</Typography>
          <Paper
            style={{ width: '100%' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align='center'>ลำดับ</TableCell>
                  <TableCell>รหัสนักศึกษา</TableCell>
                  <TableCell>ชื่อ - สกุล</TableCell>
                  <TableCell>อีเมลล์</TableCell>
                  <TableCell align='center'></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {list.map((row, i) => (
                  <TableRow
                    key={i}
                    style={i % 2 === 0 ? { backgroundColor: '#EEEEEE' } : null}>
                    <TableCell align='center'>{row.id}</TableCell>
                    <TableCell>{row.sid}</TableCell>
                    <TableCell>{row.fname}  {row.lname}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell align='center'>
                      <Button
                        variant='text'
                        onClickCapture={() => this.setState({
                          uid: row.uid,
                          sid: row.sid,
                          fname: row.fname,
                          lname: row.lname,
                          email: row.email,
                          tel: row.tel
                        })}
                        onClick={this.handleAlert.bind(this)}>
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