import React, { Component } from 'react'
import firebase from '../../firebase'
import {
  Button,
  Paper,
  Grid,
  TextField,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@material-ui/core'
import {
  MoreHoriz
} from '@material-ui/icons'

export default class ReportCompanyUsers extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      open: false,
      name: this.props.location.state.name,
      tel: this.props.location.state.tel,
      address: this.props.location.state.address,
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
    var key = this.props.location.state.key
    console.log(key)
    firebase.database().ref('users')
      .orderByChild('company')
      .equalTo(key)
      .once('value').then((snapshot) => {
        snapshot.forEach((child) => {
          var val = child.val()
          if (val.type === 'Staff') {
            id += 1
            items.push({
              id,
              uid: val.uid,
              fname: val.fname,
              lname: val.lname,
              tel: val.telNum,
              email: val.email,
            })
          }
        })
        this.setState({ list: items })
      })
  }

  handleAlert() {
    this.setState({ open: !this.state.open })
  }

  Alert() {
    const { open, uid } = this.state
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
                  pathname: '/staffDetail',
                  state: { uid }
                })
              }}>ข้อมูลผู้ใช้</Button>
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
    const { list, name, tel, address } = this.state
    return (
      <Grid
        container>
        {this.Alert()}
        <Grid
          container
          direction='column'
          style={{ padding: 30 }}>
          <Typography>{name}</Typography>
          <Typography>{tel}</Typography>
          <Typography>{address}</Typography>
          <Paper
            style={{ width: '100%' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ลำดับ</TableCell>
                  <TableCell>ชื่อ - สกุล</TableCell>
                  <TableCell>เบอร์โทร</TableCell>
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
                    <TableCell>{row.fname}  {row.lname}</TableCell>
                    <TableCell>{row.tel}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>
                      <Button
                        variant='contained'
                        onClickCapture={() => this.setState({ uid: row.uid })}
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