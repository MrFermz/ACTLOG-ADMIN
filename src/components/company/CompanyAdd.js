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

const comTypeSelect = [
  {
    value: 'government',
    label: 'องค์กรรัฐบาล'
  },
  {
    value: 'enterprise',
    label: 'รัฐวิสาหกิจ'
  },
  {
    value: 'private',
    label: 'องค์กรเอกชน'
  },
  {
    value: 'company',
    label: 'บริษัท'
  },
  {
    value: 'other',
    label: 'อื่น ๆ'
  },
]

export default class CompanyAdd extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      name: null,
      tel: '',
      address: '',
      address1: '',
      address2: '',
      province: '',
      zip: '',
      comType: '',
      objective: '',
      other: true,
      isNull: false
    }
  }

  componentDidMount() {
    document.title = 'เพิ่มสถานประกอบการ - ACTLOG ADMIN'
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
    this.setState({ [name]: value })
    console.log([name], value)
    if (value === 'other') {
      this.setState({ other: false })
    }
  }

  onSubmit = (e) => {
    e.preventDefault()
    const { name, tel, address, address1, address2, province, zip, comType, objective } = this.state
    if (name) {
      firebase.database().ref(`company`).push({
        name,
        tel_number: tel,
        address,
        address1,
        address2,
        province,
        zip,
        type_company: comType,
        detail_company: objective
      }).then(() => {
        this.props.history.goBack()
      })
    } else {
      this.setState({ isNull: true })
    }
  }

  handleAlert() {
    this.setState({ open: !this.state.open })
  }

  Alert() {
    const { open, isNull } = this.state
    if (isNull) {
      return (
        <Dialog
          open={open}
          onClose={this.handleAlert.bind(this)}>
          <DialogTitle>{`แจ้งเตือน`}</DialogTitle>
          <DialogContent>
            <DialogContentText style={{ color: 'red' }}>
              {`ต้องเพิ่มข้อมูลอย่างน้อยดังนี้ [ชื่อสถานประกอบการ]`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              color='primary'
              onClick={() => this.setState({ isNull: false, open: false })}>
              ตกลง</Button>
          </DialogActions>
        </Dialog>
      )
    } else {
      return (
        <Dialog
          open={open}
          onClose={this.handleAlert.bind(this)}>
          <DialogTitle>{`แจ้งเตือน`}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {`คุณแน่ใจหรือไม่ที่จะเพิ่มข้อมูล ?`}
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
  }

  render() {
    const { other, comType } = this.state
    return (
      <Grid
        container
        justify='center'
        alignItems='center'>
        {this.Alert()}
        <Paper
          style={{ overflow: 'auto', marginTop: 20, width: 500, padding: 20 }}>
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
              select
              label='เลือกประเภทสถานประกอบการ'
              name='comType'
              onChange={this.onChange}
              InputLabelProps={{ shrink: true }}
              margin='normal'
              value={comType}
              variant='outlined'>
              {comTypeSelect.map((option, i) => (
                <MenuItem key={i} value={option.value}>{option.label}</MenuItem>
              ))}</TextField>
            <TextField
              disabled={other}
              value={comType}
              fullWidth
              label='อื่น ๆ'
              variant='outlined'
              margin='normal'
              name='comType'
              onChange={this.onChange} />
          </Grid>
          <Grid>
            <TextField
              multiline
              rows={6}
              fullWidth
              label='ภารกิจหลัก'
              variant='outlined'
              margin='normal'
              name='objective'
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
          <Grid
            container
            direction='column'
            alignItems='center'>
            <Grid
              style={{ marginTop: 15 }}>
              <Button
                variant='contained'
                style={{ marginRight: 10 }}
                onClick={() => this.props.history.goBack()}>
                ยกเลิก</Button>
              <Button
                variant='contained'
                color='primary'
                style={{ marginRight: 10 }}
                onClick={this.handleAlert.bind(this)}>
                เพิ่ม</Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    )
  }
}