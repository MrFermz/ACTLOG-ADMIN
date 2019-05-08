import React, { Component, Fragment } from 'react'
import firebase from '../../firebase'
import {
  Button,
  Paper,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  MenuItem,
  Typography
} from '@material-ui/core'
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers'
import MomentUtils from '@date-io/moment'
import th from 'moment/locale/th'

const userType = [
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

export default class UserDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      uid: '',
      type: ''
    }
  }

  componentDidMount() {
    document.title = 'ข้อมูลส่วนตัวนักศึกษา - ACTLOG ADMIN'
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.getData()
      } else {
        this.props.history.push('/')
      }
    })
  }

  getData() {
    var uid = this.props.location.state.uid
    this.setState({ uid: uid })
    firebase.database().ref(`users/${uid}`)
      .once('value').then((snapshot) => {
        var val = snapshot.val()
        this.setState({
          uid: uid,
          sid: val.sid,
          fname: val.fname,
          lname: val.lname,
          group: val.group,
          tel: val.telNum,
          dateStart: val.dateStart,
          dateEnd: val.dateEnd,
          email: val.email,
          company: '-',
          typeStat: val.typeStat,
          type: val.type
        })
        firebase.database().ref('comment')
          .orderByChild('suid')
          .equalTo(uid)
          .once('value').then((snapshot) => {
            snapshot.forEach((child) => {
              var val2 = child.val()
              var cuid = val2.cuid
              firebase.database().ref(`users/${cuid}/company`)
                .once('value').then((snapshot) => {
                  var val3 = snapshot.val()
                  var key = val3
                  firebase.database().ref(`company/${key}`)
                    .once('value').then((snapshot) => {
                      var val4 = snapshot.val()
                      if (val4.name) {
                        this.setState({
                          uid: uid,
                          sid: val.sid,
                          fname: val.fname,
                          lname: val.lname,
                          group: val.group,
                          tel: val.telNum,
                          dateStart: val.dateStart,
                          dateEnd: val.dateEnd,
                          email: val.email,
                          company: val4.name,
                          typeStat: val.typeStat,
                          type: val.type
                        })
                      } else {
                        this.setState({
                          uid: uid,
                          sid: val.sid,
                          fname: val.fname,
                          lname: val.lname,
                          group: val.group,
                          tel: val.telNum,
                          dateStart: val.dateStart,
                          dateEnd: val.dateEnd,
                          email: val.email,
                          company: '-',
                          typeStat: val.typeStat,
                          type: val.type
                        })
                      }
                    })
                })
            })
          })
      })
  }

  onTypeStat() {
    const { uid } = this.state
    // console.log(uid)
    firebase.database().ref(`users/${uid}`).update({
      typeStat: true,
      setup: true,
      sidStat: true,
      subject: 'เทคโนโลยีสารสนเทศ'
    }).then(() => {
      this.handleAlert()
      this.getData()
    })
  }

  handleAlert() {
    this.setState({ open: !this.state.open })
  }

  Alert() {
    const { open } = this.state
    return (
      <Dialog
        open={open}
        onClose={this.handleAlert.bind(this)}>
        <DialogTitle>{`แจ้งเตือน`}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`คุณแน่ใจหรือไม่ที่จะยืนยันผู้ใช้ ?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={this.handleAlert.bind(this)}>
            ยกเลิก</Button>
          <Button
            color='primary'
            onClick={this.onTypeStat.bind(this)}>
            ตกลง</Button>
        </DialogActions>
      </Dialog>
    )
  }

  typeStatRender() {
    const { uid, sid, fname, lname, group, tel, dateStart, dateEnd, email, company, typeStat, type } = this.state
    // var options = { year: 'numeric', month: 'long', day: 'numeric' }
    // var start = new Date(dateStart).toLocaleDateString('th-TH', options)
    // var end = new Date(dateEnd).toLocaleDateString('th-TH', options)
    // console.log(company)
    if (typeStat) {
      return (
        <Fragment>
          <Grid>
            <TextField
              InputLabelProps={{ shrink: true }}
              label='รหัสนักศึกษา'
              variant='outlined'
              margin='normal'
              value={sid}
              style={{ marginRight: 10 }} />
          </Grid>
          <Grid>
            <TextField
              label='ชื่อจริง'
              variant='outlined'
              margin='normal'
              value={fname}
              style={{ marginRight: 10 }} />
            <TextField
              label='นามสกุล'
              variant='outlined'
              margin='normal'
              value={lname} />
          </Grid>
          <Grid>
            <TextField
              label='อีเมลล์'
              variant='outlined'
              margin='normal'
              value={email} />
          </Grid>
          <Grid>
            <TextField
              label='กลุ่ม'
              variant='outlined'
              margin='normal'
              value={group}
              style={{ marginRight: 10 }} />
            <TextField
              label='เบอร์โทร'
              variant='outlined'
              margin='normal'
              value={tel} />
          </Grid>
          <Grid>
            <MuiPickersUtilsProvider
              utils={MomentUtils}
              locale={th}>
              <DatePicker
                disabled
                keyboard
                format='DD MMMM YYYY'
                variant='outlined'
                margin='normal'
                label='ระยะเวลาเริ่มฝึกงาน'
                value={dateStart}
                style={{ marginRight: 10 }} />
              <DatePicker
                disabled
                keyboard
                format='DD MMMM YYYY'
                variant='outlined'
                margin='normal'
                label='ระยะเวลาจบฝึกงาน'
                value={dateEnd} />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid>
            <TextField
              style={{ width: 300 }}
              label='สถานประกอบการ'
              variant='outlined'
              margin='normal'
              value={company} />
          </Grid>
          <Grid
            style={{ marginTop: 15 }}>
            <Button
              variant='contained'
              onClick={() => { this.props.history.goBack() }}
              style={{ marginRight: 10 }}>
              กลับ</Button>
            <Button
              variant='outlined'
              color='default'
              disabled
              style={{ marginRight: 10 }}>
              ยืนยันแล้ว</Button>
            <Button
              variant='contained'
              color='primary'
              onClick={() => {
                this.props.history.push({
                  pathname: '/stdEdit',
                  state: { uid: uid }
                })
              }}>แก้ไข</Button>
          </Grid>
        </Fragment>
      )
    } else {
      if (!typeStat) {
        return (
          <Fragment>
            <Grid>
              <Typography
                style={{ color: 'gray', marginBottom: 15 }}>
                {`ยืนยันผู้ใช้เพื่อให้เข้าใช้งานแอปพลิเคชันได้ และแอดมินสามารถดู แก้ไข ข้อมูลได้`}</Typography>
              <TextField
                InputLabelProps={{ shrink: true }}
                label='อีเมลล์'
                variant='outlined'
                margin='normal'
                value={email}
                style={{ marginRight: 10 }} />
              <TextField
                InputLabelProps={{ shrink: true }}
                select
                label='ประเภทผู้ใช้'
                variant='outlined'
                margin='normal'
                helperText='ทำงานทันทีเมื่อเลือก'
                onChange={this.onChangeType}
                value={type}
                style={{ width: 150 }}>
                {userType.map((option, i) => (
                  <MenuItem key={i} value={option.value}>{option.label}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid
              style={{ marginTop: 15 }}>
              <Button
                variant='contained'
                onClick={() => { this.props.history.goBack() }}
                style={{ marginRight: 10 }}>
                กลับ</Button>
              <Button
                variant='contained'
                color='primary'
                onClick={this.handleAlert.bind(this)}>
                ยืนยัน</Button>
            </Grid>
          </Fragment>
        )
      }
    }
  }

  onChangeType = (e) => {
    const { value } = e.target
    var uid = this.props.location.state.uid
    console.log(value, uid)
    firebase.database().ref(`users/${uid}`).update({
      type: value
    }).then(() => {
      if (value === 'Student') {
        //
      } else {
        this.props.history.goBack()
      }
    })
  }

  render() {
    return (
      <Grid
        container
        direction='column'
        justify='center'
        alignItems='center'>
        <Paper
          style={{ marginTop: 20, width: 700, padding: 20 }}>
          {this.typeStatRender()}
        </Paper>
        {this.Alert()}
      </Grid>
    )
  }
}