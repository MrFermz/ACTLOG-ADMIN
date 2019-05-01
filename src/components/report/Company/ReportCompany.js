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

class ReportCompany extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      open: false,
      key: ''
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
          {/* <DialogContentText>
            {`เลือกเมนูที่จะดูรายงาน`}
          </DialogContentText> */}
          <Grid>
            <Button
              fullWidth
              onClick={() => {
                this.props.history.push({
                  pathname: '/cdetail',
                  state: { key: key }
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
          state={{ rCom: true }} />
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
                  <TableCell>ชื่อสถานประกอบการ</TableCell>
                  <TableCell>เบอร์ติดต่อ</TableCell>
                  <TableCell>ที่อยู่</TableCell>
                  <TableCell>เพิ่มเติม</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {list.map((row, i) => (
                  <TableRow
                    key={i}
                    style={i % 2 === 0 ? { backgroundColor: '#EEEEEE' } : null}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.tel}</TableCell>
                    <TableCell>{`${row.add} ${row.add1} ${row.add2} ${row.province} ${row.zip}`}</TableCell>
                    <TableCell>
                      <Button
                        variant='contained'
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

export default ReportCompany