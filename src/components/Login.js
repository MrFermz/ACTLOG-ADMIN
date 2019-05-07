import React, { Component } from 'react'
import firebase from './firebase'
import {
  TextField,
  Button,
  Grid,
  Typography,
  CardMedia
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
    document.title = 'LOGIN - ACTLOG ADMIN'
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
    return (
      <Grid
        style={{ minHeight: '100vh' }}
        container
        direction='column'
        justify='center'
        alignItems='center'>
        <CardMedia
          src={`${window.location.origin}../../assets/logo.png`}
        />
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
        {message ? <Typography variant='subtitle1'>{message}</Typography> : null}
        <Button
          variant='contained'
          color='primary'
          onClick={this.onSubmit.bind(this)}>
          เข้าสู่ระบบ</Button>
      </Grid>
    )
  }
}