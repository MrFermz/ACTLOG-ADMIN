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

export default class ReportTeacherVisit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      open: false,
      fname: this.props.location.state.fname,
      lname: this.props.location.state.lname,
      email: this.props.location.state.email
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
    var tuid = this.props.location.state.uid
    var vsuid = [], suid = []

    firebase.database().ref('visit')
      .orderByChild('tuid')
      .equalTo(tuid)
      .once('value').then((snapshot) => {
        snapshot.forEach((child) => {
          var val = child.val()
          vsuid.push(val.suid)
        })
        this.setState({ Vsuid: vsuid })
      })

    firebase.database().ref('users')
      .orderByChild('type')
      .equalTo('Student')
      .once('value').then((snapshot) => {
        snapshot.forEach((child) => {
          var val = child.val()
          suid.push(val.uid)
        })
        this.setState({ suid })
      }).then(() => {
        this.renerList(tuid)
      })
  }

  renerList(tuid) {
    const { Vsuid, suid } = this.state
    var final = [], items = [], id = 0
    final = suid.filter(val => Vsuid.includes(val))
    final.forEach((val) => {
      firebase.database().ref(`users/${val}`)
        .once('value').then((snapshot) => {
          var val1 = snapshot.val()

          firebase.database().ref('visit')
            .orderByChild('suid')
            .equalTo(val)
            .once('value').then((snapshot) => {
              snapshot.forEach((child) => {
                var val2 = child.val()
                if (tuid === val2.tuid) {
                  id += 1
                  items.push({
                    id,
                    fname: val1.fname,
                    lname: val1.lname,
                    email: val1.email,
                    sid: val1.sid,
                    uid: val1.uid,
                    score1: val2.score1,
                    score2: val2.score2,
                    score3: val2.score3,
                    score4: val2.score4,
                    score5: val2.score5,
                    comment: val2.comment
                  })
                }
              })
              this.setState({ list: items })
            })
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
          {/* <DialogContentText>
            {`เลือกเมนูที่จะดูรายงาน`}
          </DialogContentText> */}
          <Grid>
            <Button
              fullWidth
              onClick={() => {
                this.props.history.push({
                  pathname: '/stdDetail',
                  state: { uid: uid }
                })
              }}>ข้อมูลผู้ใช้</Button>
          </Grid>
          <Grid>
            <Button
              fullWidth
              onClick={() => {
                this.props.history.push({
                  pathname: '/ReportVisitDetail',
                  state: {
                    uid: uid,
                    tuid: this.props.location.state.uid,
                    fname,
                    lname,
                    email
                  }
                })
              }}>รายละเอียดนิเทศ</Button>
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
    const { list, fname, lname, email } = this.state
    // console.log(list)
    return (
      <Grid
        container>
        {this.Alert()}
        <Grid
          container
          direction='column'
          style={{ padding: 30 }}>
          <Typography>{fname} {lname}</Typography>
          <Typography>{email}</Typography>
          <Paper
            style={{ width: '100%' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ลำดับ</TableCell>
                  <TableCell>ชื่อ - สกุล</TableCell>
                  <TableCell>ความรับผิดชอบต่องานที่ได้รับมอบหมาย</TableCell>
                  <TableCell>มีความรอบคอบในการทำงาน</TableCell>
                  <TableCell>มีมนุษย์สัมพันธ์</TableCell>
                  <TableCell>การตรงต่อเวลา</TableCell>
                  <TableCell>ปฏิบัติตนถูกต้องตามระเบียบข้อบังคับของสถานที่ฝึกงาน</TableCell>
                  <TableCell>เพิ่มเติม</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {list.map((row, i) => (
                  <TableRow
                    key={i}
                    style={i % 2 === 0 ? { backgroundColor: '#EEEEEE' } : null}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.fname} {row.lname}</TableCell>
                    <TableCell>{row.score1}</TableCell>
                    <TableCell>{row.score2}</TableCell>
                    <TableCell>{row.score3}</TableCell>
                    <TableCell>{row.score4}</TableCell>
                    <TableCell>{row.score5}</TableCell>
                    <TableCell>
                      <Button
                        variant='contained'
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