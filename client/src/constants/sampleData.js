// //


export const sampleChats = [
    {
        _id: "1",
        name: "Nik",
        avatar: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4tBH-CypkedhyKq-nXrfP---FgDomclzYng&s"],
        groupChat: false,
        members: ["1", "2", "3"],
    },
    {
        _id: "2",
        name: "Adi",
        avatar: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4tBH-CypkedhyKq-nXrfP---FgDomclzYng&s"],
        groupChat: false,
        members: ["1", "2", "3"],
    },
    {
        _id: "3",
        name: "Kanyo",
        avatar: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4tBH-CypkedhyKq-nXrfP---FgDomclzYng&s"],
        groupChat: false,
        members: ["1", "2", "3"],
    },
]


export const sampleUsers = [
    {
        _id: "1",
        name: "Nik",
        avatar: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4tBH-CypkedhyKq-nXrfP---FgDomclzYng&s"],
    },
    {
        _id: "2",
        name: "Adi",
        avatar: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4tBH-CypkedhyKq-nXrfP---FgDomclzYng&s"],
    },
    {
        _id: "3",
        name: "Kanyo",
        avatar: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4tBH-CypkedhyKq-nXrfP---FgDomclzYng&s"],
    },
]


export const sampleNotifications = [
    {
        _id: "1",
        sender: {
            name: "Nik",
            avatar: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4tBH-CypkedhyKq-nXrfP---FgDomclzYng&s"],
        }
    },
    {
        _id: "2",
        sender: {
            name: "Adi",
            avatar: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4tBH-CypkedhyKq-nXrfP---FgDomclzYng&s"],
        }
    },
    {
        _id: "3",
        sender: {
            name: "Kanyo",
            avatar: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4tBH-CypkedhyKq-nXrfP---FgDomclzYng&s"],
        }
    },
]




export const sampleMessage = [
    {
        attachments: [
            {
                public_id:"asdsad",
                url:"https://www.w3schools.com/howto/img_avatar.png"
            },
        ],
        content: "L*uda ka message hai",
        _id:"sfnasdfghjklh",
        sender:{
            _id:"user._id",
            name:"Chaman",
        },
        chat:"chatId",
        createdAt:"2024-02-12T10:41:30.630Z"
    },
    {
        attachments: [
            {
                public_id:"asdsad2",
                url:"https://www.w3schools.com/howto/img_avatar.png"
            },
        ],
        content: "L*uda ka message hai",
        _id:"sfnasdfghjtttklh",
        sender:{
            _id:"wertyuvdcxz",
            name:"Chaman2",
        },
        chat:"chatId",
        createdAt:"2024-02-12T10:41:30.630Z"
    },

]



export const dashboardData = {
  users: [
    {
        _id: "1",
        username:"nik@2003",
        name: "Nik",
        avatar: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4tBH-CypkedhyKq-nXrfP---FgDomclzYng&s"],
        groups: 5,
        friends: 20,
        members: ["1", "2", "3"],
    },
    {
        _id: "2",
        username:"adi@2003",
        name: "Adi",
        avatar: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4tBH-CypkedhyKq-nXrfP---FgDomclzYng&s"],
        groups: 10,
        friends: 25,
        members: ["1", "2", "3"],
    },
    {
        _id: "3",
        username:"kanyo@2004",
        name: "Kanyo",
        avatar: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4tBH-CypkedhyKq-nXrfP---FgDomclzYng&s"],
        groups: 15,
        friends: 30,
        members: ["1", "2", "3"],
    },
  ],


  chats: [
    {
        _id: "1",
        name: "Nik's Group",
        avatar: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4tBH-CypkedhyKq-nXrfP---FgDomclzYng&s"],
        groupChat: true,
        members: [
            {_id:"1", avatar:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4tBH-CypkedhyKq-nXrfP---FgDomclzYng&s"},
            {_id:"2", avatar:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4tBH-CypkedhyKq-nXrfP---FgDomclzYng&s"},
            {_id:"3", avatar:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4tBH-CypkedhyKq-nXrfP---FgDomclzYng&s"}
        ],
        totalMembers: 3,
        totalMessages: 20,
        creator: {
            name:"Nik",
            avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4tBH-CypkedhyKq-nXrfP---FgDomclzYng&s",
        },
    },
    {
        _id: "2",
        name: "Adi's Group",
        avatar: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4tBH-CypkedhyKq-nXrfP---FgDomclzYng&s"],
        groupChat: true,
        members: [
            {_id:"1", avatar:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4tBH-CypkedhyKq-nXrfP---FgDomclzYng&s"},
            {_id:"3", avatar:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4tBH-CypkedhyKq-nXrfP---FgDomclzYng&s"}
        ],
        totalMembers: 2,
        totalMessages: 35,
        creator: {
            name:"Adi",
            avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4tBH-CypkedhyKq-nXrfP---FgDomclzYng&s",
        },
    },
    {
        _id: "3",
        name: "Kanya's Group",
        avatar: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4tBH-CypkedhyKq-nXrfP---FgDomclzYng&s"],
        groupChat: true,
        members: [
            {_id:"1", avatar:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4tBH-CypkedhyKq-nXrfP---FgDomclzYng&s"},
            {_id:"2", avatar:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4tBH-CypkedhyKq-nXrfP---FgDomclzYng&s"},
            {_id:"3", avatar:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4tBH-CypkedhyKq-nXrfP---FgDomclzYng&s"}
        ],
        totalMembers: 3,
        totalMessages: 30,
        creator: {
            name:"Kanyo",
            avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4tBH-CypkedhyKq-nXrfP---FgDomclzYng&s",
        },
    },
  ],


  messages: [
    {
        _id: "sfnasdfghjtttklhF",
        chat: "chatId",
        sender: {
            _id: "user._id",
            name:"Nik",
            avatar:"https://www.w3schools.com/howto/img_avatar.png",
        },
        groupChat:false,
        content: "L*usa ka Message hai!",
        attachments: [],
        createdAt: "2024-10-12T10:41:30.630Z",
    },

    {
        _id:"sfnasdfjttklh",
        chat:"chatId",
        sender:{
            _id:"user._id",
            name:"Chaman2",
            avatar:"https://www.w3schools.com/howto/img_avatar.png",
        },
        groupChat:true,
        content: "L*uda ka message hai",
        attachments: [
            {
                public_id:"asdsad2",
                url:"https://www.w3schools.com/howto/img_avatar.png"
            },
        ],
        createdAt:"2024-02-12T10:41:30.630Z",
    },
  ],


}

