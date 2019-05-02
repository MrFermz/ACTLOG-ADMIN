import React, { Component } from 'react'
import firebase from '../../firebase'
import {
  Button,
  Paper,
  Grid,
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
  DialogActions,
  Tooltip,
  GridList,
  GridListTile
} from '@material-ui/core'
import {
  MoreHoriz
} from '@material-ui/icons'

export default class ReportTeacherVisit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      open: false,
      open2: false,
      tfname: this.props.location.state.fname,
      tlname: this.props.location.state.lname,
      temail: this.props.location.state.email,
      score1: 0,
      score2: 0,
      score3: 0,
      score4: 0,
      score5: 0,
      comment: '',
      photos: [],
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
    var tuid = this.props.location.state.uid
    var vsuid = [], suid = []

    firebase.database().ref('visit')
      .orderByChild('tuid')
      .equalTo(tuid)
      .once('value').then((snapshot) => {
        snapshot.forEach((child) => {
          var val = child.val()
          vsuid.push(val.suid)
        })
        this.setState({ Vsuid: vsuid })
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
        this.renerList(tuid)
      })
  }

  renerList(tuid) {
    const { Vsuid, suid } = this.state
    var final = [], items = [], id = 0
    final = suid.filter(val => Vsuid.includes(val))
    final.forEach((val) => {
      firebase.database().ref(`users/${val}`)
        .once('value').then((snapshot) => {
          var val1 = snapshot.val()

          firebase.database().ref('visit')
            .orderByChild('suid')
            .equalTo(val)
            .once('value').then((snapshot) => {
              snapshot.forEach((child) => {
                var val2 = child.val()
                var key = child.key
                if (tuid === val2.tuid) {
                  id += 1
                  items.push({
                    id,
                    key,
                    fname: val1.fname,
                    lname: val1.lname,
                    email: val1.email,
                    sid: val1.sid,
                    uid: val1.uid,
                    score1: val2.score1,
                    score2: val2.score2,
                    score3: val2.score3,
                    score4: val2.score4,
                    score5: val2.score5,
                    comment: val2.comment
                  })

                  var score1 = val2.score1 + this.state.score1
                  var score2 = val2.score2 + this.state.score2
                  var score3 = val2.score3 + this.state.score3
                  var score4 = val2.score4 + this.state.score4
                  var score5 = val2.score5 + this.state.score5

                  if (score1) {
                    this.setState({
                      score1: score1 / id
                    })
                  } if (score2) {
                    this.setState({
                      score2: score2 / id
                    })
                  } if (score3) {
                    this.setState({
                      score3: score3 / id
                    })
                  } if (score4) {
                    this.setState({
                      score4: score4 / id
                    })
                  } if (score5) {
                    this.setState({
                      score5: score5 / id
                    })
                  }
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
    const { open, uid, sid, fname, lname, email } = this.state
    return (
      <Dialog
        open={open}
        onClose={this.handleAlert.bind(this)}>
        <DialogTitle>{`เลือกเมนูที่จะดูรายงาน`}</DialogTitle>
        <DialogContent>
          <Grid>
            <Button
              fullWidth
              onClick={() => {
                this.props.history.push({
                  pathname: '/stdDetail',
                  state: { uid: uid }
                })
              }}>ข้อมูลนักศึกษา</Button>
          </Grid>
          <Grid>
            <Button
              fullWidth
              onClick={this.handleDetail.bind(this)}>
              ข้อเสนอแนะ</Button>
          </Grid>
          <Grid>
            <Button
              fullWidth
              onClick={() => {
                this.props.history.push({
                  pathname: '/ReportStudentAct',
                  state: {
                    sid,
                    uid,
                    fname,
                    lname,
                    email
                  }
                })
              }}>ดูบันทึกกิจกรรม</Button>
          </Grid>
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

  handleDetail() {
    this.setState({ open2: !this.state.open2 })
  }

  Detail() {
    const { open2, comment, photos, fname, lname } = this.state
    return (
      <Dialog
        scroll='body'
        open={open2}
        onClose={this.handleDetail.bind(this)}>
        {this.getPhotos()}
        <DialogTitle>{`ข้อเสนอแนะ และอื่น ๆ`}</DialogTitle>
        <DialogContent>
          <DialogContentText>{fname} {lname}</DialogContentText>
          <Typography
            paragraph>{comment}</Typography>
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
            onClick={this.handleDetail.bind(this)}>
            ปิด</Button>
        </DialogActions>
      </Dialog>
    )
  }

  getPhotos() {
    const { key } = this.state
    var photo = []
    firebase.database().ref(`visit/${key}/photos`)
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
    const { list, tfname, tlname, temail } = this.state
    const { score1, score2, score3, score4, score5 } = this.state
    return (
      <Grid
        container>
        {this.Alert()}
        {this.Detail()}
        <Grid
          container
          direction='column'
          style={{ padding: 30, alignItems: 'center' }}>
          <Typography
            variant='h4'
            color='primary'
            align='center'
            gutterBottom>
            {tfname} {tlname}</Typography>
          <Typography
            variant='h6'
            align='center'
            gutterBottom>
            {temail}</Typography>
          <Paper
            style={{ width: '100%' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align='center'>ลำดับ</TableCell>
                  <TableCell>ชื่อ - สกุล</TableCell>
                  <Tooltip placement='top' title='ความรับผิดชอบต่องานที่ได้รับมอบหมาย'>
                    <TableCell align='center'>เกณฑ์ที่ 1</TableCell>
                  </Tooltip>
                  <Tooltip placement='top' title='มีความรอบคอบในการทำงาน'>
                    <TableCell align='center'>เกณฑ์ที่ 2</TableCell>
                  </Tooltip>
                  <Tooltip placement='top' title='มีมนุษย์สัมพันธ์'>
                    <TableCell align='center'>เกณฑ์ที่ 3</TableCell>
                  </Tooltip>
                  <Tooltip placement='top' title='การตรงต่อเวลา'>
                    <TableCell align='center'>เกณฑ์ที่ 4</TableCell>
                  </Tooltip>
                  <Tooltip placement='top' title='ปฏิบัติตนถูกต้องตามระเบียบข้อบังคับของสถานที่ฝึกงาน'>
                    <TableCell align='center'>เกณฑ์ที่ 5</TableCell>
                  </Tooltip>
                  <TableCell align='center'></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {list.map((row, i) => (
                  <TableRow
                    key={i}
                    style={i % 2 === 0 ? { backgroundColor: '#EEEEEE' } : null}>
                    <TableCell align='center'>{row.id}</TableCell>
                    <TableCell>{row.fname} {row.lname}</TableCell>
                    <TableCell align='center' style={!row.score1 ? { backgroundColor: 'pink' } : null}>{row.score1}</TableCell>
                    <TableCell align='center' style={!row.score2 ? { backgroundColor: 'pink' } : null}>{row.score2}</TableCell>
                    <TableCell align='center' style={!row.score3 ? { backgroundColor: 'pink' } : null}>{row.score3}</TableCell>
                    <TableCell align='center' style={!row.score4 ? { backgroundColor: 'pink' } : null}>{row.score4}</TableCell>
                    <TableCell align='center' style={!row.score5 ? { backgroundColor: 'pink' } : null}>{row.score5}</TableCell>
                    <TableCell align='center'>
                      <Button
                        variant='contained'
                        onClickCapture={() => this.setState({
                          sid: row.sid,
                          uid: row.uid,
                          fname: row.fname,
                          lname: row.lname,
                          email: row.email,
                          comment: row.comment,
                          key: row.key
                        })}
                        onClick={this.handleAlert.bind(this)}>
                        <MoreHoriz /></Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell
                    align='center'
                    colSpan={2}>เฉลี่ย</TableCell>
                  <TableCell align='center'>{score1.toFixed(2)}</TableCell>
                  <TableCell align='center'>{score2.toFixed(2)}</TableCell>
                  <TableCell align='center'>{score3.toFixed(2)}</TableCell>
                  <TableCell align='center'>{score4.toFixed(2)}</TableCell>
                  <TableCell align='center'>{score5.toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    )
  }
}