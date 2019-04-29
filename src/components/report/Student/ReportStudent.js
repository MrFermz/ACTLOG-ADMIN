import React, { Component } from 'react'
import firebase from '../../firebase'
import Menus from '../../Menus'
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TextField,
  Grid,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@material-ui/core'
import {
  MoreHoriz
} from '@material-ui/icons'

class ReportStudent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      open: false,
      uid: ''
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
    var items = [], id = 0
    firebase.database().ref('users')
      .orderByChild('type')
      .equalTo('Student')
      .once('value').then((snapshot) => {
        snapshot.forEach((child) => {
          var val = child.val()
          id += 1
          items.push({
            id: id,
            fname: val.fname,
            lname: val.lname,
            email: val.email,
            uid: val.uid,
            type: val.type,
            sid: val.sid
          })
        })
        this.setState({ list: items })
      })
  }

  handleAlert() {
    this.setState({ open: !this.state.open })
  }

  Alert() {
    const { open, uid, fname, lname, email, sid } = this.state
    return (
      <Dialog
        open={open}
        onClose={this.handleAlert.bind(this)}>
        <DialogTitle>{`เลือกเมนูที่จะดูรายงาน`}</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
            {`เลือกเมนูที่จะดูรายงาน`}
          </DialogContentText> */}
          <Grid>
            <Button
              onClick={() => {
                this.props.history.push({
                  pathname: '/stdDetail',
                  state: { uid: uid }
                })
              }}
              fullWidth>
              ข้อมูลผู้ใช้</Button>
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
              }}>บันทึกกิจกรรม</Button>
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
              }}>ตารางนิเทศ</Button>
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
                    sid
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
    const { list } = this.state
    return (
      <Grid
        container
        direction='row'>
        {this.Alert()}
        <Menus
          history={this.props.history}
          state={{ rStd: true }} />
        <Grid
          xs={10}
          container
          direction='column'
          style={{ padding: 30 }}>

          <Paper
            style={{ width: '100%' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ลำดับ</TableCell>
                  <TableCell>รหัส นศ.</TableCell>
                  <TableCell>ชื่อ - สกุล</TableCell>
                  <TableCell>อีเมลล์</TableCell>
                  <TableCell>เพิ่มเติม</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {list.map((row, i) => (
                  <TableRow
                    key={i}
                    style={i % 2 === 0 ? { backgroundColor: '#EEEEEE' } : null}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.sid}</TableCell>
                    <TableCell>{row.fname}  {row.lname}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>
                      <Button
                        variant='contained'
                        onClickCapture={() => this.setState({
                          uid: row.uid,
                          sid: row.sid,
                          fname: row.fname,
                          lname: row.lname,
                          email: row.email,
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

export default ReportStudent