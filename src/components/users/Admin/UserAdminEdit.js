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

export default class UserAdminEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      fname: '',
      lname: '',
      email: '',
      type: ''
    }
  }

  componentDidMount() {
    document.title = 'แก้ไขข้อมูลส่วนตัวแอดมิน - ACTLOG ADMIN'
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
          uid: val.uid,
          fname: val.fname,
          lname: val.lname,
          email: val.email,
          type: val.type
        })
      })
  }

  onSubmit = (e) => {
    e.preventDefault()
    const { uid, fname, lname, email } = this.state
    firebase.database().ref(`users/${uid}`).update({
      fname,
      lname,
      email
    }).then(() => {
      this.handleAlert()
      this.props.history.goBack()
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
    const { fname, lname, email } = this.state
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
              label='อีเมลล์'
              variant='outlined'
              margin='normal'
              value={email}
              onChange={(e) => { this.setState({ email: e.target.value }) }} />
          </Grid>
          <Grid
            style={{ marginTop: 15 }} >
            <Button
              variant='contained'
              onClick={() => this.props.history.goBack()}
              style={{ marginRight: 10 }} >
              ยกเลิก</Button>
            <Button
              variant='contained'
              onClick={() => { this.props.history.push('/lists') }}
              style={{ marginRight: 10 }} >
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