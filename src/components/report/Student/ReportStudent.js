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
  DialogActions,
  MenuItem,
  TextField
} from '@material-ui/core'
import {
  MoreHoriz
} from '@material-ui/icons'

const selectionStd = [
  {
    value: 'fname',
    label: 'ชื่อ'
  },
  {
    value: 'lname',
    label: 'นามสกุล'
  },
  {
    value: 'sid',
    label: 'รหัส นศ.'
  },
  {
    value: 'email',
    label: 'อีเมลล์'
  }
]

export default class ReportStudent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      open: false,
      uid: ''
    }
  }

  componentDidMount() {
    document.title = 'รายงานนักศึกษา - ACTLOG ADMIN'
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
            id,
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
          <Grid>
            <Button
              fullWidth
              onClick={() => {
                this.props.history.push({
                  pathname: '/stdDetail',
                  state: { uid: uid }
                })
              }}>ดูข้อมูลผู้ใช้</Button>
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
              }}>ดูผลการนิเทศ</Button>
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

  onChangeSelect = (e) => {
    const { value } = e.target
    this.setState({ select: value })
  }

  onChange = (e) => {
    const { value } = e.target
    this.searchData(value)
  }

  searchData(word) {
    const { select } = this.state
    var items = [], id = 0
    if (select) {
      firebase.database().ref('users')
        .orderByChild(select)
        .startAt(word)
        .endAt(word + '\uf8ff')
        .once('value').then((snapshot) => {
          snapshot.forEach((child) => {
            var val = child.val()
            if (val.type === 'Student') {
              id += 1
              items.push({
                id,
                fname: val.fname,
                lname: val.lname,
                email: val.email,
                uid: val.uid,
                type: val.type,
                sid: val.sid
              })
            }
            this.setState({ list: items })
          })
        })
    }
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
          item
          container
          direction='column'
          style={{ padding: 30 }}>
          <Grid>
            <TextField
              select
              label='เลือกการค้นหา'
              onChange={this.onChangeSelect}
              value={this.state.select}
              margin='normal'
              variant='outlined'
              InputLabelProps={{ shrink: true }}
              style={{ width: 150, marginRight: 15 }}>
              {selectionStd.map((option, i) => (
                <MenuItem key={i} value={option.value}>{option.label}</MenuItem>
              ))}</TextField>
            <TextField
              label={`ค้นหา`}
              type='search'
              name='search'
              style={{ marginRight: 10 }}
              onChange={this.onChange}
              margin='normal'
              variant='outlined' />
          </Grid>
          <Paper
            style={{ width: '100%' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align='center'>ลำดับ</TableCell>
                  <TableCell>รหัส นศ.</TableCell>
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