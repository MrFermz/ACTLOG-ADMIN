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
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@material-ui/core'
import {
  MoreHoriz
} from '@material-ui/icons'

export default class ReportStaff extends Component {
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
      .equalTo('Staff')
      .once('value').then((snapshot) => {
        snapshot.forEach((child) => {
          var val = child.val()
          var key = val.company
          if (key) {
            firebase.database().ref(`company/${key}`)
              .once('value').then((snapshot) => {
                var val1 = snapshot.val()
                id += 1
                items.push({
                  id: id,
                  fname: val.fname,
                  lname: val.lname,
                  email: val.email,
                  uid: val.uid,
                  type: val.type,
                  tel: val.telNum,
                  company: val1.name
                })
                this.setState({ list: items })
              })
          } else {
            firebase.database().ref(`company/${key}`)
              .once('value').then((snapshot) => {
                id += 1
                items.push({
                  id: id,
                  fname: val.fname,
                  lname: val.lname,
                  email: val.email,
                  uid: val.uid,
                  type: val.type,
                  tel: val.telNum,
                  company: '-'
                })
                this.setState({ list: items })
              })
          }
        })
      })
  }

  handleAlert() {
    this.setState({ open: !this.state.open })
  }

  Alert() {
    const { open, uid, fname, lname, tel, company, email } = this.state
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
                  pathname: '/staffDetail',
                  state: { uid: uid }
                })
              }}>ดูข้อมูลผู้ใช้</Button>
          </Grid>
          <Grid>
            <Button
              fullWidth
              onClick={() => {
                this.props.history.push({
                  pathname: '/ReportStaffComment',
                  state: {
                    uid: uid,
                    fname,
                    lname,
                    tel,
                    company,
                    email
                  }
                })
              }}>ความคิดเห็น</Button>
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
          state={{ rStaff: true }} />
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
                  <TableCell align='center'>ลำดับ</TableCell>
                  <TableCell>ชื่อ - สกุล</TableCell>
                  <TableCell>เบอร์โทร</TableCell>
                  <TableCell>สถานประกอบการ</TableCell>
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
                    <TableCell>{row.fname}  {row.lname}</TableCell>
                    <TableCell>{row.tel}</TableCell>
                    <TableCell>{row.company}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell align='center'>
                      <Button
                        variant='text'
                        onClickCapture={() => this.setState({
                          uid: row.uid,
                          fname: row.fname,
                          lname: row.lname,
                          tel: row.tel,
                          company: row.company,
                          email: row.email
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