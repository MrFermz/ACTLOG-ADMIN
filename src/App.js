import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'
import {
  createMuiTheme,
  MuiThemeProvider
} from '@material-ui/core/styles'

// Main
import Login from './components/Login'
import Home from './components/Home'

// All
import UserLists from './components/users/UserLists'

// Student
import UserStdDetail from './components/users/Student/UserStdDetail'
import UserStdEdit from './components/users/Student/UserStdEdit'

// Teacher
import UserTeachDetail from './components/users/Teacher/UserTeachDetail'
import UserTeachEdit from './components/users/Teacher/UserTeachEdit'

// Staff
import UserStaffDetail from './components/users/Staff/UserStaffDetail'
import UserStaffEdit from './components/users/Staff/UserStaffEdit'

// Company
import CompanyLists from './components/company/CompanyLists'
import CompanyDetail from './components/company/CompanyDetail'
import CompanyAdd from './components/company/CompanyAdd'
import CompanyEdit from './components/company/CompanyEdit'

// Report
import ReportTeacher from './components/report/Teacher/ReportTeacher'
import ReportTeacherVisit from './components/report/Teacher/ReportTeacherVisit'
import ReportTeacherVisitDetail from './components/report/Teacher/ReportTeacherVisitDetail'

import ReportStudent from './components/report/Student/ReportStudent'
import ReportStudentAct from './components/report/Student/ReportStudentAct'
import ReportStudentActDetail from './components/report/Student/ReportStudentActDetail'
import ReportStudentVisit from './components/report/Student/ReportStudentVisit'
import ReportStudentComment from './components/report/Student/ReportStudentComment'

import ReportStaff from './components/report/Staff/ReportStaff'
import ReportStaffComment from './components/report/Staff/ReportStaffComment'

import ReportCompany from './components/report/Company/ReportCompany'
import ReportCompanyUsers from './components/report/Company/ReportCompanyUsers'

const theme = createMuiTheme({
  typography: {
    'fontFamily': 'Sarabun'
  }
})

export default class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Router>

          <Route exact path='/' component={Login} />
          <Route path='/home' component={Home} />

          <Route path='/lists' component={UserLists} />

          <Route path='/stdDetail' component={UserStdDetail} />
          <Route path='/stdEdit' component={UserStdEdit} />

          <Route path='/teachDetail' component={UserTeachDetail} />
          <Route path='/teachEdit' component={UserTeachEdit} />

          <Route path='/staffDetail' component={UserStaffDetail} />
          <Route path='/staffEdit' component={UserStaffEdit} />

          <Route path='/clists' component={CompanyLists} />
          <Route path='/cdetail' component={CompanyDetail} />
          <Route path='/cadd' component={CompanyAdd} />
          <Route path='/cedit' component={CompanyEdit} />

          <Route path='/ReportTeacher' component={ReportTeacher} />
          <Route path='/ReportStudentAct' component={ReportStudentAct} />
          <Route path='/ReportStudentActDetail' component={ReportStudentActDetail} />
          <Route path='/ReportTeacherVisit' component={ReportTeacherVisit} />
          <Route path='/ReportTeacherVisitDetail' component={ReportTeacherVisitDetail} />

          <Route path='/ReportStudent' component={ReportStudent} />
          <Route path='/ReportStudentVisit' component={ReportStudentVisit} />
          <Route path='/ReportStudentComment' component={ReportStudentComment} />

          <Route path='/ReportStaff' component={ReportStaff} />
          <Route path='/ReportStaffComment' component={ReportStaffComment} />

          <Route path='/ReportCompany' component={ReportCompany} />
          <Route path='/ReportCompanyUsers' component={ReportCompanyUsers} />

        </Router>
      </MuiThemeProvider>
    )
  }
}