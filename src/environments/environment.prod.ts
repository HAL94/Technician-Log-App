export const environment = {
  production: true,
  AUTH_URLS: {
    signup: 'user/signup/',
    login: 'user/login/'
  },
  DASHBOARD_URLS: {
    getDashboard: 'dashboard/'
  },
  TASKLIST_URLS: {
    getTaskList: 'dashboard/task/',
    addTask: 'dashboard/task/add/',
    editTask: 'dashboard/task/edit/',
    deleteTask: 'dashboard/task/delete/',
    editSubtask: 'dashboard/subtask/edit/',
    deleteSubtask: 'dashboard/subtask/delete/'
  },
  TECHENTRY_URLS: {
    getTechentries: 'techentry/',
    createTechentry: 'techentry/',
    getTechentry: 'techentry/',
    updateTechentry: 'techentry/',
    deleteTechentry: 'techentry/'
  },
  USER_URLS: {
    setUser: 'user/user-profile/',
    updateUser: 'user/user-profile/',
    updateUserProfile: 'user/user-profile/upload/'
  }
};
