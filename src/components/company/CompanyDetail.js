import React, { Component } from 'react'
import firebase from '../firebase'
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

class CompanyDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      key: ''
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
    var key = this.props.location.state.key
    this.setState({ key })

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

  render() {
    const { key, name, tel, address, address1, address2, province, zip } = this.state
    return (
      <Grid
        xs={12}
        container
        justify='center'
        alignItems='center'>
        <Paper
          style={{ marginTop: 20, width: 700, padding: 20 }}>
          <Grid>
            <TextField
              InputLabelProps={{ shrink: true }}
              fullWidth
              label='ชื่อสถานประกอบการ'
              variant='outlined'
              margin='normal'
              value={name} />
          </Grid>
          <Grid>
            <TextField
              InputLabelProps={{ shrink: true }}
              fullWidth
              label='เบอร์ติดต่อ'
              variant='outlined'
              margin='normal'
              value={tel} />
          </Grid>
          <Grid>
            <TextField
              multiline
              rows={6}
              InputLabelProps={{ shrink: true }}
              fullWidth
              label='บ้านเลขที่ / หมู่ / ถนน'
              variant='outlined'
              margin='normal'
              value={address} />
            <TextField
              InputLabelProps={{ shrink: true }}
              fullWidth
              label='แขวง / ตำบล'
              variant='outlined'
              margin='normal'
              value={address1} />
            <TextField
              InputLabelProps={{ shrink: true }}
              fullWidth
              label='เขต / อำเภอ'
              variant='outlined'
              margin='normal'
              value={address2} />
            <TextField
              InputLabelProps={{ shrink: true }}
              fullWidth
              label='จังหวัด'
              variant='outlined'
              margin='normal'
              value={province} />
            <TextField
              InputLabelProps={{ shrink: true }}
              fullWidth
              label='รหัสไปรษณีย์'
              variant='outlined'
              margin='normal'
              value={zip} />
          </Grid>
          <Grid>
            <Button
              variant='contained'
              onClick={() => this.props.history.goBack()}>
              กลับ</Button>
            <Button
              variant='contained'
              color='primary'
              onClick={() => {
                this.props.history.push({
                  pathname: '/cEdit',
                  state: { key: key }
                })
              }}>
              แก้ไข</Button>
          </Grid>
        </Paper>
      </Grid>
    )
  }
}

export default CompanyDetail