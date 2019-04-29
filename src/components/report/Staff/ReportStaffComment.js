import React, { Component, Fragment } from 'react'
import firebase from '../../firebase'
import {
  Button,
  Paper,
  Grid,
  TextField,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@material-ui/core'
import {
  MoreHoriz
} from '@material-ui/icons'

export default class ReportStaffComment extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      open: false,
      fname: this.props.location.state.fname,
      lname: this.props.location.state.lname,
      tel: this.props.location.state.tel,
      company: this.props.location.state.company,
      email: this.props.location.state.email
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
    var cuid = this.props.location.state.uid
    var csuid = [], suid = []

    firebase.database().ref('comment')
      .orderByChild('cuid')
      .equalTo(cuid)
      .once('value').then((snapshot) => {
        snapshot.forEach((child) => {
          var val = child.val()
          csuid.push(val.suid)
        })
        this.setState({ Csuid: csuid })
      })

    firebase.database().ref('users')
      .orderByChild('type')
      .equalTo('Student')
      .once('value').then((snapshot) => {
        snapshot.forEach((child) => {
          var val = child.val()
          suid.push(val.uid)
        })
        this.setState({ suid })
      }).then(() => {
        this.renerList(cuid)
      })
  }

  renerList(cuid) {
    const { Csuid, suid } = this.state
    var final = [], items = [], id = 0
    final = suid.filter(val => Csuid.includes(val))
    final.forEach((val) => {
      firebase.database().ref(`users/${val}`)
        .once('value').then((snapshot) => {
          var val1 = snapshot.val()

          firebase.database().ref('comment')
            .orderByChild('suid')
            .equalTo(val)
            .once('value').then((snapshot) => {
              snapshot.forEach((child) => {
                var val2 = child.val()
                if (cuid === val2.cuid) {
                  id += 1
                  items.push({
                    id,
                    fname: val1.fname,
                    lname: val1.lname,
                    email: val1.email,
                    uid: val1.uid,
                    score1: val2.score1,
                    score2: val2.score2,
                    score3: val2.score3,
                    score4: val2.score4,
                    score5: val2.score5,
                    score6: val2.score6,
                    score7: val2.score7,
                    score8: val2.score8,
                    score9: val2.score9,
                    score10: val2.score10,
                    comment: val2.comment
                  })
                }
              })
              this.setState({ list: items })
            })
        })
    })
  }

  render() {
    const { list, fname, lname, tel, company, email } = this.state
    return (
      <Grid
        container>
        <Grid
          container
          direction='column'
          style={{ padding: 30 }}>
          <Typography>{fname} {lname}</Typography>
          <Typography>{tel}</Typography>
          <Typography>{company}</Typography>
          <Typography>{email}</Typography>
          <Paper
            style={{ width: '100%' }}>
            {list.map((row, i) => (
              <Fragment>
                <Typography>{row.fname} {row.lname}</Typography>
                <Typography>{row.email}</Typography>
                <Table key={i}>
                  <TableHead>
                    <TableRow>
                      <TableCell>หัวข้อที่ประเมิน</TableCell>
                      <TableCell>คะแนนเต็ม (80)</TableCell>
                      <TableCell>คะแนนที่ได้</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    <TableRow>
                      <TableCell>1. การปฏิบัติงานตามระเบียบ และข้อตกลงในการปฏิบัติ</TableCell>
                      <TableCell>8</TableCell>
                      <TableCell>{row.score1}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>2. การตรงต่อเวลา</TableCell>
                      <TableCell>8</TableCell>
                      <TableCell>{row.score2}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>3. ความรับผิดชอบในการปฏิบัติงาน</TableCell>
                      <TableCell>8</TableCell>
                      <TableCell>{row.score3}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>4. ความกระตือรือร้นในการปฏิบัติงาน</TableCell>
                      <TableCell>8</TableCell>
                      <TableCell>{row.score4}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>5. ความตั้งใจในการศึกษาหาความรู้</TableCell>
                      <TableCell>8</TableCell>
                      <TableCell>{row.score5}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>6. ความมีระเบียบในการจัดเก็บ อุปกรณ์การฝึกงาน</TableCell>
                      <TableCell>8</TableCell>
                      <TableCell>{row.score6}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>7. ความประพฤติในระหว่างฝึกงาน</TableCell>
                      <TableCell>8</TableCell>
                      <TableCell>{row.score7}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>8. ความมีมนุษย์สัมพันธ์กับบุคคลที่เกี่ยวข้อง</TableCell>
                      <TableCell>8</TableCell>
                      <TableCell>{row.score8}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>9. ความอดทนในการเรียนรู้ปฏิบัติงาน</TableCell>
                      <TableCell>8</TableCell>
                      <TableCell>{row.score9}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>10. ความสำเร็จของผลงานที่ปฏิบัติ</TableCell>
                      <TableCell>8</TableCell>
                      <TableCell>{row.score10}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Fragment>
            ))}
          </Paper>
        </Grid>
      </Grid>
    )
  }
}