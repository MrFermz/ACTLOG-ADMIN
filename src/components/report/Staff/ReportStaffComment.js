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
  GridList,
  GridListTile
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
      cfname: this.props.location.state.fname,
      clname: this.props.location.state.lname,
      ctel: this.props.location.state.tel,
      ccompany: this.props.location.state.company,
      cemail: this.props.location.state.email,
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
                var key = child.key
                if (cuid === val2.cuid) {
                  id += 1
                  items.push({
                    id,
                    key,
                    sid: val1.sid,
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

  handleAlert() {
    this.setState({ open: !this.state.open })
  }

  Alert() {
    const { open, score1, score2, score3, score4, score5, score6, score7, score8, score9, score10, comment, photos } = this.state
    return (
      <Dialog
        open={open}
        scroll='body'
        onClose={this.handleAlert.bind(this)}>
        {this.getPhotos()}
        <DialogTitle>{`คะแนนประเมิน`}</DialogTitle>
        <DialogContent>
          <Table>
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
                <TableCell>{score1}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2. การตรงต่อเวลา</TableCell>
                <TableCell>8</TableCell>
                <TableCell>{score2}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>3. ความรับผิดชอบในการปฏิบัติงาน</TableCell>
                <TableCell>8</TableCell>
                <TableCell>{score3}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>4. ความกระตือรือร้นในการปฏิบัติงาน</TableCell>
                <TableCell>8</TableCell>
                <TableCell>{score4}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>5. ความตั้งใจในการศึกษาหาความรู้</TableCell>
                <TableCell>8</TableCell>
                <TableCell>{score5}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>6. ความมีระเบียบในการจัดเก็บ อุปกรณ์การฝึกงาน</TableCell>
                <TableCell>8</TableCell>
                <TableCell>{score6}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>7. ความประพฤติในระหว่างฝึกงาน</TableCell>
                <TableCell>8</TableCell>
                <TableCell>{score7}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>8. ความมีมนุษย์สัมพันธ์กับบุคคลที่เกี่ยวข้อง</TableCell>
                <TableCell>8</TableCell>
                <TableCell>{score8}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>9. ความอดทนในการเรียนรู้ปฏิบัติงาน</TableCell>
                <TableCell>8</TableCell>
                <TableCell>{score9}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>10. ความสำเร็จของผลงานที่ปฏิบัติ</TableCell>
                <TableCell>8</TableCell>
                <TableCell>{score10}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <DialogContentText
            style={{ marginTop: 20 }}>
            ความคิดเห็น :
          </DialogContentText>
          <Typography
            paragraph>
            {comment}</Typography>
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
    const { list, cfname, clname, ctel, ccompany, cemail } = this.state
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
            {cfname} {clname}</Typography>
          <Typography
            variant='h6'
            align='center'
            gutterBottom>
            {ctel}</Typography>
          <Typography
            variant='h6'
            align='center'
            gutterBottom>
            {ccompany}</Typography>
          <Typography
            variant='h6'
            align='center'
            gutterBottom>
            {cemail}</Typography>
          <Paper
            style={{ width: '100%' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ลำดับ</TableCell>
                  <TableCell>รหัสนักศึกษา</TableCell>
                  <TableCell>ชื่อ - สกุล</TableCell>
                  <TableCell>อีเมลล์</TableCell>
                  <TableCell>เพิ่มเติม</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {list.map((row, i) => (
                  <TableRow
                    key={i}
                    style={i % 2 === 0 ? { backgroundColor: '#EEEEEE' } : null}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.sid}</TableCell>
                    <TableCell>{row.fname}  {row.lname}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>
                      <Button
                        variant='contained'
                        onClickCapture={() => this.setState({
                          uid: row.uid,
                          score1: row.score1,
                          score2: row.score2,
                          score3: row.score3,
                          score4: row.score4,
                          score5: row.score5,
                          score6: row.score6,
                          score7: row.score7,
                          score8: row.score8,
                          score9: row.score9,
                          score10: row.score10,
                          comment: row.comment,
                          key: row.key
                        })}
                        onClick={this.handleAlert.bind(this)}>
                        <MoreHoriz /></Button>
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