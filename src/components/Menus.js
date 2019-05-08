import React, { Component } from 'react'
import firebase from './firebase'
import {
  Grid,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@material-ui/core'

export default class Menus extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false
    }
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        //
      } else {
        this.props.history.push('/')
      }
    })
  }

  Logout = (e) => {
    e.preventDefault()
    firebase.auth().signOut().then(() => {
      this.props.history.push('/')
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
            {`คุณแน่ใจหรือไม่ที่จะออกจากระบบ ?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={this.handleAlert.bind(this)}>
            ยกเลิก</Button>
          <Button
            color='secondary'
            onClick={this.Logout.bind(this)}>
            ออกจากระบบ</Button>
        </DialogActions>
      </Dialog>
    )
  }

  render() {
    var list = this.props.state.list
    var home = this.props.state.home
    var clist = this.props.state.clist
    var rStd = this.props.state.rStd
    var rTea = this.props.state.rTea
    var rStaff = this.props.state.rStaff
    var rCom = this.props.state.rCom
    return (
      <Grid
        xs={2}
        container
        direction='column'
        justify='space-between'
        alignItems='center'>
        {this.Alert()}
        <Grid
          container
          direction='column'
          justify='flex-start'
          alignItems='center'>
          <Typography
            align='center'
            style={{ marginTop: 30, width: '90%', fontSize: 18 }}>
            เมนูหลัก</Typography>
          <Button
            disabled={home}
            fullWidth
            style={{ marginTop: 10, width: '90%' }}
            variant='contained'
            onClick={() => { this.props.history.push('/home') }} >
            หน้าแรก</Button >
          <Button
            disabled={list}
            fullWidth
            style={{ marginTop: 10, width: '90%' }}
            variant='contained'
            onClick={() => { this.props.history.push('/lists') }} >
            จัดการชื่อผู้ใช้</Button >
          <Button
            disabled={clist}
            fullWidth
            style={{ marginTop: 10, width: '90%' }}
            variant='contained'
            onClick={() => { this.props.history.push('/clists') }} >
            จัดการสถานประกอบการ</Button >

          <Typography
            align='center'
            style={{ marginTop: 30, width: '90%', fontSize: 18 }}>
            รายงาน</Typography>
          <Button
            disabled={rTea}
            fullWidth
            onClick={() => { this.props.history.push('/ReportTeacher') }}
            style={{ marginTop: 10, width: '90%' }}
            variant='contained'>
            อาจารย์</Button>
          <Button
            disabled={rStd}
            fullWidth
            onClick={() => { this.props.history.push('/ReportStudent') }}
            style={{ marginTop: 10, width: '90%' }}
            variant='contained'>
            นักศึกษา</Button>
          <Button
            disabled={rStaff}
            fullWidth
            onClick={() => { this.props.history.push('/ReportStaff') }}
            style={{ marginTop: 10, width: '90%' }}
            variant='contained'>
            ผู้ดูแล</Button>
          <Button
            disabled={rCom}
            fullWidth
            onClick={() => { this.props.history.push('/ReportCompany') }}
            style={{ marginTop: 10, width: '90%' }}
            variant='contained'>
            สถานประกอบการ</Button>

          <Typography
            align='center'
            style={{ marginTop: 30, width: '90%', fontSize: 18 }}>
            อื่น ๆ</Typography>
          <Button
            fullWidth
            style={{ marginTop: 10, width: '90%' }}
            variant='contained'
            color='secondary'
            onClick={this.handleAlert.bind(this)}>
            ออกจากระบบ</Button>
        </Grid>
        <Grid
          container
          direction='column'
          justify='flex-start'
          alignItems='center'>
          <Typography
            align='center'
            inline
            style={{ marginTop: 100, width: '90%', fontSize: 15 }}>
            Copyright © 2019 RUTS.</Typography>
          <Typography
            align='center'
            inline
            style={{ marginTop: 5, width: '90%', fontSize: 15 }}>
            All rights reserved.</Typography>
        </Grid>
      </Grid>
    )
  }
}