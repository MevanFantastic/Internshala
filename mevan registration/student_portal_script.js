let students = [];
let editIndex = -1;

function loadStudents() {
    const stored = localStorage.getItem('students');
    console.log("Stored data:", stored);
    if (stored) students = JSON.parse(stored);
}

function displayStudents() {
}
document.addEventListener('DOMContentLoaded', () => {
    loadStudents();
    displayStudents();
});

document.getElementById('student-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('student-name').value.trim();
    const studentId = document.getElementById('student-id').value.trim();
    const email = document.getElementById('email').value.trim();
    const contactNo = document.getElementById('contact-no').value.trim();
    const studentClass = document.getElementById('student-class').value.trim();
    const studentAddress = document.getElementById('student-address').value.trim();

    if (!name || !studentId || !email || !contactNo || !studentClass || !studentAddress) {
        alert('Please fill in all fields.');
        return;
    }
    if (!/^[A-Za-z\s]+$/.test(name)) {
        alert('Name can contain only letters and spaces.');
        return;
    }
    if (!/^\d+$/.test(studentId) || !/^\d+$/.test(contactNo)) {
        alert('Student ID and Contact No. must be numeric.');
        return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    const student = { name, studentId, email, contactNo, studentClass, studentAddress };

    if (editIndex > -1) {
        students[editIndex] = student;
        editIndex = -1;
        document.getElementById('submit-button').textContent = 'Add Student';
    } else {
        students.push(student);
    }

    localStorage.setItem('students', JSON.stringify(students));
    displayStudents();
    document.getElementById('student-form').reset();
});

function displayStudents() {
    const body = document.getElementById('student-table-body');
    body.innerHTML = '';
    students.forEach((student, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.studentId}</td>
            <td>${student.email}</td>
            <td>${student.contactNo}</td>
            <td>${student.studentClass}</td>
            <td>${student.studentAddress}</td>
            <td></td> 
        `;

        const actionCell = row.querySelector('td:last-child');

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.classList.add('action-button', 'edit-btn');
        editBtn.addEventListener('click', () => editStudent(index));

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('action-button', 'delete-btn');
        deleteBtn.addEventListener('click', () => deleteStudent(index));

        actionCell.appendChild(editBtn);
        actionCell.appendChild(deleteBtn);

        body.appendChild(row);
    });
}
function editStudent(index) {
    const student = students[index];
    document.getElementById('student-name').value = student.name;
    document.getElementById('student-id').value = student.studentId;
    document.getElementById('email').value = student.email;
    document.getElementById('contact-no').value = student.contactNo;
    document.getElementById('student-class').value = student.studentClass;
    document.getElementById('student-address').value = student.studentAddress;
    document.getElementById('submit-button').textContent = 'Update Student';
    editIndex = index;
}

function deleteStudent(index) {
    if (confirm('Are you sure you want to delete this record?')) {
        students.splice(index, 1);
        localStorage.setItem('students', JSON.stringify(students));
        displayStudents();
    }
}
