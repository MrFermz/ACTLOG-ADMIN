import React, { Component } from 'react'
import firebase from './firebase'
import Menus from './Menus'
import {
  Grid,
  Typography,
  TextField,
  MenuItem,
  Button
} from '@material-ui/core'

export default class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      uid: '',
      tempYear: '',
      list: [],
      year: '',
      message: ''
    }
  }

  componentDidMount() {
    document.title = 'หน้าแรก - ACTLOG ADMIN'
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ uid: user.uid })
        this.getYear()
      } else {
        this.props.history.push('/')
      }
    })
  }

  getYear() {
    let years = []
    firebase.database().ref('users')
      .once('value').then((snapshot) => {
        snapshot.forEach((child) => {
          let val = child.val()
          let year = val.year
          years.push(`${year}`)
        })
        this.hasDuplicate(years)
      })
    firebase.database().ref('temp/year')
      .once('value').then((snapshot) => {
        var val = snapshot.val()
        this.setState({ year: val })
      })
  }

  hasDuplicate(years) {
    var items = []
    var newYear = new Set(years)
    newYear.forEach((value) => {
      items.push({ value, label: parseInt(value) + 543 })
    })
    this.setState({ list: items })
  }

  onChangeSelect = (e) => {
    const { value } = e.target
    this.setState({ year: value })
  }

  onSubmit = (e) => {
    e.preventDefault()
    const { year } = this.state
    firebase.database().ref('temp').update({
      year: year
    }).then(() => {
      if (year) {
        this.setState({ message: 'เลือกเทอมสำเร็จ', color: 'green' })
      } else {
        this.setState({ message: 'กรุณาเลือกเทอม', color: 'red' })
      }
    })
  }

  render() {
    const { list, message, color } = this.state
    return (
      <Grid
        container>
        <Menus
          history={this.props.history}
          state={{ home: true }} />
        <Grid
          xs={10}
          item
          container
          direction='column'
          style={{ padding: 30 }}>
          <Typography
            align='center'
            inline={true}
            style={{ marginTop: 5, width: '90%', fontSize: 25, alignSelf: 'center' }}>
            {`ยินดีต้อนรับสู่ "โครงงานระบบบันทึกกิจกรรมนักศึกษาฝึกงานของสาขาวิทยาศาสตร์คอมพิวเตอร์"`}
          </Typography>
          <TextField
            select
            label='เลือกปีการศึกษา'
            onChange={this.onChangeSelect}
            value={this.state.year}
            margin='normal'
            variant='filled'
            style={{ width: '50%', marginTop: 100, alignSelf: 'center' }}>
            {list.map((option, i) => (
              <MenuItem key={i} value={option.value}>{option.label}</MenuItem>
            ))}
          </TextField>
          <Button
            variant='contained'
            color='primary'
            style={{ width: '50%', alignSelf: 'center' }}
            onClick={this.onSubmit.bind(this)}>
            ตกลง</Button>
          <Typography
            style={{ padding: 10, color: color }}
            align='center'>{message}</Typography>
        </Grid>
      </Grid>
    )
  }
}