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

class CompanyEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: '',
      openType: '',
      key: '',
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
          tel: val.tel,
          address: val.address,
          address1: val.address1,
          address2: val.address2,
          province: val.province,
          zip: val.zip
        })
      })
  }

  onChange = (e) => {
    const { value } = e.target
    console.log(value)
    this.setState({ province: value })
  }

  onSubmit = (e) => {
    e.preventDefault()
    const { key, name, tel, address, address1, address2, province, zip } = this.state
    firebase.database().ref(`company/${key}`).update({
      name: name,
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

  onDelete() {
    const { key } = this.state
    console.log(key)
    firebase.database().ref(`company/${key}`)
      .remove().then(() => {
        firebase.database().ref('users')
          .orderByChild('company')
          .equalTo(key)
          .once('value').then((snapshot) => {
            // console.log(snapshot.val())
            snapshot.forEach((child) => {
              // console.log(child.key)
              firebase.database().ref(`users/${child.key}`)
                .update({
                  company: ''
                })
            })
          })
      }).then(() => {
        this.props.history.goBack()
      })
  }

  open(type) {
    this.setState({ open: true, openType: type })
  }

  close() {
    this.setState({ open: false })
  }

  Alert() {
    const { open, openType } = this.state
    console.log(openType)
    if (openType === 'save') {
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
    } else if (openType === 'delete') {
      return (
        <Dialog
          open={open}
          onClose={this.close.bind(this)}>
          <DialogTitle>{`แจ้งเตือน`}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {`คุณแน่ใจหรือไม่ที่จะลบข้อมูลทั้งหมด ?`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.close.bind(this)}>
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
    const { name, tel, address, address1, address2, province, zip } = this.state
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
          <Grid>
            <Button
              variant='contained'
              onClick={() => this.props.history.goBack()}>
              ยกเลิก</Button>
            <Button
              variant='contained'
              onClick={() => this.props.history.push('/lists')}>
              หน้าแรก</Button>
            <Button
              variant='contained'
              color='primary'
              onClick={this.open.bind(this, 'save')}>
              บันทึก</Button>
            <Button
              variant='contained'
              color='secondary'
              onClick={this.open.bind(this, 'delete')}>
              ลบทิ้ง</Button>
          </Grid>
        </Paper>
      </Grid>
    )
  }
}

export default CompanyEdit