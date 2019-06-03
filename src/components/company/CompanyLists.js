import React, { Component } from 'react'
import firebase from '../firebase'
import Menus from '../Menus'
import {
  Grid,
  TextField,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Fab,
  Typography
} from '@material-ui/core'
import {
  Add,
  MoreHoriz
} from '@material-ui/icons'

export default class CompanyLists extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      year: ''
    }
  }

  componentDidMount() {
    document.title = 'จัดการข้อมูลสถานประกอบการ - ACTLOG ADMIN'
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
    firebase.database().ref('company')
      .once('value').then((snapshot) => {
        snapshot.forEach((child) => {
          var val = child.val()
          id += 1
          items.push({
            id: id,
            key: child.key,
            name: val.name,
            tel: val.tel,
            add: val.address,
            add1: val.address1,
            add2: val.address2,
            province: val.province,
            zip: val.zip
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
    var items = [], id = 0
    firebase.database().ref('company')
      .orderByChild('name')
      .startAt(word)
      .endAt(word + '\uf8ff')
      .once('value').then((snapshot) => {
        snapshot.forEach((child) => {
          var val = child.val()
          id += 1
          items.push({
            id: id,
            key: child.key,
            name: val.name,
            tel: val.tel,
            add: val.address,
            add1: val.address1,
            add2: val.address2,
            province: val.province,
            zip: val.zip
          })
        })
        this.setState({ list: items })
      })
  }

  render() {
    const { list, year } = this.state
    return (
      <Grid
        container
        direction='row'>
        <Menus
          history={this.props.history}
          state={{ clist: true }} />
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
                label='ค้นหาชื่อ'
                type='search'
                name='search'
                onChange={this.onChange}
                margin='normal'
                variant='outlined' />
              <Fab
                style={{ marginTop: 17, marginLeft: 15 }}
                color='primary'
                onClick={() => this.props.history.push('/cadd')}>
                <Add /></Fab>
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
                  <TableCell>ชื่อสถานประกอบการ</TableCell>
                  <TableCell>เบอร์ติดต่อ</TableCell>
                  <TableCell style={{ width: 300 }}>ที่อยู่</TableCell>
                  <TableCell align='center'></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {list.map((row, i) => (
                  <TableRow
                    key={i}
                    style={i % 2 === 0 ? { backgroundColor: '#EEEEEE' } : null}>
                    <TableCell align='center'>{row.id}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.tel}</TableCell>
                    <TableCell>
                      {`${row.add} ${row.add1} ${row.add2} ${row.province} ${row.zip}`}
                    </TableCell>
                    <TableCell align='center'>
                      <Button
                        variant='text'
                        onClick={() => {
                          this.props.history.push({
                            pathname: '/cdetail',
                            state: {
                              key: row.key
                            }
                          })
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