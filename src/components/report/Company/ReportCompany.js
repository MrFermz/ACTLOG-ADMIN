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
  TextField,
  Typography
} from '@material-ui/core'
import {
  MoreHoriz
} from '@material-ui/icons'

export default class ReportCompany extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      open: false,
      key: '',
      year: ''

    }
  }

  componentDidMount() {
    document.title = 'รายงานสถานประกอบการ - ACTLOG ADMIN'
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
          var key = child.key
          id += 1
          items.push({
            id: id,
            key,
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
          var key = child.key
          id += 1
          items.push({
            id: id,
            key,
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

  handleAlert() {
    this.setState({ open: !this.state.open })
  }

  Alert() {
    const { open, key, name, tel, address } = this.state
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
                  pathname: '/cdetail',
                  state: { key }
                })
              }}>ดูข้อมูล</Button>
          </Grid>
          <Grid>
            <Button
              fullWidth
              onClick={() => {
                this.props.history.push({
                  pathname: '/ReportCompanyUsers',
                  state: {
                    key,
                    name,
                    tel,
                    address
                  }
                })
              }}>รายชื่อผู้ดูแล</Button>
          </Grid>
          <Grid>
            <Button
              fullWidth
              onClick={() => {
                this.props.history.push({
                  pathname: '/ReportCompanyStudent',
                  state: {
                    key,
                    name,
                    tel,
                    address
                  }
                })
              }}>รายชื่อนักศึกษา</Button>
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
    const { list, year } = this.state
    return (
      <Grid
        container>
        {this.Alert()}
        <Menus
          history={this.props.history}
          state={{ rCom: true }} />
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
                        onClickCapture={() => this.setState({
                          key: row.key,
                          name: row.name,
                          tel: row.tel,
                          address: `${row.add} ${row.add1} ${row.add2} ${row.province} ${row.zip}`
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