import React, { Component } from 'react'
import firebase from '../firebase'
import {
  Grid,
  TextField,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button
} from '@material-ui/core'
import Menus from '../Menus'

class CompanyLists extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: []
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
    var items = [], id = 0
    firebase.database().ref('company')
      .once('value').then((snapshot) => {
        snapshot.forEach((child) => {
          // console.log(child.key)
          var val = child.val()
          id += 1
          items.push({
            id: id,
            key: child.key,
            name: val.name,
            tel: val.tel,
            add: val.address,
            add1: val.address1,
            add2: val.address2,
            province: val.province,
            zip: val.zip
          })
        })
        this.setState({ list: items })
      })
  }

  onChange = (e) => {
    const { value } = e.target
    console.log(value)
    this.searchData(value)
  }

  searchData(word) {
    var items = [], id = 0
    firebase.database().ref('company')
      .orderByChild('name')
      .startAt(word)
      .endAt(word + '\uf8ff')
      .once('value').then((snapshot) => {
        // console.log(snapshot.val())
        snapshot.forEach((child) => {
          console.log(child.val())
          var val = child.val()
          id += 1
          items.push({
            id: id,
            key: child.key,
            name: val.name,
            tel: val.tel,
            add: val.address,
            add1: val.address1,
            add2: val.address2,
            province: val.province,
            zip: val.zip
          })
        })
        this.setState({ list: items })
      })
  }

  render() {
    const { list } = this.state
    return (
      <Grid
        container
        direction='row'>
        <Menus
          history={this.props.history}
          state={{ clist: true }} />
        <Grid
          xs={10}
          container
          direction='column'
          // justify='flex-start'
          // alignItems='center'
          style={{ padding: 30 }}>
          <Grid
            // justify='flex-start'
            // alignItems='flex-start'
            style={{ width: '100%' }}>
            <TextField
              // style={{ alignSelf: 'flex-start' }}
              id='outlined-email-input'
              label='ค้นหาชื่อ'
              type='search'
              name='search'
              onChange={this.onChange}
              margin='normal'
              variant='outlined' />
            <Button
              style={{ marginTop: 25 }}
              variant='contained'
              color='primary'
              onClick={() => this.props.history.push('/cadd')}>
              เพิ่ม</Button>
          </Grid>

          <Paper
            style={{ width: '100%' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ลำดับ</TableCell>
                  <TableCell>ชื่อสถานประกอบการ</TableCell>
                  <TableCell>เบอร์ติดต่อ</TableCell>
                  <TableCell>ที่อยู่</TableCell>
                  <TableCell>เพิ่มเติม</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {list.map((row, i) => (
                  <TableRow
                    key={i}
                    style={i % 2 === 0 ? { backgroundColor: '#EEEEEE' } : null}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.tel}</TableCell>
                    <TableCell>{`${row.add} ${row.add1} ${row.add2} ${row.province} ${row.zip}`}</TableCell>
                    <TableCell>
                      <Button
                        variant='contained'
                        color='primary'
                        onClick={() => {
                          this.props.history.push({
                            pathname: '/cdetail',
                            state: {
                              key: row.key
                            }
                          })
                        }}>
                        เพิ่มเติม</Button>
                      {/* <Button
                        variant='contained'
                        onClick={() => {
                          this.props.history.push({
                            pathname: '/cdetail',
                            // state: { uid: row.uid }
                          })
                        }}>
                        รายชื่อ</Button> */}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    )
  }
}

export default CompanyLists