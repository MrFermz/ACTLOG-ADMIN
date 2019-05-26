import React, { Component } from 'react'
import firebase from './firebase'
import {
  TextField,
  Button,
  Grid,
  Typography
} from '@material-ui/core'

export default class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      message: '',
      secret: 0
    }
  }

  componentDidMount() {
    document.title = 'เข้าสู่ระบบ - ACTLOG ADMIN'
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        firebase.database().ref(`users/${user.uid}/type`)
          .once('value').then((snapshot) => {
            var val = snapshot.val()
            if (val === 'Admin') {
              this.props.history.push('/home')
            } else {
              this.props.history.push('/')
              this.setState({ message: 'ต้องเป็นแอดมินเท่านั้น !' })
            }
          })
      } else {
        this.props.history.push('/')
      }
    })
  }

  onChange = (e) => {
    const { name, value } = e.target
    this.setState({
      [name]: value
    })
  }

  onSubmit = (e) => {
    e.preventDefault()
    const { email, password } = this.state
    firebase.auth()
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        firebase.database().ref(`users/${res.user.uid}/type`)
          .once('value').then((snapshot) => {
            var val = snapshot.val()
            if (val === 'Admin') {
              this.props.history.push('/home')
            } else {
              this.props.history.push('/')
              this.setState({ message: 'ต้องเป็นแอดมินเท่านั้น !' })
            }
          })
      }).catch((err) => {
        if (this.state.secret === 100) {
          this.setState({ message: 'By Mr.Fermz' })
        } else {
          this.setState({ message: err.message })
        }
      })
  }

  secretCount() {
    this.setState({
      secret: this.state.secret + 1
    })
  }

  render() {
    const { message } = this.state
    const logo = require('../assets/logo.png')
    return (
      <Grid
        style={{ minHeight: '100vh' }}
        container
        direction='column'
        justify='space-between'
        alignItems='center'>
        <Grid
          container
          direction='column'
          justify='center'
          alignItems='center'>
          <img
            src={logo}
            width='10%'
            alt='logo' />
          <TextField
            label='อีเมล'
            type='email'
            name='email'
            onChange={this.onChange}
            style={{ width: '30%' }}
            margin='normal'
            variant='outlined' />
          <TextField
            label='รหัสผ่าน'
            type='password'
            name='password'
            onChange={this.onChange}
            style={{ width: '30%' }}
            margin='normal'
            variant='outlined' />
          {message ? <Typography variant='subtitle1' color='secondary'>{message}</Typography> : null}
          <Button
            variant='contained'
            color='primary'
            onClickCapture={this.secretCount.bind(this)}
            onClick={this.onSubmit.bind(this)}>
            เข้าสู่ระบบ</Button>
        </Grid>
        <Grid
          container
          direction='column'
          justify='center'
          alignItems='center'
          style={{ marginBottom: 10 }}>
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