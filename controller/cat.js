var petfinder = require("@petfinder/petfinder-js");
var client = new petfinder.Client({apiKey: "Z4hOUq0YlGKIO3NQKvmBwGNIse6qEAY4KpNEbkaFsxkXO5zsN8", secret: "9MeWNNmCTIKYufj4tgtm3Iypr5mS8WzQ4MaddK35"});
const axios = require("axios");
const { Cat } = require("../models")

class CatController {
    // static getPhotoCats(req, res, next) {
    //     axios({
    //         method: "GET",
    //         url: "https://api.thecatapi.com/v1/images/search",
    //         params: {
    //             limit: 10,
    //             order: "DESC"
    //         },
    //         headers: {
    //             "x-api-key": "39d99eae-9d1d-4419-9803-bf565658ae6b"
    //         }
    //     })
    //         .then(response => {
    //             res.status(200).json(response.data)
    //         })
    //         .catch(err => {
    //             next(err)
    //         })
    // }

    // static getCatFacts(req, res, next) {
    //     axios({
    //         url: "https://cat-fact.herokuapp.com/facts/random",
    //         method: "GET",
    //         params: {
    //             "animal_type": "cat",
    //             amount: 10
    //         }
    //     })
    //         .then(response => {
    //             res.status(200).json(response.data)
    //         })
    //         .catch(err => {
    //             next(err)
    //         })
    // }

    // Tambah Baru
    static getPetFinderById(req, res, next) {
        const id = +req.params.id
        // console.log(id)
        
        let cat = null
        client.animal.search({type: "Cat"})
            .then(function (response) {
                for (let i = 0; i < response.data.animals.length; i++) {
                        if(response.data.animals[i].id === id) {
                            cat = response.data.animals[i]
                            // console.log(cat)
                            res.status(200).json(cat)
                        }
                    }
                })
            .catch(function (error) {
                next(error)
            });
    }

    static getPetFinder(req, res,next) {
        client.animal.search({limit: 10, type: "Cat"})
            .then(function (response) {
                res.status(200).json(response.data.animals)
                // res.send(response.data.animals)
            })
            .catch(function (err) {
                next(err)
            });
    }

    static adoptCats(req, res, next) {
        const id = +req.params.id
        const idUser = req.userLogin.id
        // console.log(id)
        
        client.animal.search({type: "Cat"})
        .then(function (response) {
            let cat = null
            for (let i = 0; i < response.data.animals.length; i++) {
                    if(response.data.animals[i].id === id) {
                        cat = response.data.animals[i]
                        // console.log(cat)
                        return cat
                    }
                }
            })
            .then(response => {
                // console.log(response)
                let catAdopt = {
                    name: response.name,
                    status: response.status,
                    type: response.type,
                    age: response.age,
                    gender: response.gender,
                    primaryBreeds: response.breeds.primary,
                    secondaryBreeds: response.breeds.secondary,
                    mixedBreeds: response.breeds.mixed,
                    size: response.size,
                    email: response.contact.email,
                    phone: response.contact.phone,
                    address: response.contact.address.address1,
                    city: response.contact.address.city,
                    country: response.contact.address.country,
                    UserId: idUser
                }
                return Cat.create(catAdopt)
            })
            .then(response => {
                res.status(201).json({msg: "SuccessCreated"})
            })
            .catch(function (error) {
                next(error)
            });
    }

    static getCatAdopt(req, res, next) {
        Cat.findAll()
            .then(data => {
                if (data) {
                    res.status(200).json(data)
                } else {
                    throw{
                        status: 404,
                        message: "DataNotFound"
                    }
                }
            })
            .catch(err => {
                next(err)
                // res.status(500).json(err)
            })
    }

    static getCatInfo(req, res, next) {
        const id = +req.params.id
        Cat.findOne({where: { id }})
            .then(data => {
                if(data) {
                    res.status(200).json(data)
                } else {
                    throw{
                        status: 404,
                        message: "DataNotFound"
                    }
                }

            })
            .catch(err => {
                next(err)
                // res.status(500).json(err)
            })
    }

    static deleteCats(req, res, next) {
        const id = +req.params.id
        Cat.destroy({where: { id }})
            .then(data => {
                res.status(200).json("DataDeleted")
            })
            .catch(err => {
                next(err)
            })
    }

    static getCatsFact(req, res, next) {
        let arr = []
        axios({
            method: "GET",
            url: "https://api.thecatapi.com/v1/images/search",
            params: {
                limit: 10,
                order: "DESC"
            },
            headers: {
                "x-api-key": "39d99eae-9d1d-4419-9803-bf565658ae6b"
            }
        })
            .then(response => {
                for (let i = 0; i < response.data.length; i++) {
                    let temp = {
                        url : response.data[i].url
                    }
                    arr.push(temp)
                }
                return axios({
                    url: "https://cat-fact.herokuapp.com/facts/random",
                    method: "GET",
                    params: {
                        "animal_type": "cat",
                        amount: 10
                    }
                })
            })
            .then(response => {
                for (let i = 0; i < arr.length; i++) {
                    arr[i].text = response.data[i].text
                }
                res.status(200).json(arr)
            })
            .catch(err => {
                next(err)
            })
    }
}

module.exports = CatController