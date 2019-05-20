import React, { Component } from 'react'
import firebase from '../../firebase'
import {
  Paper,
  Grid,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  GridList,
  GridListTile,
  Fab
} from '@material-ui/core'
import {
  Photo
} from '@material-ui/icons'

export default class ReportStudentComment extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      sid: this.props.location.state.sid,
      sfname: this.props.location.state.fname,
      slname: this.props.location.state.lname,
      semail: this.props.location.state.email,
      photos: []
    }
  }

  componentDidMount() {
    document.title = 'ประเมินผลการฝึกงาน - ACTLOG ADMIN'
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
                var key = child.key
                if (suid === val2.suid) {
                  id += 1
                  var sum = val2.score1 + val2.score2 + val2.score3 + val2.score4
                    + val2.score5 + val2.score6 + val2.score7 + val2.score8 +
                    val2.score9 + val2.score10
                  this.setState({
                    id,
                    key,
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
                    comment: val2.comment,
                    sum: sum.toFixed(2)
                  })
                }
              })
              this.setState({ list: items })
            })
        })
    })
  }

  handleAlert() {
    this.setState({ open: !this.state.open })
  }

  Alert() {
    const { open, photos } = this.state
    return (
      <Dialog
        open={open}
        scroll='body'
        onClose={this.handleAlert.bind(this)}>
        {this.getPhotos()}
        <DialogTitle>{`รูป`}</DialogTitle>
        <DialogContent>
          <GridList
            cellHeight={250}
            cols={3}>
            {photos.map((img, i) => (
              <GridListTile
                key={img.photo}>
                <img
                  src={img.photo}
                  alt={img.photo}></img>
              </GridListTile>
            ))}
          </GridList>
        </DialogContent>
        <DialogActions>
          <Button
            color='secondary'
            onClick={this.handleAlert.bind(this)}>
            ปิด</Button>
        </DialogActions>
      </Dialog>
    )
  }

  getPhotos() {
    const { key } = this.state
    var photo = []
    firebase.database().ref(`comment/${key}/photos`)
      .once('value').then((snapshot) => {
        snapshot.forEach((child) => {
          var val = child.val()
          photo.push({
            photo: val.photo
          })
        })
        this.setState({ photos: photo })
      })
  }

  render() {
    const { sid, fname, lname, email, comment, sfname, slname, semail,
      score1, score2, score3, score4, score5, score6, score7, score8, score9, score10, sum } = this.state
    return (
      <Grid
        container>
        {this.Alert()}
        <Grid
          container
          direction='column'
          style={{ padding: 30, alignItems: 'center' }}>
          <Typography
            variant='h4'
            color='primary'
            align='center'
            gutterBottom>
            {sid}</Typography>
          <Typography
            variant='h6'
            align='center'
            gutterBottom>
            {sfname} {slname}</Typography>
          <Typography
            variant='h6'
            align='center'
            gutterBottom>
            {semail}</Typography>
          <Paper
            style={{ width: '100%' }}>
            <Grid
              style={{ marginTop: 15, marginLeft: 15 }}>
              <Typography
                variant='h6'
                gutterBottom>
                {fname} {lname}</Typography>
              <Typography
                variant='h6'
                gutterBottom>
                {email}</Typography>
            </Grid>
            <Table>
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
                  <TableCell align='center'>{score1}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2. การตรงต่อเวลา</TableCell>
                  <TableCell align='center'>8</TableCell>
                  <TableCell align='center'>{score2}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>3. ความรับผิดชอบในการปฏิบัติงาน</TableCell>
                  <TableCell align='center'>8</TableCell>
                  <TableCell align='center'>{score3}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>4. ความกระตือรือร้นในการปฏิบัติงาน</TableCell>
                  <TableCell align='center'>8</TableCell>
                  <TableCell align='center'>{score4}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>5. ความตั้งใจในการศึกษาหาความรู้</TableCell>
                  <TableCell align='center'>8</TableCell>
                  <TableCell align='center'>{score5}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>6. ความมีระเบียบในการจัดเก็บ อุปกรณ์การฝึกงาน</TableCell>
                  <TableCell align='center'>8</TableCell>
                  <TableCell align='center'>{score6}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>7. ความประพฤติในระหว่างฝึกงาน</TableCell>
                  <TableCell align='center'>8</TableCell>
                  <TableCell align='center'>{score7}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>8. ความมีมนุษย์สัมพันธ์กับบุคคลที่เกี่ยวข้อง</TableCell>
                  <TableCell align='center'>8</TableCell>
                  <TableCell align='center'>{score8}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>9. ความอดทนในการเรียนรู้ปฏิบัติงาน</TableCell>
                  <TableCell align='center'>8</TableCell>
                  <TableCell align='center'>{score9}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>10. ความสำเร็จของผลงานที่ปฏิบัติ</TableCell>
                  <TableCell align='center'>8</TableCell>
                  <TableCell align='center'>{score10}</TableCell>
                </TableRow>
                <TableRow style={{ backgroundColor: 'lightgray' }}>
                  <TableCell>รวม</TableCell>
                  <TableCell align='center'>80</TableCell>
                  <TableCell align='center'>{sum}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Fab
              color='primary'
              onClick={this.handleAlert.bind(this)}
              style={{ marginTop: 15, marginLeft: 15 }}>
              <Photo /></Fab>
            <Typography
              paragraph
              style={{ margin: 15 }}>
              ความคิดเห็น : {comment}</Typography>
          </Paper>
        </Grid>
      </Grid>
    )
  }
}