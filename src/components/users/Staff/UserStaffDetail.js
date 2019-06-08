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

export default class UserStaffDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      uid: '',
      type: ''
    }
  }

  componentDidMount() {
    document.title = 'ข้อมูลส่วนตัวผู้ดูแล - ACTLOG ADMIN'
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
        var key = val.company
        if (key) {
          firebase.database().ref(`company/${key}`)
            .once('value').then((snapshot) => {
              var val1 = snapshot.val()
              this.setState({
                uid: val.uid,
                fname: val.fname,
                lname: val.lname,
                tel: val.tel_number,
                email: val.email,
                typeStat: val.stat_type_user,
                type: val.type_user,
                company: val1.name,
                position: val.position,
                major: val.major
              })
            })
        } else {
          firebase.database().ref(`company/${key}`)
            .once('value').then((snapshot) => {
              this.setState({
                uid: val.uid,
                fname: val.fname,
                lname: val.lname,
                tel: val.tel_number,
                email: val.email,
                typeStat: val.stat_type_user,
                type: val.type_user,
                company: '-',
                position: val.position,
                major: val.major
              })
            })
        }
      })
  }

  onTypeStat() {
    const { uid, type } = this.state
    firebase.database().ref(`users/${uid}`)
      .update({
        stat_type_user: true,
        stat_setup: true,
        type_user: type
      }).then(() => {
        // this.props.history.goBack()
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
    const { uid, fname, lname, tel, email, typeStat, company, type, position, major } = this.state
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
              label='อีเมล'
              variant='outlined'
              margin='normal'
              value={email} />
          </Grid>
          <Grid>
            <TextField
              label='เบอร์โทร'
              variant='outlined'
              margin='normal'
              value={tel} />
          </Grid>
          <Grid>
            <TextField
              style={{ width: 300 }}
              label='สถานประกอบการ'
              variant='outlined'
              margin='normal'
              value={company} />
          </Grid>
          <Grid>
            <TextField
              label='ตำแหน่ง'
              variant='outlined'
              margin='normal'
              value={position}
              style={{ width: 300, marginRight: 10 }} />
            <TextField
              style={{ width: 300 }}
              label='ฝ่าย/แผนกงาน'
              variant='outlined'
              margin='normal'
              value={major} />
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
                  pathname: '/staffEdit',
                  state: { uid: uid }
                })
              }}>
              แก้ไข</Button>
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
              label='อีเมล'
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
        </Fragment >
      )
    }
  }

  onChangeType = (e) => {
    const { value } = e.target
    var uid = this.props.location.state.uid
    firebase.database().ref(`users/${uid}`).update({
      type_user: value
    }).then(() => {
      if (value === 'Staff') {
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
        item
        container
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