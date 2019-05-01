import React, { Component, Fragment } from 'react'
import firebase from '../../firebase'
import {
  Paper,
  Grid,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@material-ui/core'

export default class ReportStudentComment extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      open: false,
      sid: this.props.location.state.sid,
      fname: this.props.location.state.fname,
      lname: this.props.location.state.lname,
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
    var suid = this.props.location.state.uid
    var ccuid = [], cuid = []

    firebase.database().ref('comment')
      .orderByChild('suid')
      .equalTo(suid)
      .once('value').then((snapshot) => {
        snapshot.forEach((child) => {
          var val = child.val()
          ccuid.push(val.cuid)
        })
        this.setState({ Ccuid: ccuid })
      })

    firebase.database().ref('users')
      .orderByChild('type')
      .equalTo('Staff')
      .once('value').then((snapshot) => {
        snapshot.forEach((child) => {
          var val = child.val()
          cuid.push(val.uid)
        })
        this.setState({ cuid })
      }).then(() => {
        this.renerList(suid)
      })
  }

  renerList(suid) {
    const { Ccuid, cuid } = this.state
    var final = [], items = [], id = 0
    final = cuid.filter(val => Ccuid.includes(val))
    final.forEach((val) => {
      firebase.database().ref(`users/${val}`)
        .once('value').then((snapshot) => {
          var val1 = snapshot.val()

          firebase.database().ref('comment')
            .orderByChild('cuid')
            .equalTo(val)
            .once('value').then((snapshot) => {
              snapshot.forEach((child) => {
                var val2 = child.val()
                if (suid === val2.suid) {
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
    const { list, sid, fname, lname, email } = this.state
    console.log(list)
    return (
      <Grid
        container>
        <Grid
          container
          direction='column'
          style={{ padding: 30 }}>
          <Typography>{sid}</Typography>
          <Typography>{fname} {lname}</Typography>
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
                      <TableCell align='center'>หัวข้อที่ประเมิน</TableCell>
                      <TableCell align='center'>คะแนนเต็ม (80)</TableCell>
                      <TableCell align='center'>คะแนนที่ได้</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    <TableRow>
                      <TableCell>1. การปฏิบัติงานตามระเบียบ และข้อตกลงในการปฏิบัติ</TableCell>
                      <TableCell align='center'>8</TableCell>
                      <TableCell align='center'>{row.score1}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>2. การตรงต่อเวลา</TableCell>
                      <TableCell align='center'>8</TableCell>
                      <TableCell align='center'>{row.score2}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>3. ความรับผิดชอบในการปฏิบัติงาน</TableCell>
                      <TableCell align='center'>8</TableCell>
                      <TableCell align='center'>{row.score3}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>4. ความกระตือรือร้นในการปฏิบัติงาน</TableCell>
                      <TableCell align='center'>8</TableCell>
                      <TableCell align='center'>{row.score4}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>5. ความตั้งใจในการศึกษาหาความรู้</TableCell>
                      <TableCell align='center'>8</TableCell>
                      <TableCell align='center'>{row.score5}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>6. ความมีระเบียบในการจัดเก็บ อุปกรณ์การฝึกงาน</TableCell>
                      <TableCell align='center'>8</TableCell>
                      <TableCell align='center'>{row.score6}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>7. ความประพฤติในระหว่างฝึกงาน</TableCell>
                      <TableCell align='center'>8</TableCell>
                      <TableCell>{row.score7}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>8. ความมีมนุษย์สัมพันธ์กับบุคคลที่เกี่ยวข้อง</TableCell>
                      <TableCell align='center'>8</TableCell>
                      <TableCell align='center'>{row.score8}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>9. ความอดทนในการเรียนรู้ปฏิบัติงาน</TableCell>
                      <TableCell align='center'>8</TableCell>
                      <TableCell align='center'>{row.score9}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>10. ความสำเร็จของผลงานที่ปฏิบัติ</TableCell>
                      <TableCell align='center'>8</TableCell>
                      <TableCell align='center'>{row.score10}</TableCell>
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