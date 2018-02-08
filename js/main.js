class Person {
  constructor(name, email) {
    this.name = name;
    this.email = email;
    //Splitting at the @ symbol to grab usernames. [0] is Shorthand way of referencing username since it is first item in the new array from splitting. Saves username from elft side of @ symbol. 
    this.username = email.split("@")[0];
  }
}

// Students class extends from Person class
class Student extends Person {
  constructor(name, email) {
    // super to run rpevious constructor
    super(name, email);
    this.attendance = [];
  }
  // Method created to calculate attendance of student. Recorded into above array.
  calculateAttendance() {
    if (this.attendance.length > 0) {
      // Initialize counter to 0. for conditional, takes every item in this.attendance array. mark has whatever value is for that item. 
      let counter = 0;
      for (let mark of this.attendance) {
        counter = counter + mark;
      }
      //Used to calculate average and multiply by 100 for a percentage value.
      let attendancePercentage = counter / this.attendance.length * 100;
      return `${attendancePercentage}%`;
    } else {
      return "0%";
    }
  }
}

// Created Teacher class with extention of Perosn class. this.honorific property added 
class Teacher extends Person {
  constructor(name, email, honorific) {
    super(name, email);
    this.honorific = honorific;
  }
}


class Course {
  constructor(courseCode, courseTitle, courseDescription) {
    this.code = courseCode;
    this.title = courseTitle;
    this.description = courseDescription;
    this.teacher = null;
    this.students = [];
  }

// Method created to prompt user for information and adds to student array above. 
 addStudent() {
   let name = prompt("Student's Full Name");
   let email = prompt("Student Email");
   let newStudent = new Student (name, email);
   this.students.push(newStudent);
   updateRoster(this);
 }

// Method created to promopt teacher information 
 setTeacher() {
   let name = prompt("Teacher name");
   let email = prompt("Teacher email");
   let honorific = prompt("Honorific (Dr, Prof, Mr. Ms.)");
   this.teacher = new Teacher(name, email, honorific);
   updateRoster(this);
 }

  // Method created to updat attendance based on whether present or absent is clicked.
  markAttendance(username, status = "present") {
    let student = this.findStudent(username);
    if (status === "present") {
      student.attendance.push(1);
    } else {
      student.attendance.push(0);
    }
      updateRoster(this);
  }
  


  //////////////////////////////////////////////
  // Methods provided for you -- DO NOT EDIT /////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////

  findStudent(username) {
    // This method provided for convenience. It takes in a username and looks
    // for that username on student objects contained in the `this.students`
    // Array.
    let foundStudent = this.students.find(function(student, index) {
      return student.username == username;
    });
    return foundStudent;
  }
}

/////////////////////////////////////////
// Prompt User for Course Info  //////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// Prompt for the user to enter the course code 
let courseCode = prompt("Enter the course code (e.g. WATS 3020", "Type here");

// Prompt user to enter the course titie.
let courseTitle = prompt("Enter the course title (e.g. Introduction to Javascript", "Type here");

// Prompt the user to enter the course description
let courseDescription = prompt("Enter course description", "Type here");

// Created new instacne of Course class with three data points provided by user from above prompts
let myCourse = new Course(courseCode, courseTitle, courseDescription);

///////////////////////////////////////////////////
//////// Main Script /////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// This script runs the page. You should only edit it if you are attempting a //
// stretch goal. Otherwise, this script calls the functions that you have     //
// created above.                                                             //
////////////////////////////////////////////////////////////////////////////////

let rosterTitle = document.querySelector('#course-title');
rosterTitle.innerHTML = `${myCourse.code}: ${myCourse.title}`;

let rosterDescription = document.querySelector('#course-description');
rosterDescription.innerHTML = myCourse.description;

if (myCourse.teacher) {
  let rosterTeacher = document.querySelector('#course-teacher');
  rosterTeacher.innerHTML = `${myCourse.teacher.honorific} ${myCourse.teacher.name}`;
} else {
  let rosterTeacher = document.querySelector('#course-teacher');
  rosterTeacher.innerHTML = "Not Set";
}

let rosterTbody = document.querySelector('#roster tbody');
// Clear Roster Content
rosterTbody.innerHTML = '';

// Create event listener for adding a student.
let addStudentButton = document.querySelector('#add-student');
addStudentButton.addEventListener('click', function(e) {
  console.log('Calling addStudent() method.');
  myCourse.addStudent();
})

// Create event listener for adding a teacher.
let addTeacherButton = document.querySelector('#add-teacher');
addTeacherButton.addEventListener('click', function(e) {
  console.log('Calling setTeacher() method.');
  myCourse.setTeacher();
})

// Call Update Roster to initialize the content of the page.
updateRoster(myCourse);

function updateRoster(course) {
  let rosterTbody = document.querySelector('#roster tbody');
  // Clear Roster Content
  rosterTbody.innerHTML = '';
  if (course.teacher) {
    let rosterTeacher = document.querySelector('#course-teacher');
    rosterTeacher.innerHTML = `${course.teacher.honorific} ${course.teacher.name}`;
  } else {
    let rosterTeacher = document.querySelector('#course-teacher');
    rosterTeacher.innerHTML = "Not Set";
  }
  // Populate Roster Content
  for (student of course.students) {
    // Create a new row for the table.
    let newTR = document.createElement('tr');

    // Create table cells for each data point and append them to the new row.
    let nameTD = document.createElement('td');
    nameTD.innerHTML = student.name;
    newTR.appendChild(nameTD);

    let emailTD = document.createElement('td');
    emailTD.innerHTML = student.email;
    newTR.appendChild(emailTD);

    let attendanceTD = document.createElement('td');
    attendanceTD.innerHTML = student.calculateAttendance();
    newTR.appendChild(attendanceTD);

    let actionsTD = document.createElement('td');
    let presentButton = document.createElement('button');
    presentButton.innerHTML = "Present";
    presentButton.setAttribute('data-username', student.username);
    presentButton.setAttribute('class', 'present');
    actionsTD.appendChild(presentButton);

    let absentButton = document.createElement('button');
    absentButton.innerHTML = "Absent";
    absentButton.setAttribute('data-username', student.username);
    absentButton.setAttribute('class', 'absent');
    actionsTD.appendChild(absentButton);

    newTR.appendChild(actionsTD);

    // Append the new row to the roster table.
    rosterTbody.appendChild(newTR);
  }
  // Call function to set event listeners on attendance buttons.
  setupAttendanceButtons();
}

function setupAttendanceButtons() {
  // Set up the event listeners for buttons to mark attendance.
  let presentButtons = document.querySelectorAll('.present');
  for (button of presentButtons) {
    button.addEventListener('click', function(e) {
      console.log(`Marking ${e.target.dataset.username} present.`);
      myCourse.markAttendance(e.target.dataset.username);
      updateRoster(myCourse);
    });
  }
  let absentButtons = document.querySelectorAll('.absent');
  for (button of absentButtons) {
    button.addEventListener('click', function(e) {
      console.log(`Marking ${e.target.dataset.username} absent.`);
      myCourse.markAttendance(e.target.dataset.username, 'absent');
      updateRoster(myCourse);
    });
  }
}