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
  DialogActions
} from '@material-ui/core'

export default class UserStaffDetail extends Component {
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
        var ckey = val.company
        firebase.database().ref(`company/${ckey}`)
          .once('value').then((snapshot) => {
            var val1 = snapshot.val()
            this.setState({
              uid: val.uid,
              fname: val.fname,
              lname: val.lname,
              tel: val.telNum,
              email: val.email,
              typeStat: val.typeStat,
              type: val.type,
              company: val1.name
            })
          })
      })
  }

  onTypeStat() {
    const { uid } = this.state
    // console.log(uid)
    firebase.database().ref(`users/${uid}`)
      .update({
        typeStat: true,
        setup: true,
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
    const { uid, fname, lname, tel, email, typeStat, company } = this.state
    if (typeStat) {
      return (
        <Fragment>
          <Grid>
            <TextField
              InputLabelProps={{ shrink: true }}
              label='ชื่อจริง'
              variant='outlined'
              margin='normal'
              value={fname} />
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
              label='เบอร์โทร'
              variant='outlined'
              margin='normal'
              value={tel} />
          </Grid>
          <Grid>
            <TextField
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
                pathname: '/staffEdit',
                state: { uid: uid }
              })
            }}>
            แก้ไข</Button>
        </Fragment>
      )
    } else {
      return (
        <Fragment>
          <Grid>
            <TextField
              InputLabelProps={{ shrink: true }}
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
        </Fragment >
      )
    }
  }

  render() {
    return (
      <Grid
        xs={12}
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