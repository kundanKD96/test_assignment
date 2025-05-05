// Sample data for demonstration purposes
var assignments = [
    {
        class: 'Science 101',
        status: 'Active',
        title: 'Ecosystem Research Project',
        dueDate: 'April 28, 2025 at 11:59 PM',
        studentsAssigned: 28,
        submissionStatus: '18/28 submitted',
        submissionProgress: 64,
        classAlice: 'science101'
    },
    {
        class: 'Biology 202',
        status: 'Active',
        title: 'Cell Structure Lab Report',
        dueDate: 'April 30, 2025 at 11:59 PM',
        studentsAssigned: 24,
        submissionStatus: '12/24 submitted',
        submissionProgress: 50,
        classAlice: 'biology202'
    },
    {
        class: 'Chemistry 101',
        status: 'Active',
        title: 'Periodic Table Quiz',
        dueDate: 'April 27, 2025 at 5:00 PM',
        studentsAssigned: 22,
        submissionStatus: '20/22 submitted',
        classAlice: 'chemistry101'
    },
];


var studentsNeedingAttention = []

const issueColors = {
    red: "bg-red-100 text-red-800",
    yellow: "bg-yellow-100 text-yellow-800",
    orange: "bg-orange-100 text-orange-800"
};

let analyticsData = {};

// Function to generate HTML for an assignment card
function generateAssignmentCard(assignment) {
    return `
<div class="bg-white rounded-lg shadow-sm overflow-hidden assignment-card" data-class="${assignment.class}" data-dueDate="${assignment.dueDate}">
  <div class="p-5">
    <div class="flex items-start justify-between">
      <div>
        <div class="flex items-center">
          <span class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">${assignment.class}</span>
          <span class="ml-2 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">${assignment.status}</span>
        </div>
        <h3 class="mt-2 text-lg font-semibold text-gray-900">${assignment.title}</h3>
      </div>
    </div>
    <div class="mt-4 text-sm text-gray-500">
      <div class="flex items-center">
        <i class="ri-calendar-line mr-1"></i>
        Due: ${assignment.dueDate}
      </div>
      <div class="mt-1 flex items-center">
        <i class="ri-user-line mr-1"></i>
        ${assignment.studentsAssigned} students assigned
      </div>
    </div>
    <div class="mt-4">
      <div class="flex justify-between text-xs text-gray-700">
        <span>Submission Status</span>
        <span>${assignment.submissionStatus}</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
        <div class="bg-indigo-600 h-2 rounded-full" style="width: ${assignment.submissionProgress}%"></div>
      </div>
    </div>
  </div>
</div>
`;
}

// Function to render the assignment cards
function renderAssignments(filter = {}) {
    let params = ''
    if (filter?.class) params = `?class=${filter?.class}`
    if (!filter?.class && filter?.sort) params = `?sort=${filter?.sort}`
    if (filter?.class && filter?.sort) params += `&sort=${filter?.sort}`
    if (filter?.assignment_type) params += `&assignment_type=${filter?.assignment_type}`
    var requestOptions = {
        method: 'GET'
    };
    console.log("Prepared URL::==>>", `http://localhost:3000/api/dashboard${params}`)
    fetch(`http://localhost:3000/api/dashboard${params}`, requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                // let dataItems = assignments
                let dataItems = result?.data?.cardData
                analyticsData = result?.data?.analyticsData;
                studentsNeedingAttention = result?.data?.listStudents
                console.log("Response data:::==>>>", result)
                updateAnalyticsData();
                updateStudentData(studentsNeedingAttention);
                const assignmentCardsContainer = document.getElementById('assignment-cards-container');
                assignmentCardsContainer.innerHTML = ''
                dataItems.forEach((assignment) => {
                    const cardHTML = generateAssignmentCard(assignment);
                    assignmentCardsContainer.insertAdjacentHTML('beforeend', cardHTML);
                });
            }
        })
        .catch(error => console.log('error', error));
}

function updateStudentData(studentsNeedingAttention) {
    const tbody = document.getElementById('attention-students-body');
    if (tbody == null) return
    studentsNeedingAttention.forEach(student => {
        student.issueType = "red"
        student.detail = "3 missing assignments"
        student.actions = ["Message", "Remind"]
        student.subDetail = "Last submission: 7 days ago"
        const row = document.createElement('tr');

        row.innerHTML = `
    <td class="px-6 py-4">${student.name}<br><span class="text-sm text-gray-500">${student.course}</span></td>
    <td class="px-6 py-4">
        <span class="text-xs ${issueColors[student.issueType]} px-2 py-1 rounded-full">${student.issue}</span>
    </td>
    <td class="px-6 py-4">${student.detail}<br><span class="text-xs text-gray-500">${student.subDetail}</span></td>
    <td class="px-6 py-4 space-x-2">
        ${student.actions.map(action => {
            const colorClass = action === "Message" ? "text-indigo-600 font-medium" : "text-gray-500";
            return `<button class="text-sm ${colorClass}">${action}</button>`;
        }).join('')}
    </td>
`;

        tbody.appendChild(row);
    });
}

function updateAnalyticsData() {
    if (analyticsData) {
        const totalAssignmentsElement = document.getElementById('total-assignments');
        const avgCompletionRateElement = document.getElementById('avg-completion-rate');
        const avgGradeElement = document.getElementById('avg-grade');

        totalAssignmentsElement.textContent = analyticsData.total_assignments;
        avgCompletionRateElement.textContent = analyticsData.avg_completion_rate;
        avgGradeElement.textContent = analyticsData.avg_grade;
    }
}

function getValues(assignment_type) {
    const classValue = document.getElementById('classFilter').value;
    const sortValue = document.getElementById('sortFilter').value;
    let obj = {}
    if (classValue) obj.class = classValue
    if (sortValue) obj.sort = sortValue
    if (assignment_type) obj.assignment_type = assignment_type
    renderAssignments(obj)
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('classFilter').addEventListener('change', getValues);
    document.getElementById('sortFilter').addEventListener('change', getValues);

    // Add event listeners for the assignment type tabs
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function (e) {
            e.preventDefault();
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('tab-active', 'text-indigo-600', 'border-indigo-600'));
            // Add active class to the clicked tab
            this.classList.add('tab-active', 'text-indigo-600', 'border-indigo-600');
            // Get the assignment type from the data attribute
            const assignmentType = this.getAttribute('data-class');
            // Call getValues with the assignment type
            getValues(assignmentType);
        });
    });


    // Modal functionality
    const createBtn = document.getElementById('create-assignment-btn');
    const mobileCreateBtn = document.getElementById('mobile-create-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const modal = document.getElementById('create-assignment-modal');
    const saveAssignmentBtn = document.getElementById('save-assignment-btn');

    function openModal() {
        modal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
    }

    function closeModal() {
        modal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    }

    createBtn.addEventListener('click', openModal);
    mobileCreateBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    saveAssignmentBtn.addEventListener('click', () => {
        event.preventDefault();
        // Retrieve form input values
        const title = document.getElementById('assignment-title').value;
        const classValue = document.getElementById('assignment-class').value;
        const due_date = document.getElementById('assignment-due-date').value;
        const dueTime = document.getElementById('assignment-due-time').value;
        const total_points = document.getElementById('assignment-points').value;
        const description = document.getElementById('assignment-description').value;
        const allowLateSubmissions = document.getElementById('allow-late-submissions');
        const enableAutomaticGrading = document.getElementById('enable-automatic-grading');

        let isValid = true;
        let errorMessage = '';

        if (!title) {
            isValid = false;
            errorMessage += 'Assignment title is required.\n';
        }
        if (!classValue) {
            isValid = false;
            errorMessage += 'Class selection is required.\n';
        }
        if (!due_date) {
            isValid = false;
            errorMessage += 'Due date is required.\n';
        }
        if (!dueTime) {
            isValid = false;
            errorMessage += 'Due time is required.\n';
        }
        if (!total_points || isNaN(total_points) || total_points <= 0) {
            isValid = false;
            errorMessage += 'Total points must be a positive number.\n';
        }
        if (!description) {
            isValid = false;
            errorMessage += 'Description is required.\n';
        }

        if (!isValid) {
            showNotification(errorMessage, 'un-success');
            // alert(errorMessage);
            return isValid;
        }

        // Perform any necessary actions with the form data
        let dataObject = {
            title: title,
            due_date: due_date,
            description: description,
            total_points: total_points,
            dueTime: dueTime,
            class_name: classValue
        }

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify(dataObject);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw
        };
        fetch(`http://localhost:3000/api/create-assignment`, requestOptions)
            .then(response => response.json())
            .then(result => {
                closeModal();
                if (result?.success) {
                    showNotification('Assignment created successfully!', 'success');
                    document.getElementById('assignment-form').reset();
                }
            }).catch(error => {
                console.log(error)
                showNotification('Somthing went wrong!', 'un-success');
            })
        // ✅ Clear the form
        // Here you would normally save the form data
        // For demo purposes, we'll just close the modal and show a notification
    });



});

// Notification function
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 ${type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} px-4 py-2 rounded-lg shadow-md z-50 animate-fade-in-out`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

document.addEventListener('DOMContentLoaded', renderAssignments);

document.addEventListener('DOMContentLoaded', function () {
    // const listViewButton = document.querySelector('button:contains("List View")');
    // const gridViewButton = document.querySelector('button:contains("Grid View")');
    const assignmentCardsContainer = document.getElementById('assignment-cards-container');

    // Ensure buttons are selected correctly
    const buttons = document.querySelectorAll('.flex.space-x-2 button');
    const listViewButton = buttons[0];
    const gridViewButton = buttons[1];

    listViewButton.addEventListener('click', function () {
        assignmentCardsContainer.classList.remove('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');
        assignmentCardsContainer.classList.add('flex', 'flex-col');
        listViewButton.classList.add('bg-indigo-600', 'text-white');
        gridViewButton.classList.remove('bg-indigo-600', 'text-white');
    });

    gridViewButton.addEventListener('click', function () {
        assignmentCardsContainer.classList.remove('flex', 'flex-col');
        assignmentCardsContainer.classList.add('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');
        gridViewButton.classList.add('bg-indigo-600', 'text-white');
        listViewButton.classList.remove('bg-indigo-600', 'text-white');
    });
});
