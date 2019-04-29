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
  MenuItem
} from '@material-ui/core'
import Menus from '../Menus'

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
    value: 'sid',
    label: 'รหัส นศ.'
  },
  {
    value: 'email',
    label: 'อีเมลล์'
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
    label: 'อีเมลล์'
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
    label: 'อีเมลล์'
  }
]

class UserLists extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      type: 'Student',
      select: 'sid'
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
          // console.log(child.key)
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

  onChange = (e) => {
    const { value } = e.target
    // console.log(value)
    this.searchData(value)
  }

  searchData(word) {
    console.log(word)
    const { type, select } = this.state
    var items = [], id = 0
    firebase.database().ref('users')
      .orderByChild(select)
      .startAt(word)
      .endAt(word + '\uf8ff')
      .once('value').then((snapshot) => {
        snapshot.forEach((child) => {
          console.log(child.key)
          var val = child.val()
          id += 1
          if (val.type === type) {
            items.push({
              id: id,
              fname: val.fname,
              lname: val.lname,
              email: val.email,
              uid: val.uid,
              type: val.type,
              sid: val.sid,
              tel: val.telNum
            })
          }
          this.setState({ list: items })
        })
      })
  }

  onChangeType = (e) => {
    const { value } = e.target
    console.log(value)
    this.setState({ type: value, word: '' })
    this.searchDataType(value)
  }

  searchDataType(type) {
    console.log(type)
    var items = [], id = 0
    firebase.database().ref('users')
      .orderByChild('type')
      .equalTo(type)
      .once('value').then((snapshot) => {
        snapshot.forEach((child) => {
          console.log(child.key)
          var val = child.val()
          id += 1
          if (type !== 'Staff') {
            items.push({
              id: id,
              fname: val.fname,
              lname: val.lname,
              email: val.email,
              uid: val.uid,
              type: val.type,
              sid: val.sid,
              tel: val.telNum,
            })
            this.setState({ list: items })
          } else {
            var ckey = val.company
            firebase.database().ref(`company/${ckey}`)
              .once('value').then((snapshot) => {
                var val1 = snapshot.val()
                items.push({
                  id: id,
                  fname: val.fname,
                  lname: val.lname,
                  email: val.email,
                  uid: val.uid,
                  type: val.type,
                  sid: val.sid,
                  tel: val.telNum,
                  company: val1.name
                })
                this.setState({ list: items })
              })
          }
        })
      })
  }

  onChangeSelect = (e) => {
    const { value } = e.target
    console.log(value)
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
            style={{ width: 150 }}>
            {selectionStd.map((option, i) => (
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
            style={{ width: 150 }}>
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
            style={{ width: 150 }}>
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
    const { list, type } = this.state
    return (
      <Grid
        container
        direction='row'>
        <Menus
          history={this.props.history}
          state={{ list: true }} />
        <Grid
          xs={10}
          container
          direction='column'
          // justify='flex-start'
          // alignItems='center'
          style={{ padding: 30 }}>
          <Grid
            // justify='flex-start'
            // alignItems='flex-start'
            style={{ width: '100%' }}>
            <TextField
              select
              label='เลือกประเภทผู้ใช้'
              onChange={this.onChangeType}
              value={this.state.type}
              margin='normal'
              variant='outlined'
              style={{ width: 150 }}>
              {searchType.map((option, i) => (
                <MenuItem key={i} value={option.value}>{option.label}</MenuItem>
              ))}</TextField>
            {this.renderSelection()}
          </Grid>

          <Paper
            style={{ width: '100%' }}>
            <Table>
              <TableHead >
                <TableRow>
                  <TableCell>ลำดับ</TableCell>
                  {type === 'Student'
                    ? <TableCell>รหัส นศ.</TableCell>
                    : null}
                  <TableCell>ชื่อ - สกุล</TableCell>
                  {type === 'Staff'
                    ? <Fragment>
                      <TableCell>เบอร์โทร</TableCell>
                      <TableCell>สถานประกอบการ</TableCell>
                    </Fragment>
                    : null}
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
                    {row.type === 'Student'
                      ? <TableCell>{row.sid}</TableCell>
                      : null}
                    <TableCell>{row.fname}  {row.lname}</TableCell>
                    {type === 'Staff'
                      ? <Fragment>
                        <TableCell>{row.tel}</TableCell>
                        <TableCell>{row.company}</TableCell>
                      </Fragment>
                      : null}
                    <TableCell>{row.email}</TableCell>
                    <TableCell>
                      <Button
                        variant='contained'
                        color='primary'
                        onClick={() => {
                          if (row.type === 'Student') {
                            console.log(row.type)
                            this.props.history.push({
                              pathname: '/stdDetail',
                              state: { uid: row.uid }
                            })
                          } else if (row.type === 'Teacher') {
                            console.log(row.type)
                            this.props.history.push({
                              pathname: '/teachDetail',
                              state: { uid: row.uid }
                            })
                          } else if (row.type === 'Staff') {
                            console.log(row.type)
                            this.props.history.push({
                              pathname: '/staffDetail',
                              state: { uid: row.uid }
                            })
                          }
                        }}>
                        เพิ่มเติม</Button>
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

export default UserLists