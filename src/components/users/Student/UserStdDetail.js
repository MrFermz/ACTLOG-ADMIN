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
  DialogActions
} from '@material-ui/core'
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers'
import MomentUtils from '@date-io/moment'
import th from 'moment/locale/th'

export default class UserDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      uid: ''
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
          company: '- เลือก -',
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
                          company: '- เลือก -',
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
      subject: 'เทคโนโลยีสารสนเทศ',
      vStat: true
    }).then(() => {
      // this.props.history.goBack()
      this.close()
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
    const { uid, sid, fname, lname, group, tel, dateStart, dateEnd, email, company, typeStat } = this.state
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
              value={sid} />
          </Grid>
          <Grid>
            <TextField
              // disabled
              label='ชื่อจริง'
              variant='outlined'
              margin='normal'
              value={fname} />
            <TextField
              // disabled
              label='นามสกุล'
              variant='outlined'
              margin='normal'
              value={lname} />
          </Grid>
          <Grid>
            <TextField
              // disabled
              label='อีเมลล์'
              variant='outlined'
              margin='normal'
              value={email} />
          </Grid>
          <Grid>
            <TextField
              // disabled
              label='กลุ่ม'
              variant='outlined'
              margin='normal'
              value={group} />
            <TextField
              // disabled
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
                // autoOk
                format='DD MMMM YYYY'
                variant='outlined'
                margin='normal'
                label='ระยะเวลาเริ่มฝึกงาน'
                value={dateStart} />
              <DatePicker
                disabled
                keyboard
                // autoOk
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
          <Button
            variant='contained'
            onClick={() => { this.props.history.goBack() }}>
            กลับ</Button>
          <Button
            variant='outlined'
            color='default'
            disabled>
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
        </Fragment>
      )
    } else {
      if (!typeStat) {
        return (
          <Fragment>
            <Grid>
              <TextField
                label='อีเมลล์'
                variant='outlined'
                margin='normal'
                value={email} />
            </Grid>
            <Button
              variant='contained'
              onClick={() => { this.props.history.goBack() }}>
              กลับ</Button>
            <Button
              variant='contained'
              color='primary'
              onClick={this.handleAlert.bind(this)}>
              ยืนยัน</Button>
          </Fragment>
        )
      }
    }
  }

  render() {
    return (
      <Grid
        xs={12}
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