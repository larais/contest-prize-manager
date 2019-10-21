import { IProject } from './data/Model';
import { Repository } from './data/Repository';

let projectTestRepository: Repository<IProject> = new Repository<IProject>("project_test");

beforeEach(() => {
  return projectTestRepository.clear();
});

it('adds a project', () => {
  let project = {
    _id: "",
    title: "test",
    description: "",
    participants: []
  } as IProject;

  return projectTestRepository.add(project)
    .then(() => {
        expect(project._id).not.toBe("");
    });
});

it('updates a project', () => {
  let project = {
    _id: "",
    title: "test",
    description: "",
    participants: []
  } as IProject;
  
  let add = projectTestRepository.add(project)
    .then(() => {
        project.title = "updated title";

        let update = projectTestRepository.update(project)
          .then(() => {
              expect(project.title).toBe("updated title");
          });

          return Promise.all([update]);
    });

    return Promise.all([add]);
});

it('gets a project', () => {
  let project = {
    _id: "",
    title: "test",
    description: "",
    participants: []
  } as IProject;
  
  let add = projectTestRepository.add(project)
    .then(() => {

        let update = projectTestRepository.get(project._id)
          .then((p) => {
              expect(p._id).toBe(project._id);
          });

          return Promise.all([update]);
    });

    return Promise.all([add]);
});

it('removes a project', () => {
  let project = {
    _id: "",
    title: "test",
    description: "",
    participants: []
  } as IProject;
  
  let add = projectTestRepository.add(project)
    .then(() => {
        let remove = projectTestRepository.remove(project._id)
          .then(() => {
            let get = projectTestRepository.get(project._id)
              .catch((e) => {
                expect(e.error).toBeTruthy();
              });
  
            return Promise.all([get]);
          });

          return Promise.all([remove]);
    });

    return Promise.all([add]);
});

it('gets all projects', () => {
  let project1 = {
    _id: "",
    title: "test1",
    description: "",
    participants: []
  } as IProject;

  let project2 = {
    _id: "",
    title: "test2",
    description: "",
    participants: []
  } as IProject;
  
  let add1 = projectTestRepository.add(project1);
  let add2 = projectTestRepository.add(project2);

    return Promise.all([add1, add2])
      .then(() => {
        let update = projectTestRepository.getAll()
          .then((projects) => {
              expect(projects.length).toBe(2);
              expect(projects[0].title).toContain("test");
              expect(projects[1].title).toContain("test");
          });

          return Promise.all([update]);
      });
});