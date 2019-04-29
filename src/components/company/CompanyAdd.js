import React, { Component } from 'react'
import firebase from '../firebase'
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
import provinces from './province'

class CompanyAdd extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: '',
      name: '',
      tel: '',
      address: '',
      address1: '',
      address2: '',
      province: '',
      zip: ''
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

  onChange = (e) => {
    const { name, value } = e.target
    console.log([name], value)
    this.setState({ [name]: value })
  }

  onSubmit = (e) => {
    e.preventDefault()
    const { name, tel, address, address1, address2, province, zip } = this.state
    var date = new Date()
    var year = date.getFullYear()
    var month = date.getMonth()
    var day = date.getDay()
    var hour = date.getHours()
    var min = date.getMinutes()
    var sec = date.getSeconds()
    var id = `${year}-${month}-${day}-${hour}-${min}-${sec}`
    console.log(id)
    firebase.database().ref(`company`).push({
      name,
      tel,
      address,
      address1,
      address2,
      province,
      zip
    }).then(() => {
      this.props.history.goBack()
    })
  }

  open() {
    this.setState({ open: true })
  }

  close() {
    this.setState({ open: false })
  }

  Alert() {
    const { open } = this.state
    return (
      <Dialog
        open={open}
        onClose={this.close.bind(this)}>
        <DialogTitle>{`แจ้งเตือน`}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`คุณแน่ใจหรือไม่ที่จะบันทึกข้อมูลที่แก้ไขแล้ว ?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={this.close.bind(this)}>
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
    return (
      <Grid
        xs={12}
        container
        justify='center'
        alignItems='center'>
        {this.Alert()}
        <Paper style={{ marginTop: 20, width: 500, padding: 20 }}>
          <Grid>
            <TextField
              fullWidth
              label='ชื่อสถานประกอบการ'
              variant='outlined'
              margin='normal'
              name='name'
              onChange={this.onChange} />
          </Grid>
          <Grid>
            <TextField
              fullWidth
              label='เบอร์ติดต่อ'
              variant='outlined'
              margin='normal'
              name='tel'
              onChange={this.onChange} />
          </Grid>
          <Grid>
            <TextField
              multiline
              rows={6}
              fullWidth
              label='บ้านเลขที่ / หมู่ / ถนน'
              variant='outlined'
              margin='normal'
              name='address'
              onChange={this.onChange} />
            <TextField
              fullWidth
              label='แขวง / ตำบล'
              variant='outlined'
              margin='normal'
              name='address1'
              onChange={this.onChange} />
            <TextField
              fullWidth
              label='เขต / อำเภอ'
              variant='outlined'
              margin='normal'
              name='address2'
              onChange={this.onChange} />
            <TextField
              fullWidth
              select
              label='เลือกจังหวัด'
              name='province'
              onChange={this.onChange}
              value={this.state.province}
              margin='normal'
              variant='outlined'>
              {provinces.map((option, i) => (
                <MenuItem key={i} value={option.name}>{option.name}</MenuItem>
              ))}</TextField>
            <TextField
              fullWidth
              label='รหัสไปรษณีย์'
              variant='outlined'
              margin='normal'
              name='zip'
              onChange={this.onChange} />
          </Grid>
          <Grid>
            <Button
              variant='contained'
              onClick={() => this.props.history.goBack()}>
              ยกเลิก</Button>
            <Button
              variant='contained'
              color='primary'
              onClick={this.open.bind(this)}>
              เพิ่ม</Button>
          </Grid>
        </Paper>
      </Grid>
    )
  }
}

export default CompanyAdd