const mongoose = require('mongoose');

const Task = require('../../models/dashboard/task');
const Subtask = require('../../models/dashboard/subtask');

const dashboardController = require('../../controllers/dashboard/dashboard');

exports.get_tasks = async (req, res, next) => {
  try {
    const uid = req.userData._id;

    const filterByStatus = req.query.statusFilter;
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;

    // console.log(status);
    let tasks;
    let getTaskQuery;
    let totalTasks = 0;

    if (filterByStatus &&
       (filterByStatus === 'PENDING' || filterByStatus === 'COMPLETE')) {

      getTaskQuery = Task.find({user: uid, status: filterByStatus}).sort("-createdAt");
      totalTasks = await Task.count({status: filterByStatus}).exec();

    } else {

      getTaskQuery = Task.find({user: uid}).sort("-createdAt");
      totalTasks = await Task.count().exec();

    }

    // console.log(pageSize);
    // console.log(currentPage);

    if (pageSize && currentPage) {
      getTaskQuery
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    }

    getTaskQuery.populate('subtasks', '_id title parent date details status');



    tasks = await getTaskQuery.exec();

    return res.status(200).json({
      tasks: tasks.map(task => {
        return {
          id: task._id,
          userId: task.user,
          title: task.title,
          details: task.details,
          parent: task.parent,
          subtasks: task.subtasks.map(st => {
            return {
              id: st._id,
              title: st.title,
              parent: st.parent,
              date: st.date,
              details: st.details,
              status: st.status
            }
          }),
          date: task.date,
          status: task.status
        }
      }),
      totalTasks: totalTasks
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({status: 500,
      message: 'Failed Retrieving Task List'});
  }
}

exports.get_task = async (req, res, next) => {
  try {
    const taskId = req.params.taskId;

    const task = await Task.findOne({_id: taskId})
      .populate('subtasks', '_id title details parent date status')
      .exec();

    res.status(200).json({
      task: {
        id: task._id,
        userId: task.user,
        title: task.title,
        details: task.details,
        subtasks: task.subtasks,
        date: task.date,
        status: task.status
      }
    });

  } catch (error) {
    res.status(500).json({status: 500,
      message: 'Failed Getting Task'});
  }

};

exports.edit_task = async (req, res, next) => {
  try {
    const taskId = req.params.taskId;
    const updatedSubtaskList = [];
    await Task.findOne({_id: taskId})
      .exec();


    let newTask = new Task({
      _id: taskId,
      title: req.body.title,
      user: req.body.user,
      date: req.body.date,
      details: req.body.details,
      subtasks: req.body.subtasks,
      status: req.body.status
    });

    const subtasks = req.body.subtasks;

    for (let i = 0; i < subtasks.length; i++) {
      const st = subtasks[i];

      const newSt = new Subtask({
        _id: st.id ? st.id : new mongoose.Types.ObjectId(),
        ...st
      });

      if (!st.id) {
        await newSt.save();
        updatedSubtaskList.push(newSt);
      } else {
        updatedSubtaskList.push(st);
      }

    }

    newTask.subtasks = updatedSubtaskList.map(st => st._id);

    await Task.updateOne({_id: taskId}, {$set: newTask})
      .exec();

    newTask.subtasks = updatedSubtaskList;

    res.status(200).json({
      newTask: {
        id: newTask._id,
        title: newTask.title,
        user: newTask.user,
        date: newTask.date,
        details: newTask.details,
        subtasks: newTask.subtasks.map(st => {
          return {
            id: st._id,
            title: st.title,
            date: st.date,
            status: st.status,
            parent: st.parent,
            details: st.details
          }
        }),
        status: newTask.status
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({status: 500,
      message: 'Failed Editing Task'});
  }

};

exports.delete_task = async (req, res, next) => {
  try {
    const taskId = req.params.taskId;
    const userId = req.userData._id;
    const task = await Task.findById(taskId).exec();

    const subtasks = task.subtasks;

    const updateResult = await Promise.all([
      Subtask.deleteMany({_id: {'$in': subtasks}}).exec(),
      Task.deleteOne({_id: taskId}).exec(),
      Task.countDocuments().exec()
    ]);


    const subtaskResult = updateResult[0];
    const taskResult = updateResult[1];
    const dashboardTaskResult = await dashboardController.update_dashboard_tasks(userId, taskId, '$pull')
    const totalTasks = updateResult[3];

    if (subtaskResult && taskResult && dashboardTaskResult
      && subtaskResult.ok > 0
      && taskResult.ok > 0
      && dashboardTaskResult.nModified > 0) {
        res.status(200).json({message: 'deleted successfully', totalTasks: totalTasks});
    }

  } catch (error) {
    console.log(error);
    res.status(error.status).json({status: 500,
      message: 'Failed Deleting Task'});
  }
};

exports.add_task = async (req, res, next) => {
  try {
    const userId = req.userData._id;

    const task = new Task({
      _id: new mongoose.Types.ObjectId(),
      user: userId,
      ...req.body
    });

    const result = await task.save();

    const totalTasks = await Task.count().exec();
    await dashboardController.update_dashboard_tasks(userId, task._id, '$push');

    res.status(200).json({
      task: {
        id: result._id,
        title: result.title,
        user: result.user,
        date: result.date,
        details: result.details,
        subtasks: result.subtasks,
        status: result.status
      },
      totalTasks: totalTasks
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({status: 500,
      message: 'Failed Adding Task'});
  }

};
