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

const selectionTeacher = [
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

export default class ReportTeacher extends Component {
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
    document.title = 'รายงานอาจารย์ - ACTLOG ADMIN'
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
    var items = [], id = 0
    firebase.database().ref('users')
      .orderByChild('type_user')
      .equalTo('Teacher')
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
            tel: val.tel_number,
          })
          this.setState({ list: items })
        })
      })
  }

  handleAlert() {
    this.setState({ open: !this.state.open })
  }

  Alert() {
    const { open, uid, fname, lname, email } = this.state
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
                  pathname: '/teachDetail',
                  state: { uid }
                })
              }}>ดูข้อมูลผู้ใช้</Button>
          </Grid>
          <Grid>
            <Button
              fullWidth
              onClick={() => {
                this.props.history.push({
                  pathname: '/ReportTeacherVisit',
                  state: {
                    uid,
                    fname,
                    lname,
                    email
                  }
                })
              }}>ดูผลการนิเทศ</Button>
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
            if (val.type_user === 'Teacher') {
              id += 1
              items.push({
                id,
                fname: val.fname,
                lname: val.lname,
                email: val.email,
                uid: val.uid,
                tel: val.tel_number
              })
            }
            this.setState({ list: items })
          })
        })
    }
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
          state={{ rTea: true }} />
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
                {selectionTeacher.map((option, i) => (
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
                    <TableCell>{row.email}</TableCell>
                    <TableCell align='center'>
                      <Button
                        variant='text'
                        onClickCapture={() => this.setState({
                          uid: row.uid,
                          fname: row.fname,
                          lname: row.lname,
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