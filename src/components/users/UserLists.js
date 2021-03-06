import React, { Component, Fragment } from 'react'
import firebase from '../firebase'
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
  Typography
} from '@material-ui/core'
import Menus from '../Menus'
import {
  MoreHoriz
} from '@material-ui/icons'

const searchType = [
  {
    value: 'Student',
    label: 'นักศึกษา'
  },
  {
    value: 'Teacher',
    label: 'อาจารย์'
  },
  {
    value: 'Staff',
    label: 'ผู้ดูแล'
  },
  {
    value: 'Admin',
    label: 'แอดมิน'
  },
]

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
    value: 'suid',
    label: 'รหัส นศ.'
  },
  {
    value: 'email',
    label: 'อีเมล'
  }
]

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

export default class UserLists extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      type: 'Student',
      select: 'suid',
      year: ''
    }
  }

  componentDidMount() {
    document.title = 'จัดการข้อมูลผู้ใช้ - ACTLOG ADMIN'
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
            type: val.type_user,
            sid: val.suid,
            stat: val.stat_type_user
          })
        })
        this.setState({ list: items })
      })
  }

  onChange = (e) => {
    const { value } = e.target
    this.searchData(value)
  }

  searchData(word) {
    const { type, select } = this.state
    var items = [], id = 0
    firebase.database().ref('users')
      .orderByChild(select)
      .startAt(word)
      .endAt(word + '\uf8ff')
      .once('value').then((snapshot) => {
        snapshot.forEach((child) => {
          var val = child.val()
          var type_user = val.type_user
          if (type_user === type && type_user === 'Student') {
            id += 1
            items.push({
              id,
              fname: val.fname,
              lname: val.lname,
              email: val.email,
              uid: val.uid,
              type: val.type_user,
              tel: val.tel_number,
              stat: val.stat_type_user
            })
          } if (type_user === type && type_user !== 'Student') {
            id += 1
            items.push({
              id,
              fname: val.fname,
              lname: val.lname,
              email: val.email,
              uid: val.uid,
              type: val.type_user,
              tel: val.tel_number,
              stat: val.stat_type_user
            })
          }
          this.setState({ list: items })
        })
      })
  }

  onChangeType = (e) => {
    const { value } = e.target
    this.setState({ type: value, word: '' })
    if (value === 'Teacher' || value === 'Staff' || value === 'Admin') {
      this.setState({ select: 'email' })
    }
    this.searchDataType(value)
  }

  searchDataType(type) {
    const { year } = this.state
    var items = [], id = 0
    firebase.database().ref('users')
      .orderByChild('type_user')
      .equalTo(type)
      .once('value').then((snapshot) => {
        snapshot.forEach((child) => {
          var val = child.val()
          var userYear = val.year
          if (type !== 'Staff') {
            if (type === 'Student') {
              if (userYear === year) {
                id += 1
                items.push({
                  id,
                  fname: val.fname,
                  lname: val.lname,
                  email: val.email,
                  uid: val.uid,
                  type: val.type_user,
                  sid: val.suid,
                  stat: val.stat_type_user
                })
              }
              this.setState({ list: items })
            } else {
              id += 1
              items.push({
                id,
                fname: val.fname,
                lname: val.lname,
                email: val.email,
                uid: val.uid,
                type: val.type_user,
                tel: val.tel_number,
                stat: val.stat_type_user
              })
              this.setState({ list: items })
            }
          } else {
            var key = val.company
            id = 0
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
                    company: val1.name,
                    stat: val.stat_type_user
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
                    company: '-',
                    stat: val.stat_type_user
                  })
                  this.setState({ list: items })
                })
            }
          }
        })
      })
  }

  onChangeSelect = (e) => {
    const { value } = e.target
    this.setState({ select: value })
  }

  renderSelection() {
    const { type } = this.state
    if (type === 'Student') {
      return (
        <Fragment>
          <TextField
            select
            label='เลือกการค้นหา'
            onChange={this.onChangeSelect}
            value={this.state.select}
            margin='normal'
            variant='outlined'
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
        </Fragment>
      )
    } else if (type === 'Teacher') {
      return (
        <Fragment>
          <TextField
            select
            label='เลือกการค้นหา'
            onChange={this.onChangeSelect}
            value={this.state.select}
            margin='normal'
            variant='outlined'
            style={{ width: 150, marginRight: 15 }}>
            {selectionTeacher.map((option, i) => (
              <MenuItem key={i} value={option.value}>{option.label}</MenuItem>
            ))}</TextField>
          <TextField
            id='outlined-email-input'
            label={`ค้นหา`}
            type='search'
            name='search'
            style={{ marginRight: 10 }}
            onChange={this.onChange}
            margin='normal'
            variant='outlined' />
        </Fragment>
      )
    } else if (type === 'Staff') {
      return (
        <Fragment>
          <TextField
            select
            label='เลือกการค้นหา'
            onChange={this.onChangeSelect}
            value={this.state.select}
            margin='normal'
            variant='outlined'
            style={{ width: 150, marginRight: 15 }}>
            {selectionStaff.map((option, i) => (
              <MenuItem key={i} value={option.value}>{option.label}</MenuItem>
            ))}</TextField>
          <TextField
            id='outlined-email-input'
            label={`ค้นหา`}
            type='search'
            name='search'
            style={{ marginRight: 10 }}
            onChange={this.onChange}
            margin='normal'
            variant='outlined' />
        </Fragment>
      )
    }
  }

  render() {
    const { list, type, year } = this.state
    console.log(list)
    return (
      <Grid
        container
        direction='row'>
        <Menus
          history={this.props.history}
          state={{ list: true }} />
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
                label='เลือกประเภทผู้ใช้'
                onChange={this.onChangeType}
                value={this.state.type}
                margin='normal'
                variant='outlined'
                style={{ width: 150, marginRight: 15 }}>
                {searchType.map((option, i) => (
                  <MenuItem key={i} value={option.value}>{option.label}</MenuItem>
                ))}</TextField>
              {this.renderSelection()}
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
              <TableHead >
                <TableRow>
                  <TableCell align='center'>ลำดับ</TableCell>
                  {type === 'Student'
                    ? <TableCell>รหัส นศ.</TableCell>
                    : null}
                  <TableCell
                    style={{ width: 150 }}>ชื่อ - สกุล</TableCell>
                  {type === 'Staff' || type === 'Teacher'
                    ? <TableCell>เบอร์โทร</TableCell>
                    : null}
                  {type === 'Staff'
                    ? <TableCell>สถานประกอบการ</TableCell>
                    : null}
                  <TableCell>อีเมล</TableCell>
                  <TableCell
                    align='center'
                    style={{ width: 70 }}>สถานะ</TableCell>
                  <TableCell align='center'></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {list.map((row, i) => (
                  <TableRow
                    key={i}
                    style={i % 2 === 0 ? { backgroundColor: '#EEEEEE' } : null}>
                    <TableCell align='center'>{row.id}</TableCell>
                    {row.type === 'Student'
                      ? <TableCell>{row.sid}</TableCell>
                      : null}
                    <TableCell>{row.fname}  {row.lname}</TableCell>
                    {type === 'Staff' || type === 'Teacher'
                      ? <TableCell>{row.tel}</TableCell>
                      : null}
                    {type === 'Staff'
                      ? <TableCell>{row.company}</TableCell>
                      : null}
                    <TableCell>{row.email}</TableCell>
                    {row.stat === false
                      ? <TableCell align='center'>รอยืนยัน</TableCell>
                      : <TableCell align='center'>ยืนยันแล้ว</TableCell>}
                    <TableCell align='center'>
                      <Button
                        variant='text'
                        onClick={() => {
                          if (row.type === 'Student') {
                            this.props.history.push({
                              pathname: '/stdDetail',
                              state: { uid: row.uid }
                            })
                          } else if (row.type === 'Teacher') {
                            this.props.history.push({
                              pathname: '/teachDetail',
                              state: { uid: row.uid }
                            })
                          } else if (row.type === 'Staff') {
                            this.props.history.push({
                              pathname: '/staffDetail',
                              state: { uid: row.uid }
                            })
                          } else if (row.type === 'Admin') {
                            this.props.history.push({
                              pathname: '/adminDetail',
                              state: { uid: row.uid }
                            })
                          }
                        }}><MoreHoriz /></Button>
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