const mockData = {
    participants: {
        "participant-1": {id: "participant-1", firstName: "Claire", lastName: "Kaiser", dateOfBirth: "1998-05-01"},
        "participant-2": {id: "participant-2", firstName: "Jean", lastName: "Schmitt", dateOfBirth: "1999-03-15"},
        "participant-3": {id: "participant-3", firstName: "Antoine", lastName: "Weber", dateOfBirth: "1997-12-29"},
        "participant-4": {id: "participant-4", firstName: "Marie", lastName: "Hansen", dateOfBirth: "2000-01-20"},
        "participant-5": {id: "participant-5", firstName: "Lisa", lastName: "Fischer", dateOfBirth: "2000-07-12"},
        "participant-6": {id: "participant-6", firstName: "Emma", lastName: "Fischer", dateOfBirth: "2000-06-01"}
    },
    projects: {
        "project-1": {id: "project-1", title: "Project A", participantIds: ["participant-1"]},
        "project-2": {id: "project-2", title: "Project B", participantIds: ["participant-2", "participant-3"]},
        "project-3": {id: "project-3", title: "Project C", participantIds: ["participant-4"]},
        "project-4": {id: "project-4", title: "Project D", participantIds: ["participant-5", "participant-6"]}
    },
    prizes: {
        "prize-1": {id:"prize-1", title: "Prize 1", description: "", capacity: 3, minimumAge: "", attributedToProjectIds: ["project-1"]},
        "prize-2": {id:"prize-2", title: "Prize 2", description: "", capacity: 5, minimumAge: "", attributedToProjectIds: ["project-2"]},
        "prize-3": {id:"prize-3", title: "Prize 3", description: "", capacity: 10, minimumAge: "", attributedToProjectIds: ["project-3", "project-4"]},
        "prize-4": {id:"prize-4", title: "Prize 4", description: "", capacity: 2, minimumAge: "", attributedToProjectIds: []}
    },
    prizesOrder: ["prize-1", "prize-2", "prize-3", "prize-4"]

};

export default mockData;