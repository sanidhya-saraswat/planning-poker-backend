let Project = require("../../models/project")

module.exports.createProject = (project) => {
  project = project || { id: 1, name: "UMS" }
  return Project.create(project)
}

module.exports.createProjects = (projects) => {
  projects = projects.length != 0 ? projects : [{ id: 1, name: "UMS" }, { id: 2, name: "CMS" }]
  return Project.create(projects)
}
module.exports.deleteAllProjects=()=>{
  return Project.deleteMany({})
}

module.exports.getProjects=(condition={})=>{
return Project.findMany(condition)
}