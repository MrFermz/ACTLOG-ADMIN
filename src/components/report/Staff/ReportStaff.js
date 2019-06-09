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
  TextField,
  Typography
} from '@material-ui/core'
import {
  MoreHoriz
} from '@material-ui/icons'

const selectionStaff = [
  {
    value: 'fname',
    label: 'ชื่อ'
  },
  {
    value: 'lname',
    label: 'นามสกุล'
  },
  {
    value: 'email',
    label: 'อีเมล'
  }
]

export default class ReportStaff extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      open: false,
      uid: '',
      year: '',
      select: 'email'
    }
  }

  componentDidMount() {
    document.title = 'รายงานผู้ดูแล - ACTLOG ADMIN'
    firebase.database().ref('temp')
      .once('value').then((snapshot) => {
        var val = snapshot.val()
        var year = val.year
        if (year) {
          this.setState({ year })
          firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              this.getData()
            } else {
              this.props.history.push('/')
            }
          })
        } else {
          this.props.history.push('/home')
        }
      })
  }

  getData() {
    const { year } = this.state
    var ccuid = [], cuid = []
    firebase.database().ref('users')
      .orderByChild('type_user')
      .equalTo('Student')
      .once('value').then((snapshot) => {
        snapshot.forEach((child) => {
          var val = child.val()
          var userYear = val.year
          var suid = val.uid
          if (userYear === year) {
            firebase.database().ref('comment')
              .orderByChild('suid')
              .equalTo(suid)
              .once('value').then((snapshot) => {
                snapshot.forEach((child) => {
                  var val = child.val()
                  ccuid.push(val.cuid)
                })
                this.setState({ Ccuid: ccuid })
              })
            firebase.database().ref('users')
              .orderByChild('type_user')
              .equalTo('Staff')
              .once('value').then((snapshot) => {
                snapshot.forEach((child) => {
                  var val = child.val()
                  cuid.push(val.uid)
                })
                this.setState({ cuid })
              }).then(() => {
                this.renderList()
              })
          }
        })
      })
  }

  renderList() {
    const { Ccuid, cuid } = this.state
    var final = [], items = [], id = 0
    final = cuid.filter(val => Ccuid.includes(val))
    final = new Set(final)
    final.forEach((val) => {
      firebase.database().ref(`users/${val}`)
        .once('value').then((snapshot) => {
          var val = snapshot.val()
          var key = val.company
          if (key) {
            firebase.database().ref(`company/${key}`)
              .once('value').then((snapshot) => {
                var val1 = snapshot.val()
                id += 1
                items.push({
                  id,
                  fname: val.fname,
                  lname: val.lname,
                  email: val.email,
                  uid: val.uid,
                  type: val.type_user,
                  tel: val.tel_number,
                  company: val1.name
                })
                this.setState({ list: items })
              })
          } else {
            firebase.database().ref(`company/${key}`)
              .once('value').then((snapshot) => {
                id += 1
                items.push({
                  id,
                  fname: val.fname,
                  lname: val.lname,
                  email: val.email,
                  uid: val.uid,
                  type: val.type_user,
                  tel: val.tel_number,
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
              }}>ดูผลการประเมิน</Button>
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
    const { select, Ccuid, cuid } = this.state
    var final = [], items = [], id = 0
    final = cuid.filter(val => Ccuid.includes(val))
    final = new Set(final)
    final.forEach((uid) => {
      if (select) {
        firebase.database().ref('users')
          .orderByChild(select)
          .startAt(word)
          .endAt(word + '\uf8ff')
          .once('value').then((snapshot) => {
            snapshot.forEach((child) => {
              var val = child.val()
              var key = val.company
              if (val.type_user === 'Staff' && val.uid === uid) {
                if (key) {
                  firebase.database().ref(`company/${key}`)
                    .once('value').then((snapshot) => {
                      var val1 = snapshot.val()
                      id += 1
                      items.push({
                        id,
                        fname: val.fname,
                        lname: val.lname,
                        email: val.email,
                        uid: val.uid,
                        type: val.type_user,
                        tel: val.tel_number,
                        company: val1.name
                      })
                      this.setState({ list: items })
                    })
                } else {
                  firebase.database().ref(`company/${key}`)
                    .once('value').then((snapshot) => {
                      id += 1
                      items.push({
                        id,
                        fname: val.fname,
                        lname: val.lname,
                        email: val.email,
                        uid: val.uid,
                        type: val.type_user,
                        tel: val.tel_number,
                        company: '-'
                      })
                      this.setState({ list: items })
                    })
                }
              }
            })
          })
      }
    })
  }

  render() {
    const { list, year } = this.state
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
          item
          container
          direction='column'
          style={{ padding: 30 }}>
          <Grid
            container
            direction='row'
            style={{ width: '100%' }}>
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
                {selectionStaff.map((option, i) => (
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
            <Grid
              justify='flex-start'
              style={{ width: '50%', alignSelf: 'center' }}>
              <Typography
                style={{
                  fontSize: 25,
                  paddingLeft: 20
                }}>ปีการศึกษา : {parseInt(year) + 543}</Typography>
            </Grid>
          </Grid>
          <Paper
            style={{ width: '100%' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align='center'>ลำดับ</TableCell>
                  <TableCell>ชื่อ - สกุล</TableCell>
                  <TableCell>เบอร์โทร</TableCell>
                  <TableCell>สถานประกอบการ</TableCell>
                  <TableCell>อีเมล</TableCell>
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