import React, { useState, useEffect } from 'react';

const AssignmentsDashboard = () => {
    const [assignments, setAssignments] = useState([]);
    const [analyticsData, setAnalyticsData] = useState({});
    const [studentsNeedingAttention, setStudentsNeedingAttention] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const classFilter = document.getElementById('classFilter');
        const sortFilter = document.getElementById('sortFilter');
    
        const handleFilterChange = () => {
            const classValue = classFilter.value !== 'all' ? classFilter.value : undefined;
            const sortValue = sortFilter.value !== 'dueDate' ? sortFilter.value : undefined;
            renderAssignments({ class: classValue, sort: sortValue });
        };
    
        classFilter.addEventListener('change', handleFilterChange);
        sortFilter.addEventListener('change', handleFilterChange);
    
        handleFilterChange();
        // Cleanup event listeners on component unmount
        return () => {
            classFilter.removeEventListener('change', handleFilterChange);
            sortFilter.removeEventListener('change', handleFilterChange);
        };
    }, []);
    
    const handleTabClick = (assignmentType) => {
        const classFilter = document.getElementById('classFilter');
        const sortFilter = document.getElementById('sortFilter');
    
        const classValue = classFilter.value !== 'all' ? classFilter.value : undefined;
        const sortValue = sortFilter.value !== 'dueDate' ? sortFilter.value : undefined;
    
        renderAssignments({ class: classValue, sort: sortValue, assignment_type: assignmentType });
    };
    

    const renderAssignments = (filter = {}) => {
      
        let params = '';
        if (filter?.class) params = `?class=${filter?.class}`;
        if (!filter?.class && filter?.sort) params = `?sort=${filter?.sort}`;
        if (filter?.class && filter?.sort) params += `&sort=${filter?.sort}`;
        if ( params.length > 1 && filter?.assignment_type) params += `?assignment_type=${filter?.assignment_type}`;
        if ( params.length == 0 && filter?.assignment_type) params += `?assignment_type=${filter?.assignment_type}`;
        console.log(`http://localhost:3000/api/dashboard${params}`);
       
        fetch(`http://localhost:3000/api/dashboard${params}`)
            .then(response => response.json())
            .then(result => {
                console.log("WELCOME:::::")
                if (result.success) {
                    setAssignments(result.data.cardData);
                    setAnalyticsData(result.data.analyticsData);
                    setStudentsNeedingAttention(result.data.listStudents);
                }
            })
            .catch(error => console.log('error', error));
    };

    const handleCreateAssignment = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSaveAssignment = (event) => {
        event.preventDefault();
        // Retrieve form input values
        const title = document.getElementById('assignment-title').value;
        const classValue = document.getElementById('assignment-class').value;
        const due_date = document.getElementById('assignment-due-date').value;
        const dueTime = document.getElementById('assignment-due-time').value;
        const total_points = document.getElementById('assignment-points').value;
        const description = document.getElementById('assignment-description').value;

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
            return;
        }

        const dataObject = {
            title,
            due_date,
            description,
            total_points,
            dueTime,
            class_name: classValue
        };

        fetch(`http://localhost:3000/api/create-assignment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataObject)
        })
            .then(response => response.json())
            .then(result => {
                handleCloseModal();
                if (result?.success) {
                    showNotification('Assignment created successfully!', 'success');
                    document.getElementById('assignment-form').reset();
                }
            })
            .catch(error => {
                console.log(error);
                showNotification('Something went wrong!', 'un-success');
            });
    };

    const showNotification = (message, type) => {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 ${type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} px-4 py-2 rounded-lg shadow-md z-50 animate-fade-in-out`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 3000);
    };

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-lg p-4 hidden md:block">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Menu</h2>
                <nav className="space-y-2">
                    <a href="#" className="block px-4 py-2 rounded text-gray-700 hover:bg-gray-100">Dashboard</a>
                    <a href="#" className="block px-4 py-2 rounded text-indigo-600 bg-indigo-50 font-medium">Assignments</a>
                    <a href="#" className="block px-4 py-2 rounded text-gray-700 hover:bg-gray-100">Grades</a>
                    <a href="#" className="block px-4 py-2 rounded text-gray-700 hover:bg-gray-100">Students</a>
                    <a href="#" className="block px-4 py-2 rounded text-gray-700 hover:bg-gray-100">Settings</a>
                </nav>
            </aside>

            {/* Main content */}
            <main className="flex-1">
                <div className="max-w-7xl mx-auto p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold">Assignments</h1>
                        <button
                            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                            onClick={handleCreateAssignment}
                        >
                            Create Assignment
                        </button>
                    </div>

                    {/* Filter Tabs */}
                    <div className="mb-4 border-b border-gray-200">
                        <nav className="flex space-x-4" aria-label="Tabs">
                            <a href="#" onClick={() => handleTabClick('current')} className="tab-active px-3 py-2 font-medium text-sm text-indigo-600 border-b-2 border-indigo-600 tab" data-class="all">Current Assignments</a>
                            <a href="#" onClick={() => handleTabClick('upcoming')} className="px-3 py-2 font-medium text-sm text-gray-500 hover:text-gray-700 tab" data-class="upcoming">Upcoming Assignments</a>
                            <a href="#" onClick={() => handleTabClick('past')} className="px-3 py-2 font-medium text-sm text-gray-500 hover:text-gray-700 tab" data-class="past">Past Assignments</a>
                        </nav>
                    </div>

                    {/* Filter section */}
                    <div className="flex flex-wrap gap-4 mb-6">
                        <select className="px-3 py-2 rounded border text-sm bg-white sort-options" id="classFilter">
                            <option value="all">All Classes</option>
                            <option value="science101">Science 101</option>
                            <option value="biology202">Biology 202</option>
                            <option value="chemistry101">Chemistry 101</option>
                        </select>
                        <select className="px-3 py-2 rounded border text-sm bg-white sort-options" id="sortFilter">
                            <option value="dueDate">Sort: Due Date</option>
                            <option value="createdAt">Sort: Recently Created</option>
                            <option value="completion">Sort: Completion Rate</option>
                            <option value="alphabetical">Sort: Alphabetical</option>
                        </select>
                        <div className="flex space-x-2">
                            <button className="px-3 py-2 text-sm rounded bg-indigo-600 text-gray-500">List View</button>
                            <button className="px-3 py-2 text-sm rounded text-gray-500">Grid View</button>
                        </div>
                    </div>

                    {/* Assignment Cards */}
                    <div id="assignment-cards-container" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                        {assignments.map((assignment, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden assignment-card" data-class={assignment.class} data-duedate={assignment.dueDate}>
                                <div className="p-5">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="flex items-center">
                                                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">{assignment.class}</span>
                                                <span className="ml-2 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">{assignment.status}</span>
                                            </div>
                                            <h3 className="mt-2 text-lg font-semibold text-gray-900">{assignment.title}</h3>
                                        </div>
                                    </div>
                                    <div className="mt-4 text-sm text-gray-500">
                                        <div className="flex items-center">
                                            <i className="ri-calendar-line mr-1"></i>
                                            Due: {assignment.dueDate}
                                        </div>
                                        <div className="mt-1 flex items-center">
                                            <i className="ri-user-line mr-1"></i>
                                            {assignment.studentsAssigned} students assigned
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <div className="flex justify-between text-xs text-gray-700">
                                            <span>Submission Status</span>
                                            <span>{assignment.submissionStatus}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                            <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${assignment.submissionProgress}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Analytics Section */}
                    <div className="bg-white rounded-lg shadow-sm mb-10">
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-gray-50 p-4 rounded">
                                    <p className="text-sm text-gray-500">Total Assignments</p>
                                    <p id="total-assignments" className="text-xl font-semibold">{analyticsData.total_assignments}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded">
                                    <p className="text-sm text-gray-500">Avg. Completion Rate</p>
                                    <p id="avg-completion-rate" className="text-xl font-semibold">{analyticsData.avg_completion_rate}%</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded">
                                    <p className="text-sm text-gray-500">Avg. Grade</p>
                                    <p id="avg-grade" className="text-xl font-semibold">{analyticsData.avg_grade}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Students Needing Attention Section */}
                    <div className="bg-white rounded-lg shadow-sm">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">Students Needing Attention</h2>
                                <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">View All</a>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issue</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assignments</th>
                                            {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th> */}
                                        </tr>
                                    </thead>
                                    <tbody id="attention-students-body" className="bg-white divide-y divide-gray-200">
                                        {studentsNeedingAttention.map((student, index) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4">{student.name}<br /><span className="text-sm text-gray-500">{student.course}</span></td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-xs bg-white px-2 py-1 rounded-full`}>{student.issue}</span>
                                                </td>
                                                <td className="px-6 py-4">{student.detail}<br /><span className="text-xs text-gray-500">{student.subDetail}</span></td>
                                                {/* <td className="px-6 py-4 space-x-2">
                                                    {student.actions.map((action, i) => {
                                                        const colorClass = action === "Message" ? "text-indigo-600 font-medium" : "text-gray-500";
                                                        return <button key={i} className={`text-sm ${colorClass}`}>{action}</button>;
                                                    })}
                                                </td> */}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Create Assignment Modal */}
                    {showModal && (
                        <div id="create-assignment-modal" className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900">Create New Assignment</h3>
                                    <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-500">
                                        <div className="w-6 h-6 flex items-center justify-center">
                                            <i className="ri-close-line"></i>
                                        </div>
                                    </button>
                                </div>
                                <div className="px-6 py-4">
                                    <form id="assignment-form" onSubmit={handleSaveAssignment}>
                                        <div className="space-y-4">
                                            <div>
                                                <label htmlFor="assignment-title" className="block text-sm font-medium text-gray-700 mb-1">Assignment Title</label>
                                                <input type="text" id="assignment-title" className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm" placeholder="Enter assignment title" />
                                            </div>
                                            <div>
                                                <label htmlFor="assignment-class" className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                                                <div className="relative">
                                                    <select id="assignment-class" className="block w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm appearance-none bg-white">
                                                        <option value="science101">Science 101</option>
                                                        <option value="biology202">Biology 202</option>
                                                        <option value="chemistry101">Chemistry 101</option>
                                                    </select>
                                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                        <div className="w-4 h-4 flex items-center justify-center text-gray-400">
                                                            <i className="ri-arrow-down-s-line"></i>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="assignment-due-date" className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                                                    <input type="date" id="assignment-due-date" className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm" />
                                                </div>
                                                <div>
                                                    <label htmlFor="assignment-due-time" className="block text-sm font-medium text-gray-700 mb-1">Due Time</label>
                                                    <input type="time" id="assignment-due-time" className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm" />
                                                </div>
                                            </div>
                                            <div>
                                                <label htmlFor="assignment-points" className="block text-sm font-medium text-gray-700 mb-1">Total Points</label>
                                                <input type="number" id="assignment-points" className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm" placeholder="Enter total points" min="0" />
                                            </div>
                                            <div>
                                                <label htmlFor="assignment-description" className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
                                                <textarea id="assignment-description" rows="4" className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm" placeholder="Enter assignment instructions and requirements"></textarea>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Attachment</label>
                                                <div className="flex items-center justify-center w-full">
                                                    <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                            <div className="w-10 h-10 mb-3 flex items-center justify-center text-gray-400">
                                                                <i className="ri-upload-cloud-line ri-2x"></i>
                                                            </div>
                                                            <p className="mb-2 text-sm text-gray-500">Click to upload or drag and drop</p>
                                                            <p className="text-xs text-gray-500">PDF, DOCX, or images (max. 10MB)</p>
                                                        </div>
                                                        <input id="file-upload" type="file" className="hidden" />
                                                    </label>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="flex items-center">
                                                    <input type="checkbox" className="mr-2" />
                                                    <span className="text-sm text-gray-700">Allow late submissions</span>
                                                </label>
                                            </div>
                                            <div>
                                                <label className="flex items-center">
                                                    <input type="checkbox" className="mr-2" />
                                                    <span className="text-sm text-gray-700">Enable automatic grading</span>
                                                </label>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                                    <button onClick={handleCloseModal} className="px-4 py-2 border border-gray-300 rounded-button text-sm font-medium text-gray-700 hover:bg-gray-50 whitespace-nowrap">Cancel</button>
                                    <button onClick={handleSaveAssignment} className="px-4 py-2 bg-primary text-white rounded-button text-sm font-medium bg-indigo-700 whitespace-nowrap">Create Assignment</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Mobile Create Assignment Button */}
                    <div className="md:hidden fixed right-4 bottom-20 z-20">
                        <button onClick={handleCreateAssignment} className="w-14 h-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center">
                            <div className="w-6 h-6 flex items-center justify-center">
                                <i className="ri-add-line ri-lg"></i>
                            </div>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AssignmentsDashboard;