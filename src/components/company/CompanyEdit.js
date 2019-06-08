import React, { Component } from 'react'
import firebase from '../firebase'
import {
  Grid,
  Paper,
  TextField,
  MenuItem,
  Button,
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

export default class CompanyEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      openType: '',
      key: '',
      name: '',
      tel: '',
      address: '',
      address1: '',
      address2: '',
      province: '',
      zip: '',
      comType: '',
      objective: '',
      other: true
    }
  }

  componentDidMount() {
    document.title = 'แก้ไขข้อมูลสถานประกอบการ - ACTLOG ADMIN'
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.getData()
      } else {
        this.props.history.push('/')
      }
    })
  }

  getData() {
    const key = this.props.location.state.key
    firebase.database().ref(`company/${key}`)
      .once('value').then((snapshot) => {
        var val = snapshot.val()
        this.setState({
          key: key,
          name: val.name,
          tel: val.tel_number,
          address: val.address,
          address1: val.address1,
          address2: val.address2,
          province: val.province,
          zip: val.zip,
          comType: val.type_company,
          objective: val.detail_company
        })
      })
  }

  onChange = (e) => {
    const { name, value } = e.target
    this.setState({ [name]: value })
    if (value === 'other') {
      this.setState({ other: false })
    }
  }

  onSubmit = (e) => {
    e.preventDefault()
    const { key, name, tel, address, address1, address2, province, zip, comType, objective } = this.state
    firebase.database().ref(`company/${key}`).update({
      name: name,
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
  }

  onDelete() {
    const { key } = this.state
    firebase.database().ref(`company/${key}`)
      .remove().then(() => {
        firebase.database().ref('users')
          .orderByChild('company')
          .equalTo(key)
          .once('value').then((snapshot) => {
            snapshot.forEach((child) => {
              firebase.database().ref(`users/${child.key}`)
                .update({
                  company: ''
                })
            })
          })
      }).then(() => {
        this.props.history.push('/clists')
      })
  }

  handleAlert(type) {
    this.setState({ open: !this.state.open, openType: type })
  }

  Alert() {
    const { open, openType } = this.state
    if (openType === 'save') {
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
    } else if (openType === 'delete') {
      return (
        <Dialog
          open={open}
          onClose={this.handleAlert.bind(this)}>
          <DialogTitle>{`แจ้งเตือน`}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {`คุณแน่ใจหรือไม่ที่จะลบข้อมูลทั้งหมด ?`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.handleAlert.bind(this)}>
              ยกเลิก</Button>
            <Button
              color='secondary'
              onClick={this.onDelete.bind(this)}>
              ลบ</Button>
          </DialogActions>
        </Dialog>
      )
    }
  }

  render() {
    const { name, tel, address, address1, address2, province, zip, comType, objective, other } = this.state
    return (
      <Grid
        xs={12}
        item
        container
        justify='center'
        alignItems='center'>
        {this.Alert()}
        <Paper
          style={{ overflow: 'auto', marginTop: 20, width: 700, padding: 20 }}>
          <Grid>
            <TextField
              fullWidth
              label='ชื่อสถานประกอบการ'
              variant='outlined'
              margin='normal'
              name='name'
              value={name}
              onChange={(e) => { this.setState({ name: e.target.value }) }} />
          </Grid>
          <Grid>
            <TextField
              fullWidth
              select
              label='เลือกประเภทสถานประกอบการ'
              name='comType'
              onChange={this.onChange}
              value={comType}
              InputLabelProps={{ shrink: true }}
              margin='normal'
              variant='outlined'>
              {comTypeSelect.map((option, i) => (
                <MenuItem key={i} value={option.value}>{option.label}</MenuItem>
              ))}</TextField>
            <TextField
              disabled={other}
              fullWidth
              label='อื่น ๆ'
              variant='outlined'
              margin='normal'
              name='comType'
              value={comType}
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
              value={objective}
              onChange={(e) => { this.setState({ objective: e.target.value }) }} />
          </Grid>
          <Grid>
            <TextField
              fullWidth
              label='เบอร์ติดต่อ'
              variant='outlined'
              margin='normal'
              name='tel'
              value={tel}
              onChange={(e) => { this.setState({ tel: e.target.value }) }} />
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
              value={address}
              onChange={(e) => { this.setState({ address: e.target.value }) }} />
            <TextField
              fullWidth
              label='แขวง / ตำบล'
              variant='outlined'
              margin='normal'
              name='address1'
              value={address1}
              onChange={(e) => { this.setState({ address1: e.target.value }) }} />
            <TextField
              fullWidth
              label='เขต / อำเภอ'
              variant='outlined'
              margin='normal'
              name='address2'
              value={address2}
              onChange={(e) => { this.setState({ address2: e.target.value }) }} />
            <TextField
              fullWidth
              select
              label='เลือกจังหวัด'
              margin='normal'
              variant='outlined'
              name='province'
              value={province}
              onChange={this.onChange} >
              {provinces.map((option, i) => (
                <MenuItem key={i} value={option.name}>{option.name}</MenuItem>
              ))}</TextField>
            <TextField
              fullWidth
              label='รหัสไปรษณีย์'
              variant='outlined'
              margin='normal'
              name='zip'
              value={zip}
              onChange={(e) => { this.setState({ zip: e.target.value }) }} />
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
                onClick={this.handleAlert.bind(this, 'save')}>
                บันทึก</Button>
              <Button
                variant='contained'
                color='secondary'
                style={{ marginRight: 10 }}
                onClick={this.handleAlert.bind(this, 'delete')}>
                ลบทิ้ง</Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    )
  }
}