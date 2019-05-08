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
      message: ''
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
    console.log([name], value)
    this.setState({
      [name]: value
    })
  }

  onSubmit = (e) => {
    e.preventDefault()
    const { email, password } = this.state
    console.log(email, password)
    firebase.auth()
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        console.log('Login success')
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
        this.setState({ message: err.message })
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
            id='outlined-email-input'
            label='อีเมลล์'
            type='email'
            name='email'
            onChange={this.onChange}
            margin='normal'
            variant='outlined'
            autoComplete='email' />
          <TextField
            id='outlined-email-input'
            label='รหัสผ่าน'
            type='password'
            name='password'
            onChange={this.onChange}
            margin='normal'
            variant='outlined'
            autoComplete='current-password' />
          {message ? <Typography variant='subtitle1' color='secondary'>{message}</Typography> : null}
          <Button
            variant='contained'
            color='primary'
            onClick={this.onSubmit.bind(this)}>
            เข้าสู่ระบบ</Button>
        </Grid>
        <Grid
          container
          direction='column'
          justify='center'
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