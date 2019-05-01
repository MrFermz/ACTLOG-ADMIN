import React, { Component } from 'react'
import firebase from '../../firebase'
import {
  Grid,
  Paper,
  TextField,
  Button,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@material-ui/core'
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers'
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
    // console.log(uid)
    this.setState({ uid: uid })
    firebase.database().ref(`users/${uid}`)
      .once('value').then((snapshot) => {
        var val = snapshot.val()
        // console.log(val.company)
        firebase.database().ref(`company/${val.company}`)
          .once('value').then((snapshot) => {
            console.log(snapshot.val().name)
            this.setState({
              sid: val.sid,
              fname: val.fname,
              lname: val.lname,
              email: val.email,
              group: val.group,
              tel: val.telNum,
              dateStartPicker: val.dateStart,
              dateEndPicker: val.dateEnd,
              company: snapshot.key
            })
          })
      })
    firebase.database().ref('company')
      .orderByChild('name')
      .once('value').then((snapshot) => {
        snapshot.forEach((child) => {
          // console.log(child.key)
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
    const { uid, sid, fname, lname, group, tel, dateStartPicker, dateEndPicker, company } = this.state
    firebase.database().ref(`users/${uid}`).update({
      sid: sid,
      fname: fname,
      lname: lname,
      group: group,
      telNum: tel,
      dateStart: dateStartPicker,
      dateEnd: dateEndPicker,
      company: company
    }).then(() => {
      // console.log('Saved.')
      this.close()
      this.props.history.goBack()
    })
  }

  onChange = (e) => {
    const { value } = e.target
    console.log(value)
    this.setState({ company: value })
  }

  onStartDateChange = (e) => {
    // console.log(`Start : ${e}`)
    this.setState({ dateStartPicker: new Date(e) }, () => this.onDateChange())
  }

  onEndDateChange = (e) => {
    // console.log(`End : ${e}`)
    this.setState({ dateEndPicker: new Date(e) }, () => this.onDateChange())
  }

  onDateChange() {
    const { dateStartPicker, dateEndPicker } = this.state
    console.log(`${dateStartPicker} ## ${dateEndPicker}`)
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
    const { sid, fname, lname, email, group, tel, company, list, dateStartPicker, dateEndPicker } = this.state
    // console.log(list)
    return (
      <Grid
        xs={12}
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
              onChange={(e) => { this.setState({ fname: e.target.value }) }} />
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
              label='อีเมลล์'
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
              onChange={(e) => { this.setState({ group: e.target.value }) }} />
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
                onChange={this.onStartDateChange} />
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
              select
              label='เลือกสถานประกอบการ'
              variant='outlined'
              margin='normal'
              value={company}
              onChange={this.onChange} >
              {list.map((option, i) => {
                return <MenuItem key={i} value={option.id}>{option.name}</MenuItem>
              })}
            </TextField>
          </Grid>
          <Grid>
            <Button
              variant='contained'
              onClick={() => this.props.history.goBack()}>
              ยกเลิก</Button>
            <Button
              variant='contained'
              onClick={() => { this.props.history.push('/lists') }}>
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