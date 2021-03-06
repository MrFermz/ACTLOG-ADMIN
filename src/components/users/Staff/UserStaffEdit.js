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
  DialogActions,
  MenuItem
} from '@material-ui/core'

export default class UserStaffEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      fname: '',
      lname: '',
      tel: '',
      email: '',
      type: '',
      list: [],
      position: '',
      major: ''
    }
  }

  componentDidMount() {
    document.title = 'แก้ไขข้อมูลส่วนตัวผู้ดูแล - ACTLOG ADMIN'
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
    var items = []
    this.setState({ uid: uid })
    firebase.database().ref(`users/${uid}`)
      .once('value').then((snapshot) => {
        var val = snapshot.val()
        var ckey = val.company
        firebase.database().ref(`company/${ckey}`)
          .once('value').then((snapshot) => {
            // var val1 = snapshot.val()
            var key = snapshot.key
            this.setState({
              uid: val.uid,
              fname: val.fname,
              lname: val.lname,
              tel: val.tel_number,
              email: val.email,
              type: val.type_user,
              company: key,
              position: val.position,
              major: val.major
            })
          })
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
    const { uid, fname, lname, tel, email, company, position, major } = this.state
    if (fname || lname || tel || email || company || position || major) {
      firebase.database().ref(`users/${uid}`)
        .update({
          fname,
          lname,
          tel_number: tel,
          email,
          company,
          position,
          major
        }).then(() => {
          this.handleAlert()
          this.props.history.goBack()
        })
    } else {
      firebase.database().ref(`users/${uid}`)
        .update({
          fname: '',
          lname: '',
          tel_number: '',
          email: '',
          company: '',
          position: '',
          major: ''
        }).then(() => {
          this.handleAlert()
          this.props.history.goBack()
        })
    }
  }

  onChange = (e) => {
    const { value } = e.target
    this.setState({ company: value })
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
    const { fname, lname, tel, email, list, company, position, major } = this.state
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
              label='ชื่อจริง'
              variant='outlined'
              margin='normal'
              value={fname}
              onChange={(e) => { this.setState({ fname: e.target.value }) }}
              style={{ marginRight: 10 }} />
            <TextField
              label='นามสกุล'
              variant='outlined'
              margin='normal'
              value={lname}
              onChange={(e) => { this.setState({ lname: e.target.value }) }} />
          </Grid>
          <Grid>
            <TextField
              label='อีเมล'
              variant='outlined'
              margin='normal'
              value={email}
              onChange={(e) => { this.setState({ email: e.target.value }) }} />
          </Grid>
          <Grid>
            <TextField
              label='เบอร์โทร'
              variant='outlined'
              margin='normal'
              value={tel}
              onChange={(e) => { this.setState({ tel: e.target.value }) }} />
          </Grid>
          <Grid>
            <TextField
              InputLabelProps={{ shrink: true }}
              style={{ width: 300 }}
              select
              label='เลือกสถานประกอบการ'
              variant='outlined'
              margin='normal'
              value={company}
              onChange={this.onChange} >
              {list.map((option, i) => {
                return <MenuItem key={i} value={option.id}>{option.name}</MenuItem>
              })}</TextField>
          </Grid>
          <Grid>
            <TextField
              label='ตำแหน่ง'
              variant='outlined'
              margin='normal'
              value={position}
              style={{ width: 300, marginRight: 10 }}
              onChange={(e) => { this.setState({ position: e.target.value }) }} />
            <TextField
              style={{ width: 300 }}
              label='ฝ่าย/แผนกงาน'
              variant='outlined'
              margin='normal'
              value={major}
              onChange={(e) => { this.setState({ major: e.target.value }) }} />
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