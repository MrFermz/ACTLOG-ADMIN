import React, { Component, Fragment } from 'react'
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
  MenuItem,
  Typography
} from '@material-ui/core'

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

export default class UserAdminDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      del: false,
      uid: ''
    }
  }

  componentDidMount() {
    document.title = 'ข้อมูลส่วนตัวแอดมิน - ACTLOG ADMIN'
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
          typeStat: val.typeStat,
          type: val.type
        })
      })
  }

  onTypeStat() {
    const { uid } = this.state
    firebase.database().ref(`users/${uid}`).update({
      typeStat: true
    }).then(() => {
      this.handleAlert()
      this.getData()
    })
  }

  onDelete() {
    // var uid = this.props.location.state.uid
  }

  handleAlert() {
    this.setState({ open: !this.state.open })
  }

  handleDelete() {
    this.setState({ del: !this.state.del })
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

  Delete() {
    const { del } = this.state
    return (
      <Dialog
        open={del}
        onClose={this.handleDelete.bind(this)}>
        <DialogTitle>{`แจ้งเตือน`}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`คุณแน่ใจหรือไม่ที่จะยืนยันผู้ใช้ ?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={this.handleDelete.bind(this)}>
            ยกเลิก</Button>
          <Button
            color='secondary'
            onClick={this.onDelete.bind(this)}>
            ลบ</Button>
        </DialogActions>
      </Dialog>
    )
  }

  typeStatRender() {
    const { uid, fname, lname, email, typeStat, type } = this.state
    if (typeStat) {
      return (
        <Fragment>
          <Grid>
            <TextField
              InputLabelProps={{ shrink: true }}
              label='ชื่อจริง'
              variant='outlined'
              margin='normal'
              value={fname}
              style={{ marginRight: 10 }} />
            <TextField
              InputLabelProps={{ shrink: true }}
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
                  pathname: '/adminEdit',
                  state: { uid: uid }
                })
              }}>แก้ไข</Button>
          </Grid>
        </Fragment>
      )
    } else {
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
              onClick={this.handleAlert.bind(this)}
              style={{ marginRight: 10 }}>
              ยืนยัน</Button>
            {/* <Button
              variant='contained'
              color='secondary'
              onClick={this.handleDelete.bind(this)}>
              ลบทิ้ง</Button> */}
          </Grid>
        </Fragment >
      )
    }
  }

  onChangeType = (e) => {
    const { value } = e.target
    var uid = this.props.location.state.uid
    console.log(value, uid)
    firebase.database().ref(`users/${uid}`).update({
      type: value
    }).then(() => {
      if (value === 'Admin') {
        //
      } else {
        this.props.history.goBack()
      }
    })
  }

  render() {
    return (
      <Grid
        xs={12}
        container
        justify='center'
        alignItems='center'>
        <Paper style={{ marginTop: 20, width: 700, padding: 20 }}>
          {this.typeStatRender()}
        </Paper>
        {this.Alert()}
        {this.Delete()}
      </Grid>
    )
  }
}