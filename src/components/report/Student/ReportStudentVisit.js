import React, { Component } from 'react'
import firebase from '../../firebase'
import {
  Button,
  Paper,
  Grid,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip
} from '@material-ui/core'
import {
  MoreHoriz
} from '@material-ui/icons'

export default class ReportVisit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      open: false,
      sid: this.props.location.state.sid,
      fname: this.props.location.state.fname,
      lname: this.props.location.state.lname,
      email: this.props.location.state.email,
      score1: 0,
      score2: 0,
      score3: 0,
      score4: 0,
      score5: 0,
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
    var suid = this.props.location.state.uid
    var vtuid = [], tuid = []

    firebase.database().ref('visit')
      .orderByChild('suid')
      .equalTo(suid)
      .once('value').then((snapshot) => {
        snapshot.forEach((child) => {
          var val = child.val()
          vtuid.push(val.tuid)
        })
        this.setState({ Vtuid: vtuid })
      })

    firebase.database().ref('users')
      .orderByChild('type')
      .equalTo('Teacher')
      .once('value').then((snapshot) => {
        snapshot.forEach((child) => {
          var val = child.val()
          tuid.push(val.uid)
        })
        this.setState({ tuid })
      }).then(() => {
        this.renerList(suid)
      })
  }

  renerList(suid) {
    const { Vtuid, tuid } = this.state
    var final = [], items = [], id = 0
    final = tuid.filter(val => Vtuid.includes(val))
    final.forEach((val) => {
      firebase.database().ref(`users/${val}`)
        .once('value').then((snapshot) => {
          var val1 = snapshot.val()

          firebase.database().ref('visit')
            .orderByChild('tuid')
            .equalTo(val)
            .once('value').then((snapshot) => {
              snapshot.forEach((child) => {
                var val2 = child.val()
                if (suid === val2.suid) {
                  id += 1
                  items.push({
                    id,
                    fname: val1.fname,
                    lname: val1.lname,
                    email: val1.email,
                    uid: val1.uid,
                    score1: val2.score1,
                    score2: val2.score2,
                    score3: val2.score3,
                    score4: val2.score4,
                    score5: val2.score5,
                    comment: val2.comment
                  })

                  var score1 = val2.score1 + this.state.score1
                  var score2 = val2.score2 + this.state.score2
                  var score3 = val2.score3 + this.state.score3
                  var score4 = val2.score4 + this.state.score4
                  var score5 = val2.score5 + this.state.score5

                  if (score1) {
                    this.setState({
                      score1: score1 / id
                    })
                  } if (score2) {
                    this.setState({
                      score2: score2 / id
                    })
                  } if (score3) {
                    this.setState({
                      score3: score3 / id
                    })
                  } if (score4) {
                    this.setState({
                      score4: score4 / id
                    })
                  } if (score5) {
                    this.setState({
                      score5: score5 / id
                    })
                  }
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
                  pathname: '/teachDetail',
                  state: { uid: uid }
                })
              }}>ดูข้อมูลผู้ใช้</Button>
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
    const { list, sid, fname, lname, email } = this.state
    const { score1, score2, score3, score4, score5 } = this.state
    return (
      <Grid
        container>
        {this.Alert()}
        <Grid
          container
          direction='column'
          style={{ padding: 30, alignItems: 'center' }}>
          <Typography
            variant='h4'
            color='primary'
            align='center'
            gutterBottom>
            {sid}</Typography>
          <Typography
            variant='h6'
            align='center'
            gutterBottom>
            {fname} {lname}</Typography>
          <Typography
            variant='h6'
            align='center'
            gutterBottom>
            {email}</Typography>
          <Paper
            style={{ width: '100%' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ลำดับ</TableCell>
                  <TableCell>ชื่อ - สกุล</TableCell>
                  <Tooltip placement='top' title='ความรับผิดชอบต่องานที่ได้รับมอบหมาย'>
                    <TableCell>เกณฑ์ที่ 1</TableCell>
                  </Tooltip>
                  <Tooltip placement='top' title='มีความรอบคอบในการทำงาน'>
                    <TableCell>เกณฑ์ที่ 2</TableCell>
                  </Tooltip>
                  <Tooltip placement='top' title='มีมนุษย์สัมพันธ์'>
                    <TableCell>เกณฑ์ที่ 3</TableCell>
                  </Tooltip>
                  <Tooltip placement='top' title='การตรงต่อเวลา'>
                    <TableCell>เกณฑ์ที่ 4</TableCell>
                  </Tooltip>
                  <Tooltip placement='top' title='ปฏิบัติตนถูกต้องตามระเบียบข้อบังคับของสถานที่ฝึกงาน'>
                    <TableCell>เกณฑ์ที่ 5</TableCell>
                  </Tooltip>
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
                    <TableCell style={!row.score1 ? { backgroundColor: 'pink' } : null}>{row.score1}</TableCell>
                    <TableCell style={!row.score2 ? { backgroundColor: 'pink' } : null}>{row.score2}</TableCell>
                    <TableCell style={!row.score3 ? { backgroundColor: 'pink' } : null}>{row.score3}</TableCell>
                    <TableCell style={!row.score4 ? { backgroundColor: 'pink' } : null}>{row.score4}</TableCell>
                    <TableCell style={!row.score5 ? { backgroundColor: 'pink' } : null}>{row.score5}</TableCell>
                    <TableCell>
                      <Button
                        variant='contained'
                        onClickCapture={() => this.setState({
                          uid: row.uid
                        })}
                        onClick={this.handleAlert.bind(this)}>
                        <MoreHoriz /></Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell
                    align='center'
                    colSpan={2}>เฉลี่ย</TableCell>
                  <TableCell>{score1.toFixed(2)}</TableCell>
                  <TableCell>{score2.toFixed(2)}</TableCell>
                  <TableCell>{score3.toFixed(2)}</TableCell>
                  <TableCell>{score4.toFixed(2)}</TableCell>
                  <TableCell>{score5.toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    )
  }
}