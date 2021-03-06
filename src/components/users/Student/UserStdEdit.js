import React, { Component } from 'react'
import firebase from '../../firebase'
import {
  Grid,
  Paper,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@material-ui/core'
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers'
import MomentUtils from '@date-io/moment'
import th from 'moment/locale/th'

export default class UserEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      uid: '',
      sid: '',
      fname: '',
      lname: '',
      email: '',
      group: '',
      tel: '',
      company: '',
      list: [],
      dateStartPicker: '',
      dateEndPicker: ''
    }
  }

  componentDidMount() {
    document.title = 'แก้ไขข้อมูลส่วนตัวนักศึกษา - ACTLOG ADMIN'
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.getData()
      } else {
        this.props.history.push('/')
      }
    })
  }

  getData() {
    var items = []
    var uid = this.props.location.state.uid
    this.setState({ uid })
    firebase.database().ref(`users/${uid}`)
      .once('value').then((snapshot) => {
        var val = snapshot.val()
        this.setState({
          sid: val.suid,
          fname: val.fname,
          lname: val.lname,
          email: val.email,
          group: val.group,
          tel: val.tel_number,
          dateStartPicker: val.date_start,
          dateEndPicker: val.date_end,
          company: '-'
        })
        firebase.database().ref('comment')
          .orderByChild('suid')
          .equalTo(uid)
          .once('value').then((snapshot => {
            snapshot.forEach((child) => {
              var val1 = child.val()
              var cuid = val1.cuid
              firebase.database().ref(`users/${cuid}/company`)
                .once('value').then((snapshot) => {
                  var val2 = snapshot.val()
                  var key = val2
                  firebase.database().ref(`company/${key}`)
                    .once('value').then((snapshot) => {
                      var val3 = snapshot.val()
                      this.setState({
                        sid: val.suid,
                        fname: val.fname,
                        lname: val.lname,
                        email: val.email,
                        group: val.group,
                        tel: val.tel_number,
                        dateStartPicker: val.date_start,
                        dateEndPicker: val.date_end,
                        company: val3.name
                      })
                    })
                })
            })
          }))
      })
    firebase.database().ref('company')
      .orderByChild('name')
      .once('value').then((snapshot) => {
        snapshot.forEach((child) => {
          items.push({
            id: child.key,
            name: child.val().name
          })
        })
        this.setState({ list: items })
      })
  }

  onSubmit = (e) => {
    e.preventDefault()
    const { uid, sid, fname, lname, group, tel, dateStartPicker, dateEndPicker } = this.state
    console.log(fname)
    if (dateStartPicker || dateEndPicker || sid || fname || lname || group || tel) {
      firebase.database().ref(`users/${uid}`).update({
        suid: sid,
        fname,
        lname,
        group,
        tel_number: tel,
        date_start: dateStartPicker,
        date_end: dateEndPicker
      }).then(() => {
        this.handleAlert()
        this.props.history.goBack()
      })
    } else {
      firebase.database().ref(`users/${uid}`).update({
        suid: '',
        fname: '',
        lname: '',
        group: '',
        tel_number: '',
        date_start: '',
        date_end: ''
      }).then(() => {
        this.handleAlert()
        this.props.history.goBack()
      })
    }
  }

  onStartDateChange = (e) => {
    this.setState({ dateStartPicker: new Date(e) })
  }

  onEndDateChange = (e) => {
    this.setState({ dateEndPicker: new Date(e) })
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
            {`คุณแน่ใจหรือไม่ที่จะบันทึกข้อมูลที่แก้ไขแล้ว ?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={this.handleAlert.bind(this)}>
            ยกเลิก</Button>
          <Button
            color='primary'
            onClick={this.onSubmit.bind(this)}>
            ตกลง</Button>
        </DialogActions>
      </Dialog>
    )
  }

  render() {
    const { sid, fname, lname, email, group, tel, company, dateStartPicker, dateEndPicker } = this.state
    return (
      <Grid
        xs={12}
        item
        container
        justify='center'
        alignItems='center'>
        {this.Alert()}
        <Paper
          style={{ marginTop: 20, width: 700, padding: 20 }}>
          <Grid>
            <TextField
              label='รหัสนักศึกษา'
              variant='outlined'
              margin='normal'
              name='sid'
              value={sid}
              onChange={(e) => { this.setState({ sid: e.target.value }) }} />
          </Grid>
          <Grid>
            <TextField
              label='ชื่อจริง'
              variant='outlined'
              margin='normal'
              name='fname'
              value={fname}
              onChange={(e) => { this.setState({ fname: e.target.value }) }}
              style={{ marginRight: 10 }} />
            <TextField
              label='นามสกุล'
              variant='outlined'
              margin='normal'
              name='lname'
              value={lname}
              onChange={(e) => { this.setState({ lname: e.target.value }) }} />
          </Grid>
          <Grid>
            <TextField
              disabled
              label='อีเมล'
              variant='outlined'
              margin='normal'
              name='email'
              value={email} />
          </Grid>
          <Grid>
            <TextField
              label='กลุ่ม'
              variant='outlined'
              margin='normal'
              name='group'
              value={group}
              onChange={(e) => { this.setState({ group: e.target.value }) }}
              style={{ marginRight: 10 }} />
            <TextField
              label='เบอร์โทร'
              variant='outlined'
              margin='normal'
              name='tel'
              value={tel}
              onChange={(e) => { this.setState({ tel: e.target.value }) }} />
          </Grid>
          <Grid>
            <MuiPickersUtilsProvider
              utils={MomentUtils}
              locale={th}>
              <DatePicker
                keyboard
                autoOk
                format='DD MMMM YYYY'
                variant='outlined'
                margin='normal'
                label='ระยะเวลาเริ่มฝึกงาน'
                value={dateStartPicker}
                onChange={this.onStartDateChange}
                style={{ marginRight: 10 }} />
              <DatePicker
                keyboard
                autoOk
                format='DD MMMM YYYY'
                variant='outlined'
                margin='normal'
                label='ระยะเวลาจบฝึกงาน'
                value={dateEndPicker}
                onChange={this.onEndDateChange} />
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
              onClick={() => this.props.history.goBack()}
              style={{ marginRight: 10 }}>
              ยกเลิก</Button>
            <Button
              variant='contained'
              onClick={() => { this.props.history.push('/lists') }}
              style={{ marginRight: 10 }}>
              หน้าแรก</Button>
            <Button
              variant='contained'
              color='primary'
              onClick={this.handleAlert.bind(this)}>
              บันทึก</Button>
          </Grid>
        </Paper>
      </Grid>
    )
  }
}